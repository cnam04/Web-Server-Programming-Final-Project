import type {
    Attempt,
    Climb,
    ClimbStyle,
    Grade,
    IndoorClimb,
    IndoorColor,
    OutdoorClimb,
    Quality,
    Session,
    User,
    UserMetrics,
    DbUserRow,
    DbSessionRow,
    DbClimbRow,
    DbSessionWithClimbsRow,
    UpdateUserInput,
} from "../types"
import { PagingRequest } from "../types/dataEnvelopes"
import { connect } from "./supabase"

import {
    calculateSessionsPerWeek,
    calculateClimbsPerWeek,
    calculateAverageQuality,
    calculateAverageSessionDuration,
    calculateAlltimeDuration,
    isRopeClimb,
    isBoulderClimb,
    getGradeScale,
    calculateAverageGrade,
    calculateTopGrade,
} from "./utils/userHelpers"

import {
    toDomainClimb,
    toDomainSession,
    toDomainUser,
    toDbInsertUser,
    toDbUpdateUser,
} from "./utils/dbHelpers"

export const TABLE_NAME = "users"
export const SESSIONS_TABLE = "sessions"
export const CLIMBS_TABLE = "climbs"




export async function getAll(params: PagingRequest) {
    const db = connect()

    let query = db.from(TABLE_NAME).select("*", { count: "estimated" })

    if (params?.search) {
        query = query.or(
            `username.ilike.%${params.search}%,email.ilike.%${params.search}%`,
        )
    }
    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending })
    }

    const page = Number(params?.page) || 1
    const pageSize = Number(params?.pageSize) || 10
    const start = (page - 1) * pageSize
    query = query.range(start, start + pageSize - 1)

    const result = await query
    if (result.error) throw result.error

    const rows = (result.data ?? []) as DbUserRow[]
    const list = rows.map(toDomainUser)
    const count = result.count ?? 0

    return { list, count }
}

export async function getById(id: number) {
    const db = connect()

    const result = await db.from(TABLE_NAME).select("*").eq("id", id).single()
    if (result.error) {
        if (result.status === 404) return null
        throw result.error
    }
    return toDomainUser(result.data as DbUserRow)
}

export async function create(data: Omit<User, "id">) {
    const db = connect()

    const insertPayload = toDbInsertUser(data)
    const result = await db.from(TABLE_NAME).insert(insertPayload).select().single()

    if (result.error) throw result.error

    return toDomainUser(result.data as DbUserRow)
}


export async function update(id: number, item: UpdateUserInput) {
    const db = connect()
    const updatePayload = toDbUpdateUser(item)

    const result = await db
    .from(TABLE_NAME)
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single()
    if (result.error) {
        throw result.error
    }
    return toDomainUser(result.data as DbUserRow)
}

export async function deleteById(id: number) {
    const db = connect()

    const result = await db.from(TABLE_NAME).delete().eq("id", id)
    const deletedCount = result.count ?? 0
    if (deletedCount === 0) {
        const error = new Error("User not found") as Error & { status?: number }
        error.status = 404
        throw error
    }
    if (result.error) {
        throw result.error
    }

    return deletedCount
}

// choosing to put this in the user api since it's related to the user
export async function getUserSessions(userId: number) {
    const db = connect()

    const result = await db
        .from(SESSIONS_TABLE)
        .select("*, " + CLIMBS_TABLE + "(*)")
        .eq("user_id", userId)
    if (result.error) {
        throw result.error
    }

    const sessions = (result.data ?? []).map((row) => {
        const sessionRow = row as DbSessionWithClimbsRow
        const climbs = (sessionRow.climbs ?? []).map(toDomainClimb)
        return toDomainSession(sessionRow, climbs)
    })

    return sessions
}
export async function getUserMetrics(userId: number){
    const sessionsData = await getUserSessions(userId)
    const sessions = sessionsData ?? []
    const climbs = sessions.flatMap(session => session.climbs ?? [])
    
    const metrics: UserMetrics = {
        sessionsPerWeek: calculateSessionsPerWeek(sessions),
        climbsPerWeek: calculateClimbsPerWeek(sessions),
        averageQuality: calculateAverageQuality(climbs),
        alltimeSessions: sessions.length,
        alltimeClimbs: climbs.length,
        avgSessionDuration: calculateAverageSessionDuration(sessions),
        alltimeDuration: calculateAlltimeDuration(sessions),
        avgRopeGrade: calculateAverageGrade(climbs.filter(isRopeClimb)),
        avgBoulderGrade: calculateAverageGrade(climbs.filter(isBoulderClimb)),
        topRopeGrade: calculateTopGrade(climbs.filter(isRopeClimb)),
        topBoulderGrade: calculateTopGrade(climbs.filter(isBoulderClimb)),
    }
    return metrics
}



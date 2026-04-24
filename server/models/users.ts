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
} from "../types"
import { PagingRequest } from "../types/dataEnvelopes"
import { connect } from "./supabase"

export const TABLE_NAME = "users"
export const SESSIONS_TABLE = "sessions"
export const CLIMBS_TABLE = "climbs"


function toDomainClimb(row: DbClimbRow) {
    const base = {
        id: row.id,
        sessionId: row.session_id,
        grade: row.grade as Grade,
        style: row.style as ClimbStyle,
        attempt: row.attempt as Attempt,
        quality: row.quality as Quality,
        comment: row.comment,
    }
    if (row.color) {
        return {
            ...base,
            color: row.color as IndoorColor,
        } as IndoorClimb
    } else {
        return {
            ...base,
            name: row.name ?? "",
        } as OutdoorClimb
    }
}
 
// Move this to session model when implemented
function toDomainSession(row: DbSessionRow, climbs: Climb[]) {
    return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        date: row.date,
        location: row.location,
        type: row.type as "indoor" | "outdoor",
        duration: row.duration,
        feeling: row.feeling as 1 | 2 | 3 | 4 | 5,
        notes: row.notes,
        climbs: climbs,
    }
}
type UpdateUserInput = Partial<Omit<User, "id" | "friendIds">>

// convert snake_case db row to camelCase domain user
function toDomainUser(row: DbUserRow): User {
    return {
        id: row.id,
        username: row.username,
        email: row.email ?? undefined,
        imageLink: row.image_link ?? undefined,
        isAdmin: row.is_admin,
        friendIds: [],
    }
}
// convert camelCase to snake_case and remove undefined values for db insertion
function toDbInsertUser(input: Omit<User, "id">) {
    return {
        username: input.username,
        email: input.email ?? null,
        image_link: input.imageLink ?? null,
        is_admin: input.isAdmin,
    }
}

function toDbUpdateUser(input: UpdateUserInput) {
    const updatePayload: {
        username?: string
        email?: string | null
        image_link?: string | null
        is_admin?: boolean
    } = {}

    if (input.username !== undefined) updatePayload.username = input.username
    if (input.email !== undefined) updatePayload.email = input.email ?? null
    if (input.imageLink !== undefined) {
        updatePayload.image_link = input.imageLink ?? null
    }
    if (input.isAdmin !== undefined) updatePayload.is_admin = input.isAdmin

    return updatePayload
}

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


//  HELPER FUNCTIONS FOR METRICS CALCULATION
// ---------------------------------------------------
const OUTDOOR_GRADES: Grade[] = [
    "5.5",
    "5.6",
    "5.7",
    "5.8",
    "5.9",
    "5.10a",
    "5.10b",
    "5.10c",
    "5.10d",
    "5.11a",
    "5.11b",
    "5.11c",
    "5.11d",
    "5.12a",
    "5.12b",
    "5.12c",
    "5.12d",
    "5.13a",
    "5.13b",
    "5.13c",
    "5.13d",
    "5.14a",
    "5.14b",
    "5.14c",
    "5.14d",
]

const BOULDER_GRADES: Grade[] = [
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
]

function roundTo(value: number, decimals: number = 2): number {
    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
}

function toDateOnly(date: string): Date {
    return new Date(`${date}T00:00:00Z`)
}

function getSessionsCoveredWeeks(sessions: Session[]): number {
    if (sessions.length === 0) return 0

    const timestamps = sessions
        .map((session) => toDateOnly(session.date).getTime())
        .filter((time) => !Number.isNaN(time))

    if (timestamps.length === 0) return 0

    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)
    const daysCovered = Math.max(1, (maxTime - minTime) / (1000 * 60 * 60 * 24) + 1)

    return Math.max(1, daysCovered / 7)
}

function calculateSessionsPerWeek(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const weeks = getSessionsCoveredWeeks(sessions)
    if (weeks === 0) return 0
    return roundTo(sessions.length / weeks)
}

function calculateClimbsPerWeek(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const weeks = getSessionsCoveredWeeks(sessions)
    if (weeks === 0) return 0

    const totalClimbs = sessions.reduce(
        (count, session) => count + (session.climbs?.length ?? 0),
        0,
    )

    return roundTo(totalClimbs / weeks)
}

function calculateAverageQuality(climbs: Climb[]): number {
    if (climbs.length === 0) return 0
    const total = climbs.reduce((sum, climb) => sum + climb.quality, 0)
    return roundTo(total / climbs.length)
}

function calculateAverageSessionDuration(sessions: Session[]): number {
    if (sessions.length === 0) return 0
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0)
    return roundTo(totalDuration / sessions.length)
}

function calculateAlltimeDuration(sessions: Session[]): number {
    return sessions.reduce((sum, session) => sum + session.duration, 0)
}

function isRopeClimb(climb: Climb): boolean {
    return climb.style === "Rope"
}

function isBoulderClimb(climb: Climb): boolean {
    return climb.style === "Boulder"
}

function getGradeScale(climbs: Climb[]): Grade[] {
    if (climbs.length === 0) return []
    return climbs[0].style === "Rope" ? OUTDOOR_GRADES : BOULDER_GRADES
}

function calculateAverageGrade(climbs: Climb[]): Grade | null {
    if (climbs.length === 0) return null

    const scale = getGradeScale(climbs)
    if (scale.length === 0) return null

    const indexes = climbs
        .map((climb) => scale.indexOf(climb.grade))
        .filter((index) => index >= 0)

    if (indexes.length === 0) return null

    const averageIndex = indexes.reduce((sum, index) => sum + index, 0) / indexes.length
    const roundedIndex = Math.max(0, Math.min(scale.length - 1, Math.round(averageIndex)))

    return scale[roundedIndex] ?? null
}

function calculateTopGrade(climbs: Climb[]): Grade | null {
    if (climbs.length === 0) return null

    const scale = getGradeScale(climbs)
    if (scale.length === 0) return null

    const indexes = climbs
        .map((climb) => scale.indexOf(climb.grade))
        .filter((index) => index >= 0)

    if (indexes.length === 0) return null

    const maxIndex = Math.max(...indexes)
    return scale[maxIndex] ?? null
}
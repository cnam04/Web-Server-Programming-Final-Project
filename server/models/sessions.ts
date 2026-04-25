
import { connect } from "./supabase"
import type {
    DbClimbRow,
    Session,

} from "../types"

import {
    toDomainClimb,
    toDbSession,
    toDbClimbs,
} from "./utils/dbHelpers"

export const TABLE_NAME = "sessions"
export const CLIMBS_TABLE = "climbs"

export async function createSession(sessionData: Omit<Session, "id">) {
    const db = connect()
    const dbSession = toDbSession(sessionData)

    // Insert session and return id for climb foreign keys and response payload
    const sessionResult = await db
        .from(TABLE_NAME)
        .insert(dbSession)
        .select("id")
        .single()

    if (sessionResult.error) throw sessionResult.error
    if (!sessionResult.data) {
        throw new Error("Session insert did not return an id")
    }

    const climbsData = sessionData.climbs.map((climb) =>
        toDbClimbs(climb, sessionResult.data.id),
    )

    let climbs = [] as Session["climbs"]

    if (climbsData.length > 0) {
        const climbsResult = await db
            .from(CLIMBS_TABLE)
            .insert(climbsData)
            .select("*")

        if (climbsResult.error) throw climbsResult.error
        climbs = (climbsResult.data as DbClimbRow[]).map(toDomainClimb)
    }

    return {
        id: sessionResult.data.id,
        ...sessionData,
        climbs,
    }
}

// takes in entire session data with updated climbs,
export async function editSession(
    sessionId: number,
    sessionData: Omit<Session, "id">,
) {
    const db = connect()
    
    // Update session data
    const dbSession = toDbSession(sessionData as Omit<Session, "id">) // Type assertion since toDbSession expects all fields except id
    const sessionResult = await db
        .from(TABLE_NAME)
        .update(dbSession)
        .eq("id", sessionId)
        .select("*")
        .single()

    if (sessionResult.error) throw sessionResult.error
    if (!sessionResult.data) {
        throw new Error("Session update did not return data")
    }
    
    
    // update climbs associated with the session - for simplicity, delete all existing climbs and re-insert
    
    // delete all existing climbs for the session
    const deleteResult = await db.from(CLIMBS_TABLE).delete().eq("session_id", sessionId)
    if (deleteResult.error) throw deleteResult.error

    const climbsData = sessionData.climbs.map((climb) =>
        toDbClimbs(climb, sessionId),
    )

    let climbs = [] as Session["climbs"]

    if (climbsData.length > 0) {
        const climbsResult = await db
            .from(CLIMBS_TABLE)
            .insert(climbsData)
            .select("*")

        if (climbsResult.error) throw climbsResult.error
        climbs = (climbsResult.data as DbClimbRow[]).map(toDomainClimb)
    }

    return {
        id: sessionResult.data.id,
        ...sessionData,
        climbs,
    }
}


export async function deleteSession(sessionId: number) {
    const db = connect()
    const result = await db.from(TABLE_NAME).delete({count : "exact"}).eq("id", sessionId)
    
    if (result.error) throw result.error
    
    const deletedCount = result.count ?? 0
    return deletedCount
}
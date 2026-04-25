
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
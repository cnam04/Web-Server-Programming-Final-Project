import {PagingRequest} from "../types/dataEnvelopes"
import { connect } from "./supabase"
import type { 
    Session,
    Friendship,
    DbFriendshipRow,
    User,
    DbSessionRow,
    DbUserRow,
    DbClimbRow,
    DbSessionWithClimbsRow,
    Attempt,
    Climb,
    ClimbStyle,
    Grade,
    IndoorClimb,
    IndoorColor,
    OutdoorClimb,
    Quality,

} from "../types"

import { 
    toDomainUser,
    toDomainFriendship,
    toDbFriendship,
    toDomainClimb,
    toDomainSession,
} from "./utils/dbHelpers"

export const TABLE_NAME = "friendships"
export const USERS_TABLE = "users"
export const SESSIONS_TABLE = "sessions"
export const CLIMBS_TABLE = "climbs"



export async function getAll(params: PagingRequest, userId: number) {
    const db = connect()

    // select all users from the users table where id is in the list of friendIds for the given userId in the friendships table
    let query = db
    .from(USERS_TABLE)
    .select(`
        *,
        friendships!friendships_friend_id_fkey!inner(user_id)
    `, { count: "estimated" })
    .eq("friendships.user_id", userId)

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
    const listOfFriends = rows.map(toDomainUser)
    const count = result.count ?? 0

    return { listOfFriends, count }
}

export async function addFriend(data: {userId: number, friendId: number}) {
    const db = connect()
    const { userId, friendId } = data

    // Persist both directions so each profile sees the friendship.
    const relationships = [
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId },
    ]

    const upsertResult = await db
        .from(TABLE_NAME)
        .upsert(relationships, { onConflict: "user_id,friend_id", ignoreDuplicates: true })
        .select()

    if (upsertResult.error) {
        throw upsertResult.error
    }

    const insertedRows = (upsertResult.data ?? []) as DbFriendshipRow[]
    const insertedForward = insertedRows.find(
        (row) => row.user_id === userId && row.friend_id === friendId,
    )

    if (insertedForward) {
        return toDomainFriendship(insertedForward) as Friendship
    }

    // If nothing new was inserted (e.g. duplicate), return the existing row.
    const existing = await db
        .from(TABLE_NAME)
        .select("*")
        .match({ user_id: userId, friend_id: friendId })
        .single()

    if (existing.error) {
        throw existing.error
    }

    return toDomainFriendship(existing.data as DbFriendshipRow) as Friendship
    
}

export async function deleteFriend(data: {userId: number, friendId: number}) {
    const db = connect()
    const { userId, friendId } = data
    const result = await db
        .from(TABLE_NAME)
        .delete({ count : "exact"})
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
    if (result.error) {
        throw result.error
    }
    const deletedCount = result.count ?? 0
    return deletedCount
}


// im choosing to create a new query rather than reusing existing services to minimize the db communication overhead
export async function getFriendSessions(params: PagingRequest, userId: number) {
    const db = connect()
    // get all friend ids for the given user id
    // then get all sessions and all climbs in each session for each friend id
    let query = db
        .from("friend_sessions")
        .select(`
            *,
            climbs (*)
        `)
        .eq("viewer_user_id", userId)
    
    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending })
    }

    const page = Number(params?.page) || 1
    const pageSize = Number(params?.pageSize) || 10
    const start = (page - 1) * pageSize
    query = query.range(start, start + pageSize - 1)


    const { data, error } = await query
    if (error) {
        throw error
    }

    console.log("Raw friend sessions data:", data)
    const rows = (data ?? []) as DbSessionWithClimbsRow[]

    const friendSessions = rows.map(row => {
        const climbs = (row.climbs ?? []) as DbClimbRow[]

        return toDomainSession(row, climbs.map(toDomainClimb))
    })

const count = rows.length

    return { friendSessions, count } as { friendSessions: Session[], count: number }
}
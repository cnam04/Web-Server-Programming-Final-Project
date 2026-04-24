import type {
    DbClimbRow,
    DbSessionRow,
    DbSessionWithClimbsRow,
    DbUserRow,
    Grade,
    ClimbStyle,
    Attempt,
    Quality,
    IndoorColor,
    Session,
    Climb,
    User,
    UpdateUserInput,
} from "../../types"


export function toDomainClimb(row: DbClimbRow) {
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
export function toDomainSession(row: DbSessionRow, climbs: Climb[]) {
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

// convert snake_case db row to camelCase domain user
export function toDomainUser(row: DbUserRow): User {
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
export function toDbInsertUser(input: Omit<User, "id">) {
    return {
        username: input.username,
        email: input.email ?? null,
        image_link: input.imageLink ?? null,
        is_admin: input.isAdmin,
    }
}

export function toDbUpdateUser(input: UpdateUserInput) {
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
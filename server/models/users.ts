import type { User } from "../types"
import { PagingRequest } from "../types/dataEnvelopes"
import { connect } from "./supabase"

export const TABLE_NAME = "users"

type ItemType = User

export async function getAll(params: PagingRequest) {
    const db = connect()

    let query = db.from(TABLE_NAME).select("*", { count: "estimated" })

    if (params?.search) {
        query = query.or(
            `title.ilike.%${params.search}%,description.ilike.%${params.search}%`,
        )
    }
    if (params?.sortBy) {
        query = query.order(params.sortBy, { ascending: !params.descending })
    }
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    query = query.range(start, start + pageSize - 1)

    const result = await query

    if (result.error) {
        throw result.error
    }

    const list = result.data as ItemType[]

    const count = result.count ?? 0

    return { list, count }
}
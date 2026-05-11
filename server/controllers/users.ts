import { Router } from "express"
import { getAll, create, update, getById, deleteById, getUserSessions, getUserMetrics} from "../models/users"
import { User, DataEnvelope, DataListEnvelope, Session, UserMetrics } from "../types"
import { PagingRequest } from "../types/dataEnvelopes"
import { requireAuth } from "../middleware/auth"

const app = Router()

const MAX_PAGE_SIZE = 100

function parseQueryValue(value: unknown) {
    if (typeof value === "string") return value
    if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined
    return undefined
}

function parseNumberParam(value: string | undefined, fallback: number, min = 1, max = Number.MAX_SAFE_INTEGER) {
    const parsed = Number.parseInt(value ?? "", 10)
    if (Number.isNaN(parsed)) return fallback
    return Math.min(max, Math.max(min, parsed))
}

// allow this one without auth since we are just selecting from a users dropdown to login
app.get("/", async (req, res) => {
    const rawSearch = parseQueryValue(req.query.search)
    const search = rawSearch?.trim() || undefined
    const page = parseNumberParam(parseQueryValue(req.query.page), 1)
    const pageSize = parseNumberParam(parseQueryValue(req.query.pageSize), 10, 1, MAX_PAGE_SIZE)
    const sortBy = parseQueryValue(req.query.sortBy)
    const descendingParam = parseQueryValue(req.query.descending)

    const query: PagingRequest = {
        search,
        page,
        pageSize,
        sortBy,
        descending: descendingParam === undefined ? undefined : descendingParam.toLowerCase() === "true",
    }

    const { users, count } = await getAll(query)
    const response: DataListEnvelope<User> = {
        data: users,
        isSuccess: true,
        total: count,
    }
    res.send(response)


})
// allow this one to have auth since only admin can create users right now
//  normally, you would have a separate registration endpoint that doesn't require auth
.post("/", requireAuth(true), async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    const newUser = await create(req.body)
    const response: DataEnvelope<User> = {
        data: newUser,
        isSuccess: true,
    }
    res.send(response)
})
.patch("/:id", requireAuth(true), async (req, res) => { 
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    
    
    
    const idToUpdate = Number(req.params.id)
    if (Number.isNaN(idToUpdate)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const updatedUser = await update(idToUpdate, req.body)
    const response: DataEnvelope<User> = {
        data: updatedUser,
        isSuccess: true,
    }
    res.send(response)
})
.get("/:id", requireAuth(true), async (req, res) => { 
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    
    
    const idToGet = Number(req.params.id)
    if (Number.isNaN(idToGet)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const user = await getById(idToGet)
    if (!user) {
        const error = new Error("User not found") as Error & { status?: number }
        error.status = 404
        throw error
    }

    const response: DataEnvelope<User> = {
        data: user,
        isSuccess: true,
    }
    res.send(response)
})
.delete("/:id", requireAuth(true), async (req, res) => { 
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    
    const idToDelete = Number(req.params.id)
    if (Number.isNaN(idToDelete)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const deletedCount = await deleteById(idToDelete)
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: deletedCount > 0 ? "User deleted successfully" : "User not found",
    }
    res.send(response)
}).get("/:id/sessions", requireAuth(), async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }

    const sessions = await getUserSessions(userId)
    const response: DataListEnvelope<Session> = {
        data: sessions,
        isSuccess: true,
        total: sessions.length,
    }
    res.send(response)
}).get("/:id/metrics", requireAuth(), async (req, res) => {
    const userId = req.user?.id ?? null
    if (!userId) {
        res.status(401).send({
            data: null,
            isSuccess: false,
            message: "Unauthorized",
        })
        return
    }
    const metrics = await getUserMetrics(userId)
    const response: DataEnvelope<UserMetrics> = {
        data: metrics,
        isSuccess: true,
    }
    res.send(response)
})

export default app
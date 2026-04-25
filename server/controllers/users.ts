import { Router } from "express"
import { getAll, create, update, getById, deleteById, getUserSessions, getUserMetrics} from "../models/users"
import { User, DataEnvelope, DataListEnvelope, Session, UserMetrics } from "../types"


const app = Router()

app.get("/", async (req, res) => {
    const { users, count } = await getAll(req.query)
    const response: DataListEnvelope<User> = {
        data: users,
        isSuccess: true,
        total: count,
    }
    res.send(response)

// USER CONTROLLER 
}).post("/", async (req, res) => { 
    const newUser = await create(req.body)
    const response: DataEnvelope<User> = {
        data: newUser,
        isSuccess: true,
    }
    res.send(response)
}).patch("/:id", async (req, res) => { 
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const updatedUser = await update(id, req.body)
    const response: DataEnvelope<User> = {
        data: updatedUser,
        isSuccess: true,
    }
    res.send(response)
}).get("/:id", async (req, res) => { 
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const user = await getById(id)
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
}).delete("/:id", async (req, res) => { 
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const deletedCount = await deleteById(id)
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: deletedCount > 0 ? "User deleted successfully" : "User not found",
    }
    res.send(response)
}).get("/:id/sessions", async (req, res) => { 
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const sessions = await getUserSessions(id)
    const response: DataListEnvelope<Session> = {
        data: sessions,
        isSuccess: true,
        total: sessions.length,
    }
    res.send(response)
}).get("/:id/metrics", async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const metrics = await getUserMetrics(id)
    const response: DataEnvelope<UserMetrics> = {
        data: metrics,
        isSuccess: true,
    }
    res.send(response)
})

export default app
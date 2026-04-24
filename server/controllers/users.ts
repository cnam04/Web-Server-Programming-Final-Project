import { Router } from "express"
import { getAll, create, update, getById, deleteById, getUserSessions, getUserMetrics} from "../models/users"
import { User, DataEnvelope, DataListEnvelope } from "../types"


const app = Router()

app.get("/", async (req, res) => {
    const { list, count } = await getAll(req.query)
    
    const response: DataListEnvelope<User> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response)

// USER CONTROLLER 
}).post("/", async (req, res) => { // TODO
    const newUser = await create(req.body)
    const response: DataEnvelope<User> = {
        data: newUser,
        isSuccess: true,
    }
    res.send(response)
}).patch("/:id", async (req, res) => { // TODO
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
}).get("/:id", async (req, res) => { // TODO
    const user = await getById(req.params.id)
    const response: DataEnvelope<User> = {
        data: user,
        isSuccess: true,
    }
    res.send(response)
}).delete("/:id", async (req, res) => { // TODO
    const deletedCount = await deleteById(req.params.id)
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: deletedCount > 0 ? "User deleted successfully" : "User not found",
    }
    res.send(response)
}).get("/:id/sessions", async (req, res) => { // TODO
    const sessions = await getUserSessions(req.params.id)
    const response: DataListEnvelope<Session> = {
        data: sessions,
        isSuccess: true,
    }
    res.send(response)
}).get("/:id/metrics", async (req, res) => {
    const metrics = await getUserMetrics(req.params.id)
    const response: DataEnvelope<UserMetrics> = {
        data: metrics,
        isSuccess: true,
    }
    res.send(response)
})

export default app
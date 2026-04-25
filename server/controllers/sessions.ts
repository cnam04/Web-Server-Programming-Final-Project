import { Router } from "express"
import {createSession, deleteSession, editSession } from "../models/sessions"
import { Session } from "../types"
import { DataEnvelope } from "../types/dataEnvelopes"

const app = Router()

// .get methods are contained in users and friends contollers since they are for getting sessions for a specific user or their friends. 
//  This controller is for any session-specific endpoints that don't fit in those categories

.post("/", async (req, res) => {
    const newSession = await createSession(req.body)
    const response: DataEnvelope<Session> = {
        data: newSession,
        isSuccess: true,
    }
    res.send(response)
}).patch("/:id", async (req, res) => {
    const editedSession = await editSession(Number(req.params.id), req.body)
    const response: DataEnvelope<Session> = {
        data: editedSession,
        isSuccess: true,
    }
    res.send(response)
}).delete("/:id", async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        const error = new Error("Invalid session id") as Error & { status?: number }
        error.status = 400
        throw error
    }
    const deletedCount = await deleteSession(id)
    // For simplicity, we'll just return a success message since the frontend can remove the session from the UI immediately
    // In a more complex app, you might want to return the deleted session data or handle related data cleanup
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: deletedCount > 0 ? "Session deleted successfully" : "Session not found",
    }
    res.send(response)
})


export default app
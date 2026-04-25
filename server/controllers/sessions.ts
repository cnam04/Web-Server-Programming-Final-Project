import { Router } from "express"
import {createSession } from "../models/sessions"
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
})

export default app
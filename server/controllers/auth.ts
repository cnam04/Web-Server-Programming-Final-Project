import { Router } from "express"
import { DataEnvelope } from "../types"
import { login } from "../models/auth"
const app = Router()

.post("/login", async (req, res) => {
    const { email, password } = req.body
    try{
        const response: DataEnvelope<Awaited<ReturnType<typeof login>>> = {
                data: await login(email, password),
                isSuccess: true
        }
        res.send(response)
    } catch (error) {
        const response: DataEnvelope<null> = {
            data: null,
            isSuccess: false,
            message: error instanceof Error ? error.message : "An error occurred during login",
        }
        res.status(401).send(response)
        return
    }
})


export default app
import { Router } from "express"
import { DataEnvelope } from "../types"
import { login } from "../models/auth"
const app = Router()

.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    
    try{
        const {
            token,
            userData
        } = await login(username, password)
        
        const credentials = {
            token: token,
            user: userData
        }

        const response: DataEnvelope<typeof credentials> = {
                data: credentials,
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
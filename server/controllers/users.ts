import { Router } from "express"
import { getAll} from "../models/users"
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
})


export default app
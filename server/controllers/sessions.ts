import { Router } from "express"
import { } from "../models/sessions"
import { } from "../types"

const app = Router()

// .get methods are contained in users and friends contollers since they are for getting sessions for a specific user or their friends. 
//  This controller is for any session-specific endpoints that don't fit in those categories

.post("/", async (req, res) => {
    // create a new session
    // this endpoint isn't currently used by the frontend, but it would be used to create new sessions (either for a user or for a friend, depending on how we want to set it up)
    res.send("Create a new session")
})

export default app
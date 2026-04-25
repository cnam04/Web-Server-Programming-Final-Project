import { Router } from "express"
import { getAll, addFriend, deleteFriend, getFriendSessions} from "../models/friends"
import { User, DataEnvelope, DataListEnvelope, Session, Friendship } from "../types"

const app = Router()


app.get("/:userId", async (req, res) => {
    const userId = Number(req.params.userId)
    if (Number.isNaN(userId)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }

    const {listOfFriends, count} = await getAll(req.query, userId)
    const response: DataListEnvelope<User> = {
        data: listOfFriends,
        isSuccess: true,
        total: count
    }
    res.send(response)
}).post("/", async (req, res)=>{ // friend ids in body
    const newFriendship = await addFriend(req.body)

    const response: DataEnvelope<Friendship> = {
        data: newFriendship,
        isSuccess: true
    }
    res.send(response)
}).delete("/", async (req, res)=>{
    const deletedCount = await deleteFriend(req.body)
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: deletedCount > 0 ? "Friendship deleted successfully" : "Friendship not found",
    }
    res.send(response)
}).get("/:userId/sessions", async (req, res)=>{
    const userId = Number(req.params.userId)
    if (Number.isNaN(userId)) {
        const error = new Error("Invalid user id") as Error & { status?: number }
        error.status = 400
        throw error
    }
    const {friendSessions, count} = await getFriendSessions(req.query, userId)

    const response: DataListEnvelope<Session> = {
        data: friendSessions,
        isSuccess: true,
        total: count
    }
    res.send(response)
})



export default app
import { config } from "dotenv"
config()
import express from "express"
import { DataEnvelope } from "./types"
import usersController from "./controllers/users"
import friendsController from "./controllers/friends"
import sessionsController from "./controllers/sessions"
import authController from "./controllers/auth"
import { validateJWT } from "./middleware/auth"

const PORT = process.env.PORT ?? 3000
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist"

const app = express()


app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*") // Allow requests from any origin
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE") // Allow specific HTTP methods
    res.setHeader("Access-Control-Allow-Headers", "*") // Allow specific headers
    next()
})
.use(express.json()) // Middleware to parse JSON request bodies
.use(validateJWT) // Middleware to validate JWT and attach user to request if valid

// routes
app.use(express.static(STATIC_DIR))
.use ("/api/users", usersController)
.use ("/api/friends", friendsController)
.use ("/api/sessions", sessionsController)
.use ("/api/auth", authController)
 // error handling
 app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        console.error(err)

        const response: DataEnvelope<null> = {
            data: null,
            isSuccess: false,
            message: err.message ?? "An error occurred",
        }

        res.status((err as any).status ?? 500).send(response)
    },
)


app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`)
})

console.log("Listening for requests...")

import type { Request, Response, NextFunction} from "express"
import { verify } from "jsonwebtoken"
import { User } from "../types"


// Add user as a typed property on the Express Request object
// so that we can attach the authenticated user to the request in the middleware and have it properly typed throughout the app
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export function validateJWT(req: Request, _res: Response, next: NextFunction) {
    // check if the beginning is bearer, and get rid of it
    // then it just becomes the pure token
    const token = req.header("Authorization")?.replace("Bearer ", "")


    // test token 


    if (!token) {
        return next()
    }

    verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        // 
        if (err){
            return next(err)
        }
        req.user = decoded as User
        next()
    })
}

// Returns a function that express can call 
// export function requireAuth(role?: string, userId?: number) {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).send({
//                 data: null,
//                 isSuccess: false,
//                 message: "You must login to access this resource",
//             })
//         }
//         // fix: i think right now it's isAdmin not role
//         if (role && req.user.role !== role) {
//             return res.status(403).send({
//                 data: null,
//                 isSuccess: false,
//                 message: "You do not have the required role to access this resource",
//             })
//         }

//         if (userId && req.user.id !== userId) {
//             return res.status(403).send({
//                 data: null,
//                 isSuccess: false,
//                 message: "You do not have permission to access this resource",
//             })
//         }

//         next()
//     }
// }
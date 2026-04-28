import { connect } from "./supabase"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import type { 
    User,
    DbUserRow,
} from "../types"

import {
    toDomainUser
} from "./utils/dbHelpers"

export const USERS_TABLE = "users"
const JWT_SECRET = process.env.JWT_SECRET

// export async function login(username: string, password: string) {
//     const db = connect()

//     // get a user by their username and include the password hash for verification
//     const userWithPassword = await db
//         .from(USERS_TABLE)
//         .select("*")
//         .eq("username", username)
//         .single()

//     if (userWithPassword.error) throw userWithPassword.error
//     if (!userWithPassword.data) {
//         throw new Error("User not found")
//     }

//     // Verify the password using bcrypt.compare
//     const passwordMatches = await bcrypt.compare(password, userWithPassword.data.password_hash)

//     if (!passwordMatches) {
//         throw new Error("Invalid password")
//     }

//     // since password is valid, generate token 
//     const token = jwt.sign(
//         { 
//             userId: userWithPassword.data.id,
//             username: userWithPassword.data.username,
//             isAdmin: userWithPassword.data.is_admin,
//         },
//         JWT_SECRET,
//         { expiresIn: "1h" }
//     )


//     const userData: User = toDomainUser(userWithPassword.data)

//     return {
//         token,
//         userData
//     }
// }


export async function login(email: string, _password:string): Promise<{ token: string, user: User  }> {
    const db = connect()

    
    const result = await db.from(USERS_TABLE).select("*").eq("email", email).single()
    
    if (result.error) {
        throw result.error
    }

    const user = toDomainUser(result.data) as User

    // if (!user || user.password === _password){
    //     const err = new Error("Invalid email or password") as Error & { status?: number }
    //     throw err
    // }


    // Generate JWT token
    // JWT is not async because it is outdated and does not support promises, 
    //  so we wrap it in a promise to use async/await
    return new Promise((resolve, reject) => {
        jwt.sign(
            user,
            JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err || !token) {
                    reject(err || new Error("Token generation failed"))
                    return
                } else {
                    resolve({
                        token, 
                        user
                    })
                }
            }
        )
    })
}
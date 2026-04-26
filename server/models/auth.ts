import { connect } from "./supabase"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import type { 
    User
} from "../types"

import {
    toDomainUser
} from "./utils/dbHelpers"

export const USERS_TABLE = "users"
const JWT_SECRET = process.env.JWT_SECRET

export async function login(username: string, password: string) {
    const db = connect()

    // get a user by their username and include the password hash for verification
    const userWithPassword = await db
        .from(USERS_TABLE)
        .select("*")
        .eq("username", username)
        .single()

    if (userWithPassword.error) throw userWithPassword.error
    if (!userWithPassword.data) {
        throw new Error("User not found")
    }

    // Verify the password using bcrypt.compare
    const passwordMatches = await bcrypt.compare(password, userWithPassword.data.password_hash)

    if (!passwordMatches) {
        throw new Error("Invalid password")
    }

    // since password is valid, generate token 
    const token = jwt.sign(
        { 
            userId: userWithPassword.data.id,
            username: userWithPassword.data.username,
            isAdmin: userWithPassword.data.is_admin,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
    )


    const userData: User = toDomainUser(userWithPassword.data)

    return {
        token,
        userData
    }
}
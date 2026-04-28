import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.VITE_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SECRET_KEY || ""

export function connect() {
    console.log("Connecting to Supabase with URL:", supabaseUrl)
    return createClient(supabaseUrl, supabaseKey)
}
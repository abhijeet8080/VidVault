import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or Service Role Key in environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

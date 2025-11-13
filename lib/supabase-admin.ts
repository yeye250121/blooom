import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

/**
 * Supabase Admin Client
 *
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)
 * Only use in secure server-side code (API routes, server actions)
 * NEVER expose this client to the browser/client-side
 *
 * Use cases:
 * - API routes that need full database access
 * - Server-side operations that require admin privileges
 * - Operations that need to bypass RLS policies
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

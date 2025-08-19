import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client with Service Role Key for admin operations
 * This bypasses Row Level Security - use with caution!
 * Only use in server-side code, never expose to client
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase admin configuration. Check SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }

  // Create client with service role key - bypasses RLS
  return createSupabaseClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

/**
 * Checks if service role key is configured
 */
export function hasAdminAccess(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY
}
// Configuration checker for runtime
export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    const errorMessage = `
    ⚠️ MISSING SUPABASE CONFIGURATION ⚠️
    
    The following environment variables are required but not set:
    ${!url ? '- NEXT_PUBLIC_SUPABASE_URL' : ''}
    ${!anonKey ? '- NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}
    
    Please configure these in:
    1. CapRover Dashboard → App Configs → Environmental Variables
    2. Or in your .env.local file for local development
    
    Current values:
    - NEXT_PUBLIC_SUPABASE_URL: ${url || 'NOT SET'}
    - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '[SET]' : 'NOT SET'}
    `
    
    console.error(errorMessage)
    
    // In production, throw error to prevent startup
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required Supabase configuration. Check server logs for details.')
    }
  }

  return { url, anonKey }
}
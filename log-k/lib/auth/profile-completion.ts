import { createClient } from '@/lib/supabase/client'

/**
 * Ensures that the logged-in user has a profile.
 * This should be called after successful login.
 */
export async function ensureUserProfile() {
  const supabase = createClient()
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError)
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (existingProfile) {
      console.log('Profile already exists for user:', user.id)
      return { success: true, profile: existingProfile }
    }
    
    // If no profile exists and we didn't get a "not found" error, something is wrong
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking profile:', fetchError)
      return { success: false, error: fetchError.message }
    }
    
    // Extract user metadata
    const metadata = user.user_metadata || {}
    const firstName = metadata.first_name || metadata.firstName || ''
    const lastName = metadata.last_name || metadata.lastName || ''
    
    // Try to create profile using the RPC function first
    const { data: rpcResult, error: rpcError } = await supabase
      .rpc('ensure_profile_after_login')
    
    if (!rpcError && rpcResult) {
      console.log('Profile created via RPC:', rpcResult)
      return { success: true, profile: rpcResult }
    }
    
    // Fallback: Try direct insert (in case RPC doesn't exist)
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        compliance_mode: 'EASA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (insertError) {
      console.error('Failed to create profile:', insertError)
      
      // Check if it's a foreign key error (user doesn't exist in auth.users)
      if (insertError.code === '23503') {
        return { 
          success: false, 
          error: 'Your account is not fully activated. Please check your email for confirmation.' 
        }
      }
      
      return { success: false, error: insertError.message }
    }
    
    console.log('Profile created successfully:', newProfile)
    return { success: true, profile: newProfile }
    
  } catch (error: any) {
    console.error('Unexpected error in ensureUserProfile:', error)
    return { success: false, error: error.message || 'Unexpected error' }
  }
}

/**
 * Check if user needs to complete their profile
 */
export async function checkProfileCompletion() {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { needsCompletion: false, isAuthenticated: false }
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username, first_name, last_name')
      .eq('id', user.id)
      .single()
    
    if (!profile) {
      return { needsCompletion: true, isAuthenticated: true, missingProfile: true }
    }
    
    // Check if required fields are missing
    const needsCompletion = !profile.username || !profile.first_name || !profile.last_name
    
    return { 
      needsCompletion, 
      isAuthenticated: true, 
      profile,
      missingFields: {
        username: !profile.username,
        firstName: !profile.first_name,
        lastName: !profile.last_name
      }
    }
    
  } catch (error) {
    console.error('Error checking profile completion:', error)
    return { needsCompletion: false, isAuthenticated: false, error }
  }
}
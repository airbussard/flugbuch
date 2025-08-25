import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Create a service role client that bypasses RLS
function getServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role configuration')
  }
  
  return createServiceClient(supabaseUrl, serviceRoleKey)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, username } = body
    
    // Validate input
    if (!email || !password || !firstName || !lastName || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      )
    }
    
    // Use regular client for auth operations
    const supabase = await createClient()
    
    // Check if username is available
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .single()
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    })
    
    if (authError) {
      console.error('SignUp error:', authError)
      return NextResponse.json(
        { 
          error: authError.message,
          details: process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true' ? authError : undefined
        },
        { status: 400 }
      )
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 400 }
      )
    }
    
    // Use service role client to create profile (bypasses RLS)
    let profileCreated = false
    let profileError = null
    
    // Try with service role if available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const serviceClient = getServiceRoleClient()
        
        const { data: profileData, error } = await serviceClient
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username.toLowerCase(),
            compliance_mode: 'EASA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()
        
        if (error) {
          profileError = error
          console.error('Service role profile creation error:', error)
        } else {
          profileCreated = true
          console.log('Profile created successfully with service role')
        }
      } catch (serviceError) {
        console.error('Service client error:', serviceError)
        profileError = serviceError
      }
    }
    
    // Fallback: Try with regular client (with retry logic)
    if (!profileCreated) {
      let attempts = 0
      const maxAttempts = 3
      const retryDelay = 1000
      
      while (!profileCreated && attempts < maxAttempts) {
        attempts++
        
        // Wait before retry (except first attempt)
        if (attempts > 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
        
        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username.toLowerCase(),
            compliance_mode: 'EASA',
          }])
        
        if (!error) {
          profileCreated = true
          console.log(`Profile created on attempt ${attempts}`)
        } else {
          profileError = error
          console.error(`Profile creation attempt ${attempts} failed:`, error)
        }
      }
    }
    
    if (!profileCreated) {
      // Log the error but don't fail the registration completely
      console.error('Failed to create user profile:', profileError)
      
      // Return partial success - user is created but profile needs to be created later
      return NextResponse.json({
        success: true,
        warning: 'User created but profile creation failed. Profile will be created on first login.',
        userId: authData.user.id,
        email: authData.user.email,
        debug: process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true' ? {
          profileError: profileError,
          hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        } : undefined
      })
    }
    
    // Full success
    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: authData.user.email,
      message: 'Registration successful'
    })
    
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    steps: [],
    errors: [],
    success: false
  }

  try {
    const body = await req.json()
    const { email, password, firstName, lastName, username } = body
    
    debugInfo.steps.push({
      step: 'Input received',
      data: { email, firstName, lastName, username, hasPassword: !!password }
    })

    // Create Supabase client
    const supabase = await createClient()
    
    // Step 1: Check current session before signup
    const { data: sessionBefore } = await supabase.auth.getSession()
    debugInfo.steps.push({
      step: 'Session before signup',
      hasSession: !!sessionBefore?.session,
      userId: sessionBefore?.session?.user?.id
    })

    // Step 2: Attempt signup
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
      debugInfo.errors.push({
        step: 'SignUp failed',
        error: authError.message,
        code: authError.status,
        details: authError
      })
      return NextResponse.json(debugInfo, { status: 400 })
    }

    debugInfo.steps.push({
      step: 'SignUp successful',
      userId: authData.user?.id,
      email: authData.user?.email,
      emailConfirmed: authData.user?.email_confirmed_at
    })

    // Step 3: Check session after signup
    const { data: sessionAfter } = await supabase.auth.getSession()
    debugInfo.steps.push({
      step: 'Session after signup',
      hasSession: !!sessionAfter?.session,
      userId: sessionAfter?.session?.user?.id,
      sessionUserId: sessionAfter?.session?.user?.id,
      authUserId: authData.user?.id,
      idsMatch: sessionAfter?.session?.user?.id === authData.user?.id
    })

    // Step 4: Check auth.uid() in database
    const { data: authUidData, error: authUidError } = await supabase
      .rpc('get_auth_uid')
      .single()
    
    debugInfo.steps.push({
      step: 'Database auth.uid() check',
      authUid: (authUidData as any)?.uid,
      error: authUidError?.message,
      hasAuthContext: !!(authUidData as any)?.uid
    })

    // Step 5: Check RLS policies
    const { data: policies } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'user_profiles')
      .eq('cmd', 'INSERT')
    
    debugInfo.steps.push({
      step: 'RLS INSERT policies',
      count: policies?.length || 0,
      policies: policies?.map(p => ({
        name: p.policyname,
        withCheck: p.with_check
      }))
    })

    // Step 6: Attempt profile creation with retry
    let profileCreated = false
    let attempts = 0
    const maxAttempts = 3
    const delay = 1000 // 1 second

    while (!profileCreated && attempts < maxAttempts) {
      attempts++
      
      // Wait before retry (except first attempt)
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
        
        // Re-check session
        const { data: retrySession } = await supabase.auth.getSession()
        debugInfo.steps.push({
          step: `Retry ${attempts} - Session check`,
          hasSession: !!retrySession?.session,
          userId: retrySession?.session?.user?.id
        })
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user!.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username.toLowerCase(),
          compliance_mode: 'EASA',
        }])
        .select()
        .single()

      if (profileError) {
        debugInfo.errors.push({
          step: `Profile creation attempt ${attempts}`,
          error: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint
        })
      } else {
        profileCreated = true
        debugInfo.steps.push({
          step: 'Profile created successfully',
          attempt: attempts,
          profileId: profileData?.id,
          username: profileData?.username
        })
        debugInfo.success = true
      }
    }

    // Step 7: Final verification
    if (profileCreated) {
      const { data: verifyProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user!.id)
        .single()
      
      debugInfo.steps.push({
        step: 'Profile verification',
        exists: !!verifyProfile,
        username: verifyProfile?.username,
        email: verifyProfile?.email
      })
    }

    return NextResponse.json(debugInfo, { status: debugInfo.success ? 200 : 400 })

  } catch (error: any) {
    debugInfo.errors.push({
      step: 'Unexpected error',
      error: error.message,
      stack: error.stack
    })
    return NextResponse.json(debugInfo, { status: 500 })
  }
}

// GET endpoint to check current auth status
export async function GET() {
  const supabase = await createClient()
  
  const { data: session } = await supabase.auth.getSession()
  const { data: user } = await supabase.auth.getUser()
  
  // Try to get auth.uid() from database
  let authUid = null
  try {
    const { data } = await supabase.rpc('get_auth_uid').single()
    authUid = (data as any)?.uid
  } catch (e) {
    // Function might not exist yet
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    hasSession: !!session?.session,
    hasUser: !!user?.user,
    userId: user?.user?.id,
    userEmail: user?.user?.email,
    sessionUserId: session?.session?.user?.id,
    databaseAuthUid: authUid,
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      debugMode: process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true'
    }
  })
}
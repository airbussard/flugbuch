import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const userId = user.id
    
    // Get return_to from form data or JSON
    let returnTo = '/dashboard'
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // Handle form submission
      const formData = await request.formData()
      returnTo = formData.get('return_to')?.toString() || '/dashboard'
    } else if (contentType?.includes('application/json')) {
      // Handle JSON request
      const body = await request.json()
      returnTo = body.return_to || '/dashboard'
    }

    // Check if user already had a trial (use maybeSingle to handle no results)
    const { data: existingTrial } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('subscription_tier', 'trial')
      .limit(1)
      .maybeSingle()

    if (existingTrial) {
      return NextResponse.json(
        { error: 'You have already used your free trial' },
        { status: 400 }
      )
    }

    // Create trial subscription
    const trialDurationDays = 28 // 4 weeks
    const now = new Date()
    const validUntil = new Date(now.getTime() + trialDurationDays * 24 * 60 * 60 * 1000)

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        subscription_tier: 'trial', // Trial tier
        subscription_source: 'promo', // Trials are technically promotional
        activated_at: now.toISOString(),
        valid_until: validUntil.toISOString(),
        notes: '4-week free trial'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating trial:', error)
      return NextResponse.json(
        { error: 'Failed to start trial' },
        { status: 500 }
      )
    }

    // If form submission, redirect to return URL
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      return NextResponse.redirect(new URL(returnTo, request.url))
    }

    // Otherwise return JSON
    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Trial started successfully'
    })
  } catch (error) {
    console.error('Error in start-trial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
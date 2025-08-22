import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user already had a trial
    const { data: existingTrial } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('subscription_source', 'trial')
      .limit(1)
      .single()

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
        subscription_tier: 'trial',
        subscription_source: 'trial',
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
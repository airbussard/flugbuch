// Server-side subscription service
import { createClient } from '@/lib/supabase/server'
import { 
  UserSubscription, 
  SubscriptionStatus, 
  SubscriptionTier,
  AppFeature,
  canAccessFeature as checkFeatureAccess,
  isSubscriptionExpired,
  getDaysRemaining
} from './types'

// Server-side subscription service
export async function getUserSubscriptionStatus(userId?: string): Promise<SubscriptionStatus> {
  const supabase = await createClient()
  
  // Get current user if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return createDefaultStatus()
    }
    userId = user.id
  }

  try {
    // Query user_subscriptions table
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !subscription) {
      // No subscription found - check if new user should get trial
      const shouldStartTrial = await checkIfEligibleForTrial(userId)
      if (shouldStartTrial) {
        // Auto-start trial for new users
        const trialSubscription = await startUserTrial(userId)
        if (trialSubscription) {
          return mapSubscriptionToStatus(trialSubscription)
        }
      }
      return createDefaultStatus()
    }

    return mapSubscriptionToStatus(subscription as UserSubscription)
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return createDefaultStatus()
  }
}

// Check if user is eligible for trial
async function checkIfEligibleForTrial(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Check if user has ever had a trial
  const { data: previousTrials } = await supabase
    .from('user_subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('subscription_source', 'trial')
    .limit(1)

  return !previousTrials || previousTrials.length === 0
}

// Start a new trial for user
async function startUserTrial(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()
  
  const trialDurationDays = 28 // 4 weeks
  const now = new Date()
  const validUntil = new Date(now.getTime() + trialDurationDays * 24 * 60 * 60 * 1000)

  const { data: subscription, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      subscription_tier: 'trial' as SubscriptionTier,
      subscription_source: 'trial',
      activated_at: now.toISOString(),
      valid_until: validUntil.toISOString(),
      notes: 'Auto-created 4-week trial'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating trial subscription:', error)
    return null
  }

  return subscription as UserSubscription
}

// Sync iOS subscription from app
export async function syncIOSSubscription(
  userId: string,
  transactionId: string,
  originalTransactionId: string,
  tier: 'basic' | 'premium',
  validUntil: Date
): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('apple_original_transaction_id', originalTransactionId)
      .single()

    if (existing) {
      // Update existing subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          apple_transaction_id: transactionId,
          valid_until: validUntil.toISOString(),
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      return !error
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          subscription_tier: tier,
          subscription_source: 'apple',
          activated_at: new Date().toISOString(),
          valid_until: validUntil.toISOString(),
          apple_transaction_id: transactionId,
          apple_original_transaction_id: originalTransactionId
        })

      return !error
    }
  } catch (error) {
    console.error('Error syncing iOS subscription:', error)
    return false
  }
}

// Create or update Stripe subscription
export async function syncStripeSubscription(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  tier: 'basic' | 'premium',
  validUntil: Date
): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single()

    if (existing) {
      // Update existing subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          valid_until: validUntil.toISOString(),
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      return !error
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          subscription_tier: tier,
          subscription_source: 'stripe',
          activated_at: new Date().toISOString(),
          valid_until: validUntil.toISOString(),
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId
        })

      return !error
    }
  } catch (error) {
    console.error('Error syncing Stripe subscription:', error)
    return false
  }
}

// Cancel subscription (mark as expired)
export async function cancelSubscription(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        valid_until: new Date().toISOString(), // Expire immediately
        updated_at: new Date().toISOString(),
        notes: 'Cancelled by user'
      })
      .eq('user_id', userId)
      .gte('valid_until', new Date().toISOString()) // Only update active subscriptions

    return !error
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return false
  }
}

// Map database subscription to status object
function mapSubscriptionToStatus(subscription: UserSubscription): SubscriptionStatus {
  const isExpired = isSubscriptionExpired(subscription.valid_until)
  const daysRemaining = getDaysRemaining(subscription.valid_until)
  const isTrial = subscription.subscription_source === 'trial'
  
  // If subscription is expired, treat as no subscription
  if (isExpired) {
    return {
      tier: 'none',
      source: subscription.subscription_source,
      isActive: false,
      isTrialActive: false,
      trialDaysRemaining: null,
      expiresAt: new Date(subscription.valid_until),
      canAccessFeature: (feature: AppFeature) => checkFeatureAccess('none', feature)
    }
  }

  // Map database tiers to application tiers
  // Note: Trials have subscription_tier='pro' with subscription_source='trial'
  let tier = subscription.subscription_tier
  
  // Handle special mappings
  if (subscription.subscription_tier === 'premium') {
    tier = 'premium' // Map 'premium' to 'premium' (Pro tier)
  } else if (subscription.subscription_tier === 'pro' && isTrial) {
    // Trial users get pro features but we keep the tier as 'pro'
    tier = 'pro'
  }

  return {
    tier,
    source: subscription.subscription_source,
    isActive: true,
    isTrialActive: isTrial && !isExpired,
    trialDaysRemaining: isTrial ? daysRemaining : null,
    expiresAt: new Date(subscription.valid_until),
    canAccessFeature: (feature: AppFeature) => checkFeatureAccess(tier, feature)
  }
}

// Create default status (no subscription)
function createDefaultStatus(): SubscriptionStatus {
  return {
    tier: 'none',
    source: null,
    isActive: false,
    isTrialActive: false,
    trialDaysRemaining: null,
    expiresAt: null,
    canAccessFeature: (feature: AppFeature) => checkFeatureAccess('none', feature)
  }
}

// Export helper function
export { canAccessFeature } from './types'
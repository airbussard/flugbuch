// Client-side subscription service
import { createClient } from '@/lib/supabase/client'
import { 
  UserSubscription, 
  SubscriptionStatus, 
  AppFeature,
  canAccessFeature as checkFeatureAccess,
  isSubscriptionExpired,
  getDaysRemaining
} from './types'

// Client-side subscription service
export async function getUserSubscriptionStatusClient(userId?: string): Promise<SubscriptionStatus> {
  const supabase = createClient()
  
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
      return createDefaultStatus()
    }

    return mapSubscriptionToStatus(subscription as UserSubscription)
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return createDefaultStatus()
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

  // Map 'premium' from DB to 'premium' (Pro) tier
  const tier = subscription.subscription_tier === 'premium' ? 'premium' : subscription.subscription_tier

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
// Subscription Types and Interfaces

export type SubscriptionTier = 'none' | 'trial' | 'basic' | 'pro' | 'premium' | 'enterprise'
export type SubscriptionSource = 'apple' | 'stripe' | 'promo' | 'admin' | 'trial'

export interface UserSubscription {
  id: string
  user_id: string
  subscription_tier: SubscriptionTier
  subscription_source: SubscriptionSource
  activated_at: string
  valid_until: string
  apple_transaction_id: string | null
  apple_original_transaction_id: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  promo_code: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SubscriptionStatus {
  tier: SubscriptionTier
  source: SubscriptionSource | null
  isActive: boolean
  isTrialActive: boolean
  trialDaysRemaining: number | null
  expiresAt: Date | null
  canAccessFeature: (feature: AppFeature) => boolean
}

export type AppFeature = 
  | 'weather'
  | 'airports' 
  | 'settings'
  | 'flights'
  | 'analytics'
  | 'fleet'
  | 'crew'
  | 'export'
  | 'sync'
  | 'admin'

// Feature access matrix
export const FEATURE_ACCESS: Record<SubscriptionTier, AppFeature[]> = {
  none: ['settings'], // Only settings and account deletion
  trial: ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync'], // All features except admin
  basic: ['weather', 'airports', 'settings'], // Limited features
  pro: ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync'], // Pro features (used for trials with source='trial')
  premium: ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync'], // All features
  enterprise: ['weather', 'airports', 'settings', 'flights', 'analytics', 'fleet', 'crew', 'export', 'sync', 'admin'] // Everything
}

// Subscription tier display names
export const TIER_DISPLAY_NAMES: Record<SubscriptionTier, string> = {
  none: 'No Subscription',
  trial: 'Free Trial',
  basic: 'Basic',
  pro: 'Pro',
  premium: 'Pro', // Map premium to Pro for display
  enterprise: 'Enterprise'
}

// Subscription tier prices (for display)
export const TIER_PRICES: Record<SubscriptionTier, { price: string; period: string; monthlyPrice?: string }> = {
  none: { price: '0€', period: 'none' },
  trial: { price: '0€', period: '4 weeks' },
  basic: { price: '19,99€', period: 'year', monthlyPrice: '1,67€/month' },
  pro: { price: '27,99€', period: 'year', monthlyPrice: '2,33€/month' },
  premium: { price: '27,99€', period: 'year', monthlyPrice: '2,33€/month' }, // Same as pro
  enterprise: { price: 'Contact', period: 'custom' }
}

// Helper to check if subscription is expired
export function isSubscriptionExpired(validUntil: string | Date): boolean {
  const expiryDate = typeof validUntil === 'string' ? new Date(validUntil) : validUntil
  return new Date() > expiryDate
}

// Helper to calculate days remaining
export function getDaysRemaining(validUntil: string | Date): number {
  const expiryDate = typeof validUntil === 'string' ? new Date(validUntil) : validUntil
  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// Helper to check if user can access a feature
export function canAccessFeature(tier: SubscriptionTier, feature: AppFeature): boolean {
  return FEATURE_ACCESS[tier]?.includes(feature) ?? false
}
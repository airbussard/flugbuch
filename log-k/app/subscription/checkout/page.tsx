import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscriptionStatus } from '@/lib/subscription/service.server'
import CheckoutView from './CheckoutView'

interface PageProps {
  searchParams: Promise<{ plan?: string; redirect?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams
  const plan = params.plan as 'basic' | 'premium' | undefined
  const redirectTo = params.redirect || '/dashboard'

  // Check authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to register with plan parameter
    const registerUrl = new URL('/register', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    if (plan) {
      registerUrl.searchParams.set('plan', plan)
      registerUrl.searchParams.set('redirect', `/subscription/checkout?plan=${plan}`)
    }
    redirect(registerUrl.toString())
  }

  // Get current subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(user.id)

  // If user already has an active paid subscription, redirect
  if (subscriptionStatus.tier === 'basic' || subscriptionStatus.tier === 'premium' || subscriptionStatus.tier === 'enterprise') {
    redirect(redirectTo)
  }

  // Default to premium if no plan specified
  const selectedPlan = plan || 'premium'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <CheckoutView 
          userId={user.id}
          userEmail={user.email || ''}
          selectedPlan={selectedPlan}
          currentTier={subscriptionStatus.tier}
          isTrialActive={subscriptionStatus.isTrialActive}
          trialDaysRemaining={subscriptionStatus.trialDaysRemaining}
          redirectTo={redirectTo}
        />
      </div>
    </div>
  )
}
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionPlans from '../SubscriptionPlans'
import IOSSyncButton from '../IOSSyncButton'
import { getUserSubscriptionStatus } from '@/lib/subscription/service.server'

interface PageProps {
  searchParams: Promise<{ feature?: string; return_to?: string; expired?: string; plan?: string }>
}

export default async function SubscriptionChoosePage({
  searchParams
}: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get current subscription status
  const subscriptionStatus = await getUserSubscriptionStatus(user.id)

  // Redirect only if user has PAID subscription (not trial)
  // Trial users should be able to see upgrade options
  if (subscriptionStatus.isActive && subscriptionStatus.tier !== 'trial' && subscriptionStatus.tier !== 'none') {
    const returnTo = params.return_to || '/dashboard'
    redirect(returnTo)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          {params.expired === 'true' ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Trial Has Expired
              </h1>
              <p className="text-xl text-gray-600">
                Choose a plan to continue using Log-K
              </p>
            </>
          ) : params.feature ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Upgrade to Access This Feature
              </h1>
              <p className="text-xl text-gray-600">
                The {params.feature} feature requires a subscription
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600">
                Select the plan that fits your needs
              </p>
            </>
          )}
        </div>

        {/* Subscription Plans Component */}
        <SubscriptionPlans 
          userId={user.id}
          currentTier={subscriptionStatus.tier}
          returnTo={params.return_to}
          highlightFeature={params.feature}
          preselectedPlan={params.plan}
        />

        {/* iOS Subscription Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Already subscribed via iOS?
          </h3>
          <p className="text-blue-700 mb-4">
            If you purchased a subscription through the iOS app, your subscription is already active.
            Simply log in with the same account on both platforms.
          </p>
          <IOSSyncButton />
        </div>

        {/* Return to Settings */}
        <div className="mt-8 text-center">
          <a
            href="/settings"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Return to Settings
          </a>
        </div>
      </div>
    </div>
  )
}
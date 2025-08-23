import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SubscriptionPlans from '../SubscriptionPlans'
import { AlertTriangle, Settings, Trash2 } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ return_to?: string }>
}

export default async function SubscriptionExpiredPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user actually has an expired subscription or never had one
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('subscription_tier, valid_until')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const hasExpiredTrial = subscription && 
    subscription.subscription_tier === 'trial' && 
    new Date(subscription.valid_until) < new Date()

  const neverHadSubscription = !subscription

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert Header */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {hasExpiredTrial 
                  ? 'Your Trial Has Expired'
                  : neverHadSubscription
                  ? 'Subscription Required'
                  : 'Your Subscription Has Expired'
                }
              </h1>
              <p className="text-gray-600">
                {hasExpiredTrial 
                  ? 'Thank you for trying Log-K! Your 4-week trial period has ended. Choose a plan to continue using all features.'
                  : neverHadSubscription
                  ? 'Welcome to Log-K! Choose a subscription plan to access all features of the professional pilot logbook.'
                  : 'Your subscription has expired. Please choose a plan to continue using Log-K.'
                }
              </p>
              {params.return_to && (
                <p className="text-sm text-gray-500 mt-2">
                  You were trying to access: <code className="bg-gray-100 px-1 rounded">{params.return_to}</code>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <SubscriptionPlans 
            userId={user.id}
            currentTier="none"
            returnTo={params.return_to || '/dashboard'}
          />
        </div>

        {/* Alternative Actions */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Not ready to subscribe?
          </h3>
          <p className="text-gray-600 mb-6">
            You can still access your account settings to manage or delete your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/settings"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Link>
            <Link
              href="/settings#delete-account"
              className="inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg bg-white text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Note: Account deletion is permanent and cannot be undone. All your flight data will be permanently removed.
          </p>
        </div>

        {/* Benefits Reminder */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Why Subscribe to Log-K?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>EASA & FAA compliant digital logbook</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Automatic flight time calculations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Cloud sync across all devices</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Professional PDF exports</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Real-time weather integration</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Fleet and crew management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
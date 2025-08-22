'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Clock, CreditCard, X } from 'lucide-react'
import Link from 'next/link'
import { getUserSubscriptionStatusClient } from '@/lib/subscription/service'
import type { SubscriptionStatus } from '@/lib/subscription/types'

export default function SubscriptionStatusBanner() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const subscriptionStatus = await getUserSubscriptionStatusClient()
        setStatus(subscriptionStatus)
      } catch (error) {
        console.error('Error loading subscription status:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStatus()
  }, [])

  // Don't show banner if loading, dismissed, or user has active non-trial subscription
  if (loading || dismissed || !status) return null
  if (status.isActive && status.tier !== 'trial' && status.tier !== 'none') return null

  // Show trial expiring soon banner
  if (status.isTrialActive && status.trialDaysRemaining !== null && status.trialDaysRemaining <= 7) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-3" />
              <p className="text-sm text-yellow-800">
                <strong>Your free trial expires in {status.trialDaysRemaining} days.</strong>
                {' '}Choose a plan to keep using all features.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/subscription/choose"
                className="text-sm font-medium text-yellow-700 hover:text-yellow-800 underline"
              >
                View Plans
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show expired trial banner
  if (status.tier === 'none' && status.expiresAt && new Date() > status.expiresAt) {
    return (
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-sm text-red-800">
                <strong>Your trial has expired.</strong>
                {' '}Subscribe now to continue using Log-K.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/subscription/choose"
                className="inline-flex items-center text-sm font-medium bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Subscribe Now
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show no subscription banner (never had trial)
  if (status.tier === 'none' && !status.expiresAt) {
    return (
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
              <p className="text-sm text-blue-800">
                <strong>Start your 4-week free trial</strong>
                {' '}to unlock all features of Log-K.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/subscription/choose"
                className="inline-flex items-center text-sm font-medium bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
'use client'

import { useState } from 'react'
import { X, Save, Calendar, CreditCard, Tag } from 'lucide-react'

interface Subscription {
  id: string
  user_id: string
  subscription_tier: 'none' | 'basic' | 'premium' | 'enterprise'
  subscription_source: 'apple' | 'stripe' | 'promo' | 'admin'
  activated_at: string
  valid_until: string
  apple_transaction_id: string | null
  apple_original_transaction_id: string | null
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  promo_code: string | null
  notes: string | null
  user_profiles: {
    first_name: string | null
    last_name: string | null
    email: string | null
    username: string | null
  }
}

interface SubscriptionEditModalProps {
  subscription: Subscription
  onClose: () => void
  onUpdate: (subscription: Subscription) => void
}

export default function SubscriptionEditModal({ subscription, onClose, onUpdate }: SubscriptionEditModalProps) {
  const [formData, setFormData] = useState({
    subscription_tier: subscription.subscription_tier,
    subscription_source: subscription.subscription_source,
    valid_until: subscription.valid_until.split('T')[0], // Format for date input
    promo_code: subscription.promo_code || '',
    notes: subscription.notes || '',
    apple_transaction_id: subscription.apple_transaction_id || '',
    apple_original_transaction_id: subscription.apple_original_transaction_id || '',
    stripe_subscription_id: subscription.stripe_subscription_id || '',
    stripe_customer_id: subscription.stripe_customer_id || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/subscriptions/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          ...formData,
          valid_until: new Date(formData.valid_until).toISOString()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update subscription')
      }

      const { subscription: updatedSubscription } = await response.json()
      
      // Merge with existing user_profiles data
      const completeSubscription = {
        ...updatedSubscription,
        user_profiles: subscription.user_profiles
      }
      
      onUpdate(completeSubscription)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Subscription</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">User Information</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                {subscription.user_profiles?.first_name} {subscription.user_profiles?.last_name}
              </p>
              <p>{subscription.user_profiles?.email}</p>
              {subscription.user_profiles?.username && (
                <p className="text-xs">@{subscription.user_profiles.username}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Subscription Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Tier
            </label>
            <select
              value={formData.subscription_tier}
              onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Subscription Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Source
            </label>
            <select
              value={formData.subscription_source}
              onChange={(e) => setFormData({ ...formData, subscription_source: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="apple">Apple</option>
              <option value="stripe">Stripe</option>
              <option value="promo">Promo</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Valid Until
            </label>
            <input
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Promo Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              Promo Code
            </label>
            <input
              type="text"
              value={formData.promo_code}
              onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
              placeholder="Enter promo code if applicable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Transaction IDs based on source */}
          {formData.subscription_source === 'apple' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apple Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.apple_transaction_id}
                  onChange={(e) => setFormData({ ...formData, apple_transaction_id: e.target.value })}
                  placeholder="Apple transaction ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apple Original Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.apple_original_transaction_id}
                  onChange={(e) => setFormData({ ...formData, apple_original_transaction_id: e.target.value })}
                  placeholder="Apple original transaction ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {formData.subscription_source === 'stripe' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Subscription ID
                </label>
                <input
                  type="text"
                  value={formData.stripe_subscription_id}
                  onChange={(e) => setFormData({ ...formData, stripe_subscription_id: e.target.value })}
                  placeholder="Stripe subscription ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Customer ID
                </label>
                <input
                  type="text"
                  value={formData.stripe_customer_id}
                  onChange={(e) => setFormData({ ...formData, stripe_customer_id: e.target.value })}
                  placeholder="Stripe customer ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Internal notes about this subscription"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
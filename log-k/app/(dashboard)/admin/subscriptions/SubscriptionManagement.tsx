'use client'

import { useState } from 'react'
import { CreditCard, Users, TrendingUp, Calendar, Search, Filter, Edit, History, AlertCircle } from 'lucide-react'
import SubscriptionEditModal from './SubscriptionEditModal'
import SubscriptionHistoryView from './SubscriptionHistoryView'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  username: string | null
}

interface Subscription {
  id: string
  user_id: string
  subscription_tier: 'none' | 'trial' | 'basic' | 'pro'
  subscription_source: 'apple' | 'stripe' | 'promo' | 'admin'
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
  user_profiles: UserProfile
}

interface SubscriptionStats {
  totalSubscriptions: number
  activeSubscriptions: number
  expiringSubscriptions: number
  activeTrials: number
  expiringTrials: number
  tierBreakdown: {
    none: number
    trial: number
    basic: number
    pro: number
  }
  sourceBreakdown: {
    apple: number
    stripe: number
    promo: number
    admin: number
    trial: number
  }
}

interface SubscriptionManagementProps {
  subscriptions: Subscription[]
  stats: SubscriptionStats
}

export default function SubscriptionManagement({ subscriptions: initialSubscriptions, stats }: SubscriptionManagementProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [viewingHistory, setViewingHistory] = useState<string | null>(null)

  const filteredSubscriptions = subscriptions.filter(sub => {
    const searchMatch = searchTerm === '' || 
      sub.user_profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user_profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user_profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user_profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const tierMatch = filterTier === 'all' || sub.subscription_tier === filterTier
    const sourceMatch = filterSource === 'all' || sub.subscription_source === filterSource
    
    return searchMatch && tierMatch && sourceMatch
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'none': return 'bg-gray-100 text-gray-700'
      case 'trial': return 'bg-green-100 text-green-700'
      case 'basic': return 'bg-blue-100 text-blue-700'
      case 'pro': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'apple': return '🍎'
      case 'stripe': return '💳'
      case 'promo': return '🎟️'
      case 'admin': return '👤'
      case 'trial': return '🧪'
      default: return '❓'
    }
  }

  const isExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow
  }

  const isTrialExpiringSoon = (subscription: Subscription) => {
    if (subscription.subscription_tier !== 'trial') return false
    const expiryDate = new Date(subscription.valid_until)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return expiryDate > new Date() && expiryDate <= threeDaysFromNow
  }

  const getTrialDaysRemaining = (validUntil: string) => {
    const expiryDate = new Date(validUntil)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const handleSubscriptionUpdate = (updatedSubscription: Subscription) => {
    setSubscriptions(prev => 
      prev.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        </div>
        <p className="text-gray-600 mt-1">Manage user subscriptions and billing</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Trials</p>
              <p className="text-2xl font-bold text-blue-600">{stats.activeTrials}</p>
              {stats.expiringTrials > 0 && (
                <p className="text-xs text-orange-600 mt-1">{stats.expiringTrials} expiring</p>
              )}
            </div>
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiringSubscriptions}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Tier Distribution</p>
            <div className="space-y-1 text-sm">
              {stats.tierBreakdown.trial > 0 && (
                <div className="flex justify-between">
                  <span>Trial:</span>
                  <span className="font-medium text-green-600">{stats.tierBreakdown.trial}</span>
                </div>
              )}
              {stats.tierBreakdown.basic > 0 && (
                <div className="flex justify-between">
                  <span>Basic:</span>
                  <span className="font-medium text-blue-600">{stats.tierBreakdown.basic}</span>
                </div>
              )}
              {stats.tierBreakdown.pro > 0 && (
                <div className="flex justify-between">
                  <span>Pro:</span>
                  <span className="font-medium text-purple-600">{stats.tierBreakdown.pro}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="none">None</option>
              <option value="trial">Trial</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
            
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="apple">Apple</option>
              <option value="stripe">Stripe</option>
              <option value="promo">Promo</option>
              <option value="admin">Admin</option>
              <option value="trial">Trial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction IDs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.user_profiles?.first_name} {subscription.user_profiles?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.user_profiles?.email}
                    </div>
                    {subscription.user_profiles?.username && (
                      <div className="text-xs text-gray-400">
                        @{subscription.user_profiles.username}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(subscription.subscription_tier)}`}>
                    {subscription.subscription_tier.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{getSourceIcon(subscription.subscription_source)}</span>
                    <span className="text-sm text-gray-900">
                      {subscription.subscription_source.charAt(0).toUpperCase() + subscription.subscription_source.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(subscription.valid_until).toLocaleDateString()}
                  </div>
                  {isExpired(subscription.valid_until) && (
                    <span className="text-xs text-red-600">Expired</span>
                  )}
                  {!isExpired(subscription.valid_until) && subscription.subscription_tier === 'trial' && (
                    <span className="text-xs text-blue-600">
                      {getTrialDaysRemaining(subscription.valid_until)} days left
                    </span>
                  )}
                  {!isExpired(subscription.valid_until) && isTrialExpiringSoon(subscription) && (
                    <span className="text-xs text-orange-600 font-semibold">⚠️ Trial ending</span>
                  )}
                  {!isExpired(subscription.valid_until) && subscription.subscription_tier !== 'trial' && isExpiringSoon(subscription.valid_until) && (
                    <span className="text-xs text-yellow-600">Expiring soon</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-500">
                    {subscription.apple_transaction_id && (
                      <div>Apple: {subscription.apple_transaction_id.substring(0, 8)}...</div>
                    )}
                    {subscription.stripe_subscription_id && (
                      <div>Stripe: {subscription.stripe_subscription_id.substring(0, 8)}...</div>
                    )}
                    {subscription.promo_code && (
                      <div>Promo: {subscription.promo_code}</div>
                    )}
                    {!subscription.apple_transaction_id && !subscription.stripe_subscription_id && !subscription.promo_code && (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingSubscription(subscription)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Edit subscription"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewingHistory(subscription.user_id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View history"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No subscriptions found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSubscription && (
        <SubscriptionEditModal
          subscription={editingSubscription}
          onClose={() => setEditingSubscription(null)}
          onUpdate={handleSubscriptionUpdate}
        />
      )}

      {/* History View */}
      {viewingHistory && (
        <SubscriptionHistoryView
          userId={viewingHistory}
          onClose={() => setViewingHistory(null)}
        />
      )}
    </div>
  )
}
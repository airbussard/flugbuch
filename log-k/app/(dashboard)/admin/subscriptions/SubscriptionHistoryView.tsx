'use client'

import { useState, useEffect } from 'react'
import { X, Clock, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface HistoryEntry {
  id: string
  user_id: string
  subscription_id: string | null
  event_type: string
  previous_tier: string | null
  new_tier: string | null
  amount: number | null
  currency: string
  payment_method: string | null
  metadata: any
  created_at: string
  user_profiles: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string | null
    username: string | null
  }
}

interface SubscriptionHistoryViewProps {
  userId: string
  onClose: () => void
}

export default function SubscriptionHistoryView({ userId, onClose }: SubscriptionHistoryViewProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [userId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/admin/subscriptions/history?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      const { history } = await response.json()
      setHistory(history)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'upgrade':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'downgrade':
        return <TrendingDown className="h-5 w-5 text-orange-500" />
      case 'activation':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'cancellation':
        return <X className="h-5 w-5 text-red-500" />
      case 'renewal':
        return <Clock className="h-5 w-5 text-purple-500" />
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'upgrade':
        return 'bg-green-100 text-green-800'
      case 'downgrade':
        return 'bg-orange-100 text-orange-800'
      case 'activation':
        return 'bg-blue-100 text-blue-800'
      case 'cancellation':
        return 'bg-red-100 text-red-800'
      case 'renewal':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTier = (tier: string | null) => {
    if (!tier) return 'N/A'
    return tier.charAt(0).toUpperCase() + tier.slice(1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Subscription History</h2>
              {history.length > 0 && history[0].user_profiles && (
                <p className="text-sm text-gray-600 mt-1">
                  {history[0].user_profiles.first_name} {history[0].user_profiles.last_name}
                  {history[0].user_profiles.username && ` (@${history[0].user_profiles.username})`}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading history...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No subscription history found</p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getEventIcon(entry.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventColor(entry.event_type)}`}>
                            {entry.event_type.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          {(entry.previous_tier || entry.new_tier) && (
                            <p className="text-sm text-gray-700">
                              Tier: {formatTier(entry.previous_tier)} → {formatTier(entry.new_tier)}
                            </p>
                          )}
                          
                          {entry.amount && (
                            <p className="text-sm text-gray-700">
                              Amount: {entry.amount} {entry.currency}
                              {entry.payment_method && ` (${entry.payment_method})`}
                            </p>
                          )}
                          
                          {entry.metadata && (
                            <div className="mt-2">
                              <details className="text-xs">
                                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                  Metadata
                                </summary>
                                <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(entry.metadata, null, 2)}
                                </pre>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
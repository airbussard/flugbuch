'use client'

import { useState, useEffect } from 'react'
import { Check, X, Eye, Calendar, Plane, User, Star, MessageSquare, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface PIREP {
  id: string
  icao: string
  author_name: string
  flight_date: string | null
  aircraft_type: string | null
  report_type: string
  title: string
  content: string
  rating: number | null
  created_at: string
  user_id: string
}

export default function PIREPModerationPanel() {
  const [pireps, setPireps] = useState<PIREP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [expandedPireps, setExpandedPireps] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPendingPIREPs()
  }, [])

  const fetchPendingPIREPs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/pireps/pending')
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin privileges required')
        }
        throw new Error('Failed to fetch pending PIREPs')
      }
      
      const data = await response.json()
      setPireps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PIREPs')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (id: string, approve: boolean) => {
    setProcessingId(id)
    
    try {
      const response = await fetch(`/api/pireps/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approve })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update PIREP')
      }
      
      // Remove from list after successful update
      setPireps(prev => prev.filter(p => p.id !== id))
      
      // Show success message
      const action = approve ? 'approved' : 'rejected'
      alert(`PIREP ${action} successfully`)
    } catch (err) {
      alert('Error updating PIREP: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setProcessingId(null)
    }
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedPireps)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedPireps(newExpanded)
  }

  const getReportTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      general: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: 'General' },
      weather: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', label: 'Weather' },
      runway: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', label: 'Runway' },
      approach: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', label: 'Approach' },
      service: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300', label: 'Service' }
    }
    return badges[type] || badges.general
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (pireps.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">
            No pending PIREPs to moderate
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pending PIREPs ({pireps.length})
        </h2>
        <button
          onClick={fetchPendingPIREPs}
          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {pireps.map((pirep) => {
          const badge = getReportTypeBadge(pirep.report_type)
          const isExpanded = expandedPireps.has(pirep.id)
          const isProcessing = processingId === pirep.id
          
          return (
            <div
              key={pirep.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs font-medium rounded">
                      PENDING REVIEW
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                    {renderStars(pirep.rating)}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {pirep.icao} - {pirep.title}
                  </h3>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {pirep.author_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Submitted: {formatDate(pirep.created_at)}
                </div>
                {pirep.flight_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Flight: {formatDate(pirep.flight_date)}
                  </div>
                )}
                {pirep.aircraft_type && (
                  <div className="flex items-center">
                    <Plane className="h-3 w-3 mr-1" />
                    {pirep.aircraft_type}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                {pirep.content.length > 300 && !isExpanded ? (
                  <>
                    {pirep.content.substring(0, 300)}...
                    <button
                      onClick={() => toggleExpanded(pirep.id)}
                      className="text-violet-600 dark:text-violet-400 hover:underline ml-1"
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{pirep.content}</p>
                    {pirep.content.length > 300 && (
                      <button
                        onClick={() => toggleExpanded(pirep.id)}
                        className="text-violet-600 dark:text-violet-400 hover:underline mt-2"
                      >
                        Show less
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => handleApproval(pirep.id, false)}
                  disabled={isProcessing}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleApproval(pirep.id, true)}
                  disabled={isProcessing}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
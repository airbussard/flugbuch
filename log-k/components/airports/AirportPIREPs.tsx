'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Star, Calendar, Plane, User, Filter, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PIREPForm from './PIREPForm'
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

interface AirportPIREPsProps {
  icao: string
}

export default function AirportPIREPs({ icao }: AirportPIREPsProps) {
  const [pireps, setPireps] = useState<PIREP[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [expandedPireps, setExpandedPireps] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPIREPs()
  }, [icao])

  const fetchPIREPs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/pireps/airport/${icao}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch PIREPs')
      }
      
      const data = await response.json()
      setPireps(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PIREPs')
    } finally {
      setLoading(false)
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

  const filteredPireps = selectedType === 'all' 
    ? pireps 
    : pireps.filter(p => p.report_type === selectedType)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pilot Reports (PIREPs)
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pilot Reports (PIREPs)
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add PIREP
        </Button>
      </div>

      {/* Add PIREP Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <PIREPForm
            icao={icao}
            onSuccess={() => {
              setShowForm(false)
              fetchPIREPs()
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All ({pireps.length})
        </button>
        {['general', 'weather', 'runway', 'approach', 'service'].map(type => {
          const count = pireps.filter(p => p.report_type === type).length
          if (count === 0) return null
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
            </button>
          )
        })}
      </div>

      {/* PIREPs List */}
      {error ? (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      ) : filteredPireps.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No pilot reports available for this airport yet.</p>
          <p className="text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPireps.map((pirep) => {
            const badge = getReportTypeBadge(pirep.report_type)
            const isExpanded = expandedPireps.has(pirep.id)
            const shouldTruncate = pirep.content.length > 200
            
            return (
              <div
                key={pirep.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      {renderStars(pirep.rating)}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {pirep.title}
                    </h3>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span className="font-medium">{pirep.author_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(pirep.created_at)}
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
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {shouldTruncate && !isExpanded ? (
                    <>
                      {pirep.content.substring(0, 200)}...
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
                      {shouldTruncate && (
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
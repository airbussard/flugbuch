'use client'

import { useState } from 'react'
import { Star, Send, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PIREPFormProps {
  icao: string
  onSuccess: () => void
  onCancel: () => void
}

export default function PIREPForm({ icao, onSuccess, onCancel }: PIREPFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    report_type: 'general',
    rating: 0,
    flight_date: '',
    aircraft_type: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    
    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }
    
    if (formData.content.length < 50) {
      setError('Content must be at least 50 characters')
      return
    }
    
    if (formData.content.length > 5000) {
      setError('Content must be less than 5000 characters')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/pireps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          icao,
          ...formData,
          rating: formData.rating || null,
          flight_date: formData.flight_date || null,
          aircraft_type: formData.aircraft_type || null
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit PIREP')
      }
      
      // Show success message
      alert(data.message || 'PIREP submitted successfully!')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit PIREP')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Submit Pilot Report for {icao}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Report Type
        </label>
        <select
          value={formData.report_type}
          onChange={(e) => setFormData(prev => ({ ...prev, report_type: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="general">General</option>
          <option value="weather">Weather</option>
          <option value="runway">Runway Condition</option>
          <option value="approach">Approach</option>
          <option value="service">Service/Facilities</option>
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          placeholder="Brief summary of your report"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.title.length}/200 characters
        </p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Report Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          placeholder="Share your experience, observations, or important information about this airport (minimum 50 characters)"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.content.length}/5000 characters (minimum 50)
        </p>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Overall Rating (Optional)
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= formData.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                }`}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: 0 }))}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Flight Date (Optional)
          </label>
          <input
            type="date"
            value={formData.flight_date}
            onChange={(e) => setFormData(prev => ({ ...prev, flight_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Aircraft Type (Optional)
          </label>
          <input
            type="text"
            value={formData.aircraft_type}
            onChange={(e) => setFormData(prev => ({ ...prev, aircraft_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            placeholder="e.g., B737, A320, C172"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !formData.title || !formData.content || formData.content.length < 50}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit PIREP
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Your report will be reviewed by an admin before being published.
      </p>
    </form>
  )
}
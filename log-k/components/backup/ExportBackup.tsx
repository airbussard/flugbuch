'use client'

import { useState } from 'react'
import { Download, Calendar, Plane, Users, Filter, CheckCircle, AlertCircle } from 'lucide-react'

export default function ExportBackup() {
  const [isExporting, setIsExporting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  
  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    includeFlights: true,
    includeAircraft: true,
    includeCrew: true
  })

  const handleExport = async (filtered: boolean = false) => {
    setIsExporting(true)
    setExportStatus('idle')
    setStatusMessage('')

    try {
      let response: Response
      
      if (filtered && (filters.startDate || filters.endDate)) {
        // Filtered export
        response = await fetch('/api/backup/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            includeFlights: filters.includeFlights,
            includeAircraft: filters.includeAircraft,
            includeCrew: filters.includeCrew
          })
        })
      } else {
        // Full export
        response = await fetch('/api/backup/export', {
          method: 'GET'
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Export failed')
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : 'logk-backup.json'

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setExportStatus('success')
      setStatusMessage('Backup exported successfully!')
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setStatusMessage('')
      }, 5000)

    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Export failed')
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setExportStatus('idle')
        setStatusMessage('')
      }, 5000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Backup</h3>
        <p className="text-sm text-gray-600">
          Download all your flight data, aircraft, and crew information as a JSON backup file.
        </p>
      </div>

      {/* Quick Export Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => handleExport(false)}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-5 w-5" />
          {isExporting ? 'Exporting...' : 'Export Full Backup'}
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Export Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.includeFlights}
                onChange={(e) => setFilters({ ...filters, includeFlights: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include Flights</span>
              <Plane className="h-4 w-4 text-gray-400" />
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.includeAircraft}
                onChange={(e) => setFilters({ ...filters, includeAircraft: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include Aircraft</span>
              <Plane className="h-4 w-4 text-gray-400" />
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.includeCrew}
                onChange={(e) => setFilters({ ...filters, includeCrew: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include Crew Members</span>
              <Users className="h-4 w-4 text-gray-400" />
            </label>
          </div>

          <button
            onClick={() => handleExport(true)}
            disabled={isExporting || (!filters.includeFlights && !filters.includeAircraft && !filters.includeCrew)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-5 w-5" />
            {isExporting ? 'Exporting...' : 'Export Filtered Backup'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {exportStatus !== 'idle' && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          exportStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {exportStatus === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{statusMessage}</span>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">What's included in the backup?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            All flight records with compliance data
          </li>
          <li className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Aircraft fleet information
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Crew members and assignments
          </li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          Note: User profile and license data are not included for security reasons.
        </p>
      </div>
    </div>
  )
}
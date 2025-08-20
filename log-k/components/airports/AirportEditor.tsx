'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { airportService, type Airport } from '@/lib/data/airport-service'
import { Button } from '@/components/ui/button'
import { Save, X, Upload, Download, Plus, Search, Loader2 } from 'lucide-react'

interface AirportEditorProps {
  icao?: string
}

export default function AirportEditor({ icao }: AirportEditorProps) {
  const router = useRouter()
  const [airport, setAirport] = useState<Airport | null>(null)
  const [searchQuery, setSearchQuery] = useState(icao || '')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    icao: '',
    iata: '',
    name: '',
    municipality: '',
    country: '',
    lat: 0,
    lon: 0,
    alt: 0,
    type: 'small_airport',
    timezone: ''
  })

  useEffect(() => {
    if (icao) {
      loadAirport(icao)
    }
  }, [icao])

  const loadAirport = async (code: string) => {
    setLoading(true)
    setMessage(null)
    
    try {
      await airportService.loadAirports()
      const foundAirport = await airportService.getAirport(code.toUpperCase())
      
      if (foundAirport) {
        setAirport(foundAirport)
        setFormData({
          icao: foundAirport.icao,
          iata: foundAirport.iata || '',
          name: foundAirport.name,
          municipality: foundAirport.municipality || '',
          country: foundAirport.country,
          lat: foundAirport.lat,
          lon: foundAirport.lon,
          alt: foundAirport.alt,
          type: foundAirport.type,
          timezone: foundAirport.timezone || ''
        })
      } else {
        setMessage({ type: 'error', text: `Airport ${code} not found` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load airport' })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      await loadAirport(searchQuery)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lon' || name === 'alt' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/airports/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save airport')
      }
      
      setMessage({ type: 'success', text: 'Airport saved successfully' })
      
      // Refresh the airport service cache
      await airportService.loadAirports()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save airport' })
    } finally {
      setSaving(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/airports/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `airports_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'CSV exported successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export CSV' })
    }
  }

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/airports/import', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to import CSV')
      }
      
      setMessage({ type: 'success', text: 'CSV imported successfully' })
      
      // Refresh the airport service cache
      await airportService.loadAirports()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to import CSV' })
    }
  }

  const handleCreate = () => {
    setAirport(null)
    setFormData({
      icao: '',
      iata: '',
      name: '',
      municipality: '',
      country: '',
      lat: 0,
      lon: 0,
      alt: 0,
      type: 'small_airport',
      timezone: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter ICAO code..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
        <Button type="button" onClick={handleCreate} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Airport
        </Button>
      </form>

      {/* Import/Export Controls */}
      <div className="flex gap-2">
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <label>
          <Button variant="outline" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </span>
          </Button>
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </label>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Editor Form */}
      {(airport || formData.icao === '') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {airport ? `Edit Airport: ${airport.icao}` : 'Create New Airport'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ICAO Code *
              </label>
              <input
                type="text"
                name="icao"
                value={formData.icao}
                onChange={handleInputChange}
                required
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IATA Code
              </label>
              <input
                type="text"
                name="iata"
                value={formData.iata}
                onChange={handleInputChange}
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Airport Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Municipality
              </label>
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                required
                step="0.000001"
                min="-90"
                max="90"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                name="lon"
                value={formData.lon}
                onChange={handleInputChange}
                required
                step="0.000001"
                min="-180"
                max="180"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Elevation (ft) *
              </label>
              <input
                type="number"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Airport Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="large_airport">Large Airport</option>
                <option value="medium_airport">Medium Airport</option>
                <option value="small_airport">Small Airport</option>
                <option value="heliport">Heliport</option>
                <option value="closed">Closed</option>
                <option value="seaplane_base">Seaplane Base</option>
                <option value="balloonport">Balloonport</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="e.g., Europe/Berlin"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/airports')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
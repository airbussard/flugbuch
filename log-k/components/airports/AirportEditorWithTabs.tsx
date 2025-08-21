'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { airportService, type Airport } from '@/lib/data/airport-service'
import { runwayService, type Runway } from '@/lib/data/runway-service'
import { frequencyService, type Frequency } from '@/lib/data/frequency-service'
import { Button } from '@/components/ui/button'
import { Save, X, Upload, Download, Plus, Search, Loader2, Trash2, Edit2 } from 'lucide-react'

interface AirportEditorProps {
  icao?: string
}

type TabType = 'general' | 'runways' | 'frequencies'

export default function AirportEditorWithTabs({ icao }: AirportEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [airport, setAirport] = useState<Airport | null>(null)
  const [runways, setRunways] = useState<Runway[]>([])
  const [frequencies, setFrequencies] = useState<Frequency[]>([])
  const [searchQuery, setSearchQuery] = useState(icao || '')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form state for general info
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

  // Form state for runway editing
  const [editingRunway, setEditingRunway] = useState<Runway | null>(null)
  const [newRunway, setNewRunway] = useState<Partial<Runway>>({
    ident: '',
    length_ft: 0,
    width_ft: 0,
    surface: '',
    ils: false
  })

  // Form state for frequency editing
  const [editingFrequency, setEditingFrequency] = useState<Frequency | null>(null)
  const [newFrequency, setNewFrequency] = useState<Partial<Frequency>>({
    frequency: '',
    type: '',
    description: ''
  })

  useEffect(() => {
    if (icao) {
      loadAirportData(icao)
    }
  }, [icao])

  const loadAirportData = async (code: string) => {
    setLoading(true)
    setMessage(null)
    
    try {
      // Load airport basic info
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

        // Load runways
        try {
          const response = await fetch(`/api/airports/runways/${code.toUpperCase()}`)
          if (response.ok) {
            const runwayData = await response.json()
            setRunways(runwayData || [])
          }
        } catch (error) {
          console.error('Failed to load runways:', error)
        }

        // Load frequencies
        try {
          const response = await fetch(`/api/airports/frequencies/${code.toUpperCase()}`)
          if (response.ok) {
            const frequencyData = await response.json()
            setFrequencies(frequencyData || [])
          }
        } catch (error) {
          console.error('Failed to load frequencies:', error)
        }
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
      await loadAirportData(searchQuery)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lat' || name === 'lon' || name === 'alt' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSaveGeneral = async () => {
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
      await airportService.loadAirports()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save airport' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveRunways = async () => {
    if (!airport) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch(`/api/airports/runways/${airport.icao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(runways)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save runways')
      }
      
      setMessage({ type: 'success', text: 'Runways saved successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save runways' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFrequencies = async () => {
    if (!airport) return
    
    setSaving(true)
    setMessage(null)
    
    try {
      const response = await fetch(`/api/airports/frequencies/${airport.icao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(frequencies)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save frequencies')
      }
      
      setMessage({ type: 'success', text: 'Frequencies saved successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save frequencies' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddRunway = () => {
    if (newRunway.ident && airport) {
      setRunways([...runways, {
        icao: airport.icao,
        ident: newRunway.ident,
        length_ft: newRunway.length_ft || 0,
        width_ft: newRunway.width_ft || 0,
        surface: newRunway.surface || '',
        ils: newRunway.ils || false
      }])
      setNewRunway({
        ident: '',
        length_ft: 0,
        width_ft: 0,
        surface: '',
        ils: false
      })
    }
  }

  const handleDeleteRunway = (index: number) => {
    setRunways(runways.filter((_, i) => i !== index))
  }

  const handleAddFrequency = () => {
    if (newFrequency.frequency && newFrequency.type && airport) {
      setFrequencies([...frequencies, {
        icao: airport.icao,
        frequency: newFrequency.frequency,
        type: newFrequency.type,
        description: newFrequency.description || ''
      }])
      setNewFrequency({
        frequency: '',
        type: '',
        description: ''
      })
    }
  }

  const handleDeleteFrequency = (index: number) => {
    setFrequencies(frequencies.filter((_, i) => i !== index))
  }

  const frequencyTypes = [
    'ATIS', 'AWOS', 'Tower', 'Ground', 'Clearance', 
    'Approach', 'Departure', 'Center', 'Unicom', 'CTAF', 'Other'
  ]

  const surfaceTypes = [
    'Asphalt', 'Concrete', 'Grass', 'Gravel', 'Dirt', 
    'Sand', 'Water', 'Snow', 'Ice', 'Unknown'
  ]

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
      </form>

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

      {/* Tabs */}
      {airport && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                General Info
              </button>
              <button
                onClick={() => setActiveTab('runways')}
                className={`py-2 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'runways'
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Runways ({runways.length})
              </button>
              <button
                onClick={() => setActiveTab('frequencies')}
                className={`py-2 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'frequencies'
                    ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Frequencies ({frequencies.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Edit Airport: {airport.icao}
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
                </div>
                
                <div className="mt-6">
                  <Button onClick={handleSaveGeneral} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save General Info
                  </Button>
                </div>
              </div>
            )}

            {/* Runways Tab */}
            {activeTab === 'runways' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Manage Runways
                </h2>
                
                {/* Existing Runways */}
                <div className="space-y-2 mb-6">
                  {runways.map((runway, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">{runway.ident}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {runway.length_ft} x {runway.width_ft} ft
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {runway.surface}
                        </span>
                        {runway.ils && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            ILS
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteRunway(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Runway */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Add New Runway
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Runway ID (e.g., 09/27)"
                      value={newRunway.ident}
                      onChange={(e) => setNewRunway({ ...newRunway, ident: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Length (ft)"
                      value={newRunway.length_ft || ''}
                      onChange={(e) => setNewRunway({ ...newRunway, length_ft: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Width (ft)"
                      value={newRunway.width_ft || ''}
                      onChange={(e) => setNewRunway({ ...newRunway, width_ft: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                      value={newRunway.surface}
                      onChange={(e) => setNewRunway({ ...newRunway, surface: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Surface</option>
                      {surfaceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRunway.ils || false}
                        onChange={(e) => setNewRunway({ ...newRunway, ils: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">ILS Available</span>
                    </label>
                    <Button onClick={handleAddRunway} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Runway
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button onClick={handleSaveRunways} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Runways
                  </Button>
                </div>
              </div>
            )}

            {/* Frequencies Tab */}
            {activeTab === 'frequencies' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Manage Frequencies
                </h2>
                
                {/* Existing Frequencies */}
                <div className="space-y-2 mb-6">
                  {frequencies.map((freq, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">{freq.frequency} MHz</span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                          {freq.type}
                        </span>
                        {freq.description && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {freq.description}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteFrequency(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Frequency */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Add New Frequency
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Frequency (e.g., 118.650)"
                      value={newFrequency.frequency}
                      onChange={(e) => setNewFrequency({ ...newFrequency, frequency: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                      value={newFrequency.type}
                      onChange={(e) => setNewFrequency({ ...newFrequency, type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      {frequencyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newFrequency.description}
                      onChange={(e) => setNewFrequency({ ...newFrequency, description: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                    />
                    <Button onClick={handleAddFrequency} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Frequency
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button onClick={handleSaveFrequencies} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Frequencies
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
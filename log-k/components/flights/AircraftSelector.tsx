'use client'

import { useState, useEffect } from 'react'
import { Plane, Search, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
  manufacturer?: string | null
  model?: string | null
  engine_type?: string | null
  complex_aircraft?: boolean
  high_performance?: boolean
  tailwheel?: boolean
  glass_panel?: boolean
}

interface AircraftSelectorProps {
  value: string | null
  onChange: (aircraftId: string | null, registration: string, aircraftType: string) => void
  disabled?: boolean
}

export default function AircraftSelector({ 
  value, 
  onChange,
  disabled = false 
}: AircraftSelectorProps) {
  const [aircraft, setAircraft] = useState<Aircraft[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null)

  useEffect(() => {
    loadAircraft()
  }, [])

  useEffect(() => {
    if (value && aircraft.length > 0) {
      const selected = aircraft.find(a => a.id === value)
      setSelectedAircraft(selected || null)
    }
  }, [value, aircraft])

  const loadAircraft = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const { data, error } = await supabase
      .from('aircrafts')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('registration')

    if (!error && data) {
      setAircraft(data)
    }
    setLoading(false)
  }

  const filteredAircraft = aircraft.filter(plane => {
    if (!searchTerm) return true
    
    const search = searchTerm.toLowerCase()
    return (
      plane.registration.toLowerCase().includes(search) ||
      plane.aircraft_type.toLowerCase().includes(search) ||
      plane.manufacturer?.toLowerCase().includes(search) ||
      plane.model?.toLowerCase().includes(search)
    )
  })

  const handleSelect = (plane: Aircraft) => {
    setSelectedAircraft(plane)
    onChange(plane.id, plane.registration, plane.aircraft_type)
    setIsOpen(false)
    setSearchTerm('')
  }

  const getAircraftFeatures = (plane: Aircraft) => {
    const features = []
    if (plane.complex_aircraft) features.push('Complex')
    if (plane.high_performance) features.push('HP')
    if (plane.tailwheel) features.push('TW')
    if (plane.glass_panel) features.push('Glass')
    return features
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Flugzeug *
      </label>
      
      {/* Selected Aircraft Display */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md
                   ${disabled 
                     ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-50' 
                     : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'}
                   ${isOpen ? 'ring-2 ring-violet-500 border-violet-500' : 'border-gray-300 dark:border-gray-600'}
                   text-left transition-colors`}
      >
        <div className="flex items-center">
          <Plane className="h-4 w-4 text-gray-400 mr-2" />
          {selectedAircraft ? (
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedAircraft.registration}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">
                {selectedAircraft.aircraft_type}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              Flugzeug auswählen...
            </span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Suche Registration oder Typ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                autoFocus
              />
            </div>
          </div>

          {/* Aircraft List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Lade Flugzeuge...
              </div>
            ) : filteredAircraft.length > 0 ? (
              filteredAircraft.map(plane => (
                <button
                  key={plane.id}
                  type="button"
                  onClick={() => handleSelect(plane)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                            ${selectedAircraft?.id === plane.id ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {plane.registration}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {plane.aircraft_type}
                        </span>
                      </div>
                      {plane.manufacturer && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {plane.manufacturer} {plane.model}
                        </p>
                      )}
                    </div>
                    {getAircraftFeatures(plane).length > 0 && (
                      <div className="flex gap-1">
                        {getAircraftFeatures(plane).map(feature => (
                          <span
                            key={feature}
                            className="px-2 py-1 text-xs font-medium rounded-full
                                     bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-3">
                  {searchTerm ? 'Kein Flugzeug gefunden' : 'Keine Flugzeuge in der Flotte'}
                </p>
                <a
                  href="/fleet/new"
                  className="inline-flex items-center text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Flugzeug hinzufügen
                </a>
              </div>
            )}
          </div>

          {/* Add New Aircraft Link */}
          {filteredAircraft.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/fleet/new"
                className="flex items-center justify-center text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400"
              >
                <Plus className="h-4 w-4 mr-1" />
                Neues Flugzeug zur Flotte hinzufügen
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { Plane, Calendar, Gauge, Settings, Navigation, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
  serial_number: string | null
  engine_type: string | null
  first_flight: string | null
  aircraft_class: 'SEP' | 'MEP' | 'SET' | 'MET' | null
  default_condition: 'VFR' | 'IFR' | null
  complex_aircraft: boolean
  high_performance: boolean
  tailwheel: boolean
  glass_panel: boolean
}

interface Stats {
  totalFlights: number
  totalBlockTime: number
  totalLandings: number
  totalPicTime: number
  totalSicTime: number
  totalNightTime: number
  totalIfrTime: number
  totalVfrTime: number
}

export default function AircraftDetail({ 
  aircraft, 
  stats 
}: { 
  aircraft: Aircraft
  stats: Stats 
}) {
  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }
  
  const getClassBadgeColor = (aircraftClass: string | null) => {
    switch (aircraftClass) {
      case 'SEP': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'MEP': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'SET': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'MET': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }
  
  const features = [
    { key: 'complex_aircraft', label: 'Complex', value: aircraft.complex_aircraft },
    { key: 'high_performance', label: 'High Performance', value: aircraft.high_performance },
    { key: 'tailwheel', label: 'Tailwheel', value: aircraft.tailwheel },
    { key: 'glass_panel', label: 'Glass Panel', value: aircraft.glass_panel },
  ]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
            <Plane className="h-8 w-8 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {aircraft.registration}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {aircraft.aircraft_type}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {aircraft.aircraft_class && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getClassBadgeColor(aircraft.aircraft_class)}`}>
                  {aircraft.aircraft_class}
                </span>
              )}
              {aircraft.default_condition && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                  {aircraft.default_condition}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <Link href={`/fleet/${aircraft.id}/edit`}>
          <Button variant="outline">
            Edit Aircraft
          </Button>
        </Link>
      </div>
      
      {/* Aircraft Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {aircraft.serial_number && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Settings className="h-4 w-4 mr-2" />
            S/N: {aircraft.serial_number}
          </div>
        )}
        
        {aircraft.first_flight && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            First Flight: {new Date(aircraft.first_flight).toLocaleDateString('en-US')}
          </div>
        )}
        
        {aircraft.engine_type && (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Gauge className="h-4 w-4 mr-2" />
            Engine: {aircraft.engine_type}
          </div>
        )}
      </div>
      
      {/* Features */}
      {features.filter(f => f.value).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {features.filter(f => f.value).map(feature => (
            <span
              key={feature.key}
              className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-sm font-medium rounded"
            >
              {feature.label}
            </span>
          ))}
        </div>
      )}
      
      {/* Statistics */}
      <div className="border-t dark:border-gray-700 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Usage Statistics
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalFlights}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total Flights
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalBlockTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Block Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalLandings}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Landings
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalNightTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Night Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalPicTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              PIC Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalSicTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              SIC Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalIfrTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              IFR Time
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatHours(stats.totalVfrTime)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              VFR Time
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
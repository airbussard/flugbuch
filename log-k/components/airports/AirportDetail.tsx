import { Airport } from '@/lib/data/airport-service'
import { MapPin, Plane, Globe, Clock, Ruler, Navigation } from 'lucide-react'

interface AirportDetailProps {
  airport: Airport
}

export default function AirportDetail({ airport }: AirportDetailProps) {
  const getAirportTypeLabel = (type: string) => {
    switch (type) {
      case 'large':
      case 'large_airport':
        return 'Large Airport'
      case 'medium':
      case 'medium_airport':
        return 'Medium Airport'
      case 'small':
      case 'small_airport':
        return 'Small Airport'
      case 'heliport':
        return 'Heliport'
      case 'closed':
        return 'Closed'
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const getAirportTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'large':
      case 'large_airport':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'medium':
      case 'medium_airport':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'small':
      case 'small_airport':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'heliport':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {airport.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{airport.municipality}, {airport.country}</span>
              </div>
              {airport.timezone && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{airport.timezone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAirportTypeBadgeColor(airport.type)}`}>
              {getAirportTypeLabel(airport.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Codes */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Airport Codes
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-violet-500" />
                <span className="font-mono font-medium text-gray-900 dark:text-white">
                  {airport.icao}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">ICAO</span>
              </div>
              {airport.iata && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="font-mono font-medium text-gray-900 dark:text-white">
                    {airport.iata}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">IATA</span>
                </div>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Coordinates
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-green-500" />
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {airport.lat.toFixed(6)}°, {airport.lon.toFixed(6)}°
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Lat: {airport.lat > 0 ? 'N' : 'S'} {Math.abs(airport.lat).toFixed(4)}°<br />
                Lon: {airport.lon > 0 ? 'E' : 'W'} {Math.abs(airport.lon).toFixed(4)}°
              </div>
            </div>
          </div>

          {/* Elevation */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Elevation
            </h3>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {airport.alt} ft
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({Math.round(airport.alt * 0.3048)} m)
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information Grid */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Additional Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Country:</span>
              <p className="font-medium text-gray-900 dark:text-white">{airport.country}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Municipality:</span>
              <p className="font-medium text-gray-900 dark:text-white">{airport.municipality || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <p className="font-medium text-gray-900 dark:text-white">{getAirportTypeLabel(airport.type)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Timezone:</span>
              <p className="font-medium text-gray-900 dark:text-white">{airport.timezone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
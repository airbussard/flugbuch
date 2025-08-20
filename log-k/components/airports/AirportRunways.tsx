'use client'

import { useState, useEffect } from 'react'
import { runwayService, type Runway } from '@/lib/data/runway-service'
import { Plane, Loader2, Navigation, Lightbulb, TrendingUp } from 'lucide-react'

interface AirportRunwaysProps {
  icao: string
}

export default function AirportRunways({ icao }: AirportRunwaysProps) {
  const [runways, setRunways] = useState<Runway[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRunways = async () => {
      setLoading(true)
      try {
        const data = await runwayService.getRunways(icao)
        setRunways(data)
      } catch (error) {
        console.error('Failed to load runways:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRunways()
  }, [icao])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-green-500" />
          Start- und Landebahnen
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      </div>
    )
  }

  if (runways.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-green-500" />
          Start- und Landebahnen
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Keine Runway-Informationen verfügbar</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Plane className="h-5 w-5 text-green-500" />
        Start- und Landebahnen
      </h2>
      
      <div className="space-y-4">
        {runways.map((runway, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            {/* Runway Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {runway.ident}
              </h3>
              <div className="flex items-center gap-2">
                {runway.inUse && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">
                    In Betrieb
                  </span>
                )}
                {runway.lighted && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-medium flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Beleuchtet
                  </span>
                )}
              </div>
            </div>

            {/* Runway Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Länge</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {runway.length.toLocaleString()} ft
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({runwayService.feetToMeters(runway.length)}m)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Breite</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {runway.width} ft
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({runwayService.feetToMeters(runway.width)}m)
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Oberfläche</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {runway.surface}
                </p>
              </div>
              {runway.slope && runway.slope !== 0 && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Neigung</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {runway.slope.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            {/* Runway Directions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Direction */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {runway.left.ident}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {runway.left.heading}°
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  {runway.left.elevation && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Elevation: {runway.left.elevation} ft
                    </p>
                  )}
                  {runway.left.displaced_threshold && runway.left.displaced_threshold > 0 && (
                    <p className="text-orange-600 dark:text-orange-400">
                      Versetzte Schwelle: {runway.left.displaced_threshold} ft
                    </p>
                  )}
                  {runway.left.lat && runway.left.lon && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {runway.left.lat.toFixed(4)}°, {runway.left.lon.toFixed(4)}°
                    </p>
                  )}
                </div>
              </div>

              {/* Right Direction */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {runway.right.ident}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {runway.right.heading}°
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  {runway.right.elevation && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Elevation: {runway.right.elevation} ft
                    </p>
                  )}
                  {runway.right.displaced_threshold && runway.right.displaced_threshold > 0 && (
                    <p className="text-orange-600 dark:text-orange-400">
                      Versetzte Schwelle: {runway.right.displaced_threshold} ft
                    </p>
                  )}
                  {runway.right.lat && runway.right.lon && (
                    <p className="text-gray-600 dark:text-gray-400">
                      {runway.right.lat.toFixed(4)}°, {runway.right.lon.toFixed(4)}°
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
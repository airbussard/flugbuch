'use client'

import { useState, useEffect } from 'react'
import { Cloud, Wind, Eye, Thermometer, Droplets, Compass, AlertTriangle, Loader2 } from 'lucide-react'

interface AirportWeatherProps {
  icao: string
}

interface METARData {
  raw: string
  station: string
  time: string
  auto?: boolean
  wind?: {
    direction: number | 'VRB'
    speed: number
    gust?: number
    unit: string
  }
  visibility?: {
    value: number
    unit: string
  }
  weather?: string[]
  clouds?: Array<{
    type: string
    height: number
  }>
  temperature?: number
  dewpoint?: number
  altimeter?: {
    value: number
    unit: string
  }
  remarks?: string
}

export default function AirportWeather({ icao }: AirportWeatherProps) {
  const [metarData, setMetarData] = useState<METARData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMETAR = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/weather/metar?icao=${icao}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch METAR data')
        }
        
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        // Parse the raw METAR from aviation weather API
        if (Array.isArray(data) && data.length > 0) {
          const metar = data[0]
          setMetarData({
            raw: metar.rawOb || metar.raw_text || '',
            station: metar.icaoId || icao,
            time: metar.reportTime || new Date().toISOString(),
            auto: metar.rawOb?.includes('AUTO'),
            wind: metar.wdir !== undefined && metar.wspd !== undefined ? {
              direction: metar.wdir === 'VRB' ? 'VRB' : parseInt(metar.wdir),
              speed: parseInt(metar.wspd),
              gust: metar.wgst ? parseInt(metar.wgst) : undefined,
              unit: 'KT'
            } : undefined,
            visibility: metar.visib ? {
              value: parseFloat(metar.visib),
              unit: 'SM'
            } : undefined,
            temperature: metar.temp !== undefined ? parseInt(metar.temp) : undefined,
            dewpoint: metar.dewp !== undefined ? parseInt(metar.dewp) : undefined,
            altimeter: metar.altim ? {
              value: parseFloat(metar.altim),
              unit: 'inHg'
            } : undefined,
            clouds: metar.clouds ? metar.clouds.map((cloud: any) => ({
              type: cloud.cover,
              height: cloud.base
            })) : [],
            weather: metar.wxString ? [metar.wxString] : []
          })
        } else {
          setError('No METAR data available for this airport')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMETAR()
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchMETAR, 600000)
    return () => clearInterval(interval)
  }, [icao])

  const getCloudDescription = (type: string) => {
    switch (type) {
      case 'FEW': return 'Few'
      case 'SCT': return 'Scattered'
      case 'BKN': return 'Broken'
      case 'OVC': return 'Overcast'
      case 'CLR': return 'Clear'
      case 'SKC': return 'Sky Clear'
      case 'NSC': return 'No Significant Cloud'
      case 'CAVOK': return 'Ceiling and Visibility OK'
      default: return type
    }
  }

  const getWeatherDescription = (code: string) => {
    const intensity = code.startsWith('+') ? 'Heavy ' : code.startsWith('-') ? 'Light ' : ''
    const baseCode = code.replace(/^[+-]/, '')
    
    const weatherCodes: Record<string, string> = {
      'RA': 'Rain',
      'SN': 'Snow',
      'DZ': 'Drizzle',
      'FG': 'Fog',
      'BR': 'Mist',
      'HZ': 'Haze',
      'FU': 'Smoke',
      'SA': 'Sand',
      'DU': 'Dust',
      'SQ': 'Squall',
      'FC': 'Funnel Cloud',
      'TS': 'Thunderstorm',
      'SH': 'Showers',
      'GR': 'Hail',
      'GS': 'Small Hail',
      'UP': 'Unknown Precipitation',
      'VA': 'Volcanic Ash',
      'VC': 'In Vicinity',
      'MI': 'Shallow',
      'BC': 'Patches',
      'PR': 'Partial',
      'DR': 'Low Drifting',
      'BL': 'Blowing',
      'FZ': 'Freezing'
    }
    
    return intensity + (weatherCodes[baseCode] || baseCode)
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Weather (METAR)
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Weather (METAR)
        </h2>
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!metarData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Weather (METAR)
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No weather data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Weather (METAR)
          </h2>
          {metarData.auto && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              AUTO
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {metarData.time}
        </p>
      </div>

      {/* Raw METAR */}
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
          {metarData.raw}
        </p>
      </div>

      {/* Decoded Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Wind */}
        {metarData.wind && (
          <div className="flex items-start space-x-3">
            <Wind className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Wind</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.wind.direction === 'VRB' ? 'Variable' : `${metarData.wind.direction}°`} at {metarData.wind.speed} {metarData.wind.unit}
                {metarData.wind.gust && ` gusting ${metarData.wind.gust} ${metarData.wind.unit}`}
              </p>
            </div>
          </div>
        )}

        {/* Visibility */}
        {metarData.visibility && (
          <div className="flex items-start space-x-3">
            <Eye className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Visibility</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.visibility.value} {metarData.visibility.unit}
              </p>
            </div>
          </div>
        )}

        {/* Temperature */}
        {metarData.temperature !== undefined && (
          <div className="flex items-start space-x-3">
            <Thermometer className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Temperature</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.temperature}°C
                {metarData.dewpoint !== undefined && ` / Dew: ${metarData.dewpoint}°C`}
              </p>
            </div>
          </div>
        )}

        {/* Altimeter */}
        {metarData.altimeter && (
          <div className="flex items-start space-x-3">
            <Compass className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Altimeter</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.altimeter.value} {metarData.altimeter.unit}
              </p>
            </div>
          </div>
        )}

        {/* Weather Phenomena */}
        {metarData.weather && metarData.weather.length > 0 && (
          <div className="flex items-start space-x-3">
            <Droplets className="h-5 w-5 text-cyan-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Weather</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.weather.map(w => getWeatherDescription(w)).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Clouds */}
        {metarData.clouds && metarData.clouds.length > 0 && (
          <div className="flex items-start space-x-3">
            <Cloud className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Clouds</p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metarData.clouds.map((cloud, idx) => (
                  <div key={idx}>
                    {getCloudDescription(cloud.type)} at {cloud.height} ft
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remarks */}
      {metarData.remarks && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Remarks</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{metarData.remarks}</p>
        </div>
      )}
    </div>
  )
}
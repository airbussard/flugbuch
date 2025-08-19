'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MAJOR_AIRPORTS, type Airport } from '@/lib/data/major-airports'
import { Loader2 } from 'lucide-react'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface AirportWeather {
  icao: string
  flightCategory: 'VFR' | 'MVFR' | 'IFR' | 'LIFR' | 'UNKNOWN'
  rawText?: string
  windSpeed?: number
  visibility?: number
  temperature?: number
  observationTime?: string
}

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

export default function AirportWeatherMap() {
  const [weatherData, setWeatherData] = useState<Map<string, AirportWeather>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch weather data for all airports
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true)
        const icaoCodes = MAJOR_AIRPORTS.map(a => a.icao)
        
        const response = await fetch('/api/weather/batch-metar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ icaoCodes })
        })
        
        if (!response.ok) throw new Error('Failed to fetch weather data')
        
        const data = await response.json()
        const weatherMap = new Map<string, AirportWeather>()
        
        data.forEach((metar: AirportWeather) => {
          weatherMap.set(metar.icao, metar)
        })
        
        setWeatherData(weatherMap)
        setError(null)
      } catch (err) {
        console.error('Error fetching weather:', err)
        setError('Failed to load weather data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchWeatherData()
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Get color based on flight category
  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'VFR': return '#10b981' // Green
      case 'MVFR': return '#f59e0b' // Yellow/Amber
      case 'IFR': return '#ef4444' // Red
      case 'LIFR': return '#7c3aed' // Purple
      default: return '#6b7280' // Gray for unknown
    }
  }

  // Format observation time
  const formatTime = (time?: string) => {
    if (!time) return 'N/A'
    try {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return time
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Airport Weather Map</h3>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Airport Weather Map</h3>
        <div className="h-96 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Airport Weather Map</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>VFR</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>MVFR</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>IFR</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>LIFR</span>
          </div>
        </div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={[50.1109, 8.6821]} // Center on Frankfurt
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {MAJOR_AIRPORTS.map((airport) => {
            const weather = weatherData.get(airport.icao)
            const category = weather?.flightCategory || 'UNKNOWN'
            
            return (
              <CircleMarker
                key={airport.icao}
                center={[airport.lat, airport.lng]}
                radius={8}
                fillColor={getMarkerColor(category)}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-sm">{airport.icao} - {airport.name}</h4>
                    <p className="text-xs text-gray-600">{airport.city}, {airport.country}</p>
                    
                    {weather ? (
                      <>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Category:</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              category === 'VFR' ? 'bg-green-100 text-green-700' :
                              category === 'MVFR' ? 'bg-amber-100 text-amber-700' :
                              category === 'IFR' ? 'bg-red-100 text-red-700' :
                              category === 'LIFR' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {category}
                            </span>
                          </div>
                          
                          {weather.temperature !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Temp:</span>
                              <span className="text-xs font-medium">{weather.temperature}°C</span>
                            </div>
                          )}
                          
                          {weather.windSpeed !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Wind:</span>
                              <span className="text-xs font-medium">{weather.windSpeed} kt</span>
                            </div>
                          )}
                          
                          {weather.visibility !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Visibility:</span>
                              <span className="text-xs font-medium">{weather.visibility} SM</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Updated:</span>
                            <span className="text-xs font-medium">{formatTime(weather.observationTime)}</span>
                          </div>
                        </div>
                        
                        {weather.rawText && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-mono text-gray-600 break-all">{weather.rawText}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">No weather data available</p>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Weather data updates every 10 minutes. Click on airports for details.
      </p>
    </div>
  )
}
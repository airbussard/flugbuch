'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Wind, Cloud, Eye, Gauge, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  fetchMETAR, 
  fetchTAF, 
  fetchWeatherForAirports,
  saveFavoriteAirport,
  type WeatherData 
} from '@/lib/weather/weather-service'

interface WeatherDashboardProps {
  initialFavorites: string[]
}

export default function WeatherDashboard({ initialFavorites }: WeatherDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map())
  const [favorites, setFavorites] = useState<string[]>(initialFavorites)
  const [loading, setLoading] = useState(false)
  const [selectedAirport, setSelectedAirport] = useState<string>('')

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoritesWeather()
    }
  }, [])

  const loadFavoritesWeather = async () => {
    setLoading(true)
    const data = await fetchWeatherForAirports(favorites)
    setWeatherData(data)
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length !== 4) return
    
    const icaoCode = searchQuery.toUpperCase()
    setLoading(true)
    
    const [metar, taf] = await Promise.all([
      fetchMETAR(icaoCode),
      fetchTAF(icaoCode)
    ])
    
    if (metar || taf) {
      const newData = new Map(weatherData)
      newData.set(icaoCode, { 
        metar: metar || undefined, 
        taf: taf || undefined 
      })
      setWeatherData(newData)
      setSelectedAirport(icaoCode)
    }
    
    setLoading(false)
    setSearchQuery('')
  }

  const toggleFavorite = async (icaoCode: string) => {
    if (favorites.includes(icaoCode)) {
      setFavorites(favorites.filter(f => f !== icaoCode))
    } else {
      setFavorites([...favorites, icaoCode])
      await saveFavoriteAirport(icaoCode)
    }
  }

  const getFlightCategoryColor = (category?: string) => {
    switch (category) {
      case 'VFR': return 'text-green-600 bg-green-100'
      case 'MVFR': return 'text-blue-600 bg-blue-100'
      case 'IFR': return 'text-red-600 bg-red-100'
      case 'LIFR': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter ICAO code (e.g., KJFK)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={4}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Favorite Airports
          </h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map(icao => (
              <button
                key={icao}
                onClick={() => setSelectedAirport(icao)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedAirport === icao
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {icao}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weather Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from(weatherData.entries()).map(([icao, data]) => (
          <div 
            key={icao} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-bold text-white">{icao}</h2>
                </div>
                <button
                  onClick={() => toggleFavorite(icao)}
                  className="text-white hover:text-yellow-300 transition-colors"
                >
                  <Star 
                    className={`h-5 w-5 ${
                      favorites.includes(icao) ? 'fill-current' : ''
                    }`} 
                  />
                </button>
              </div>
            </div>

            {/* METAR Section */}
            {data.metar && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">METAR</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getFlightCategoryColor(data.metar.flightCategory)
                  }`}>
                    {data.metar.flightCategory}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {data.metar.windDirection}° / {data.metar.windSpeed}kt
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {data.metar.visibility} mi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {data.metar.skyCondition[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {data.metar.altimeter}" Hg
                    </span>
                  </div>
                </div>
                
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
                  {data.metar.rawText}
                </div>
              </div>
            )}

            {/* TAF Section */}
            {data.taf && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">TAF</h3>
                <div className="space-y-2 mb-3">
                  {data.taf.forecast.slice(0, 3).map((fc, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        {new Date(fc.from).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {' - '}
                      Wind {fc.windDirection}°/{fc.windSpeed}kt, 
                      Vis {fc.visibility}mi
                    </div>
                  ))}
                </div>
                
                <details className="cursor-pointer">
                  <summary className="text-sm text-purple-600 hover:text-purple-700">
                    Show raw TAF
                  </summary>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
                    {data.taf.rawText}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {weatherData.size === 0 && !loading && (
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Search for an airport to view weather information
          </p>
        </div>
      )}
    </div>
  )
}
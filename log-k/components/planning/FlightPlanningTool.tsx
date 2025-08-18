'use client'

import { useState } from 'react'
import { Calculator, Map, Cloud, FileText, Plane, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AirportMap from '@/lib/maps/airport-map'
import { fetchWeatherForAirports } from '@/lib/weather/weather-service'

interface FlightPlan {
  departure: string
  arrival: string
  alternates: string[]
  cruiseAltitude: number
  cruiseSpeed: number
  fuelFlow: number
  distance?: number
  flightTime?: number
  fuelRequired?: number
}

export default function FlightPlanningTool() {
  const [plan, setPlan] = useState<FlightPlan>({
    departure: '',
    arrival: '',
    alternates: [],
    cruiseAltitude: 10000,
    cruiseSpeed: 150,
    fuelFlow: 10
  })
  
  const [alternateInput, setAlternateInput] = useState('')
  const [calculations, setCalculations] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<Map<string, any> | null>(null)
  const [activeTab, setActiveTab] = useState<'route' | 'weather' | 'calculations'>('route')

  const handleCalculate = () => {
    // Simple great circle distance calculation (for demo)
    const distance = Math.random() * 500 + 100 // Mock calculation
    const flightTime = distance / plan.cruiseSpeed
    const fuelRequired = flightTime * plan.fuelFlow * 1.3 // 30% reserve
    
    setCalculations({
      distance: distance.toFixed(1),
      flightTime: flightTime.toFixed(1),
      fuelRequired: fuelRequired.toFixed(1),
      groundSpeed: (plan.cruiseSpeed * 0.95).toFixed(0), // Mock headwind
      ete: `${Math.floor(flightTime)}:${Math.round((flightTime % 1) * 60).toString().padStart(2, '0')}`
    })
    
    setPlan({
      ...plan,
      distance,
      flightTime,
      fuelRequired
    })
  }

  const addAlternate = () => {
    if (alternateInput && alternateInput.length === 4) {
      setPlan({
        ...plan,
        alternates: [...plan.alternates, alternateInput.toUpperCase()]
      })
      setAlternateInput('')
    }
  }

  const fetchWeather = async () => {
    const airports = [plan.departure, plan.arrival, ...plan.alternates].filter(Boolean)
    const data = await fetchWeatherForAirports(airports)
    setWeatherData(data)
    setActiveTab('weather')
  }

  const generateNavLog = () => {
    const navLog = {
      flightPlan: plan,
      calculations,
      weather: weatherData,
      generated: new Date().toISOString()
    }
    
    // Download as JSON (in production, generate PDF)
    const blob = new Blob([JSON.stringify(navLog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `navlog_${plan.departure}_${plan.arrival}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Flight Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Departure (ICAO)
            </label>
            <input
              type="text"
              value={plan.departure}
              onChange={(e) => setPlan({ ...plan, departure: e.target.value.toUpperCase() })}
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="KJFK"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arrival (ICAO)
            </label>
            <input
              type="text"
              value={plan.arrival}
              onChange={(e) => setPlan({ ...plan, arrival: e.target.value.toUpperCase() })}
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="KLAX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alternates
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={alternateInput}
                onChange={(e) => setAlternateInput(e.target.value.toUpperCase())}
                maxLength={4}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="KLAS"
              />
              <Button onClick={addAlternate} size="sm">Add</Button>
            </div>
            {plan.alternates.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {plan.alternates.map((alt, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {alt}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cruise Altitude (ft)
            </label>
            <input
              type="number"
              value={plan.cruiseAltitude}
              onChange={(e) => setPlan({ ...plan, cruiseAltitude: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cruise Speed (kts)
            </label>
            <input
              type="number"
              value={plan.cruiseSpeed}
              onChange={(e) => setPlan({ ...plan, cruiseSpeed: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fuel Flow (gph)
            </label>
            <input
              type="number"
              value={plan.fuelFlow}
              onChange={(e) => setPlan({ ...plan, fuelFlow: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button onClick={handleCalculate} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
          <Button onClick={fetchWeather} variant="outline" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Get Weather
          </Button>
          <Button onClick={generateNavLog} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Nav Log
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('route')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'route'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map className="h-4 w-4 inline mr-2" />
              Route Map
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'weather'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Cloud className="h-4 w-4 inline mr-2" />
              Weather
            </button>
            <button
              onClick={() => setActiveTab('calculations')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'calculations'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="h-4 w-4 inline mr-2" />
              Calculations
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Route Map Tab */}
          {activeTab === 'route' && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Interactive route map visualization (requires Mapbox token)
              </p>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Map visualization would appear here
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Configure Mapbox token to enable
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Weather Tab */}
          {activeTab === 'weather' && (
            <div>
              {weatherData ? (
                <div className="space-y-4">
                  {Array.from(weatherData.entries()).map(([icao, data]: [string, any]) => (
                    <div key={icao} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{icao}</h3>
                      {data.metar && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p className="font-mono">{data.metar.rawText}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Click "Get Weather" to fetch current conditions
                </p>
              )}
            </div>
          )}

          {/* Calculations Tab */}
          {activeTab === 'calculations' && calculations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Distance</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculations.distance} nm
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Flight Time</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculations.ete}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Fuel Required</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calculations.fuelRequired} gal
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
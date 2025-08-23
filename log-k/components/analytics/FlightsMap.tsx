'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { airportService, type Airport } from '@/lib/data/airport-service'
import { Loader2, MapPin, Plane, Calendar } from 'lucide-react'
import YearFilter from './YearFilter'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
)

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

interface Flight {
  id: string
  flight_date: string
  departure_airport: string
  arrival_airport: string
  registration: string
  aircraft_type: string
  block_time: number | null
}

interface FlightsMapProps {
  flights: Flight[]
}

export default function FlightsMap({ flights }: FlightsMapProps) {
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [customIcons, setCustomIcons] = useState<any>({})
  const [flightRoutes, setFlightRoutes] = useState<Array<{
    flight: Flight
    departure: Airport | null
    arrival: Airport | null
  }>>([])

  // Get unique years from flights
  const years = Array.from(new Set(flights.map(f => new Date(f.flight_date).getFullYear())))
    .sort((a, b) => b - a)

  // Filter flights by selected year
  const filteredFlights = selectedYear 
    ? flights.filter(f => new Date(f.flight_date).getFullYear() === selectedYear)
    : flights

  // Initialize Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        import('leaflet/dist/images/marker-icon-2x.png').then((markerIcon2x) => {
          import('leaflet/dist/images/marker-icon.png').then((markerIcon) => {
            import('leaflet/dist/images/marker-shadow.png').then((markerShadow) => {
              delete (L.Icon.Default.prototype as any)._getIconUrl
              L.Icon.Default.mergeOptions({
                iconUrl: markerIcon.default.src,
                iconRetinaUrl: markerIcon2x.default.src,
                shadowUrl: markerShadow.default.src,
              })

              // Create custom icons
              const airportIcon = L.divIcon({
                html: `
                  <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                className: ''
              })

              setCustomIcons({ airport: airportIcon })
              setLeafletLoaded(true)
            })
          })
        })
      })
    }
  }, [])

  useEffect(() => {
    const loadAirportData = async () => {
      setLoading(true)
      
      // Debug logging
      console.group('🗺️ FlightsMap Debug')
      console.log('Total flights received:', flights.length)
      console.log('Filtered flights (after year filter):', filteredFlights.length)
      
      // Load airport data - use loadAirports() instead of loadAirportsFromFile()
      await airportService.loadAirports()
      console.log('Airports loaded from service:', airportService.airports?.size || 0)
      
      // Get unique airport codes
      const airportCodes = new Set<string>()
      filteredFlights.forEach(flight => {
        if (flight.departure_airport) airportCodes.add(flight.departure_airport)
        if (flight.arrival_airport) airportCodes.add(flight.arrival_airport)
      })
      console.log('Unique airport codes needed:', airportCodes.size)
      
      // Track missing airports and dropped flights
      const missingAirports: any[] = []
      const droppedFlights: any[] = []
      
      // Fetch coordinates for each flight
      const routes = await Promise.all(
        filteredFlights.map(async (flight) => {
          const [departure, arrival] = await Promise.all([
            flight.departure_airport ? airportService.getAirport(flight.departure_airport) : null,
            flight.arrival_airport ? airportService.getAirport(flight.arrival_airport) : null
          ])
          
          // Track missing airports
          if (flight.departure_airport && !departure) {
            missingAirports.push({
              flightId: flight.id,
              flightDate: flight.flight_date,
              airport: flight.departure_airport,
              type: 'departure'
            })
          }
          if (flight.arrival_airport && !arrival) {
            missingAirports.push({
              flightId: flight.id,
              flightDate: flight.flight_date,
              airport: flight.arrival_airport,
              type: 'arrival'
            })
          }
          
          // Track dropped flights
          if (!departure || !arrival) {
            droppedFlights.push({
              flightId: flight.id,
              date: flight.flight_date,
              departure: flight.departure_airport,
              arrival: flight.arrival_airport,
              hasDeparture: !!departure,
              hasArrival: !!arrival,
              registration: flight.registration
            })
          }
          
          return { flight, departure, arrival }
        })
      )
      
      const validRoutes = routes.filter(r => r.departure && r.arrival)
      
      console.log('Routes processed:', routes.length)
      console.log('Valid routes (with both airports):', validRoutes.length)
      console.log('Dropped flights:', droppedFlights.length)
      
      if (missingAirports.length > 0) {
        console.warn('Missing airports in database:', missingAirports)
      }
      
      if (droppedFlights.length > 0) {
        console.warn('Dropped flights (missing airport data):', droppedFlights)
      }
      
      console.groupEnd()
      
      setFlightRoutes(validRoutes)
      setLoading(false)
    }
    
    loadAirportData()
  }, [filteredFlights, flights.length])

  // Calculate center of map based on all airports
  const getMapCenter = (): [number, number] => {
    if (flightRoutes.length === 0) return [50, 10] // Default to Europe
    
    const lats: number[] = []
    const lngs: number[] = []
    
    flightRoutes.forEach(({ departure, arrival }) => {
      if (departure) {
        lats.push(departure.lat)
        lngs.push(departure.lon)
      }
      if (arrival) {
        lats.push(arrival.lat)
        lngs.push(arrival.lon)
      }
    })
    
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length
    
    return [avgLat, avgLng]
  }

  const getLineColor = (flightDate: string) => {
    const currentYear = new Date().getFullYear()
    const flightYear = new Date(flightDate).getFullYear()
    
    if (flightYear === currentYear) return '#8b5cf6' // Violet for current year
    if (flightYear === currentYear - 1) return '#3b82f6' // Blue for last year
    return '#6b7280' // Gray for older flights
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (minutes: number | null) => {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading flight routes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flight Routes Map
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {flightRoutes.length} routes displayed
            </p>
          </div>
          
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
      
      <div className="h-[500px] relative">
        {typeof window !== 'undefined' && leafletLoaded && flightRoutes.length > 0 && (
          <MapContainer
            center={getMapCenter()}
            zoom={4}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Draw flight routes */}
            {flightRoutes.map(({ flight, departure, arrival }) => {
              if (!departure || !arrival) return null
              
              return (
                <Polyline
                  key={flight.id}
                  positions={[
                    [departure.lat, departure.lon],
                    [arrival.lat, arrival.lon]
                  ]}
                  color={getLineColor(flight.flight_date)}
                  weight={2}
                  opacity={0.7}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="font-semibold text-sm mb-1">
                        {flight.departure_airport} → {flight.arrival_airport}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(flight.flight_date)}
                        </div>
                        <div className="flex items-center">
                          <Plane className="h-3 w-3 mr-1" />
                          {flight.registration} ({flight.aircraft_type})
                        </div>
                        <div>Block Time: {formatTime((flight.block_time || 0) * 60)}</div>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              )
            })}
            
            {/* Add markers for unique airports */}
            {Array.from(new Set(flightRoutes.flatMap(r => [r.departure, r.arrival])))
              .filter(Boolean)
              .map((airport) => {
                if (!airport) return null
                return (
                  <Marker
                    key={airport.icao}
                    position={[airport.lat, airport.lon]}
                    icon={customIcons.airport}
                  >
                    <Popup>
                      <div className="p-2">
                        <div className="font-semibold">{airport.icao}</div>
                        <div className="text-sm">{airport.name}</div>
                        <div className="text-xs text-gray-600">{airport.municipality}, {airport.country}</div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
          </MapContainer>
        )}
        
        {flightRoutes.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No flight routes to display
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-1 bg-violet-600 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Current Year</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-600 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Last Year</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-gray-600 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Older</span>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { airportService, type Airport } from '@/lib/data/airport-service'
import { Loader2, MapPin, Plane, Navigation } from 'lucide-react'

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

// Fix for default markers in production build
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
  })
}

interface FlightMapProps {
  departureIcao: string
  arrivalIcao: string
  alternateIcao?: string
}

export default function FlightMap({ departureIcao, arrivalIcao, alternateIcao }: FlightMapProps) {
  const [departure, setDeparture] = useState<Airport | null>(null)
  const [arrival, setArrival] = useState<Airport | null>(null)
  const [alternate, setAlternate] = useState<Airport | null>(null)
  const [loading, setLoading] = useState(true)
  const [distance, setDistance] = useState<number>(0)
  const [bearing, setBearing] = useState<number>(0)

  useEffect(() => {
    const loadAirports = async () => {
      setLoading(true)
      
      const [dep, arr, alt] = await Promise.all([
        airportService.getAirport(departureIcao),
        airportService.getAirport(arrivalIcao),
        alternateIcao ? airportService.getAirport(alternateIcao) : Promise.resolve(null)
      ])
      
      setDeparture(dep)
      setArrival(arr)
      setAlternate(alt)
      
      // Calculate distance and bearing
      if (dep && arr) {
        const dist = airportService.calculateDistance(dep.lat, dep.lon, arr.lat, arr.lon)
        const bear = airportService.calculateBearing(dep.lat, dep.lon, arr.lat, arr.lon)
        setDistance(dist)
        setBearing(bear)
      }
      
      setLoading(false)
    }
    
    loadAirports()
  }, [departureIcao, arrivalIcao, alternateIcao])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!departure || !arrival) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Airport data not available
          </p>
        </div>
      </div>
    )
  }

  // Calculate center and zoom
  const centerLat = (departure.lat + arrival.lat) / 2
  const centerLon = (departure.lon + arrival.lon) / 2
  
  // Calculate appropriate zoom level based on distance
  const getZoomLevel = (distance: number) => {
    if (distance < 100) return 10
    if (distance < 500) return 7
    if (distance < 1000) return 6
    if (distance < 2000) return 5
    if (distance < 5000) return 4
    return 3
  }

  // Create custom icons
  const createIcon = (color: string, type: 'departure' | 'arrival' | 'alternate') => {
    const iconHtml = type === 'departure' 
      ? `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>`
      : type === 'arrival'
      ? `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.5 19h19v2h-19v-2zm9.68-13.27L14.03 10l1.41-1.41-1.86-1.86.01-.01c.31-.31.31-.82 0-1.13-.31-.31-.82-.31-1.13 0l-.01.01L8 10.05l1.41 1.41 4.27-1.73 4.54 4.54.7-2.12-6.74-6.42z"/></svg></div>`
      : `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`

    if (typeof window !== 'undefined') {
      return L.divIcon({
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        className: ''
      })
    }
    return undefined
  }

  // Create great circle route points
  const createGreatCircleRoute = (dep: Airport, arr: Airport, numPoints = 50): [number, number][] => {
    const points: [number, number][] = []
    
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints
      const lat = dep.lat + (arr.lat - dep.lat) * f
      const lon = dep.lon + (arr.lon - dep.lon) * f
      points.push([lat, lon])
    }
    
    return points
  }

  const routePoints = createGreatCircleRoute(departure, arrival)

  return (
    <div className="space-y-4">
      {/* Flight Info Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Plane className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                <p className="font-semibold text-gray-900 dark:text-white">{departure.icao}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{departure.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="h-px w-8 bg-gray-300 dark:bg-gray-600"></div>
              <Navigation className="h-4 w-4" />
              <div className="h-px w-8 bg-gray-300 dark:bg-gray-600"></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                <p className="font-semibold text-gray-900 dark:text-white">{arrival.icao}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{arrival.name}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
            <p className="font-semibold text-gray-900 dark:text-white">{distance} km</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {Math.round(distance * 0.539957)} nm • {Math.round(bearing)}°
            </p>
          </div>
        </div>
        
        {alternate && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900 rounded">
                <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Alternate</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alternate.icao} - {alternate.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-96 rounded-lg overflow-hidden shadow-lg">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={[centerLat, centerLon]}
            zoom={getZoomLevel(distance)}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Route line */}
            <Polyline
              positions={routePoints}
              color="#8B5CF6"
              weight={3}
              opacity={0.8}
              dashArray="10, 10"
            />
            
            {/* Departure marker */}
            <Marker 
              position={[departure.lat, departure.lon]}
              icon={createIcon('#10B981', 'departure')}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{departure.icao} - {departure.iata || 'N/A'}</p>
                  <p>{departure.name}</p>
                  <p className="text-xs text-gray-500">{departure.municipality}, {departure.country}</p>
                  <p className="text-xs text-gray-500">Elevation: {departure.alt} ft</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Arrival marker */}
            <Marker 
              position={[arrival.lat, arrival.lon]}
              icon={createIcon('#3B82F6', 'arrival')}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{arrival.icao} - {arrival.iata || 'N/A'}</p>
                  <p>{arrival.name}</p>
                  <p className="text-xs text-gray-500">{arrival.municipality}, {arrival.country}</p>
                  <p className="text-xs text-gray-500">Elevation: {arrival.alt} ft</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Alternate marker if exists */}
            {alternate && (
              <Marker 
                position={[alternate.lat, alternate.lon]}
                icon={createIcon('#F97316', 'alternate')}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">Alternate: {alternate.icao} - {alternate.iata || 'N/A'}</p>
                    <p>{alternate.name}</p>
                    <p className="text-xs text-gray-500">{alternate.municipality}, {alternate.country}</p>
                    <p className="text-xs text-gray-500">Elevation: {alternate.alt} ft</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
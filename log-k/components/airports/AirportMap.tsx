'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Airport } from '@/lib/data/airport-service'
import { MapPin } from 'lucide-react'

// Dynamically import Leaflet components
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

import 'leaflet/dist/leaflet.css'

interface AirportMapProps {
  airport: Airport
}

export default function AirportMap({ airport }: AirportMapProps) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [customIcon, setCustomIcon] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import Leaflet
      import('leaflet').then((L) => {
        // Fix marker icons
        import('leaflet/dist/images/marker-icon-2x.png').then((markerIcon2x) => {
          import('leaflet/dist/images/marker-icon.png').then((markerIcon) => {
            import('leaflet/dist/images/marker-shadow.png').then((markerShadow) => {
              delete (L.Icon.Default.prototype as any)._getIconUrl
              L.Icon.Default.mergeOptions({
                iconUrl: markerIcon.default.src,
                iconRetinaUrl: markerIcon2x.default.src,
                shadowUrl: markerShadow.default.src,
              })

              // Create custom airport icon
              const iconHtml = `
                <div style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 3px solid white;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
              `
              
              const icon = L.divIcon({
                html: iconHtml,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
                className: ''
              })

              setCustomIcon(icon)
              setLeafletLoaded(true)
            })
          })
        })
      })
    }
  }, [])

  // Determine appropriate zoom level based on airport type
  const getZoomLevel = (type: string) => {
    switch (type) {
      case 'large':
      case 'large_airport':
        return 12
      case 'medium':
      case 'medium_airport':
        return 13
      case 'small':
      case 'small_airport':
        return 14
      case 'heliport':
        return 15
      default:
        return 13
    }
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-inner">
      {typeof window !== 'undefined' && leafletLoaded && (
        <MapContainer
          center={[airport.lat, airport.lon]}
          zoom={getZoomLevel(airport.type)}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker 
            position={[airport.lat, airport.lon]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{airport.icao}</h3>
                <p className="text-sm text-gray-600">{airport.name}</p>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <p>Type: {airport.type.replace('_', ' ')}</p>
                  <p>Elevation: {airport.alt} ft</p>
                  <p>Coordinates: {airport.lat.toFixed(4)}°, {airport.lon.toFixed(4)}°</p>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  )
}
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// For production, replace with your Mapbox token or use OpenLayers for free alternative
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.test'

interface AirportMapProps {
  departure?: { lat: number; lng: number; code: string }
  arrival?: { lat: number; lng: number; code: string }
  alternates?: Array<{ lat: number; lng: number; code: string }>
  className?: string
}

export default function AirportMap({ 
  departure, 
  arrival, 
  alternates = [], 
  className = '' 
}: AirportMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: departure ? [departure.lng, departure.lat] : [0, 0],
      zoom: departure && arrival ? 5 : 2
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add markers
    if (departure) {
      new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([departure.lng, departure.lat])
        .setPopup(new mapboxgl.Popup().setText(`Departure: ${departure.code}`))
        .addTo(map.current)
    }

    if (arrival) {
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([arrival.lng, arrival.lat])
        .setPopup(new mapboxgl.Popup().setText(`Arrival: ${arrival.code}`))
        .addTo(map.current)
    }

    alternates.forEach(alt => {
      new mapboxgl.Marker({ color: '#f59e0b' })
        .setLngLat([alt.lng, alt.lat])
        .setPopup(new mapboxgl.Popup().setText(`Alternate: ${alt.code}`))
        .addTo(map.current!)
    })

    // Draw route line
    if (departure && arrival) {
      map.current.on('load', () => {
        map.current!.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [departure.lng, departure.lat],
                [arrival.lng, arrival.lat]
              ]
            }
          }
        })

        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#8b5cf6',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        })

        // Fit bounds to show all markers
        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend([departure.lng, departure.lat])
        bounds.extend([arrival.lng, arrival.lat])
        alternates.forEach(alt => bounds.extend([alt.lng, alt.lat]))
        
        map.current!.fitBounds(bounds, { padding: 50 })
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [departure, arrival, alternates])

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-96 rounded-lg overflow-hidden ${className}`}
    />
  )
}
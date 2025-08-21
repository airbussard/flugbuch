'use client'

import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import Link from 'next/link'

interface Flight {
  id: string
  flight_date: string
  departure_airport: string
  arrival_airport: string
  flight_number: string | null
  block_time: number | null
  pic_time: number | null
  sic_time: number | null
  landings_day: number | null
  landings_night: number | null
  remarks: string | null
}

export default function AircraftFlightsList({ 
  flights, 
  aircraftRegistration 
}: { 
  flights: Flight[]
  aircraftRegistration: string 
}) {
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
  
  const getTotalLandings = (dayLandings: number | null, nightLandings: number | null) => {
    const total = (dayLandings || 0) + (nightLandings || 0)
    if (total === 0) return null
    return total
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Flight History - {aircraftRegistration}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {flights.length} flights recorded
        </p>
      </div>
      
      {flights.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          No flights recorded with this aircraft yet
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {flights.map((flight) => {
            const landings = getTotalLandings(flight.landings_day, flight.landings_night)
            return (
              <Link
                key={flight.id}
                href={`/flights/${flight.id}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {flight.departure_airport} → {flight.arrival_airport}
                      </span>
                      {flight.flight_number && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {flight.flight_number}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(flight.flight_date)}
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(flight.block_time)}
                      </div>
                      
                      {landings && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {landings} {landings === 1 ? 'landing' : 'landings'}
                        </div>
                      )}
                      
                      {(flight.pic_time || flight.sic_time) && (
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {flight.pic_time ? `PIC ${formatTime(flight.pic_time)}` : `SIC ${formatTime(flight.sic_time)}`}
                        </div>
                      )}
                    </div>
                    
                    {flight.remarks && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {flight.remarks}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
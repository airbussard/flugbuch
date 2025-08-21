'use client'

import { Calendar, MapPin, Clock, Plane } from 'lucide-react'
import Link from 'next/link'

interface Flight {
  id: string
  flight_date: string
  departure_airport: string
  arrival_airport: string
  aircraft_type: string
  registration: string
  block_time: number | null
  role_name: string
}

export default function SharedFlightsList({ 
  flights, 
  crewMemberName 
}: { 
  flights: Flight[]
  crewMemberName: string 
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
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'PIC':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'SIC':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Instructor':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'Student':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Shared Flights with {crewMemberName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {flights.length} flights together
        </p>
      </div>
      
      {flights.length === 0 ? (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          No shared flights yet
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {flights.map((flight) => (
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
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(flight.role_name)}`}>
                      {flight.role_name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(flight.flight_date)}
                    </div>
                    
                    <div className="flex items-center">
                      <Plane className="h-3 w-3 mr-1" />
                      {flight.registration} ({flight.aircraft_type})
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(flight.block_time)}
                    </div>
                  </div>
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
          ))}
        </div>
      )}
    </div>
  )
}
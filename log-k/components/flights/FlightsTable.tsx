'use client'

import { useState } from 'react'
import { formatTime } from '@/lib/utils'
import { formatUTCTime, formatUTCDate } from '@/lib/utils/utc-time'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Flight {
  id: string
  flight_date: string | null
  departure_airport: string | null
  arrival_airport: string | null
  off_block: string | null
  on_block: string | null
  aircraft_registration: string | null
  aircraft_type: string | null
  pic_name: string | null
  block_time: number | null
  landings_day: number | null
  landings_night: number | null
  remarks: string | null
}

export default function FlightsTable({ flights }: { flights: Flight[] }) {
  const [selectedFlights, setSelectedFlights] = useState<string[]>([])

  const toggleSelection = (id: string) => {
    setSelectedFlights(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedFlights(prev =>
      prev.length === flights.length ? [] : flights.map(f => f.id)
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedFlights.length === flights.length && flights.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route / Times (UTC)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aircraft
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PIC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flight Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Landings
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No flights recorded yet. Add your first flight to get started.
                </td>
              </tr>
            ) : (
              flights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedFlights.includes(flight.id)}
                      onChange={() => toggleSelection(flight.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flight.flight_date ? formatUTCDate(flight.flight_date) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">
                      {flight.departure_airport} → {flight.arrival_airport}
                    </span>
                    {flight.off_block && flight.on_block && (
                      <span className="block text-xs text-gray-500">
                        {formatUTCTime(flight.off_block)} - {formatUTCTime(flight.on_block)} UTC
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{flight.aircraft_registration}</span>
                    {flight.aircraft_type && (
                      <span className="block text-xs text-gray-500">{flight.aircraft_type}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flight.pic_name || 'Self'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime((flight.block_time || 0) * 60)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flight.landings_day || 0} / {flight.landings_night || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/flights/${flight.id}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/flights/${flight.id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
import { formatDate, formatTime } from '@/lib/utils'

interface Flight {
  id: string
  date: string
  departure_airport: string | null
  arrival_airport: string | null
  aircraft_registration: string | null
  flight_time: number | null
}

export default function RecentFlights({ flights }: { flights: Flight[] }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Flights</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {flights.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No flights recorded yet
          </div>
        ) : (
          flights.slice(0, 5).map((flight) => (
            <div key={flight.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {flight.departure_airport} → {flight.arrival_airport}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(flight.date)} · {flight.aircraft_registration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(flight.flight_time || 0)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
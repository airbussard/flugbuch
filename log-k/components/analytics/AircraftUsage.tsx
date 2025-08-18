'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Flight {
  aircraft_registration: string | null
  flight_time: number | null
}

interface Aircraft {
  id: string
  registration: string
  type: string
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function AircraftUsage({ flights, aircraft }: { flights: Flight[], aircraft: Aircraft[] }) {
  // Calculate usage by aircraft
  const usageData = flights.reduce((acc: any[], flight) => {
    if (!flight.aircraft_registration) return acc
    
    const existing = acc.find(item => item.name === flight.aircraft_registration)
    
    if (existing) {
      existing.value += flight.flight_time || 0
    } else {
      acc.push({
        name: flight.aircraft_registration,
        value: flight.flight_time || 0
      })
    }
    
    return acc
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aircraft Usage</h3>
      {usageData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={usageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.name}: ${entry.value?.toFixed(1) || 0}h`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {usageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-12">
          No flight data available
        </div>
      )}
    </div>
  )
}
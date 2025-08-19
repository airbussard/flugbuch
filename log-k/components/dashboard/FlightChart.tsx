'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface Flight {
  flight_date: string | null
  block_time: number | null
}

export default function FlightChart({ flights }: { flights: Flight[] }) {
  // Group flights by month
  const chartData = flights.reduce((acc: any[], flight) => {
    if (!flight.flight_date) return acc
    
    try {
      const month = format(new Date(flight.flight_date), 'MMM yyyy')
      const existing = acc.find(item => item.month === month)
      
      if (existing) {
        existing.hours += flight.block_time || 0
      } else {
        acc.push({ month, hours: flight.block_time || 0 })
      }
    } catch (error) {
      console.error('Invalid date in flight:', flight.flight_date)
    }
    }
    
    return acc
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Hours Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
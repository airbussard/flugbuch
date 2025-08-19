'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface Flight {
  flight_date: string | null
  block_time: number | null
}

export default function FlightsByMonth({ flights }: { flights: Flight[] }) {
  // Group flights by month
  const monthlyData = flights.reduce((acc: any[], flight) => {
    if (!flight.flight_date) return acc
    
    try {
      const month = format(new Date(flight.flight_date), 'MMM yyyy')
      const existing = acc.find(item => item.month === month)
      
      if (existing) {
        existing.hours += flight.block_time || 0
        existing.flights += 1
      } else {
        acc.push({ 
          month, 
          hours: flight.block_time || 0,
          flights: 1
        })
      }
    } catch (error) {
      console.error('Invalid date in flight:', flight.flight_date)
    }
    
    return acc
  }, []).slice(-12) // Last 12 months

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Flight Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#8b5cf6" name="Hours" />
          <Bar dataKey="flights" fill="#3b82f6" name="Flights" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
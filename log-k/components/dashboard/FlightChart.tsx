'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subMonths, startOfMonth } from 'date-fns'
import { de } from 'date-fns/locale'

interface Flight {
  flight_date: string | null
  block_time: number | null
}

export default function FlightChart({ flights }: { flights: Flight[] }) {
  // Generate all 12 months
  const generateLast12Months = () => {
    const months = []
    const today = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = startOfMonth(subMonths(today, i))
      months.push({
        month: format(date, 'MMM yy', { locale: de }),
        monthKey: format(date, 'yyyy-MM'),
        hours: 0
      })
    }
    
    return months
  }
  
  // Start with all 12 months
  const chartData = generateLast12Months()
  
  // Add flight hours to the corresponding months
  flights.forEach(flight => {
    if (!flight.flight_date) return
    
    try {
      const flightDate = new Date(flight.flight_date)
      const monthKey = format(flightDate, 'yyyy-MM')
      const monthData = chartData.find(m => m.monthKey === monthKey)
      
      if (monthData) {
        monthData.hours += flight.block_time || 0
      }
    } catch (error) {
      console.error('Invalid date in flight:', flight.flight_date)
    }
  })
  
  // Round hours to 1 decimal place for better display
  chartData.forEach(data => {
    data.hours = Math.round(data.hours * 10) / 10
  })

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow">
          <p className="font-semibold">{label}</p>
          <p className="text-purple-600">
            {payload[0].value} Stunden
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Flugstunden-Verlauf (12 Monate)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            label={{ value: 'Stunden', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="hours" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
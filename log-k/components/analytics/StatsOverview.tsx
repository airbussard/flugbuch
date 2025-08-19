import { Clock, Plane, Calendar, TrendingUp } from 'lucide-react'

interface Flight {
  block_time: number | null
  night_time: number | null
  ifr_time: number | null
  landings_day: number | null
  landings_night: number | null
  flight_date: string | null
}

export default function StatsOverview({ flights }: { flights: Flight[] }) {
  const totalHours = flights.reduce((sum, f) => sum + (f.block_time || 0), 0)
  const totalNight = flights.reduce((sum, f) => sum + (f.night_time || 0), 0)
  const totalIFR = flights.reduce((sum, f) => sum + (f.ifr_time || 0), 0)
  const totalLandings = flights.reduce((sum, f) => sum + (f.landings_day || 0) + (f.landings_night || 0), 0)
  
  // Last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentFlights = flights.filter(f => {
    if (!f.flight_date) return false
    try {
      return new Date(f.flight_date) >= thirtyDaysAgo
    } catch {
      return false
    }
  })
  const recentHours = recentFlights.reduce((sum, f) => sum + (f.block_time || 0), 0)

  const stats = [
    {
      title: 'Total Flight Time',
      value: `${Math.floor(totalHours)}:${Math.round((totalHours % 1) * 60).toString().padStart(2, '0')}`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Flights',
      value: flights.length.toString(),
      icon: Plane,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Landings',
      value: totalLandings.toString(),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Last 30 Days',
      value: `${Math.floor(recentHours)}:${Math.round((recentHours % 1) * 60).toString().padStart(2, '0')}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}
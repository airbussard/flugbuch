import { CheckCircle, AlertCircle, Clock, Award } from 'lucide-react'

interface Flight {
  flight_date: string | null
  block_time: number | null
  night_time: number | null
  ifr_time: number | null
  landings_day: number | null
  landings_night: number | null
}

export default function ComplianceStatus({ flights }: { flights: Flight[] }) {
  // Calculate last 90 days experience
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const recentFlights = flights.filter(f => {
    if (!f.flight_date) return false
    try {
      return new Date(f.flight_date) >= ninetyDaysAgo
    } catch {
      return false
    }
  })
  
  const recent90Days = {
    flights: recentFlights.length,
    hours: recentFlights.reduce((sum, f) => sum + (f.block_time || 0), 0),
    landings: recentFlights.reduce((sum, f) => sum + (f.landings_day || 0) + (f.landings_night || 0), 0),
    nightLandings: recentFlights.reduce((sum, f) => sum + (f.landings_night || 0), 0)
  }

  // Check currency requirements (simplified)
  const isCurrent = recent90Days.landings >= 3
  const isNightCurrent = recent90Days.nightLandings >= 3
  const hasRecentExperience = recent90Days.hours >= 3

  const requirements = [
    {
      title: 'Day Currency',
      description: '3 landings in 90 days',
      status: isCurrent ? 'current' : 'expired',
      value: `${recent90Days.landings} landings`,
      icon: isCurrent ? CheckCircle : AlertCircle,
      color: isCurrent ? 'text-green-600' : 'text-red-600',
      bgColor: isCurrent ? 'bg-green-100' : 'bg-red-100'
    },
    {
      title: 'Night Currency',
      description: '3 night landings in 90 days',
      status: isNightCurrent ? 'current' : 'expired',
      value: `${recent90Days.nightLandings} night landings`,
      icon: isNightCurrent ? CheckCircle : AlertCircle,
      color: isNightCurrent ? 'text-green-600' : 'text-amber-600',
      bgColor: isNightCurrent ? 'bg-green-100' : 'bg-amber-100'
    },
    {
      title: 'Recent Experience',
      description: 'Flying activity in 90 days',
      status: hasRecentExperience ? 'active' : 'low',
      value: `${recent90Days.hours.toFixed(1)} hours`,
      icon: Clock,
      color: hasRecentExperience ? 'text-blue-600' : 'text-gray-600',
      bgColor: hasRecentExperience ? 'bg-blue-100' : 'bg-gray-100'
    },
    {
      title: 'Medical Certificate',
      description: 'Check expiry date',
      status: 'info',
      value: 'Manual check required',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {requirements.map((req, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${req.bgColor}`}>
                <req.icon className={`h-5 w-5 ${req.color}`} />
              </div>
              {req.status !== 'info' && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  req.status === 'current' || req.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {req.status}
                </span>
              )}
            </div>
            <h4 className="font-medium text-gray-900">{req.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{req.description}</p>
            <p className="text-sm font-medium text-gray-900 mt-2">{req.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
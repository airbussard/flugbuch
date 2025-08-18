import { Plane, Calendar, Gauge, Settings, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
  manufacturer: string | null
  model: string | null
  year: number | null
  engine_type: string | null
  complex_aircraft: boolean
  high_performance: boolean
  tailwheel: boolean
  glass_panel: boolean
}

export default function AircraftCard({ aircraft }: { aircraft: Aircraft }) {
  const features = [
    { key: 'complex_aircraft', label: 'Complex', value: aircraft.complex_aircraft },
    { key: 'high_performance', label: 'HP', value: aircraft.high_performance },
    { key: 'tailwheel', label: 'Tailwheel', value: aircraft.tailwheel },
    { key: 'glass_panel', label: 'Glass', value: aircraft.glass_panel },
  ]

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Plane className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{aircraft.registration}</h3>
              <p className="text-sm text-gray-600">{aircraft.aircraft_type}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Link href={`/fleet/${aircraft.id}/edit`}>
              <Button size="icon" variant="ghost">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="icon" variant="ghost">
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {aircraft.manufacturer && (
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              {aircraft.manufacturer} {aircraft.model}
            </div>
          )}
          {aircraft.year && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Year: {aircraft.year}
            </div>
          )}
          {aircraft.engine_type && (
            <div className="flex items-center text-sm text-gray-600">
              <Gauge className="h-4 w-4 mr-2" />
              {aircraft.engine_type}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {features.filter(f => f.value).map(feature => (
            <span
              key={feature.key}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded"
            >
              {feature.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
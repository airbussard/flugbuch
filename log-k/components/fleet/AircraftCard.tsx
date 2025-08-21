import { Plane, Calendar, Gauge, Settings, Edit, Trash2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Aircraft {
  id: string
  registration: string
  aircraft_type: string
  serial_number: string | null
  engine_type: string | null
  first_flight: string | null
  aircraft_class: 'SEP' | 'MEP' | 'SET' | 'MET' | null
  default_condition: 'VFR' | 'IFR' | null
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

  const getClassBadgeColor = (aircraftClass: string | null) => {
    switch (aircraftClass) {
      case 'SEP': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'MEP': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'SET': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'MET': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Link href={`/fleet/${aircraft.id}`} className="flex items-center hover:opacity-80 transition-opacity">
            <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
              <Plane className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400">
                {aircraft.registration}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {aircraft.aircraft_type}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {aircraft.aircraft_class && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getClassBadgeColor(aircraft.aircraft_class)}`}>
                    {aircraft.aircraft_class}
                  </span>
                )}
                {aircraft.default_condition && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded">
                    {aircraft.default_condition}
                  </span>
                )}
              </div>
            </div>
          </Link>
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
          {aircraft.serial_number && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Settings className="h-4 w-4 mr-2" />
              S/N: {aircraft.serial_number}
            </div>
          )}
          {aircraft.first_flight && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              Erstflug: {new Date(aircraft.first_flight).toLocaleDateString('de-DE')}
            </div>
          )}
          {aircraft.engine_type && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Gauge className="h-4 w-4 mr-2" />
              {aircraft.engine_type}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {features.filter(f => f.value).map(feature => (
            <span
              key={feature.key}
              className="px-2 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-medium rounded"
            >
              {feature.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
import AircraftForm from '@/components/fleet/AircraftForm'

export default function NewAircraftPage() {
  return (
    <div className="p-6">
      <AircraftForm mode="create" />
    </div>
  )
}
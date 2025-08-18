import FlightPlanningTool from '@/components/planning/FlightPlanningTool'

export default function PlanningPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Flight Planning
      </h1>
      
      <FlightPlanningTool />
    </div>
  )
}
import WeatherDashboard from '@/components/weather/WeatherDashboard'
import { getFavoriteAirports } from '@/lib/weather/weather-service'

export default async function WeatherPage() {
  const favorites = await getFavoriteAirports()
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Weather Information
      </h1>
      
      <WeatherDashboard initialFavorites={favorites} />
    </div>
  )
}
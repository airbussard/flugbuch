import { createClient } from '@/lib/supabase/client'

export interface METAR {
  station: string
  observationTime: string
  temperature: number
  dewpoint: number
  windDirection: number
  windSpeed: number
  visibility: number
  altimeter: number
  skyCondition: string[]
  flightCategory: 'VFR' | 'MVFR' | 'IFR' | 'LIFR'
  rawText: string
}

export interface TAF {
  station: string
  issueTime: string
  validFrom: string
  validTo: string
  forecast: Array<{
    from: string
    to: string
    windDirection: number
    windSpeed: number
    visibility: number
    skyCondition: string[]
    changeType?: string
  }>
  rawText: string
}

export interface WeatherData {
  metar?: METAR
  taf?: TAF
}

// Use API routes to avoid CORS issues
export async function fetchMETAR(icaoCode: string): Promise<METAR | null> {
  try {
    const response = await fetch(
      `/api/weather/metar?icao=${icaoCode}`
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    if (!data || data.length === 0) return null
    
    const metar = data[0]
    
    return {
      station: metar.icaoId,
      observationTime: metar.obsTime,
      temperature: metar.tempC,
      dewpoint: metar.dewpointC,
      windDirection: metar.wdir,
      windSpeed: metar.wspd,
      visibility: metar.visMi,
      altimeter: metar.altim,
      skyCondition: parseSkyCondition(metar.clouds),
      flightCategory: metar.flightCategory,
      rawText: metar.rawOb
    }
  } catch (error) {
    console.error('Error fetching METAR:', error)
    return null
  }
}

export async function fetchTAF(icaoCode: string): Promise<TAF | null> {
  try {
    const response = await fetch(
      `/api/weather/taf?icao=${icaoCode}`
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    if (!data || data.length === 0) return null
    
    const taf = data[0]
    
    return {
      station: taf.icaoId,
      issueTime: taf.issueTime,
      validFrom: taf.validTimeFrom,
      validTo: taf.validTimeTo,
      forecast: parseTAFForecast(taf.forecast),
      rawText: taf.rawTAF
    }
  } catch (error) {
    console.error('Error fetching TAF:', error)
    return null
  }
}

export async function fetchWeatherForAirports(
  icaoCodes: string[]
): Promise<Map<string, WeatherData>> {
  const weatherMap = new Map<string, WeatherData>()
  
  await Promise.all(
    icaoCodes.map(async (code) => {
      const [metar, taf] = await Promise.all([
        fetchMETAR(code),
        fetchTAF(code)
      ])
      
      if (metar || taf) {
        weatherMap.set(code, { metar: metar || undefined, taf: taf || undefined })
      }
    })
  )
  
  return weatherMap
}

// Save favorite airports
export async function saveFavoriteAirport(icaoCode: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  await supabase.from('weather_favorites').insert({
    user_id: user.id,
    icao_code: icaoCode
  })
}

export async function getFavoriteAirports(): Promise<string[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data } = await supabase
    .from('weather_favorites')
    .select('icao_code')
    .eq('user_id', user.id)
  
  return data?.map(f => f.icao_code) || []
}

// Helper functions
function parseSkyCondition(clouds: any[]): string[] {
  if (!clouds || clouds.length === 0) return ['Clear']
  
  return clouds.map(cloud => {
    const coverage = cloud.cover
    const altitude = cloud.base
    return `${coverage} at ${altitude}ft`
  })
}

function parseTAFForecast(forecast: any[]): TAF['forecast'] {
  if (!forecast) return []
  
  return forecast.map(fc => ({
    from: fc.timeFrom,
    to: fc.timeTo,
    windDirection: fc.wdir || 0,
    windSpeed: fc.wspd || 0,
    visibility: fc.visMi || 10,
    skyCondition: parseSkyCondition(fc.clouds),
    changeType: fc.changeType
  }))
}
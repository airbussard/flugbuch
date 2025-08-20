export interface Airport {
  icao: string
  iata: string | null
  name: string
  type: string
  lat: number
  lon: number
  alt: number
  timezone: string
  country: string
  municipality: string
}

class AirportService {
  private airports: Map<string, Airport> = new Map()
  private loaded = false

  async loadAirports(): Promise<void> {
    if (this.loaded) return

    try {
      const response = await fetch('/airports.csv')
      const text = await response.text()
      
      // Parse CSV
      const lines = text.split('\n')
      const headers = this.parseCSVLine(lines[0])
      
      // Find column indices
      const icaoIdx = headers.indexOf('ICAO')
      const iataIdx = headers.indexOf('IATA')
      const nameIdx = headers.indexOf('name')
      const typeIdx = headers.indexOf('type')
      const latIdx = headers.indexOf('lat')
      const lonIdx = headers.indexOf('lon')
      const altIdx = headers.indexOf('alt')
      const timezoneIdx = headers.indexOf('timezone')
      const countryIdx = headers.indexOf('country')
      const municipalityIdx = headers.indexOf('municipality')

      // Parse each airport
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const fields = this.parseCSVLine(lines[i])
        const icao = this.cleanField(fields[icaoIdx])
        
        if (icao && icao !== 'NULL') {
          const airport: Airport = {
            icao,
            iata: this.cleanField(fields[iataIdx]) || null,
            name: this.cleanField(fields[nameIdx]) || 'Unknown',
            type: this.cleanField(fields[typeIdx]) || 'unknown',
            lat: parseFloat(this.cleanField(fields[latIdx]) || '0'),
            lon: parseFloat(this.cleanField(fields[lonIdx]) || '0'),
            alt: parseInt(this.cleanField(fields[altIdx]) || '0'),
            timezone: this.cleanField(fields[timezoneIdx]) || 'UTC',
            country: this.cleanField(fields[countryIdx]) || '',
            municipality: this.cleanField(fields[municipalityIdx]) || ''
          }
          
          // Store by ICAO code
          this.airports.set(icao, airport)
          
          // Also store by IATA if available
          if (airport.iata && airport.iata !== 'NULL') {
            this.airports.set(airport.iata, airport)
          }
        }
      }
      
      this.loaded = true
      console.log(`Loaded ${this.airports.size} airports`)
    } catch (error) {
      console.error('Failed to load airports:', error)
      // Fallback to some major airports
      this.loadFallbackAirports()
      this.loaded = true
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  private cleanField(field: string | undefined): string {
    if (!field) return ''
    return field.trim().replace(/^"|"$/g, '').replace(/^NULL$/i, '')
  }

  private loadFallbackAirports() {
    // Major international airports as fallback
    const fallbackAirports: Airport[] = [
      { icao: 'EDDF', iata: 'FRA', name: 'Frankfurt Airport', type: 'large', lat: 50.033333, lon: 8.570556, alt: 364, timezone: 'Europe/Berlin', country: 'DE', municipality: 'Frankfurt' },
      { icao: 'EDDM', iata: 'MUC', name: 'Munich Airport', type: 'large', lat: 48.353889, lon: 11.786111, alt: 1487, timezone: 'Europe/Berlin', country: 'DE', municipality: 'Munich' },
      { icao: 'EDDB', iata: 'BER', name: 'Berlin Brandenburg Airport', type: 'large', lat: 52.366667, lon: 13.503333, alt: 157, timezone: 'Europe/Berlin', country: 'DE', municipality: 'Berlin' },
      { icao: 'KJFK', iata: 'JFK', name: 'John F Kennedy International Airport', type: 'large', lat: 40.639722, lon: -73.778889, alt: 13, timezone: 'America/New_York', country: 'US', municipality: 'New York' },
      { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International Airport', type: 'large', lat: 33.9425, lon: -118.408056, alt: 126, timezone: 'America/Los_Angeles', country: 'US', municipality: 'Los Angeles' },
      { icao: 'EGLL', iata: 'LHR', name: 'London Heathrow Airport', type: 'large', lat: 51.4775, lon: -0.461389, alt: 83, timezone: 'Europe/London', country: 'GB', municipality: 'London' },
      { icao: 'LFPG', iata: 'CDG', name: 'Charles de Gaulle Airport', type: 'large', lat: 49.009722, lon: 2.547778, alt: 392, timezone: 'Europe/Paris', country: 'FR', municipality: 'Paris' },
      { icao: 'OMDB', iata: 'DXB', name: 'Dubai International Airport', type: 'large', lat: 25.252778, lon: 55.364444, alt: 62, timezone: 'Asia/Dubai', country: 'AE', municipality: 'Dubai' },
      { icao: 'VHHH', iata: 'HKG', name: 'Hong Kong International Airport', type: 'large', lat: 22.308889, lon: 113.914444, alt: 28, timezone: 'Asia/Hong_Kong', country: 'HK', municipality: 'Hong Kong' },
      { icao: 'RJTT', iata: 'NRT', name: 'Narita International Airport', type: 'large', lat: 35.764722, lon: 140.386389, alt: 141, timezone: 'Asia/Tokyo', country: 'JP', municipality: 'Tokyo' }
    ]
    
    fallbackAirports.forEach(airport => {
      this.airports.set(airport.icao, airport)
      if (airport.iata) {
        this.airports.set(airport.iata, airport)
      }
    })
  }

  async getAirport(code: string): Promise<Airport | null> {
    if (!this.loaded) {
      await this.loadAirports()
    }
    
    const upperCode = code.toUpperCase()
    return this.airports.get(upperCode) || null
  }

  async searchAirports(query: string, limit = 10): Promise<Airport[]> {
    if (!this.loaded) {
      await this.loadAirports()
    }
    
    const upperQuery = query.toUpperCase()
    const results: Airport[] = []
    
    for (const [code, airport] of this.airports) {
      // Skip duplicates (same airport stored under ICAO and IATA)
      if (code !== airport.icao) continue
      
      if (
        airport.icao.includes(upperQuery) ||
        (airport.iata && airport.iata.includes(upperQuery)) ||
        airport.name.toUpperCase().includes(upperQuery) ||
        airport.municipality.toUpperCase().includes(upperQuery)
      ) {
        results.push(airport)
        if (results.length >= limit) break
      }
    }
    
    return results
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return Math.round(distance) // Distance in km
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.toRad(lon2 - lon1)
    const y = Math.sin(dLon) * Math.cos(this.toRad(lat2))
    const x = Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
              Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon)
    const bearing = Math.atan2(y, x)
    return (this.toDeg(bearing) + 360) % 360
  }

  private toDeg(rad: number): number {
    return rad * (180 / Math.PI)
  }
}

// Singleton instance
export const airportService = new AirportService()
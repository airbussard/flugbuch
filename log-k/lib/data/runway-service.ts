export interface RunwayDirection {
  ident: string
  heading: number
  lat?: number
  lon?: number
  elevation?: number
  displaced_threshold?: number
}

export interface Runway {
  icao: string
  ident: string
  length_ft: number // in feet
  width_ft: number // in feet
  surface: string
  ils: boolean
  // Legacy fields for compatibility
  length?: number // deprecated
  width?: number // deprecated
  lighted?: boolean
  inUse?: boolean
  slope?: number
  left?: RunwayDirection
  right?: RunwayDirection
}

export interface AirportRunways {
  icao: string
  runways: Runway[]
}

class RunwayService {
  private runways: Map<string, Runway[]> = new Map()
  private loaded = false

  // Format surface type
  private formatSurface(surface: string): string {
    const surfaces: Record<string, string> = {
      'ASP': 'Asphalt',
      'CON': 'Concrete',
      'GRS': 'Grass',
      'GRV': 'Gravel',
      'WAT': 'Water',
      'TURF': 'Turf',
      'DIRT': 'Dirt',
      'SAND': 'Sand',
      'ICE': 'Ice',
      'SNOW': 'Snow',
      'UNK': 'Unknown'
    }
    return surfaces[surface] || surface
  }

  // Server-side loading method
  async loadRunwaysFromFile(): Promise<void> {
    if (this.loaded) return

    try {
      // Only import fs/promises on server-side
      if (typeof window === 'undefined') {
        const fs = await import('fs/promises')
        const path = await import('path')
        
        const csvPath = path.join(process.cwd(), 'public', 'runway.csv')
        const text = await fs.readFile(csvPath, 'utf-8')
        this.parseAndStoreRunways(text)
        this.loaded = true
        console.log(`Loaded runways for ${this.runways.size} airports`)
      } else {
        // Should not happen in client, but handle gracefully
        throw new Error('Cannot use file system in browser')
      }
    } catch (error) {
      console.error('Failed to load runways from file:', error)
      this.loaded = true
    }
  }

  // Client-side loading method
  async loadRunways(): Promise<void> {
    if (this.loaded) return

    // If we're on the server, use file system
    if (typeof window === 'undefined') {
      return this.loadRunwaysFromFile()
    }

    try {
      const response = await fetch('/runway.csv')
      const text = await response.text()
      this.parseAndStoreRunways(text)
      this.loaded = true
      console.log(`Loaded runways for ${this.runways.size} airports`)
    } catch (error) {
      console.error('Failed to load runways:', error)
      this.loaded = true
    }
  }

  private parseAndStoreRunways(text: string): void {
    const lines = text.split('\n')
    const headers = this.parseCSVLine(lines[0])
    
    // Find column indices
    const airportIdx = headers.indexOf('airport')
    const identIdx = headers.indexOf('ident')
    const lengthIdx = headers.indexOf('length')
    const widthIdx = headers.indexOf('width')
    const slopeIdx = headers.indexOf('slope')
    const surfaceIdx = headers.indexOf('surface')
    const inuseIdx = headers.indexOf('inuse')
    const lightedIdx = headers.indexOf('lighted')
    
    // Left runway direction
    const lIdentIdx = headers.indexOf('l_ident')
    const lHdgIdx = headers.indexOf('l_hdg')
    const lLatIdx = headers.indexOf('l_lat')
    const lLonIdx = headers.indexOf('l_lon')
    const lAltIdx = headers.indexOf('l_alt')
    const lDthrIdx = headers.indexOf('l_dthr')
    
    // Right runway direction
    const rIdentIdx = headers.indexOf('r_ident')
    const rHdgIdx = headers.indexOf('r_hdg')
    const rLatIdx = headers.indexOf('r_lat')
    const rLonIdx = headers.indexOf('r_lon')
    const rAltIdx = headers.indexOf('r_alt')
    const rDthrIdx = headers.indexOf('r_dthr')

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const fields = this.parseCSVLine(lines[i])
      const airport = this.cleanField(fields[airportIdx])
      
      if (airport) {
        const lengthFt = parseInt(this.cleanField(fields[lengthIdx]) || '0')
        const widthFt = parseInt(this.cleanField(fields[widthIdx]) || '0')
        
        const runway: Runway = {
          icao: airport,
          ident: this.cleanField(fields[identIdx]),
          length_ft: lengthFt,
          width_ft: widthFt,
          surface: this.formatSurface(this.cleanField(fields[surfaceIdx])),
          ils: false, // Default value, not in CSV
          // Legacy fields for compatibility
          length: lengthFt,
          width: widthFt,
          lighted: this.cleanField(fields[lightedIdx]) === '1',
          inUse: this.cleanField(fields[inuseIdx]) === '1',
          slope: parseFloat(this.cleanField(fields[slopeIdx]) || '0') || undefined,
          left: {
            ident: this.cleanField(fields[lIdentIdx]),
            heading: parseInt(this.cleanField(fields[lHdgIdx]) || '0'),
            lat: parseFloat(this.cleanField(fields[lLatIdx]) || '0') || undefined,
            lon: parseFloat(this.cleanField(fields[lLonIdx]) || '0') || undefined,
            elevation: parseInt(this.cleanField(fields[lAltIdx]) || '0') || undefined,
            displaced_threshold: parseInt(this.cleanField(fields[lDthrIdx]) || '0') || undefined
          },
          right: {
            ident: this.cleanField(fields[rIdentIdx]),
            heading: parseInt(this.cleanField(fields[rHdgIdx]) || '0'),
            lat: parseFloat(this.cleanField(fields[rLatIdx]) || '0') || undefined,
            lon: parseFloat(this.cleanField(fields[rLonIdx]) || '0') || undefined,
            elevation: parseInt(this.cleanField(fields[rAltIdx]) || '0') || undefined,
            displaced_threshold: parseInt(this.cleanField(fields[rDthrIdx]) || '0') || undefined
          }
        }
        
        if (!this.runways.has(airport)) {
          this.runways.set(airport, [])
        }
        
        this.runways.get(airport)!.push(runway)
      }
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
    const cleaned = field.trim().replace(/^"|"$/g, '')
    return cleaned === 'NULL' ? '' : cleaned
  }

  async getRunways(icao: string): Promise<Runway[]> {
    if (!this.loaded) {
      await this.loadRunways()
    }
    
    return this.runways.get(icao.toUpperCase()) || []
  }

  async updateRunways(icao: string, runways: Runway[]): Promise<void> {
    this.runways.set(icao.toUpperCase(), runways)
    // In a real implementation, this would persist to a database or file
    // For now, updates are only in memory and will be lost on restart
    console.log(`Updated ${runways.length} runways for ${icao}`)
  }

  clearCache(): void {
    this.runways.clear()
    this.loaded = false
  }

  // Convert feet to meters
  feetToMeters(feet: number): number {
    return Math.round(feet * 0.3048)
  }

  // Get surface types for dropdown
  getSurfaceTypes(): string[] {
    return [
      'Asphalt',
      'Concrete',
      'Grass',
      'Gravel',
      'Turf',
      'Dirt',
      'Sand',
      'Water',
      'Ice',
      'Snow',
      'Unknown'
    ]
  }
}

// Singleton instance
export const runwayService = new RunwayService()
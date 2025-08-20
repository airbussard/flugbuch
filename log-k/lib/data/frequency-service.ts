export interface Frequency {
  type: string
  frequency: string // Formatted as "118.450 MHz"
  raw: string // Raw frequency value
}

export interface AirportFrequencies {
  icao: string
  frequencies: Frequency[]
}

class FrequencyService {
  private frequencies: Map<string, Frequency[]> = new Map()
  private loaded = false

  // Format frequency from raw value (e.g., "118450" -> "118.450 MHz")
  private formatFrequency(raw: string): string {
    if (!raw || raw === 'NULL') return ''
    
    // Handle different frequency formats
    const freq = raw.padEnd(6, '0') // Ensure 6 digits
    const mhz = freq.slice(0, 3)
    const khz = freq.slice(3, 6)
    
    return `${parseInt(mhz)}.${khz} MHz`
  }

  // Server-side loading method
  async loadFrequenciesFromFile(): Promise<void> {
    if (this.loaded) return

    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      const csvPath = path.join(process.cwd(), 'public', 'frequency.csv')
      const text = await fs.readFile(csvPath, 'utf-8')
      this.parseAndStoreFrequencies(text)
      this.loaded = true
      console.log(`Loaded frequencies for ${this.frequencies.size} airports`)
    } catch (error) {
      console.error('Failed to load frequencies from file:', error)
      this.loaded = true
    }
  }

  // Client-side loading method
  async loadFrequencies(): Promise<void> {
    if (this.loaded) return

    // If we're on the server, use file system
    if (typeof window === 'undefined') {
      return this.loadFrequenciesFromFile()
    }

    try {
      const response = await fetch('/frequency.csv')
      const text = await response.text()
      this.parseAndStoreFrequencies(text)
      this.loaded = true
      console.log(`Loaded frequencies for ${this.frequencies.size} airports`)
    } catch (error) {
      console.error('Failed to load frequencies:', error)
      this.loaded = true
    }
  }

  private parseAndStoreFrequencies(text: string): void {
    const lines = text.split('\n')
    const headers = this.parseCSVLine(lines[0])
    
    const idIdx = headers.indexOf('_id')
    const airportIdx = headers.indexOf('airport')
    const typeIdx = headers.indexOf('type')
    const frequencyIdx = headers.indexOf('frequency')

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const fields = this.parseCSVLine(lines[i])
      const airport = this.cleanField(fields[airportIdx])
      const type = this.cleanField(fields[typeIdx])
      const rawFreq = this.cleanField(fields[frequencyIdx])
      
      if (airport && type && rawFreq) {
        const frequency: Frequency = {
          type,
          frequency: this.formatFrequency(rawFreq),
          raw: rawFreq
        }
        
        if (!this.frequencies.has(airport)) {
          this.frequencies.set(airport, [])
        }
        
        this.frequencies.get(airport)!.push(frequency)
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
    return field.trim().replace(/^"|"$/g, '').replace(/^NULL$/i, '')
  }

  async getFrequencies(icao: string): Promise<Frequency[]> {
    if (!this.loaded) {
      await this.loadFrequencies()
    }
    
    return this.frequencies.get(icao.toUpperCase()) || []
  }

  async updateFrequency(icao: string, frequencies: Frequency[]): Promise<void> {
    this.frequencies.set(icao.toUpperCase(), frequencies)
    // Note: Actual CSV update would need to be handled by an API endpoint
  }

  clearCache(): void {
    this.frequencies.clear()
    this.loaded = false
  }

  // Get frequency types for dropdown
  getFrequencyTypes(): string[] {
    return [
      'ATIS',
      'TOWER',
      'GROUND',
      'APPROACH',
      'DEPARTURE',
      'CENTER',
      'CTAF',
      'UNICOM',
      'AFIS',
      'CLEARANCE',
      'EMERGENCY',
      'FSS',
      'A/D'
    ]
  }
}

// Singleton instance
export const frequencyService = new FrequencyService()
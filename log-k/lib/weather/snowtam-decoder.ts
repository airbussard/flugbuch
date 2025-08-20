export interface RunwayCondition {
  runway: string
  contamination: string
  contaminationType: 'DRY' | 'WET' | 'WATER' | 'SLUSH' | 'SNOW' | 'ICE' | 'FROST' | 'COMPACTED_SNOW' | 'FROZEN_RUTS'
  depth?: number // in mm
  coverage?: number // percentage
  brakingAction?: 'GOOD' | 'GOOD_TO_MEDIUM' | 'MEDIUM' | 'MEDIUM_TO_POOR' | 'POOR' | 'UNRELIABLE'
  friction?: number
}

export interface SNOWTAMData {
  raw: string
  stationCode: string
  observationTime: Date
  runways: RunwayCondition[]
  clearedWidth?: number
  clearedLength?: number
  snowbanks?: string
  remarks?: string
  validity?: Date
}

export class SNOWTAMDecoder {
  private static contaminationTypes: Record<string, string> = {
    '0': 'CLEAR_AND_DRY',
    '1': 'DAMP',
    '2': 'WET',
    '3': 'FROST',
    '4': 'DRY_SNOW',
    '5': 'WET_SNOW',
    '6': 'SLUSH',
    '7': 'ICE',
    '8': 'COMPACTED_SNOW',
    '9': 'FROZEN_RUTS'
  }

  private static brakingActionCodes: Record<string, string> = {
    '95': 'GOOD',
    '94': 'GOOD',
    '93': 'GOOD',
    '92': 'GOOD_TO_MEDIUM',
    '91': 'GOOD_TO_MEDIUM',
    '90': 'MEDIUM',
    '89': 'MEDIUM',
    '88': 'MEDIUM',
    '87': 'MEDIUM',
    '86': 'MEDIUM_TO_POOR',
    '85': 'MEDIUM_TO_POOR',
    '84': 'MEDIUM_TO_POOR',
    '83': 'POOR',
    '82': 'POOR',
    '81': 'POOR',
    '80': 'POOR',
    '79': 'POOR',
    '40': 'MEDIUM_TO_GOOD',
    '39': 'MEDIUM',
    '38': 'MEDIUM',
    '37': 'MEDIUM',
    '36': 'MEDIUM_TO_POOR',
    '35': 'MEDIUM_TO_POOR',
    '34': 'MEDIUM_TO_POOR',
    '33': 'POOR',
    '32': 'POOR',
    '31': 'POOR',
    '30': 'POOR',
    '29': 'POOR_OR_LESS',
    '99': 'UNRELIABLE',
    '//': 'NOT_REPORTED'
  }

  static decode(rawSNOWTAM: string): SNOWTAMData {
    const lines = rawSNOWTAM.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    if (lines.length === 0) {
      throw new Error('Empty SNOWTAM')
    }

    // Extract basic information
    const stationCode = this.extractStationCode(rawSNOWTAM)
    const observationTime = this.extractObservationTime(rawSNOWTAM)
    const runways = this.extractRunwayConditions(rawSNOWTAM)
    const remarks = this.extractRemarks(rawSNOWTAM)

    return {
      raw: rawSNOWTAM,
      stationCode,
      observationTime,
      runways,
      remarks
    }
  }

  private static extractStationCode(snowtam: string): string {
    // Look for ICAO code pattern (4 uppercase letters)
    const icaoMatch = snowtam.match(/\b([A-Z]{4})\b/)
    if (icaoMatch) {
      return icaoMatch[1]
    }
    
    // Try to extract from A) field
    const aFieldMatch = snowtam.match(/A\)\s*([A-Z]{4})/)
    if (aFieldMatch) {
      return aFieldMatch[1]
    }
    
    return 'UNKNOWN'
  }

  private static extractObservationTime(snowtam: string): Date {
    // Look for B) field with datetime
    const bFieldMatch = snowtam.match(/B\)\s*(\d{2})(\d{2})(\d{2})(\d{2})/)
    if (bFieldMatch) {
      const month = parseInt(bFieldMatch[1])
      const day = parseInt(bFieldMatch[2])
      const hour = parseInt(bFieldMatch[3])
      const minute = parseInt(bFieldMatch[4])
      
      const now = new Date()
      const year = now.getFullYear()
      
      return new Date(Date.UTC(year, month - 1, day, hour, minute))
    }
    
    // Fallback to current time
    return new Date()
  }

  private static extractRunwayConditions(snowtam: string): RunwayCondition[] {
    const runways: RunwayCondition[] = []
    
    // Pattern for runway condition fields
    // C) Runway, F) Condition codes, G) Depth, H) Friction
    const sections = this.parseSections(snowtam)
    
    // Process each runway mentioned
    const runwayIds = sections['C'] ? [sections['C']] : []
    
    runwayIds.forEach(runway => {
      const condition: RunwayCondition = {
        runway: runway.replace(/[^\d\w]/g, ''),
        contamination: 'UNKNOWN',
        contaminationType: 'DRY'
      }
      
      // Parse F) field - condition codes (format: NN/NN/NN for each third)
      if (sections['F']) {
        const conditionCodes = sections['F'].split('/')
        if (conditionCodes.length >= 1) {
          const code = conditionCodes[0]
          if (code.length >= 1) {
            condition.contaminationType = this.mapContaminationType(code[0])
            condition.contamination = this.contaminationTypes[code[0]] || 'UNKNOWN'
          }
          if (code.length >= 2) {
            condition.coverage = this.mapCoverage(code[1])
          }
        }
      }
      
      // Parse G) field - depth
      if (sections['G']) {
        const depthMatch = sections['G'].match(/\d+/)
        if (depthMatch) {
          condition.depth = parseInt(depthMatch[0])
        }
      }
      
      // Parse H) field - friction/braking action
      if (sections['H']) {
        const frictionValue = sections['H'].replace(/[^\d]/g, '')
        if (frictionValue) {
          condition.friction = parseInt(frictionValue) / 100
          condition.brakingAction = this.mapBrakingAction(frictionValue)
        }
      }
      
      runways.push(condition)
    })
    
    // If no specific runway conditions found, try to parse old format
    if (runways.length === 0) {
      const genericCondition = this.parseGenericFormat(snowtam)
      if (genericCondition) {
        runways.push(genericCondition)
      }
    }
    
    return runways
  }

  private static parseSections(snowtam: string): Record<string, string> {
    const sections: Record<string, string> = {}
    
    // Match pattern like A)EDDM B)12121200 C)07L etc.
    const sectionPattern = /([A-Z])\)\s*([^A-Z\)]+)/g
    let match
    
    while ((match = sectionPattern.exec(snowtam)) !== null) {
      const key = match[1]
      const value = match[2].trim()
      sections[key] = value
    }
    
    return sections
  }

  private static mapContaminationType(code: string): RunwayCondition['contaminationType'] {
    const typeMap: Record<string, RunwayCondition['contaminationType']> = {
      '0': 'DRY',
      '1': 'WET',
      '2': 'WET',
      '3': 'FROST',
      '4': 'SNOW',
      '5': 'SNOW',
      '6': 'SLUSH',
      '7': 'ICE',
      '8': 'COMPACTED_SNOW',
      '9': 'FROZEN_RUTS'
    }
    return typeMap[code] || 'DRY'
  }

  private static mapCoverage(code: string): number {
    const coverageMap: Record<string, number> = {
      '1': 10,  // Less than 10%
      '2': 25,  // 11-25%
      '5': 50,  // 26-50%
      '9': 100  // 51-100%
    }
    return coverageMap[code] || 0
  }

  private static mapBrakingAction(friction: string): RunwayCondition['brakingAction'] {
    const value = parseInt(friction)
    if (value >= 40) return 'GOOD'
    if (value >= 36) return 'GOOD_TO_MEDIUM'
    if (value >= 30) return 'MEDIUM'
    if (value >= 26) return 'MEDIUM_TO_POOR'
    if (value >= 20) return 'POOR'
    return 'UNRELIABLE'
  }

  private static parseGenericFormat(snowtam: string): RunwayCondition | null {
    // Try to extract any runway condition information from free text
    const condition: RunwayCondition = {
      runway: 'ALL',
      contamination: 'SEE_REMARKS',
      contaminationType: 'DRY'
    }
    
    // Look for keywords
    if (/\b(ice|icy)\b/i.test(snowtam)) {
      condition.contaminationType = 'ICE'
      condition.contamination = 'ICE'
    } else if (/\b(snow|snowy)\b/i.test(snowtam)) {
      condition.contaminationType = 'SNOW'
      condition.contamination = 'SNOW'
    } else if (/\b(slush)\b/i.test(snowtam)) {
      condition.contaminationType = 'SLUSH'
      condition.contamination = 'SLUSH'
    } else if (/\b(wet)\b/i.test(snowtam)) {
      condition.contaminationType = 'WET'
      condition.contamination = 'WET'
    }
    
    // Look for braking action
    if (/\bgood\b/i.test(snowtam)) {
      condition.brakingAction = 'GOOD'
    } else if (/\bmedium\b/i.test(snowtam)) {
      condition.brakingAction = 'MEDIUM'
    } else if (/\bpoor\b/i.test(snowtam)) {
      condition.brakingAction = 'POOR'
    }
    
    return condition
  }

  private static extractRemarks(snowtam: string): string | undefined {
    // Look for T) field or RMK
    const tFieldMatch = snowtam.match(/T\)\s*(.+?)(?=[A-Z]\)|$)/s)
    if (tFieldMatch) {
      return tFieldMatch[1].trim()
    }
    
    const rmkMatch = snowtam.match(/RMK[:\s]+(.+?)$/s)
    if (rmkMatch) {
      return rmkMatch[1].trim()
    }
    
    return undefined
  }
}
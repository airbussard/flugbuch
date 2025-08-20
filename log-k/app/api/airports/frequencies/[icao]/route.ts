import { NextRequest, NextResponse } from 'next/server'
import { frequencyService } from '@/lib/data/frequency-service'

interface Params {
  params: Promise<{ icao: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { icao } = await params
    
    if (!icao) {
      return NextResponse.json(
        { error: 'ICAO code is required' },
        { status: 400 }
      )
    }
    
    // Load frequencies using server-side method
    await frequencyService.loadFrequenciesFromFile()
    const frequencies = await frequencyService.getFrequencies(icao.toUpperCase())
    
    return NextResponse.json(frequencies)
  } catch (error) {
    console.error('Error loading frequencies:', error)
    return NextResponse.json(
      { error: 'Failed to load frequencies' },
      { status: 500 }
    )
  }
}
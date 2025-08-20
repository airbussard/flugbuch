import { NextRequest, NextResponse } from 'next/server'
import { runwayService } from '@/lib/data/runway-service'

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
    
    // Load runways using server-side method
    await runwayService.loadRunwaysFromFile()
    const runways = await runwayService.getRunways(icao.toUpperCase())
    
    return NextResponse.json(runways)
  } catch (error) {
    console.error('Error loading runways:', error)
    return NextResponse.json(
      { error: 'Failed to load runways' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Simple in-memory cache for Yousafzai frequency data
let YOUSAFZAI_FREQUENCY_CACHE: { data: any; ts: number } | null = null
const YOUSAFZAI_FREQUENCY_TTL_MS = 30 * 60 * 1000 // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl?.searchParams?.get('refresh') === '1'
    const shouldRefresh = forceRefresh || request.nextUrl?.searchParams?.get('clear_cache') === '1'
    
    if (!shouldRefresh && YOUSAFZAI_FREQUENCY_CACHE && Date.now() - YOUSAFZAI_FREQUENCY_CACHE.ts < YOUSAFZAI_FREQUENCY_TTL_MS) {
      return NextResponse.json(YOUSAFZAI_FREQUENCY_CACHE.data)
    }

    // Load Yousafzai frequency data from public directory
    const frequencyFile = path.join(process.cwd(), 'public', 'yousafzai_word_frequency_list.json')
    
    if (!fs.existsSync(frequencyFile)) {
      console.warn('Yousafzai frequency file not found:', frequencyFile)
      return NextResponse.json({ 
        error: 'Yousafzai frequency data not available',
        details: 'yousafzai_word_frequency_list.json not found'
      }, { status: 404 })
    }

    const frequencyData = JSON.parse(fs.readFileSync(frequencyFile, 'utf8'))
    
    // Cache the data
    YOUSAFZAI_FREQUENCY_CACHE = { data: frequencyData, ts: Date.now() }
    
    console.log(`Yousafzai frequency data loaded: ${frequencyData.length} entries`)
    return NextResponse.json(frequencyData)

  } catch (error) {
    console.error('❌ Yousafzai frequency error:', error)
    return NextResponse.json({ 
      error: 'Yousafzai frequency data generation failed', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'



/**
 * Process search term with basic normalization (no external dependencies)
 */
async function processSearchTerm(searchTerm: string) {
  // Basic romanized to Pashto conversion
  const latinToPashtoMap: Record<string, string> = {
    'leedul': 'لېدل',
    'kawul': 'کول',
    'kawl': 'کول',
    'kawal': 'کول',
    'khustul': 'خستل',
    'khustl': 'خستل',
    'wakhtul': 'وختل',
    'wakhtl': 'وختل',
  };

  // Check if input is Latin and convert
  const hasPashtoChars = /[\u0600-\u06FF]/.test(searchTerm);
  const baseForm = hasPashtoChars ? searchTerm : (latinToPashtoMap[searchTerm.toLowerCase()] || searchTerm);

  // Basic Pashto normalization
  const normalized = baseForm
    .normalize('NFC')
    .replace(/[يىئ]/g, 'ی')
    .replace(/[\u200E\u200F]/g, '');

  return {
    normalized,
    variants: [normalized, baseForm].filter((v, i, arr) => arr.indexOf(v) === i),
    romanization: ''
  };
}

interface SearchRequest {
  query: string
  scope: 'all' | 'ot' | 'nt'
}

interface Verse {
  ref: string
  text: string
}

interface CoverageItem {
  book: string
  count: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { query, scope }: SearchRequest = await request.json()

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      })
    }

    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({
        results: [],
        coverage: [],
        error: 'Database not configured',
        ms: Date.now() - startTime
      })
    }

    const originalTerm = query.trim()

    // Process the search term
    const processed = await processSearchTerm(originalTerm)
    const searchVariants = processed.variants || [originalTerm]

    // Search directly in the verses table using REST API
    const allResults: Verse[] = []
    const coverageMap = new Map<string, number>()

    // Build query conditions for variants
    const orConditions = searchVariants.map(variant => `text.ilike.*${variant}*`).join(',')
    
    let url = `${supabaseUrl}/rest/v1/verses?select=book,chapter,verse,text,testament&or=(${orConditions})`
    
    // Filter by scope
    if (scope === 'ot') {
      url += '&testament=eq.OT'
    } else if (scope === 'nt') {
      url += '&testament=eq.NT'
    }
    
    url += '&limit=100'

    // Execute query using fetch
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      
      // Transform results to expected format
      for (const verse of data) {
        const result: Verse = {
          ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: verse.text
        }
        allResults.push(result)

        // Update coverage count
        coverageMap.set(verse.book, (coverageMap.get(verse.book) || 0) + 1)
      }
    } else {
      console.error('Supabase REST API error:', response.status, response.statusText)
    }

    // Remove duplicate results based on reference
    const uniqueResults = allResults.filter((verse, index, self) =>
      index === self.findIndex(v => v.ref === verse.ref)
    )

    // Convert coverage map to array and sort by count
    const coverage: CoverageItem[] = Array.from(coverageMap.entries())
      .map(([book, count]) => ({ book, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      results: uniqueResults,
      coverage,
      processed: {
        original: originalTerm,
        normalized: processed.normalized,
        variants: processed.variants,
        romanization: processed.romanization
      },
      ms: Date.now() - startTime
    })

  } catch (error) {
    console.error('Search phrase error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}




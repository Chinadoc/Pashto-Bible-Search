import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase' // Import supabase client
export const runtime = 'nodejs'

interface ProcessorResponse {
  normalized: string
  variants: string[]
  romanization: string
}

/**
 * Process search term with basic normalization (no external dependencies)
 */
async function processSearchTerm(searchTerm: string): Promise<ProcessorResponse> {
  // Initial normalization for consistent processing
  const normalizePashto = (text: string): string =>
    text
      .normalize('NFC')
      .replace(/[يىئ]/g, 'ی')
      .replace(/[\u200E\u200F]/g, '');

  const trimmedTerm = searchTerm.trim();

  // Check if input contains Pashto characters
  const hasPashtoChars = /[\u0600-\u06FF]/.test(trimmedTerm);

  let normalized = normalizePashto(trimmedTerm);
  let variants: string[] = [normalized];
  let romanization = '';

  // If input is not Pashto, attempt to use the Edge Function for romanization and variants
  if (!hasPashtoChars) {
    try {
      const { data: processorData, error: processorError } = await supabase
        .functions
        .invoke('pashto-processor', { body: { formPs: trimmedTerm } });

      if (!processorError && processorData) {
        normalized = normalizePashto(processorData.normalized || trimmedTerm);
        variants = Array.from(new Set<string>(
          (processorData.variants || [trimmedTerm]).map((v: string) => normalizePashto(v.trim())).filter(Boolean)
        ));
        romanization = processorData.romanization || '';
      } else if (processorError) {
        console.warn('Pashto processor Edge Function error:', processorError);
        // Fallback to basic normalization if Edge Function fails
        variants = [normalizePashto(trimmedTerm)];
      }
    } catch (e) {
      console.error('Error invoking Pashto processor Edge Function:', e);
      // Fallback to basic normalization if Edge Function fails
      variants = [normalizePashto(trimmedTerm)];
    }
  } else {
    // If input is Pashto, still try to get romanization from Edge Function
    try {
      const { data: processorData, error: processorError } = await supabase
        .functions
        .invoke('pashto-processor', { body: { formPs: trimmedTerm } });

      if (!processorError && processorData) {
        romanization = processorData.romanization || '';
        // Add romanized form as a variant if available and different
        if (romanization && !variants.includes(romanization)) {
          variants.push(romanization);
        }
      } else if (processorError) {
        console.warn('Pashto processor Edge Function error (Pashto input):', processorError);
      }
    } catch (e) {
      console.error('Error invoking Pashto processor Edge Function (Pashto input):', e);
    }
  }

  return {
    normalized,
    variants: Array.from(new Set(variants.filter(Boolean))),
    romanization
  };
}

interface SearchRequest {
  query: string
  scope: 'all' | 'ot' | 'nt'
}

interface Verse {
  ref: string
  text: string
  audioUrl?: string
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
    
    let url = `${supabaseUrl}/rest/v1/verses?select=book,chapter,verse,text,testament,audio_filename,audio_drive_id&or=(${orConditions})`
    
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
        // Build audio URL if available on the row
        let audioUrl = ''
        // Storage-only: build from audio_filename when present; otherwise leave empty
        if (typeof verse.audio_filename === 'string' && /\.mp3$/i.test(verse.audio_filename)) {
          audioUrl = `${supabaseUrl}/storage/v1/object/public/audio/${encodeURIComponent(verse.audio_filename)}`
        }
        const result: Verse = {
          ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          audioUrl
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

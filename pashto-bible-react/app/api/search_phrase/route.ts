import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { supabase, TABLES } from '../../../utils/supabase'
import type { Verse, CoverageItem } from '../../../types'



/**
 * Process search term using Supabase Edge Function for normalization and variants
 */
async function processSearchTerm(searchTerm: string, authToken: string) {
  try {
    const { data, error } = await supabase.functions.invoke('pashto-processor', {
      body: { formPs: searchTerm, authToken }
    })

    if (error) {
      console.error('Edge function error:', error)
      // Fallback to basic processing if edge function fails
      return {
        normalized: searchTerm,
        variants: [searchTerm],
        romanization: ''
      }
    }

    return data
  } catch (error) {
    console.error('Error calling edge function:', error)
    // Fallback to basic processing
    return {
      normalized: searchTerm,
      variants: [searchTerm],
      romanization: ''
    }
  }
}

interface SearchRequest {
  query: string
  scope: 'all' | 'ot' | 'nt'
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

    // Process the search term using the Edge Function
    const processed = await processSearchTerm(originalTerm, supabaseKey)
    const searchVariants = processed.variants || [originalTerm]

    // Search directly in the verses table
    const allResults: Verse[] = []
    const coverageMap = new Map<string, number>()

    // Build Supabase query based on scope
    let supabaseQuery = supabase
      .from(TABLES.VERSES)
      .select('book, chapter, verse, text, testament')

    // Add text search for all variants
    const searchConditions = searchVariants.map((variant: string) => `text.ilike.%${variant}%`).join(',')
    supabaseQuery = supabaseQuery.or(searchConditions)

    // Filter by scope
    if (scope === 'ot') {
      supabaseQuery = supabaseQuery.eq('testament', 'OT')
    } else if (scope === 'nt') {
      supabaseQuery = supabaseQuery.eq('testament', 'NT')
    }

    // Execute query
    const { data, error } = await supabaseQuery.limit(100)

    if (error) {
      console.error('Supabase search error:', error)
    } else if (data) {
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




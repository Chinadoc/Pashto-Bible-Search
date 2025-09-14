import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'
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
    .replace(/[يىئ]/g, 'ی') // unify Arabic yehs to Farsi Yeh
    .replace(/[\u200C\u200D\u200E\u200F]/g, ''); // strip ZWNJ/ZWJ/LRM/RLM

  // Generate orthographic variants to improve match coverage
  const yehArabic = normalized.replace(/ی/g, 'ي'); // Farsi Yeh -> Arabic Yeh
  const kafArabic = normalized.replace(/ک/g, 'ك');  // Keheh -> Arabic Kaf
  const pashtoE = normalized.replace(/ی/g, 'ې');    // Farsi Yeh -> Pashto Yeh (U+06D0)
  const revertE = normalized.replace(/ې/g, 'ی');    // Pashto Yeh -> Farsi Yeh
  const combined = normalized
    .replace(/ی/g, 'ي')
    .replace(/ک/g, 'ك');

  const variants = [
    normalized,
    baseForm,
    yehArabic,
    kafArabic,
    combined,
    pashtoE,
    revertE,
  ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);

  return { normalized, variants, romanization: '' };
}

interface SearchRequest {
  query: string
  scope: 'all' | 'ot' | 'nt'
  bookFilter?: string | null
  // Optional: additional variants to include (e.g., inflections)
  extraVariants?: string[]
  // When true, expand variants by related forms (root -> forms)
  includeRelated?: boolean
}

// Simple in-memory cache for search responses
interface SearchPayload {
  results: Verse[];
  coverage: CoverageItem[];
  processed: {
    original: string;
    normalized: string;
    variants: string[];
    romanization: string;
  };
  ms: number;
  cached?: boolean;
  error?: string;
}
const SEARCH_CACHE = new Map<string, { data: SearchPayload; ts: number }>()
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface Verse {
  ref: string
  text: string
}

interface CoverageItem {
  book: string
  count: number
}

// Normalize book name and generate a few common variants so filters match DB names
function bookVariants(input: string | null | undefined): string[] {
  if (!input) return []
  const raw = String(input).trim()
  const dehyphen = raw.replace(/-/g, ' ')
  const singleSp = dehyphen.replace(/\s+/g, ' ').trim()
  const hyDashLead = singleSp.replace(/^(\d)\s+/, '$1-')
  const hyphenAll = singleSp.replace(/\s+/g, '-')
  const collapsed = singleSp.replace(/\s+/g, '')
  const out = new Set<string>([raw, dehyphen, singleSp, hyDashLead, hyphenAll, collapsed])
  return Array.from(out).filter(Boolean)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { query, scope, extraVariants, includeRelated, bookFilter }: SearchRequest = await request.json()

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      })
    }

    // Create cache key from search parameters
    const variantsKey = Array.isArray(extraVariants) ? extraVariants.sort().join('|') : ''
    const cacheKey = `${query.trim()}-${scope}-${bookFilter || 'all'}-${includeRelated ? 'rel1' : 'rel0'}-${variantsKey}`

    // Check cache first
    const cached = SEARCH_CACHE.get(cacheKey)
    if (cached && Date.now() - cached.ts < SEARCH_CACHE_TTL_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
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

    // FAST PATH: Skip expensive processing, do direct database search
    const searchVariants = [originalTerm]
    
    // Add romanization variants if input looks romanized
    if (!/[\u0600-\u06FF]/.test(originalTerm) && originalTerm.length > 2) {
      try {
        // Search romanized_dictionary with correct column name
        const { data } = await supabase
          .from('romanized_dictionary') 
          .select('pashto_word')
          .ilike('romanization', `%${originalTerm}%`)
          .limit(3)
        if (data && data.length > 0) {
          for (const row of data) {
            if (row.pashto_word) {
              searchVariants.push(row.pashto_word)
            }
          }
        }
      } catch {}
      
      // Common romanization patterns for frequently searched words  
      const commonMappings: Record<string, string[]> = {
        'munda': ['منډه'],
        'manda': ['منډه'],
        'leedul': ['لیدل', 'لېدل'],
        'wral': ['ورل'],
        'kand': ['کند'],
        'wur': ['ور', 'وور'],
        'wahul': ['وهل'],
        'wahel': ['وهل'],
        'kawul': ['کول'],
        'kedal': ['کېدل'],
        'kedel': ['کېدل']
      }
      
      const lowerTerm = originalTerm.toLowerCase()
      if (commonMappings[lowerTerm]) {
        // Insert common mappings at beginning for higher priority
        searchVariants.splice(1, 0, ...commonMappings[lowerTerm])
      }
    }

    // Simple related forms lookup if requested (but limited for speed)
    if (includeRelated && searchVariants.length > 0) {
      try {
        const { data } = await supabase
          .from('form_roots')
          .select('word_form')
          .eq('root_form', searchVariants[0])
          .limit(2)
        if (data && data.length > 0) {
          searchVariants.push(...data.map(d => d.word_form).filter(Boolean))
        }
      } catch {}
    }

    const allResults: Verse[] = []
    const refSet = new Set<string>()
    const coverageMap = new Map<string, number>()

    // FAST search: Direct database query with minimal processing
    const selectCols = 'book,chapter,verse,text,testament'
    let textSearchHit = false
    
    // Use the first (primary) search term only for fastest results
    const primaryTerm = searchVariants[0]
    if (primaryTerm) {
      try {
        let q = supabase.from('verses').select(selectCols).ilike('text', `%${primaryTerm.replace(/%/g,'')}%`)
        if (scope === 'ot') q = q.eq('testament', 'OT')
        if (scope === 'nt') q = q.eq('testament', 'NT')
        if (bookFilter) {
          const books = bookVariants(bookFilter).slice(0, 5)
          if (books.length > 0) q = (q as any).in('book', books)
        }
        const { data, error } = await q.limit(100)
        if (!error && Array.isArray(data) && data.length > 0) {
          textSearchHit = true
          for (const row of data as any[]) {
            const text = (row as any).text || ''
            const ref = `${(row as any).book} ${(row as any).chapter}:${(row as any).verse}`
            allResults.push({ ref, text })
            coverageMap.set((row as any).book, (coverageMap.get((row as any).book) || 0) + 1)
          }
        }
      } catch {}
    }

    // If no results, try additional variants (up to 3 total)
    for (let i = 1; i < Math.min(searchVariants.length, 3) && allResults.length === 0; i++) {
      const variantTerm = searchVariants[i]
      if (!variantTerm) continue
      
      try {
        let q = supabase.from('verses').select(selectCols).ilike('text', `%${variantTerm.replace(/%/g,'')}%`)
        if (scope === 'ot') q = q.eq('testament', 'OT')
        if (scope === 'nt') q = q.eq('testament', 'NT')
        if (bookFilter) {
          const books = bookVariants(bookFilter).slice(0, 5)
          if (books.length > 0) q = (q as any).in('book', books)
        }
        const { data, error } = await q.limit(100)
        if (!error && Array.isArray(data) && data.length > 0) {
          textSearchHit = true
          for (const row of data as any[]) {
            const text = (row as any).text || ''
            const ref = `${(row as any).book} ${(row as any).chapter}:${(row as any).verse}`
            allResults.push({ ref, text })
            coverageMap.set((row as any).book, (coverageMap.get((row as any).book) || 0) + 1)
          }
          break // Found results, stop trying variants
        }
      } catch {}
    }

    // Skip expensive fallbacks for speed

    // Skip expensive fuzzy search

    // Simple final fallback: check form_occurrences only
    if (allResults.length === 0 && primaryTerm) {
      // Simple form_occurrences check only
      try {
        const { data } = await supabase
          .from('form_occurrences')
          .select('verses')
          .eq('pashto_form', primaryTerm)
          .limit(1)
        
        if (data && data.length > 0 && Array.isArray(data[0].verses)) {
          // Take first few verse references and try to find them
          const verseRefs = data[0].verses.slice(0, 10)
          for (const ref of verseRefs) {
            if (typeof ref === 'string' && ref.includes(' ')) {
              const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/)
              if (match) {
                const [, book, chapter, verse] = match
                const { data: verseData } = await supabase
                  .from('verses')
                  .select(selectCols)
                  .eq('book', book)
                  .eq('chapter', parseInt(chapter))
                  .eq('verse', parseInt(verse))
                  .limit(1)
                if (verseData && verseData.length > 0) {
                  const row = verseData[0]
                  allResults.push({ 
                    ref: `${row.book} ${row.chapter}:${row.verse}`, 
                    text: row.text || '' 
                  })
                  coverageMap.set(row.book, (coverageMap.get(row.book) || 0) + 1)
                  if (allResults.length >= 10) break
                }
              }
            }
          }
        }
      } catch {}
    }

    // Remove duplicate results based on reference
    const uniqueResults = allResults.filter((verse, index, self) =>
      index === self.findIndex(v => v.ref === verse.ref)
    )

    // Convert coverage map to array and sort by count
    const coverage: CoverageItem[] = Array.from(coverageMap.entries())
      .map(([book, count]) => ({ book, count }))
      .sort((a, b) => b.count - a.count)

    const payload = {
      results: uniqueResults,
      coverage,
      processed: {
        original: originalTerm,
        normalized: originalTerm,
        variants: searchVariants,
        romanization: ""
      },
      ms: Date.now() - startTime,
      debug: {
        textSearchHit,
        variantsTried: searchVariants.length,
        resultsCount: uniqueResults.length
      }
    }

    // Cache the result
    SEARCH_CACHE.set(cacheKey, { data: payload, ts: Date.now() })

    return NextResponse.json(payload)

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

// Health/diagnostic endpoint for quick checks in browser
export async function GET() {
  return NextResponse.json({ ok: true, route: 'search_phrase', expects: 'POST', ts: Date.now() })
}


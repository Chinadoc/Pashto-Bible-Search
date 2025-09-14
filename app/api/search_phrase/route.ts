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

// Compound verb helpers
const AUX_SET = new Set(['وهل','کول','کېدل'])

function splitCompound(q: string): { object: string; aux: string } | null {
  const parts = q.trim().split(/\s+/).filter(Boolean)
  if (parts.length !== 2) return null
  const [obj, aux] = parts
  if (!AUX_SET.has(aux)) return null
  return { object: obj, aux }
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

    // Try compound verb expansion first (NOUN + AUX)
    const comp = splitCompound(originalTerm)
    if (comp) {
      const { object, aux } = comp
      let forms: string[] = []
      try {
        // Prefer DB inflections for the auxiliary
        const { data } = await supabase
          .from('inflections')
          .select('inflected_form')
          .eq('base_word', aux)
          .order('frequency', { ascending: false })
          .limit(40)
        if (Array.isArray(data) && data.length > 0) {
          for (const row of data) {
            try {
              const inflectedForm = (row as any).inflected_form
              if (typeof inflectedForm === 'string') {
                const parsed = JSON.parse(inflectedForm)
                if (Array.isArray(parsed)) {
                  for (const item of parsed) {
                    if (item && typeof item === 'object' && item.form) {
                      forms.push(String(item.form))
                    }
                  }
                }
              }
            } catch {}
          }
        }
      } catch {}

      // Lightweight fallback for وهل (covers common forms; extend similarly for کول/کېدل as needed)
      if (forms.length === 0 && aux === 'وهل') {
        forms = ['کړه','وکړه','کړم','کړو','کړې','کړئ','کړي','وهه','ووهه','وهم','وهو','وهې','وهئ','وهي','ووهم','ووهو','ووهې','ووهئ','ووهي']
      }
      if (forms.length === 0 && aux === 'کول') {
        forms = ['کوه','کړه','کوم','کوو','کوې','کوئ','کوي','کړم','کړو','کړې','کړئ','کړي']
      }
      if (forms.length === 0 && aux === 'کېدل') {
        forms = ['کېږه','شه','کېږم','کېږو','کېږې','کېږئ','کېږي','شوم','شوو','شوې','شوئ','شوي']
      }

      // Build phrase variants and search per-variant (cap + dedupe)
      const phrases = Array.from(new Set(forms.map(f => `${object} ${f}`))).slice(0, 25)
      const selectCols = 'book,chapter,verse,text,testament'
      const allResults: Verse[] = []
      const refSet = new Set<string>()
      const coverageMap = new Map<string, number>()

      for (const p of phrases) {
        try {
          let q = supabase.from('verses').select(selectCols).ilike('text', `%${p.replace(/%/g,'')}%`)
          if (scope === 'ot') q = q.eq('testament', 'OT')
          if (scope === 'nt') q = q.eq('testament', 'NT')
          if (bookFilter) {
            const books = bookVariants(bookFilter).slice(0, 5)
            if (books.length) q = (q as any).in('book', books)
          }
          const { data, error } = await q.limit(60)
          if (!error && Array.isArray(data) && data.length > 0) {
            for (const row of data as any[]) {
              const text = row.text || ''
              const ref = `${row.book} ${row.chapter}:${row.verse}`
              if (!refSet.has(ref)) {
                refSet.add(ref)
                allResults.push({ ref, text })
                coverageMap.set(row.book, (coverageMap.get(row.book) || 0) + 1)
              }
              if (allResults.length >= 100) break
            }
          }
          if (allResults.length >= 100) break
        } catch {}
      }

      if (allResults.length > 0) {
        const coverage: CoverageItem[] = Array.from(coverageMap.entries())
          .map(([book, count]) => ({ book, count }))
          .sort((a, b) => b.count - a.count)

        const payload = {
          results: allResults,
          coverage,
          processed: {
            original: originalTerm,
            normalized: originalTerm,
            variants: phrases,
            romanization: ''
          },
          ms: Date.now() - startTime,
          debug: { textSearchHit: true, variantsTried: phrases.length, resultsCount: allResults.length }
        }

        SEARCH_CACHE.set(`${cacheKey}-compound`, { data: payload, ts: Date.now() })
        return NextResponse.json(payload)
      }
    }

    // FAST PATH: Skip expensive processing, do direct database search
    const searchVariants = [originalTerm]
    
    // Auto-expand feminine noun inflections (comprehensive)
    if (/[\u0600-\u06FF]/.test(originalTerm)) {
      const stem = originalTerm.endsWith('ه') ? originalTerm.slice(0, -1) :
                   originalTerm.endsWith('ې') ? originalTerm.slice(0, -1) :
                   originalTerm.endsWith('و') ? originalTerm.slice(0, -1) : null
      
      if (stem) {
        // Add all three forms: base (ه), 1st inflection (ې), 2nd inflection (و)
        const allForms = [stem + 'ه', stem + 'ې', stem + 'و']
        for (const form of allForms) {
          if (form !== originalTerm && !searchVariants.includes(form)) {
            searchVariants.push(form)
          }
        }
      }
    }
    
    // Enhanced romanization lookup using proper dictionary hierarchy
    if (!/[\u0600-\u06FF]/.test(originalTerm) && originalTerm.length > 2) {
      try {
        // 1. Primary dictionary lookup for romanized terms (exact and close matches)
        const { data: dictData } = await supabase
          .from('dictionary')
          .select('pashto')
          .or(`romanized.ilike.${originalTerm},romanized.ilike.${originalTerm}*,romanized.ilike.*${originalTerm}`)
          .limit(3)
        if (dictData && dictData.length > 0) {
          for (const row of dictData) {
            if (row.pashto) {
              searchVariants.push(row.pashto)
            }
          }
        }

        // 2. Fallback to romanized_dictionary 
        if (searchVariants.length === 1) { // Only original term found
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
        }
      } catch {}
      
      // 3. Common romanization patterns - high priority for known terms
      const commonMappings: Record<string, string[]> = {
        'munda': ['منډه'],
        'manda': ['منډه'],
        'munda wahul': ['منډه وهل'],
        'manda wahul': ['منډه وهل'],
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
        // Clear previous variants and prioritize known mappings
        searchVariants.length = 1 // Keep only original term
        searchVariants.push(...commonMappings[lowerTerm])
      }
    }

    // Enhanced related forms lookup using proper database hierarchy
    if (includeRelated && searchVariants.length > 0) {
      try {
        // Get the best Pashto term for related forms lookup
        let lookupTerm = searchVariants.find(v => /[\u0600-\u06FF]/.test(v)) || searchVariants[0]
        
        // 1. Check form_roots for morphological variants
        const { data: rootData } = await supabase
          .from('form_roots')
          .select('word_form')
          .eq('root_form', lookupTerm)
          .limit(25)
        
        if (rootData && rootData.length > 0) {
          const relatedForms = rootData.map(d => d.word_form).filter(Boolean)
          
          // If 20+ variants, it's a high-frequency root - add categorized forms
          if (relatedForms.length >= 20) {
            // Add some key related forms but limit to prevent timeout
            searchVariants.push(...relatedForms.slice(0, 8))
          } else {
            // Low frequency - add all related forms
            searchVariants.push(...relatedForms)
          }
        }
        
        // 2. Check nouns_lexicon for systematic inflection patterns
        const { data: nounData } = await supabase
          .from('nouns_lexicon')
          .select('noun_root, plural_forms')
          .eq('noun_root', lookupTerm)
          .limit(1)
        
        if (nounData && nounData.length > 0) {
          const pluralForms = nounData[0].plural_forms
          if (Array.isArray(pluralForms)) {
            searchVariants.push(...pluralForms.filter(Boolean).slice(0, 3))
          }
        }
        
        // 3. Add automatic noun inflection patterns for feminine nouns ending in ه
        if (/ه$/.test(lookupTerm)) {
          // Basic feminine noun patterns: منډه → منډې → منډو  
          const stem = lookupTerm.slice(0, -1) // Remove final ه
          searchVariants.push(
            stem + 'ې', // 1st inflection  
            stem + 'و'  // 2nd inflection
          )
        }
      } catch {}
    }

    const allResults: Verse[] = []
    const refSet = new Set<string>()
    const coverageMap = new Map<string, number>()

    // FAST search: Search ALL variants and combine results
    const selectCols = 'book,chapter,verse,text,testament'
    let textSearchHit = false
    
    // Search all variants (up to 5) and combine results
    for (let i = 0; i < Math.min(searchVariants.length, 5); i++) {
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
            // Deduplicate by reference
            if (!refSet.has(ref)) {
              refSet.add(ref)
              allResults.push({ ref, text })
              coverageMap.set((row as any).book, (coverageMap.get((row as any).book) || 0) + 1)
            }
          }
        }
      } catch {}
      
      // Cap total results to avoid timeout
      if (allResults.length >= 100) break
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
                let verseQuery = supabase
            .from('verses')
                  .select(selectCols)
            .eq('book', book)
                  .eq('chapter', parseInt(chapter))
                  .eq('verse', parseInt(verse))
                
                // Apply book filter to fallback search too
                if (bookFilter) {
                  const books = bookVariants(bookFilter).slice(0, 5)
                  if (books.length > 0 && !books.includes(book)) {
                    continue // Skip this verse if it doesn't match book filter
                  }
                }
                
                const { data: verseData } = await verseQuery.limit(1)
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

    // Build related forms categorization if requested
    let relatedForms: any = null
    if (includeRelated) {
      try {
        // Use the best Pashto term from searchVariants, not the original romanized term
        let lookupTerm = originalTerm
        for (const variant of searchVariants) {
          if (/[\u0600-\u06FF]/.test(variant)) {
            // Found a Pashto script term, prefer this for lookup
            lookupTerm = variant
            break
          }
        }
        
        // Get comprehensive related forms from multiple sources
        const allRelated: string[] = []
        
        // 1. Get morphological variants from form_roots
        const { data: rootData } = await supabase
          .from('form_roots')
          .select('word_form')
          .eq('root_form', lookupTerm)
          .limit(50)
        if (rootData) {
          allRelated.push(...rootData.map(d => d.word_form).filter(Boolean))
        }
        
        // 2. Get dictionary entries with same root
        const { data: dictData } = await supabase
          .from('dictionary')
          .select('pashto')
          .ilike('pashto', `${lookupTerm}%`)
          .limit(20)
        if (dictData) {
          allRelated.push(...dictData.map(d => d.pashto).filter(Boolean))
        }
        
        // 3. Get high-frequency related forms from form_occurrences
        const { data: freqData } = await supabase
          .from('form_occurrences')
          .select('pashto_form')
          .ilike('pashto_form', `%${lookupTerm.slice(0, -1)}%`)
          .gte('occurrence_count', 10)
          .limit(15)
        if (freqData) {
          allRelated.push(...freqData.map(d => d.pashto_form).filter(Boolean))
        }
        
        // Categorize forms (basic heuristics)
        const verbs = allRelated.filter(form => 
          form.endsWith('ل') || form.endsWith('ېدل') || form.endsWith('وهل') || form.endsWith('کول')
        ).slice(0, 10)
        
        const nouns = allRelated.filter(form => 
          form.endsWith('ه') || form.endsWith('ې') || form.endsWith('و') || 
          form.endsWith('ان') || form.endsWith('ونه')
        ).slice(0, 10)
        
        const other = allRelated.filter(form => 
          !verbs.includes(form) && !nouns.includes(form)
        ).slice(0, 5)
        
        // Add automatic noun inflections for lookup term
        if (/ه$/.test(lookupTerm)) {
          const stem = lookupTerm.slice(0, -1)
          nouns.unshift(lookupTerm) // Add the base form first
          if (!nouns.includes(stem + 'ې')) nouns.push(stem + 'ې')
          if (!nouns.includes(stem + 'و')) nouns.push(stem + 'و')
        }
        
        relatedForms = {
          verbs: verbs.length > 0 ? verbs : [],
          nouns: nouns.length > 0 ? nouns : [],
          other: other.length > 0 ? other : [],
          total: allRelated.length
        }
      } catch {}
    }

    const payload = {
      results: uniqueResults,
      coverage,
      relatedForms,
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


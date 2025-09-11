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

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { query, scope, extraVariants, includeRelated }: SearchRequest = await request.json()

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      })
    }

    // Create cache key from search parameters
    const variantsKey = Array.isArray(extraVariants) ? extraVariants.sort().join('|') : ''
    const cacheKey = `${query.trim()}-${scope}-${variantsKey}`

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

    // Process the search term
    const processed = await processSearchTerm(originalTerm)
    const baseVariants = processed.variants || [originalTerm]

    // Optionally expand to related forms via Supabase REST
    let related: string[] = []
    if (includeRelated) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        const norm = processed.normalized || originalTerm
        if (supabaseUrl && supabaseKey) {
          // 1) find root for normalized form
          let root = norm
          const r1 = await fetch(`${supabaseUrl}/rest/v1/form_to_root_map?select=root&form=eq.${encodeURIComponent(norm)}&limit=1`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            cache: 'no-store',
          })
          if (r1.ok) {
            const rows = await r1.json().catch(() => [])
            if (Array.isArray(rows) && rows[0]?.root) root = String(rows[0].root)
          }
          // 2) fetch forms by root
          const r2 = await fetch(`${supabaseUrl}/rest/v1/form_to_root_map?select=form&root=eq.${encodeURIComponent(root)}&limit=800`, {
            headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
            cache: 'no-store',
          })
          if (r2.ok) {
            const rows = await r2.json().catch(() => [])
            if (Array.isArray(rows)) related = rows.map((x: any) => String(x?.form || '')).filter(Boolean)
          }
        }
      } catch {}
    }

    const extras = Array.isArray(extraVariants) ? extraVariants.filter(Boolean) : []
    // merge + dedupe, prioritize longer first for better OR behavior
    const searchVariants = Array.from(new Set([...
      baseVariants,
      ...extras,
      ...related,
    ])).sort((a, b) => b.length - a.length)

    // Search directly in the verses table using REST API
    const allResults: Verse[] = []
    const coverageMap = new Map<string, number>()

    // First try via supabase-js to avoid invalid column references
    const selectCols = 'book,chapter,verse,text,testament,pashto_text,pashto'
    const candidateCols = ['text','pashto_text','pashto'] as const
    for (const col of candidateCols) {
      try {
        const orParts = searchVariants.map(v => `${col}.ilike.%${v.replace(/%/g,'')}%`).join(',')
        let q = supabase.from('verses').select(selectCols).or(orParts)
        if (scope === 'ot') q = q.eq('testament', 'OT')
        if (scope === 'nt') q = q.eq('testament', 'NT')
        const { data, error } = await q.limit(100)
        if (!error && Array.isArray(data) && data.length > 0) {
          for (const v of data) {
            const text = v.text || v.pashto_text || v.pashto || ''
            allResults.push({ ref: `${v.book} ${v.chapter}:${v.verse}`, text })
            coverageMap.set(v.book, (coverageMap.get(v.book) || 0) + 1)
          }
          break
        }
      } catch {}
    }

    // As a final attempt, try REST with all columns (if above yielded nothing)
    if (allResults.length === 0) {
      const u = new URL(`${supabaseUrl}/rest/v1/verses`)
      u.searchParams.set('select', selectCols)
      const orParts: string[] = []
      for (const v of searchVariants) {
        for (const c of candidateCols) orParts.push(`${c}.ilike.*${v}*`)
      }
      u.searchParams.set('or', `(${orParts.join(',')})`)
      if (scope === 'ot') u.searchParams.set('testament', 'eq.OT')
      if (scope === 'nt') u.searchParams.set('testament', 'eq.NT')
      u.searchParams.set('limit', '100')
      const resp = await fetch(u.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } })
      if (resp.ok) {
        const data = await resp.json()
        for (const v of data) {
          const text = v.text || v.pashto_text || v.pashto || ''
          allResults.push({ ref: `${v.book} ${v.chapter}:${v.verse}`, text })
          coverageMap.set(v.book, (coverageMap.get(v.book) || 0) + 1)
        }
      }
    }

    // Fallback: if no verses matched via text search, try occurrences -> references
    if (allResults.length === 0) {
      try {
        // Gather candidate forms
        const forms = Array.from(new Set(searchVariants)).slice(0, 200)
        const headers = { apikey: supabaseKey as string, Authorization: `Bearer ${supabaseKey}` }
        const occSet = new Set<string>()
        // Query occurrences in chunks
        for (let i = 0; i < forms.length; i += 100) {
          const part = forms.slice(i, i + 100)
          const inList = part.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
          const occUrl = new URL(`${supabaseUrl}/rest/v1/form_occurrences`)
          occUrl.searchParams.set('select', 'pashto_form,verse_reference')
          occUrl.searchParams.set('pashto_form', `in.(${inList})`)
          const r = await fetch(occUrl.toString(), { headers, cache: 'no-store' })
          if (r.ok) {
            const rows = await r.json()
            if (Array.isArray(rows)) rows.forEach((row:any)=>{ if (row?.verse_reference) occSet.add(String(row.verse_reference)) })
          }
        }
        const refs = Array.from(occSet).slice(0, 100)
        // Resolve verse text for each ref
        for (const ref of refs) {
          const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/)
          if (!m) continue
          const book = m[1]
          const chapter = Number(m[2])
          const verseNo = Number(m[3])
          const vUrl = new URL(`${supabaseUrl}/rest/v1/verses`)
          vUrl.searchParams.set('select', 'book,chapter,verse,text,testament,pashto_text,pashto')
          vUrl.searchParams.set('book', `eq.${book}`)
          vUrl.searchParams.set('chapter', `eq.${chapter}`)
          vUrl.searchParams.set('verse', `eq.${verseNo}`)
          const vr = await fetch(vUrl.toString(), { headers, cache: 'no-store' })
          if (vr.ok) {
            const arr = await vr.json()
            const row = Array.isArray(arr) && arr[0]
            const text = row?.text || row?.pashto_text || row?.pashto || ''
            allResults.push({ ref, text })
            coverageMap.set(book, (coverageMap.get(book) || 0) + 1)
          }
        }
      } catch (e) {
        console.warn('Fallback occurrences lookup failed:', e)
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

    const payload = {
      results: uniqueResults,
      coverage,
      processed: {
        original: originalTerm,
        normalized: processed.normalized,
        variants: searchVariants,
        romanization: processed.romanization
      },
      ms: Date.now() - startTime
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

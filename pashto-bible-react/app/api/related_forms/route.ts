import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for related forms
const RELATED_FORMS_CACHE = new Map<string, { data: any; ts: number }>()
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

// Attempt to fetch related forms/inflections for a given term using Supabase REST.
// This implementation is resilient: if tables/views are missing, it returns an empty list.
export async function POST(request: NextRequest) {
  const started = Date.now()
  try {
    const body = await request.json().catch(() => ({})) as { term?: string; limit?: number }
    const term = (body.term || '').trim()
    const limit = Math.max(1, Math.min(1000, Number(body.limit) || 200))

    if (!term) {
      return NextResponse.json({ root: '', forms: [], ms: Date.now() - started })
    }

    // Check cache first
    const cacheKey = `${term}-${limit}`
    const cached = RELATED_FORMS_CACHE.get(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        ms: Date.now() - started
      })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({ root: term, forms: [], ms: Date.now() - started })
    }

    // 1) Determine root for the term
    let root = term
    try {
      const url = new URL(`${supabaseUrl}/rest/v1/form_to_root_map`)
      url.searchParams.set('select', 'root')
      url.searchParams.set('form', `eq.${term}`)
      url.searchParams.set('limit', '1')
      const res = await fetch(url.toString(), {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })
      if (res.ok) {
        const rows = await res.json()
        if (Array.isArray(rows) && rows[0]?.root) root = rows[0].root
      }
    } catch {
      // ignore and keep root=term
    }

    // 2) Fetch all forms for this root (collect only)
    const formSet = new Set<string>()
    try {
      const url = new URL(`${supabaseUrl}/rest/v1/form_to_root_map`)
      url.searchParams.set('select', 'form')
      url.searchParams.set('root', `eq.${root}`)
      url.searchParams.set('limit', String(limit))
      const res = await fetch(url.toString(), {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })
        if (res.ok) {
          const rows = await res.json()
          if (Array.isArray(rows)) {
            for (const r of rows) if (r?.form) formSet.add(String(r.form))
          }
        }
    } catch {
      // ignore – fall back to empty suggestions
    }

    // 3) If no forms found via mapping, try a secondary table name if exists
    if (formSet.size === 0) {
      try {
        const url = new URL(`${supabaseUrl}/rest/v1/inflections`)
        // assume columns: root, form
        url.searchParams.set('select', 'form')
        url.searchParams.set('root', `eq.${root}`)
        url.searchParams.set('limit', String(limit))
        const res = await fetch(url.toString(), {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })
        if (res.ok) {
          const rows = await res.json()
          if (Array.isArray(rows)) {
            for (const r of rows) if (r?.form) formSet.add(String(r.form))
          }
        }
      } catch {
        // ignore
      }
    }

    // 4) Enrich counts using word_frequencies and add POS grouping
    const formsArr = Array.from(formSet).filter(f => f && f !== term)
    let enriched: Array<{ form: string; count?: number; pos?: string }> = formsArr.map(f => ({ form: f }))
    // Counts via word_frequencies
    try {
      if (formsArr.length > 0) {
        const url = new URL(`${supabaseUrl}/rest/v1/word_frequencies`)
        url.searchParams.set('select', 'pashto_word,frequency_count')
        const inList = formsArr.map(v => `"${v.replace(/"/g, '""')}"`).join(',')
        url.searchParams.set('pashto_word', `in.(${inList})`)
        url.searchParams.set('limit', String(formsArr.length))
        const r = await fetch(url.toString(), {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          cache: 'no-store',
        })
        if (r.ok) {
          const rows = await r.json()
          const freqMap = new Map<string, number>()
          for (const row of rows) if (row?.pashto_word) freqMap.set(String(row.pashto_word), Number(row.frequency_count || 0))
          enriched.forEach(item => { if (freqMap.has(item.form)) item.count = freqMap.get(item.form) })
        }
      }
    } catch {}
    // POS grouping from lexicons based on root
    try {
      let rootPos: string | undefined
      let url = new URL(`${supabaseUrl}/rest/v1/verbs_lexicon`)
      url.searchParams.set('select', 'p_norm')
      url.searchParams.set('p_norm', `eq.${root}`)
      url.searchParams.set('limit', '1')
      let r = await fetch(url.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' })
      if (r.ok) {
        const rows = await r.json()
        if (Array.isArray(rows) && rows.length > 0) rootPos = 'verb'
      }
      if (!rootPos) {
        url = new URL(`${supabaseUrl}/rest/v1/nouns_lexicon`)
        url.searchParams.set('select', 'p_norm')
        url.searchParams.set('p_norm', `eq.${root}`)
        url.searchParams.set('limit', '1')
        r = await fetch(url.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' })
        if (r.ok) {
          const rows = await r.json()
          if (Array.isArray(rows) && rows.length > 0) rootPos = 'noun'
        }
      }
      if (rootPos) enriched.forEach(item => { item.pos = rootPos })
    } catch {}
    // Sort by count desc then form asc
    enriched.sort((a, b) => (b.count || 0) - (a.count || 0) || a.form.localeCompare(b.form))

    const response = { root, forms: enriched, total: enriched.length, ms: Date.now() - started }

    // Cache the result
    RELATED_FORMS_CACHE.set(cacheKey, { data: response, ts: Date.now() })

    return NextResponse.json(response)
  } catch (e) {
    console.error('related_forms error:', e)
    return NextResponse.json({ root: '', forms: [], ms: Date.now() - started }, { status: 500 })
  }
}

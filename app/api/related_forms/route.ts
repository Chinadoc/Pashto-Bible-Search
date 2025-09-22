import { NextRequest, NextResponse } from 'next/server'

type RelatedForm = { form: string; count?: number; pos?: string; relation?: 'root' | 'inflection' | 'mapped'; info?: any }
type RelatedFormsResponse = { root: string; forms: RelatedForm[]; total?: number; ms: number; cached?: boolean }

// Simple in-memory cache for related forms
const RELATED_FORMS_CACHE = new Map<string, { data: RelatedFormsResponse; ts: number }>()
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
      // Query form_roots table (relational format)
      const url = new URL(`${supabaseUrl}/rest/v1/form_roots`)
      url.searchParams.set('select', 'root_form')
      url.searchParams.set('word_form', `eq.${term}`)
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
        if (Array.isArray(rows) && rows.length > 0 && rows[0]?.root_form) {
          root = rows[0].root_form
        }
      }

      // Also try root_form if word_form didn't work
      if (root === term) {
        const url2 = new URL(`${supabaseUrl}/rest/v1/form_roots`)
        url2.searchParams.set('select', 'root_form')
        url2.searchParams.set('root_form', `eq.${term}`)
        url2.searchParams.set('limit', '1')
        const res2 = await fetch(url2.toString(), {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })
        if (res2.ok) {
          const rows2 = await res2.json()
          if (Array.isArray(rows2) && rows2.length > 0 && rows2[0]?.root_form) {
            root = rows2[0].root_form
          }
        }
      }
    } catch {
      // ignore and keep root=term
    }

    // 2) Get related forms from inflections table
    const formSet = new Set<string>()
    if (formSet.size === 0) {
      try {
        const url = new URL(`${supabaseUrl}/rest/v1/inflections`)
        // assume columns: root, form
        url.searchParams.set('select', 'inflected_form')
        url.searchParams.set('base_word', `eq.${root}`)
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
            rows.forEach((r: any) => {
              if (r?.inflected_form) {
                try {
                  // inflected_form could be a JSON array or a JSON string
                  let forms;
                  if (Array.isArray(r.inflected_form)) {
                    forms = r.inflected_form;
                  } else {
                    forms = JSON.parse(r.inflected_form);
                  }

                  if (Array.isArray(forms)) {
                    forms.forEach((formObj: any) => {
                      if (formObj?.form) {
                        formSet.add(String(formObj.form))
                      }
                    })
                  } else {
                    // If forms is not an array, add it as a single form
                    formSet.add(String(forms))
                  }
                } catch (e) {
                  // If parsing fails, try to extract forms using regex
                  const formStr = String(r.inflected_form);
                  const formMatches = formStr.match(/'form':\s*'([^']+)'/g)
                  if (formMatches) {
                    formMatches.forEach((match) => {
                      const formMatch = match.match(/'form':\s*'([^']+)'/)
                      if (formMatch && formMatch[1]) {
                        formSet.add(formMatch[1])
                      }
                    })
                  }
                }
              }
            })
          }
        }
      } catch {
        // ignore
      }
    }

    // 4) Enrich counts using word_frequencies and add POS grouping
    const formsArr = Array.from(formSet).filter(f => f && f !== term)
    const enriched: Array<RelatedForm> = formsArr.map(f => ({ form: f }))
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
      url.searchParams.set('select', 'verb_root')
      url.searchParams.set('verb_root', `eq.${root}`)
      url.searchParams.set('limit', '1')
      let r = await fetch(url.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' })
      if (r.ok) {
        const rows = await r.json()
        if (Array.isArray(rows) && rows.length > 0) rootPos = 'verb'
      }
      if (!rootPos) {
        // Query nouns_lexicon (relational format)
        url = new URL(`${supabaseUrl}/rest/v1/nouns_lexicon`)
        url.searchParams.set('select', 'noun_root')
        url.searchParams.set('noun_root', `eq.${root}`)
        url.searchParams.set('limit', '1')
        r = await fetch(url.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' })
        if (r.ok) {
          const rows = await r.json()
          if (Array.isArray(rows) && rows.length > 0) rootPos = 'noun'
        }
      }
      if (rootPos) enriched.forEach(item => { item.pos = rootPos })
    } catch {}

    // Morphology info from inflections
    try {
      const url = new URL(`${supabaseUrl}/rest/v1/inflections`)
      url.searchParams.set('select', 'inflected_form,grammatical_info')
      url.searchParams.set('base_word', `eq.${root}`)
      url.searchParams.set('limit', String(limit))
      const r = await fetch(url.toString(), { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' })
      if (r.ok) {
        const rows: Array<{ inflected_form: string; grammatical_info: any }> = await r.json()
        const infoMap = new Map<string, any>()
        rows.forEach(row => { if (row?.inflected_form) infoMap.set(row.inflected_form, row.grammatical_info) })
        enriched.forEach(item => {
          if (item.form === root) item.relation = 'root'
          else if (infoMap.has(item.form)) { item.relation = 'inflection'; item.info = infoMap.get(item.form) }
          else item.relation = 'mapped'
        })
      }
    } catch {}
    // Sort by count desc then form asc
    enriched.sort((a, b) => (b.count || 0) - (a.count || 0) || a.form.localeCompare(b.form))

    const response: RelatedFormsResponse = { root, forms: enriched, total: enriched.length, ms: Date.now() - started }

    // Cache the result
    RELATED_FORMS_CACHE.set(cacheKey, { data: response, ts: Date.now() })

    return NextResponse.json(response)
  } catch (e) {
    console.error('related_forms error:', e)
    return NextResponse.json({ root: '', forms: [], ms: Date.now() - started }, { status: 500 })
  }
}

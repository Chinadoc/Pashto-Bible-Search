import { NextRequest, NextResponse } from 'next/server'

// Helper function to get occurrence count for a form
async function getFormOccurrenceCount(supabaseUrl: string, supabaseKey: string, form: string): Promise<number> {
  try {
    // Use ILIKE for fuzzy matching to catch variations
    const url = new URL(`${supabaseUrl}/rest/v1/verses`)
    url.searchParams.set('select', 'id')
    url.searchParams.set('text', `ilike.*${form}*`)
    url.searchParams.set('limit', '1') // We just need the count, not the actual rows

    const res = await fetch(url.toString(), {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact', // Request exact count
      },
      cache: 'no-store',
    })

    if (res.ok) {
      // Get count from response headers
      const count = res.headers.get('content-range')?.split('/')[1]
      return count ? parseInt(count, 10) : 0
    }
  } catch {
    // ignore
  }
  return 0
}

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

    // 2) Fetch all forms for this root with occurrence counts
    const forms = new Map<string, number>()
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
          for (const r of rows) {
            if (r?.form) {
              const form = String(r.form)
              // Get occurrence count for this form
              const count = await getFormOccurrenceCount(supabaseUrl, supabaseKey, form)
              forms.set(form, count)
            }
          }
        }
      }
    } catch {
      // ignore – fall back to empty suggestions
    }

    // 3) If no forms found via mapping, try a secondary table name if exists
    if (forms.size === 0) {
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
            for (const r of rows) {
              if (r?.form) {
                const form = String(r.form)
                const count = await getFormOccurrenceCount(supabaseUrl, supabaseKey, form)
                forms.set(form, count)
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }

    // 4) Finalize - convert Map to sorted array with counts
    const formsArray = Array.from(forms.entries())
      .filter(([form]) => form && form !== term)
      .map(([form, count]) => ({ form, count }))
      .sort((a, b) => b.count - a.count) // Sort by frequency descending

    const response = {
      root,
      forms: formsArray,
      total: formsArray.length,
      ms: Date.now() - started
    }

    // Cache the result
    RELATED_FORMS_CACHE.set(cacheKey, { data: response, ts: Date.now() })

    return NextResponse.json(response)
  } catch (e) {
    console.error('related_forms error:', e)
    return NextResponse.json({ root: '', forms: [], ms: Date.now() - started }, { status: 500 })
  }
}


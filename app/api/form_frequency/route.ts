import { NextRequest, NextResponse } from 'next/server'

type Scope = 'all' | 'ot' | 'nt'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ total: 0, items: [] })

    const params = request.nextUrl.searchParams
    const q = (params.get('q') || '').trim()
    const scope = (params.get('scope') as Scope) || 'all'
    const includeRelated = params.get('includeRelated') === '1'
    if (!q) return NextResponse.json({ total: 0, items: [] })

    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' }

    // Determine forms to count
    const forms = new Set<string>([q])
    if (includeRelated) {
      // map q -> root, then root -> forms via form_to_root_map
      try {
        let root = q
        const r1 = await fetch(`${supabaseUrl}/rest/v1/form_to_root_map?select=root&form=eq.${encodeURIComponent(q)}&limit=1`, { headers, cache: 'no-store' })
        if (r1.ok) {
          const rows = await r1.json().catch(() => [])
          if (Array.isArray(rows) && rows[0]?.root) root = String(rows[0].root)
        }
        const r2 = await fetch(`${supabaseUrl}/rest/v1/form_to_root_map?select=form&root=eq.${encodeURIComponent(root)}&limit=2000`, { headers, cache: 'no-store' })
        if (r2.ok) {
          const rows = await r2.json().catch(() => [])
          if (Array.isArray(rows)) rows.forEach((x: any) => { if (x?.form) forms.add(String(x.form)) })
        }
      } catch {}
    }

    // Fetch counts from word_frequencies for these forms in one IN query
    const list = Array.from(forms)
    const inList = list.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    let url = `${supabaseUrl}/rest/v1/word_frequencies?select=pashto_word,frequency_count,testament&pashto_word=in.(${inList})`
    if (scope === 'nt') url += `&testament=eq.NT`
    if (scope === 'ot') url += `&testament=eq.OT`
    const r = await fetch(url, { headers, cache: 'no-store' })
    let rows: Array<{ pashto_word: string; frequency_count: number; testament?: string }> = []
    if (r.ok) rows = await r.json()

    // Aggregate per form
    const map = new Map<string, number>()
    for (const row of rows) {
      const k = row.pashto_word
      const v = Number(row.frequency_count || 0)
      map.set(k, (map.get(k) || 0) + v)
    }
    const items = Array.from(map.entries()).map(([form, frequency]) => ({ form, frequency }))
    items.sort((a, b) => b.frequency - a.frequency || a.form.localeCompare(b.form))
    const total = items.reduce((s, it) => s + (it.frequency || 0), 0)

    return NextResponse.json({ total, items })
  } catch (e) {
    console.error('form_frequency error:', e)
    return NextResponse.json({ total: 0, items: [] }, { status: 500 })
  }
}


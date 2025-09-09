import { NextRequest, NextResponse } from 'next/server'

type Scope = 'all' | 'ot' | 'nt'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ items: [] })

    const params = request.nextUrl.searchParams
    const scope = (params.get('scope') as Scope) || 'all'
    const limit = Math.min(1000, Math.max(50, Number(params.get('limit')) || 300))
    const posFilter = (params.get('pos') || 'any').toLowerCase() as 'any' | 'verb' | 'noun'
    const aggregate = params.get('inflections') === '1' // group by root

    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' }

    // 1) Fetch frequencies
    let url = `${supabaseUrl}/rest/v1/word_frequencies?select=word,frequency,testament&order=frequency.desc&limit=${limit}`
    if (scope === 'nt') url += `&testament=eq.NT`
    if (scope === 'ot') url += `&testament=eq.OT`
    const freqRes = await fetch(url, { headers, cache: 'no-store' })
    const freqRows: Array<{ word: string; frequency: number }> = freqRes.ok ? await freqRes.json() : []

    if (!Array.isArray(freqRows) || freqRows.length === 0) return NextResponse.json({ items: [] })

    const forms = Array.from(new Set(freqRows.map(r => r.word).filter(Boolean)))

    // Helper to split into chunks for PostgREST IN clause
    const chunk = <T,>(arr: T[], n = 200) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

    // 2) Map form -> root using form_to_root_map
    const formToRoot = new Map<string, string>()
    for (const part of chunk(forms, 400)) {
      const inList = part.map(v => `"${v.replace(/"/g, '""')}"`).join(',')
      const mUrl = `${supabaseUrl}/rest/v1/form_to_root_map?select=form,root&form=in.(${inList})`
      const r = await fetch(mUrl, { headers, cache: 'no-store' })
      if (r.ok) {
        const rows: Array<{ form: string; root: string }> = await r.json()
        rows.forEach(row => { if (row.form && row.root) formToRoot.set(row.form, row.root) })
      }
    }

    // 3) Determine POS by root via verbs_lexicon/nouns_lexicon (bulk IN)
    const roots = Array.from(new Set(Array.from(formToRoot.values())))
    const rootPos = new Map<string, 'verb' | 'noun'>()
    if (roots.length > 0) {
      for (const part of chunk(roots, 400)) {
        const inRoots = part.map(v => `"${v.replace(/"/g, '""')}"`).join(',')
        const verbsUrl = `${supabaseUrl}/rest/v1/verbs_lexicon?select=p_norm&p_norm=in.(${inRoots})`
        const nounsUrl = `${supabaseUrl}/rest/v1/nouns_lexicon?select=p_norm&p_norm=in.(${inRoots})`
        const [vr, nr] = await Promise.all([
          fetch(verbsUrl, { headers, cache: 'no-store' }),
          fetch(nounsUrl, { headers, cache: 'no-store' }),
        ])
        if (vr.ok) {
          const rows: Array<{ p_norm: string }> = await vr.json()
          rows.forEach(row => { if (row?.p_norm) rootPos.set(row.p_norm, 'verb') })
        }
        if (nr.ok) {
          const rows: Array<{ p_norm: string }> = await nr.json()
          rows.forEach(row => { if (row?.p_norm && !rootPos.has(row.p_norm)) rootPos.set(row.p_norm, 'noun') })
        }
      }
    }

    type Item = { form: string; root?: string; pos?: 'verb' | 'noun'; frequency: number }
    let items: Item[] = []

    if (aggregate) {
      // Sum by root
      const sum = new Map<string, number>()
      for (const row of freqRows) {
        const root = formToRoot.get(row.word) || row.word
        sum.set(root, (sum.get(root) || 0) + Number(row.frequency || 0))
      }
      items = Array.from(sum.entries()).map(([root, frequency]) => ({ form: root, root, pos: rootPos.get(root), frequency }))
    } else {
      // Keep by form
      items = freqRows.map(row => {
        const root = formToRoot.get(row.word)
        const pos = root ? rootPos.get(root) : undefined
        return { form: row.word, root, pos, frequency: Number(row.frequency || 0) }
      })
    }

    if (posFilter !== 'any') items = items.filter(it => (it.pos || 'any') === posFilter)
    items.sort((a, b) => b.frequency - a.frequency || a.form.localeCompare(b.form))

    return NextResponse.json({ items })
  } catch (e) {
    console.error('lexicon_frequency error:', e)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}


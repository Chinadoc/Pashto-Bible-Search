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

    // 4) Fetch comprehensive dictionary and linguistic data for forms
    const dictionaryMap = new Map<string, {
      definition?: string;
      romanized?: string;
      pos?: string;
      english?: string;
      conjugation_pattern?: string;
      stems?: any;
      roots?: any;
      past_participle?: string;
      irregularity_type?: string;
      gender?: string;
      number?: string;
      plural_forms?: string;
    }>()

    if (forms.length > 0) {
      for (const part of chunk(forms, 400)) {
        const inForms = part.map(v => `"${v.replace(/"/g, '""')}"`).join(',')

        // Fetch dictionary data
        const dictUrl = `${supabaseUrl}/rest/v1/dictionary?select=pashto,definition,romanized,pos&pashto=in.(${inForms})`
        const dictRes = await fetch(dictUrl, { headers, cache: 'no-store' })
        if (dictRes.ok) {
          const dictRows: Array<{ pashto: string; definition?: string; romanized?: string; pos?: string }> = await dictRes.json()
          dictRows.forEach(row => {
            if (row.pashto) {
              dictionaryMap.set(row.pashto, {
                definition: row.definition,
                romanized: row.romanized,
                pos: row.pos,
                english: row.definition,
              })
            }
          })
        }

        // Fetch verb conjugation data from irregular_verbs and verbs_lexicon
        const verbsUrl = `${supabaseUrl}/rest/v1/irregular_verbs?select=verb_root,stems,roots,past_participle,romanization,irregularity_type,conjugation_pattern&verb_root=in.(${inForms})`
        const verbsRes = await fetch(verbsUrl, { headers, cache: 'no-store' })
        if (verbsRes.ok) {
          const verbRows: Array<{
            verb_root: string;
            stems?: any;
            roots?: any;
            past_participle?: string;
            romanization?: any;
            irregularity_type?: string;
            conjugation_pattern?: string;
          }> = await verbsRes.json()

          verbRows.forEach(row => {
            if (row.verb_root) {
              const existing = dictionaryMap.get(row.verb_root) || {}
              dictionaryMap.set(row.verb_root, {
                ...existing,
                conjugation_pattern: row.conjugation_pattern,
                stems: row.stems,
                roots: row.roots,
                past_participle: row.past_participle,
                irregularity_type: row.irregularity_type,
              })
            }
          })
        }

        // Also check regular verbs lexicon
        const regularVerbsUrl = `${supabaseUrl}/rest/v1/verbs_lexicon?select=verb_root,stems,roots,past_participle,romanization,conjugation_pattern&verb_root=in.(${inForms})`
        const regularVerbsRes = await fetch(regularVerbsUrl, { headers, cache: 'no-store' })
        if (regularVerbsRes.ok) {
          const regularVerbRows: Array<{
            verb_root: string;
            stems?: any;
            roots?: any;
            past_participle?: string;
            romanization?: any;
            conjugation_pattern?: string;
          }> = await regularVerbsRes.json()

          regularVerbRows.forEach(row => {
            if (row.verb_root) {
              const existing = dictionaryMap.get(row.verb_root) || {}
              dictionaryMap.set(row.verb_root, {
                ...existing,
                conjugation_pattern: row.conjugation_pattern,
                stems: row.stems,
                roots: row.roots,
                past_participle: row.past_participle,
              })
            }
          })
        }

        // Fetch noun data
        const nounsUrl = `${supabaseUrl}/rest/v1/nouns_lexicon?select=pashto_word,romanized,gender,number,plural_forms&pashto_word=in.(${inForms})`
        const nounsRes = await fetch(nounsUrl, { headers, cache: 'no-store' })
        if (nounsRes.ok) {
          const nounRows: Array<{
            pashto_word: string;
            romanized?: string;
            gender?: string;
            number?: string;
            plural_forms?: any;
          }> = await nounsRes.json()

          nounRows.forEach(row => {
            if (row.pashto_word) {
              const existing = dictionaryMap.get(row.pashto_word) || {}
              dictionaryMap.set(row.pashto_word, {
                ...existing,
                romanized: row.romanized,
                gender: row.gender,
                number: row.number,
                plural_forms: row.plural_forms,
              })
            }
          })
        }
      }
    }

    // 5) Fetch morphological data (related forms and inflections)
    const morphologicalMap = new Map<string, {
      relatedForms?: Array<{ form: string; count: number }>;
      inflections?: Array<{ form: string; grammatical_info: any; frequency: number }>;
    }>()

    // 6) Fetch verse contexts for top frequency words
    const verseContextsMap = new Map<string, Array<{
      verse_ref: string;
      verse_text: string;
      book: string;
      chapter: number;
      verse: number;
    }>>()

    // Only fetch contexts for the top 50 most frequent words to avoid performance issues
    const topForms = forms.slice(0, 50)
    if (topForms.length > 0) {
      for (const part of chunk(topForms, 20)) {
        const inForms = part.map(v => `"${v.replace(/"/g, '""')}"`).join(',')

        // Get verse contexts via form_occurrences
        const contextsUrl = `${supabaseUrl}/rest/v1/form_occurrences?select=pashto_form,verse_reference,context&pashto_form=in.(${inForms})`
        const contextsRes = await fetch(contextsUrl, { headers, cache: 'no-store' })
        if (contextsRes.ok) {
          const contextsRows: Array<{ pashto_form: string; verse_reference: string; context: string }> = await contextsRes.json()

          // Group contexts by word form
          const contextsByForm = new Map<string, Array<{
            verse_ref: string;
            verse_text: string;
            book: string;
            chapter: number;
            verse: number;
          }>>()

          contextsRows.forEach(row => {
            if (row.pashto_form && row.verse_reference && row.context) {
              const form = row.pashto_form
              if (!contextsByForm.has(form)) {
                contextsByForm.set(form, [])
              }

              // Parse verse reference (e.g., "Genesis 1:1")
              const verseMatch = row.verse_reference.match(/^(.+?)\s+(\d+):(\d+)$/)
              if (verseMatch) {
                const [, book, chapter, verse] = verseMatch
                contextsByForm.get(form)!.push({
                  verse_ref: row.verse_reference,
                  verse_text: row.context,
                  book,
                  chapter: parseInt(chapter),
                  verse: parseInt(verse)
                })
              }
            }
          })

          contextsByForm.forEach((contexts, form) => {
            verseContextsMap.set(form, contexts.sort((a, b) =>
              a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse
            ).slice(0, 5)) // Limit to 5 contexts per word
          })
        }
      }
    }

    if (forms.length > 0) {
      for (const part of chunk(forms, 400)) {
        const inForms = part.map(v => `"${v.replace(/"/g, '""')}"`).join(',')

        // Get related forms via form_roots
        const relatedFormsUrl = `${supabaseUrl}/rest/v1/form_roots?select=word_form,root_word,frequency&word_form=in.(${inForms})`
        const relatedFormsRes = await fetch(relatedFormsUrl, { headers, cache: 'no-store' })
        if (relatedFormsRes.ok) {
          const relatedFormsRows: Array<{ word_form: string; root_word: string; frequency: number }> = await relatedFormsRes.json()

          // Group related forms by base word
          const relatedFormsByBase = new Map<string, Array<{ form: string; count: number }>>()
          relatedFormsRows.forEach(row => {
            if (row.word_form && row.root_word) {
              const base = row.word_form
              if (!relatedFormsByBase.has(base)) {
                relatedFormsByBase.set(base, [])
              }
              relatedFormsByBase.get(base)!.push({
                form: row.root_word,
                count: row.frequency || 0
              })
            }
          })

          relatedFormsByBase.forEach((forms, base) => {
            morphologicalMap.set(base, {
              ...morphologicalMap.get(base),
              relatedForms: forms.sort((a, b) => b.count - a.count).slice(0, 10)
            })
          })
        }

        // Get inflections
        const inflectionsUrl = `${supabaseUrl}/rest/v1/inflections?select=base_word,inflected_form,grammatical_info,frequency&base_word=in.(${inForms})`
        const inflectionsRes = await fetch(inflectionsUrl, { headers, cache: 'no-store' })
        if (inflectionsRes.ok) {
          const inflectionsRows: Array<{ base_word: string; inflected_form: string; grammatical_info: any; frequency: number }> = await inflectionsRes.json()

          // Group inflections by base word
          const inflectionsByBase = new Map<string, Array<{ form: string; grammatical_info: any; frequency: number }>>()
          inflectionsRows.forEach(row => {
            if (row.base_word && row.inflected_form) {
              const base = row.base_word
              if (!inflectionsByBase.has(base)) {
                inflectionsByBase.set(base, [])
              }
              inflectionsByBase.get(base)!.push({
                form: row.inflected_form,
                grammatical_info: row.grammatical_info,
                frequency: row.frequency || 0
              })
            }
          })

          inflectionsByBase.forEach((inflections, base) => {
            morphologicalMap.set(base, {
              ...morphologicalMap.get(base),
              inflections: inflections.sort((a, b) => b.frequency - a.frequency).slice(0, 15)
            })
          })
        }
      }
    }

    type Item = {
      form: string;
      root?: string;
      pos?: 'verb' | 'noun';
      frequency: number;
      dictionary?: {
        definition?: string;
        romanized?: string;
        pos?: string;
        english?: string;
      };
      morphological?: {
        relatedForms?: Array<{ form: string; count: number }>;
        inflections?: Array<{ form: string; grammatical_info: any; frequency: number }>;
      };
      verseContexts?: Array<{
        verse_ref: string;
        verse_text: string;
        book: string;
        chapter: number;
        verse: number;
      }>;
    }
    let items: Item[] = []

    if (aggregate) {
      // Sum by root
      const sum = new Map<string, number>()
      for (const row of freqRows) {
        const root = formToRoot.get(row.word) || row.word
        sum.set(root, (sum.get(root) || 0) + Number(row.frequency || 0))
      }
      items = Array.from(sum.entries()).map(([root, frequency]) => ({
        form: root,
        root,
        pos: rootPos.get(root),
        frequency,
        dictionary: dictionaryMap.get(root),
        morphological: morphologicalMap.get(root),
        verseContexts: verseContextsMap.get(root)
      }))
    } else {
      // Keep by form
      items = freqRows.map(row => {
        const root = formToRoot.get(row.word)
        const pos = root ? rootPos.get(root) : undefined
        return {
          form: row.word,
          root,
          pos,
          frequency: Number(row.frequency || 0),
          dictionary: dictionaryMap.get(row.word),
          morphological: morphologicalMap.get(row.word),
          verseContexts: verseContextsMap.get(row.word)
        }
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


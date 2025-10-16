import { NextRequest, NextResponse } from 'next/server'
import { getLightweightData } from '../../lib/data/load'

type Scope = 'all' | 'ot' | 'nt'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const scope = (params.get('scope') as Scope) || 'all'
    const limit = Math.min(1000, Math.max(50, Number(params.get('limit')) || 300))
    const posFilter = (params.get('pos') || 'any').toLowerCase() as 'any' | 'verb' | 'noun'
    const aggregate = params.get('inflections') === '1' // group by root

    // Load LingDocs dictionary and frequency data
    console.log('Loading lightweight data...')
    const data = await getLightweightData()
    console.log(`Loaded ${data.dictionaryByPashto.size} dictionary entries, ${data.frequencyMap.size} frequency entries`)

    const { dictionaryByPashto, frequencyMap, formToRoot, formsByRoot, occurrenceMap, inflectionsByBase } = data

    // Get top frequency words
    const freqEntries = Array.from(frequencyMap.entries())
      .map(([word, frequency]) => ({ word, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)

    console.log(`Found ${freqEntries.length} frequency entries`)

    if (freqEntries.length === 0) {
      console.log('No frequency entries found')
      return NextResponse.json({ items: [] })
    }

    const forms = Array.from(new Set(freqEntries.map(r => r.word).filter(Boolean)))
    console.log(`Processing ${forms.length} unique forms`)

    // 4) Use existing LingDocs dictionary data
    const dictionaryMap = new Map<string, {
      definition?: string;
      romanized?: string;
      pos?: string;
      english?: string;
    }>()

    console.log('Building dictionary map...')
    for (const form of forms) {
      const dictEntry = dictionaryByPashto.get(form)
      if (dictEntry) {
        dictionaryMap.set(form, {
          definition: dictEntry.english,
          romanized: dictEntry.romanized,
          pos: dictEntry.pos,
          english: dictEntry.english,
        })
        console.log(`Found dictionary entry for: ${form}`)
      } else {
        console.log(`No dictionary entry found for: ${form}`)
      }
    }
    console.log(`Dictionary map has ${dictionaryMap.size} entries`)

    // 3) Determine POS using LingDocs dictionary data
    const rootPos = new Map<string, 'verb' | 'noun'>()
    console.log('Determining POS for forms...')
    for (const form of forms) {
      const dictEntry = dictionaryByPashto.get(form)
      if (dictEntry) {
        const pos = dictEntry.pos?.toLowerCase()
        if (pos?.includes('verb') || pos?.includes('v.')) {
          rootPos.set(form, 'verb')
          console.log(`Set ${form} as verb`)
        } else if (pos?.includes('noun') || pos?.includes('n.')) {
          rootPos.set(form, 'noun')
          console.log(`Set ${form} as noun`)
        }
      }
    }
    console.log(`POS map has ${rootPos.size} entries`)

    // 5) Use existing inflection data for morphological information
    const morphologicalMap = new Map<string, {
      relatedForms?: Array<{ form: string; count: number }>;
      inflections?: Array<{ form: string; grammatical_info: any; frequency: number }>;
    }>()

    // Build morphological data from existing inflections
    for (const form of forms) {
      const inflections = inflectionsByBase.get(form)
      if (inflections && inflections.length > 0) {
        morphologicalMap.set(form, {
          inflections: inflections.map(inf => ({
            form: inf.form,
            grammatical_info: { category: inf.category },
            frequency: 0
          }))
        })
      }
    }

    // 6) Use existing occurrence data for verse contexts
    const verseContextsMap = new Map<string, Array<{
      verse_ref: string;
      verse_text: string;
      book: string;
      chapter: number;
      verse: number;
    }>>()

    // Build verse contexts from occurrence data
    for (const form of forms.slice(0, 50)) {
      const occurrences = occurrenceMap.get(form)
      if (occurrences && occurrences.verses && occurrences.verses.length > 0) {
        const contexts = occurrences.verses.slice(0, 5).map(verseRef => {
          const verseMatch = verseRef.match(/^(.+?)\s+(\d+):(\d+)$/)
          if (verseMatch) {
            const [, book, chapter, verse] = verseMatch
            return {
              verse_ref: verseRef,
              verse_text: '',
              book,
              chapter: parseInt(chapter),
              verse: parseInt(verse)
            }
          }
          return null
        }).filter(Boolean) as Array<{
          verse_ref: string;
          verse_text: string;
          book: string;
          chapter: number;
          verse: number;
        }>

        if (contexts.length > 0) {
          verseContextsMap.set(form, contexts)
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
      for (const entry of freqEntries) {
        const root = formToRoot[entry.word]?.[0] || entry.word
        sum.set(root, (sum.get(root) || 0) + entry.frequency)
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
      items = freqEntries.map(entry => {
        const pos = rootPos.get(entry.word) || undefined
        const root = formToRoot[entry.word]?.[0] || undefined
        return {
          form: entry.word,
          root,
          pos,
          frequency: entry.frequency,
          dictionary: dictionaryMap.get(entry.word),
          morphological: morphologicalMap.get(entry.word),
          verseContexts: verseContextsMap.get(entry.word)
        }
      })
    }

    console.log(`Before POS filtering: ${items.length} items`)
    if (posFilter !== 'any') {
      items = items.filter(it => (it.pos || 'any') === posFilter)
      console.log(`After POS filtering: ${items.length} items`)
    }
    items.sort((a, b) => b.frequency - a.frequency || a.form.localeCompare(b.form))

    console.log(`Final items: ${items.length}`)
    console.log('Sample items:', items.slice(0, 3))

    return NextResponse.json({ items })
  } catch (e) {
    console.error('lexicon_frequency error:', e)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
}


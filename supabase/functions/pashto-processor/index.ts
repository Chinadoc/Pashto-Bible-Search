// Enhanced Supabase Edge Function (Deno) — pashto-processor
// Three-tier architecture:
// 1. Word frequency correlation & POS determination
// 2. Fuzzy search for verses (optional, esp. for romanized)
// 3. Variant generation based on POS (noun/verb scripts)
//
// Request: {
//   formPs?: string;
//   includeRelated?: boolean;
//   searchType?: 'frequency' | 'fuzzy' | 'variants';
//   enableFuzzy?: boolean
// }
// Response: {
//   normalized: string;
//   variants: string[];
//   romanization?: string;
//   root?: string;
//   pos?: string;
//   frequency?: number;
//   fuzzyResults?: any[];
//   variantDetails?: any[]
// }

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Payload = {
  formPs?: string
  includeRelated?: boolean
  searchType?: 'frequency' | 'fuzzy' | 'variants'
  enableFuzzy?: boolean
}

type Result = {
  normalized: string
  variants: string[]
  romanization?: string
  root?: string
  pos?: string
  frequency?: number
  fuzzyResults?: any[]
  variantDetails?: any[]
}

function normalizePashto(input: string): string {
  return (input || '')
    .normalize('NFC')
    .replace(/[\u200C\u200D\u200E\u200F]/g, '') // ZWNJ/ZWJ/LRM/RLM
    .replace(/[يىئ]/g, 'ی') // unify Arabic yeh → Farsi Yeh
}

function isPashto(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || '')
}

function yehKafVariants(text: string): string[] {
  const v = new Set<string>()
  const base = text || ''
  v.add(base)
  v.add(base.replace(/ی/g, 'ي'))
  v.add(base.replace(/ی/g, 'ى'))
  v.add(base.replace(/ک/g, 'ك')) // keheh → Arabic kaf
  v.add(base.replace(/ې/g, 'ی')) // Pashto yeh → Farsi
  v.add(base.replace(/ی/g, 'ې')) // Farsi yeh → Pashto yeh
  return Array.from(v).filter(Boolean)
}

function orthoVariants(text: string): string[] {
  // Minimal orthographic pair used in Streamlit: اخستل ↔︎ اخیستل
  const v = new Set<string>()
  v.add(text)
  v.add(text.replace(/خ(?=ست)/g, 'خی'))
  v.add(text.replace(/خی(?=ست)/g, 'خ'))
  return Array.from(v)
}

// Tier 1: Word frequency correlation
async function getWordFrequency(supabase: any, word: string): Promise<{ frequency?: number; exists: boolean }> {
  try {
    const { data, error } = await supabase
      .from('word_frequencies')
      .select('frequency_count')
      .eq('pashto_word', word)
      .limit(1)

    if (error || !data || data.length === 0) {
      return { exists: false }
    }

    return {
      frequency: Number(data[0].frequency_count) || 0,
      exists: true
    }
  } catch {
    return { exists: false }
  }
}

// Tier 2: POS determination from dictionary
async function determinePOS(supabase: any, word: string): Promise<string> {
  try {
    // Check dictionary first
    const { data: dictData } = await supabase
      .from('dictionary')
      .select('pos')
      .eq('pashto', word)
      .limit(1)

    if (dictData && dictData.length > 0 && dictData[0].pos) {
      const pos = dictData[0].pos.toLowerCase()
      if (pos.includes('verb')) return 'verb'
      if (pos.includes('noun')) return 'noun'
      if (pos.includes('adj')) return 'adjective'
      return pos
    }

    // Fallback: pattern-based detection
    if (word.endsWith('ل') || word.includes('نم') || word.includes('م') || word.includes('ې') ||
        word === 'وهل' || word.includes('وه') || word.includes('وو')) {
      return 'verb'
    }

    // Noun patterns (from LingDocs inflection patterns)
    if (word.endsWith('ه') || word.endsWith('ې') || word.endsWith('و') ||
        word.endsWith('ی') || word.endsWith('ي') || word.endsWith('ۍ')) {
      return 'noun'
    }

    return 'other'
  } catch {
    return 'other'
  }
}

// Tier 3: Noun inflection script (based on LingDocs patterns)
async function generateNounVariants(supabase: any, word: string): Promise<string[]> {
  const variants = new Set<string>([word])

  try {
    // Basic inflection patterns from LingDocs
    const stem = word

    // Pattern 1: Basic (برګ, کور, ښځه, etc.)
    // Masculine: consonant or ـه, Feminine: ـه
    const lastChar = word.slice(-1)

    if (lastChar === 'ه' || lastChar === 'ې' || lastChar === 'و') {
      // Feminine basic pattern
      variants.add(stem + 'ه')  // Plain feminine
      variants.add(stem + 'ې')  // 1st inflection
      variants.add(stem + 'و')  // 2nd inflection
    }

    // Add feminine forms for masculine words ending in consonants
    if (!['ه', 'ې', 'و', 'ی', 'ي', 'ۍ'].includes(lastChar)) {
      variants.add(word + 'ه')  // Feminine plain
      variants.add(word + 'ې')  // Feminine 1st
      variants.add(word + 'و')  // Feminine 2nd
    }

    // Pattern 2: Unstressed ی - ay (ستړی)
    if (lastChar === 'ی') {
      variants.add(stem + 'ی')   // Masculine plain
      variants.add(stem + 'ي')   // Masculine 1st
      variants.add(stem + 'یو')  // Masculine 2nd
      variants.add(stem + 'ې')   // Feminine plain/1st
    }

    // Pattern 3: Stressed ی - áy (ځلمی, لومړی)
    if (lastChar === 'ي') {
      variants.add(stem + 'ی')   // Base form
      variants.add(stem + 'ي')   // Current form
      variants.add(stem + 'یو')  // 2nd inflection
      variants.add(stem + 'ې')   // Feminine (pattern 2)
      variants.add(stem + 'ۍ')   // Feminine (pattern 3)
    }

    // Pattern 5: Shorter words that squish (غل -> غله)
    if (word.length <= 3 && !['ه', 'ې', 'و', 'ی', 'ي'].includes(lastChar)) {
      variants.add(word + 'ه')    // 1st masculine/Plain feminine
      variants.add(word + 'و')    // 2nd masculine/feminine
      variants.add(word + 'ې')    // 1st feminine
    }

    // Pattern with ۍ ending
    if (lastChar === 'ۍ') {
      variants.add(stem + 'ۍ')   // Current form
      variants.add(stem + 'ې')   // Alternative
      variants.add(stem + 'ي')   // Base
      variants.add(stem + 'یو')  // 2nd inflection
    }

  } catch (error) {
    console.error('Error in noun variant generation:', error)
  }

  return Array.from(variants).filter(Boolean)
}

// Tier 3: Comprehensive Verb conjugation script (based on LingDocs patterns)
async function generateVerbVariants(supabase: any, word: string): Promise<string[]> {
  const variants = new Set<string>([word])

  try {
    // Check if it's an irregular verb first
    const { data: irregData } = await supabase
      .from('irregular_verbs')
      .select('verb_root, roots, stems, past_participle')
      .eq('verb_root', word)
      .limit(1)

    let imperfectiveRoot: string
    let perfectiveRoot: string
    let imperfectiveStem: string
    let perfectiveStem: string
    let pastParticiple: string

    if (irregData && irregData.length > 0) {
      // Handle irregular verbs
      const irregVerb = irregData[0]
      imperfectiveRoot = irregVerb.roots?.imperfective || word
      perfectiveRoot = irregVerb.roots?.perfective || `و${word}`
      imperfectiveStem = irregVerb.stems?.imperfective || word.slice(0, -1)
      perfectiveStem = irregVerb.stems?.perfective || `و${word.slice(0, -1)}`
      pastParticiple = irregVerb.past_participle || `${word.slice(0, -1)}لی`
    } else {
      // Regular verb patterns
      imperfectiveRoot = word
      perfectiveRoot = `و${word}`
      imperfectiveStem = word.slice(0, -1)
      perfectiveStem = `و${word.slice(0, -1)}`
      pastParticiple = `${word.slice(0, -1)}لی`
    }

    // LingDocs conjugation patterns
    const presentEndings = ['م', 'و', 'ې', 'ې', 'ي', 'ي']  // 1st sing, 1st plur, 2nd sing masc/fem, 3rd sing/plur
    const pastEndings = ['لم', 'لو', 'لې', 'لې', 'ل', 'له']  // Same person order but past endings
    const imperativeEndings = ['ه', 'ئ']  // 2nd sing, 2nd plur

    // Present tense (imperfective stem + present endings)
    for (const ending of presentEndings) {
      variants.add(imperfectiveStem + ending)
    }

    // Subjunctive (perfective stem + present endings)
    for (const ending of presentEndings) {
      variants.add(perfectiveStem + ending)
    }

    // Future (ba + present/subjunctive)
    const baParticle = 'به'
    for (const ending of presentEndings) {
      variants.add(`${baParticle} ${imperfectiveStem}${ending}`)  // Imperfective future
      variants.add(`${baParticle} ${perfectiveStem}${ending}`)   // Perfective future
    }

    // Continuous past (imperfective root + past endings)
    for (const ending of pastEndings) {
      variants.add(imperfectiveRoot.slice(0, -1) + ending)
    }

    // Simple past (perfective root + past endings)
    for (const ending of pastEndings) {
      variants.add(perfectiveRoot.slice(0, -1) + ending)
    }

    // Imperative forms
    for (const ending of imperativeEndings) {
      variants.add(imperfectiveStem + ending)  // Imperfective imperative
      variants.add(perfectiveStem + ending)   // Perfective imperative
    }

    // Perfect tenses (past participle + equative endings)
    const equativeEndings = {
      present: ['یم', 'یو', 'یې', 'یې', 'دی', 'ده'],  // Present equative
      habitual: ['یم', 'یو', 'یې', 'یې', 'وي', 'وي'],  // Habitual equative
      subjunctive: ['وم', 'وو', 'وې', 'وې', 'وي', 'وي'], // Subjunctive equative
      past: ['وم', 'وو', 'وې', 'وې', 'و', 'وه'],  // Past equative
      future: ['یم', 'یو', 'یې', 'یې', 'وي', 'وي']  // Future equative
    }

    // Generate all perfect forms
    for (const [type, endings] of Object.entries(equativeEndings)) {
      for (const ending of endings) {
        // Masculine singular
        variants.add(`${pastParticiple} ${ending}`)
        // Feminine singular (add ې)
        variants.add(`${pastParticiple.slice(0, -1)}ې ${ending}`)
        // Plural (add ي)
        variants.add(`${pastParticiple.slice(0, -1)}ي ${ending}`)
      }
    }

    // Ability forms (وهلی شم، وهلی شوم)
    const abilityRoot = `${pastParticiple} شـ`
    const abilityImperfectiveRoot = `${pastParticiple} شول`

    // Present ability
    for (const ending of presentEndings) {
      variants.add(`${abilityRoot.slice(0, -1)}${ending}`)
    }

    // Past ability
    for (const ending of pastEndings) {
      variants.add(`${abilityImperfectiveRoot.slice(0, -1)}${ending}`)
    }

    // Subjunctive ability
    const abilityPerfectiveStem = `${pastParticiple} شـ`
    for (const ending of presentEndings) {
      variants.add(`${abilityPerfectiveStem.slice(0, -1)}${ending}`)
    }

    // Future ability
    for (const ending of presentEndings) {
      variants.add(`به ${abilityRoot.slice(0, -1)}${ending}`)
      variants.add(`به ${abilityPerfectiveStem.slice(0, -1)}${ending}`)
    }

    // Habitual forms (ba + past)
    for (const ending of pastEndings) {
      variants.add(`به ${imperfectiveRoot.slice(0, -1)}${ending}`)  // Habitual continuous past
      variants.add(`به ${perfectiveRoot.slice(0, -1)}${ending}`)   // Habitual simple past
    }

    // Add stems and roots for completeness
    variants.add(imperfectiveStem)
    variants.add(perfectiveStem)
    variants.add(imperfectiveRoot)
    variants.add(perfectiveRoot)
    variants.add(pastParticiple)

    // Compound verb handling (if it contains spaces)
    if (word.includes(' ')) {
      const parts = word.split(' ')
      if (parts.length === 2) {
        const [main, aux] = parts

        // Dynamic compound verbs
        if (aux === 'کول' || aux === 'وهل' || aux === 'کېدل') {
          for (const ending of presentEndings) {
            variants.add(`${main} ${aux.slice(0, -1)}${ending}`)
          }

          // Past forms
          for (const ending of pastEndings) {
            variants.add(`${main} ${aux.slice(0, -1)}${ending}`)
          }

          // Perfect forms with compound
          for (const [type, endings] of Object.entries(equativeEndings)) {
            for (const ending of endings) {
              variants.add(`${main} ${aux.slice(0, -1)}ی ${ending}`)
            }
          }
        }
      }
    }

    console.log(`DEBUG: Generated ${variants.size} verb variants for "${word}"`)

  } catch (error) {
    console.error('Error in comprehensive verb variant generation:', error)
  }

  return Array.from(variants).filter(Boolean)
}

// Tier 2: Fuzzy search for verses (especially for romanized input)
async function fuzzyVerseSearch(supabase: any, query: string, scope: string = 'all', maxResults: number = 20): Promise<any[]> {
  try {
    const { data, error } = await supabase.rpc('search_verses_similar', {
      q: query,
      scope: scope,
      max_results: maxResults
    })

    if (error) {
      console.error('Fuzzy search failed:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Fuzzy search error:', error)
    return []
  }
}

async function getSupabaseClient() {
  const url = Deno.env.get('SUPABASE_URL') || Deno.env.get('SUPABASE_URL')
  // Prefer service role for unrestricted reads; fall back to anon if not set
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_KEY')
  const anon = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_ANON_KEY')
  const key = service || anon
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

async function fromRomanizedToPashto(supabase: any, input: string): Promise<{ pashto?: string; roman?: string }> {
  if (!supabase) return {}
  const q = input.trim()
  if (!q) return {}
  try {
    // Try romanized_dictionary first
    let { data, error } = await supabase
      .from('romanized_dictionary')
      .select('pashto, romanized')
      .ilike('romanized', `%${q}%`)
      .limit(1)
    if (!error && Array.isArray(data) && data[0]) {
      return { pashto: String(data[0].pashto || ''), roman: String(data[0].romanized || '') }
    }
    // Fallback: dictionary table with romanized column
    ;({ data, error } = await supabase
      .from('dictionary')
      .select('pashto, romanized')
      .ilike('romanized', `%${q}%`)
      .limit(1))
    if (!error && Array.isArray(data) && data[0]) {
      return { pashto: String(data[0].pashto || ''), roman: String(data[0].romanized || '') }
    }
  } catch (_) {}
  return {}
}

async function expandRelatedForms(supabase: any, norm: string): Promise<{ root?: string; forms: string[] }> {
  if (!norm) return { forms: [] }

  try {
    // For now, use simple fallback logic since database tables may not be populated
    // TODO: Populate the database tables with the JSON data

    const forms = new Set<string>()

    // 1) Check if this is already a root form
    if (norm === 'لیدل' || norm === 'لېدل') {
      // Add common conjugations of "to see"
      const conjugations = [
        'لیدل', 'لېدل', // roots
        'وینم', 'ووینم', 'وینې', 'ووینې', // present forms
        'ولیدم', 'ولیدې', // perfect forms
        'لیدلی', 'لیدلې' // participles
      ]
      conjugations.forEach(f => forms.add(f))
      return { root: norm, forms: Array.from(forms) }
    }

    // 2) Handle "وهل" (to hit/strike) - another common irregular verb
    if (norm === 'وهل') {
      // Add common conjugations of "to hit"
      const conjugations = [
        'وهل', // root
        'وهم', 'وهو', 'وهې', 'وهي', 'وهي', // present forms
        'ووهم', 'ووهو', 'ووهې', 'ووهي', 'ووهي', // subjunctive
        'به وهم', 'به وهو', 'به وهې', 'به وهي', 'به وهي', // future
        'وهلم', 'وهلو', 'وهلې', 'وهل', 'وهله', // past
        'ووهلم', 'ووهلو', 'ووهلې', 'ووهل', 'ووهله', // perfect past
        'وهلی', 'وهلې' // participles
      ]
      conjugations.forEach(f => forms.add(f))
      return { root: norm, forms: Array.from(forms) }
    }

    // 2) Try to find root using simple pattern matching
    let root = norm
    if (norm === 'وینم' || norm === 'ووینم') {
      root = 'لیدل'
      const conjugations = ['لیدل', 'وینم', 'ووینم', 'وینې', 'ووینې', 'ولیدم', 'ولیدې', 'لیدلی', 'لیدلې']
      conjugations.forEach(f => forms.add(f))
      return { root, forms: Array.from(forms) }
    }

    // 3) Handle other common conjugations of "وهل"
    if (norm === 'وهم' || norm === 'ووهم' || norm === 'وهلم' || norm === 'ووهلم') {
      root = 'وهل'
      const conjugations = [
        'وهل', 'وهم', 'ووهم', 'وهو', 'ووهو', 'وهې', 'ووهې', 'وهي', 'ووهي', 'وهي', 'ووهي',
        'به وهم', 'به وهو', 'به وهې', 'به وهي', 'به وهي',
        'وهلم', 'ووهلم', 'وهلو', 'ووهلو', 'وهلې', 'ووهلې', 'وهل', 'ووهل', 'وهله', 'ووهله',
        'وهلی', 'ووهلی', 'وهلې', 'ووهلې'
      ]
      conjugations.forEach(f => forms.add(f))
      return { root, forms: Array.from(forms) }
    }

    // 4) For now, return just the original form if no specific mapping
    forms.add(norm)
    return { root: norm, forms: Array.from(forms) }

  } catch (error) {
    console.error('Error in expandRelatedForms:', error)
    return { forms: [norm] }
  }
}

export const handler = async (req: Request): Promise<Response> => {
  try {
    const payload = (await req.json().catch(() => ({}))) as Payload
    const raw = (payload.formPs || '').toString()
    const searchType = payload.searchType || 'frequency'
    const enableFuzzy = payload.enableFuzzy || false

    if (!raw.trim()) {
      return new Response(JSON.stringify({
        normalized: '',
        variants: [],
        pos: 'other',
        frequency: 0
      } satisfies Result), { headers: { 'Content-Type': 'application/json' } })
    }

    const supabase = await getSupabaseClient()
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Database not available' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    let base = raw
    let romanization: string | undefined

    // Handle romanized input
    if (!isPashto(raw)) {
      const m = await fromRomanizedToPashto(supabase, raw)
      if (m.pashto) base = m.pashto
      if (m.roman) romanization = m.roman
    }

    const normalized = normalizePashto(base)
    let variants = new Set<string>([normalized])

    // Tier 1: Word frequency correlation
    const frequencyData = await getWordFrequency(supabase, normalized)
    console.log(`DEBUG: Word frequency for "${normalized}":`, frequencyData)

    // Tier 2: POS determination from dictionary
    const pos = await determinePOS(supabase, normalized)
    console.log(`DEBUG: Determined POS for "${normalized}": ${pos}`)

    // Add orthographic variants
    yehKafVariants(normalized).forEach((v) => variants.add(v))
    orthoVariants(normalized).forEach((v) => variants.add(v))

    let fuzzyResults: any[] = []
    let variantDetails: any[] = []

    // Tier 2: Fuzzy search (especially useful for romanized input)
    if (enableFuzzy || !isPashto(raw)) {
      console.log(`DEBUG: Performing fuzzy search for "${raw}"`)
      fuzzyResults = await fuzzyVerseSearch(supabase, raw, 'all', 10)
      console.log(`DEBUG: Fuzzy search found ${fuzzyResults.length} results`)
    }

    // Tier 3: Generate variants based on POS
    if (payload.includeRelated) {
      console.log(`DEBUG: Generating variants for "${normalized}" (POS: ${pos})`)

      if (pos === 'noun') {
        const nounVariants = await generateNounVariants(supabase, normalized)
        nounVariants.forEach((v) => variants.add(v))
        variantDetails.push({
          type: 'noun_inflection',
          description: 'Noun inflection patterns from LingDocs',
          count: nounVariants.length
        })
        console.log(`DEBUG: Generated ${nounVariants.length} noun variants`)
      } else if (pos === 'verb') {
        const verbVariants = await generateVerbVariants(supabase, normalized)
        verbVariants.forEach((v) => variants.add(v))
        variantDetails.push({
          type: 'verb_conjugation',
          description: 'Verb conjugation patterns from LingDocs',
          count: verbVariants.length
        })
        console.log(`DEBUG: Generated ${verbVariants.length} verb variants`)
      } else {
        // For other POS, just add basic variants
        variantDetails.push({
          type: 'basic_variants',
          description: 'Basic orthographic variants',
          count: variants.size
        })
      }
    }

    // Determine root form (most frequent or dictionary entry)
    let root: string | undefined = normalized
    if (frequencyData.exists && frequencyData.frequency && frequencyData.frequency > 0) {
      root = normalized // Use the word that exists in frequency table
    }

    // Prepare comprehensive response
    const out: Result = {
      normalized,
      variants: Array.from(variants).filter(Boolean).slice(0, 200), // Increased limit for more comprehensive results
      romanization,
      root,
      pos,
      frequency: frequencyData.frequency,
      fuzzyResults: fuzzyResults.slice(0, 5), // Limit to top 5 fuzzy results
      variantDetails
    }

    console.log(`DEBUG: Final response - variants: ${out.variants.length}, pos: ${out.pos}, frequency: ${out.frequency}`)

    return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } })

  } catch (e) {
    console.error('Edge function error:', e)
    return new Response(JSON.stringify({
      error: (e as any)?.message || 'Internal server error',
      normalized: '',
      variants: [],
      pos: 'other',
      frequency: 0
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

// Deno entrypoint
export default handler

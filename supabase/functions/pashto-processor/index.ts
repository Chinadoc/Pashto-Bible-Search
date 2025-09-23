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

// Simple in-memory cache for common words (Deno edge functions have memory across requests)
const cache = new Map<string, Result>()
const CACHE_TTL = 3600000 // 1 hour in milliseconds

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
  _cacheTime?: number  // Internal cache timestamp
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

// Tier 3: Optimized Noun inflection (generates only most common variants)
async function generateNounVariants(supabase: any, word: string): Promise<string[]> {
  const variants = new Set<string>([word])

  try {
    const lastChar = word.slice(-1)

    // Only generate the most common/useful variants based on word pattern
    // Focus on religious text patterns (masculine/feminine, singular/plural)

    if (lastChar === 'ه' || lastChar === 'ې' || lastChar === 'و') {
      // Feminine words ending in ه/ې/و - add plural forms
      variants.add(word + 'ي')     // Plural (most common in religious text)
      variants.add(word + 'و')     // Alternative plural
      variants.add(word + 'ې')     // Feminine oblique
    } else if (lastChar === 'ی' || lastChar === 'ي') {
      // Words ending in ی/ي - handle stressed/unstressed patterns
      variants.add(word + 'و')     // Plural form
      variants.add(word + 'ي')     // Alternative form
      if (word.length > 3) {
        variants.add(word + 'ې')   // Feminine form
      }
    } else if (lastChar === 'ۍ') {
      // Abstract nouns ending in ۍ
      variants.add(word + 'ي')     // Plural
      variants.add(word + 'و')     // Alternative plural
    } else {
      // Masculine words ending in consonant - add feminine and plural
      variants.add(word + 'ه')     // Feminine form
      variants.add(word + 'ي')     // Plural form
      if (word.length <= 4) {
        variants.add(word + 'و')   // Short word plural
      }
    }

    // Add some common case/oblique forms for religious text
    if (word.length > 2 && !['ه', 'ې', 'و', 'ی', 'ي', 'ۍ'].includes(lastChar)) {
      variants.add(word + 'ي')     // Oblique case (common in Pashto)
    }

  } catch (error) {
    console.error('Error in optimized noun variant generation:', error)
  }

  return Array.from(variants).filter(Boolean)
}

// Tier 3: Optimized Verb conjugation (generates only most useful variants)
async function generateVerbVariants(supabase: any, word: string): Promise<string[]> {
  const variants = new Set<string>([word])

  try {
    // Check if it's an irregular verb first (single DB query)
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
      const irregVerb = irregData[0]
      imperfectiveRoot = irregVerb.roots?.imperfective || word
      perfectiveRoot = irregVerb.roots?.perfective || `و${word}`
      imperfectiveStem = irregVerb.stems?.imperfective || word.slice(0, -1)
      perfectiveStem = irregVerb.stems?.perfective || `و${word.slice(0, -1)}`
      pastParticiple = irregVerb.past_participle || `${word.slice(0, -1)}لی`
    } else {
      imperfectiveRoot = word
      perfectiveRoot = `و${word}`
      imperfectiveStem = word.slice(0, -1)
      perfectiveStem = `و${word.slice(0, -1)}`
      pastParticiple = `${word.slice(0, -1)}لی`
    }

    // Generate only the most common/useful variants (not all 100+ forms)
    const presentEndings = ['م', 'و', 'ې', 'ي']  // 1st sing, 1st plur, 2nd sing, 3rd sing
    const pastEndings = ['لم', 'لو', 'لې', 'ل']  // 1st sing, 1st plur, 2nd sing, 3rd sing

    // Present tense (most common forms)
    for (const ending of presentEndings) {
      variants.add(imperfectiveStem + ending)  // Present indicative
    }

    // Subjunctive (second most common)
    for (const ending of presentEndings) {
      variants.add(perfectiveStem + ending)   // Present subjunctive
    }

    // Future (ba + present)
    const baParticle = 'به'
    for (const ending of presentEndings) {
      variants.add(`${baParticle} ${imperfectiveStem}${ending}`)  // Imperfective future
    }

    // Past tense (continuous and simple)
    for (const ending of pastEndings) {
      variants.add(imperfectiveRoot.slice(0, -1) + ending)  // Continuous past
      variants.add(perfectiveRoot.slice(0, -1) + ending)   // Simple past
    }

    // Imperative forms (common in religious text)
    variants.add(imperfectiveStem + 'ه')  // 2nd sing imperative
    variants.add(perfectiveStem + 'ه')    // 2nd sing subjunctive imperative

    // Perfect participle (very common in religious text)
    variants.add(pastParticiple)          // Past participle
    variants.add(`${pastParticiple.slice(0, -1)}ی`)  // Plural participle

    // Add stems and roots for completeness
    variants.add(imperfectiveStem)
    variants.add(perfectiveStem)

    console.log(`DEBUG: Generated ${variants.size} optimized verb variants for "${word}"`)

  } catch (error) {
    console.error('Error in optimized verb variant generation:', error)
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

    // Check cache first (simple in-memory cache for common words)
    const cacheKey = `${raw}:${payload.includeRelated}:${enableFuzzy}`
    const cached = cache.get(cacheKey)
    if (cached && (Date.now() - (cached as any)._cacheTime) < CACHE_TTL) {
      console.log(`DEBUG: Cache hit for "${raw}"`)
      return new Response(JSON.stringify(cached), { headers: { 'Content-Type': 'application/json' } })
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

    // Add orthographic variants early (fast, no DB calls)
    yehKafVariants(normalized).forEach((v) => variants.add(v))
    orthoVariants(normalized).forEach((v) => variants.add(v))

    // Parallel execution: Run all database queries concurrently
    const [
      frequencyData,
      pos,
      fuzzyResults,
      nounVariants,
      verbVariants
    ] = await Promise.all([
      // Tier 1: Word frequency correlation
      getWordFrequency(supabase, normalized),

      // Tier 2: POS determination from dictionary
      determinePOS(supabase, normalized),

      // Tier 2: Fuzzy search (especially useful for romanized input)
      (enableFuzzy || !isPashto(raw)) ? fuzzyVerseSearch(supabase, raw, 'all', 10) : Promise.resolve([]),

      // Tier 3: Generate noun variants (if needed)
      payload.includeRelated ? generateNounVariants(supabase, normalized) : Promise.resolve([]),

      // Tier 3: Generate verb variants (if needed)
      payload.includeRelated ? generateVerbVariants(supabase, normalized) : Promise.resolve([])
    ])

    // Add generated variants to main set
    if (payload.includeRelated) {
      nounVariants.forEach((v: string) => variants.add(v))
      verbVariants.forEach((v: string) => variants.add(v))
    }

    console.log(`DEBUG: Word frequency for "${normalized}":`, frequencyData)
    console.log(`DEBUG: Determined POS for "${normalized}": ${pos}`)
    if (fuzzyResults.length > 0) {
      console.log(`DEBUG: Fuzzy search found ${fuzzyResults.length} results`)
    }

    // Generate variant details
    const variantDetails: any[] = []
    if (payload.includeRelated) {
      if (pos === 'noun' && nounVariants.length > 1) {
        variantDetails.push({
          type: 'noun_inflection',
          description: 'Noun inflection patterns from LingDocs',
          count: nounVariants.length
        })
      } else if (pos === 'verb' && verbVariants.length > 1) {
        variantDetails.push({
          type: 'verb_conjugation',
          description: 'Verb conjugation patterns from LingDocs',
          count: verbVariants.length
        })
      } else {
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

    // Prepare optimized response (limit variants to 30 for performance)
    const out: Result = {
      normalized,
      variants: Array.from(variants).filter(Boolean).slice(0, 30), // Optimized limit for performance
      romanization,
      root,
      pos,
      frequency: frequencyData.frequency,
      fuzzyResults: fuzzyResults.slice(0, 5), // Limit to top 5 fuzzy results
      variantDetails
    }

    // Cache the result for future requests (add timestamp for TTL)
    out._cacheTime = Date.now()
    cache.set(cacheKey, out)
    // Limit cache size to prevent memory issues
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
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

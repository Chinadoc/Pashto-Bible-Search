import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'
import type { Verse } from '../../../types'
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
  bookFilter?: string | null
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
    primaryVariant?: string;
    variants: string[];
    variantsSearched?: string[];
    variantDetails?: VariantMeta[];
    variantGroups?: VariantGroup[];
    romanization: string;
  };
  ms: number;
  cached?: boolean;
  error?: string;
}
const SEARCH_CACHE = new Map<string, { data: SearchPayload; ts: number }>()
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes


interface CoverageItem {
  book: string
  count: number
}

// Normalize book name and generate a few common variants so filters match DB names
function bookVariants(input: string | null | undefined): string[] {
  if (!input) return []
  const raw = String(input).trim()
  const dehyphen = raw.replace(/-/g, ' ')
  const singleSp = dehyphen.replace(/\s+/g, ' ').trim()
  const hyDashLead = singleSp.replace(/^(\d)\s+/, '$1-')
  const hyphenAll = singleSp.replace(/\s+/g, '-')
  const collapsed = singleSp.replace(/\s+/g, '')
  const out = new Set<string>([raw, dehyphen, singleSp, hyDashLead, hyphenAll, collapsed])
  return Array.from(out).filter(Boolean)
}

// Compound verb helpers
const AUX_SET = new Set(['وهل','کول','کېدل'])

function splitCompound(q: string): { object: string; aux: string } | null {
  const parts = q.trim().split(/\s+/).filter(Boolean)
  if (parts.length !== 2) return null
  const [obj, aux] = parts
  if (!AUX_SET.has(aux)) return null
  return { object: obj, aux }
}

const PASHTO_CHAR_RE = /[\u0600-\u06FF]/

function dedupePreserveOrder(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const trimmed = value.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

function pushIfUnique(list: string[], seen: Set<string>, value: string) {
  const trimmed = value.trim()
  if (!trimmed || seen.has(trimmed)) return
  seen.add(trimmed)
  list.push(trimmed)
}

function expandInflectionVariants(term: string): string[] {
  const trimmed = term.trim()
  if (!trimmed) return []

  const result: string[] = []
  const seen = new Set<string>()
  pushIfUnique(result, seen, trimmed)

  if (!PASHTO_CHAR_RE.test(trimmed)) {
    return result
  }

  // Pattern 1: Basic (برګ, کور, ښځه, etc.)
  // Masculine: consonant or ـه, Feminine: ـه
  const lastChar = trimmed.slice(-1)
  const stem = trimmed.slice(0, -1)

  if (stem) {
    // Pattern 1: ـه/ـې/ـو endings (feminine basic pattern)
    if (lastChar === 'ه' || lastChar === 'ې' || lastChar === 'و') {
      pushIfUnique(result, seen, `${stem}ه`)  // Plain feminine
      pushIfUnique(result, seen, `${stem}ې`)  // 1st inflection
      pushIfUnique(result, seen, `${stem}و`)  // 2nd inflection
    }
    
    // Pattern 1: Add feminine forms for masculine words ending in consonants
    // e.g., برګ -> برګه, برګې, برګو
    if (![' ه', 'ې', 'و', 'ی', 'ي', 'ۍ'].includes(lastChar)) {
      pushIfUnique(result, seen, `${trimmed}ه`)  // Feminine plain
      pushIfUnique(result, seen, `${trimmed}ې`)  // Feminine 1st
      pushIfUnique(result, seen, `${trimmed}و`)  // Feminine 2nd
    }

    // Pattern 2: Unstressed ی - ay (ستړی)
    if (lastChar === 'ی') {
      pushIfUnique(result, seen, `${stem}ی`)   // Masculine plain
      pushIfUnique(result, seen, `${stem}ي`)   // Masculine 1st
      pushIfUnique(result, seen, `${stem}یو`)  // Masculine 2nd
      pushIfUnique(result, seen, `${stem}ې`)   // Feminine plain/1st
    }

    // Pattern 3: Stressed ی - áy (ځلمی, لومړی)
    if (lastChar === 'ي') {
      pushIfUnique(result, seen, `${stem}ی`)   // Base form
      pushIfUnique(result, seen, `${stem}ي`)   // Current form
      pushIfUnique(result, seen, `${stem}یو`)  // 2nd inflection
      pushIfUnique(result, seen, `${stem}ې`)   // Feminine (pattern 2)
      pushIfUnique(result, seen, `${stem}ۍ`)   // Feminine (pattern 3)
    }

    // Pattern 5.5: Feminine nouns ending in ي - ee (آزادي)
    if (lastChar === 'ي' && trimmed.endsWith('ي')) {
      pushIfUnique(result, seen, `${trimmed}`)     // Plain
      pushIfUnique(result, seen, `${stem}ۍ`)       // 1st inflection  
      pushIfUnique(result, seen, `${stem}یو`)      // 2nd inflection
    }

    // Pattern with ۍ ending
    if (lastChar === 'ۍ') {
      pushIfUnique(result, seen, `${stem}ۍ`)   // Current form
      pushIfUnique(result, seen, `${stem}ې`)   // Alternative
      pushIfUnique(result, seen, `${stem}ي`)   // Base
      pushIfUnique(result, seen, `${stem}یو`)  // 2nd inflection
    }
  }

  // Pattern 3: Handle ـیو ending (second inflection)
  if (trimmed.endsWith('یو') && trimmed.length > 2) {
    const stemYo = trimmed.slice(0, -2)
    pushIfUnique(result, seen, `${stemYo}ی`)   // Base form
    pushIfUnique(result, seen, `${stemYo}ي`)   // 1st inflection  
    pushIfUnique(result, seen, `${stemYo}یو`)  // Current form
    pushIfUnique(result, seen, `${stemYo}ې`)   // Feminine
    pushIfUnique(result, seen, `${stemYo}ۍ`)   // Feminine (stressed)
  }

  // Pattern 4: "Pashtoon" pattern (پښتون -> پښتانه, پښتنه, etc.)
  if (trimmed.endsWith('ون')) {
    const base = trimmed.slice(0, -2)
    pushIfUnique(result, seen, `${base}ون`)     // Plain masculine
    pushIfUnique(result, seen, `${base}انه`)    // 1st masculine  
    pushIfUnique(result, seen, `${base}نو`)     // 2nd masculine
    pushIfUnique(result, seen, `${base}نه`)     // Plain feminine
    pushIfUnique(result, seen, `${base}نې`)     // 1st feminine
  }

  // Pattern 5: Shorter words that squish (غل -> غله)
  if (trimmed.length <= 3 && ![' ه', 'ې', 'و', 'ی', 'ي'].includes(lastChar)) {
    pushIfUnique(result, seen, `${trimmed}`)     // Plain masculine
    pushIfUnique(result, seen, `${trimmed}ه`)    // 1st masculine/Plain feminine
    pushIfUnique(result, seen, `${trimmed}و`)    // 2nd masculine/feminine
    pushIfUnique(result, seen, `${trimmed}ې`)    // 1st feminine
  }

  return result
}

interface VariantMeta {
  form: string
  sources: string[]
  pos?: string
  frequency?: number
  note?: string
  romanization?: string
  pattern?: string
}

interface VariantGroup {
  label: string
  forms: string[]
}

interface VariantCollector {
  add: (form: string, meta?: Partial<VariantMeta>) => void
  addMany: (forms: string[], source: string, meta?: Partial<VariantMeta>) => void
  replaceWith: (entries: Array<{ form: string; meta?: Partial<VariantMeta> }>) => void
  list: () => string[]
  details: () => VariantMeta[]
  get: (form: string) => VariantMeta | undefined
  ensureFeminine: () => void
}

function createVariantCollector(initialTerm: string): VariantCollector {
  const order: string[] = []
  const metaMap = new Map<string, VariantMeta>()

  const normalize = (value: string): string => (value || '').trim()

  const add = (form: string, meta?: Partial<VariantMeta>) => {
    const trimmed = normalize(form)
    if (!trimmed) return

    const incomingSources = Array.isArray(meta?.sources) ? meta!.sources.filter(Boolean) : []
    const existing = metaMap.get(trimmed)
    if (existing) {
      if (incomingSources.length) {
        existing.sources = Array.from(new Set([...existing.sources, ...incomingSources]))
      }
      if (meta?.pos && !existing.pos) existing.pos = meta.pos
      if (typeof meta?.frequency === 'number' && Number.isFinite(meta.frequency)) {
        const freq = Number(meta.frequency)
        existing.frequency = existing.frequency ? Math.max(existing.frequency, freq) : freq
      }
      if (meta?.note && !existing.note) existing.note = meta.note
      if (meta?.romanization && !existing.romanization) existing.romanization = meta.romanization
      if (meta?.pattern && !existing.pattern) existing.pattern = meta.pattern
      return
    }

    const entry: VariantMeta = {
      form: trimmed,
      sources: incomingSources.length ? Array.from(new Set(incomingSources)) : [],
      pos: meta?.pos,
      frequency: typeof meta?.frequency === 'number' && Number.isFinite(meta.frequency) ? meta.frequency : undefined,
      note: meta?.note,
      romanization: meta?.romanization,
      pattern: meta?.pattern,
    }
    metaMap.set(trimmed, entry)
    order.push(trimmed)
  }

  const addMany = (forms: string[], source: string, meta?: Partial<VariantMeta>) => {
    if (!Array.isArray(forms)) return
    for (const form of forms) {
      add(form, { ...meta, sources: [source, ...(meta?.sources ?? [])] })
    }
  }

  const replaceWith = (entries: Array<{ form: string; meta?: Partial<VariantMeta> }>) => {
    order.length = 0
    metaMap.clear()
    for (const entry of entries) {
      add(entry.form, entry.meta)
    }
  }

  const get = (form: string): VariantMeta | undefined => metaMap.get(normalize(form))

  const ensureFeminine = () => {
    const snapshot = order.slice()
    for (const form of snapshot) {
      for (const expanded of expandInflectionVariants(form)) {
        if (expanded !== form) {
          add(expanded, { sources: ['inflection-pattern'] })
        }
      }
    }
  }

  const initialMeta: Partial<VariantMeta> = { sources: ['query'] }
  if (!PASHTO_CHAR_RE.test(initialTerm)) {
    initialMeta.romanization = initialTerm
  }
  add(initialTerm, initialMeta)

  return {
    add,
    addMany,
    replaceWith,
    list: () => order.slice(),
    details: () => order
      .map((form) => metaMap.get(form))
      .filter((meta): meta is VariantMeta => Boolean(meta)),
    get,
    ensureFeminine,
  }
}

function computeVariantScore(meta: VariantMeta, originalTerm: string): number {
  let score = 0

  if (PASHTO_CHAR_RE.test(meta.form)) score += 6
  else score -= 4

  if (meta.form === originalTerm) score += 2
  if (meta.sources.includes('query')) score += 4
  if (meta.sources.includes('inflection-pattern')) score += 2
  if (meta.sources.includes('dictionary')) score += 1
  if (meta.sources.includes('inflection-table')) score += 1
  if (meta.sources.includes('directional-base')) score += 1
  if (meta.sources.includes('irregular-verb')) score += 6

  if (meta.pos) {
    const pos = meta.pos.toLowerCase()
    if (pos.includes('verb')) score += 2
    else if (pos.includes('noun')) score += 2
    else score += 1
  }

  if (typeof meta.frequency === 'number' && meta.frequency > 0) {
    score += Math.min(3, Math.log10(meta.frequency + 1))
  }

  return score
}

function prioritizeVariants(details: VariantMeta[], originalTerm: string): VariantMeta[] {
  return details
    .map((meta, index) => ({ meta, index, score: computeVariantScore(meta, originalTerm) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.meta)
}

function formatPosLabel(pos: string): string {
  const cleaned = (pos || '').replace(/[_-]+/g, ' ').trim()
  if (!cleaned) return 'Other'
  return cleaned
    .split(/\s+/)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

async function backfillRomanizations(
  client: any,
  details: VariantMeta[],
  limit: number
) {
  const missing = dedupePreserveOrder(
    details
      .filter((meta) => PASHTO_CHAR_RE.test(meta.form) && !meta.romanization)
      .map((meta) => meta.form)
  ).slice(0, limit)

  if (missing.length === 0) return

  try {
    const { data } = await client
      .from('dictionary')
      .select('pashto,romanized')
      .in('pashto', missing)
    if (Array.isArray(data)) {
      const map = new Map<string, string>()
      for (const row of data) {
        if (row?.pashto && typeof row?.romanized === 'string' && row.romanized) {
          map.set(String(row.pashto), String(row.romanized))
        }
      }
      if (map.size > 0) {
        for (const meta of details) {
          if (!meta.romanization && map.has(meta.form)) {
            meta.romanization = map.get(meta.form)
          }
        }
      }
    }
  } catch {}

  const stillMissing = details
    .filter((meta) => PASHTO_CHAR_RE.test(meta.form) && !meta.romanization)
    .map((meta) => meta.form)
  const remaining = dedupePreserveOrder(stillMissing).slice(0, limit)
  if (remaining.length === 0) return

  try {
    const { data } = await client
      .from('romanized_dictionary')
      .select('pashto_word,romanization')
      .in('pashto_word', remaining)
    if (Array.isArray(data)) {
      const map = new Map<string, string>()
      for (const row of data) {
        if (row?.pashto_word && typeof row?.romanization === 'string' && row.romanization) {
          map.set(String(row.pashto_word), String(row.romanization))
        }
      }
      if (map.size > 0) {
        for (const meta of details) {
          if (!meta.romanization && map.has(meta.form)) {
            meta.romanization = map.get(meta.form)
          }
        }
      }
    }
  } catch {}
}

const DIRECTIONAL_PREFIXES = ['راو','را','ور','وار','در','له','لا']

function groupVariantsByPos(details: VariantMeta[]): VariantGroup[] {
  const groups = new Map<string, Set<string>>()

  for (const meta of details) {
    if (!meta.pos) continue
    const label = formatPosLabel(meta.pos)
    if (!groups.has(label)) groups.set(label, new Set<string>())
    groups.get(label)!.add(meta.form)
  }

  return Array.from(groups.entries())
    .map(([label, forms]) => ({ label, forms: Array.from(forms) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'en'))
}

function extractRomanizationText(raw: any): string | undefined {
  if (!raw) return undefined
  if (typeof raw === 'string') return raw || undefined
  if (typeof raw === 'object') {
    for (const key of ['imperfective_root','imperfective_stem','perfective_root','perfective_stem','past_participle','base']) {
      const value = (raw as Record<string, any>)[key]
      if (typeof value === 'string' && value) return value
    }
  }
  return undefined
}

async function addDirectionalVariants(collector: VariantCollector) {
  const snapshot = collector.details()
  for (const meta of snapshot) {
    if (!PASHTO_CHAR_RE.test(meta.form)) continue
    const baseRoman = meta.romanization
    for (const prefix of DIRECTIONAL_PREFIXES) {
      if (meta.form.startsWith(prefix) && meta.form.length > prefix.length + 1) {
        const remainder = meta.form.slice(prefix.length)
        if (remainder) {
          collector.add(remainder, { sources: ['directional-base'], pos: meta.pos, romanization: baseRoman })
          if (!remainder.startsWith('و')) {
            collector.add(`و${remainder}`, { sources: ['directional-base'], pos: meta.pos, romanization: baseRoman })
          }
        }
      }
    }
  }
}

async function enrichIrregularVariants(
  client: any,
  collector: VariantCollector
) {
  const pashtoForms = dedupePreserveOrder(
    collector.details()
      .filter((meta) => PASHTO_CHAR_RE.test(meta.form))
      .map((meta) => meta.form)
  ).slice(0, 20)

  if (pashtoForms.length === 0) return

  try {
    const { data } = await client
      .from('irregular_verbs')
      .select('verb_root,roots,stems,past_participle,romanization')
      .in('verb_root', pashtoForms)

    if (Array.isArray(data)) {
      for (const row of data) {
        if (!row?.verb_root) continue
        const root = String(row.verb_root)
        const romanization = extractRomanizationText(row?.romanization)
        const romanizationRecord = (row?.romanization && typeof row?.romanization === 'object') ? (row.romanization as Record<string, any>) : undefined
        const patternLabel = 'Irregular verb'
        const noteLabel = 'Irregular verb'
        const baseRoman = typeof romanizationRecord?.imperfective_root === 'string' ? romanizationRecord.imperfective_root : (romanization || undefined)

        const baseMeta: Partial<VariantMeta> = {
          sources: ['irregular-verb'],
          romanization: baseRoman,
          pattern: patternLabel,
          note: noteLabel,
          pos: 'verb'
        }

        collector.add(root, baseMeta)

        const detail = collector.get(root)
        if (detail) {
          if (!detail.pattern) detail.pattern = patternLabel
          if (!detail.note) detail.note = noteLabel
          if (!detail.pos) detail.pos = 'verb'
          if (!detail.romanization && baseRoman) detail.romanization = baseRoman
          if (!detail.sources.includes('irregular-verb')) {
            detail.sources.push('irregular-verb')
          }
        }

        const addIrregularForm = (formValue: any, romanKey?: string) => {
          if (typeof formValue !== 'string' || !formValue.trim()) return
          const rom = romanKey && romanizationRecord && typeof romanizationRecord[romanKey] === 'string'
            ? romanizationRecord[romanKey] as string
            : baseRoman || romanization || undefined
          collector.add(formValue.trim(), { sources: ['irregular-verb'], romanization: rom, pattern: patternLabel, note: noteLabel, pos: 'verb' })
        }

        if (row?.roots && typeof row.roots === 'object') {
          const rootsRecord = row.roots as Record<string, any>
          addIrregularForm(rootsRecord.perfective, 'perfective_root')
          addIrregularForm(rootsRecord.imperfective, 'imperfective_root')
        }

        addIrregularForm(row?.past_participle, 'past_participle')
      }
    }
  } catch {}
}

async function enrichVariantsFromSupabase(
  client: any,
  lookupTerm: string,
  collector: VariantCollector,
  includeRelated: boolean
) {
  const term = lookupTerm.trim()
  if (!term) return

  const baseLimit = includeRelated ? 80 : 35

  try {
    const { data } = await client
      .from('form_lemmas')
      .select('lemma_form,base_word,part_of_speech,frequency')
      .or(`base_word.eq.${term},lemma_form.eq.${term}`)
      .order('frequency', { ascending: false })
      .limit(baseLimit)
    if (Array.isArray(data)) {
      for (const row of data) {
        const pos = typeof row?.part_of_speech === 'string' ? row.part_of_speech : undefined
        const freq = Number(row?.frequency)
        const frequency = Number.isFinite(freq) ? freq : undefined
        if (row?.lemma_form) collector.add(row.lemma_form, { sources: ['lemma'], pos, frequency })
        if (row?.base_word) collector.add(row.base_word, { sources: ['lemma-base'], pos, frequency })
      }
    }
  } catch {}

  try {
    const { data } = await client
      .from('form_roots')
      .select('word_form,base_word,root_word,frequency')
      .or(`base_word.eq.${term},root_word.eq.${term}`)
      .order('frequency', { ascending: false })
      .limit(baseLimit)
    if (Array.isArray(data)) {
      for (const row of data) {
        const freq = Number(row?.frequency)
        const frequency = Number.isFinite(freq) ? freq : undefined
        if (row?.word_form) collector.add(row.word_form, { sources: ['root-map'], frequency })
        if (includeRelated && row?.base_word) collector.add(row.base_word, { sources: ['root-base'], frequency })
        if (includeRelated && row?.root_word) collector.add(row.root_word, { sources: ['root'], frequency })
      }
    }
  } catch {}

  try {
    const { data } = await client
      .from('inflections')
      .select('inflected_form,grammatical_info,frequency')
      .eq('base_word', term)
      .order('frequency', { ascending: false })
      .limit(baseLimit)
    if (Array.isArray(data)) {
      for (const row of data) {
        const info = row?.grammatical_info as Record<string, any> | null | undefined
        const raw = row?.inflected_form
        const freq = Number(row?.frequency)
        const frequency = Number.isFinite(freq) ? freq : undefined
        const pos = info && typeof info.pos === 'string'
          ? info.pos
          : info && typeof info.part_of_speech === 'string'
            ? info.part_of_speech
            : undefined
        const note = info && typeof info.pattern === 'string' ? info.pattern : undefined
        const pattern = info && typeof info.pattern_info === 'string' ? info.pattern_info : (info && typeof info.pattern === 'string' ? info.pattern : undefined)
        const romanization = info && typeof info.romanization === 'string' ? info.romanization : (info && typeof info.romanized === 'string' ? info.romanized : (info && typeof info.phonetic === 'string' ? info.phonetic : undefined))

        const forms: string[] = []
        if (Array.isArray(raw)) {
          for (const entry of raw) {
            if (typeof entry === 'string') forms.push(entry)
            else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form)
          }
        } else if (typeof raw === 'string') {
          let parsed: any = null
          try {
            parsed = JSON.parse(raw)
          } catch {
            parsed = null
          }
          if (Array.isArray(parsed)) {
            for (const entry of parsed) {
              if (typeof entry === 'string') forms.push(entry)
              else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form)
            }
          } else if (parsed && typeof parsed === 'object' && typeof parsed.form === 'string') {
            forms.push(parsed.form)
          } else {
            forms.push(raw)
          }
        } else if (raw && typeof raw === 'object' && typeof (raw as any).form === 'string') {
          forms.push((raw as any).form)
        }

        if (forms.length === 0 && term) {
          forms.push(term)
        }

        for (const form of forms) {
          collector.add(form, { sources: ['inflection-table'], pos, frequency, note, pattern, romanization })
        }
      }
    }
  } catch {}

  await enrichIrregularVariants(client, collector)
  addDirectionalVariants(collector)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { query, scope, extraVariants, includeRelated, bookFilter }: SearchRequest = await request.json()

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      })
    }

    // Create cache key from search parameters
    const variantsKey = Array.isArray(extraVariants) ? extraVariants.sort().join('|') : ''
    const cacheKey = `${query.trim()}-${scope}-${bookFilter || 'all'}-${includeRelated ? 'rel1' : 'rel0'}-${variantsKey}`

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

    // Try compound verb expansion first (NOUN + AUX)
    const comp = splitCompound(originalTerm)
    if (comp) {
      const { object, aux } = comp
      let forms: string[] = []
      try {
        // Prefer DB inflections for the auxiliary
        const { data } = await supabase
          .from('inflections')
          .select('inflected_form')
          .eq('base_word', aux)
          .order('frequency', { ascending: false })
          .limit(40)
        if (Array.isArray(data) && data.length > 0) {
          for (const row of data) {
            try {
              const inflectedForm = (row as any).inflected_form
              if (typeof inflectedForm === 'string') {
                const parsed = JSON.parse(inflectedForm)
                if (Array.isArray(parsed)) {
                  for (const item of parsed) {
                    if (item && typeof item === 'object' && item.form) {
                      forms.push(String(item.form))
                    }
                  }
                }
              }
            } catch {}
          }
        }
      } catch {}

      // Lightweight fallback for وهل (covers common forms; extend similarly for کول/کېدل as needed)
      if (forms.length === 0 && aux === 'وهل') {
        forms = ['کړه','وکړه','کړم','کړو','کړې','کړئ','کړي','وهه','ووهه','وهم','وهو','وهې','وهئ','وهي','ووهم','ووهو','ووهې','ووهئ','ووهي']
      }
      if (forms.length === 0 && aux === 'کول') {
        forms = ['کوه','کړه','کوم','کوو','کوې','کوئ','کوي','کړم','کړو','کړې','کړئ','کړي']
      }
      if (forms.length === 0 && aux === 'کېدل') {
        forms = ['کېږه','شه','کېږم','کېږو','کېږې','کېږئ','کېږي','شوم','شوو','شوې','شوئ','شوي']
      }

      // Build phrase variants and search per-variant (cap + dedupe)
      const phrases = Array.from(new Set(forms.map(f => `${object} ${f}`))).slice(0, 25)
      const selectCols = 'book,chapter,verse,text,testament'
      const allResults: Verse[] = []
      const refSet = new Set<string>()
      const coverageMap = new Map<string, number>()

      for (const p of phrases) {
        try {
          let q = supabase.from('verses').select(selectCols).ilike('text', `%${p.replace(/%/g,'')}%`)
          if (scope === 'ot') q = q.eq('testament', 'OT')
          if (scope === 'nt') q = q.eq('testament', 'NT')
          if (bookFilter) {
            const books = bookVariants(bookFilter).slice(0, 5)
            if (books.length) q = (q as any).in('book', books)
          }
          const { data, error } = await q.limit(60)
          if (!error && Array.isArray(data) && data.length > 0) {
            for (const row of data as any[]) {
              const text = row.text || ''
              const ref = `${row.book} ${row.chapter}:${row.verse}`
              if (!refSet.has(ref)) {
                refSet.add(ref)
                allResults.push({ ref, text })
                coverageMap.set(row.book, (coverageMap.get(row.book) || 0) + 1)
              }
              if (allResults.length >= 100) break
            }
          }
          if (allResults.length >= 100) break
        } catch {}
      }

      if (allResults.length > 0) {
        const coverage: CoverageItem[] = Array.from(coverageMap.entries())
          .map(([book, count]) => ({ book, count }))
          .sort((a, b) => b.count - a.count)

        const payload = {
          results: allResults,
          coverage,
          processed: {
            original: originalTerm,
            normalized: originalTerm,
            variants: phrases,
            romanization: ''
          },
          ms: Date.now() - startTime,
          debug: { textSearchHit: true, variantsTried: phrases.length, resultsCount: allResults.length }
        }

        SEARCH_CACHE.set(`${cacheKey}-compound`, { data: payload, ts: Date.now() })
        return NextResponse.json(payload)
      }
    }

    // Build comprehensive variant list starting from the original query
    const variantCollector = createVariantCollector(originalTerm)
    variantCollector.ensureFeminine()

    if (Array.isArray(extraVariants)) {
      for (const value of extraVariants) {
        if (typeof value === 'string') {
          variantCollector.add(value, { sources: ['extra'] })
        }
      }
    }

    if (!PASHTO_CHAR_RE.test(originalTerm) && originalTerm.length > 2) {
      try {
        const { data: dictData } = await supabase
          .from('dictionary')
          .select('pashto,pos,romanized')
          .or(`romanized.ilike.${originalTerm},romanized.ilike.${originalTerm}*,romanized.ilike.*${originalTerm}`)
          .limit(3)
        if (Array.isArray(dictData)) {
          for (const row of dictData) {
            if (row?.pashto) {
              const pos = typeof row?.pos === 'string' ? row.pos : undefined
              const romanized = typeof row?.romanized === 'string' ? row.romanized : undefined
              variantCollector.add(row.pashto, { sources: ['dictionary'], pos, romanization: romanized })
            }
          }
        }
      } catch {}

      if (!variantCollector.list().some((form) => PASHTO_CHAR_RE.test(form))) {
        try {
          const { data } = await supabase
            .from('romanized_dictionary')
            .select('pashto_word,pos,romanization')
            .ilike('romanization', `%${originalTerm}%`)
            .limit(3)
          if (Array.isArray(data)) {
            for (const row of data) {
              if (row?.pashto_word) {
                const pos = typeof row?.pos === 'string' ? row.pos : undefined
                const romanized = typeof row?.romanization === 'string' ? row.romanization : undefined
                variantCollector.add(row.pashto_word, { sources: ['romanized-dictionary'], pos, romanization: romanized })
              }
            }
          }
        } catch {}
      }

      const commonMappings: Record<string, string[]> = {
        'munda': ['منډه'],
        'manda': ['منډه'],
        'munda wahul': ['منډه وهل'],
        'manda wahul': ['منډه وهل'],
        'leedul': ['لیدل', 'لېدل'],
        'wral': ['ورل'],
        'kand': ['کند'],
        'wur': ['ور', 'وور'],
        'wahul': ['وهل'],
        'wahel': ['وهل'],
        'kawul': ['کول'],
        'kedal': ['کېدل'],
        'kedel': ['کېدل']
      }

      const lowerTerm = originalTerm.toLowerCase()
      if (commonMappings[lowerTerm]) {
        variantCollector.addMany(commonMappings[lowerTerm], 'known-mapping')
      }
    } else {
      try {
        const { data: dictRows } = await supabase
          .from('dictionary')
          .select('pashto,pos,romanized')
          .eq('pashto', originalTerm)
          .limit(1)
        if (Array.isArray(dictRows) && dictRows.length > 0) {
          const row = dictRows[0]
          if (row?.pos) {
            const romanized = typeof row?.romanized === 'string' ? row.romanized : undefined
            variantCollector.add(originalTerm, { sources: ['dictionary'], pos: row.pos, romanization: romanized })
          }
        }
      } catch {}
    }

    let lookupTerm = variantCollector.list().find((form) => PASHTO_CHAR_RE.test(form)) || originalTerm

    await enrichVariantsFromSupabase(supabase, lookupTerm, variantCollector, !!includeRelated)

    variantCollector.ensureFeminine()

    let variantDetails = variantCollector.details()

    const pashtoFormsForFrequency = dedupePreserveOrder(
      variantDetails
        .filter((meta) => PASHTO_CHAR_RE.test(meta.form))
        .map((meta) => meta.form)
    ).slice(0, includeRelated ? 80 : 40)

    if (pashtoFormsForFrequency.length > 0) {
      try {
        const { data } = await supabase
          .from('word_frequencies')
          .select('pashto_word,frequency_count')
          .in('pashto_word', pashtoFormsForFrequency)
        if (Array.isArray(data)) {
          const freqMap = new Map<string, number>()
          for (const row of data) {
            if (row?.pashto_word) {
              const freqVal = Number(row.frequency_count)
              if (Number.isFinite(freqVal)) {
                freqMap.set(String(row.pashto_word), freqVal)
              }
            }
          }
          for (const meta of variantDetails) {
            const freq = freqMap.get(meta.form)
            if (typeof freq === 'number') {
              meta.frequency = meta.frequency ? Math.max(meta.frequency, freq) : freq
            }
          }
        }
      } catch {}
    }

    variantDetails = prioritizeVariants(variantDetails, originalTerm)

    await backfillRomanizations(supabase, variantDetails, includeRelated ? 80 : 40)

    const searchVariants = variantDetails.map((meta) => meta.form)
    const primaryTerm = searchVariants.find((form) => PASHTO_CHAR_RE.test(form)) || searchVariants[0]
    lookupTerm = variantDetails.find((meta) => PASHTO_CHAR_RE.test(meta.form))?.form || primaryTerm
    const variantGroups = groupVariantsByPos(variantDetails)
    const variantsToSearch = searchVariants.slice(0, includeRelated ? 12 : 7)

    const allResults: Verse[] = []
    const refSet = new Set<string>()
    const coverageMap = new Map<string, number>()
    const coverageRefSet = new Set<string>()
    const allowedBooks = bookFilter
      ? new Set(bookVariants(bookFilter).slice(0, 5))
      : null

    // FAST search: Search ALL variants and combine results
    const selectCols = 'book,chapter,verse,text,testament'
    let textSearchHit = false
    
    // Search all variants in both main verses table and Yousafzai table
    const tablesToSearch = [
      { name: 'verses', translation: 'Standard' },
      { name: 'verses_yousafzai', translation: 'Yousafzai 2019' }
    ]

    for (const table of tablesToSearch) {
      for (let i = 0; i < variantsToSearch.length; i++) {
        const variantTerm = variantsToSearch[i]
        if (!variantTerm) continue

        try {
          let q = supabase.from(table.name).select(selectCols).ilike('text', `%${variantTerm.replace(/%/g,'')}%`)
          if (scope === 'ot') q = q.eq('testament', 'OT')
          if (scope === 'nt') q = q.eq('testament', 'NT')
          const { data, error } = await q.limit(50) // Lower limit per table to avoid timeout
          if (!error && Array.isArray(data) && data.length > 0) {
            textSearchHit = true
            for (const row of data as any[]) {
              const rawText = (row as any).text || ''
              const text = typeof rawText === 'string'
                ? rawText.replace(/[\u00a0]/g, ' ').replace(/&nbsp;/gi, ' ')
                : String(rawText)
              // Ensure proper book name formatting
              let bookName = (row as any).book as string;
              // Convert hyphenated book names to proper format
              if (bookName.includes('-')) {
                bookName = bookName.replace(/-/g, ' '); // "1-Corinthians" -> "1 Corinthians"
              }
              // Handle common abbreviations that might be truncated
              if (bookName === 'Corinthians' && table.name.includes('1')) {
                bookName = '1 Corinthians';
              } else if (bookName === 'Corinthians' && table.name.includes('2')) {
                bookName = '2 Corinthians';
              }
              const ref = `${bookName} ${(row as any).chapter}:${(row as any).verse}`
              const fullRef = `${table.translation}:${ref}` // Include translation in dedupe key

              if (allowedBooks && !allowedBooks.has(bookName)) {
                continue
              }

              if (!coverageRefSet.has(fullRef)) {
                coverageRefSet.add(fullRef)
                const coverageKey = `${table.translation}:${bookName}`
                coverageMap.set(coverageKey, (coverageMap.get(coverageKey) || 0) + 1)
              }

              // Deduplicate by reference
              if (!refSet.has(fullRef)) {
                refSet.add(fullRef)
                // Generate audio_verse_url for Yousafzai verses if not already set
                let audioVerseUrl = undefined
                if (table.name === 'verses_yousafzai') {
                  audioVerseUrl = (row as any).audio_verse_url
                  // If not set in database, generate the expected URL pattern
                  if (!audioVerseUrl) {
                    const bookSlug = (row as any).book?.toLowerCase() === 'psalms' ? 'psalms' : 
                                    (row as any).book?.toLowerCase() === 'proverbs' ? 'proverbs' : null
                    if (bookSlug) {
                      const chapterPadded = String((row as any).chapter).padStart(3, '0')
                      const versePadded = String((row as any).verse).padStart(3, '0')
                      const filename = `yousafzai_${bookSlug}${chapterPadded}_verse_${versePadded}.mp3`
                      audioVerseUrl = `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/yousafzai/${filename}`
                    }
                  }
                }

                allResults.push({
                  ref,
                  text,
                  translation: table.translation,
                  dialect: table.name === 'verses_yousafzai' ? 'yousafzai' : undefined,
                  tags: table.name === 'verses_yousafzai' ? (row as any).tags : undefined,
                  audio_verse_url: audioVerseUrl
                })
              }
            }
          }
        } catch (error) {
          // Silently skip Yousafzai table if it doesn't exist yet
          if (table.name === 'verses_yousafzai') continue
          throw error
        }

        // Cap total results to avoid timeout
        if (allResults.length >= 100) break
      }

      if (allResults.length >= 100) break
    }

    // Skip expensive fallbacks for speed

    // Skip expensive fuzzy search

    // Simple final fallback: check form_occurrences only
    if (allResults.length === 0 && primaryTerm) {
      // Simple form_occurrences check only
      try {
        const { data } = await supabase
          .from('form_occurrences')
          .select('verses')
          .eq('pashto_form', primaryTerm)
            .limit(1)
        
        if (data && data.length > 0 && Array.isArray(data[0].verses)) {
          // Take first few verse references and try to find them
          const verseRefs = data[0].verses.slice(0, 10)
          for (const ref of verseRefs) {
            if (typeof ref === 'string' && ref.includes(' ')) {
              const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/)
              if (match) {
                const [, book, chapter, verse] = match
                let verseQuery = supabase
                  .from('verses')
                  .select(selectCols)
                  .eq('book', book)
                  .eq('chapter', parseInt(chapter))
                  .eq('verse', parseInt(verse))

                // Apply book filter to fallback search too
                if (allowedBooks && !allowedBooks.has(book)) {
                  continue // Skip this verse if it doesn't match book filter
                }

                const { data: verseData } = await verseQuery.limit(1)
                if (verseData && verseData.length > 0) {
                  const row = verseData[0]
                  const fallbackRef = `${row.book} ${row.chapter}:${row.verse}`
                  if (!coverageRefSet.has(fallbackRef)) {
                    coverageRefSet.add(fallbackRef)
                    coverageMap.set(row.book, (coverageMap.get(row.book) || 0) + 1)
                  }
                  allResults.push({ 
                    ref: fallbackRef, 
                    text: row.text || '' 
                  })
                  if (allResults.length >= 10) break
                }
              }
            }
          }
        }
      } catch (error) {
        console.warn('form_occurrences fallback failed', error)
      }
    }

    // Remove duplicate results based on reference
    const uniqueResults = allResults.filter((verse, index, self) =>
      index === self.findIndex(v => v.ref === verse.ref)
    )

    // Convert coverage map to array and sort by count
    const coverage: CoverageItem[] = Array.from(coverageMap.entries())
      .map(([key, count]) => {
        if (key.includes(':')) {
          const [translation, ...rest] = key.split(':');
          const book = rest.join(':') || key;
          return { book, count, translation };
        }
        return { book: key, count };
      })
      .sort((a, b) => b.count - a.count)

    // Build related forms categorization if requested
    let relatedForms: any = null
    if (includeRelated) {
      try {
        let relatedLookupTerm = lookupTerm
        if (!PASHTO_CHAR_RE.test(relatedLookupTerm)) {
          const fallbackPashto = searchVariants.find((variant) => PASHTO_CHAR_RE.test(variant))
          if (fallbackPashto) relatedLookupTerm = fallbackPashto
        }

        const normalizedLookup = relatedLookupTerm.trim() || originalTerm

        // Generate all inflected forms using our comprehensive pattern system
        const allPossibleForms = expandInflectionVariants(normalizedLookup)
        
        // Add compound verb forms (منډه وهل, منډې وهل, etc.)
        const auxVerbs = ['کول', 'وهل', 'کړل', 'کېدل', 'ورکول']
        for (const aux of auxVerbs) {
          for (const form of allPossibleForms.slice(0, 8)) { // Limit to avoid too many combinations
            allPossibleForms.push(`${form} ${aux}`)
          }
        }

        // Check which forms actually exist in the Bible using form_occurrences
        const existingForms: Array<{form: string, count: number}> = []
        
        // Query in batches to avoid URL length limits
        const batchSize = 15
        for (let i = 0; i < Math.min(allPossibleForms.length, 60); i += batchSize) {
          const batch = allPossibleForms.slice(i, i + batchSize)
          
          try {
            const { data: occurrenceData } = await supabase
              .from('form_occurrences')
              .select('form, frequency')
              .in('form', batch)
              .gte('frequency', 1)
              .order('frequency', { ascending: false })
              .limit(30)

            if (Array.isArray(occurrenceData)) {
              for (const row of occurrenceData) {
                if (row?.form && row?.frequency) {
                  existingForms.push({
                    form: row.form,
                    count: Number(row.frequency) || 0
                  })
                }
              }
            }
          } catch {}
        }

        // Also check word_frequencies table for additional forms
        try {
          const { data: wordFreqData } = await supabase
            .from('word_frequencies')
            .select('word, frequency')
            .in('word', allPossibleForms.slice(0, 30))
            .gte('frequency', 1)
            .order('frequency', { ascending: false })
            .limit(20)

          if (Array.isArray(wordFreqData)) {
            for (const row of wordFreqData) {
              if (row?.word && row?.frequency && !existingForms.find(e => e.form === row.word)) {
                existingForms.push({
                  form: row.word,
                  count: Number(row.frequency) || 0
                })
              }
            }
          }
        } catch {}

        // Sort by frequency and categorize
        existingForms.sort((a, b) => b.count - a.count)

        const verbs: Array<{form: string, count: number}> = []
        const nouns: Array<{form: string, count: number}> = []
        const other: Array<{form: string, count: number}> = []

        for (const item of existingForms) {
          const form = item.form
          
          // Categorize based on form characteristics  
          if (form.includes(' ') && (form.includes('ول') || form.includes('ېدل') || form.includes('کړل') || form.includes('کول'))) {
            // Compound verbs (منډه وهل, etc.)
            verbs.push(item)
          } else if (form.endsWith('ل') || form.endsWith('ېدل') || form.endsWith('وهل') || form.endsWith('کول') || form.endsWith('کړل')) {
            // Simple verbs
            verbs.push(item)
          } else if (form.endsWith('ه') || form.endsWith('ې') || form.endsWith('و') || form.endsWith('ۍ') || 
                     form.endsWith('ی') || form.endsWith('ي') || form.endsWith('یو') || form.endsWith('ان') || form.endsWith('ونه')) {
            // Nouns and adjectives (all inflected forms)
            nouns.push(item)
          } else {
            other.push(item)
          }
        }

        relatedForms = {
          verbs: verbs.slice(0, 8),  // Top 8 verbs with counts
          nouns: nouns.slice(0, 12), // Top 12 nouns with counts  
          other: other.slice(0, 6),  // Top 6 other forms with counts
          total: existingForms.length
        }
      } catch {}
    }

    const payload = {
      results: uniqueResults,
      coverage,
      relatedForms,
      processed: {
        original: originalTerm,
        normalized: originalTerm,
        primaryVariant: primaryTerm,
        variants: searchVariants,
        variantsSearched: variantsToSearch,
        variantDetails: variantDetails.map(({ form, sources, pos, frequency, note, romanization, pattern }) => ({
          form,
          sources,
          pos,
          frequency,
          note,
          romanization,
          pattern,
        })),
        variantGroups,
        romanization: ""
      },
      ms: Date.now() - startTime,
      debug: {
        textSearchHit,
        variantsTried: searchVariants.length,
        resultsCount: uniqueResults.length
      }
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

// Health/diagnostic endpoint for quick checks in browser
export async function GET() {
  return NextResponse.json({ ok: true, route: 'search_phrase', expects: 'POST', ts: Date.now() })
}

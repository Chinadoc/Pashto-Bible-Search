import { NextRequest, NextResponse } from 'next/server'
import { getD1Database, queryD1, queryD1First, D1Client } from '@/utils/d1'
import type { Verse } from '../../../types'

// Book name constants for testament determination
const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];
const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];
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
  // Translation to search in (afghan2023 or yousafzai2019)
  translation?: 'afghan2023' | 'yousafzai2019'
}

// Irregular verbs map based on the comprehensive table provided
// This function is deprecated - use generateIrregularVerbFormsFromDB instead
// Kept for backward compatibility but returns minimal forms
function generateIrregularVerbForms(infinitive: string): string[] {
  return [infinitive];
}

// Generate forms for regular verbs following standard Pashto conjugation rules
function generateRegularVerbForms(infinitive: string): string[] {
  const forms: string[] = []
  
  // Add base form
  forms.push(infinitive)
  
  // Generate stems based on verb patterns
  let imperfectiveStem: string
  let perfectiveStem: string
  
  // Pattern detection for better stem generation
  if (infinitive.endsWith('ېدل')) {
    // Already handled by fused compound function
    const root = infinitive.replace(/ېدل$/, '')
    imperfectiveStem = root + 'ېږ'
    perfectiveStem = 'و' + root + 'ېږ'
  } else if (infinitive.endsWith('ول')) {
    // -ول verbs (e.g., لیدل -> وین)
    const root = infinitive.replace(/ول$/, '')
    imperfectiveStem = root + 'ین'
    perfectiveStem = 'و' + root + 'ین'
  } else if (infinitive.endsWith('ېل')) {
    // -ېل verbs (e.g., اورېل -> اورېږ)
    const root = infinitive.replace(/ېل$/, '')
    imperfectiveStem = root + 'ېږ'
    perfectiveStem = 'و' + root + 'ېږ'
  } else if (infinitive.endsWith('ال')) {
    // -ال verbs (e.g., وهال -> وهاړ)
    const root = infinitive.replace(/ال$/, '')
    imperfectiveStem = root + 'اړ'
    perfectiveStem = 'و' + root + 'اړ'
  } else {
    // Default pattern: -ل verbs (e.g., کول -> کړ)
    const root = infinitive.replace(/ل$/, '')
    if (root.endsWith('و')) {
      // کول -> کړ pattern
      const stemRoot = root.replace(/و$/, '')
      imperfectiveStem = stemRoot + 'ړ'
      perfectiveStem = 'و' + stemRoot + 'ړ'
    } else {
      // General pattern
      imperfectiveStem = root + 'ې'
      perfectiveStem = 'و' + root + 'ې'
    }
  }
  
  // Imperfective forms (present tense) using LingDocs structure
  const presentEndings = [
    // 1st person singular
    [[{ p: 'م', f: 'um' }]],
    // 1st person plural
    [[{ p: 'و', f: 'oo' }]],
    // 2nd person singular masculine
    [[{ p: 'ې', f: 'e' }]],
    // 2nd person singular feminine
    [[{ p: 'ې', f: 'e' }]],
    // 3rd person singular
    [[{ p: 'ي', f: 'ee' }]],
    // 3rd person plural
    [[{ p: 'ي', f: 'ee' }]]
  ]

  for (let i = 0; i < presentEndings.length; i++) {
    const ending = presentEndings[i][0][0] // Get the first (and usually only) ending
    forms.push(imperfectiveStem + ending.p) // Present
  }
  
  // Perfective forms 
  const perfectiveRoot = 'و' + infinitive
  forms.push(perfectiveRoot)
  
  // Subjunctive (perfective stem + present endings)
  for (let i = 0; i < presentEndings.length; i++) {
    const ending = presentEndings[i][0][0] // Get the first (and usually only) ending
    forms.push(perfectiveStem + ending.p) // Subjunctive
  }
  
  // Past forms using LingDocs structure
  const pastEndings = [
    // 1st person singular
    [[{ p: 'لم', f: 'lum' }]],
    // 1st person plural
    [[{ p: 'لو', f: 'loo' }]],
    // 2nd person singular masculine
    [[{ p: 'لې', f: 'le' }]],
    // 2nd person singular feminine
    [[{ p: 'لې', f: 'le' }]],
    // 3rd person singular masculine
    [[{ p: 'ل', f: 'ul' }]],
    // 3rd person singular feminine
    [[{ p: 'له', f: 'la' }]]
  ]

  const pastRoot = infinitive.replace(/ل$/, '')
  for (let i = 0; i < pastEndings.length; i++) {
    const ending = pastEndings[i][0][0] // Get the first (and usually only) ending
    forms.push(pastRoot + ending.p) // Past
  }

  // Past participles
  forms.push(pastRoot + 'لل') // Past participle base
  forms.push(pastRoot + 'لی') // Past participle inflected
  
  return forms.filter(Boolean)
}

// Generate forms for compound verbs (stative vs dynamic)
function generateCompoundVerbForms(infinitive: string, isStative: boolean): string[] {
  const forms: string[] = []
  const parts = infinitive.split(' ')
  if (parts.length !== 2) return [infinitive]
  
  const [main, helper] = parts
  forms.push(infinitive) // Base form
  
  if (isStative) {
    // Stative compounds: Generate both squished and non-squished forms
    // e.g., ګرم کېدل -> both "ګرم کېږم" AND "ګرمېږم"
    if (helper === 'کېدل') {
      // Present forms for stative compounds using LingDocs structure
      const presentEndings = [
        // 1st person singular
        [[{ p: 'ېږم', f: 'eGum' }]],
        // 1st person plural
        [[{ p: 'ېږو', f: 'eGoo' }]],
        // 2nd person singular masculine
        [[{ p: 'ېږې', f: 'eGe' }]],
        // 2nd person singular feminine
        [[{ p: 'ېږې', f: 'eGe' }]],
        // 3rd person singular
        [[{ p: 'ېږي', f: 'eGee' }]],
        // 3rd person plural
        [[{ p: 'ېږي', f: 'eGee' }]]
      ]

      // Non-squished forms (spaced)
      for (let i = 0; i < presentEndings.length; i++) {
        const ending = presentEndings[i][0][0]
        forms.push(main + ' ک' + ending.p) // Spaced present
      }
      forms.push(main + ' شو') // Past (perfective)
      forms.push(main + ' شوه') // Past feminine
      
      // Perfective root forms
      forms.push(main + ' شول') // Perfective root
      forms.push(main + ' شوه') // Perfective feminine
      
      // Past participles
      forms.push(main + ' شوی') // Past participle masc. sing.
      forms.push(main + ' شوې') // Past participle fem. sing.
      forms.push(main + ' شوي') // Past participle masc. plur.
      forms.push(main + ' شوې') // Past participle fem. plur.

      // Squished forms (fused) - Critical for proper matching!
      for (let i = 0; i < presentEndings.length; i++) {
        const ending = presentEndings[i][0][0]
        forms.push(main + ending.p) // Squished present
      }
      forms.push(main + 'ېدل') // Infinitive squished
      
      // Generate gender/number variants of the main part if it's an adjective
      // ښکېل -> ښکېلې (fem. sing.), ښکېله (fem. sing. alternate), etc.
      // This handles cases like "ښکېلې کېدل" and "ښکېله کېدل"
      if (main.endsWith('ل')) {
        // Masculine singular: ښکېل
        // Feminine singular: ښکېلې or ښکېله
        const mainStem = main.slice(0, -1) // Remove ل
        forms.push(mainStem + 'لې کېدل') // Feminine singular variant
        forms.push(mainStem + 'له کېدل') // Feminine singular alternate
        forms.push(mainStem + 'لې کېږم') // Feminine present forms
        forms.push(mainStem + 'لې شول') // Feminine perfective
        forms.push(mainStem + 'لې شوې') // Feminine past participle
        
        // Plural forms
        forms.push(mainStem + 'لې کېږي') // Plural present
        forms.push(mainStem + 'لې شوي') // Plural past participle
      }

    } else if (helper === 'کول') {
      // Present forms for کول compounds using LingDocs structure
      const presentEndings = [
        // 1st person singular
        [[{ p: 'وم', f: 'wum' }]],
        // 1st person plural
        [[{ p: 'وو', f: 'woo' }]],
        // 2nd person singular masculine
        [[{ p: 'وې', f: 'we' }]],
        // 2nd person singular feminine
        [[{ p: 'وې', f: 'we' }]],
        // 3rd person singular
        [[{ p: 'وي', f: 'wee' }]],
        // 3rd person plural
        [[{ p: 'وي', f: 'wee' }]]
      ]

      // Non-squished forms (spaced)
      for (let i = 0; i < presentEndings.length; i++) {
        const ending = presentEndings[i][0][0]
        forms.push(main + ' ک' + ending.p) // Spaced present
      }
      forms.push(main + ' کړ') // Past
      forms.push(main + ' کړه') // Past feminine

      // Squished forms for کول compounds
      for (let i = 0; i < presentEndings.length; i++) {
        const ending = presentEndings[i][0][0]
        forms.push(main + ending.p) // Squished present
      }
      forms.push(main + 'کول') // Infinitive squished
    }
  } else {
    // Dynamic compounds: no welding using LingDocs structure
    const helperRoot = helper.replace(/ل$/, '')

    // Present forms for dynamic compounds
    const presentEndings = [
      // 1st person singular
      [[{ p: 'م', f: 'um' }]],
      // 1st person plural
      [[{ p: 'و', f: 'oo' }]],
      // 2nd person singular masculine
      [[{ p: 'ې', f: 'e' }]],
      // 2nd person singular feminine
      [[{ p: 'ې', f: 'e' }]],
      // 3rd person singular
      [[{ p: 'ي', f: 'ee' }]],
      // 3rd person plural
      [[{ p: 'ي', f: 'ee' }]]
    ]

    for (let i = 0; i < presentEndings.length; i++) {
      const ending = presentEndings[i][0][0]
      forms.push(`${main} ${helperRoot}${ending.p}`) // Present
    }

    // Past forms for dynamic compounds
    const pastEndings = [
      // 1st person singular
      [[{ p: 'لم', f: 'lum' }]],
      // 1st person plural
      [[{ p: 'لو', f: 'loo' }]],
      // 2nd person singular masculine
      [[{ p: 'لې', f: 'le' }]],
      // 2nd person singular feminine
      [[{ p: 'لې', f: 'le' }]],
      // 3rd person singular masculine
      [[{ p: 'ل', f: 'ul' }]],
      // 3rd person singular feminine
      [[{ p: 'له', f: 'la' }]]
    ]

    for (let i = 0; i < pastEndings.length; i++) {
      const ending = pastEndings[i][0][0]
      forms.push(`${main} ${helperRoot}${ending.p}`) // Past
    }

    forms.push(`${main} و${helper}`) // Perfective
  }
  
  return forms.filter(Boolean)
}

// Helper function to generate irregular verb forms from database
async function generateIrregularVerbFormsFromDB(db: D1Client, infinitive: string): Promise<string[]> {
  const forms: string[] = [infinitive];
  
  try {
    // Query irregular_verbs table for stem/root data
    const verbData = await getIrregularVerbData(db, infinitive);
    if (!verbData) {
      return forms; // Return just the infinitive if not found
    }
    
    const impStem = verbData.imperfectiveStem?.replace(/ـ$/, '') || '';
    const perfStem = verbData.perfectiveStem?.replace(/ـ$/, '') || '';
    
    if (!impStem && !perfStem) {
      return forms; // No stems available
    }
    
    // Generate basic present/subjunctive forms using stems
    const presentEndings = ['م', 'و', 'ې', 'ې', 'ي', 'ي'];
    for (const ending of presentEndings) {
      if (impStem) forms.push(impStem + ending);
      if (perfStem && perfStem !== impStem) forms.push(perfStem + ending);
    }
    
    // Add past participle
    if (verbData.pastParticiple) {
      forms.push(verbData.pastParticiple);
    }
    
    // Add roots
    if (verbData.imperfectiveRoot) forms.push(verbData.imperfectiveRoot);
    if (verbData.perfectiveRoot && verbData.perfectiveRoot !== verbData.imperfectiveRoot) {
      forms.push(verbData.perfectiveRoot);
    }
  } catch (error) {
    console.warn(`Error generating irregular verb forms for ${infinitive}:`, error);
  }
  
  return forms.filter(Boolean);
}

// Organize forms into LingDocs aspect-based structure
function organizeFormsByAspect(forms: string[]): {
  imperfective: string[]
  perfective: string[]
  perfect: string[]
  ability: string[]
  modal: string[]
} {
  const aspectStructure = {
    imperfective: [] as string[], // Present, subjunctive
    perfective: [] as string[],   // Perfective forms
    perfect: [] as string[],     // Perfect tenses
    ability: [] as string[],     // Ability moods
    modal: [] as string[]        // Future, habitual, hypothetical
  }

  for (const form of forms) {
    if (form.includes('به ')) {
      aspectStructure.modal.push(form) // Future and habitual forms
    } else if (form.includes('لیدلی') || form.includes('لیدلې') || form.includes('لیدلي')) {
      if (form.includes('شم') || form.includes('شول')) {
        aspectStructure.ability.push(form) // Ability forms
      } else {
        aspectStructure.perfect.push(form) // Perfect tenses
      }
    } else if (form.includes('وو') || form.includes('ولیدل') || form.includes('وو')) {
      aspectStructure.perfective.push(form) // Perfective aspect
    } else if (form.includes('وین') && !form.includes('وو')) {
      aspectStructure.imperfective.push(form) // Imperfective aspect (present/subjunctive)
    } else if (form.includes('یدل') && form.includes('ل') && !form.includes('وو') && !form.includes('لیدل')) {
      aspectStructure.perfective.push(form) // Continuous past forms
    } else if (form.includes('یدل') && !form.includes('وو') && !form.includes('لیدل')) {
      aspectStructure.imperfective.push(form) // Other forms
    } else {
      // Default to imperfective for unclassified forms
      aspectStructure.imperfective.push(form)
    }
  }

  return aspectStructure
}

// Generate forms for fused compound verbs (e.g., ګرمېدل)
// Enhanced to match LingDocs standard stative compound patterns
function generateFusedCompoundVerbForms(infinitive: string): string[] {
  const forms: string[] = [infinitive]

  // Detect fused stative compounds ending in ېدل (standard pattern)
  if (infinitive.endsWith('ېدل')) {
    const stem = infinitive.slice(0, -3) // Remove ېدل

    // Complete conjugation based on LingDocs pattern for بکېدل
    // Present/Imperfective: STEMěG-
    forms.push(stem + 'ېږم')    // 1st singular
    forms.push(stem + 'ېږې')    // 2nd singular
    forms.push(stem + 'ېږي')    // 3rd singular
    forms.push(stem + 'ېږو')    // 1st plural
    forms.push(stem + 'ېږئ')    // 2nd plural

    // Perfective: STEM sh-
    forms.push(stem + 'م')      // 1st singular
    forms.push(stem + 'ې')      // 2nd singular
    forms.push(stem)           // 3rd singular
    forms.push(stem + 'و')      // 1st plural
    forms.push(stem + 'ئ')      // 2nd plural

    // Past participle: STEM shúway
    forms.push(stem + 'ېدلی')   // Past participle

    // Subjunctive: و + present forms
    forms.push('و' + stem + 'ېږم')    // 1st singular subjunctive
    forms.push('و' + stem + 'ېږې')    // 2nd singular subjunctive
    forms.push('و' + stem + 'ېږي')    // 3rd singular subjunctive
    forms.push('و' + stem + 'ېږو')    // 1st plural subjunctive
    forms.push('و' + stem + 'ېږئ')    // 2nd plural subjunctive

    // Imperative: ېږه، ېږئ
    forms.push(stem + 'ېږه')   // 2nd singular imperative
    forms.push(stem + 'ېږئ')   // 2nd plural imperative

    // Non-squished forms with space
    forms.push(stem + ' کېدل')    // Non-squished infinitive
    forms.push(stem + ' کېږم')    // Non-squished 1st singular
    forms.push(stem + ' کېږې')    // Non-squished 2nd singular
    forms.push(stem + ' کېږي')    // Non-squished 3rd singular
    forms.push(stem + ' کېږو')    // Non-squished 1st plural
    forms.push(stem + ' کېږئ')    // Non-squished 2nd plural

  } else if (infinitive.endsWith('کېدل')) {
    const stem = infinitive.slice(0, -4) // Remove کېدل

    // Generate conjugated forms for special cases like تازه کېدل، غوره کېدل
    forms.push(stem + 'کېږم')    // 1st singular
    forms.push(stem + 'کېږې')    // 2nd singular
    forms.push(stem + 'کېږي')    // 3rd singular
    forms.push(stem + 'کېږو')    // 1st plural
    forms.push(stem + 'کېږئ')    // 2nd plural

    // Perfective forms
    forms.push(stem + 'کم')      // 1st singular perfective
    forms.push(stem + 'کې')      // 2nd singular perfective
    forms.push(stem + 'ک')       // 3rd singular perfective
    forms.push(stem + 'کو')      // 1st plural perfective
    forms.push(stem + 'کئ')      // 2nd plural perfective

    // Past participle
    forms.push(stem + 'کېدلی')   // Past participle

    // Generate spaced version
    forms.push(stem + ' کېدل')    // Spaced infinitive
    forms.push(stem + ' کېږم')    // Spaced 1st singular
    forms.push(stem + ' کېږې')    // Spaced 2nd singular
    forms.push(stem + ' کېږي')    // Spaced 3rd singular
    forms.push(stem + ' کېږو')    // Spaced 1st plural
    forms.push(stem + ' کېږئ')    // Spaced 2nd plural

  } else if (infinitive.endsWith(' شول')) {
    // Handle special cases like خوب شول
    const stem = infinitive.slice(0, -4) // Remove شول

    // Generate conjugated forms for شول compounds
    forms.push(stem + ' شوم')    // 1st singular
    forms.push(stem + ' شوې')    // 2nd singular
    forms.push(stem + ' شو')     // 3rd singular
    forms.push(stem + ' شوو')    // 1st plural
    forms.push(stem + ' شوئ')    // 2nd plural

    // Past participle
    forms.push(stem + ' شوی')    // Past participle

    // Subjunctive forms
    forms.push('و' + stem + ' شوم')    // 1st singular subjunctive
    forms.push('و' + stem + ' شوې')    // 2nd singular subjunctive
    forms.push('و' + stem + ' شو')     // 3rd singular subjunctive

  } else if (infinitive.endsWith('کول')) {
    // Handle special cases like غوره کول (though this might be dynamic)
    const stem = infinitive.slice(0, -3) // Remove کول

    // Generate some basic forms - may need refinement based on actual usage
    forms.push(stem + ' کوم')    // 1st singular
    forms.push(stem + ' کوې')    // 2nd singular
    forms.push(stem + ' کوي')    // 3rd singular
    forms.push(stem + ' کوو')    // 1st plural
    forms.push(stem + ' کوئ')    // 2nd plural
  }
  
  return forms.filter(Boolean)
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
  // Add some common variations for book names
  if (raw.includes('Corinthians')) {
    out.add('1 Corinthians').add('2 Corinthians')
  }
  return Array.from(out).filter(Boolean)
}

// Compound verb helpers
const AUX_SET = new Set(['وهل','کول','کېدل','ېدل'])

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
      if (isValidInflection(trimmed, `${stem}ه`)) pushIfUnique(result, seen, `${stem}ه`)  // Plain feminine
      if (isValidInflection(trimmed, `${stem}ې`)) pushIfUnique(result, seen, `${stem}ې`)  // 1st inflection
      if (isValidInflection(trimmed, `${stem}و`)) pushIfUnique(result, seen, `${stem}و`)  // 2nd inflection
    }

    // Pattern 1: Add feminine forms for masculine words ending in consonants
    // e.g., برګ -> برګه, برګې, برګو
    if (![' ه', 'ې', 'و', 'ی', 'ي', 'ۍ'].includes(lastChar)) {
      if (isValidInflection(trimmed, `${trimmed}ه`)) pushIfUnique(result, seen, `${trimmed}ه`)  // Feminine plain
      if (isValidInflection(trimmed, `${trimmed}ې`)) pushIfUnique(result, seen, `${trimmed}ې`)  // Feminine 1st
      if (isValidInflection(trimmed, `${trimmed}و`)) pushIfUnique(result, seen, `${trimmed}و`)  // Feminine 2nd
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

// Pattern validation to prevent invalid inflection forms
function isValidInflection(base: string, inflected: string): boolean {
  // Check for doubled endings that are linguistically invalid
  if (/هه|ېې|وو|يي|اا|ےے|ۍۍ/.test(inflected)) {
    return false
  }

  // Check inflection level limits (max 2 levels)
  const baseInflections = (base.match(/ه|ې|و|ي|ۍ/g) || []).length
  const inflectedInflections = (inflected.match(/ه|ې|و|ي|ۍ/g) || []).length
  if (inflectedInflections > baseInflections + 2) {
    return false
  }

  // Check length constraints (not too long)
  if (inflected.length > base.length + 3) {
    return false
  }

  // Check for too many consecutive vowels
  if (/[اےيوۍ]{4,}/.test(inflected)) {
    return false
  }

  // Check for invalid character combinations
  if (/[هېويۍ][هېويۍ]/.test(inflected)) {
    return false
  }

  return true
}

// Form validation to reject linguistically invalid forms
function isValidPashtoForm(form: string): boolean {
  // Reject forms with invalid patterns
  if (/هه|ېې|وو|يي|اا|ےے|ۍۍ/.test(form)) {
    return false
  }

  // Reject overly long forms
  if (form.length > 12) {
    return false
  }

  // Reject forms with too many consecutive vowels
  if (/[اےيوۍ]{4,}/.test(form)) {
    return false
  }

  // Reject forms with invalid character combinations
  if (/[بپتٹثجچحخدذرڑزژسشصضطظعغفقکگلمنوہھیئے]{3,}/.test(form)) {
    return false
  }

  return true
}

// Quality scoring function for form prioritization
function scoreVariant(meta: VariantMeta): number {
  let score = 0
  if (meta.sources.includes('dictionary')) score += 5
  if (meta.sources.includes('lemma')) score += 4
  if (meta.pos) score += 3
  if (meta.frequency && meta.frequency > 0) score += 2
  if (meta.sources.includes('inflection-pattern')) score += 1
  return score
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
      const baseMeta = metaMap.get(normalize(form))
      for (const expanded of expandInflectionVariants(form)) {
        if (expanded !== form && isValidInflection(form, expanded)) {
          add(expanded, {
            sources: ['inflection-pattern'],
            pos: baseMeta?.pos, // Inherit POS from base form
            frequency: baseMeta?.frequency ? Math.floor(baseMeta.frequency * 0.3) : undefined // Estimated frequency
          })
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
  db: D1Client,
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
    const placeholders = missing.map(() => '?').join(',')
    const data = await db.query<{ pashto: string; romanized: string }>(
      `SELECT pashto, romanized FROM dictionary WHERE pashto IN (${placeholders})`,
      missing
    );
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
    const placeholders = remaining.map(() => '?').join(',')
    const data = await db.query<{ pashto_word: string; romanization: string }>(
      `SELECT pashto_word, romanization FROM romanized_dictionary WHERE pashto_word IN (${placeholders})`,
      remaining
    );
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
  db: D1Client,
  collector: VariantCollector
) {
  const pashtoForms = dedupePreserveOrder(
    collector.details()
      .filter((meta) => PASHTO_CHAR_RE.test(meta.form))
      .map((meta) => meta.form)
  ).slice(0, 20)

  if (pashtoForms.length === 0) return

  try {
    const placeholders = pashtoForms.map(() => '?').join(',')
    const data = await db.query<{ verb_root: string; roots: string; stems: string; past_participle: string; romanization: string }>(
      `SELECT verb_root, roots, stems, past_participle, romanization FROM irregular_verbs WHERE verb_root IN (${placeholders})`,
      pashtoForms
    );

    if (Array.isArray(data)) {
      for (const row of data) {
        if (!row?.verb_root) continue
        const root = String(row.verb_root)
        let romanization: string | undefined
        let romanizationRecord: Record<string, any> | undefined
        
        try {
          romanization = typeof row.romanization === 'string' ? row.romanization : undefined
          romanizationRecord = (row?.romanization && typeof row?.romanization === 'string') 
            ? JSON.parse(row.romanization) 
            : (row?.romanization && typeof row?.romanization === 'object') 
              ? row.romanization as Record<string, any>
              : undefined
        } catch {}
        
        const romanizationExtracted = extractRomanizationText(row?.romanization)
        const patternLabel = 'Irregular verb'
        const noteLabel = 'Irregular verb'
        const baseRoman = typeof romanizationRecord?.imperfective_root === 'string' ? romanizationRecord.imperfective_root : (romanizationExtracted || undefined)

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
            : baseRoman || romanizationExtracted || undefined
          collector.add(formValue.trim(), { sources: ['irregular-verb'], romanization: rom, pattern: patternLabel, note: noteLabel, pos: 'verb' })
        }

        let rootsRecord: Record<string, any> | undefined
        try {
          rootsRecord = typeof row.roots === 'string' ? JSON.parse(row.roots) : (row.roots && typeof row.roots === 'object') ? row.roots as Record<string, any> : undefined
        } catch {}
        
        if (rootsRecord) {
          addIrregularForm(rootsRecord.perfective, 'perfective_root')
          addIrregularForm(rootsRecord.imperfective, 'imperfective_root')
        }

        addIrregularForm(row?.past_participle, 'past_participle')
      }
    }
  } catch {}
}

// Load JSON data for form mappings - REPLACED WITH DATABASE QUERIES
// These are now loaded dynamically from D1 database instead of local JSON files
const FORM_TO_ROOT_MAP: Record<string, string[]> = {}; // Deprecated - use form_roots table
const GRAMMATICAL_INDEX: Record<string, any> = {}; // Deprecated - use form_lemmas and inflections tables

// Helper function to get form-to-root mapping from database
async function getFormToRootMap(db: D1Client, term: string): Promise<string[]> {
  try {
    const data = await db.query<{ root_word: string }>(
      `SELECT root_word FROM form_roots WHERE word_form = ? ORDER BY frequency DESC LIMIT 10`,
      [term]
    );
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map(row => row.root_word).filter(Boolean);
    }
  } catch (error) {
    console.warn(`Error querying form_roots for ${term}:`, error);
  }
  return [];
}

// Helper function to get all forms for a root from database
async function getFormsForRoot(db: D1Client, root: string): Promise<string[]> {
  try {
    const data = await db.query<{ word_form: string }>(
      `SELECT word_form FROM form_roots WHERE root_word = ? ORDER BY frequency DESC LIMIT 200`,
      [root]
    );
    
    if (Array.isArray(data) && data.length > 0) {
      return data.map(row => row.word_form).filter(Boolean);
    }
  } catch (error) {
    console.warn(`Error querying form_roots for root ${root}:`, error);
  }
  return [];
}

// Helper function to get grammatical index data from database
async function getGrammaticalIndexData(db: D1Client, term: string): Promise<any> {
  try {
    // Query form_lemmas for base word info
    const lemmaData = await db.query<{ lemma_form: string; base_word: string; part_of_speech: string; frequency: number }>(
      `SELECT lemma_form, base_word, part_of_speech, frequency FROM form_lemmas WHERE base_word = ? OR lemma_form = ? ORDER BY frequency DESC LIMIT 10`,
      [term, term]
    );
    
    // Query inflections for all forms
    const inflData = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
      `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 100`,
      [term]
    );
    
    if ((Array.isArray(lemmaData) && lemmaData.length > 0) || 
        (Array.isArray(inflData) && inflData.length > 0)) {
      return {
        identities: [{
          type: lemmaData?.[0]?.part_of_speech || 'unknown',
          forms: inflData || []
        }]
      };
    }
  } catch (error) {
    console.warn(`Error querying grammatical index for ${term}:`, error);
  }
  return null;
}

// Helper function to get irregular verb data from database
async function getIrregularVerbData(db: D1Client, verbRoot: string): Promise<any> {
  try {
    const data = await db.query<{ verb_root: string; stems: string; roots: string; past_participle: string; romanization: string }>(
      `SELECT verb_root, stems, roots, past_participle, romanization FROM irregular_verbs WHERE verb_root = ? LIMIT 1`,
      [verbRoot]
    );
    
    if (Array.isArray(data) && data.length > 0) {
      const verb = data[0];
      let stems: Record<string, any> = {};
      let roots: Record<string, any> = {};
      
      try {
        stems = typeof verb.stems === 'string' ? JSON.parse(verb.stems) : verb.stems || {};
        roots = typeof verb.roots === 'string' ? JSON.parse(verb.roots) : verb.roots || {};
      } catch {}
      
      return {
        imperfectiveStem: stems?.imperfective || '',
        perfectiveStem: stems?.perfective || '',
        imperfectiveRoot: roots?.imperfective || verbRoot,
        perfectiveRoot: roots?.perfective || verbRoot,
        pastParticiple: verb.past_participle || '',
      };
    }
  } catch (error) {
    console.warn(`Error querying irregular_verbs for ${verbRoot}:`, error);
  }
  return null;
}

/**
 * Analyze inflection reasons by examining verse contexts
 * Detects: plural, sandwich (adpositional phrase), transitive past tense subject
 * Returns detailed analysis with example verses
 */
async function analyzeInflectionReasons(
  db: D1Client,
  form: string,
  baseWord: string,
  sampleSize: number = 10
): Promise<{ 
  plural: number; 
  sandwich: number; 
  transitive_past: number; 
  sandwich_types: string[];
  examples: Array<{
    verse_ref: string;
    text: string;
    reason: 'plural' | 'sandwich' | 'transitive_past';
    highlighted_context?: string;
    pattern?: string;
  }>;
}> {
  const reasons = {
    plural: 0,
    sandwich: 0,
    transitive_past: 0,
    sandwich_types: [] as string[],
    examples: [] as Array<{
      verse_ref: string;
      text: string;
      reason: 'plural' | 'sandwich' | 'transitive_past';
      highlighted_context?: string;
      pattern?: string;
    }>
  }

  try {
    // Get sample verses containing this form
    const verses = await db.query<{ text: string; book: string; chapter: number; verse: number }>(
      `SELECT text, book, chapter, verse FROM verses WHERE text LIKE ? LIMIT ?`,
      [`%${form.replace(/[%_]/g, '\\$&')}%`, sampleSize]
    )

    if (!Array.isArray(verses) || verses.length === 0) {
      return reasons
    }

    // Common sandwich patterns (adpositional phrases)
    const sandwichPatterns = [
      // Preposition patterns (before the word)
      { type: 'pre', left: 'د', right: null, name: 'د' },
      { type: 'pre', left: 'تر', right: null, name: 'تر' },
      { type: 'pre', left: 'پر', right: null, name: 'پر' },
      { type: 'pre', left: 'په', right: null, name: 'په' },
      { type: 'pre', left: 'له', right: null, name: 'له' },
      // Circumposition patterns (surrounding the word)
      { type: 'circ', left: 'په', right: 'کې', name: 'په...کې' },
      { type: 'circ', left: 'په', right: 'باندې', name: 'په...باندې' },
      { type: 'circ', left: 'له', right: 'سره', name: 'له...سره' },
      { type: 'circ', left: 'له', right: 'څخه', name: 'له...څخه' },
      { type: 'circ', left: 'پر', right: 'باندې', name: 'پر...باندې' },
      { type: 'circ', left: 'د', right: 'په اړه', name: 'د...په اړه' },
      { type: 'circ', left: 'د', right: 'لپاره', name: 'د...لپاره' },
      { type: 'circ', left: 'د', right: 'دپاره', name: 'د...دپاره' },
    ]

    // Plural indicators
    const pluralSuffixes = ['ان', 'انو', 'ونه', 'ونو', 'انې', 'یان', 'یانو']
    const numeralWords = ['څو', 'یو', 'دوه', 'درې', 'څلور', 'پنځه', 'شپږ', 'اووه', 'اته', 'نهه', 'لس']

    // Comprehensive transitive past tense verb detection
    // Focus on detecting actual perfective past tense verb forms, not just roots
    // Transitive markers are specific verb stems that indicate transitive action
    const transitiveMarkers = [
      // Compound verb auxiliaries (کړ, ول, etc.)
      'کړ', 'کړل', 'کړه', 'کړې', 'کړو', 'کړم', 'کړئ', 'کړی',
      'ول', 'وله', 'ولې', 'ولو', 'ولم', 'ولئ', 'ولی',
      'وخ', 'وخه', 'وخې', 'وخو', 'وخم', 'وخئ',
      // Specific transitive verb stems (not roots)
      'وکړ', 'ورکړ', 'ووین', 'ووی', 'وکت', 'واخ', 'ووړ', 'وخو', 'وخړ', 'وژ', 'ولیک', 'وښ',
      'ایست', 'ایستل', 'ایسته', 'ایستې', 'ایستو', 'پاک', 'پاکه', 'پاکې', 'پاکو'
    ]
    
    // Past tense endings that agree with object (transitive past characteristic)
    const transitivePastEndings = ['م', 'ې', 'ئ', 'و', 'ه', 'ول', 'ولي']
    
    // Perfective prefixes (most common in Pashto)
    const perfectivePrefixes = ['و', 'وو', 'ور', 'وبر', 'وب', 'ود', 'وړ', 'وګ', 'وک', 'وپ', 'وت', 'وچ', 'وخ', 'وج', 'وز', 'وش', 'وغ', 'وف', 'وق', 'ول', 'وم', 'ون', 'وه', 'وی']
    
    // Tokenize Pashto text (simple word boundary detection)
    function tokenize(text: string): string[] {
      // Split on spaces and common punctuation
      return text.split(/[\s\u200C\u200D\u200E\u200F\uFEFF]+/).filter(t => t.length > 0)
    }

    // Comprehensive check if token is likely a transitive past tense verb
    function isLikelyPastTransitive(token: string): boolean {
      if (!token || token.length < 2) return false
      
      const trimmed = token.trim()
      
      // 1. Check for perfective prefix (و) + transitive markers
      // This catches forms like: وکړ, ورکړ, ووین, ووی, etc.
      if (trimmed.startsWith('و')) {
        // Check if it contains known transitive markers
        if (transitiveMarkers.some(marker => trimmed.includes(marker))) {
          // Exclude intransitive forms like "شو" unless it has transitive markers
          if (trimmed === 'شو' || trimmed.startsWith('شو') && !transitiveMarkers.some(m => trimmed.includes(m))) {
            return false
          }
          return true
        }
        
        // Check for perfective prefix + past ending pattern
        // Pattern: و + verb stem + transitive past ending
        // This catches forms like: ولیدلم, ولیدلو, ولیدلې (from و + لیدل + ending)
        // Key: Perfective past forms are و + imperfective_root + ending
        // Examples: ولیدلم (و + لیدل + م), ولیدلو (و + لیدل + و), ولیدلې (و + لیدل + ې)
        const matchingEnding = transitivePastEndings.find(ending => trimmed.endsWith(ending))
        if (matchingEnding) {
          // Must have more than just "و" + ending (need verb stem/root)
          // Pattern should be: و + (at least 2-3 chars) + ending
          if (trimmed.length > 4 && !trimmed.match(/^وو?$/)) {
            // Exclude equative forms (و, وو, وم, وې, وئ, etc.)
            if (trimmed.match(/^و[ومېئ]$/)) {
              return false
            }
            // Check if it looks like: و + verb root + ending
            // This pattern matches: و + لیدل + م, و + کړ + ل, و + وین + م, etc.
            // The middle part should be a verb root (usually ends in ل or has specific patterns)
            const middlePart = trimmed.slice(1, trimmed.length - matchingEnding.length)
            if (middlePart.length >= 2) {
              // Verb roots often end in ل, or have specific patterns
              // Accept if it matches the pattern و + root + ending
              return true
            }
          }
        }
      }
      
      // 2. Check for transitive markers with past endings (even without perfective prefix)
      // This catches forms that might not have the prefix
      if (transitiveMarkers.some(marker => trimmed.includes(marker))) {
        if (transitivePastEndings.some(ending => trimmed.endsWith(ending))) {
          return true
        }
      }
      
      // 3. Check for compound verbs with transitive auxiliaries
      if (trimmed.includes(' ') && trimmed.split(' ').some(part => 
        transitiveMarkers.some(m => part.includes(m)) && 
        transitivePastEndings.some(e => part.endsWith(e))
      )) {
        return true
      }
      
      return false
    }
    
    // Helper to find transitive verb in context and verify subject-object relationship
    function findTransitiveVerbInContext(tokens: string[], formIndex: number): { found: boolean; verbIndex?: number; verb?: string } {
      // Look for transitive verbs in a window around the form
      const searchWindow = 5
      const start = Math.max(0, formIndex - searchWindow)
      const end = Math.min(tokens.length, formIndex + searchWindow + 1)
      
      for (let i = start; i < end; i++) {
        if (i === formIndex) continue // Skip the form itself
        
        const token = tokens[i]
        if (isLikelyPastTransitive(token)) {
          // In Pashto, subject typically comes before the verb
          // If form is before verb, it could be the subject
          if (i > formIndex) {
            return { found: true, verbIndex: i, verb: token }
          }
        }
      }
      
      return { found: false }
    }

    // Function to highlight context around form
    function highlightContext(verseText: string, formIndex: number, formLength: number, pattern?: string): string {
      const contextWindow = 40
      const start = Math.max(0, formIndex - contextWindow)
      const end = Math.min(verseText.length, formIndex + formLength + contextWindow)
      let context = verseText.slice(start, end)
      
      // Highlight the form itself
      const relativeFormIndex = formIndex - start
      const beforeForm = context.slice(0, relativeFormIndex)
      const formText = context.slice(relativeFormIndex, relativeFormIndex + formLength)
      const afterForm = context.slice(relativeFormIndex + formLength)
      
      // Highlight sandwich pattern if provided
      if (pattern) {
        const patternParts = pattern.split('...')
        if (patternParts.length === 2) {
          // Circumposition pattern (e.g., "په...کې")
          const [leftPart, rightPart] = patternParts
          
          // Find the left part (preposition) - search backwards from form
          let leftIndex = -1
          for (let i = beforeForm.length - 1; i >= Math.max(0, beforeForm.length - 10); i--) {
            if (beforeForm.slice(i).startsWith(leftPart)) {
              leftIndex = i
              break
            }
          }
          
          // Find the right part (postposition) - search forwards from form
          let rightIndex = -1
          for (let i = 0; i < Math.min(afterForm.length, 15); i++) {
            if (afterForm.slice(i).startsWith(rightPart)) {
              rightIndex = i
              break
            }
          }
          
          if (leftIndex !== -1 && rightIndex !== -1) {
            const beforePattern = beforeForm.slice(0, leftIndex)
            const leftPattern = beforeForm.slice(leftIndex, leftIndex + leftPart.length)
            const betweenPattern = beforeForm.slice(leftIndex + leftPart.length)
            const middlePattern = formText
            const rightPattern = afterForm.slice(rightIndex, rightIndex + rightPart.length)
            const afterPattern = afterForm.slice(rightIndex + rightPart.length)
            
            return `${beforePattern}[${leftPattern}]${betweenPattern}[${middlePattern}][${rightPattern}]${afterPattern}`
          }
        } else if (patternParts.length === 1) {
          // Preposition pattern (e.g., "د")
          const leftPart = patternParts[0]
          let leftIndex = -1
          
          // Search backwards from form position
          for (let i = beforeForm.length - 1; i >= Math.max(0, beforeForm.length - 10); i--) {
            if (beforeForm.slice(i).startsWith(leftPart)) {
              leftIndex = i
              break
            }
          }
          
          if (leftIndex !== -1) {
            const beforePattern = beforeForm.slice(0, leftIndex)
            const patternText = beforeForm.slice(leftIndex, leftIndex + leftPart.length)
            const betweenPattern = beforeForm.slice(leftIndex + leftPart.length)
            return `${beforePattern}[${patternText}]${betweenPattern}[${formText}]${afterForm}`
          }
        }
      }
      
      // Default: just highlight the form
      return `${beforeForm}[${formText}]${afterForm}`
    }

    for (const verse of verses) {
      const verseText = verse.text || ''
      const formIndex = verseText.indexOf(form)
      
      if (formIndex === -1) continue

      const verseRef = `${verse.book} ${verse.chapter}:${verse.verse}`

      // Get context window around the form (20 characters before/after)
      const contextWindow = 20
      const contextStart = Math.max(0, formIndex - contextWindow)
      const contextEnd = Math.min(verseText.length, formIndex + form.length + contextWindow)
      const context = verseText.slice(contextStart, contextEnd)

      // Tokenize context for better analysis
      const tokens = tokenize(context)
      const formTokenIndex = tokens.findIndex(t => t.includes(form))
      
      if (formTokenIndex === -1) continue

      const leftTokens = tokens.slice(Math.max(0, formTokenIndex - 4), formTokenIndex)
      const rightTokens = tokens.slice(formTokenIndex + 1, formTokenIndex + 5)
      const leftSet = new Set(leftTokens)
      const rightSet = new Set(rightTokens)

      // Check for plural indicators
      const isPlural = pluralSuffixes.some(suffix => form.endsWith(suffix)) ||
                      numeralWords.some(num => leftSet.has(num) || rightSet.has(num)) ||
                      tokens.some(t => /^\d+$/.test(t)) // Numeric digits

      if (isPlural) {
        reasons.plural++
        reasons.examples.push({
          verse_ref: verseRef,
          text: verseText,
          reason: 'plural',
          highlighted_context: highlightContext(verseText, formIndex, form.length)
        })
      }

      // Check for sandwich patterns (adpositional phrases)
      let sandwichFound = false
      let sandwichPattern: string | undefined
      
      for (const pattern of sandwichPatterns) {
        if (pattern.type === 'pre') {
          // Preposition before the word
          if (leftSet.has(pattern.left) || leftTokens.slice(-2).some(t => t === pattern.left)) {
            reasons.sandwich++
            sandwichFound = true
            sandwichPattern = pattern.name
            if (!reasons.sandwich_types.includes(pattern.name)) {
              reasons.sandwich_types.push(pattern.name)
            }
            reasons.examples.push({
              verse_ref: verseRef,
              text: verseText,
              reason: 'sandwich',
              highlighted_context: highlightContext(verseText, formIndex, form.length, pattern.name),
              pattern: pattern.name
            })
            break // Count each verse only once for sandwich
          }
        } else if (pattern.type === 'circ') {
          // Circumposition surrounding the word
          const hasLeft = leftSet.has(pattern.left) || leftTokens.slice(-2).some(t => t === pattern.left)
          const hasRight = pattern.right ? (rightSet.has(pattern.right) || rightTokens.slice(0, 3).some(t => t.includes(pattern.right))) : false
          
          if (hasLeft && hasRight) {
            reasons.sandwich++
            sandwichFound = true
            sandwichPattern = pattern.name
            if (!reasons.sandwich_types.includes(pattern.name)) {
              reasons.sandwich_types.push(pattern.name)
            }
            reasons.examples.push({
              verse_ref: verseRef,
              text: verseText,
              reason: 'sandwich',
              highlighted_context: highlightContext(verseText, formIndex, form.length, pattern.name),
              pattern: pattern.name
            })
            break // Count each verse only once for sandwich
          }
        }
      }

      // Check for transitive past tense subject
      // Look for transitive past tense verbs in the context
      // The word should appear BEFORE the verb (as subject in Pashto word order)
      const verbSearch = findTransitiveVerbInContext(tokens, formTokenIndex)
      
      let hasPastTransitive = false
      let transitiveVerb: string | undefined
      
      if (verbSearch.found && verbSearch.verb) {
        // Found a transitive verb - verify the form is likely the subject
        // In Pashto, subjects of transitive past verbs are inflected (2nd inflection)
        hasPastTransitive = true
        transitiveVerb = verbSearch.verb
      } else {
        // Fallback: check for transitive markers in context
        hasPastTransitive = leftTokens.slice(-3).some(isLikelyPastTransitive) ||
                            (rightTokens.slice(0, 3).some(isLikelyPastTransitive) && 
                             transitiveMarkers.some(m => context.includes(m)))
      }

      if (hasPastTransitive && !sandwichFound) {
        // Only count as transitive past if not already counted as sandwich
        reasons.transitive_past++
        
        // Enhanced highlighting: include the transitive verb in context if found
        const highlightedContext = highlightContext(verseText, formIndex, form.length)
        
        reasons.examples.push({
          verse_ref: verseRef,
          text: verseText,
          reason: 'transitive_past',
          highlighted_context: highlightedContext
        })
      }
    }

    // Limit examples to top 3 per reason type
    const pluralExamples = reasons.examples.filter(e => e.reason === 'plural').slice(0, 2)
    const sandwichExamples = reasons.examples.filter(e => e.reason === 'sandwich').slice(0, 2)
    const transitiveExamples = reasons.examples.filter(e => e.reason === 'transitive_past').slice(0, 2)
    
    reasons.examples = [...pluralExamples, ...sandwichExamples, ...transitiveExamples]

    return reasons
  } catch (error) {
    console.warn(`Error analyzing inflection reasons for ${form}:`, error)
    return reasons
  }
}

async function enrichVariantsFromD1(
  db: D1Client,
  lookupTerm: string,
  collector: VariantCollector,
  includeRelated: boolean
) {
  const term = lookupTerm.trim()
  if (!term) return

  // First, try to find related forms using database queries instead of JSON files
  if (includeRelated) {
    try {
      // Query form_roots table for root mapping (replaces FORM_TO_ROOT_MAP JSON)
      const roots = await getFormToRootMap(db, term);
      if (roots.length > 0) {
        const root = roots[0];
        console.log(`Found root for ${term}: ${root}`);
        
        // Add the root to variants
        collector.add(root, { sources: ['root-map'] });
        
        // Get all forms for this root from database
        const formsForRoot = await getFormsForRoot(db, root);
        for (const form of formsForRoot) {
          collector.add(form, { sources: ['root-map'] });
        }
      }
      
      // Query grammatical index data from database (replaces GRAMMATICAL_INDEX JSON)
      const grammarData = await getGrammaticalIndexData(db, term);
      if (grammarData?.identities) {
        for (const identity of grammarData.identities) {
          for (const formEntry of identity.forms || []) {
            if (typeof formEntry === 'object' && formEntry.form) {
              collector.add(formEntry.form, { sources: ['grammar-index'], pos: identity.type });
            }
          }
        }
      }

      // Query inflections for compound verbs - search both the full compound and the main part
      if (term.includes(' ') && (term.includes('کېدل') || term.includes('کول') || term.includes('شول'))) {
        const parts = term.split(' ')
        const mainPart = parts[0]
        
        // Query inflections for the main part (e.g., ښکېل)
        try {
          const mainInflections = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
            `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 50`,
            [mainPart]
          );
          
          if (Array.isArray(mainInflections)) {
            for (const row of mainInflections) {
              const inflectedForm = row?.inflected_form
              if (typeof inflectedForm === 'string') {
                try {
                  const parsed = JSON.parse(inflectedForm)
                  if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                      if (item && typeof item === 'object' && item.form) {
                        // Add compound forms with the inflected main part
                        const compoundForm = item.form + ' ' + parts[1]
                        collector.add(compoundForm, { sources: ['compound-inflection'], pos: 'verb' })
                        // Also add squished form if applicable
                        if (parts[1] === 'کېدل' && item.form.endsWith('ل')) {
                          const squished = item.form.slice(0, -1) + 'ېدل'
                          collector.add(squished, { sources: ['compound-inflection'], pos: 'verb' })
                        }
                      }
                    }
                  }
                } catch {}
              }
            }
          }
        } catch {}
        
        // Also query inflections for the full compound verb
        try {
          const compoundInflections = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
            `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 50`,
            [term]
          );
          
          if (Array.isArray(compoundInflections)) {
            for (const row of compoundInflections) {
              const inflectedForm = row?.inflected_form
              if (typeof inflectedForm === 'string') {
                try {
                  const parsed = JSON.parse(inflectedForm)
                  if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                      if (item && typeof item === 'object' && item.form) {
                        collector.add(item.form, { sources: ['compound-inflection'], pos: 'verb' })
                      }
                    }
                  }
                } catch {}
              }
            }
          }
        } catch {}
      }

      if (term === 'وینم' || term === 'ووینم') {
        collector.add('لیدل', { sources: ['root'], pos: 'Verb' });
        collector.add('لېدل', { sources: ['root'], pos: 'Verb' });
        const relatedForms = ['وینم', 'ووینم', 'وینې', 'ووینې', 'ولیدم', 'ولیدې', 'لیدلی', 'لیدلې'];
        for (const form of relatedForms) {
          collector.add(form, { sources: ['verb-conjugation'], pos: 'Verb' });
        }
      }

      // Also check for other verb roots and their conjugations - use database
      const additionalRoots = await getFormToRootMap(db, term);
      if (additionalRoots.length > 0) {
        const root = additionalRoots[0];
        console.log(`Adding forms for root ${root} when searching for ${term}`);
        const formsForRoot = await getFormsForRoot(db, root);
        for (const form of formsForRoot) {
          // Determine if this is a verb conjugation based on the form
          const isVerbForm = form.includes('نم') || form.includes('و') || form.includes('ل') || form.endsWith('م') || form.endsWith('ې');
          collector.add(form, { sources: ['root-map'], pos: isVerbForm ? 'Verb' : 'Noun' });
        }
      }
    } catch (error) {
      console.error('Error enriching variants from JSON data:', error);
    }
  }

  const baseLimit = includeRelated ? 80 : 35

  // Query form_lemmas using D1
  try {
    const lemmaData = await db.query<{ lemma_form: string; base_word: string; part_of_speech: string; frequency: number }>(
      `SELECT lemma_form, base_word, part_of_speech, frequency FROM form_lemmas WHERE base_word = ? OR lemma_form = ? ORDER BY frequency DESC LIMIT ?`,
      [term, term, baseLimit]
    )

    if (Array.isArray(lemmaData)) {
      for (const row of lemmaData) {
        const pos = typeof row?.part_of_speech === 'string' ? row.part_of_speech : undefined
        const freq = Number(row?.frequency)
        const frequency = Number.isFinite(freq) ? freq : undefined
        if (row?.lemma_form) collector.add(row.lemma_form, { sources: ['lemma'], pos, frequency })
        if (row?.base_word) collector.add(row.base_word, { sources: ['lemma-base'], pos, frequency })
      }
    }
  } catch (error) {
    console.warn('D1 form_lemmas query failed:', error)
  }

  // Query form_roots using D1
  try {
    // Query form_roots for word_form matches
    const wordFormData = await db.query<{ word_form: string; root_form: string }>(
      `SELECT word_form, root_form FROM form_roots WHERE word_form = ? ORDER BY frequency DESC LIMIT ?`,
      [term, baseLimit]
    )

    if (Array.isArray(wordFormData)) {
      for (const row of wordFormData) {
        if (row?.word_form) collector.add(row.word_form, { sources: ['root-map'] })
        if (includeRelated && row?.root_form && row.root_form !== row.word_form) {
          collector.add(row.root_form, { sources: ['root'] })
        }
      }
    }

    // Query form_roots for root_form matches
    const rootFormData = await db.query<{ word_form: string; root_form: string }>(
      `SELECT word_form, root_form FROM form_roots WHERE root_form = ? ORDER BY frequency DESC LIMIT ?`,
      [term, baseLimit]
    )

    if (Array.isArray(rootFormData)) {
      for (const row of rootFormData) {
        if (row?.word_form) collector.add(row.word_form, { sources: ['root-map'] })
        if (includeRelated && row?.root_form && row.root_form !== row.word_form) {
          collector.add(row.root_form, { sources: ['root'] })
        }
      }
    }
  } catch (error) {
    console.warn('D1 form_roots query failed:', error)
  }

  try {
    // When includeRelated is true, get more inflections (up to 500 for comprehensive coverage)
    const inflectionLimit = includeRelated ? 500 : baseLimit
    const data = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
        `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT ?`,
        [term, inflectionLimit]
      );
      if (Array.isArray(data)) {
        for (const row of data) {
          let info: Record<string, any> | null | undefined = null
          
          // Parse grammatical_info if it's a string (JSON stored as string)
          if (row?.grammatical_info) {
            if (typeof row.grammatical_info === 'string') {
              try {
                info = JSON.parse(row.grammatical_info) as Record<string, any>
              } catch {
                info = null
              }
            } else if (typeof row.grammatical_info === 'object') {
              info = row.grammatical_info as Record<string, any>
            }
          }
          
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

  try {
    await enrichIrregularVariants(db, collector)
    addDirectionalVariants(collector)
  } catch (error) {
    console.error('Error in database queries:', error);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { query, scope, extraVariants, includeRelated, bookFilter, translation }: SearchRequest = await request.json()
    const effectiveTranslation = translation || 'unified'; // Default to unified if not specified

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
        coverage: [],
        ms: Date.now() - startTime
      })
    }

    // Create cache key from search parameters
    const variantsKey = Array.isArray(extraVariants) ? extraVariants.sort().join('|') : ''
    const bookFilterKey = bookFilter === null ? 'null' : (bookFilter || 'all')
    const cacheKey = `${query.trim()}-${scope}-${bookFilterKey}-${includeRelated ? 'rel1' : 'rel0'}-${variantsKey}-${effectiveTranslation}`

    // Debug logging for book filtering and scope
    if (bookFilter) {
      console.log(`DEBUG: Book filter applied: ${bookFilter}`)
    }
    console.log(`DEBUG: Scope: ${scope}, Book filter: ${bookFilter}, Translation: ${effectiveTranslation}`)

    // Check cache first
    const cached = SEARCH_CACHE.get(cacheKey)
    if (cached && Date.now() - cached.ts < SEARCH_CACHE_TTL_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        ms: Date.now() - startTime
      })
    }

    // Initialize D1 database client
    const d1Db = getD1Database();
    if (!d1Db) {
      return NextResponse.json({
        results: [],
        coverage: [],
        error: 'Database not configured',
        ms: Date.now() - startTime
      })
    }
    const db = new D1Client(d1Db);

    const originalTerm = query.trim()

    // Try compound verb expansion first (NOUN + AUX)
    const comp = splitCompound(originalTerm)
    if (comp) {
      const { object, aux } = comp
      let forms: string[] = []
      try {
        // Prefer DB inflections for the auxiliary
        const data = await db.query<{ inflected_form: string }>(
          `SELECT inflected_form FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 40`,
          [aux]
        );
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
          // Query verses from D1 database
          let sql = `SELECT ${selectCols} FROM verses WHERE text LIKE ?`
          const params: any[] = [`%${p.replace(/%/g,'')}%`]
          
          if (scope === 'ot') {
            sql += ` AND testament = 'OT'`
          } else if (scope === 'nt') {
            sql += ` AND testament = 'NT'`
          }
          
          // Apply book filter if provided
          if (bookFilter) {
            const bookVariantsList = bookVariants(bookFilter).slice(0, 5)
            if (bookVariantsList.length > 0) {
              const bookPlaceholders = bookVariantsList.map(() => '?').join(',')
              sql += ` AND book IN (${bookPlaceholders})`
              params.push(...bookVariantsList)
            }
          }
          
          sql += ` LIMIT 60`
          
          const data = await db.query<any>(sql, params)
          if (Array.isArray(data) && data.length > 0) {
            for (const row of data as any[]) {
              const text = row.text || ''
              const ref = `${row.book} ${row.chapter}:${row.verse}`
              if (!refSet.has(ref)) {
                refSet.add(ref)
                // Determine testament based on book name if not in database
                let testament = row.testament
                if (!testament) {
                  const bookName = row.book?.toLowerCase() || ''
                  if (OT_BOOKS.some(otBook => otBook.toLowerCase() === bookName)) {
                    testament = 'OT'
                  } else if (NT_BOOKS.some(ntBook => ntBook.toLowerCase() === bookName)) {
                    testament = 'NT'
                  }
                }

                allResults.push({
                  ref,
                  text,
                  testament
                })
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
        // Try romanized lookup first
        const dictData = await db.query<{ word: string; pos: string; romanization: string; definition: string }>(
          `SELECT word, pos, romanization, definition FROM dictionary WHERE romanization LIKE ? OR romanization LIKE ? OR romanization LIKE ? LIMIT 5`,
          [`${originalTerm}%`, `%${originalTerm}%`, `%${originalTerm}`]
        );
        if (Array.isArray(dictData)) {
          for (const row of dictData as Array<{ word: string; pos?: string; romanization?: string; definition?: string }>) {
            if (row && row.word) {
              const pos = typeof row.pos === 'string' ? row.pos : undefined
              const romanized = typeof row.romanization === 'string' ? row.romanization : undefined
              variantCollector.add(row.word, { sources: ['dictionary'], pos, romanization: romanized })
            }
          }
        }
        
        // Also try English lookup (check definition field for English translations)
        if (!variantCollector.list().some((form) => PASHTO_CHAR_RE.test(form))) {
          const englishDictData = await db.query<{ word: string; pos: string; romanization: string; definition: string }>(
            `SELECT word, pos, romanization, definition FROM dictionary WHERE definition LIKE ? OR definition LIKE ? LIMIT 5`,
            [`%${originalTerm}%`, `%${originalTerm.toLowerCase()}%`]
          );
          if (Array.isArray(englishDictData)) {
            for (const row of englishDictData as Array<{ word: string; pos?: string; romanization?: string; definition?: string }>) {
              if (row && row.word && PASHTO_CHAR_RE.test(row.word)) {
                const pos = typeof row.pos === 'string' ? row.pos : undefined
                const romanized = typeof row.romanization === 'string' ? row.romanization : undefined
                variantCollector.add(row.word, { sources: ['dictionary-english'], pos, romanization: romanized })
              }
            }
          }
        }
      } catch {}

      if (!variantCollector.list().some((form) => PASHTO_CHAR_RE.test(form))) {
        try {
          const data = await db.query<{ pashto_word: string; pos: string; romanization: string }>(
            `SELECT pashto_word, pos, romanization FROM romanized_dictionary WHERE romanization LIKE ? LIMIT 3`,
            [`%${originalTerm}%`]
          );
          if (Array.isArray(data)) {
            for (const row of data as Array<{ pashto_word: string; pos?: string; romanization?: string }>) {
              if (row && row.pashto_word) {
                const pos = typeof row.pos === 'string' ? row.pos : undefined
                const romanized = typeof row.romanization === 'string' ? row.romanization : undefined
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
        'wahal': ['وهل'],
        'wahúl': ['وهل'],
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
        const dictRows = await db.query<{ word: string; pos: string; romanization: string }>(
          `SELECT word, pos, romanization FROM dictionary WHERE word = ? LIMIT 1`,
          [originalTerm]
        );
        if (Array.isArray(dictRows) && dictRows.length > 0) {
          const row = dictRows[0] as { word: string; pos?: string; romanization?: string }
          if (row?.pos) {
            const romanized = typeof row?.romanization === 'string' ? row.romanization : undefined
            variantCollector.add(originalTerm, { sources: ['dictionary'], pos: row.pos, romanization: romanized })
          }
        }
      } catch {}
    }

    let lookupTerm = variantCollector.list().find((form) => PASHTO_CHAR_RE.test(form)) || originalTerm

    await enrichVariantsFromD1(db, lookupTerm, variantCollector, !!includeRelated)

    variantCollector.ensureFeminine()

    let variantDetails = variantCollector.details()

    // For direct search, ensure the original term is available for searching
    if (!includeRelated && variantDetails.length === 0) {
      variantCollector.add(originalTerm, { sources: ['query'] })
      variantDetails = variantCollector.details()
    }

    // Filter out invalid forms before processing
    variantDetails = variantDetails.filter((meta) => isValidPashtoForm(meta.form))

    // Sort by quality score to prioritize better forms
    variantDetails = variantDetails.sort((a, b) => scoreVariant(b) - scoreVariant(a))

    const pashtoFormsForFrequency = dedupePreserveOrder(
      variantDetails
        .filter((meta) => PASHTO_CHAR_RE.test(meta.form))
        .map((meta) => meta.form)
    ).slice(0, includeRelated ? 80 : 40)

    if (pashtoFormsForFrequency.length > 0) {
      try {
        const data = await db.query<{ pashto_word: string; frequency_count: number }>(
          `SELECT pashto_word, frequency_count FROM word_frequencies WHERE pashto_word IN (${pashtoFormsForFrequency.map(() => '?').join(',')})`,
          pashtoFormsForFrequency
        );
        if (Array.isArray(data)) {
          type WordFrequencyRow = {
            pashto_word: string | null
            frequency_count: number | null
          }
          const freqMap = new Map<string, number>()
          for (const row of data as WordFrequencyRow[]) {
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

    await backfillRomanizations(db, variantDetails, includeRelated ? 80 : 40)

    const searchVariants = variantDetails.map((meta) => meta.form)
    const primaryTerm = searchVariants.find((form) => PASHTO_CHAR_RE.test(form)) || searchVariants[0]
    lookupTerm = variantDetails.find((meta) => PASHTO_CHAR_RE.test(meta.form))?.form || primaryTerm
    const variantGroups = groupVariantsByPos(variantDetails)
    // Search variants - ensure we search the original term for direct search
    let variantsToSearch = searchVariants.slice(0, includeRelated ? 40 : 7)
    if (variantsToSearch.length === 0) {
      variantsToSearch = [originalTerm] // Always search the original term if no variants found
    } else if (!includeRelated && !variantsToSearch.includes(originalTerm)) {
      variantsToSearch = [originalTerm, ...variantsToSearch].slice(0, 7)
    }

    const allResults: Verse[] = []
    const refSet = new Set<string>()
    const coverageMap = new Map<string, number>()
    const coverageRefSet = new Set<string>()
    // Don't restrict search by book - show results from all books that contain the search term
    // When bookFilter is set, RelatedForms will show counts specific to that book
    const allowedBooks: Set<string> | null = null

    // FAST search: Search ALL variants and combine results
    const selectCols = 'book,chapter,verse,text,testament'
    let textSearchHit = false
    
    // Search based on translation
    const tablesToSearch = effectiveTranslation === 'yousafzai2019'
      ? [
          { name: 'verses_yousafzai', translation: 'Yousafzai 2019' },
          { name: 'verses', translation: 'Standard' }
        ]
      : effectiveTranslation === 'afghan2023'
      ? [
          { name: 'verses', translation: 'Afghan 2023' },
          { name: 'verses_yousafzai', translation: 'Yousafzai 2019' }
        ]
      : [
          // Unified search: search both translations equally
          { name: 'verses', translation: 'Afghan 2023' },
          { name: 'verses_yousafzai', translation: 'Yousafzai 2019' }
        ]

    for (const table of tablesToSearch) {
      for (let i = 0; i < variantsToSearch.length; i++) {
        const variantTerm = variantsToSearch[i]
        if (!variantTerm) continue

        try {
          // Query verses from D1 database
          let sql = `SELECT ${selectCols} FROM ${table.name} WHERE text LIKE ?`
          const params: any[] = [`%${variantTerm.replace(/%/g,'')}%`]
          
          if (scope === 'ot') {
            sql += ` AND testament = 'OT'`
          } else if (scope === 'nt') {
            sql += ` AND testament = 'NT'`
          }
          
          // Apply book filter if provided
          if (bookFilter) {
            const bookVariantsList = bookVariants(bookFilter).slice(0, 5)
            if (bookVariantsList.length > 0) {
              const bookPlaceholders = bookVariantsList.map(() => '?').join(',')
              sql += ` AND book IN (${bookPlaceholders})`
              params.push(...bookVariantsList)
            }
          }
          
          sql += ` LIMIT 50`
          
          const data = await db.query<any>(sql, params).catch(() => [])
          if (Array.isArray(data) && data.length > 0) {
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

              // Book filtering is disabled - search all books
              // allowedBooks is null, so no filtering applied

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
                      // Use Cloudflare R2 or remove Supabase domain reference
                      // Audio files should be served from Cloudflare R2 instead
                      const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.workers.dev'
                      audioVerseUrl = `${workerUrl}/audio/yousafzai/${filename}`
                    }
                  }
                }

                // Determine testament based on book name if not in database
                let testament = (row as any).testament
                if (!testament) {
                  const bookName = (row as any).book?.toLowerCase() || ''
                  if (OT_BOOKS.some(otBook => otBook.toLowerCase() === bookName)) {
                    testament = 'OT'
                  } else if (NT_BOOKS.some(ntBook => ntBook.toLowerCase() === bookName)) {
                    testament = 'NT'
                  }
                }

                allResults.push({
                  ref,
                  text,
                  translation: table.translation,
                  dialect: table.name === 'verses_yousafzai' ? 'yousafzai' : undefined,
                  tags: table.name === 'verses_yousafzai' ? (row as any).tags : undefined,
                  audio_verse_url: audioVerseUrl,
                  testament
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
        // Query form_occurrences from D1
        const occurrenceData = await db.query<{ verses: string }>(
          `SELECT verses FROM form_occurrences WHERE pashto_form = ? LIMIT 1`,
          [primaryTerm]
        )
        
        const formOccurrenceRows = Array.isArray(occurrenceData)
          ? (occurrenceData as Array<{ verses?: unknown }>)
          : []

        if (
          formOccurrenceRows.length > 0 &&
          Array.isArray(formOccurrenceRows[0].verses)
        ) {
          // Take first few verse references and try to find them
          const verseRefs = (formOccurrenceRows[0].verses as string[]).slice(0, 10)
          for (const ref of verseRefs) {
            if (typeof ref === 'string' && ref.includes(' ')) {
              const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/)
              if (match) {
                const [, book, chapter, verse] = match
                let sql = `SELECT ${selectCols} FROM verses WHERE book = ? AND chapter = ? AND verse = ?`
                const verseParams: any[] = [book, parseInt(chapter), parseInt(verse)]
                
                // Apply book filter if provided
                if (bookFilter) {
                  const bookVariantsList = bookVariants(bookFilter).slice(0, 5)
                  if (bookVariantsList.length > 0) {
                    const bookPlaceholders = bookVariantsList.map(() => '?').join(',')
                    sql += ` AND book IN (${bookPlaceholders})`
                    verseParams.push(...bookVariantsList)
                  }
                }
                
                sql += ` LIMIT 1`
                
                const verseData = await db.query<any>(sql, verseParams)
                const verseRows = Array.isArray(verseData) ? verseData : []

                if (verseRows.length > 0) {
                  const row = verseRows[0]
                  const bookValue = row.book ?? ''
                  const chapterValue =
                    typeof row.chapter === 'number' ? row.chapter : Number(row.chapter)
                  const verseValue =
                    typeof row.verse === 'number' ? row.verse : Number(row.verse)

                  if (
                    !bookValue ||
                    !Number.isFinite(chapterValue) ||
                    !Number.isFinite(verseValue)
                  ) {
                    continue
                  }
                  const fallbackRef = `${bookValue} ${chapterValue}:${verseValue}`

                  if (!coverageRefSet.has(fallbackRef)) {
                    coverageRefSet.add(fallbackRef)
                    coverageMap.set(bookValue, (coverageMap.get(bookValue) || 0) + 1)
                  }
                  // Determine testament based on book name if not in database
                  let testament: 'OT' | 'NT' | undefined = row.testament ?? undefined
                  if (!testament) {
                    const bookName = bookValue.toLowerCase()
                    if (OT_BOOKS.some((otBook) => otBook.toLowerCase() === bookName)) {
                      testament = 'OT'
                    } else if (NT_BOOKS.some((ntBook) => ntBook.toLowerCase() === bookName)) {
                      testament = 'NT'
                    }
                  }

                  allResults.push({
                    ref: fallbackRef,
                    text: row.text || '',
                    testament: testament || undefined
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
    console.log('DEBUG: includeRelated =', includeRelated, 'lookupTerm =', lookupTerm)
    if (includeRelated) {
      try {
        let relatedLookupTerm = lookupTerm
        if (!PASHTO_CHAR_RE.test(relatedLookupTerm)) {
          const fallbackPashto = searchVariants.find((variant) => PASHTO_CHAR_RE.test(variant))
          if (fallbackPashto) relatedLookupTerm = fallbackPashto
        }

        const normalizedLookup = relatedLookupTerm.trim() || originalTerm

        // Detect if this is a verb BEFORE generating forms
        const isVerb = normalizedLookup.endsWith('ل') || normalizedLookup.endsWith('دل')

        // Generate all inflected forms using our comprehensive pattern system
        let nounForms = expandInflectionVariants(normalizedLookup)
        const verbForms: string[] = []
        
        // For nouns/adjectives: Always query inflections table comprehensively when includeRelated is true
        if (includeRelated && !isVerb) {
          try {
            // FIRST: Query inflections table (authoritative source for all inflected forms)
            const inflData = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
              `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 300`,
              [normalizedLookup]
            );
            
            if (Array.isArray(inflData)) {
              const inflectionForms: string[] = [];
              for (const row of inflData) {
                const raw = row?.inflected_form;
                if (!raw) continue;
                
                // Parse inflected_form (can be string, array, or JSON string)
                const forms: string[] = [];
                if (Array.isArray(raw)) {
                  for (const entry of raw) {
                    if (typeof entry === 'string') forms.push(entry);
                    else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form);
                  }
                } else if (typeof raw === 'string') {
                  try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                      for (const entry of parsed) {
                        if (typeof entry === 'string') forms.push(entry);
                        else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form);
                      }
                    } else if (parsed && typeof parsed === 'object' && typeof parsed.form === 'string') {
                      forms.push(parsed.form);
                    } else {
                      forms.push(raw);
                    }
                  } catch {
                    forms.push(raw);
                  }
                }
                
                for (const form of forms) {
                  if (form && typeof form === 'string') {
                    inflectionForms.push(form);
                  }
                }
              }
              
              // Merge with pattern-based forms (deduplicate)
              const allNounForms = new Set([...nounForms, ...inflectionForms]);
              nounForms = Array.from(allNounForms);
              console.log(`DEBUG: ${normalizedLookup} - Added ${inflectionForms.length} inflections from inflections table (noun/adjective)`);
            }
            
            // ALSO: Query nouns_lexicon to get inflection pattern and ensure completeness
            // This helps especially when inflections table might be incomplete
            try {
              const nounLexiconData = await db.query<{ lemma: string; inflection_pattern: string; gender: string; pos: string }>(
                `SELECT lemma, inflection_pattern, gender, pos FROM nouns_lexicon WHERE lemma = ? LIMIT 1`,
                [normalizedLookup]
              );
              
              if (Array.isArray(nounLexiconData) && nounLexiconData.length > 0) {
                const nounEntry = nounLexiconData[0];
                console.log(`DEBUG: ${normalizedLookup} - Found in nouns_lexicon with pattern: ${nounEntry.inflection_pattern}`);
                // The inflection pattern info can be used for additional form generation if needed
                // The inflections table should already have all forms, but this confirms the pattern
              }
            } catch (error) {
              console.warn('nouns_lexicon query failed (may not exist):', error);
            }
          } catch (error) {
            console.warn('inflections table query failed for noun:', error);
          }
        }

        // NEW: Detect if this is a verb and generate appropriate conjugations
        if (isVerb) {
          // FIRST: Always query verb_forms table for comprehensive conjugations (when includeRelated is true)
          if (includeRelated) {
            try {
              const { getIrregularVerbForms } = await import('@/app/utils/lingdocs-irregular-conjugations');
              const comprehensiveForms = await getIrregularVerbForms(normalizedLookup);
              if (comprehensiveForms.length > 0) {
                verbForms.push(...comprehensiveForms);
                console.log(`DEBUG: ${normalizedLookup} - Added ${comprehensiveForms.length} forms from verb_forms table`);
              }
            } catch (error) {
              console.warn('verb_forms table query failed:', error);
            }
            
            // Also query inflections table for verb forms
            try {
              const inflData = await db.query<{ inflected_form: string; grammatical_info: string; frequency: number }>(
                `SELECT inflected_form, grammatical_info, frequency FROM inflections WHERE base_word = ? ORDER BY frequency DESC LIMIT 200`,
                [normalizedLookup]
              );
              
              if (Array.isArray(inflData)) {
                for (const row of inflData) {
                  const raw = row?.inflected_form;
                  if (!raw) continue;
                  
                  // Parse inflected_form (can be string, array, or JSON string)
                  const forms: string[] = [];
                  if (Array.isArray(raw)) {
                    for (const entry of raw) {
                      if (typeof entry === 'string') forms.push(entry);
                      else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form);
                    }
                  } else if (typeof raw === 'string') {
                    try {
                      const parsed = JSON.parse(raw);
                      if (Array.isArray(parsed)) {
                        for (const entry of parsed) {
                          if (typeof entry === 'string') forms.push(entry);
                          else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form);
                        }
                      } else if (parsed && typeof parsed === 'object' && typeof parsed.form === 'string') {
                        forms.push(parsed.form);
                      } else {
                        forms.push(raw);
                      }
                    } catch {
                      forms.push(raw);
                    }
                  }
                  
                  for (const form of forms) {
                    if (form && typeof form === 'string') {
                      verbForms.push(form);
                    }
                  }
                }
                console.log(`DEBUG: ${normalizedLookup} - Added ${inflData.length} inflections from inflections table`);
              }
            } catch (error) {
              console.warn('inflections table query failed for verb:', error);
            }
          }
          
          // Priority 1: Check if it's an irregular verb - query database
          let foundVerbType = false;
          try {
            const irregularForms = await generateIrregularVerbFormsFromDB(db, normalizedLookup);
            if (irregularForms.length > 1) {
              verbForms.push(...irregularForms);
              console.log(`DEBUG: ${normalizedLookup} - Found irregular verb in database, generated ${irregularForms.length} forms`);
              foundVerbType = true;
            }
          } catch (error) {
            console.warn('Error checking irregular verb:', error);
          }
          
          // Priority 2: Check if it's a compound verb with irregular auxiliary
          if (!foundVerbType && normalizedLookup.includes(' ')) {
            const parts = normalizedLookup.split(' ');
            if (parts.length === 2) {
              const [main, aux] = parts;
              // Check if auxiliary is irregular - query database instead of hardcoded map
              const auxVerbData = await getIrregularVerbData(db, aux);
              if (auxVerbData || aux === 'کېدل' || aux === 'کول') {
                try {
                  const { getCompoundVerbFormsWithIrregularAux } = await import('@/app/utils/lingdocs-irregular-conjugations');
                  const compoundForms = await getCompoundVerbFormsWithIrregularAux(normalizedLookup);
                  if (compoundForms.length > 0) {
                    verbForms.push(...compoundForms);
                    console.log(`DEBUG: ${normalizedLookup} - Added ${compoundForms.length} compound forms with irregular aux`);
                  }
                } catch (error) {
                  console.warn('LingDocs compound forms not available:', error);
                }
              }
              
              // Also generate standard compound forms
              const isStative = aux === 'کېدل' || aux === 'شول';
              verbForms.push(...generateCompoundVerbForms(normalizedLookup, isStative));
              console.log(`DEBUG: ${normalizedLookup} - Found ${isStative ? 'stative' : 'dynamic'} compound, generated ${verbForms.length} forms`)
              foundVerbType = true;
            }
          }
          // Priority 3: Check if it's a fused compound verb (ګرمېدل, etc.)
          if (!foundVerbType && (normalizedLookup.endsWith('ېدل') || normalizedLookup.endsWith('کېدل'))) {
            verbForms.push(...generateFusedCompoundVerbForms(normalizedLookup))
            console.log(`DEBUG: ${normalizedLookup} - Found fused compound verb, generated ${verbForms.length} forms`)
            foundVerbType = true;
          }
          // Priority 4: Regular verb
          if (!foundVerbType) {
            verbForms.push(...generateRegularVerbForms(normalizedLookup))
            console.log(`DEBUG: ${normalizedLookup} - Found regular verb, generated ${verbForms.length} forms`)
          }
        }

        // Combine all forms but track their origin
        const allPossibleForms = [...nounForms, ...verbForms]
        
        // Legacy: Add compound verb forms (منډه وهل, منډې وهل, etc.) for non-verbs
        if (!isVerb) {
          const auxVerbs = ['کول', 'وهل', 'کړل', 'کېدل', 'ورکول']
          for (const aux of auxVerbs) {
            for (const form of allPossibleForms.slice(0, 8)) { // Limit to avoid too many combinations
              allPossibleForms.push(`${form} ${aux}`)
            }
          }
        }
        
        // CRITICAL: Also add ALL forms from variantDetails (which includes inflections from inflections table)
        // This ensures we check ALL inflected forms against word_frequencies
        const variantForms = variantDetails
          .filter((meta) => PASHTO_CHAR_RE.test(meta.form))
          .map((meta) => meta.form)
        
        // Add variant forms to allPossibleForms (deduplicate)
        const formsSet = new Set(allPossibleForms)
        for (const form of variantForms) {
          formsSet.add(form)
        }
        const allPossibleFormsWithVariants = Array.from(formsSet)
        
        // Debug logging for جوړول
        if (normalizedLookup.includes('جوړول')) {
          console.log(`DEBUG: جوړول - Generated ${allPossibleFormsWithVariants.length} possible forms:`, allPossibleFormsWithVariants.slice(0, 20))
        }

        // Check which forms actually exist in the Bible using form_occurrences
        const existingForms: Array<{form: string, count: number}> = []
        
        // Query in batches to avoid URL length limits
        const batchSize = 15
        const maxFormsToCheck = includeRelated ? allPossibleFormsWithVariants.length : Math.min(60, allPossibleFormsWithVariants.length) // Check ALL forms when includeRelated is true
        for (let i = 0; i < Math.min(allPossibleFormsWithVariants.length, maxFormsToCheck); i += batchSize) {
          const batch = allPossibleFormsWithVariants.slice(i, i + batchSize)
          
          try {
            const placeholders = batch.map(() => '?').join(',')
            const occurrenceData = await db.query<{ pashto_form: string; frequency: number }>(
              `SELECT pashto_form, frequency FROM form_occurrences WHERE pashto_form IN (${placeholders}) AND frequency >= 1 ORDER BY frequency DESC LIMIT 30`,
              batch
            );

            if (Array.isArray(occurrenceData)) {
              const typedRows = occurrenceData as Array<{
                pashto_form?: string | null
                frequency?: number | null
              }>
              for (const row of typedRows) {
                if (row?.pashto_form && row?.frequency) {
                  existingForms.push({
                    form: row.pashto_form,
                    count: Number(row.frequency) || 0
                  })
                }
              }
            }
          } catch (error: any) {
            // Try different column names if the first attempt fails
            try {
              const placeholders = batch.map(() => '?').join(',')
              const occurrenceData2 = await db.query<{ pashto_form: string; frequency: number }>(
                `SELECT pashto_form, frequency FROM form_occurrences WHERE pashto_form IN (${placeholders}) AND frequency >= 1 ORDER BY frequency DESC LIMIT 30`,
                batch
              );

              if (Array.isArray(occurrenceData2)) {
                const typedRows2 = occurrenceData2 as Array<{
                  pashto_form?: string | null
                  frequency?: number | null
                }>
                for (const row of typedRows2) {
                  if (row?.pashto_form && row?.frequency) {
                    existingForms.push({
                      form: row.pashto_form,
                      count: Number(row.frequency) || 0
                    })
                  }
                }
              }
            } catch {}
          }
        }

        // If book filter is applied, get accurate counts for related forms within that book
        if (bookFilter && existingForms.length > 0) {
          const bookVariantsList = bookVariants(bookFilter).slice(0, 5) // Use all book variants

          // For book-filtered searches, we need to recount forms within the specific book
          const bookFilteredForms: Array<{form: string, count: number}> = []

          // Process more forms when book filtering to ensure comprehensive results
          const formsToCheck = includeRelated ? existingForms.slice(0, 20) : existingForms.slice(0, 12)
          for (const formData of formsToCheck) {
            try {
              // Get count from D1 database
              const bookPlaceholders = bookVariantsList.map(() => '?').join(',')
              const escapedForm = formData.form.replace(/[%_]/g, '\\$&')
              const countResult = await db.queryFirst<{ count: number }>(
                `SELECT COUNT(*) as count FROM verses WHERE book IN (${bookPlaceholders}) AND text LIKE ?`,
                [...bookVariantsList, `%${escapedForm}%`]
              );
              const count = countResult?.count || 0

              if (count && count > 0) {
                bookFilteredForms.push({
                  form: formData.form,
                  count: count
                })
              }
            } catch (error) {
              console.warn(`Error counting ${formData.form} in book ${bookFilter}:`, error)
            }
          }

          // Replace existing forms with book-filtered counts
          existingForms.splice(0, existingForms.length, ...bookFilteredForms)
        }

        // Also check word_frequencies table for additional forms
        // CRITICAL: Check ALL forms, not just a subset
        try {
          const formsToCheck = includeRelated ? allPossibleFormsWithVariants : allPossibleFormsWithVariants.slice(0, 30)
          if (formsToCheck.length > 0) {
            const placeholders = formsToCheck.map(() => '?').join(',')
            const wordFreqData = await db.query<{ pashto_word: string; frequency_total: number }>(
              `SELECT pashto_word, frequency_total FROM word_frequencies WHERE pashto_word IN (${placeholders}) AND frequency_total >= 1 ORDER BY frequency_total DESC LIMIT 100`,
              formsToCheck
            );

            if (Array.isArray(wordFreqData)) {
              const typedWordFreqRows = wordFreqData as Array<{
                pashto_word?: string | null
                frequency_total?: number | null
              }>
              for (const row of typedWordFreqRows) {
                if (row?.pashto_word && row?.frequency_total && !existingForms.find(e => e.form === row.pashto_word)) {
                  existingForms.push({
                    form: row.pashto_word,
                    count: Number(row.frequency_total) || 0
                  })
                }
              }
            }
          }
        } catch {
          // Try different column names
          try {
            const formsToCheck = includeRelated ? allPossibleFormsWithVariants : allPossibleFormsWithVariants.slice(0, 30)
            const placeholders = formsToCheck.map(() => '?').join(',')
            const wordFreqData2 = await db.query<{ pashto_word: string; frequency_total: number }>(
              `SELECT pashto_word, frequency_total FROM word_frequencies WHERE pashto_word IN (${placeholders}) AND frequency_total >= 1 ORDER BY frequency_total DESC LIMIT 20`,
              formsToCheck
            );

            if (Array.isArray(wordFreqData2)) {
              const typedWordFreqRows2 = wordFreqData2 as Array<{
                pashto_word?: string | null
                frequency_total?: number | null
              }>
              for (const row of typedWordFreqRows2) {
                if (row?.pashto_word && row?.frequency_total && !existingForms.find(e => e.form === row.pashto_word)) {
                  existingForms.push({
                    form: row.pashto_word,
                    count: Number(row.frequency_total) || 0
                  })
                }
              }
            }
          } catch {}
        }

        // Sort by frequency and categorize
        existingForms.sort((a, b) => b.count - a.count)

        // Debug logging for جوړول
        if (normalizedLookup.includes('جوړول')) {
          console.log(`DEBUG: جوړول - Found ${existingForms.length} existing forms:`, existingForms.slice(0, 10))
        }

        const verbs: Array<{form: string, count: number, inflectionType?: string, inflectionReasons?: any}> = []
        const nouns: Array<{form: string, count: number, inflectionType?: string, inflectionReasons?: any}> = []
        const other: Array<{form: string, count: number, inflectionType?: string, inflectionReasons?: any}> = []

        // Helper function to determine inflection type from form characteristics
        // Also checks grammatical_info if available
        function determineInflectionType(form: string, baseWord: string, grammaticalInfo?: string): string {
          // Try to parse grammatical_info first if available
          if (grammaticalInfo) {
            try {
              const info = typeof grammaticalInfo === 'string' ? JSON.parse(grammaticalInfo) : grammaticalInfo
              if (info && typeof info === 'object') {
                const formType = info.form_type
                if (formType && typeof formType === 'string') {
                  // Map common form types
                  if (formType === 'plain') return 'plain'
                  if (formType === '1st') {
                    // Check if masculine or feminine based on pattern
                    if (form.endsWith('ې')) return '1st_f'
                    return '1st_m'
                  }
                  if (formType === '2nd') return '2nd'
                  if (formType === 'plural') {
                    if (form.endsWith('انې')) return 'plural_f'
                    if (form.endsWith('انو')) return 'plural_2nd_m'
                    if (form.endsWith('یانو')) return 'plural_2nd'
                    return 'plural_m'
                  }
                }
              }
            } catch {}
          }
          
          // Fallback to pattern-based detection
          // Pattern 1: Plain form (same as base)
          if (form === baseWord) return 'plain'
          
          // Pattern 2: 1st inflection masculine (same as plain for masculine nouns)
          if (form === baseWord && !form.endsWith('ه')) return '1st_m'
          
          // Pattern 3: 1st inflection feminine (ends with ې)
          if (form.endsWith('ې') && !form.endsWith('انې')) return '1st_f'
          
          // Pattern 4: 2nd inflection (ends with و)
          if (form.endsWith('و') && !form.endsWith('انو') && !form.endsWith('یانو')) return '2nd'
          
          // Pattern 5: Vocative (masculine: ends with ه, feminine: ends with ې)
          if (form.endsWith('ه') && form !== baseWord + 'ه') return 'vocative_m'
          if (form.endsWith('ې') && form.endsWith('انې')) return 'vocative_f'
          
          // Pattern 6: Plural forms
          if (form.endsWith('ان')) return 'plural_m'
          if (form.endsWith('انې')) return 'plural_f'
          if (form.endsWith('انو')) return 'plural_2nd_m'
          if (form.endsWith('یانو')) return 'plural_2nd'
          if (form.endsWith('ونه')) return 'plural_inanimate'
          if (form.endsWith('ونو')) return 'plural_inanimate_2nd'
          
          // Pattern 7: Feminine forms ending in ۍ
          if (form.endsWith('ۍ')) return '1st_f_stressed'
          
          // Pattern 8: 2nd inflection ending in یو
          if (form.endsWith('یو')) return '2nd'
          
          return 'other'
        }

        // Create a map of form -> grammatical_info for better inflection type detection
        const formToGrammaticalInfo = new Map<string, string>()
        if (includeRelated && !isVerb) {
          try {
            const inflData = await db.query<{ inflected_form: string; grammatical_info: string }>(
              `SELECT inflected_form, grammatical_info FROM inflections WHERE base_word = ? LIMIT 300`,
              [normalizedLookup]
            );
            if (Array.isArray(inflData)) {
              for (const row of inflData) {
                const raw = row?.inflected_form
                if (!raw) continue
                const forms: string[] = []
                if (typeof raw === 'string') {
                  try {
                    const parsed = JSON.parse(raw)
                    if (Array.isArray(parsed)) {
                      for (const entry of parsed) {
                        if (typeof entry === 'string') forms.push(entry)
                        else if (entry && typeof entry === 'object' && typeof entry.form === 'string') forms.push(entry.form)
                      }
                    } else {
                      forms.push(raw)
                    }
                  } catch {
                    forms.push(raw)
                  }
                }
                for (const form of forms) {
                  if (form && typeof form === 'string' && row?.grammatical_info) {
                    formToGrammaticalInfo.set(form, row.grammatical_info)
                  }
                }
              }
            }
          } catch {}
        }

        // Analyze inflection reasons for each form (only for nouns/adjectives to avoid performance issues)
        // Process in batches to avoid too many queries
        const formsToAnalyze = existingForms.filter(item => {
          const form = item.form
          // Only analyze nouns/adjectives (not verbs)
          return !verbForms.includes(form) && 
                 !form.includes(' ') && 
                 !form.endsWith('ل') &&
                 (form.endsWith('ه') || form.endsWith('ې') || form.endsWith('و') || form.endsWith('ۍ') ||
                  form.endsWith('ی') || form.endsWith('ي') || form.endsWith('یو') || form.endsWith('ان') || form.endsWith('ونه'))
        }).slice(0, includeRelated ? 20 : 10) // Limit analysis to top forms

        // Create a map of form -> inflection reasons
        const formToReasons = new Map<string, { 
          plural: number; 
          sandwich: number; 
          transitive_past: number; 
          sandwich_types: string[];
          examples: Array<{
            verse_ref: string;
            text: string;
            reason: 'plural' | 'sandwich' | 'transitive_past';
            highlighted_context?: string;
            pattern?: string;
          }>;
        }>()
        
        // Analyze inflection reasons for each form (parallel processing)
        const analysisPromises = formsToAnalyze.map(async (item) => {
          const reasons = await analyzeInflectionReasons(db, item.form, normalizedLookup, 5)
          formToReasons.set(item.form, reasons)
        })
        
        await Promise.all(analysisPromises)

        for (const item of existingForms) {
          const form = item.form
          const grammaticalInfo = formToGrammaticalInfo.get(form)
          const inflectionType = determineInflectionType(form, normalizedLookup, grammaticalInfo)
          const inflectionReasons = formToReasons.get(form) || { 
            plural: 0, 
            sandwich: 0, 
            transitive_past: 0, 
            sandwich_types: [],
            examples: []
          }

          // Categorize based on form origin and characteristics
          if (verbForms.includes(form)) {
            // This form was generated from verb conjugation
            verbs.push({...item, inflectionType})
          } else if (form.includes(' ') && (form.includes('ول') || form.includes('ېدل') || form.includes('کړل') || form.includes('کول'))) {
            // Compound verbs (منډه وهل, etc.)
            verbs.push({...item, inflectionType})
          } else if (form.endsWith('ل') || form.endsWith('ېدل') || form.endsWith('وهل') || form.endsWith('کول') || form.endsWith('کړل')) {
            // Simple verbs (infinitives)
            verbs.push({...item, inflectionType})
          } else if ((form.endsWith('م') || form.endsWith('ې') || form.endsWith('ي') || form.endsWith('و') || form.endsWith('ئ'))) {
            // Verb conjugations - these are the actual verb person endings
            // Don't exclude 'ي' here as it's a valid verb ending (3rd person singular)
            verbs.push({...item, inflectionType})
          } else if (form.endsWith('ه') || form.endsWith('ې') || form.endsWith('و') || form.endsWith('ۍ') ||
                     form.endsWith('ی') || form.endsWith('ي') || form.endsWith('یو') || form.endsWith('ان') || form.endsWith('ونه')) {
            // Nouns and adjectives (all inflected forms)
            nouns.push({...item, inflectionType, inflectionReasons})
          } else {
            other.push({...item, inflectionType})
          }
        }

        relatedForms = {
          verbs: verbs.slice(0, 8),  // Top 8 verbs with counts
          nouns: nouns.slice(0, 12), // Top 12 nouns with counts  
          other: other.slice(0, 6),  // Top 6 other forms with counts
          total: existingForms.length
        }
        
        // Debug logging for جوړول
        if (normalizedLookup.includes('جوړول')) {
          console.log(`DEBUG: جوړول - Final relatedForms:`, { 
            verbsCount: verbs.length,
            nounsCount: nouns.length, 
            otherCount: other.length,
            total: existingForms.length
          })
        }
        
        // Fallback: If no forms found, at least show the inflected variants
        if (existingForms.length === 0 && allPossibleFormsWithVariants.length > 1) {
          console.log('DEBUG: No forms found in database, showing generated forms as fallback')
          const fallbackForms = allPossibleFormsWithVariants.slice(1, 11).map(form => ({ form, count: 0 }))
          relatedForms = {
            verbs: fallbackForms.filter(f => verbForms.includes(f.form) || f.form.includes('ول') || f.form.includes('کول') || f.form.includes('نم') || f.form.includes('م')),
            nouns: fallbackForms.filter(f => !verbForms.includes(f.form) && !f.form.includes('ول') && !f.form.includes('کول') && !f.form.includes('نم') && !f.form.includes('م') && !f.form.includes('ل')),
            other: [],
            total: fallbackForms.length
          }
        }
      } catch (error) {
        console.log('DEBUG: Error in related forms:', error)
      }
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error details:', errorMessage, error)
    return NextResponse.json(
      {
        error: 'Search failed',
        errorDetails: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
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

/**
 * LingDocs Adapter - Practical Integration
 * 
 * This adapter provides a simpler way to use LingDocs functionality
 * by importing the TypeScript source directly (no build required).
 */

import { getData } from '../lib/data/load';

const COMPOUND_HELPERS = new Set(['وهل', 'کول', 'کېدل', 'کړل', 'اخیستل', 'ساتل']);
import { createClient } from '@supabase/supabase-js';
import type { Variant } from './verb_variants';

// Initialize Supabase client for metadata queries
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * Fetch enriched metadata from Supabase dictionary table
 */
async function getEnrichedMetadata(pashtoWord: string): Promise<{
  inflectionPattern?: string;
  linguisticCategory?: string;
  enrichedInfo?: Record<string, any>;
} | null> {
  try {
    const { data, error } = await supabase
      .from('dictionary')
      .select('inflection_pattern, linguistic_category, enriched_info')
      .eq('pashto', pashtoWord)
      .limit(1)
      .single();

    if (error || !data) {
      console.log(`⚠️ No enriched metadata found for "${pashtoWord}"`);
      return null;
    }

    return {
      inflectionPattern: data.inflection_pattern,
      linguisticCategory: data.linguistic_category,
      enrichedInfo: data.enriched_info || {}
    };
  } catch (err) {
    console.error(`Error fetching metadata for "${pashtoWord}":`, err);
    return null;
  }
}

// Type definitions matching LingDocs format
export interface LingDocsEntry {
  ts: number;
  i: number;
  p: string;   // Pashto
  f: string;   // Phonetics
  g: string;   // Simplified phonetics
  e: string;   // English
  c?: string;  // Part of speech category
  
  // Verb-specific fields
  psp?: string;  // Present stem Pashto
  psf?: string;  // Present stem phonetics
  ssp?: string;  // Subjunctive stem Pashto
  ssf?: string;  // Subjunctive stem phonetics
  prp?: string;  // Perfective root Pashto
  prf?: string;  // Perfective root phonetics
  pprtp?: string; // Past participle Pashto
  pprtf?: string; // Past participle phonetics
}

/**
 * Convert your dictionary format to LingDocs format
 */
export async function convertToLingDocsEntry(pashtoWord: string): Promise<LingDocsEntry | null> {
  const { dictionary, dictionaryByRomanized } = await getData();
  
  console.log(`🔍 convertToLingDocsEntry looking for "${pashtoWord}"`);
  console.log(`🔍 Dictionary has ${dictionary.length} entries`);
  
  // Try to find by Pashto text
  let entry = dictionary.find((d: any) => 
    d.pashto?.toLowerCase() === pashtoWord.toLowerCase()
  );
  
  console.log(`🔍 Found entry:`, !!entry);
  
  // If not found, try romanized
  if (!entry && isLatin(pashtoWord)) {
    const entries = dictionaryByRomanized.get(pashtoWord.toLowerCase());
    entry = entries?.[0];
  }
  
  // Check if this is a perfective root of an irregular verb
  if (!entry) {
    console.log(`🔍 Checking if "${pashtoWord}" is a perfective root of irregular verb...`);
    try {
      const irregularVerbs = await import('../../irregular_verbs.json');
      const irregularEntry = Object.entries(irregularVerbs.default || irregularVerbs).find(([infinitive, data]: [string, any]) => 
        infinitive === pashtoWord || data.roots?.perfective === pashtoWord || data.roots?.imperfective === pashtoWord
      );
      
      if (irregularEntry) {
        const [infinitive, verbData] = irregularEntry;
        console.log(`✅ Found "${pashtoWord}" as perfective root of "${infinitive}"`);
        
        // Create a synthetic entry for the irregular verb
        entry = {
          pashto: infinitive,
          romanized: verbData.romanization?.imperfective_root || '',
          english: 'irregular verb',
          pos: 'v.',
          c: 'v.',
          // Add verb-specific fields for pattern generation
          present_stem: verbData.stems?.imperfective,
          present_stem_phonetics: verbData.romanization?.imperfective_stem,
          subjunctive_stem: verbData.stems?.perfective,
          subjunctive_stem_phonetics: verbData.romanization?.perfective_stem,
          perfective_root: verbData.roots?.perfective,
          perfective_root_phonetics: verbData.romanization?.perfective_root,
          past_participle: verbData.past_participle,
          past_participle_phonetics: verbData.romanization?.past_participle,
        } as any; // Cast to any to allow additional verb-specific fields
      }
    } catch (error) {
      console.warn('Failed to load irregular verbs:', error);
    }
  }
  
  if (!entry) return null;
  
  // Convert to LingDocs format
  return {
    ts: (entry as any).id || Date.now(),
    i: (entry as any).alphabetical_index || 0,
    p: (entry as any).pashto || pashtoWord,
    f: (entry as any).romanized || (entry as any).phonetics || '',
    g: (entry as any).simplified_phonetics || (entry as any).romanized || '',
    e: (entry as any).english || (entry as any).meaning || (entry as any).definition || '',
    c: (entry as any).part_of_speech || (entry as any).pos || detectPOS(entry),
    
    // Verb-specific (if available in your dictionary)
    psp: (entry as any).present_stem,
    psf: (entry as any).present_stem_phonetics,
    ssp: (entry as any).subjunctive_stem,
    ssf: (entry as any).subjunctive_stem_phonetics,
    prp: (entry as any).perfective_root,
    prf: (entry as any).perfective_root_phonetics,
    pprtp: (entry as any).past_participle,
    pprtf: (entry as any).past_participle_phonetics,
  };
}

/**
 * Check if text is in Latin script
 */
function isLatin(text: string): boolean {
  return /^[a-zA-Z]/.test(text);
}

/**
 * Detect if a verb has separable prefixes (split head) based on Pashto grammar
 * Based on https://grammar.lingdocs.com/search?search=split+head
 */
function detectSeparableVerb(infinitive: string, enrichedInfo?: Record<string, any>): { isSeparable: boolean; prefix?: string; stem?: string } {
  // Known separable verbs with their prefixes
  const separableVerbs: Record<string, { prefix: string; stem: string }> = {
    'وړل': { prefix: 'و', stem: 'ړل' },
    'راوړل': { prefix: 'را', stem: 'وړل' },
    'نیول': { prefix: 'نی', stem: 'ول' },
    'خوړل': { prefix: 'خو', stem: 'ړل' },
    'ویل': { prefix: 'و', stem: 'یل' },
    'ویستل': { prefix: 'وی', stem: 'ستل' },
    'ایستل': { prefix: 'ای', stem: 'ستل' },
    'اخستل': { prefix: 'اخ', stem: 'ستل' },
  };

  if (separableVerbs[infinitive]) {
    return {
      isSeparable: true,
      prefix: separableVerbs[infinitive].prefix,
      stem: separableVerbs[infinitive].stem
    };
  }

  // Pattern-based detection for separable verbs
  // Verbs that can split their head in perfective aspect
  if (infinitive.startsWith('و') && infinitive.length > 3) {
    return {
      isSeparable: true,
      prefix: 'و',
      stem: infinitive.slice(1)
    };
  }

  if (infinitive.startsWith('را') && infinitive.length > 4) {
    return {
      isSeparable: true,
      prefix: 'را',
      stem: infinitive.slice(2)
    };
  }

  return { isSeparable: false };
}

/**
 * Determine if a verb is transitive or intransitive based on Pashto grammar rules
 * Based on https://grammar.lingdocs.com/verbs/past-verbs/
 */
function determineTransitivity(infinitive: string, enrichedInfo?: Record<string, any>): boolean {
  // Check enriched metadata first
  if (enrichedInfo?.transitivity) {
    return enrichedInfo.transitivity === 'transitive';
  }

  // Known intransitive verbs (verbs that don't take objects)
  const intransitiveVerbs = new Set([
    'رسېدل', 'تلل', 'راتلل', 'کېناستل', 'درېدل', 'ګرځېدل', 'ګرځول', 'پاتې کېدل',
    'پاتې شول', 'پاتې کېدل', 'پاتې شول', 'ګرځېدل', 'ګرځول', 'ګرځېدل', 'ګرځول',
    'ګرځېدل', 'ګرځول', 'ګرځېدل', 'ګرځول', 'ګرځېدل', 'ګرځول', 'ګرځېدل', 'ګرځول'
  ]);

  if (intransitiveVerbs.has(infinitive)) {
    return false;
  }

  // Known transitive verbs (verbs that take objects)
  const transitiveVerbs = new Set([
    'کول', 'کېدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل',
    'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل', 'ولیدل',
    'ویستل', 'ایستل', 'اخستل', 'ورکول', 'ورکول', 'ورکول', 'ورکول', 'ورکول',
    'وړل', 'راوړل', 'نیول', 'خوړل', 'ویل', 'ویستل', 'وړل'
  ]);

  if (transitiveVerbs.has(infinitive)) {
    return true;
  }

  // Pattern-based detection
  // Verbs ending in specific patterns are typically transitive
  if (infinitive.endsWith('ول') || infinitive.endsWith('کول') || infinitive.endsWith('کېدل')) {
    return true;
  }

  // Verbs ending in ېدل are typically intransitive (like نومېدل, تلل, رسېدل)
  if (infinitive.endsWith('ېدل')) {
    return false;
  }

  // Verbs ending in specific patterns are typically intransitive
  if (infinitive.endsWith('ول') || infinitive.endsWith('شول')) {
    return false;
  }

  // Default to transitive for most Pashto verbs
  return true;
}

/**
 * Detect part of speech from entry data
 */
function detectPOS(entry: any): string {
  const text = JSON.stringify(entry).toLowerCase();
  
  if (text.includes('verb') || entry.present_stem || entry.subjunctive_stem) {
    return 'v.';
  }
  if (text.includes('noun')) {
    return 'n. m.' ; // Default to masculine
  }
  if (text.includes('adjective') || text.includes('adj')) {
    return 'adj.';
  }
  
  return 'other';
}

/**
 * Enhanced verb variant generation using your existing data
 * but formatted for potential LingDocs integration
 */
export async function generateEnhancedVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 60));
  const includeCompound = !!opts?.includeCompound;
  
  // Get the entry in LingDocs format
  const entry = await convertToLingDocsEntry(rootOrInfinitive);

  if (!entry) {
    console.warn(`Entry not found for: ${rootOrInfinitive}`);
    return [];
  }

  // 1.5. Check for enriched metadata from Supabase
  const enrichedMetadata = await getEnrichedMetadata(rootOrInfinitive);
  console.log(`📊 Enriched metadata for "${rootOrInfinitive}":`, {
    pattern: enrichedMetadata?.inflectionPattern,
    category: enrichedMetadata?.linguisticCategory,
    hasStems: Object.keys(enrichedMetadata?.enrichedInfo || {}).length > 0
  });

  const variants: Variant[] = [];
  
  // 1. Add base infinitive
  variants.push({
    form: entry.p,
    label: 'Infinitive',
    pos: 'verb',
    romanized: entry.f,
  });
  
  // 2. Use your existing inflections data
  const data = await getData();
  const inflectMap = (data as any).inflectionsByBase || new Map();
  const freqMap = data.frequencyMap;
  const inflRows = inflectMap?.get(entry.p) || [];
  
  for (const row of inflRows) {
    if (!row.form) continue;
    
    const info = (row.category ?? '') as string;
    const flags: string[] = [];
    
    // Enhanced categorization
    if (/stative/i.test(info)) flags.push('stative');
    if (/dynamic/i.test(info)) flags.push('dynamic');
    if (/compound|comp\./i.test(info)) flags.push('compound');
    if (/irreg/i.test(info)) flags.push('irregular');
    
    variants.push({
      form: row.form,
      label: labelFromInfo(info),
      pos: 'verb',
      romanized: row.romanization,
      flags: flags.length ? flags : undefined,
      count: freqMap?.get(row.form) ?? 0,
    });
  }
  
  // 3. Add stems from enriched metadata (Supabase) or fallback to LingDocs format
  const enrichedInfo = enrichedMetadata?.enrichedInfo || {};

  // Use Supabase enriched stems if available, otherwise fall back to LingDocs format
  if (enrichedInfo.psp || entry.psp) {
    variants.push({
      form: enrichedInfo.psp || entry.psp,
      label: 'Present Stem',
      pos: 'verb',
      romanized: enrichedInfo.psf || entry.psf,
      flags: ['stem'],
    });
  }

  if (enrichedInfo.ssp || entry.ssp) {
    variants.push({
      form: enrichedInfo.ssp || entry.ssp,
      label: 'Subjunctive Stem',
      pos: 'verb',
      romanized: enrichedInfo.ssf || entry.ssf,
      flags: ['stem'],
    });
  }

  if (enrichedInfo.pprtp || entry.pprtp) {
    variants.push({
      form: enrichedInfo.pprtp || entry.pprtp,
      label: 'Past Participle',
      pos: 'verb',
      romanized: enrichedInfo.pprtf || entry.pprtf,
      flags: ['participle'],
    });
  }

  // Add any additional stems from enriched info that aren't already covered
  if (enrichedInfo.tppp && !enrichedInfo.pprtp) {
    variants.push({
      form: enrichedInfo.tppp,
      label: 'Past Participle (alt)',
      pos: 'verb',
      romanized: enrichedInfo.tppf,
      flags: ['participle'],
    });
  }
  
  // 4. FALLBACK: If we have very few forms, generate using patterns
  // ALWAYS generate if we have less than 20 forms (to ensure comprehensive coverage)
  console.log(`📊 Found ${variants.length} forms for "${rootOrInfinitive}" from database`);

  if (variants.length < 20) {
    console.log(`⚠️ Only ${variants.length} forms found, generating pattern-based forms...`);
    try {
      const patternForms = generatePatternBasedVerbForms(entry.p, enrichedInfo, entry);
      console.log(`🔧 Pattern generation for "${entry.p}" created ${patternForms.length} forms:`, patternForms.map(f => f.form));
      variants.push(...patternForms);
      console.log(`✅ Added ${patternForms.length} pattern-based forms, total now: ${variants.length}`);
    } catch (error) {
      console.error(`❌ Pattern generation failed for "${rootOrInfinitive}":`, error);
    }
  } else {
    console.log(`✅ Database has sufficient forms (${variants.length}), skipping pattern generation`);
  }
  
  // 5. De-duplicate and sort by frequency
  const uniqueVariants = deduplicateVariants(variants);
  const sorted = uniqueVariants.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  
  return sorted.slice(0, cap);
}

/**
 * Generate basic verb forms using Pashto conjugation patterns
 * This is a fallback when database inflection data is incomplete
 */
function generatePatternBasedVerbForms(infinitive: string, enrichedInfo?: Record<string, any>, entry?: any): Variant[] {
  const variants: Variant[] = [];

  const raw = infinitive.trim();
  if (!raw) return variants;

  const segments = raw.split(/\s+/);
  const helperCandidate = segments[segments.length - 1];
  const hasPrefix = segments.length > 1 && COMPOUND_HELPERS.has(helperCandidate);
  const prefix = hasPrefix ? `${segments.slice(0, -1).join(' ')} ` : '';
  const helperInfinitive = hasPrefix ? helperCandidate : raw;

  // Determine if verb is transitive or intransitive based on Pashto grammar rules
  const isTransitive = determineTransitivity(infinitive, enrichedInfo);
  console.log(`🔍 Verb "${infinitive}" classified as ${isTransitive ? 'transitive' : 'intransitive'}`);

  // Detect if verb has separable prefixes (split head)
  const separableInfo = detectSeparableVerb(infinitive, enrichedInfo);
  console.log(`🔍 Verb "${infinitive}" separable: ${separableInfo.isSeparable}, prefix: ${separableInfo.prefix}, stem: ${separableInfo.stem}`);

  // Check for intransitive compound verb pattern (like نومېدل)
  const compoundIntransitivePattern = /^([^\s]+)ېدل$/;
  const compoundMatch = infinitive.match(compoundIntransitivePattern);

  let base = '';
  let isCompoundIntransitive = false;

  if (compoundMatch && !isTransitive) {
    base = compoundMatch[1];
    isCompoundIntransitive = true;
    console.log(`🔍 Detected intransitive compound verb: "${infinitive}" with base "${base}"`);
  }

  // Use present stem from enriched data or synthetic entry, otherwise derive from helper infinitive
  const presentStem = enrichedInfo?.psp || (entry as any)?.present_stem;
  let finalPresentStem = '';

  if (presentStem && !hasPrefix) {
    finalPresentStem = presentStem;
  } else if (isCompoundIntransitive) {
    // For intransitive compound verbs like نومېدل, the present stem is base + ېږـ
    finalPresentStem = base + 'ېږ';
  } else {
    finalPresentStem = helperInfinitive.replace(/ل$/, '');
  }

  if (!finalPresentStem) return variants;

  // Use past participle stem from enriched data or synthetic entry, otherwise use helper infinitive
  const pastStem = enrichedInfo?.tppp || (entry as any)?.past_participle;
  let finalPastStem = '';

  if (pastStem && !hasPrefix) {
    finalPastStem = pastStem;
  } else if (isCompoundIntransitive) {
    // For intransitive compound verbs, past participle is base + ېدلی
    finalPastStem = base + 'ېدل';
  } else {
    finalPastStem = helperInfinitive;
  }

  // Present tense endings
  const presentEndings = [
    { ending: 'م', label: '1sg Present', person: '1st', number: 'sg' },
    { ending: 'ې', label: '2sg Present', person: '2nd', number: 'sg' },
    { ending: 'ي', label: '3sg Present', person: '3rd', number: 'sg' },
    { ending: 'و', label: '1pl Present', person: '1st', number: 'pl' },
    { ending: 'ئ', label: '2pl Present', person: '2nd', number: 'pl' },
    { ending: 'ي', label: '3pl Present', person: '3rd', number: 'pl' },
  ];

  // Add present tense forms
  for (const { ending, label } of presentEndings) {
    const baseFlags = hasPrefix ? ['generated', 'present', 'compound', 'imperfective'] : ['generated', 'present', 'imperfective'];
    const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
    variants.push({
      form: `${prefix}${finalPresentStem}${ending}`.trim(),
      label,
      pos: 'verb',
      flags: [...baseFlags, transitivityFlag],
    });
  }

  // Subjunctive
  for (const { ending, label } of presentEndings) {
    let form = '';
    let baseFlags: string[] = [];

    if (isCompoundIntransitive) {
      // For intransitive compound verbs, subjunctive is و + present stem + endings
      form = `${prefix}و${finalPresentStem}${ending}`.trim();
      baseFlags = ['generated', 'subjunctive', 'compound', 'intransitive', 'imperfective'];
    } else if (hasPrefix) {
      form = `${prefix}و${finalPresentStem}${ending}`.trim();
      baseFlags = ['generated', 'subjunctive', 'compound', 'imperfective'];
    } else {
      form = `${prefix}و${finalPresentStem}${ending}`.trim();
      baseFlags = ['generated', 'subjunctive', 'imperfective'];
    }

    const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
    variants.push({
      form,
      label: label.replace('Present', 'Subjunctive'),
      pos: 'verb',
      flags: [...baseFlags, transitivityFlag],
    });
  }

  // Past tense
  const pastEndings = [
    { ending: 'م', label: '1sg Past' },
    { ending: 'ې', label: '2sg Past' },
    { ending: '', label: '3sg Past' },
    { ending: 'و', label: '1pl Past' },
    { ending: 'ئ', label: '2pl Past' },
    { ending: 'ل', label: '3pl Past' },
  ];

  for (const { ending, label } of pastEndings) {
    let form = '';
    let baseFlags: string[] = [];

    if (isCompoundIntransitive) {
      // For intransitive compound verbs, past is past participle + endings
      form = `${prefix}${finalPastStem}${ending}`.trim();
      baseFlags = ['generated', 'past', 'compound', 'intransitive', 'perfective'];
    } else if (hasPrefix) {
      form = `${prefix}${finalPastStem}${ending}`.trim();
      baseFlags = ['generated', 'past', 'compound', 'perfective'];
    } else {
      form = `${prefix}${finalPastStem}${ending}`.trim();
      baseFlags = ['generated', 'past', 'perfective'];
    }

    const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
    variants.push({
      form,
      label,
      pos: 'verb',
      flags: [...baseFlags, transitivityFlag],
    });
  }

  // Imperative (2nd person)
  let imperativeFlags: string[] = [];
  if (isCompoundIntransitive) {
    imperativeFlags = ['generated', 'imperative', 'compound', 'intransitive'];
  } else if (hasPrefix) {
    imperativeFlags = ['generated', 'imperative', 'compound'];
  } else {
    imperativeFlags = ['generated', 'imperative'];
  }
  const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';

  variants.push({
    form: `${prefix}${finalPresentStem}ه`.trim(),
    label: '2sg Imperative',
    pos: 'verb',
    flags: [...imperativeFlags, transitivityFlag],
  });

  variants.push({
    form: `${prefix}${finalPresentStem}ئ`.trim(),
    label: '2pl Imperative',
    pos: 'verb',
    flags: [...imperativeFlags, transitivityFlag],
  });

  // Past participle
  let participleFlags: string[] = [];
  if (isCompoundIntransitive) {
    // For intransitive compound verbs, past participle is base + ېدلی
    const participleForm = `${prefix}${base}ېدلی`.trim();
    participleFlags = ['generated', 'participle', 'compound', 'intransitive', 'perfective'];
    variants.push({
      form: participleForm,
      label: 'Past Participle',
      pos: 'verb',
      flags: [...participleFlags, transitivityFlag],
    });
  } else {
    // Standard past participle
    const participleForm = `${prefix}${finalPastStem}لی`.trim();
    participleFlags = hasPrefix ? ['generated', 'participle', 'compound', 'perfective'] : ['generated', 'participle', 'perfective'];
    variants.push({
      form: participleForm,
      label: 'Past Participle',
      pos: 'verb',
      flags: [...participleFlags, transitivityFlag],
    });
  }

  // Generate split-head forms for separable verbs
  if (separableInfo.isSeparable && separableInfo.prefix && separableInfo.stem) {
    console.log(`🔧 Generating split-head forms for "${infinitive}"`);
    
    // Add split-head present forms (prefix separated)
    for (const { ending, label } of presentEndings) {
      const baseFlags = ['generated', 'present', 'split-head', 'imperfective'];
      const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
      variants.push({
        form: `${separableInfo.prefix} ${separableInfo.stem.replace(/ل$/, '')}${ending}`.trim(),
        label: `${label} (Split Head)`,
        pos: 'verb',
        flags: [...baseFlags, transitivityFlag],
      });
    }

    // Add split-head subjunctive forms
    for (const { ending, label } of presentEndings) {
      const baseFlags = ['generated', 'subjunctive', 'split-head', 'imperfective'];
      const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
      variants.push({
        form: `${separableInfo.prefix} و${separableInfo.stem.replace(/ل$/, '')}${ending}`.trim(),
        label: `${label.replace('Present', 'Subjunctive')} (Split Head)`,
        pos: 'verb',
        flags: [...baseFlags, transitivityFlag],
      });
    }

    // Add split-head past forms
    for (const { ending, label } of pastEndings) {
      const baseFlags = ['generated', 'past', 'split-head', 'perfective'];
      const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
      variants.push({
        form: `${separableInfo.prefix} ${separableInfo.stem}${ending}`.trim(),
        label: `${label} (Split Head)`,
        pos: 'verb',
        flags: [...baseFlags, transitivityFlag],
      });
    }

    // Add split-head imperative forms
    const imperativeFlags = ['generated', 'imperative', 'split-head'];
    const transitivityFlag = isTransitive ? 'transitive' : 'intransitive';
    
    variants.push({
      form: `${separableInfo.prefix} ${separableInfo.stem.replace(/ل$/, '')}ه`.trim(),
      label: '2sg Imperative (Split Head)',
      pos: 'verb',
      flags: [...imperativeFlags, transitivityFlag],
    });

    variants.push({
      form: `${separableInfo.prefix} ${separableInfo.stem.replace(/ل$/, '')}ئ`.trim(),
      label: '2pl Imperative (Split Head)',
      pos: 'verb',
      flags: [...imperativeFlags, transitivityFlag],
    });

    console.log(`✅ Generated split-head forms for "${infinitive}"`);
  }

  return variants;
}

/**
 * De-duplicate variants by form
 */
function deduplicateVariants(variants: Variant[]): Variant[] {
  const seen = new Set<string>();
  const unique: Variant[] = [];
  
  for (const variant of variants) {
    if (!seen.has(variant.form)) {
      seen.add(variant.form);
      unique.push(variant);
    }
  }
  
  return unique;
}

/**
 * Convert category info to readable label
 */
function labelFromInfo(info?: string): string {
  if (!info) return 'Form';
  
  const s = info.toLowerCase();

  let baseLabel = '';

  // Present tense
  if (s.includes('present')) {
    if (s.includes('1sg') || (s.includes('1st') && s.includes('sg'))) baseLabel = '1sg Present';
    else if (s.includes('2sg') || (s.includes('2nd') && s.includes('sg'))) baseLabel = '2sg Present';
    else if (s.includes('3sg') || (s.includes('3rd') && s.includes('sg'))) baseLabel = '3sg Present';
    else if (s.includes('1pl') || (s.includes('1st') && s.includes('pl'))) baseLabel = '1pl Present';
    else if (s.includes('2pl') || (s.includes('2nd') && s.includes('pl'))) baseLabel = '2pl Present';
    else if (s.includes('3pl') || (s.includes('3rd') && s.includes('pl'))) baseLabel = '3pl Present';
    else if (s.includes('pl')) baseLabel = 'Plural Present';
    else baseLabel = 'Present';
  }
  
  // Past tense
  if (!baseLabel && s.includes('past')) {
    if (s.includes('participle')) baseLabel = 'Past Participle';
    else if (s.includes('1sg')) baseLabel = '1sg Past';
    else if (s.includes('2sg')) baseLabel = '2sg Past';
    else if (s.includes('3sg')) baseLabel = '3sg Past';
    else if (s.includes('pl')) baseLabel = 'Plural Past';
    else baseLabel = 'Past';
  }
  
  // Other tenses
  if (!baseLabel) {
    if (s.includes('subj')) baseLabel = 'Subjunctive';
    else if (s.includes('future')) baseLabel = 'Future';
    else if (s.includes('imperative')) baseLabel = 'Imperative';
    else if (s.includes('progressive')) baseLabel = 'Progressive';
    else if (s.includes('perfect')) baseLabel = 'Perfect';
  }

  if (!baseLabel) baseLabel = info;

  // Aspect hints
  const hasImperfective = /imperfective|imperf|present/i.test(info);
  const hasPerfective = /perfective|perf|past_participle|past/i.test(info) && !/imperfective|imperf/i.test(info);

  if (hasImperfective && !baseLabel.toLowerCase().includes('imperfective')) {
    baseLabel = baseLabel.includes('(')
      ? `${baseLabel}, Imperfective`
      : `${baseLabel} (Imperfective)`;
  }

  if (hasPerfective && !baseLabel.toLowerCase().includes('perfective')) {
    baseLabel = baseLabel.includes('(')
      ? `${baseLabel}, Perfective`
      : `${baseLabel} (Perfective)`;
  }

  return baseLabel;
}

/**
 * Enhanced noun variant generation
 */
export async function generateEnhancedNounVariants(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 50));
  
  console.log(`🔍 generateEnhancedNounVariants called for "${rootOrLemma}"`);
  
  // Check for enriched metadata from Supabase
  const enrichedMetadata = await getEnrichedMetadata(rootOrLemma);
  console.log(`📊 Noun enriched metadata for "${rootOrLemma}":`, {
    pattern: enrichedMetadata?.inflectionPattern,
    category: enrichedMetadata?.linguisticCategory,
    hasInflections: Object.keys(enrichedMetadata?.enrichedInfo || {}).length > 0
  });

  const entry = await convertToLingDocsEntry(rootOrLemma);
  console.log(`🔍 convertToLingDocsEntry result for "${rootOrLemma}":`, entry ? 'found' : 'not found');
  if (!entry) return [];

  const variants: Variant[] = [];
  const data = await getData();
  const inflectMap = (data as any).inflectionsByBase || new Map();
  const freqMap = data.frequencyMap;
  const inflRows = inflectMap?.get(entry.p) || [];

  // Use enriched inflections if available
  const enrichedInfo = enrichedMetadata?.enrichedInfo || {};

  // Add base form
  variants.push({
    form: entry.p,
    label: 'Direct',
    pos: 'noun',
    romanized: entry.f,
    count: freqMap?.get(entry.p) ?? 0,
    score: freqMap?.get(entry.p) ?? 0,
  });

  // Add enriched inflections (from Supabase metadata)
  if (enrichedInfo.infap) {
    variants.push({
      form: enrichedInfo.infap,
      label: '1st Inflection',
      pos: 'noun',
      romanized: enrichedInfo.infaf,
      count: freqMap?.get(enrichedInfo.infap) ?? 0,
      score: freqMap?.get(enrichedInfo.infap) ?? 0,
      flags: ['enriched'],
    });
  }

  if (enrichedInfo.infbp) {
    variants.push({
      form: enrichedInfo.infbp,
      label: '2nd Inflection',
      pos: 'noun',
      romanized: enrichedInfo.infbf,
      count: freqMap?.get(enrichedInfo.infbp) ?? 0,
      score: freqMap?.get(enrichedInfo.infbp) ?? 0,
      flags: ['enriched'],
    });
  }

  // Add database inflections
  for (const row of inflRows) {
    if (!row.form) continue;

    variants.push({
      form: row.form,
      label: labelFromNounInfo(row.category),
      pos: 'noun',
      romanized: row.romanization,
      count: freqMap?.get(row.form) ?? 0,
      score: freqMap?.get(row.form) ?? 0,
    });
  }

    // Generate Pattern 1 Basic inflections for masculine words ending in consonants
    console.log(`🔍 Pattern 1 masculine check for "${entry.p}": variants.length=${variants.length}, endsWith consonant=${!entry.p.endsWith('ه') && !entry.p.endsWith('ی') && !entry.p.endsWith('ې') && !entry.p.endsWith('و')}`);
    if (variants.length <= 3 && !entry.p.endsWith('ه') && !entry.p.endsWith('ی') && !entry.p.endsWith('ې') && !entry.p.endsWith('و')) {
      console.log(`🔧 Generating Pattern 1 masculine inflections for "${entry.p}" in LingDocs adapter`);
      
      // Pattern 1: Basic masculine (اتفاق, کور, برګ)
      const pattern1Forms = [
        { form: entry.p, label: "Plain", pos: "noun" },           // اتفاق
        { form: entry.p, label: "1st Inflection", pos: "noun" },  // اتفاق
        { form: entry.p + 'و', label: "2nd Inflection", pos: "noun" }, // اتفاقو
        { form: entry.p + 'ونه', label: "Plural", pos: "noun" },       // اتفاقونه
        { form: entry.p + 'ونو', label: "2nd Inflection", pos: "noun" }, // اتفاقونو
        { form: entry.p + 'ه', label: "Vocative", pos: "noun" },       // اتفاقه
        { form: entry.p + 'و', label: "Plur. Voc.", pos: "noun" },     // اتفاقو
        { form: entry.p + 'ه', label: "Bundled Plural", pos: "noun" }, // اتفاقه
        { form: entry.p + 'و', label: "Bundled 2nd Inf.", pos: "noun" }, // اتفاقو
      ];
    
      for (const form of pattern1Forms) {
        if (!variants.some(v => v.form === form.form)) {
          variants.push({
            form: form.form,
            label: form.label,
            pos: "noun",
            romanized: entry.f,
            count: freqMap?.get(form.form) ?? 0,
            score: freqMap?.get(form.form) ?? 0,
            flags: ['pattern1'],
          });
        }
      }
      console.log(`✅ Generated ${pattern1Forms.length} Pattern 1 masculine forms for "${entry.p}"`);
    }

    // Generate Pattern 1 Basic inflections for feminine words ending in ه
    console.log(`🔍 Pattern 1 feminine check for "${entry.p}": variants.length=${variants.length}, endsWith('ه')=${entry.p.endsWith('ه')}`);
    if (variants.length <= 3 && entry.p.endsWith('ه')) {
      console.log(`🔧 Generating Pattern 1 feminine inflections for "${entry.p}" in LingDocs adapter`);
      const stem = entry.p.slice(0, -1); // Remove final ه
      
      // Pattern 1: Basic feminine (اندازه, کور, ښځه)
      const pattern1Forms = [
        { form: entry.p, label: "Plain", pos: "noun" },           // اندازه
        { form: stem + 'ې', label: "1st Inflection", pos: "noun" },  // اندازې
        { form: stem + 'و', label: "2nd Inflection", pos: "noun" }, // اندازو
        { form: stem + 'ې', label: "Vocative", pos: "noun" },       // اندازې (vocative)
      ];
    
      for (const form of pattern1Forms) {
        if (!variants.some(v => v.form === form.form)) {
          variants.push({
            form: form.form,
            label: form.label,
            pos: "noun",
            romanized: entry.f,
            count: freqMap?.get(form.form) ?? 0,
            score: freqMap?.get(form.form) ?? 0,
            flags: ['pattern1'],
          });
        }
      }
      console.log(`✅ Generated ${pattern1Forms.length} Pattern 1 feminine forms for "${entry.p}"`);
    }

  // Generate Pattern 3 stressed áy inflections if we have few forms
  console.log(`🔍 Pattern 3 check for "${entry.p}": variants.length=${variants.length}, endsWith('ی')=${entry.p.endsWith('ی')}`);
  if (variants.length <= 3 && entry.p.endsWith('ی')) {
    console.log(`🔧 Generating Pattern 3 inflections for "${entry.p}" in LingDocs adapter`);
    const stem = entry.p.slice(0, -1); // Remove final ی
    
    // Pattern 3: Stressed ی - áy (سوری, ځلمی, لومړی)
    const pattern3Forms = [
      { form: entry.p, label: "Plain", pos: "noun" },           // سوری
      { form: stem + 'ي', label: "1st Inflection", pos: "noun" },  // سوري
      { form: stem + 'یو', label: "2nd Inflection", pos: "noun" }, // سوریو
      { form: stem + 'یه', label: "Vocative", pos: "noun" },       // سوریه
    ];

    for (const form of pattern3Forms) {
      if (!variants.some(v => v.form === form.form)) {
        variants.push({
          form: form.form,
          label: form.label,
          pos: "noun",
          romanized: entry.f,
          count: freqMap?.get(form.form) ?? 0,
          score: freqMap?.get(form.form) ?? 0,
          flags: ['pattern3'],
        });
      }
    }
    console.log(`✅ Generated ${pattern3Forms.length} Pattern 3 forms for "${entry.p}"`);
  }
  
  const unique = deduplicateVariants(variants);
  const sorted = unique.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
  
  return sorted.slice(0, cap);
}

/**
 * Convert noun category to label
 */
function labelFromNounInfo(info?: string): string {
  if (!info) return 'Form';
  
  const s = info.toLowerCase();
  
  if (s.includes('plural') && s.includes('oblique')) return 'Plural Oblique';
  if (s.includes('plural')) return 'Plural';
  if (s.includes('oblique')) return 'Oblique';
  if (s.includes('vocative')) return 'Vocative';
  
  return info;
}

export type { Variant };

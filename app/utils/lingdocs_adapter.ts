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
      const patternForms = generatePatternBasedVerbForms(entry.p, enrichedInfo);
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
function generatePatternBasedVerbForms(infinitive: string, enrichedInfo?: Record<string, any>): Variant[] {
  const variants: Variant[] = [];

  const raw = infinitive.trim();
  if (!raw) return variants;

  const segments = raw.split(/\s+/);
  const helperCandidate = segments[segments.length - 1];
  const hasPrefix = segments.length > 1 && COMPOUND_HELPERS.has(helperCandidate);
  const prefix = hasPrefix ? `${segments.slice(0, -1).join(' ')} ` : '';
  const helperInfinitive = hasPrefix ? helperCandidate : raw;

  // Use present stem from enriched data if the helper matches, otherwise derive from helper infinitive
  const presentStem = enrichedInfo?.psp && !hasPrefix
    ? enrichedInfo.psp
    : helperInfinitive.replace(/ل$/, '');

  if (!presentStem) return variants;

  // Use past participle stem from enriched data if available, otherwise use helper infinitive
  const pastStem = enrichedInfo?.tppp && !hasPrefix ? enrichedInfo.tppp : helperInfinitive;

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
    variants.push({
      form: `${prefix}${presentStem}${ending}`.trim(),
      label,
      pos: 'verb',
      flags: hasPrefix ? ['generated', 'present', 'compound', 'imperfective'] : ['generated', 'present', 'imperfective'],
    });
  }

  // Subjunctive (prefix و-)
  for (const { ending, label } of presentEndings) {
    variants.push({
      form: `${prefix}و${presentStem}${ending}`.trim(),
      label: label.replace('Present', 'Subjunctive'),
      pos: 'verb',
      flags: hasPrefix ? ['generated', 'subjunctive', 'compound', 'imperfective'] : ['generated', 'subjunctive', 'imperfective'],
    });
  }

  // Past tense (use past participle stem if available, otherwise infinitive)
  const pastEndings = [
    { ending: 'م', label: '1sg Past' },
    { ending: 'ې', label: '2sg Past' },
    { ending: '', label: '3sg Past' },
    { ending: 'و', label: '1pl Past' },
    { ending: 'ئ', label: '2pl Past' },
    { ending: 'ل', label: '3pl Past' },
  ];

  for (const { ending, label } of pastEndings) {
    variants.push({
      form: `${prefix}${pastStem}${ending}`.trim(),
      label,
      pos: 'verb',
      flags: hasPrefix ? ['generated', 'past', 'compound', 'perfective'] : ['generated', 'past', 'perfective'],
    });
  }

  // Imperative (2nd person)
  variants.push({
    form: `${prefix}${presentStem}ه`.trim(),
    label: '2sg Imperative',
    pos: 'verb',
    flags: hasPrefix ? ['generated', 'imperative', 'compound'] : ['generated', 'imperative'],
  });

  variants.push({
    form: `${prefix}${presentStem}ئ`.trim(),
    label: '2pl Imperative',
    pos: 'verb',
    flags: hasPrefix ? ['generated', 'imperative', 'compound'] : ['generated', 'imperative'],
  });

  // Past participle (common pattern)
  variants.push({
    form: `${prefix}${pastStem}لی`.trim(),
    label: 'Past Participle',
    pos: 'verb',
    flags: hasPrefix ? ['generated', 'participle', 'compound', 'perfective'] : ['generated', 'participle', 'perfective'],
  });

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

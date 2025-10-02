/**
 * LingDocs Adapter - Practical Integration
 * 
 * This adapter provides a simpler way to use LingDocs functionality
 * by importing the TypeScript source directly (no build required).
 */

import { getData } from '../lib/data/load';
import type { Variant } from './verb_variants';

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
  
  // Try to find by Pashto text
  let entry = dictionary.find((d: any) => 
    d.pashto?.toLowerCase() === pashtoWord.toLowerCase()
  );
  
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
  
  const variants: Variant[] = [];
  
  // 1. Add base infinitive
  variants.push({
    form: entry.p,
    label: 'Infinitive',
    pos: 'verb',
    romanized: entry.f,
  });
  
  // 2. Use your existing inflections data
  const { inflectMap, freqMap } = await getData();
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
  
  // 3. Add stems if available (from LingDocs-format entry)
  if (entry.psp) {
    variants.push({
      form: entry.psp,
      label: 'Present Stem',
      pos: 'verb',
      romanized: entry.psf,
      flags: ['stem'],
    });
  }
  
  if (entry.ssp) {
    variants.push({
      form: entry.ssp,
      label: 'Subjunctive Stem',
      pos: 'verb',
      romanized: entry.ssf,
      flags: ['stem'],
    });
  }
  
  if (entry.pprtp) {
    variants.push({
      form: entry.pprtp,
      label: 'Past Participle',
      pos: 'verb',
      romanized: entry.pprtf,
      flags: ['participle'],
    });
  }
  
  // 4. FALLBACK: If we have very few forms, generate using patterns
  if (variants.length < 10) {
    console.log(`⚠️ Only ${variants.length} forms found for "${rootOrInfinitive}", generating pattern-based forms...`);
    const patternForms = generatePatternBasedVerbForms(entry.p);
    variants.push(...patternForms);
    console.log(`✅ Added ${patternForms.length} pattern-based forms, total now: ${variants.length}`);
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
function generatePatternBasedVerbForms(infinitive: string): Variant[] {
  const variants: Variant[] = [];
  
  // Strip final ل from infinitive to get base stem
  const stem = infinitive.replace(/ل$/, '');
  
  if (!stem) return [];
  
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
      form: `${stem}${ending}`,
      label,
      pos: 'verb',
      flags: ['generated', 'present'],
    });
  }
  
  // Subjunctive (prefix و-)
  for (const { ending, label } of presentEndings) {
    variants.push({
      form: `و${stem}${ending}`,
      label: label.replace('Present', 'Subjunctive'),
      pos: 'verb',
      flags: ['generated', 'subjunctive'],
    });
  }
  
  // Past tense (infinitive + past endings)
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
      form: `${infinitive}${ending}`,
      label,
      pos: 'verb',
      flags: ['generated', 'past'],
    });
  }
  
  // Imperative (2nd person)
  variants.push({
    form: `${stem}ه`,
    label: '2sg Imperative',
    pos: 'verb',
    flags: ['generated', 'imperative'],
  });
  
  variants.push({
    form: `${stem}ئ`,
    label: '2pl Imperative',
    pos: 'verb',
    flags: ['generated', 'imperative'],
  });
  
  // Past participle (common pattern)
  variants.push({
    form: `${infinitive}ی`,
    label: 'Past Participle',
    pos: 'verb',
    flags: ['generated', 'participle'],
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
  
  // Present tense
  if (s.includes('present')) {
    if (s.includes('1sg') || s.includes('1st') && s.includes('sg')) return '1sg Present';
    if (s.includes('2sg') || s.includes('2nd') && s.includes('sg')) return '2sg Present';
    if (s.includes('3sg') || s.includes('3rd') && s.includes('sg')) return '3sg Present';
    if (s.includes('1pl') || s.includes('1st') && s.includes('pl')) return '1pl Present';
    if (s.includes('2pl') || s.includes('2nd') && s.includes('pl')) return '2pl Present';
    if (s.includes('3pl') || s.includes('3rd') && s.includes('pl')) return '3pl Present';
    if (s.includes('pl')) return 'Plural Present';
    return 'Present';
  }
  
  // Past tense
  if (s.includes('past')) {
    if (s.includes('participle')) return 'Past Participle';
    if (s.includes('1sg')) return '1sg Past';
    if (s.includes('2sg')) return '2sg Past';
    if (s.includes('3sg')) return '3sg Past';
    if (s.includes('pl')) return 'Plural Past';
    return 'Past';
  }
  
  // Other tenses
  if (s.includes('subj')) return 'Subjunctive';
  if (s.includes('future')) return 'Future';
  if (s.includes('imperative')) return 'Imperative';
  if (s.includes('progressive')) return 'Progressive';
  if (s.includes('perfect')) return 'Perfect';
  
  return info;
}

/**
 * Enhanced noun variant generation
 */
export async function generateEnhancedNounVariants(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 50));
  
  const entry = await convertToLingDocsEntry(rootOrLemma);
  if (!entry) return [];
  
  const variants: Variant[] = [];
  const { inflectMap, freqMap } = await getData();
  const inflRows = inflectMap?.get(entry.p) || [];
  
  // Add base form
  variants.push({
    form: entry.p,
    label: 'Direct',
    pos: 'noun',
    romanized: entry.f,
  });
  
  // Add inflections
  for (const row of inflRows) {
    if (!row.form) continue;
    
    variants.push({
      form: row.form,
      label: labelFromNounInfo(row.category),
      pos: 'noun',
      romanized: row.romanization,
      count: freqMap?.get(row.form) ?? 0,
    });
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

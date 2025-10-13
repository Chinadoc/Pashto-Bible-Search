/**
 * LingDocs Integration Layer
 *
 * This module provides a bridge between your Pashto Bible Search
 * and the professional LingDocs inflection engine.
 *
 * Benefits:
 * - Linguistically accurate verb conjugation
 * - Dynamic inflection generation (no static tables needed)
 * - Handles irregular verbs, compounds, stative/dynamic
 * - Professional-grade quality
 */

import type { Variant } from './verb_variants';

// Import the actual LingDocs library from the built distribution
// Use dynamic import to avoid bundling issues
let LingDocsLibrary: any = null;

async function loadLingDocsLibrary() {
  if (LingDocsLibrary) return LingDocsLibrary;

  try {
    LingDocsLibrary = await import('../../pashto-inflector/src/lib/dist/lib/library.cjs');
    console.log('✅ LingDocs library loaded successfully');
    return LingDocsLibrary;
  } catch (error) {
    console.error('❌ Failed to load LingDocs library:', error);
    throw error;
  }
}

// Type definitions for LingDocs
interface LingDocsEntry {
  p: string;
  f: string;
  g: string;
  e: string;
  c?: string;
  ts?: number;
  i?: number;
}

interface LingDocsVerbConjugation {
  info?: any;
  present?: any;
  subjunctive?: any;
  past?: any;
  participle?: any;
  perfect?: any;
  hypothetical?: any;
  passive?: any;
}

/**
 * Convert LingDocs verb conjugation to our Variant format
 */
function lingDocsConjugationToVariants(
  conjugation: LingDocsVerbConjugation,
  baseForm: string
): Variant[] {
  const variants: Variant[] = [];

  console.log(`🔄 Converting LingDocs conjugation for "${baseForm}"`);

  // Add base form
  variants.push({
    form: baseForm,
    label: 'Infinitive',
    pos: 'verb',
    count: 0,
    score: 0,
  });

  // Extract ability forms (present and subjunctive modal)
  if (conjugation.imperfective && conjugation.imperfective.length > 1) {
    const imperfectiveBlock = conjugation.imperfective[1]; // VB + Modal
    if (imperfectiveBlock && imperfectiveBlock.length >= 2) {
      const abilityVb = imperfectiveBlock[0]; // Ability VB
      const modalVb = imperfectiveBlock[1]; // Modal VB

      if (abilityVb && abilityVb.ps && modalVb && modalVb.ps) {
        // Combine ability VB with modal endings
        const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

        persons.forEach((person, index) => {
          if (modalVb.ps[person] && modalVb.ps[person].p) {
            const modalEnding = modalVb.ps[person].p;
            variants.push({
              form: `${abilityVb.ps.long?.[0]?.p || abilityVb.ps.short?.[0]?.p || 'ABILITY'}${modalEnding}`,
              label: `Present Ability ${person}`,
              pos: 'verb',
              flags: ['ability', 'present'],
              count: 0,
              score: 0,
            });
          }
        });
      }
    }
  }

  // Extract regular present tense forms
  if (conjugation.imperfective && conjugation.imperfective.length > 0) {
    const presentVb = conjugation.imperfective[0]; // Regular present VB
    if (presentVb && presentVb.ps) {
      const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

      persons.forEach((person) => {
        if (presentVb.ps[person] && presentVb.ps[person].p) {
          variants.push({
            form: presentVb.ps[person].p,
            label: `${person} Present`,
            pos: 'verb',
            flags: ['present', 'indicative'],
            count: 0,
            score: 0,
          });
        }
      });
    }
  }

  // Extract past tense forms
  if (conjugation.perfective && conjugation.perfective.length > 0) {
    const pastVb = conjugation.perfective[0]; // Regular past VB
    if (pastVb && pastVb.ps) {
      const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

      persons.forEach((person) => {
        if (pastVb.ps[person] && pastVb.ps[person].p) {
          variants.push({
            form: pastVb.ps[person].p,
            label: `${person} Past`,
            pos: 'verb',
            flags: ['past', 'indicative'],
            count: 0,
            score: 0,
          });
        }
      });
    }
  }

  // Extract participles
  if (conjugation.participle) {
    const participle = conjugation.participle;
    if (participle.past && participle.past.p) {
      variants.push({
        form: participle.past.p,
        label: 'Past Participle',
        pos: 'verb',
        romanized: participle.past.f,
        flags: ['participle', 'past'],
        count: 0,
        score: 0,
      });
    }
    if (participle.present && participle.present.p) {
      variants.push({
        form: participle.present.p,
        label: 'Present Participle',
        pos: 'verb',
        romanized: participle.present.f,
        flags: ['participle', 'present'],
        count: 0,
        score: 0,
      });
    }
  }

  console.log(`✅ Converted ${variants.length} LingDocs variants for "${baseForm}"`);
  return variants;
}


/**
 * Generate verb variants using LingDocs engine
 *
 * @param rootOrInfinitive - Pashto verb root or infinitive
 * @param opts - Options for generation
 * @returns Array of verb variants
 */
export async function generateVerbVariantsLingDocs(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  try {
    // Load the LingDocs library
    const LingDocs = await loadLingDocsLibrary();

    // Create a proper LingDocs entry for the verb
    const dictEntry: LingDocsEntry = {
      p: rootOrInfinitive,
      f: rootOrInfinitive, // Use same as Pashto for now
      g: rootOrInfinitive,
      e: 'verb', // English meaning not needed for conjugation
      c: 'v.',
      ts: Date.now(),
      i: 0
    };

    console.log(`🔍 Attempting LingDocs conjugation for "${rootOrInfinitive}"`);

    // Use the actual LingDocs conjugation function
    const conjugation = LingDocs.conjugateVerb(dictEntry);

    if (!conjugation) {
      console.warn(`❌ LingDocs conjugation failed for "${rootOrInfinitive}"`);
      return [];
    }

    console.log(`✅ LingDocs conjugation successful for "${rootOrInfinitive}", converting to variants`);

    // Convert LingDocs conjugation to our Variant format
    const variants = lingDocsConjugationToVariants(conjugation, rootOrInfinitive);

    if (variants.length === 0) {
      console.warn(`❌ LingDocs returned no variants for "${rootOrInfinitive}"`);
      return [];
    }

    console.log(`✅ LingDocs generated ${variants.length} verb variants for "${rootOrInfinitive}"`);
    return variants.slice(0, opts?.cap ?? 50);

  } catch (error) {
    console.error(`❌ LingDocs verb generation failed for "${rootOrInfinitive}":`, error);
    return [];
  }
}

/**
 * Generate noun variants using LingDocs engine
 *
 * @param rootOrLemma - Pashto noun root or lemma
 * @param opts - Options for generation
 * @returns Array of noun variants
 */
export async function generateNounVariantsLingDocs(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  try {
    console.log(`🚀 LingDocs inflecting noun: "${rootOrLemma}"`);

    // Load the LingDocs library
    const LingDocs = await loadLingDocsLibrary();

    // Create a proper LingDocs entry for the noun
    const dictEntry: LingDocsEntry = {
      p: rootOrLemma,
      f: rootOrLemma, // Use same as Pashto for now
      g: rootOrLemma,
      e: 'noun', // English meaning not needed for inflection
      c: 'n.',
      ts: Date.now(),
      i: 0
    };

    console.log(`🔍 Attempting LingDocs inflection for "${rootOrLemma}"`);

    // Use the actual LingDocs inflection function
    const inflection = LingDocs.inflectWord(dictEntry);

    if (!inflection) {
      console.warn(`❌ LingDocs inflection failed for "${rootOrLemma}"`);
      return [];
    }

    console.log(`✅ LingDocs inflection successful for "${rootOrLemma}", converting to variants`);

    // Convert LingDocs inflection to our Variant format
    const variants = lingDocsInflectionToVariants(inflection, rootOrLemma);

    if (variants.length === 0) {
      console.warn(`❌ LingDocs returned no variants for "${rootOrLemma}"`);
      return [];
    }

    console.log(`✅ LingDocs generated ${variants.length} noun variants for "${rootOrLemma}"`);
    return variants.slice(0, opts?.cap ?? 20);

  } catch (error) {
    console.error(`❌ LingDocs noun generation failed for "${rootOrLemma}":`, error);
    return [];
  }
}

/**
 * Convert LingDocs inflection to our Variant format
 */
function lingDocsInflectionToVariants(
  inflection: any,
  baseForm: string
): Variant[] {
  const variants: Variant[] = [];

  // Add base form
  variants.push({
    form: baseForm,
    label: 'Direct',
    pos: 'noun',
  });

  // Extract all forms from the inflection structure
  if (inflection.bundledPlural) {
    extractFormsFromLingDocs(inflection.bundledPlural, variants);
  }

  if (inflection.plural) {
    extractFormsFromLingDocs(inflection.plural, variants);
  }

  if (inflection.inflections) {
    extractFormsFromLingDocs(inflection.inflections, variants);
  }

  if (inflection.vocative) {
    extractFormsFromLingDocs(inflection.vocative, variants);
  }

  return variants;
}

/**
 * Recursively extract forms from LingDocs nested structure
 */
function extractFormsFromLingDocs(obj: any, variants: Variant[]): void {
  if (!obj) return;

  if (Array.isArray(obj)) {
    obj.forEach(item => extractFormsFromLingDocs(item, variants));
  } else if (typeof obj === 'object' && obj.p && obj.f) {
    // This is a form object with p (pashto) and f (phonetics)
    variants.push({
      form: obj.p,
      label: 'Form',
      pos: 'noun',
      romanized: obj.f || obj.p,
    });
  } else if (typeof obj === 'object') {
    // Recursively search nested objects
    Object.values(obj).forEach(value => extractFormsFromLingDocs(value, variants));
  }
}

/**
 * Test if a word is in Pashto script
 */
export function isPashtoWord(word: string): boolean {
  // Pashto Unicode range: U+0600 to U+06FF (Arabic/Persian) + U+FB50 to U+FDFF (Arabic Presentation Forms)
  const pashtoRegex = /[\u0600-\u06FF\uFB50-\uFDFF]/;
  return pashtoRegex.test(word);
}

/**
 * Normalize Pashto text for search
 */
export function normalizePashtoText(text: string): string {
  // Basic normalization (can be enhanced with LingDocs standardizePashto)
  return text
    .trim()
    .replace(/\u200c/g, '') // Remove zero-width non-joiner
    .replace(/\u200d/g, '') // Remove zero-width joiner
    .replace(/\s+/g, ' '); // Normalize whitespace
}

// Export type for use in other modules
export type { Variant };



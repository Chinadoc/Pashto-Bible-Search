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

// Import LingDocs inflection library from local submodule
// Note: This requires building the submodule first
// Run: cd pashto-inflector/src/lib && npm install && npm run build

import type { Variant } from './verb_variants';

// Type definitions for LingDocs
interface LingDocsEntry {
  ts: number;
  p: string;  // Pashto text
  f: string;  // Phonetics/romanization
  g: string;  // Simplified phonetics
  e: string;  // English meaning
  c?: string; // Part of speech
}

interface LingDocsVerbConjugation {
  info: {
    transitivity: string;
    type: 'simple' | 'stative compound' | 'dynamic compound';
  };
  present?: any;
  subjunctive?: any;
  past?: any;
  participle?: any;
}

/**
 * Convert LingDocs verb conjugation to our Variant format
 */
function lingDocsConjugationToVariants(
  conjugation: LingDocsVerbConjugation,
  baseForm: string
): Variant[] {
  const variants: Variant[] = [];

  // Add base form
  variants.push({
    form: baseForm,
    label: 'Infinitive',
    pos: 'verb',
  });

  // Extract present tense forms
  if (conjugation.present) {
    extractTenseVariants(conjugation.present, 'Present', variants);
  }

  // Extract subjunctive forms
  if (conjugation.subjunctive) {
    extractTenseVariants(conjugation.subjunctive, 'Subjunctive', variants);
  }

  // Extract past tense forms
  if (conjugation.past) {
    extractTenseVariants(conjugation.past, 'Past', variants);
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
      });
    }
    if (participle.present && participle.present.p) {
      variants.push({
        form: participle.present.p,
        label: 'Present Participle',
        pos: 'verb',
        romanized: participle.present.f,
      });
    }
  }

  return variants;
}

/**
 * Extract verb forms from a tense object
 */
function extractTenseVariants(
  tenseObj: any,
  tenseName: string,
  variants: Variant[]
): void {
  if (!tenseObj) return;

  const persons = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
  const genders = ['masc', 'fem'];

  persons.forEach((person) => {
    genders.forEach((gender) => {
      const key = `${person}_${gender}`;
      const form = tenseObj[key];
      
      if (form && form.p) {
        const label = `${person.toUpperCase()} ${tenseName} ${gender === 'masc' ? 'Masc' : 'Fem'}`;
        variants.push({
          form: form.p,
          label,
          pos: 'verb',
          romanized: form.f,
          flags: form.isStative ? ['stative'] : undefined,
        });
      }
    });
  });
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
    // Note: This is a placeholder implementation
    // You'll need to:
    // 1. Build the LingDocs library: cd pashto-inflector/src/lib && npm run build
    // 2. Import the actual functions: import { conjugateVerb } from '../../pashto-inflector/src/lib/dist/lib/library.cjs'
    // 3. Look up the verb in your dictionary
    // 4. Call conjugateVerb(verbEntry)
    // 5. Convert the result to Variant[]

    console.warn('LingDocs integration not yet fully implemented');
    console.warn('To complete integration:');
    console.warn('1. cd pashto-inflector/src/lib && npm install && npm run build');
    console.warn('2. Update this file to import the built library');
    console.warn('3. Connect to your dictionary data');

    // Fallback to current implementation for now
    const { generateVerbVariants } = await import('./verb_variants');
    return generateVerbVariants(rootOrInfinitive, opts);
  } catch (error) {
    console.error('LingDocs verb generation failed:', error);
    // Fallback to current system
    const { generateVerbVariants } = await import('./verb_variants');
    return generateVerbVariants(rootOrInfinitive, opts);
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
    // Similar to verb generation, needs LingDocs library integration
    console.warn('LingDocs noun inflection not yet fully implemented');

    // Fallback to current implementation
    const { generateNounVariants } = await import('./noun_variants');
    return generateNounVariants(rootOrLemma, opts);
  } catch (error) {
    console.error('LingDocs noun generation failed:', error);
    const { generateNounVariants } = await import('./noun_variants');
    return generateNounVariants(rootOrLemma, opts);
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



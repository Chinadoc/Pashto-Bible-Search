/**
 * LingDocs Irregular Conjugations Integration
 * 
 * This module integrates comprehensive irregular verb conjugations from LingDocs
 * pashto-inflector library into our search system.
 * 
 * The LingDocs irregular-conjugations.ts file contains complete VerbConjugation
 * objects with:
 * - Present tense (indicative, subjunctive, imperative)
 * - Perfective tense
 * - Perfect tense  
 * - Past tense
 * - Modal forms (ability, hypothetical)
 * - All person/gender/number combinations
 * 
 * Source: https://github.com/lingdocs/pashto-inflector/blob/main/src/lib/src/irregular-conjugations.ts
 * 
 * NOTE: This file now uses D1 database instead of Supabase
 */

import { D1Client, getD1Database } from '@/utils/d1';

interface VerbForm {
  verb_root: string;
  form: string;
  form_type?: string;
  romanization?: string;
}

/**
 * Get all conjugated forms for ANY verb from verb_forms table
 * This uses the comprehensive LingDocs conjugation data
 * Works for both irregular and regular verbs if they're in the table
 */
export async function getIrregularVerbForms(verbRoot: string): Promise<string[]> {
  const d1Db = getD1Database();
  if (!d1Db) {
    return [];
  }

  try {
    const db = new D1Client(d1Db);
    
    // Query verb_forms table for all forms of this verb
    // Increased limit to get all forms (up to 1000 for comprehensive coverage)
    const data = await db.query<{ form: string }>(
      `SELECT form FROM verb_forms WHERE verb_root = ? LIMIT 1000`,
      [verbRoot]
    );
    
    if (Array.isArray(data) && data.length > 0) {
      const forms = data.map(row => row.form).filter(Boolean);
      return forms;
    }
    
    return [];
  } catch (error) {
    // If table doesn't exist yet, that's okay - fallback to pattern generation
    console.warn(`Error in getIrregularVerbForms (may be normal if table doesn't exist yet):`, error);
    return [];
  }
}

/**
 * Check if a verb is irregular and get its forms
 * Falls back to checking irregular_verbs table if verb_forms doesn't exist
 */
export async function checkIrregularVerb(verbRoot: string): Promise<string[]> {
  // First try verb_forms table (comprehensive LingDocs data)
  const forms = await getIrregularVerbForms(verbRoot);
  if (forms.length > 0) {
    return forms;
  }
  
  // Fallback to irregular_verbs table
  const d1Db = getD1Database();
  if (!d1Db) {
    return [];
  }
  
  try {
    const db = new D1Client(d1Db);
    
    const data = await db.query<{ verb_root: string; roots: string; stems: string; past_participle: string }>(
      `SELECT verb_root, roots, stems, past_participle FROM irregular_verbs WHERE verb_root = ? LIMIT 1`,
      [verbRoot]
    );
    
    if (Array.isArray(data) && data.length > 0) {
      const verb = data[0];
      const forms: string[] = [verbRoot];
      
      let stems: Record<string, any> | undefined
      let roots: Record<string, any> | undefined
      
      try {
        stems = typeof verb.stems === 'string' ? JSON.parse(verb.stems) : verb.stems || {};
        roots = typeof verb.roots === 'string' ? JSON.parse(verb.roots) : verb.roots || {};
      } catch {}
      
      // Add stems
      if (stems?.imperfective) forms.push(stems.imperfective);
      if (stems?.perfective) forms.push(stems.perfective);
      
      // Add roots
      if (roots?.imperfective) forms.push(roots.imperfective);
      if (roots?.perfective) forms.push(roots.perfective);
      
      // Add past participle
      if (verb.past_participle) forms.push(verb.past_participle);
      
      return forms;
    }
    
    return [];
  } catch (error) {
    console.warn(`Error checking irregular verb:`, error);
    return [];
  }
}

/**
 * Get all forms for compound verbs that use irregular auxiliaries
 * e.g., "ښکېل کېدل" uses "کېدل" which is irregular
 */
export async function getCompoundVerbFormsWithIrregularAux(
  compoundVerb: string
): Promise<string[]> {
  const parts = compoundVerb.split(' ');
  if (parts.length !== 2) return [];
  
  const [main, aux] = parts;
  
  // Check if auxiliary is irregular
  const auxForms = await checkIrregularVerb(aux);
  
  if (auxForms.length === 0) return [];
  
  // Generate compound forms with irregular auxiliary conjugations
  const forms: string[] = [compoundVerb];
  
  // For stative compounds with کېدل
  if (aux === 'کېدل') {
    // Add forms like "ښکېل کېږم", "ښکېل شول", etc.
    for (const auxForm of auxForms) {
      if (auxForm === 'کېدل') continue; // Skip infinitive
      if (auxForm.includes('کېږ') || auxForm.startsWith('کېږ')) {
        // Present forms - add both spaced and squished
        const spaced = main + ' ' + auxForm;
        forms.push(spaced);
        // Squished form: ښکېل + کېږم → ښکېلېږم
        if (auxForm.startsWith('کېږ')) {
          forms.push(main + auxForm.substring(1)); // Remove ک and add to main
        }
      } else if (auxForm.includes('ش') || auxForm.includes('وش') || auxForm === 'شول' || auxForm === 'وشول') {
        // Perfective forms
        forms.push(main + ' ' + auxForm);
        if (auxForm.startsWith('وش')) {
          forms.push(main + ' ' + auxForm.substring(1)); // Remove و
        }
      } else if (auxForm === 'شوی' || auxForm === 'شوې' || auxForm === 'شوي') {
        // Past participles
        forms.push(main + ' ' + auxForm);
      }
    }
  }
  
  // For dynamic compounds with کول
  if (aux === 'کول') {
    for (const auxForm of auxForms) {
      if (auxForm === 'کول') continue;
      if (auxForm.includes('کو') || auxForm.includes('وکړ')) {
        forms.push(main + ' ' + auxForm);
        // Squished forms
        if (auxForm.startsWith('کو')) {
          forms.push(main + auxForm.substring(2)); // Remove کو
        }
      }
    }
  }
  
  return forms.filter(Boolean);
}


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
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface VerbForm {
  verb_root: string;
  form: string;
  form_type?: string;
  romanization?: string;
}

/**
 * Get all conjugated forms for an irregular verb from verb_forms table
 * This uses the comprehensive LingDocs conjugation data
 */
export async function getIrregularVerbForms(verbRoot: string): Promise<string[]> {
  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('verb_forms')
      .select('form')
      .eq('verb_root', verbRoot)
      .limit(500);
    
    if (error) {
      console.warn(`Error fetching irregular verb forms for ${verbRoot}:`, error);
      return [];
    }
    
    if (Array.isArray(data)) {
      return data.map(row => row.form).filter(Boolean);
    }
    
    return [];
  } catch (error) {
    console.warn(`Error in getIrregularVerbForms:`, error);
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
  if (!supabaseUrl || !supabaseKey) {
    return [];
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data } = await supabase
      .from('irregular_verbs')
      .select('verb_root, roots, stems, past_participle')
      .eq('verb_root', verbRoot)
      .limit(1);
    
    if (Array.isArray(data) && data.length > 0) {
      const verb = data[0];
      const forms: string[] = [verbRoot];
      
      // Add stems
      if (verb.stems?.imperfective) forms.push(verb.stems.imperfective);
      if (verb.stems?.perfective) forms.push(verb.stems.perfective);
      
      // Add roots
      if (verb.roots?.imperfective) forms.push(verb.roots.imperfective);
      if (verb.roots?.perfective) forms.push(verb.roots.perfective);
      
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


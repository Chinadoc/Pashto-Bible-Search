/**
 * Process LingDocs dictionary entries and extract structured verb/noun data
 * This script generates data compatible with our D1 database structure
 */

import { Types as T } from '@lingdocs/ps-react';
import { conjugateVerb, inflectWord } from '@lingdocs/ps-react';

interface VerbFormData {
  verb_root: string;
  aspect: 'imperfective' | 'perfective';
  mood: 'nonImperative' | 'imperative';
  length: 'long' | 'short' | null;
  person: number;  // 0-5
  gender: 0 | 1 | null;
  form: string;
  romanization: string | null;
  grammatical_label: string;
}

interface VerbMetadata {
  verb_root: string;
  verb_type: 'regular' | 'stative_compound' | 'dynamic_compound' | 'generative_stative_compound' | 'irregular';
  complement: string | null;
  auxiliary_verb: string | null;
  transitivity: 'transitive' | 'intransitive' | 'grammatically_transitive' | null;
  imperfective_stem: string | null;
  perfective_stem: string | null;
  imperfective_root: string | null;
  perfective_root: string | null;
  past_participle: string | null;
  romanization: string | null;
  conjugation_pattern: string | null;
}

interface NormalizedGrammaticalInfo {
  person: string | null;
  tense: string | null;
  aspect: string | null;
  mood: string | null;
  gender: string | null;
  length: string | null;
  verb_type: string | null;
  participle_type: string | null;
  inflection_type: string | null;
  pos: 'verb' | 'noun' | 'adjective' | 'other';
}

const PERSON_LABELS = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
const GENDER_LABELS = ['Masc', 'Fem'];

/**
 * Extract verb type from LingDocs entry
 */
function extractVerbType(entry: T.VerbDictionaryEntry): VerbMetadata['verb_type'] {
  if (entry.type === 'stative compound' || entry.type === 'generative stative compound') {
    return entry.type === 'generative stative compound' ? 'generative_stative_compound' : 'stative_compound';
  }
  if (entry.type === 'dynamic compound') {
    return 'dynamic_compound';
  }
  if (entry.type === 'irregular') {
    return 'irregular';
  }
  return 'regular';
}

/**
 * Extract complement and auxiliary from compound verb entry
 */
function extractCompoundInfo(entry: T.VerbDictionaryEntry): {
  complement: string | null;
  auxiliary_verb: string | null;
} {
  if (entry.type === 'stative compound' || entry.type === 'generative stative compound') {
    // For stative compounds, complement is in entry.complement or entry.objComplement
    if ('complement' in entry && entry.complement) {
      const comp = entry.complement;
      const complementText = Array.isArray(comp.masc) && comp.masc[0] && Array.isArray(comp.masc[0]) 
        ? comp.masc[0][0].p 
        : '';
      const auxVerb = entry.transitivity === 'transitive' ? 'کول' : 'کېدل';
      return { complement: complementText || null, auxiliary_verb: auxVerb };
    }
    if ('objComplement' in entry && entry.objComplement) {
      const complementText = entry.objComplement.plural?.p || entry.objComplement.entry.p;
      const auxVerb = entry.transitivity === 'transitive' ? 'کول' : 'کېدل';
      return { complement: complementText || null, auxiliary_verb: auxVerb };
    }
  }
  if (entry.type === 'dynamic compound' && 'auxVerb' in entry) {
    return { complement: null, auxiliary_verb: entry.auxVerb.p || null };
  }
  return { complement: null, auxiliary_verb: null };
}

/**
 * Flatten conjugation structure into structured form data
 */
function flattenConjugation(
  conjugation: any,
  verbRoot: string,
  metadata: VerbMetadata
): VerbFormData[] {
  const forms: VerbFormData[] = [];

  const collectForms = (
    node: any,
    aspect: 'imperfective' | 'perfective',
    mood: 'nonImperative' | 'imperative',
    length: 'long' | 'short' | null = null,
    labelPrefix: string = ''
  ) => {
    if (!node) return;

    if (Array.isArray(node)) {
      // Check if this is a verb block structure (6 persons × 2 genders × 2 lengths)
      if (node.length === 6 && node.every((item: any) => Array.isArray(item) && item.length === 2)) {
        // VerbBlock structure
        node.forEach((personLine: any, personIdx: number) => {
          if (!Array.isArray(personLine) || personLine.length !== 2) return;
          
          personLine.forEach((genderLine: any, genderIdx: number) => {
            if (!Array.isArray(genderLine) || genderLine.length !== 2) return;
            
            genderLine.forEach((lengthLine: any, lengthIdx: number) => {
              if (!Array.isArray(lengthLine)) return;
              
              const personLabel = PERSON_LABELS[personIdx] || '';
              const genderLabel = GENDER_LABELS[genderIdx] || '';
              const currentLength = lengthIdx === 0 ? 'long' : 'short';
              
              lengthLine.forEach((ps: any) => {
                if (ps && typeof ps.p === 'string') {
                  const tenseLabel = mood === 'imperative' ? 'Imperative' : 
                                   aspect === 'imperfective' ? 'Present' : 'Subjunctive';
                  const label = `${personLabel} ${tenseLabel} ${genderLabel} ${currentLength}`;
                  
                  forms.push({
                    verb_root: verbRoot,
                    aspect,
                    mood,
                    length: currentLength,
                    person: personIdx,
                    gender: genderIdx as 0 | 1,
                    form: ps.p.trim(),
                    romanization: ps.f || null,
                    grammatical_label: label.trim(),
                  });
                }
              });
            });
          });
        });
        return;
      }

      // Handle imperative blocks (2 persons × 2 genders × 2 lengths)
      if (node.length === 2 && mood === 'imperative') {
        const imperativePersons = [1, 4]; // 2sg, 2pl
        node.forEach((personLine: any, personIdx: number) => {
          if (!Array.isArray(personLine) || personLine.length !== 2) return;
          
          personLine.forEach((genderLine: any, genderIdx: number) => {
            if (!Array.isArray(genderLine) || genderLine.length !== 2) return;
            
            genderLine.forEach((lengthLine: any, lengthIdx: number) => {
              if (!Array.isArray(lengthLine)) return;
              
              const personIdxReal = imperativePersons[personIdx];
              const personLabel = PERSON_LABELS[personIdxReal] || '';
              const genderLabel = GENDER_LABELS[genderIdx] || '';
              const currentLength = lengthIdx === 0 ? 'long' : 'short';
              
              lengthLine.forEach((ps: any) => {
                if (ps && typeof ps.p === 'string') {
                  forms.push({
                    verb_root: verbRoot,
                    aspect,
                    mood,
                    length: currentLength,
                    person: personIdxReal,
                    gender: genderIdx as 0 | 1,
                    form: ps.p.trim(),
                    romanization: ps.f || null,
                    grammatical_label: `${personLabel} Imperative ${genderLabel} ${currentLength}`.trim(),
                  });
                }
              });
            });
          });
        });
        return;
      }
    }

    // Recursively traverse object structures
    if (typeof node === 'object') {
      if (typeof node.p === 'string') {
        // Leaf node with form
        forms.push({
          verb_root: verbRoot,
          aspect,
          mood,
          length,
          person: -1, // Unknown
          gender: null,
          form: node.p.trim(),
          romanization: node.f || null,
          grammatical_label: labelPrefix || 'Form',
        });
        return;
      }

      // Handle nested objects
      for (const [key, value] of Object.entries(node)) {
        if (key === 'long' || key === 'short') {
          collectForms(value, aspect, mood, key as 'long' | 'short', labelPrefix);
        } else {
          collectForms(value, aspect, mood, length, labelPrefix);
        }
      }
    }
  };

  // Extract forms from different parts of conjugation
  if (conjugation.imperfective?.nonImperative) {
    collectForms(conjugation.imperfective.nonImperative, 'imperfective', 'nonImperative');
  }
  if (conjugation.perfective?.nonImperative) {
    collectForms(conjugation.perfective.nonImperative, 'perfective', 'nonImperative');
  }
  if (conjugation.imperfective?.imperative) {
    collectForms(conjugation.imperfective.imperative, 'imperfective', 'imperative');
  }
  if (conjugation.perfective?.imperative) {
    collectForms(conjugation.perfective.imperative, 'perfective', 'imperative');
  }

  return forms;
}

/**
 * Process a verb entry from LingDocs dictionary
 */
export function processVerbEntry(
  entry: T.VerbDictionaryEntry,
  linkedEntry?: T.DictionaryEntry
): {
  metadata: VerbMetadata;
  conjugations: VerbFormData[];
} {
  const verbRoot = entry.p;
  const verbType = extractVerbType(entry);
  const { complement, auxiliary_verb } = extractCompoundInfo(entry);
  
  // Get conjugation
  const conjugation = conjugateVerb(entry, linkedEntry);
  
  // Extract metadata
  const metadata: VerbMetadata = {
    verb_root: verbRoot,
    verb_type: verbType,
    complement,
    auxiliary_verb,
    transitivity: entry.transitivity || null,
    imperfective_stem: entry.psp || null,
    perfective_stem: entry.ssp || null,
    imperfective_root: entry.prp || null,
    perfective_root: entry.prp || null,
    past_participle: entry.pprtp || null,
    romanization: entry.f || null,
    conjugation_pattern: null, // Would need to infer from entry
  };

  // Extract structured conjugations
  const conjugations = flattenConjugation(conjugation, verbRoot, metadata);

  return { metadata, conjugations };
}

/**
 * Create normalized grammatical_info JSON for inflections table
 */
export function createNormalizedGrammaticalInfo(
  formData: VerbFormData | { person?: string; tense?: string; aspect?: string; mood?: string; gender?: string; length?: string; verb_type?: string; pos: string }
): NormalizedGrammaticalInfo {
  const info: NormalizedGrammaticalInfo = {
    person: null,
    tense: null,
    aspect: null,
    mood: null,
    gender: null,
    length: null,
    verb_type: null,
    participle_type: null,
    inflection_type: null,
    pos: 'verb',
  };

  if ('person' in formData && typeof formData.person === 'number') {
    info.person = PERSON_LABELS[formData.person] || null;
  } else if ('person' in formData && typeof formData.person === 'string') {
    info.person = formData.person;
  }

  if ('aspect' in formData && formData.aspect) {
    info.aspect = formData.aspect === 'imperfective' ? 'Imperfective' : 'Perfective';
  }

  if ('mood' in formData && formData.mood) {
    info.mood = formData.mood === 'imperative' ? 'Imperative' : 
                formData.mood === 'nonImperative' ? 'Indicative' : formData.mood;
  }

  if ('tense' in formData && formData.tense) {
    info.tense = formData.tense;
  } else if ('mood' in formData && 'aspect' in formData) {
    // Infer tense from mood and aspect
    if (formData.mood === 'nonImperative') {
      info.tense = formData.aspect === 'imperfective' ? 'Present' : 'Subjunctive';
    } else if (formData.mood === 'imperative') {
      info.tense = 'Imperative';
    }
  }

  if ('gender' in formData) {
    if (typeof formData.gender === 'number') {
      info.gender = formData.gender === 0 ? 'Masc' : 'Fem';
    } else if (typeof formData.gender === 'string') {
      info.gender = formData.gender;
    }
  }

  if ('length' in formData && formData.length) {
    info.length = formData.length;
  }

  if ('verb_type' in formData && formData.verb_type) {
    info.verb_type = formData.verb_type;
  }

  if ('pos' in formData) {
    info.pos = formData.pos as any;
  }

  return info;
}


/**
 * Verb filtering utilities
 * 
 * Supports filtering verb variants by person, tense, aspect, and mood.
 * Works with both label-based matching AND dedicated D1 fields.
 * 
 * D1 verb_forms table stores:
 *   - person: "1sg", "2sg", "3sg", "1pl", "2pl", "3pl"
 *   - tense: "imperative", "non-imperative" (limited from LingDocs)
 *   - aspect: "imperfective", "perfective"
 *   - voice: "active", "passive"
 *   
 * Our filter values:
 *   - person: "1st", "2nd", "3rd"
 *   - tense: "present", "past", "future", "perfect", "subjunctive", "imperative", "ability", "habitual"
 *   - aspect: "imperfective", "perfective"
 *   - mood: "indicative", "subjunctive", "imperative", "ability"
 */

import type {
  RelatedFormVariant,
  VerbFilterState,
  VerbFilterPerson,
  VerbFilterTense,
  VerbFilterAspect,
  VerbFilterMood,
} from "../../types";

// Person normalization: D1 uses "1sg"/"1pl", we use "1st"/"2nd"/"3rd"
export const PERSON_D1_MAP: Record<string, VerbFilterPerson> = {
  '1': '1st',
  '1sg': '1st',
  '1pl': '1st',
  '2': '2nd',
  '2sg': '2nd',
  '2pl': '2nd',
  '3': '3rd',
  '3sg': '3rd',
  '3pl': '3rd',
};

export const PERSON_PATTERNS: Record<VerbFilterPerson, string[]> = {
  all: [],
  '1st': ['1sg', '1 pl', '1pl', '1st', 'first', '1.', ' 1 '],
  '2nd': ['2sg', '2 pl', '2pl', '2nd', 'second', '2.', ' 2 '],
  '3rd': ['3sg', '3 pl', '3pl', '3rd', 'third', '3.', ' 3 '],
};

// Tense inference from aspect + mood
// In Pashto:
// - imperfective non-imperative = present/future
// - perfective non-imperative = past (simple/narrative)
// - imperative = imperative mood
// - imperfective subjunctive = present subjunctive
// - perfective subjunctive = past subjunctive
export const TENSE_MATCHERS: Record<VerbFilterTense, (label: string, variant?: RelatedFormVariant) => boolean> = {
  all: () => true,
  present: (l, v) => {
    // Present = imperfective aspect + non-imperative
    if (v?.aspect === 'imperfective' && v?.tense !== 'imperative') return true;
    return l.includes('present') || l.includes('pres') || l.includes('non-past');
  },
  past: (l, v) => {
    // Past = perfective aspect
    if (v?.aspect === 'perfective') return true;
    return (l.includes('past') || l.includes('preterite')) && !l.includes('participle') && !l.includes('perfect');
  },
  future: (l, v) => {
    // Future = به + imperfective (we can't detect به prefix easily)
    if (v?.tense === 'future') return true;
    return l.includes('future') || l.includes('fut');
  },
  perfect: (l, v) => {
    if (v?.tense === 'perfect') return true;
    return l.includes('perfect') || l.includes('participle');
  },
  subjunctive: (l, v) => {
    if (v?.mood === 'subjunctive' || v?.tense === 'subjunctive') return true;
    return l.includes('subj');
  },
  imperative: (l, v) => {
    if (v?.tense === 'imperative' || v?.mood === 'imperative') return true;
    return l.includes('imperativ') || l.includes('imp');
  },
  ability: (l, v) => {
    if (v?.mood === 'ability' || v?.tense === 'ability') return true;
    return l.includes('ability') || l.includes('able') || l.includes('potential') || l.includes('pot');
  },
  habitual: (l, v) => {
    if (v?.tense === 'habitual') return true;
    return l.includes('habit');
  },
};

export const MOOD_MATCHERS: Record<VerbFilterMood, (label: string, variant?: RelatedFormVariant) => boolean> = {
  all: () => true,
  indicative: (l, v) => {
    // Indicative = not subjunctive, not imperative, not ability/potential
    if (v?.mood) {
      return v.mood === 'indicative' || (!['subjunctive', 'imperative', 'ability'].includes(v.mood));
    }
    return !l.includes('subj') && !l.includes('imperativ') && !l.includes('ability') && !l.includes('potential');
  },
  subjunctive: (l, v) => {
    if (v?.mood === 'subjunctive') return true;
    return l.includes('subj');
  },
  imperative: (l, v) => {
    if (v?.mood === 'imperative' || v?.tense === 'imperative') return true;
    return l.includes('imperativ') || l.includes('imp');
  },
  ability: (l, v) => {
    if (v?.mood === 'ability') return true;
    return l.includes('ability') || l.includes('able') || l.includes('potential') || l.includes('pot');
  },
};

export const ASPECT_MATCHERS: Record<VerbFilterAspect, (label: string, variant?: RelatedFormVariant) => boolean> = {
  all: () => true,
  imperfective: (l, v) => {
    if (v?.aspect === 'imperfective' || v?.voice === 'imperfective') return true;
    // In Pashto, imperfective is used for: present, future, habitual, progressive
    return l.includes('imperfective') || l.includes('ipfv') || 
           l.includes('present') || l.includes('future') || l.includes('habit') ||
           l.includes('progressive') || l.includes('ability');
  },
  perfective: (l, v) => {
    if (v?.aspect === 'perfective' || v?.voice === 'perfective') return true;
    // In Pashto, perfective is used for: simple past, perfect, past subjunctive
    return l.includes('perfective') || l.includes('pfv') ||
           l.includes('past') || l.includes('perfect') || l.includes('participle');
  },
};

export function normalizeLabel(label?: string): string {
  return (label || '').toLowerCase();
}

/**
 * Normalize D1 person value to our filter format
 */
export function normalizePersonFromD1(d1Person?: string): VerbFilterPerson | null {
  if (!d1Person) return null;
  const clean = d1Person.toLowerCase().trim();
  return PERSON_D1_MAP[clean] || null;
}

export function matchesPerson(label: string, person: VerbFilterPerson, variant?: RelatedFormVariant): boolean {
  if (person === 'all') return true;
  
  // First check the dedicated person field
  if (variant?.person) {
    const normalizedPerson = normalizePersonFromD1(variant.person);
    if (normalizedPerson === person) return true;
  }
  
  // Fall back to label matching
  const patterns = PERSON_PATTERNS[person];
  if (!patterns?.length) return true;
  return patterns.some((pattern) => label.includes(pattern.toLowerCase()));
}

export function matchesTense(label: string, tense: VerbFilterTense, variant?: RelatedFormVariant): boolean {
  const matcher = TENSE_MATCHERS[tense];
  return matcher ? matcher(label, variant) : true;
}

export function matchesMood(label: string, mood: VerbFilterMood, variant?: RelatedFormVariant): boolean {
  const matcher = MOOD_MATCHERS[mood];
  return matcher ? matcher(label, variant) : true;
}

export function matchesAspect(label: string, aspect: VerbFilterAspect, variant?: RelatedFormVariant): boolean {
  const matcher = ASPECT_MATCHERS[aspect];
  return matcher ? matcher(label, variant) : true;
}

/**
 * Filter verb variants based on grammatical filters
 * Uses both label text AND dedicated D1 fields for matching
 */
export function filterVerbVariants(
  verbs: RelatedFormVariant[] | undefined,
  filters: VerbFilterState
): RelatedFormVariant[] {
  if (!verbs?.length) return [];
  
  const filtered = verbs.filter((variant) => {
    const label = normalizeLabel(variant.label);
    
    // Check all filter criteria
    const personMatch = matchesPerson(label, filters.person, variant);
    const tenseMatch = matchesTense(label, filters.tense, variant);
    const moodMatch = matchesMood(label, filters.mood, variant);
    const aspectMatch = matchesAspect(label, filters.aspect, variant);

    return personMatch && tenseMatch && moodMatch && aspectMatch;
  });
  
  return filtered;
}

/**
 * Infer grammatical features from Pashto verb form morphology
 * This is a heuristic approach based on common Pashto verb patterns
 */
export function inferGrammaticalFeatures(form: string, baseVerb?: string): {
  aspect?: 'imperfective' | 'perfective';
  tense?: string;
  mood?: string;
} {
  const result: {
    aspect?: 'imperfective' | 'perfective';
    tense?: string;
    mood?: string;
  } = {};
  
  // Perfective marker: و- prefix
  if (form.startsWith('و') || form.startsWith('وا')) {
    result.aspect = 'perfective';
  }
  
  // Future marker: به prefix (often appears before the verb)
  // Note: This is context-dependent and may not be in the form itself
  
  // Imperative endings (2nd person)
  const imperativeEndings = ['ه', 'ئ'];
  if (imperativeEndings.some(e => form.endsWith(e))) {
    result.mood = 'imperative';
  }
  
  // Subjunctive: و- prefix without past tense markers
  if (form.startsWith('و') && !form.includes('ل')) {
    result.mood = 'subjunctive';
  }
  
  return result;
}

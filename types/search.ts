/**
 * Search-related type definitions
 * Used by the search API and components for POS filtering and variant handling
 */

/**
 * Part of Speech types supported by the search system
 */
export type PartOfSpeech = 'verb' | 'noun' | 'adjective' | 'adverb' | 'other';

/**
 * POS filtering configuration
 * Used to include or exclude specific parts of speech from search results
 */
export interface POSFilters {
  include?: PartOfSpeech[];
  exclude?: PartOfSpeech[];
}

/**
 * Morphological filter values
 */
export type MorphPersonValue = 'all' | '1st' | '2nd' | '3rd';
export type MorphTenseValue = 'all' | 'present' | 'past' | 'future' | 'perfect' | 'subjunctive' | 'imperative' | 'ability' | 'habitual';
export type MorphAspectValue = 'all' | 'imperfective' | 'perfective';
export type MorphMoodValue = 'all' | 'indicative' | 'subjunctive' | 'imperative' | 'ability';

/**
 * Morphological filtering for verbs
 * Filters verb forms by grammatical features
 * Supports both single values (legacy) and arrays (multi-select)
 */
export interface MorphologicalFilters {
  person?: MorphPersonValue | MorphPersonValue[];
  tense?: MorphTenseValue | MorphTenseValue[];
  aspect?: MorphAspectValue | MorphAspectValue[];
  mood?: MorphMoodValue | MorphMoodValue[];
}

/**
 * Facet counts for morphological filtering
 * Used to show context-aware counts in the filter UI
 */
export interface MorphologyFacetCounts {
  person: Record<string, number>;
  tense: Record<string, number>;
  aspect: Record<string, number>;
  mood: Record<string, number>;
  totalForms: number;
  matchingForms: number;
}

/**
 * Summary of POS distribution in search results
 * Tracks count and data sources for each part of speech
 */
export type POSSummary = {
  [K in PartOfSpeech]?: {
    count: number;
    sources: {
      lingdocs: number;
      d1: number;
    };
  };
};

/**
 * Variant with Part of Speech information
 * Extends base variant with POS tagging and source tracking
 */
export interface VariantWithPOS {
  form: string;
  label?: string;
  pos: PartOfSpeech;
  sources?: string[];
  count?: number;
  score?: number;
  romanized?: string;
  flags?: string[];
}

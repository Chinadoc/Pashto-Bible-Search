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

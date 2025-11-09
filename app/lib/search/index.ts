/**
 * Search Module - Stub Implementation
 *
 * This is a stub that provides basic search functionality.
 * Morphological search is not currently implemented.
 */

import type { VerseRecord } from '../data/load';

export type Scope = 'all' | 'ot' | 'nt';
export type SearchResult = Pick<VerseRecord, 'ref' | 'text' | 'testament' | 'source' | 'book'>;

/**
 * Stub implementation of morphological search
 * Returns empty results - the main search API uses D1 database instead
 */
export async function morphologicalSearch(
  term: string,
  scope: Scope,
  options: {
    limit?: number;
    includeVariants?: boolean;
    includeCompounds?: boolean;
    maxVariants?: number;
  } = {}
): Promise<{
  results: SearchResult[];
  expandedTerms: string[];
  variantCount: number;
  searchType: 'morphological' | 'exact';
}> {
  console.log(`⚠️ Morphological search stub called for "${term}" - returning empty results`);
  console.log(`💡 Using D1-powered search API instead`);

  return {
    results: [],
    expandedTerms: [term],
    variantCount: 0,
    searchType: 'exact',
  };
}

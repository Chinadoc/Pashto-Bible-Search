/**
 * LingDocs Adapter - Stub Implementation
 *
 * This is a stub that gracefully returns empty results.
 * The actual LingDocs integration requires additional setup.
 * The application uses D1 database for verb forms instead.
 */

import type { Variant } from './verb_variants';

/**
 * Stub implementation - returns empty array
 * Real implementation would use LingDocs library for enhanced verb variants
 */
export async function generateEnhancedVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  console.log(`⚠️ LingDocs adapter stub called for "${rootOrInfinitive}" - returning empty results`);
  console.log(`💡 Using D1 database for verb forms instead`);
  return [];
}

/**
 * Stub implementation - returns empty array
 * Real implementation would use LingDocs library for enhanced noun variants
 */
export async function generateEnhancedNounVariants(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  console.log(`⚠️ LingDocs adapter stub called for "${rootOrLemma}" - returning empty results`);
  return [];
}

// Export types for compatibility
export type { Variant };

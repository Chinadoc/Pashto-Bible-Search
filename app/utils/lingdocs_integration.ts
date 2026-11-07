/**
 * The LingDocs library lives outside this repo, so deployed builds never had it
 * and these always returned no variants. Callers use their own pattern fallback.
 */

import type { Variant } from './verb_variants';

export async function generateVerbVariantsLingDocs(
  _rootOrInfinitive: string,
  _opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  return [];
}

export async function generateNounVariantsLingDocs(
  _rootOrLemma: string,
  _opts?: { cap?: number }
): Promise<Variant[]> {
  return [];
}

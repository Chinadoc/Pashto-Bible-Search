/**
 * LingDocs Adapter - Complete Integration
 *
 * This adapter provides full integration with the LingDocs inflection engine
 * using the actual LingDocs library functions for accurate verb conjugation
 * and noun/adjective inflection.
 */

// Dynamic import to handle LingDocs availability gracefully
async function loadLingDocsIntegration() {
  try {
    const module = await import('./lingdocs_integration');
    return {
      generateVerbVariantsLingDocs: module.generateVerbVariantsLingDocs,
      generateNounVariantsLingDocs: module.generateNounVariantsLingDocs,
    };
  } catch (error) {
    console.warn('⚠️ LingDocs integration not available, using fallback:', error);
    return {
      generateVerbVariantsLingDocs: async () => [],
      generateNounVariantsLingDocs: async () => [],
    };
  }
}

// Remove stub runtime - use real LingDocs integration only
import type { Variant } from './verb_variants';

// LingDocs adapter now uses the actual LingDocs library through lingdocs_integration.ts
// No need for Supabase client or custom metadata fetching anymore

// Main function that uses LingDocs for enhanced verb variant generation
export async function generateEnhancedVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  console.log(`🚀 Using LingDocs for enhanced verb variants: "${rootOrInfinitive}"`);

  try {
    // Dynamically load LingDocs integration
    const { generateVerbVariantsLingDocs } = await loadLingDocsIntegration();

    // Use the actual LingDocs integration
    const variants = await generateVerbVariantsLingDocs(rootOrInfinitive, opts);

    if (variants && variants.length > 0) {
      console.log(`✅ LingDocs generated ${variants.length} verb variants`);
      return variants;
    } else {
      console.log(`⚠️ LingDocs returned no variants for "${rootOrInfinitive}"`);
      return [];
    }
  } catch (error) {
    console.error(`❌ LingDocs error for "${rootOrInfinitive}":`, error);
    return [];
  }
}

// Enhanced noun variant generation using LingDocs
export async function generateEnhancedNounVariants(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  console.log(`🚀 Using LingDocs for enhanced noun variants: "${rootOrLemma}"`);

  try {
    // Dynamically load LingDocs integration
    const { generateNounVariantsLingDocs } = await loadLingDocsIntegration();

    // Use the actual LingDocs integration
    const variants = await generateNounVariantsLingDocs(rootOrLemma, opts);

    if (variants && variants.length > 0) {
      console.log(`✅ LingDocs generated ${variants.length} noun variants`);
      return variants;
    } else {
      console.log(`⚠️ LingDocs returned no variants for "${rootOrLemma}"`);
      return [];
    }
  } catch (error) {
    console.error(`❌ LingDocs error for "${rootOrLemma}":`, error);
    return [];
  }
}

// Export types for compatibility
export type { Variant };

#!/usr/bin/env ts-node
/**
 * Precompute inflection cache with provenance tags (rule vs override)
 * This creates a new inflections_cache.json with source attribution
 */
import fs from 'node:fs/promises';
// Note: In a real implementation, this would import from the engine
// For now, we'll simulate the cache generation

type InflectionEntry = {
  lemma: string;
  family: string;
  forms: string[];
  provenance: 'rule' | 'override';
  stems?: Record<string, string>;
};

async function precomputeInflectionCache() {
  console.log('🔄 Precomputing inflection cache with provenance tags...');

  // Read the verb families classification
  const familiesTsv = await fs.readFile('reports/verb_families.tsv', 'utf8');
  const lines = familiesTsv.split('\n').slice(1); // Skip header

  // Read the extracted stems
  const stemsCsv = await fs.readFile('reports/stems.csv', 'utf8');
  const stemLines = stemsCsv.split('\n').slice(1);

  // Build stems map
  const stemsByLemma: Record<string, Record<string, string>> = {};
  for (const line of stemLines) {
    if (!line.trim()) continue;
    const [lemma_pashto, stem_type, value] = line.split(',');
    if (!stemsByLemma[lemma_pashto]) {
      stemsByLemma[lemma_pashto] = {};
    }
    stemsByLemma[lemma_pashto][stem_type] = value;
  }

  const cache: InflectionEntry[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const [pashto, family, tags] = line.split('\t');

    if (!pashto || !family) continue;

    // Skip non-verbs for now
    if (family === 'non_verb') continue;

    // Build lemma data
    const lemmaData: LemmaData = {
      pashto,
      family: family as any,
      stems: stemsByLemma[pashto]
    };

    // Determine if this should use rule or override
    const usesOverride = ['irregular_one_off', 'modal'].includes(family) ||
                        (stemsByLemma[pashto] && Object.keys(stemsByLemma[pashto]).length > 0);

    try {
      const forms = generateForms(lemmaData);
      const flattened = flattenForms(forms);

      if (flattened.length > 0) {
        cache.push({
          lemma: pashto,
          family,
          forms: flattened,
          provenance: usesOverride ? 'override' : 'rule',
          stems: stemsByLemma[pashto]
        });
      }
    } catch (error) {
      console.warn(`Failed to generate forms for ${pashto}:`, error);
    }
  }

  // Save cache with provenance
  const cacheContent = {
    metadata: {
      generated_at: new Date().toISOString(),
      total_entries: cache.length,
      provenance_summary: {
        rule: cache.filter(e => e.provenance === 'rule').length,
        override: cache.filter(e => e.provenance === 'override').length
      }
    },
    entries: cache
  };

  await fs.writeFile('reports/inflection_cache_with_provenance.json', JSON.stringify(cacheContent, null, 2), 'utf8');

  console.log(`✅ Precomputed cache for ${cache.length} lemmas`);
  console.log(`📊 Provenance: ${cacheContent.metadata.provenance_summary.rule} rule, ${cacheContent.metadata.provenance_summary.override} override`);
  console.log('📁 Saved to reports/inflection_cache_with_provenance.json');

  // Show some examples
  console.log('\n📝 Sample entries:');
  cache.slice(0, 5).forEach(entry => {
    console.log(`  ${entry.lemma} (${entry.family}): ${entry.forms.length} forms, ${entry.provenance}`);
  });
}

precomputeInflectionCache().catch(console.error);

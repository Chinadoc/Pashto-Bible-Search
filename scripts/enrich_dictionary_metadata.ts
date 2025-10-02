#!/usr/bin/env ts-node
/**
 * Enriches Supabase dictionary table with inflection metadata
 * from full_dictionary_enriched.json
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface DictEntry {
  ts: number;
  p: string;      // Pashto
  f: string;      // Romanization
  e: string;      // English
  c: string;      // POS tag
  g?: string;     // Gender
  psp?: string;   // Present stem (verbs)
  psf?: string;   // Present stem romanization
  ssp?: string;   // Subjunctive stem (verbs)
  ssf?: string;   // Subjunctive stem romanization
  pprtp?: string; // Past participle
  pprtf?: string; // Past participle romanization
  infap?: string; // Inflection 1st (nouns/adj)
  infaf?: string; // Inflection 1st romanization
  infbp?: string; // Inflection 2nd/bundled (nouns/adj)
  infbf?: string; // Inflection 2nd romanization
  tppp?: string;  // Past participle (alt field)
  tppf?: string;  // Past participle romanization (alt)
  c_norm?: string;
  pos_family?: string;
  gender?: string;
  [key: string]: any;
}

/**
 * Derive inflection_pattern from entry metadata
 */
function deriveInflectionPattern(entry: DictEntry): string {
  const pos = entry.c?.toLowerCase() || '';
  const posFamily = entry.pos_family?.toLowerCase() || '';

  // VERBS
  if (posFamily === 'verb' || pos.includes('v.')) {
    if (entry.psp && entry.ssp) {
      return 'split_verb_both_stems';
    }
    if (entry.psp) {
      return 'split_verb_present_stem';
    }
    if (pos.includes('stative')) {
      return 'stative_compound';
    }
    if (pos.includes('dynamic')) {
      return 'dynamic_compound';
    }
    return 'simple_verb';
  }

  // NOUNS
  if (posFamily === 'noun' || pos.includes('n.')) {
    if (entry.infap && entry.infbp) {
      return 'pattern_1_2_bundled';
    }
    if (entry.infap) {
      return 'pattern_1_inflection';
    }
    return 'plain_only';
  }

  // ADJECTIVES
  if (posFamily === 'adjective' || pos.includes('adj')) {
    if (entry.infap) {
      return 'inflecting_adjective';
    }
    return 'uninflecting_adjective';
  }

  return 'unknown';
}

/**
 * Extract enriched_info JSON from entry
 */
function extractEnrichedInfo(entry: DictEntry): Record<string, any> {
  const info: Record<string, any> = {};

  // Verb stems
  if (entry.psp) info.psp = entry.psp;
  if (entry.psf) info.psf = entry.psf;
  if (entry.ssp) info.ssp = entry.ssp;
  if (entry.ssf) info.ssf = entry.ssf;
  if (entry.pprtp) info.pprtp = entry.pprtp;
  if (entry.pprtf) info.pprtf = entry.pprtf;
  if (entry.tppp) info.tppp = entry.tppp;
  if (entry.tppf) info.tppf = entry.tppf;

  // Noun/adj inflections
  if (entry.infap) info.infap = entry.infap;
  if (entry.infaf) info.infaf = entry.infaf;
  if (entry.infbp) info.infbp = entry.infbp;
  if (entry.infbf) info.infbf = entry.infbf;

  // Original POS
  if (entry.c) info.c = entry.c;
  if (entry.c_norm) info.c_norm = entry.c_norm;

  // Timestamp
  if (entry.ts) info.ts = entry.ts;

  return info;
}

async function enrichDictionary() {
  console.log('📚 Starting dictionary enrichment...');
  console.log('🔗 Supabase URL:', SUPABASE_URL);
  console.log('🔑 API Key present:', SUPABASE_KEY ? 'Yes' : 'No');

  // Load dictionary
  const dictPath = path.join(process.cwd(), 'full_dictionary_enriched.json');
  console.log('📂 Loading dictionary from:', dictPath);
  
  const rawData = fs.readFileSync(dictPath, 'utf-8');
  console.log('📄 File size:', (rawData.length / 1024 / 1024).toFixed(2), 'MB');
  
  const dictData = JSON.parse(rawData);
  const entries: DictEntry[] = dictData.entries || [];

  console.log(`📖 Loaded ${entries.length} dictionary entries`);
  console.log('🚀 Starting batch processing...\n');

  let enriched = 0;
  let skipped = 0;
  let errors = 0;

  // Process in batches to avoid rate limits
  const BATCH_SIZE = 50;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
    
    console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (entries ${i + 1}-${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length})`);
    console.log(`   Progress: ${((i / entries.length) * 100).toFixed(1)}%`);

    const promises = batch.map(async (entry, idx) => {
      try {
        const inflectionPattern = deriveInflectionPattern(entry);
        const enrichedInfo = extractEnrichedInfo(entry);
        const linguisticCategory = entry.pos_family || entry.c_norm || 'unknown';

        // Only update if we have meaningful enrichment data
        if (Object.keys(enrichedInfo).length === 0) {
          skipped++;
          return;
        }

        const { error } = await supabase
          .from('dictionary')
          .update({
            inflection_pattern: inflectionPattern,
            linguistic_category: linguisticCategory,
            enriched_info: enrichedInfo,
          })
          .eq('pashto', entry.p)
          .eq('romanized', entry.f);

        if (error) {
          console.error(`  ❌ Error updating ${entry.p}: ${error.message}`);
          errors++;
        } else {
          enriched++;
          // Log every entry in first batch, then every 50
          if (i < BATCH_SIZE || enriched % 50 === 0) {
            console.log(`  ✅ [${enriched}] Enriched: ${entry.p} → ${inflectionPattern}`);
          }
        }
      } catch (err) {
        console.error(`  ❌ Exception for ${entry.p}:`, err);
        errors++;
      }
    });

    await Promise.all(promises);
    
    console.log(`   ✅ Batch ${batchNum} complete: +${batch.length} processed`);
    console.log(`   📊 Running totals: ${enriched} enriched, ${skipped} skipped, ${errors} errors`);

    // Rate limit: wait 500ms between batches
    if (i + BATCH_SIZE < entries.length) {
      console.log(`   ⏳ Waiting 500ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✨ Enrichment complete!`);
  console.log(`  ✅ Enriched: ${enriched}`);
  console.log(`  ⏭️  Skipped (no metadata): ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
}

// Run if executed directly
if (require.main === module) {
  enrichDictionary()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

export { enrichDictionary, deriveInflectionPattern, extractEnrichedInfo };


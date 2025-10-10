#!/usr/bin/env node
/**
 * Simple enrichment script using ES modules
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load env vars
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📚 Starting dictionary enrichment...');
console.log('🔗 Supabase URL:', SUPABASE_URL?.substring(0, 30) + '...');
console.log('🔑 API Key present:', SUPABASE_KEY ? 'Yes' : 'No');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function deriveInflectionPattern(entry) {
  const pos = entry.c?.toLowerCase() || '';
  const posFamily = entry.pos_family?.toLowerCase() || '';

  if (posFamily === 'verb' || pos.includes('v.')) {
    if (entry.psp && entry.ssp) return 'split_verb_both_stems';
    if (entry.psp) return 'split_verb_present_stem';
    if (pos.includes('stative')) return 'stative_compound';
    if (pos.includes('dynamic')) return 'dynamic_compound';
    return 'simple_verb';
  }

  if (posFamily === 'noun' || pos.includes('n.')) {
    if (entry.infap && entry.infbp) return 'pattern_1_2_bundled';
    if (entry.infap) return 'pattern_1_inflection';
    return 'plain_only';
  }

  if (posFamily === 'adjective' || pos.includes('adj')) {
    if (entry.infap) return 'inflecting_adjective';
    return 'uninflecting_adjective';
  }

  return 'unknown';
}

function extractEnrichedInfo(entry) {
  const info = {};
  
  if (entry.psp) info.psp = entry.psp;
  if (entry.psf) info.psf = entry.psf;
  if (entry.ssp) info.ssp = entry.ssp;
  if (entry.ssf) info.ssf = entry.ssf;
  if (entry.pprtp) info.pprtp = entry.pprtp;
  if (entry.pprtf) info.pprtf = entry.pprtf;
  if (entry.tppp) info.tppp = entry.tppp;
  if (entry.tppf) info.tppf = entry.tppf;
  if (entry.infap) info.infap = entry.infap;
  if (entry.infaf) info.infaf = entry.infaf;
  if (entry.infbp) info.infbp = entry.infbp;
  if (entry.infbf) info.infbf = entry.infbf;
  if (entry.c) info.c = entry.c;
  if (entry.c_norm) info.c_norm = entry.c_norm;
  if (entry.ts) info.ts = entry.ts;

  return info;
}

async function enrichDictionary() {
  const dictPath = join(process.cwd(), 'full_dictionary_enriched.json');
  console.log('📂 Loading:', dictPath);
  
  const rawData = readFileSync(dictPath, 'utf-8');
  console.log('📄 File size:', (rawData.length / 1024 / 1024).toFixed(2), 'MB');
  
  const dictData = JSON.parse(rawData);
  const entries = dictData.entries || [];
  console.log(`📖 Loaded ${entries.length} entries\n`);

  let enriched = 0, skipped = 0, errors = 0;
  const BATCH_SIZE = 50;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(entries.length / BATCH_SIZE);
    
    console.log(`\n🔄 Batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length})`);

    const promises = batch.map(async (entry) => {
      try {
        const inflectionPattern = deriveInflectionPattern(entry);
        const enrichedInfo = extractEnrichedInfo(entry);
        const linguisticCategory = entry.pos_family || entry.c_norm || 'unknown';

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
          console.error(`  ❌ ${entry.p}: ${error.message}`);
          errors++;
        } else {
          enriched++;
          if (enriched % 50 === 0 || i < BATCH_SIZE) {
            console.log(`  ✅ [${enriched}] ${entry.p} → ${inflectionPattern}`);
          }
        }
      } catch (err) {
        console.error(`  ❌ ${entry.p}:`, err.message);
        errors++;
      }
    });

    await Promise.all(promises);
    console.log(`  📊 Totals: ${enriched} enriched, ${skipped} skipped, ${errors} errors`);

    if (i + BATCH_SIZE < entries.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✨ Complete! ✅ ${enriched} | ⏭️ ${skipped} | ❌ ${errors}`);
}

enrichDictionary().catch(console.error);

















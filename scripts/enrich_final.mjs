#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manual .env.local parsing
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📚 Dictionary Enrichment Starting...');
console.log('🔗 URL:', SUPABASE_URL?.substring(0, 30) + '...');
console.log('🔑 Key:', SUPABASE_KEY ? '✅' : '❌');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function pattern(e) {
  const p = e.c?.toLowerCase() || '', f = e.pos_family?.toLowerCase() || '';
  if (f === 'verb' || p.includes('v.')) {
    if (e.psp && e.ssp) return 'split_verb_both_stems';
    if (e.psp) return 'split_verb_present_stem';
    if (p.includes('stative')) return 'stative_compound';
    if (p.includes('dynamic')) return 'dynamic_compound';
    return 'simple_verb';
  }
  if (f === 'noun' || p.includes('n.')) {
    if (e.infap && e.infbp) return 'pattern_1_2_bundled';
    if (e.infap) return 'pattern_1_inflection';
    return 'plain_only';
  }
  if (f === 'adjective' || p.includes('adj')) {
    return e.infap ? 'inflecting_adjective' : 'uninflecting_adjective';
  }
  return 'unknown';
}

function info(e) {
  const i = {};
  ['psp','psf','ssp','ssf','pprtp','pprtf','tppp','tppf','infap','infaf','infbp','infbf','c','c_norm','ts']
    .forEach(k => { if (e[k]) i[k] = e[k]; });
  return i;
}

const data = JSON.parse(readFileSync(join(process.cwd(), 'full_dictionary_enriched.json'), 'utf-8'));
const entries = data.entries || [];
console.log(`📖 ${entries.length} entries loaded\n`);

let ok = 0, skip = 0, err = 0, BATCH = 50;

for (let i = 0; i < entries.length; i += BATCH) {
  const batch = entries.slice(i, i + BATCH);
  console.log(`🔄 Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(entries.length/BATCH)} (${i+1}-${Math.min(i+BATCH,entries.length)})`);

  await Promise.all(batch.map(async e => {
    try {
      const inf = info(e);
      if (Object.keys(inf).length === 0) { skip++; return; }
      
      const { error } = await supabase.from('dictionary').update({
        inflection_pattern: pattern(e),
        linguistic_category: e.pos_family || e.c_norm || 'unknown',
        enriched_info: inf
      }).eq('pashto', e.p).eq('romanized', e.f);

      if (error) { console.error(`  ❌ ${e.p}: ${error.message}`); err++; }
      else { ok++; if (ok % 50 === 0 || i < BATCH) console.log(`  ✅ [${ok}] ${e.p}`); }
    } catch (ex) { console.error(`  ❌ ${e.p}:`, ex.message); err++; }
  }));

  console.log(`  📊 ${ok} ok, ${skip} skip, ${err} err`);
  if (i + BATCH < entries.length) await new Promise(r => setTimeout(r, 500));
}

console.log(`\n✨ Done! ✅ ${ok} | ⏭️ ${skip} | ❌ ${err}`);






















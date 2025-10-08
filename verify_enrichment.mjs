#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function verify() {
  console.log('🔍 Verifying enrichment in Supabase...\n');

  // Check a few known entries
  const testWords = ['وهل', 'تعمید', 'پتون', 'آباد'];

  for (const word of testWords) {
    const { data, error } = await supabase
      .from('dictionary')
      .select('pashto, inflection_pattern, linguistic_category, enriched_info')
      .eq('pashto', word)
      .limit(1);

    if (error) {
      console.error(`❌ Error checking ${word}:`, error.message);
    } else if (data && data.length > 0) {
      const entry = data[0];
      console.log(`✅ ${word}:`);
      console.log(`   Pattern: ${entry.inflection_pattern || 'NULL'}`);
      console.log(`   Category: ${entry.linguistic_category || 'NULL'}`);
      console.log(`   Info keys: ${Object.keys(entry.enriched_info || {}).join(', ') || 'EMPTY'}`);
      console.log();
    } else {
      console.log(`⚠️  ${word}: Not found\n`);
    }
  }

  // Count enriched vs total
  const { count: total } = await supabase
    .from('dictionary')
    .select('*', { count: 'exact', head: true });

  const { count: enriched } = await supabase
    .from('dictionary')
    .select('*', { count: 'exact', head: true })
    .not('inflection_pattern', 'is', null);

  console.log(`📊 Summary:`);
  console.log(`   Total entries: ${total}`);
  console.log(`   Enriched: ${enriched}`);
  console.log(`   Progress: ${((enriched / total) * 100).toFixed(1)}%`);
}

verify().catch(console.error);










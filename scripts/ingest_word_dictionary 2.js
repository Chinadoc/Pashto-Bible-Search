#!/usr/bin/env node

/**
 * Ingest LingDocs POS/morphology into word_dictionary table
 * Batch inserts for efficiency
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function ingestWordDictionary() {
  console.log('\n📚 INGESTING LINGDOCS WORD DICTIONARY\n');

  try {
    // Load enriched POS data
    console.log('📖 Loading LingDocs POS morphology...');
    const posPath = path.join(process.cwd(), 'app/data/lingdocs_pos_morphology.json');
    const posMap = JSON.parse(fs.readFileSync(posPath, 'utf8'));
    const entries = Object.values(posMap);
    console.log('   ✅ Loaded ' + entries.length + ' entries\n');

    // Prepare batch rows
    console.log('📊 Preparing rows for insertion...');
    const rows = entries.map(entry => ({
      pashto_word: entry.word,
      romanized: entry.romanized,
      english: entry.english,
      pos: entry.pos,
      past: entry.past ? true : null,
      perfective: entry.perfective ? true : null,
      imperfective: entry.imperfective ? true : null,
      gender: entry.gender,
      animacy: entry.animacy,
    })).filter(r => r.pashto_word);

    console.log('   ✅ Ready to insert: ' + rows.length + '\n');

    // Batch insert with upsert
    const BATCH_SIZE = 500;
    let inserted = 0;

    console.log('📥 Inserting into word_dictionary...');
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabase
        .from('word_dictionary')
        .upsert(batch, { onConflict: 'pashto_word' });

      if (error) {
        console.log('\n❌ Error in batch ' + Math.floor(i/BATCH_SIZE) + ':', error);
        continue;
      }

      inserted += batch.length;
      const pct = Math.round((inserted / rows.length) * 100);
      process.stdout.write('\r   ' + pct + '% (' + inserted + '/' + rows.length + ')');
    }

    console.log('\n   ✅ Inserted: ' + inserted + '\n');

    // Verify
    console.log('📊 VERIFICATION:');
    const { count } = await supabase
      .from('word_dictionary')
      .select('*', { count: 'exact', head: true });

    console.log('   Total in table: ' + count);

    // POS distribution in table
    const { data: posDist } = await supabase
      .from('word_dictionary')
      .select('pos')
      .not('pos', 'is', null)
      .limit(5000);

    if (posDist) {
      const posCounts = {};
      posDist.forEach(row => {
        posCounts[row.pos] = (posCounts[row.pos] || 0) + 1;
      });

      console.log('\n📖 POS Distribution (sample):');
      Object.entries(posCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([pos, cnt]) => {
        console.log('   ' + pos + ': ' + cnt);
      });
    }

    console.log('\n✅ COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

ingestWordDictionary();

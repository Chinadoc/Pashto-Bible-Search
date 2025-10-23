#!/usr/bin/env node

/**
 * Extract POS & morphology from LingDocs dictionary
 * Creates a word_dictionary lookup for Supabase enrichment
 */

const fs = require('fs');
const path = require('path');

async function enrichLingDocs() {
  console.log('\n📚 LINGDOCS POS/MORPHOLOGY ENRICHMENT\n');

  try {
    // Load dictionary
    console.log('📖 Loading LingDocs dictionary...');
    const dictPath = path.join(process.cwd(), 'full_dictionary_enriched.json');
    const dictRaw = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    const entries = dictRaw.entries || [];
    console.log('   ✅ Loaded ' + entries.length + ' entries\n');

    // Extract POS and morphology data
    const posMap = {};  // word → { pos, category, lemma, inf...}
    const posStats = {};

    console.log('📊 Extracting POS and morphology...');
    let processed = 0;
    let withPos = 0;

    entries.forEach((entry, idx) => {
      if (!entry || !entry.p) return;

      const word = entry.p;  // Pashto form
      const pos = entry.c;   // Category (n, v, adv, adj, etc)
      
      // Extract morphology fields
      const morpho = {
        word: word,
        romanized: entry.f,
        english: entry.e,
        pos: pos,
        // Verb conjugations
        past: entry.stative || undefined,
        preterite: entry.past || undefined,
        perfective: entry.perfective || undefined,
        imperfective: entry.imperfective || undefined,
        // Noun gender/number
        gender: entry.gender || undefined,
        animacy: entry.animacy || undefined,
      };

      // Only store if has POS or other morphology
      if (pos || Object.values(morpho).some(v => v !== undefined && v !== null)) {
        posMap[word] = morpho;
        withPos++;
      }

      processed++;
      if (processed % 1000 === 0) {
        process.stdout.write('\r   ' + Math.round((processed/entries.length)*100) + '%');
      }
    });

    console.log('\r   ✅ Processed ' + processed + ' entries\n');
    console.log('📊 POS/Morphology Coverage:');
    console.log('   Words with data: ' + withPos + ' (' + ((withPos/entries.length)*100).toFixed(1) + '%)');

    // Count by POS
    const posCounts = {};
    Object.values(posMap).forEach(m => {
      if (m.pos) {
        posCounts[m.pos] = (posCounts[m.pos] || 0) + 1;
      }
    });

    console.log('\n📖 POS Distribution:');
    Object.entries(posCounts).sort((a, b) => b[1] - a[1]).forEach(([pos, count]) => {
      console.log('   ' + pos + ': ' + count);
    });

    // Write to file for Supabase ingestion
    const outputPath = path.join(process.cwd(), 'app/data/lingdocs_pos_morphology.json');
    console.log('\n💾 Writing enrichment file...');
    fs.writeFileSync(outputPath, JSON.stringify(posMap, null, 2), 'utf8');
    console.log('   ✅ Written to: app/data/lingdocs_pos_morphology.json');

    // Sample entries
    console.log('\n🔍 Sample entries with POS:');
    Object.entries(posMap).slice(0, 5).forEach(([word, data]) => {
      console.log('   ' + word + ' (' + data.romanized + ')');
      console.log('      POS: ' + data.pos + ', English: ' + data.english);
    });

    console.log('\n✅ COMPLETE!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

enrichLingDocs();

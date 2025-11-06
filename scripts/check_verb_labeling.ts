#!/usr/bin/env tsx
/**
 * Diagnostic script to check verbs_lexicon and word_frequencies tables
 * Verifies verb labeling and consistency between tables
 * 
 * Usage: tsx scripts/check_verb_labeling.ts [verb]
 * Example: tsx scripts/check_verb_labeling.ts وهل
 */

import { getD1ClientOrThrow } from '../utils/d1-helpers';

async function checkVerbLabeling(verbRoot?: string) {
  const db = getD1ClientOrThrow();
  
  console.log('🔍 Checking verb labeling in D1 database...\n');
  
  // 1. Check verbs_lexicon table structure and sample entries
  console.log('='.repeat(80));
  console.log('1. VERBS_LEXICON TABLE');
  console.log('='.repeat(80));
  
  let verbsQuery = `
    SELECT 
      id,
      verb_root,
      infinitive,
      imperfective_stem,
      perfective_stem,
      perfective_root,
      past_participle,
      pos,
      transitivity,
      verb_type,
      romanization
    FROM verbs_lexicon
  `;
  
  if (verbRoot) {
    verbsQuery += ` WHERE verb_root LIKE ? OR infinitive LIKE ? LIMIT 20`;
    const verbs = await db.query(verbsQuery, [`%${verbRoot}%`, `%${verbRoot}%`]);
    console.log(`\nFound ${verbs.length} entries matching "${verbRoot}":\n`);
    for (const verb of verbs) {
      console.log(`  ID: ${verb.id}`);
      console.log(`  verb_root: ${verb.verb_root || '(null)'}`);
      console.log(`  infinitive: ${verb.infinitive || '(null)'}`);
      console.log(`  imperfective_stem: ${verb.imperfective_stem || '(null)'}`);
      console.log(`  perfective_stem: ${verb.perfective_stem || '(null)'}`);
      console.log(`  perfective_root: ${verb.perfective_root || '(null)'}`);
      console.log(`  past_participle: ${verb.past_participle || '(null)'}`);
      console.log(`  pos: ${verb.pos || '(null)'}`);
      console.log(`  transitivity: ${verb.transitivity || '(null)'}`);
      console.log(`  verb_type: ${verb.verb_type || '(null)'}`);
      console.log(`  romanization: ${verb.romanization || '(null)'}`);
      console.log('');
    }
  } else {
    // Get total count and sample entries
    const totalCount = await db.queryFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM verbs_lexicon`
    );
    console.log(`\nTotal entries: ${totalCount?.count || 0}`);
    
    // Sample entries
    const samples = await db.query(verbsQuery + ` LIMIT 10`);
    console.log(`\nSample entries (first 10):\n`);
    for (const verb of samples) {
      console.log(`  ${verb.verb_root || verb.infinitive || 'N/A'}: pos=${verb.pos || 'NULL'}, type=${verb.verb_type || 'NULL'}`);
    }
  }
  
  // 2. Check word_frequencies for verb entries
  console.log('\n' + '='.repeat(80));
  console.log('2. WORD_FREQUENCIES TABLE (Verb Entries)');
  console.log('='.repeat(80));
  
  let freqQuery = `
    SELECT 
      id,
      pashto_word,
      frequency_count,
      frequency_total,
      pos,
      romanization
    FROM word_frequencies
    WHERE pos LIKE '%verb%' OR pos LIKE '%v.%'
  `;
  
  if (verbRoot) {
    freqQuery += ` AND (pashto_word LIKE ? OR pashto_word = ?) LIMIT 20`;
    const freqEntries = await db.query(freqQuery, [`%${verbRoot}%`, verbRoot]);
    console.log(`\nFound ${freqEntries.length} verb entries matching "${verbRoot}":\n`);
    for (const entry of freqEntries) {
      console.log(`  ID: ${entry.id}`);
      console.log(`  pashto_word: ${entry.pashto_word}`);
      console.log(`  frequency_count: ${entry.frequency_count || entry.frequency_total || 0}`);
      console.log(`  pos: ${entry.pos || '(null)'}`);
      console.log(`  romanization: ${entry.romanization || '(null)'}`);
      console.log('');
    }
  } else {
    const verbCount = await db.queryFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM word_frequencies WHERE pos LIKE '%verb%' OR pos LIKE '%v.%'`
    );
    console.log(`\nTotal verb entries: ${verbCount?.count || 0}`);
    
    // Sample verb entries
    const samples = await db.query(freqQuery + ` LIMIT 10`);
    console.log(`\nSample verb entries (first 10):\n`);
    for (const entry of samples) {
      console.log(`  ${entry.pashto_word}: freq=${entry.frequency_count || entry.frequency_total || 0}, pos=${entry.pos || 'NULL'}`);
    }
  }
  
  // 3. Check specific verb forms (e.g., وهم, وهو, etc.)
  if (verbRoot === 'وهل' || !verbRoot) {
    console.log('\n' + '='.repeat(80));
    console.log('3. CHECKING SPECIFIC FORMS FOR "وهل"');
    console.log('='.repeat(80));
    
    const forms = ['وهل', 'وهم', 'وهو', 'وهې', 'وهي', 'وهئ'];
    console.log(`\nChecking forms: ${forms.join(', ')}\n`);
    
    for (const form of forms) {
      // Check in word_frequencies
      const freqEntry = await db.queryFirst<{
        pashto_word: string;
        frequency_count: number;
        pos: string;
      }>(
        `SELECT pashto_word, frequency_count, pos FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
        [form]
      );
      
      // Check in inflections
      const inflection = await db.queryFirst<{
        inflected_form: string;
        base_word: string;
        grammatical_info: string;
        pos: string;
      }>(
        `SELECT inflected_form, base_word, grammatical_info, pos FROM inflections WHERE inflected_form = ? LIMIT 1`,
        [form]
      );
      
      console.log(`  ${form}:`);
      if (freqEntry) {
        console.log(`    ✓ In word_frequencies: freq=${freqEntry.frequency_count}, pos=${freqEntry.pos || 'NULL'}`);
      } else {
        console.log(`    ✗ NOT in word_frequencies`);
      }
      
      if (inflection) {
        console.log(`    ✓ In inflections: base=${inflection.base_word}, pos=${inflection.pos || 'NULL'}`);
        try {
          const gramInfo = JSON.parse(inflection.grammatical_info || '{}');
          console.log(`      grammatical_info: ${JSON.stringify(gramInfo)}`);
        } catch (e) {
          console.log(`      grammatical_info: ${inflection.grammatical_info}`);
        }
      } else {
        console.log(`    ✗ NOT in inflections`);
      }
      console.log('');
    }
  }
  
  // 4. Check consistency between tables
  console.log('\n' + '='.repeat(80));
  console.log('4. CONSISTENCY CHECK');
  console.log('='.repeat(80));
  
  if (verbRoot) {
    // Check if verb_root exists in verbs_lexicon
    const verbLexiconEntry = await db.queryFirst<{ verb_root: string; pos: string }>(
      `SELECT verb_root, pos FROM verbs_lexicon WHERE verb_root = ? OR infinitive = ? LIMIT 1`,
      [verbRoot, verbRoot]
    );
    
    if (verbLexiconEntry) {
      console.log(`\n✓ "${verbRoot}" found in verbs_lexicon`);
      console.log(`  pos: ${verbLexiconEntry.pos || 'NULL'}`);
      
      // Check if base form exists in word_frequencies
      const freqEntry = await db.queryFirst<{ pashto_word: string; pos: string }>(
        `SELECT pashto_word, pos FROM word_frequencies WHERE pashto_word = ? LIMIT 1`,
        [verbRoot]
      );
      
      if (freqEntry) {
        console.log(`✓ "${verbRoot}" found in word_frequencies`);
        console.log(`  pos: ${freqEntry.pos || 'NULL'}`);
        
        // Check if POS matches
        const lexiconPos = verbLexiconEntry.pos?.toLowerCase() || '';
        const freqPos = freqEntry.pos?.toLowerCase() || '';
        if (lexiconPos && freqPos && (lexiconPos.includes('verb') || lexiconPos.includes('v.')) && 
            (freqPos.includes('verb') || freqPos.includes('v.'))) {
          console.log(`✓ POS labels are consistent (both marked as verb)`);
        } else {
          console.log(`⚠ POS labels may be inconsistent:`);
          console.log(`  verbs_lexicon: ${verbLexiconEntry.pos || 'NULL'}`);
          console.log(`  word_frequencies: ${freqEntry.pos || 'NULL'}`);
        }
      } else {
        console.log(`✗ "${verbRoot}" NOT found in word_frequencies`);
      }
    } else {
      console.log(`\n✗ "${verbRoot}" NOT found in verbs_lexicon`);
    }
  }
  
  // 5. Check for verbs with missing POS labels
  console.log('\n' + '='.repeat(80));
  console.log('5. VERBS WITH MISSING/NULL POS LABELS');
  console.log('='.repeat(80));
  
  const missingPosVerbs = await db.query<{ verb_root: string; pos: string }>(
    `SELECT verb_root, pos FROM verbs_lexicon WHERE pos IS NULL OR pos = '' LIMIT 20`
  );
  
  console.log(`\nFound ${missingPosVerbs.length} verbs with NULL/empty pos in verbs_lexicon:`);
  for (const verb of missingPosVerbs.slice(0, 10)) {
    console.log(`  - ${verb.verb_root || 'N/A'}`);
  }
  
  const missingPosFreq = await db.query<{ pashto_word: string; pos: string }>(
    `SELECT pashto_word, pos FROM word_frequencies WHERE (pos IS NULL OR pos = '') AND (pashto_word LIKE '%ل' OR pashto_word LIKE '%ول' OR pashto_word LIKE '%ېدل') LIMIT 20`
  );
  
  console.log(`\nFound ${missingPosFreq.length} potential verbs with NULL/empty pos in word_frequencies:`);
  for (const entry of missingPosFreq.slice(0, 10)) {
    console.log(`  - ${entry.pashto_word}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Check complete!');
  console.log('='.repeat(80));
}

// Run the check
const verbRoot = process.argv[2];
checkVerbLabeling(verbRoot).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});


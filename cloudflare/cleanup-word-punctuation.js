#!/usr/bin/env node
/**
 * Clean up word_frequencies by removing punctuation
 * Processes in batches to avoid SQLite limitations
 */

const { execSync } = require('child_process');

const DB_NAME = 'pashto-bible-db';

async function cleanup() {
  console.log('🧹 Starting punctuation cleanup...\n');

  try {
    // Step 1: Get all words with punctuation
    console.log('📊 Fetching words with punctuation...');
    const query = `
      SELECT id, pashto_word, frequency_total, 
             frequency_afghan2023_ot, frequency_afghan2023_nt,
             frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
             romanization, pos, word_type, inflection_type, compound_type,
             base_form, english_translation, has_issues, issue_flags
      FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
         OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = ''
      ORDER BY frequency_total DESC;
    `;

    const result = execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${query.replace(/"/g, '\\"')}" --json`,
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      console.error('JSON parse error:', result.substring(0, 500));
      throw e;
    }

    const words = parsed[0]?.results || [];
    console.log(`   Found ${words.length} words with punctuation\n`);

    if (words.length === 0) {
      console.log('✅ No words with punctuation found.');
      return;
    }

    // Step 2: Group by cleaned word
    const groups = new Map();
    const punctuationOnly = [];

    for (const word of words) {
      const cleaned = word.pashto_word
        .replace(/[.,!?؟،]/g, '')
        .trim();

      if (!cleaned || cleaned === '') {
        punctuationOnly.push(word.id);
        continue;
      }

      if (!groups.has(cleaned)) {
        groups.set(cleaned, {
          cleaned,
          ids: [],
          totalFreq: 0,
          afghanOT: 0,
          afghanNT: 0,
          yousafzaiOT: 0,
          yousafzaiNT: 0,
          bestEntry: word,
        });
      }

      const group = groups.get(cleaned);
      group.ids.push(word.id);
      group.totalFreq += word.frequency_total || 0;
      group.afghanOT += word.frequency_afghan2023_ot || 0;
      group.afghanNT += word.frequency_afghan2023_nt || 0;
      group.yousafzaiOT += word.frequency_yousafzai2019_ot || 0;
      group.yousafzaiNT += word.frequency_yousafzai2019_nt || 0;

      if ((word.frequency_total || 0) > (group.bestEntry.frequency_total || 0)) {
        group.bestEntry = word;
      }
    }

    console.log(`   Grouped into ${groups.size} cleaned words`);
    console.log(`   Found ${punctuationOnly.length} punctuation-only entries\n`);

    // Step 3: Check which cleaned words already exist
    console.log('🔍 Checking for existing cleaned words...');
    const cleanedWords = Array.from(groups.keys());
    const checkQuery = `SELECT pashto_word, id, frequency_total FROM word_frequencies WHERE pashto_word IN ('${cleanedWords.join("','")}');`;
    
    const existingResult = execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${checkQuery.replace(/"/g, '\\"')}" --json`,
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );

    const existing = new Map();
    (JSON.parse(existingResult)[0]?.results || []).forEach(w => {
      existing.set(w.pashto_word, w);
    });

    console.log(`   Found ${existing.size} existing cleaned words\n`);

    // Step 4: Process updates
    console.log('⚡ Processing updates...');
    const batchSize = 100;
    const updates = [];
    const inserts = [];
    const deletes = [];

    // Delete punctuation-only entries
    if (punctuationOnly.length > 0) {
      for (let i = 0; i < punctuationOnly.length; i += batchSize) {
        const batch = punctuationOnly.slice(i, i + batchSize);
        deletes.push(`DELETE FROM word_frequencies WHERE id IN (${batch.join(',')});`);
      }
    }

    // Process groups
    for (const [cleaned, group] of groups.entries()) {
      const existingWord = existing.get(cleaned);
      
      if (existingWord) {
        // Update existing
        updates.push(`
          UPDATE word_frequencies
          SET 
            frequency_total = frequency_total + ${group.totalFreq},
            frequency_afghan2023_ot = frequency_afghan2023_ot + ${group.afghanOT},
            frequency_afghan2023_nt = frequency_afghan2023_nt + ${group.afghanNT},
            frequency_yousafzai2019_ot = frequency_yousafzai2019_ot + ${group.yousafzaiOT},
            frequency_yousafzai2019_nt = frequency_yousafzai2019_nt + ${group.yousafzaiNT},
            updated_at = strftime('%s', 'now')
          WHERE id = ${existingWord.id};
        `);
      } else {
        // Insert new
        const entry = group.bestEntry;
        const escape = (s) => s ? `'${String(s).replace(/'/g, "''")}'` : 'NULL';
        inserts.push(`
          INSERT INTO word_frequencies (
            pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
            frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
            romanization, pos, word_type, inflection_type, compound_type,
            base_form, english_translation, has_issues, issue_flags,
            created_at, updated_at
          ) VALUES (
            '${cleaned.replace(/'/g, "''")}',
            ${group.totalFreq},
            ${group.afghanOT},
            ${group.afghanNT},
            ${group.yousafzaiOT},
            ${group.yousafzaiNT},
            ${entry.frequency_rank || 0},
            ${escape(entry.romanization)},
            ${escape(entry.pos)},
            ${escape(entry.word_type)},
            ${escape(entry.inflection_type)},
            ${escape(entry.compound_type)},
            ${escape(entry.base_form)},
            ${escape(entry.english_translation)},
            ${entry.has_issues || 0},
            ${escape(entry.issue_flags || '[]')},
            strftime('%s', 'now'),
            strftime('%s', 'now')
          );
        `);
      }

      // Delete punctuated versions
      for (let i = 0; i < group.ids.length; i += batchSize) {
        const batch = group.ids.slice(i, i + batchSize);
        deletes.push(`DELETE FROM word_frequencies WHERE id IN (${batch.join(',')});`);
      }
    }

    console.log(`   Prepared: ${updates.length} updates, ${inserts.length} inserts, ${deletes.length} delete batches\n`);

    // Step 5: Execute
    const fs = require('fs');
    const path = require('path');
    
    const allSQL = [...updates, ...inserts, ...deletes].join('\n');
    const tempFile = path.join(process.cwd(), '.temp-cleanup-final.sql');
    fs.writeFileSync(tempFile, allSQL, 'utf-8');

    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    fs.unlinkSync(tempFile);

    // Step 6: Recalculate ranks
    console.log('📊 Recalculating ranks...');
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="UPDATE word_frequencies SET frequency_rank = (SELECT COUNT(*) + 1 FROM word_frequencies wf2 WHERE wf2.frequency_total > word_frequencies.frequency_total);"`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    console.log('\n✅ Cleanup complete!');
    console.log(`   - Processed ${words.length} words`);
    console.log(`   - Updated ${updates.length} existing words`);
    console.log(`   - Created ${inserts.length} new cleaned words`);
    console.log(`   - Deleted ${words.length} punctuated entries`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();


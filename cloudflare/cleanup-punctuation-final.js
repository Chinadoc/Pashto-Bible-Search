#!/usr/bin/env node
/**
 * Comprehensive punctuation cleanup:
 * 1. Find entries with punctuation
 * 2. Remove punctuation in place
 * 3. Merge duplicates
 */

const { execSync } = require('child_process');

const DB_NAME = 'pashto-bible-db';
const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function queryD1(sql) {
  const response = await fetch(`${WORKER_URL}/api/d1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Worker API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.results || [];
}

async function executeSQL(sql) {
  const fs = require('fs');
  const path = require('path');
  const tempFile = path.join(process.cwd(), `.temp-exec-${Date.now()}.sql`);
  fs.writeFileSync(tempFile, sql, 'utf-8');

  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    return true;
  } catch (error) {
    console.error('SQL execution error:', error.message);
    return false;
  } finally {
    fs.unlinkSync(tempFile);
  }
}

async function cleanup() {
  console.log('🧹 Starting comprehensive punctuation cleanup...\n');

  try {
    // Step 1: Find all entries with punctuation
    console.log('📊 Step 1: Identifying entries with punctuation...');
    const findQuery = `
      SELECT id, pashto_word, frequency_total,
             frequency_afghan2023_ot, frequency_afghan2023_nt,
             frequency_yousafzai2019_ot, frequency_yousafzai2019_nt
      FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
         OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = '';
    `;

    const entries = await queryD1(findQuery);
    console.log(`   Found ${entries.length} entries with punctuation\n`);

    if (entries.length === 0) {
      console.log('✅ No entries with punctuation found.');
      return;
    }

    // Step 2: Group by cleaned word
    console.log('🔄 Step 2: Grouping by cleaned word...');
    const groups = new Map();
    
    for (const entry of entries) {
      const cleaned = entry.pashto_word
        .replace(/[.,!?؟،]/g, '')
        .trim();

      if (!cleaned || cleaned === '') {
        continue; // Skip punctuation-only entries
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
          originalWords: [],
        });
      }

      const group = groups.get(cleaned);
      group.ids.push(entry.id);
      group.totalFreq += entry.frequency_total || 0;
      group.afghanOT += entry.frequency_afghan2023_ot || 0;
      group.afghanNT += entry.frequency_afghan2023_nt || 0;
      group.yousafzaiOT += entry.frequency_yousafzai2019_ot || 0;
      group.yousafzaiNT += entry.frequency_yousafzai2019_nt || 0;
      group.originalWords.push(entry.pashto_word);
    }

    console.log(`   Grouped into ${groups.size} unique cleaned words\n`);

    // Step 3: Process each group
    console.log('⚡ Step 3: Processing groups and merging...');
    const batchSize = 100;
    let processed = 0;
    const allGroups = Array.from(groups.entries());

    for (let i = 0; i < allGroups.length; i += batchSize) {
      const batch = allGroups.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(allGroups.length / batchSize);

      console.log(`   Processing batch ${batchNum}/${totalBatches}...`);

      const sqlStatements = [];

      for (const [cleaned, group] of batch) {
        // Check if cleaned word already exists
        const checkQuery = `SELECT id, frequency_total FROM word_frequencies WHERE pashto_word = '${cleaned.replace(/'/g, "''")}' LIMIT 1;`;
        const existing = await queryD1(checkQuery);
        const existingWord = existing[0];

        if (existingWord) {
          // Update existing word with merged frequencies
          sqlStatements.push(`
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
          // Get best entry data
          const bestEntryQuery = `SELECT * FROM word_frequencies WHERE id = ${group.ids[0]} LIMIT 1;`;
          const bestEntry = await queryD1(bestEntryQuery);
          const entry = bestEntry[0];

          if (entry) {
            const escape = (s) => s ? `'${String(s).replace(/'/g, "''")}'` : 'NULL';
            sqlStatements.push(`
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
        }

        // Delete punctuated versions
        if (group.ids.length > 0) {
          const deleteIds = group.ids.join(',');
          sqlStatements.push(`DELETE FROM word_frequencies WHERE id IN (${deleteIds});`);
        }
      }

      // Execute batch
      if (sqlStatements.length > 0) {
        const sql = sqlStatements.join('\n');
        const success = await executeSQL(sql);
        if (success) {
          processed += batch.length;
          console.log(`   ✅ Batch ${batchNum} completed`);
        } else {
          console.log(`   ⚠️  Batch ${batchNum} had errors`);
        }
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 4: Delete punctuation-only entries
    console.log('\n🗑️  Step 4: Deleting punctuation-only entries...');
    const deletePunctuationOnlySQL = `
      DELETE FROM word_frequencies
      WHERE pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = ''
         OR LENGTH(TRIM(pashto_word)) = 0;
    `;
    await executeSQL(deletePunctuationOnlySQL);

    // Step 5: Final cleanup - remove any remaining punctuation
    console.log('🧹 Step 5: Final cleanup of remaining punctuation...');
    const finalCleanupSQL = `
      UPDATE word_frequencies
      SET pashto_word = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(pashto_word), '.', ''), '،', ''), ',', ''), '!', ''), '?', ''), '؟', ''),
          updated_at = strftime('%s', 'now')
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%';
      
      DELETE FROM word_frequencies WHERE pashto_word = '' OR TRIM(pashto_word) = '';
    `;
    await executeSQL(finalCleanupSQL);

    // Step 6: Merge any duplicates created by cleaning
    console.log('🔄 Step 6: Merging duplicates...');
    const mergeDuplicatesSQL = `
      UPDATE word_frequencies wf1
      SET 
        frequency_total = (SELECT SUM(frequency_total) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
        frequency_afghan2023_ot = (SELECT SUM(frequency_afghan2023_ot) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
        frequency_afghan2023_nt = (SELECT SUM(frequency_afghan2023_nt) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
        frequency_yousafzai2019_ot = (SELECT SUM(frequency_yousafzai2019_ot) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
        frequency_yousafzai2019_nt = (SELECT SUM(frequency_yousafzai2019_nt) FROM word_frequencies wf2 WHERE wf2.pashto_word = wf1.pashto_word),
        updated_at = strftime('%s', 'now')
      WHERE wf1.id = (SELECT MIN(id) FROM word_frequencies wf3 WHERE wf3.pashto_word = wf1.pashto_word)
      AND EXISTS (SELECT 1 FROM word_frequencies wf4 WHERE wf4.pashto_word = wf1.pashto_word AND wf4.id != wf1.id);
      
      DELETE FROM word_frequencies
      WHERE id NOT IN (SELECT MIN(id) FROM word_frequencies GROUP BY pashto_word);
    `;
    await executeSQL(mergeDuplicatesSQL);

    // Step 7: Recalculate ranks
    console.log('📊 Step 7: Recalculating frequency ranks...');
    const recalcRanksSQL = `
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      );
    `;
    await executeSQL(recalcRanksSQL);

    // Step 8: Final verification
    console.log('\n🔍 Step 8: Final verification...');
    const remaining = await queryD1(findQuery);
    const totalWords = await queryD1('SELECT COUNT(*) as total FROM word_frequencies;');

    console.log('\n✅ Cleanup complete!');
    console.log(`   - Processed: ${processed} groups`);
    console.log(`   - Total words in database: ${totalWords[0]?.total || 0}`);
    console.log(`   - Remaining entries with punctuation: ${remaining.length}`);

    if (remaining.length > 0) {
      console.log(`\n⚠️  ${remaining.length} entries still have punctuation.`);
      console.log('   Sample entries:', remaining.slice(0, 5).map(e => e.pashto_word).join(', '));
    } else {
      console.log('\n🎉 All punctuation has been removed!');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

cleanup();


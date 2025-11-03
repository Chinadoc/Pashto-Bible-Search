#!/usr/bin/env node
/**
 * Batched cleanup of word_frequencies punctuation
 * Processes in 10 sequential batches to handle large datasets
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

async function cleanup() {
  console.log('🧹 Starting batched punctuation cleanup (10 batches)...\n');

  try {
    // Step 1: Get count of words with punctuation
    console.log('📊 Counting words with punctuation...');
    const countQuery = `
      SELECT COUNT(*) as total FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
         OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = '';
    `;

    const countResults = await queryD1(countQuery);
    const total = countResults[0]?.total || 0;
    console.log(`   Found ${total} words with punctuation\n`);

    if (total === 0) {
      console.log('✅ No words with punctuation found.');
      return;
    }

    const batchSize = Math.ceil(total / 10);
    console.log(`   Processing in 10 batches of ~${batchSize} words each\n`);

    // Step 2: Process in batches
    // Use a different approach: get IDs first, then process those specific IDs
    let processedCount = 0;
    
    for (let batchNum = 1; batchNum <= 10 && processedCount < total; batchNum++) {
      console.log(`\n📦 Batch ${batchNum}/10:`);
      
      // Get batch of IDs (not affected by deletions)
      const idsQuery = `
        SELECT id FROM word_frequencies
        WHERE pashto_word LIKE '%.%' 
           OR pashto_word LIKE '%,%'
           OR pashto_word LIKE '%!%'
           OR pashto_word LIKE '%?%'
           OR pashto_word LIKE '%؟%'
           OR pashto_word LIKE '%،%'
           OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
           OR TRIM(pashto_word) = ''
        ORDER BY frequency_total DESC
        LIMIT ${batchSize};
      `;

      const idResults = await queryD1(idsQuery);
      const ids = idResults.map(r => r.id);

      if (ids.length === 0) {
        console.log(`   No more words to process`);
        break;
      }

      // Get full data for these IDs
      const batchQuery = `
        SELECT id, pashto_word, frequency_total, 
               frequency_afghan2023_ot, frequency_afghan2023_nt,
               frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
               romanization, pos, word_type, inflection_type, compound_type,
               base_form, english_translation, has_issues, issue_flags
        FROM word_frequencies
        WHERE id IN (${ids.join(',')});
      `;

      console.log(`   Fetching batch...`);
      const words = await queryD1(batchQuery);

      if (words.length === 0) {
        console.log(`   No more words to process`);
        break;
      }

      console.log(`   Processing ${words.length} words...`);

      // Group by cleaned word
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

      console.log(`   Grouped into ${groups.size} cleaned words, ${punctuationOnly.length} punctuation-only`);

      // Build SQL for this batch
      const sqlStatements = [];

      // Delete punctuation-only entries
      if (punctuationOnly.length > 0) {
        const deleteIds = punctuationOnly.join(',');
        sqlStatements.push(`DELETE FROM word_frequencies WHERE id IN (${deleteIds});`);
      }

      // Process groups
      for (const [cleaned, group] of groups.entries()) {
        // Check if cleaned word exists
        const checkQuery = `SELECT id, frequency_total FROM word_frequencies WHERE pashto_word = '${cleaned.replace(/'/g, "''")}' LIMIT 1;`;
        const checkResults = await queryD1(checkQuery);
        const existing = checkResults[0];

        if (existing) {
          // Update existing
          sqlStatements.push(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ${group.totalFreq},
              frequency_afghan2023_ot = frequency_afghan2023_ot + ${group.afghanOT},
              frequency_afghan2023_nt = frequency_afghan2023_nt + ${group.afghanNT},
              frequency_yousafzai2019_ot = frequency_yousafzai2019_ot + ${group.yousafzaiOT},
              frequency_yousafzai2019_nt = frequency_yousafzai2019_nt + ${group.yousafzaiNT},
              updated_at = strftime('%s', 'now')
            WHERE id = ${existing.id};
          `);
        } else {
          // Insert new
          const entry = group.bestEntry;
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

        // Delete punctuated versions
        if (group.ids.length > 0) {
          const deleteIds = group.ids.join(',');
          sqlStatements.push(`DELETE FROM word_frequencies WHERE id IN (${deleteIds});`);
        }
      }

      // Execute batch
      if (sqlStatements.length > 0) {
        const fs = require('fs');
        const path = require('path');
        const tempFile = path.join(process.cwd(), `.temp-batch-${batchNum}.sql`);
        fs.writeFileSync(tempFile, sqlStatements.join('\n'), 'utf-8');

        try {
          execSync(
            `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
            { maxBuffer: 50 * 1024 * 1024 }
          );
          console.log(`   ✅ Batch ${batchNum} processed successfully (${words.length} words)`);
          processedCount += words.length;
          fs.unlinkSync(tempFile);
        } catch (error) {
          console.error(`   ❌ Error processing batch ${batchNum}:`, error.message);
          fs.unlinkSync(tempFile);
        }
      } else {
        console.log(`   ⚠️  No SQL statements generated for batch ${batchNum}`);
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Step 3: Recalculate ranks
    console.log('\n📊 Recalculating frequency ranks...');
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="UPDATE word_frequencies SET frequency_rank = (SELECT COUNT(*) + 1 FROM word_frequencies wf2 WHERE wf2.frequency_total > word_frequencies.frequency_total);"`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    // Step 4: Final verification
    console.log('\n🔍 Final verification...');
    const finalCountResults = await queryD1(countQuery);
    const remaining = finalCountResults[0]?.total || 0;

    console.log('\n✅ Cleanup complete!');
    console.log(`   - Processed batches: 10`);
    console.log(`   - Remaining entries with punctuation: ${remaining}`);

    if (remaining > 0) {
      console.log(`\n⚠️  ${remaining} entries still have punctuation. You may need to run the cleanup again.`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

cleanup();


#!/usr/bin/env node
/**
 * Process entries one by one to ensure punctuation is removed
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

function escapeSQL(str) {
  return str ? `'${String(str).replace(/'/g, "''")}'` : 'NULL';
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

function cleanWord(word) {
  return word
    .replace(/[.,!?؟،]/g, '')
    .trim();
}

async function cleanup() {
  console.log('🧹 Starting individual entry cleanup...\n');

  try {
    // Get all entries with punctuation
    const entries = await queryD1(`
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
         OR TRIM(pashto_word) = '';
    `);

    console.log(`Found ${entries.length} entries with punctuation\n`);

    if (entries.length === 0) {
      console.log('✅ No entries with punctuation found.');
      return;
    }

    // Group by cleaned word
    const groups = new Map();
    
    for (const entry of entries) {
      const cleaned = cleanWord(entry.pashto_word);
      
      if (!cleaned || cleaned === '') {
        continue;
      }

      if (!groups.has(cleaned)) {
        groups.set(cleaned, {
          cleaned,
          entries: [],
        });
      }

      groups.get(cleaned).entries.push(entry);
    }

    console.log(`Grouped into ${groups.size} cleaned words\n`);

    // Process in batches
    const batchSize = 50;
    const allGroups = Array.from(groups.entries());
    let processed = 0;

    for (let i = 0; i < allGroups.length; i += batchSize) {
      const batch = allGroups.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(allGroups.length / batchSize);

      console.log(`Processing batch ${batchNum}/${totalBatches}...`);

      const sqlStatements = [];

      for (const [cleaned, group] of batch) {
        // Calculate totals
        const totals = {
          totalFreq: 0,
          afghanOT: 0,
          afghanNT: 0,
          yousafzaiOT: 0,
          yousafzaiNT: 0,
        };

        let bestEntry = group.entries[0];
        for (const entry of group.entries) {
          totals.totalFreq += entry.frequency_total || 0;
          totals.afghanOT += entry.frequency_afghan2023_ot || 0;
          totals.afghanNT += entry.frequency_afghan2023_nt || 0;
          totals.yousafzaiOT += entry.frequency_yousafzai2019_ot || 0;
          totals.yousafzaiNT += entry.frequency_yousafzai2019_nt || 0;
          
          if ((entry.frequency_total || 0) > (bestEntry.frequency_total || 0)) {
            bestEntry = entry;
          }
        }

        // Check if cleaned word exists
        const existing = await queryD1(`SELECT id, frequency_total FROM word_frequencies WHERE pashto_word = ${escapeSQL(cleaned)} LIMIT 1;`);
        const existingWord = existing[0];

        const idsToDelete = group.entries.map(e => e.id).join(',');

        if (existingWord) {
          // Update existing
          sqlStatements.push(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ${totals.totalFreq},
              frequency_afghan2023_ot = frequency_afghan2023_ot + ${totals.afghanOT},
              frequency_afghan2023_nt = frequency_afghan2023_nt + ${totals.afghanNT},
              frequency_yousafzai2019_ot = frequency_yousafzai2019_ot + ${totals.yousafzaiOT},
              frequency_yousafzai2019_nt = frequency_yousafzai2019_nt + ${totals.yousafzaiNT},
              updated_at = strftime('%s', 'now')
            WHERE id = ${existingWord.id};
          `);
        } else {
          // Insert new
          sqlStatements.push(`
            INSERT INTO word_frequencies (
              pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
              frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
              romanization, pos, word_type, inflection_type, compound_type,
              base_form, english_translation, has_issues, issue_flags,
              created_at, updated_at
            ) VALUES (
              ${escapeSQL(cleaned)},
              ${totals.totalFreq},
              ${totals.afghanOT},
              ${totals.afghanNT},
              ${totals.yousafzaiOT},
              ${totals.yousafzaiNT},
              ${bestEntry.frequency_rank || 0},
              ${escapeSQL(bestEntry.romanization)},
              ${escapeSQL(bestEntry.pos)},
              ${escapeSQL(bestEntry.word_type)},
              ${escapeSQL(bestEntry.inflection_type)},
              ${escapeSQL(bestEntry.compound_type)},
              ${escapeSQL(bestEntry.base_form)},
              ${escapeSQL(bestEntry.english_translation)},
              ${bestEntry.has_issues || 0},
              ${escapeSQL(bestEntry.issue_flags || '[]')},
              strftime('%s', 'now'),
              strftime('%s', 'now')
            );
          `);
        }

        // Delete punctuated versions
        sqlStatements.push(`DELETE FROM word_frequencies WHERE id IN (${idsToDelete});`);
      }

      // Execute batch
      if (sqlStatements.length > 0) {
        const sql = sqlStatements.join('\n');
        const success = await executeSQL(sql);
        if (success) {
          processed += batch.length;
          console.log(`   ✅ Batch ${batchNum} completed`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Final cleanup
    console.log('\n🧹 Final cleanup...');
    await executeSQL(`
      DELETE FROM word_frequencies
      WHERE pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = '';
      
      UPDATE word_frequencies
      SET pashto_word = TRIM(pashto_word)
      WHERE pashto_word != TRIM(pashto_word);
    `);

    // Recalculate ranks
    console.log('📊 Recalculating ranks...');
    await executeSQL(`
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      );
    `);

    // Verify
    const remaining = await queryD1(`
      SELECT COUNT(*) as total FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
         OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = '';
    `);

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Processed: ${processed} groups`);
    console.log(`   - Remaining entries with punctuation: ${remaining[0]?.total || 0}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();


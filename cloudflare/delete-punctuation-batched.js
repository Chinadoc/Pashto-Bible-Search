#!/usr/bin/env node
/**
 * Batched cleanup - processes deletions in small batches to ensure they execute
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
  console.log('🧹 Starting final punctuation cleanup...\n');

  try {
    // Get all IDs with punctuation
    const idsQuery = `
      SELECT id FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
         OR pashto_word IN ('.', '،', ',', '!', '?', '؟')
         OR TRIM(pashto_word) = '';
    `;

    const allIds = await queryD1(idsQuery);
    const ids = allIds.map(r => r.id);
    console.log(`Found ${ids.length} entries to delete\n`);

    if (ids.length === 0) {
      console.log('✅ No entries with punctuation found.');
      return;
    }

    // Delete in batches of 500
    const batchSize = 500;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(ids.length / batchSize);
      
      console.log(`Deleting batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);
      
      const deleteSQL = `DELETE FROM word_frequencies WHERE id IN (${batch.join(',')});`;
      
      const fs = require('fs');
      const path = require('path');
      const tempFile = path.join(process.cwd(), `.temp-delete-${batchNum}.sql`);
      fs.writeFileSync(tempFile, deleteSQL, 'utf-8');

      try {
        execSync(
          `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
          { maxBuffer: 50 * 1024 * 1024 }
        );
        console.log(`   ✅ Batch ${batchNum} deleted`);
        fs.unlinkSync(tempFile);
      } catch (error) {
        console.error(`   ❌ Error deleting batch ${batchNum}:`, error.message);
        fs.unlinkSync(tempFile);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Recalculate ranks
    console.log('\n📊 Recalculating ranks...');
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="UPDATE word_frequencies SET frequency_rank = (SELECT COUNT(*) + 1 FROM word_frequencies wf2 WHERE wf2.frequency_total > word_frequencies.frequency_total);"`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    // Final check
    const remaining = await queryD1(idsQuery);
    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Deleted: ${ids.length} entries`);
    console.log(`   - Remaining: ${remaining.length} entries with punctuation`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

cleanup();


#!/usr/bin/env ts-node
/**
 * Clean up word_frequencies table by removing punctuation and merging frequencies
 * 
 * This script:
 * 1. Finds all words with punctuation (., ،, !, ?)
 * 2. Groups them by their cleaned version (without punctuation)
 * 3. Sums their frequencies
 * 4. Updates the database to keep only the cleaned version with merged frequencies
 * 5. Deletes the entries with punctuation
 */

import { execSync } from 'child_process';

const DB_NAME = 'pashto-bible-db';

// Punctuation marks to remove
const PUNCTUATION = /[.،!?؟]/g;

async function main() {
  console.log('🧹 Starting word frequency cleanup...\n');

  try {
    // Step 1: Get all words with punctuation
    console.log('📊 Step 1: Finding words with punctuation...');
    const queryWithPunctuation = `
      SELECT 
        id,
        pashto_word,
        frequency_total,
        frequency_afghan2023_ot,
        frequency_afghan2023_nt,
        frequency_yousafzai2019_ot,
        frequency_yousafzai2019_nt,
        frequency_rank,
        romanization,
        pos,
        word_type,
        inflection_type,
        compound_type,
        base_form,
        english_translation,
        has_issues,
        issue_flags
      FROM word_frequencies
      WHERE pashto_word LIKE '%.%' 
         OR pashto_word LIKE '%,%'
         OR pashto_word LIKE '%!%'
         OR pashto_word LIKE '%?%'
         OR pashto_word LIKE '%؟%'
         OR pashto_word LIKE '%،%'
      ORDER BY frequency_total DESC;
    `;

    const result = execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${queryWithPunctuation.replace(/"/g, '\\"')}" --json`,
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );

    const wordsWithPunctuation = JSON.parse(result);
    const words = wordsWithPunctuation[0]?.results || [];

    console.log(`   Found ${words.length} words with punctuation\n`);

    if (words.length === 0) {
      console.log('✅ No words with punctuation found. Nothing to clean up.');
      return;
    }

    // Step 2: Group by cleaned word and sum frequencies
    console.log('🔄 Step 2: Grouping and merging frequencies...');
    const wordGroups = new Map<string, {
      ids: number[];
      cleanedWord: string;
      totalFrequency: number;
      afghan2023_ot: number;
      afghan2023_nt: number;
      yousafzai2019_ot: number;
      yousafzai2019_nt: number;
      bestEntry: any; // Keep the entry with highest frequency as the base
      allEntries: any[];
    }>();

    for (const word of words) {
      const cleanedWord = word.pashto_word.replace(PUNCTUATION, '').trim();
      
      if (!cleanedWord) {
        console.warn(`   ⚠️  Skipping word that becomes empty after cleaning: "${word.pashto_word}"`);
        continue;
      }

      if (!wordGroups.has(cleanedWord)) {
        wordGroups.set(cleanedWord, {
          ids: [],
          cleanedWord,
          totalFrequency: 0,
          afghan2023_ot: 0,
          afghan2023_nt: 0,
          yousafzai2019_ot: 0,
          yousafzai2019_nt: 0,
          bestEntry: word,
          allEntries: [],
        });
      }

      const group = wordGroups.get(cleanedWord)!;
      group.ids.push(word.id);
      group.totalFrequency += word.frequency_total || 0;
      group.afghan2023_ot += word.frequency_afghan2023_ot || 0;
      group.afghan2023_nt += word.frequency_afghan2023_nt || 0;
      group.yousafzai2019_ot += word.frequency_yousafzai2019_ot || 0;
      group.yousafzai2019_nt += word.frequency_yousafzai2019_nt || 0;
      group.allEntries.push(word);

      // Keep the entry with highest frequency as the base
      if ((word.frequency_total || 0) > (group.bestEntry.frequency_total || 0)) {
        group.bestEntry = word;
      }
    }

    console.log(`   Grouped into ${wordGroups.size} unique cleaned words\n`);

    // Step 3: Check if cleaned words already exist
    console.log('🔍 Step 3: Checking for existing cleaned words...');
    const cleanedWords = Array.from(wordGroups.keys());
    const placeholders = cleanedWords.map(() => '?').join(',');
    const checkExistingQuery = `
      SELECT pashto_word, frequency_total, id
      FROM word_frequencies
      WHERE pashto_word IN (${placeholders});
    `;

    const existingResult = execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${checkExistingQuery.replace(/"/g, '\\"')}" --json`,
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );

    const existingWords = JSON.parse(existingResult);
    const existingMap = new Map<string, any>();
    (existingWords[0]?.results || []).forEach((w: any) => {
      existingMap.set(w.pashto_word, w);
    });

    console.log(`   Found ${existingMap.size} existing cleaned words\n`);

    // Step 4: Process each group
    console.log('📝 Step 4: Processing updates...');
    let updated = 0;
    let created = 0;
    let deleted = 0;
    const batches: string[] = [];

    for (const [cleanedWord, group] of wordGroups.entries()) {
      const existing = existingMap.get(cleanedWord);
      const bestEntry = group.bestEntry;

      if (existing) {
        // Update existing word with merged frequencies
        const newTotalFreq = existing.frequency_total + group.totalFrequency;
        const newAfghanOT = (existing.frequency_afghan2023_ot || 0) + group.afghan2023_ot;
        const newAfghanNT = (existing.frequency_afghan2023_nt || 0) + group.afghan2023_nt;
        const newYousafzaiOT = (existing.frequency_yousafzai2019_ot || 0) + group.yousafzai2019_ot;
        const newYousafzaiNT = (existing.frequency_yousafzai2019_nt || 0) + group.yousafzai2019_nt;

        const updateSQL = `
          UPDATE word_frequencies
          SET 
            frequency_total = ${newTotalFreq},
            frequency_afghan2023_ot = ${newAfghanOT},
            frequency_afghan2023_nt = ${newAfghanNT},
            frequency_yousafzai2019_ot = ${newYousafzaiOT},
            frequency_yousafzai2019_nt = ${newYousafzaiNT},
            updated_at = strftime('%s', 'now')
          WHERE id = ${existing.id};
        `;
        batches.push(updateSQL);
        updated++;
      } else {
        // Create new entry with cleaned word
        const insertSQL = `
          INSERT INTO word_frequencies (
            pashto_word,
            frequency_total,
            frequency_afghan2023_ot,
            frequency_afghan2023_nt,
            frequency_yousafzai2019_ot,
            frequency_yousafzai2019_nt,
            frequency_rank,
            romanization,
            pos,
            word_type,
            inflection_type,
            compound_type,
            base_form,
            english_translation,
            has_issues,
            issue_flags,
            created_at,
            updated_at
          ) VALUES (
            '${cleanedWord.replace(/'/g, "''")}',
            ${group.totalFrequency},
            ${group.afghan2023_ot},
            ${group.afghan2023_nt},
            ${group.yousafzai2019_ot},
            ${group.yousafzai2019_nt},
            ${bestEntry.frequency_rank || 0},
            ${bestEntry.romanization ? `'${String(bestEntry.romanization).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.pos ? `'${String(bestEntry.pos).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.word_type ? `'${String(bestEntry.word_type).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.inflection_type ? `'${String(bestEntry.inflection_type).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.compound_type ? `'${String(bestEntry.compound_type).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.base_form ? `'${String(bestEntry.base_form).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.english_translation ? `'${String(bestEntry.english_translation).replace(/'/g, "''")}'` : 'NULL'},
            ${bestEntry.has_issues || 0},
            ${bestEntry.issue_flags ? `'${String(bestEntry.issue_flags).replace(/'/g, "''")}'` : "'[]'"},
            strftime('%s', 'now'),
            strftime('%s', 'now')
          );
        `;
        batches.push(insertSQL);
        created++;
      }

      // Delete all entries with punctuation
      const idsToDelete = group.ids.join(',');
      const deleteSQL = `DELETE FROM word_frequencies WHERE id IN (${idsToDelete});`;
      batches.push(deleteSQL);
      deleted += group.ids.length;
    }

    console.log(`   Prepared: ${updated} updates, ${created} inserts, ${deleted} deletions\n`);

    // Step 5: Execute updates in batches
    console.log('⚡ Step 5: Executing updates...');
    const batchSize = 50;
    for (let i = 0; i < batches.length; i += batchSize) {
      const batch = batches.slice(i, i + batchSize);
      const sql = batch.join('\n');
      
      const fs = await import('fs/promises');
      const path = await import('path');
      const tempFile = path.join(process.cwd(), `.temp-cleanup-${i}.sql`);
      await fs.writeFile(tempFile, sql, 'utf-8');

      try {
        execSync(
          `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
          { maxBuffer: 50 * 1024 * 1024 }
        );
        console.log(`   ✓ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(batches.length / batchSize)}`);
      } catch (error: any) {
        console.error(`   ✗ Error in batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      } finally {
        await fs.unlink(tempFile).catch(() => {});
      }
    }

    // Step 6: Recalculate ranks
    console.log('\n📊 Step 6: Recalculating frequency ranks...');
    const recalcRanksSQL = `
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      );
    `;

    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --command="${recalcRanksSQL.replace(/"/g, '\\"')}"`,
      { maxBuffer: 50 * 1024 * 1024 }
    );

    console.log('✅ Cleanup complete!\n');
    console.log(`📈 Summary:`);
    console.log(`   - Updated: ${updated} existing words`);
    console.log(`   - Created: ${created} new cleaned words`);
    console.log(`   - Deleted: ${deleted} entries with punctuation`);
    console.log(`   - Total words processed: ${words.length}`);

  } catch (error: any) {
    console.error('❌ Error during cleanup:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}


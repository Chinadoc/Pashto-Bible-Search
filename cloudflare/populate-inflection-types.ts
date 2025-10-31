/**
 * Populate Inflection Types for Nouns/Adjectives
 * 
 * Based on: https://grammar.lingdocs.com/inflection/inflection-intro/
 * 
 * Inflection types:
 * - plain: Base form (no inflection endings)
 * - 1st: Direct case (ends with ې, ي, or ه)
 * - 2nd: Oblique case (ends with و, یو, or يو)
 * 
 * This script:
 * 1. Queries word_frequencies for nouns/adjectives via Worker API
 * 2. Determines inflection type for each word form
 * 3. Generates UPDATE SQL to populate inflection_type column
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// 1st inflection endings (direct case)
const FIRST_INFLECTION_ENDINGS = ['ې', 'ي', 'ه'];

// 2nd inflection endings (oblique case)  
const SECOND_INFLECTION_ENDINGS = ['و', 'یو', 'يو'];

/**
 * Determine inflection type for a word based on its ending
 * Based on LingDocs inflection rules: https://grammar.lingdocs.com/inflection/inflection-intro/
 */
function determineInflectionType(word: string, baseWord?: string | null): 'plain' | '1st' | '2nd' {
  // If we have a base word and word differs, it's definitely inflected
  if (baseWord && word !== baseWord) {
    // Determine which type of inflection
    // Check 2nd inflection first (longer endings, more specific)
    for (const ending of SECOND_INFLECTION_ENDINGS) {
      if (word.endsWith(ending) && !baseWord.endsWith(ending)) {
        return '2nd';
      }
    }
    
    // Check 1st inflection
    for (const ending of FIRST_INFLECTION_ENDINGS) {
      if (word.endsWith(ending) && !baseWord.endsWith(ending)) {
        return '1st';
      }
    }
    
    // Word differs from base but doesn't match typical endings
    // Could be irregular inflection - mark as 1st (most common)
    return '1st';
  }
  
  // No base word available - infer from word ending
  // Check 2nd inflection endings
  for (const ending of SECOND_INFLECTION_ENDINGS) {
    if (word.endsWith(ending)) {
      // Exception: وو is often part of verb forms, not 2nd inflection
      if (word.endsWith('وو')) {
        continue;
      }
      // Exception: some words naturally end with و (like کړو)
      // But for nouns/adjectives, ending with و is usually 2nd inflection
      if (word.length >= 3) {
        return '2nd';
      }
    }
  }
  
  // Check 1st inflection endings
  // ې and ه are strong indicators of 1st inflection
  if (word.endsWith('ې') || word.endsWith('ه')) {
    if (word.length >= 3) {
      return '1st';
    }
  }
  
  // ي is trickier - can be part of base form or inflection
  // If word is 4+ chars and ends in ي, likely 1st inflection
  if (word.endsWith('ي') && word.length >= 4) {
    // Check if it's a common base ending (like -ی words)
    // Many nouns end in ي naturally, so be conservative
    // Only mark as 1st if it's clearly an inflection pattern
    const secondToLast = word[word.length - 2];
    // If preceded by a vowel marker, might be inflection
    if (secondToLast === 'و' || secondToLast === 'ې') {
      return '1st';
    }
  }
  
  // Default to plain (base form)
  return 'plain';
}

/**
 * Get base word for a form via Worker API
 */
async function getBaseWord(form: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${CLOUDFLARE_WORKER_URL}/api/inflections/reverse?form=${encodeURIComponent(form)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.base_word || null;
    }
  } catch (error) {
    // Silently fail
  }
  
  return null;
}

/**
 * Query D1 for nouns/adjectives using wrangler
 */
async function queryWordsFromD1(): Promise<Array<{ pashto_word: string; pos: string | null; word_type: string | null; inflection_type: string | null }>> {
  console.log('📖 Querying word_frequencies from D1...');
  
  const querySql = `
SELECT pashto_word, pos, word_type, inflection_type
FROM word_frequencies
WHERE (word_type IN ('noun', 'adjective')
   OR pos LIKE '%noun%'
   OR pos LIKE '%adj%'
   OR pos LIKE '%n.%'
   OR pos LIKE '%a.%')
ORDER BY frequency_total DESC
LIMIT 10000;
`;
  
  const sqlPath = join(process.cwd(), '.temp-query-inflection-types.sql');
  writeFileSync(sqlPath, querySql, 'utf-8');
  
  try {
    // Execute query and capture JSON output
    const output = execSync(
      `wrangler d1 execute pashto-bible-db --remote --file=${sqlPath} --json`,
      { encoding: 'utf-8', cwd: process.cwd() }
    );
    
    const result = JSON.parse(output);
    const words = result[0]?.results || [];
    
    console.log(`   ✅ Found ${words.length} nouns/adjectives`);
    return words;
  } catch (error) {
    console.error('❌ Failed to query D1:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Populating Inflection Types for Nouns/Adjectives\n');
  console.log('Based on: https://grammar.lingdocs.com/inflection/inflection-intro/\n');
  
  // Step 1: Query words from D1
  const words = await queryWordsFromD1();
  
  if (words.length === 0) {
    console.error('❌ No words found to process');
    return;
  }
  
  // Step 2: Process words and determine inflection types
  console.log(`\n🔍 Processing ${words.length} words...`);
  
  const updates: Array<{ word: string; inflectionType: string; hasBase: boolean }> = [];
  const skipExisting = !process.argv.includes('--force');
  
  let processed = 0;
  let skipped = 0;
  
  for (const wordRow of words) {
    const word = wordRow.pashto_word;
    if (!word || word.length < 2) {
      skipped++;
      continue;
    }
    
    // Skip if already has inflection_type (unless --force)
    if (skipExisting && wordRow.inflection_type) {
      skipped++;
      continue;
    }
    
    // Try to get base word
    const baseWord = await getBaseWord(word);
    const inflectionType = determineInflectionType(word, baseWord);
    
    updates.push({
      word,
      inflectionType,
      hasBase: !!baseWord,
    });
    
    processed++;
    if (processed % 100 === 0) {
      console.log(`   ✅ Processed ${processed}/${words.length} words (${updates.length} updates, ${skipped} skipped)`);
    }
    
    // Rate limiting for API calls
    if (processed % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total words: ${words.length}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Updates needed: ${updates.length}`);
  
  // Step 3: Generate UPDATE SQL
  console.log(`\n📝 Generating UPDATE SQL...`);
  
  const updateSql: string[] = [];
  updateSql.push('-- Update inflection_type for nouns and adjectives');
  updateSql.push(`-- Generated: ${new Date().toISOString()}`);
  updateSql.push(`-- Based on: https://grammar.lingdocs.com/inflection/inflection-intro/`);
  updateSql.push(`-- Total updates: ${updates.length}`);
  updateSql.push('');
  
  const typeCounts = { plain: 0, '1st': 0, '2nd': 0 };
  const withBase = updates.filter(u => u.hasBase).length;
  
  for (const update of updates) {
    typeCounts[update.inflectionType as keyof typeof typeCounts]++;
    
    updateSql.push(`UPDATE word_frequencies`);
    updateSql.push(`SET inflection_type = '${update.inflectionType}'`);
    updateSql.push(`WHERE pashto_word = '${update.word.replace(/'/g, "''")}';`);
    updateSql.push('');
  }
  
  const updateSqlPath = join(process.cwd(), '.temp-update-inflection-types.sql');
  writeFileSync(updateSqlPath, updateSql.join('\n'), 'utf-8');
  
  console.log(`✅ UPDATE SQL created: ${updateSqlPath}`);
  console.log(`\n📊 Inflection type distribution:`);
  console.log(`   Plain: ${typeCounts.plain}`);
  console.log(`   1st inflection: ${typeCounts['1st']}`);
  console.log(`   2nd inflection: ${typeCounts['2nd']}`);
  console.log(`   Words with base form mapping: ${withBase}`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${updateSqlPath}`);
}

main().catch(console.error);

/**
 * Normalize Pashto Y-Endings according to LingDocs Five Yeys
 * 
 * Reference: https://grammar.lingdocs.com/writing/the-five-yeys/
 * 
 * Standard Afghan Pashto uses:
 * - ی (U+06CC) - "ay" sound at end of words (e.g., خدای)
 * - ې (U+06D0) - "e" sound at end of feminine words
 * - ي (U+064A) - "ee" sound at end of inflected masculine words
 * - ۍ (U+06CD) - "uy" sound at end of feminine nouns/adjectives
 * - ئ (U+0626) - "ey" sound in 2nd person plural verb endings (e.g., شئ)
 * 
 * Pakistani variants that should normalize to Afghan standard:
 * - ئ (U+0626) at end of words representing "ay" → ی (U+06CC) [e.g., خدائ → خدای]
 * - ے (U+06D2) at end of words representing "ay" → ی (U+06CC) [e.g., چائ → چای]
 * 
 * BUT preserve ئ in 2nd person plural verb endings!
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Standard Afghan Pashto ی (U+06CC) - "ay" sound
const STANDARD_Y = '\u06CC'; // ی

// Pakistani variants that should normalize to ی
const PAKISTANI_AY_VARIANTS = [
  '\u0626', // ئ - used in Pakistan for "ay" endings (should be ی)
  '\u06D2', // ے - Urdu Yeh Barree used for "ay" in Pakistan (should be ی)
];

// Common 2nd person plural verb endings that should preserve ئ
// These are exact verb forms, not words that just end with these patterns
const PRESERVE_EY_VERBS = new Set([
  'شئ', 'کړئ', 'وکړئ', 'ځئ', 'راځئ', 'راشئ', 'یئ', 'وئ',
  'وایئ', 'ووایئ', 'غواړئ', 'پرېږدئ', 'ساتئ', 'ورکړئ', 'وګورئ', 'ګورئ',
  'اوسئ', 'پوهېږئ', 'ونیسئ', 'خورئ', 'لرئ', 'کېنئ',
]);

function normalizeYEndings(word: string): string {
  /**
   * Normalize Pakistani y-ending variants to Afghan standard ی
   * 
   * Rules:
   * 1. Words ending with ئ (U+0626) → ی (U+06CC) UNLESS it's an exact 2nd person plural verb
   * 2. Words ending with ے (U+06D2) → ی (U+06CC)
   * 3. Preserve ئ only in exact verb forms (e.g., "شئ", "کړئ")
   * 
   * Note: Words like "هغوئ", "زوئ", "ځائ" should normalize to "هغوی", "زوی", "ځای"
   * because they're not verb forms, they're pronouns/nouns with Pakistani spelling.
   */
  let normalized = word;
  
  // Check if this is an exact verb form that should preserve ئ
  const isExactVerbForm = PRESERVE_EY_VERBS.has(word);
  
  if (!isExactVerbForm) {
    // Normalize ئ at end of words to ی (Pakistani "ay" → Afghan "ay")
    // Examples: خدائ → خدای, هغوئ → هغوی, ځائ → ځای
    if (word.endsWith('\u0626')) { // ئ
      normalized = normalized.slice(0, -1) + STANDARD_Y;
    }
    
    // Normalize ے at end of words to ی (Urdu "ay" → Afghan "ay")
    // Examples: کېدے → کېدی (if it's feminine form)
    if (word.endsWith('\u06D2')) { // ے
      normalized = normalized.slice(0, -1) + STANDARD_Y;
    }
    
    // Also handle ئ and ے in the middle of words (for compound words)
    // But be more careful - only normalize if context suggests "ay" sound
    // This handles cases like compound words with ئ in the middle
    normalized = normalized.replace(/\u0626([^ئ\u06CC])/g, STANDARD_Y + '$1'); // ئ followed by non-ئ, non-ی
    normalized = normalized.replace(/\u06D2([^\u06D2\u06CC])/g, STANDARD_Y + '$1'); // ے followed by non-ے, non-ی
  }
  
  return normalized;
}

async function getAllWords(): Promise<Map<string, number>> {
  console.log('📖 Fetching all words from word_frequencies...');
  
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total FROM word_frequencies;" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const words = data.results || [];
  
  console.log(`✅ Loaded ${words.length} words`);
  
  const wordMap = new Map<string, number>();
  for (const word of words) {
    wordMap.set(word.pashto_word, word.frequency_total);
  }
  
  return wordMap;
}

async function mergeYVariants(): Promise<void> {
  console.log('🔄 Normalizing Y-Endings in Word Frequencies\n');
  console.log('='.repeat(70));
  
  // Get all words
  const wordMap = await getAllWords();
  
  // Group words by normalized form
  const normalizedGroups = new Map<string, {
    words: string[];
    totalFrequency: number;
  }>();
  
  for (const [word, frequency] of wordMap) {
    const normalized = normalizeYEndings(word);
    
    if (!normalizedGroups.has(normalized)) {
      normalizedGroups.set(normalized, {
        words: [],
        totalFrequency: 0,
      });
    }
    
    const group = normalizedGroups.get(normalized)!;
    group.words.push(word);
    group.totalFrequency += frequency;
  }
  
  // Find variants that need merging
  const variants: Array<{
    baseForm: string;
    variants: string[];
    totalFrequency: number;
  }> = [];
  
  for (const [normalized, group] of normalizedGroups) {
    if (group.words.length > 1) {
      variants.push({
        baseForm: normalized,
        variants: group.words,
        totalFrequency: group.totalFrequency,
      });
    }
  }
  
  console.log(`\n📊 Found ${variants.length} words with y-ending variants\n`);
  console.log('Examples of words to merge:');
  
  for (let i = 0; i < Math.min(10, variants.length); i++) {
    const v = variants[i];
    console.log(`\n  ${v.baseForm} (total: ${v.totalFrequency})`);
    for (const variant of v.variants) {
      const freq = wordMap.get(variant) || 0;
      console.log(`    - ${variant} (${freq})`);
    }
  }
  
  // Update database: merge variants into base form
  console.log(`\n💾 Merging ${variants.length} word variants...\n`);
  
  let updated = 0;
  let deleted = 0;
  
  for (const v of variants) {
    // Skip if base form is already one of the variants
    const baseFormExists = v.variants.includes(v.baseForm);
    
    if (baseFormExists) {
      // Base form exists - update it with merged frequency, delete others
      const otherVariants = v.variants.filter(w => w !== v.baseForm);
      
      const updateSQL = `
UPDATE word_frequencies 
SET frequency_total = ${v.totalFrequency}
WHERE pashto_word = '${v.baseForm.replace(/'/g, "''")}';

DELETE FROM word_frequencies 
WHERE pashto_word IN (${otherVariants.map(w => `'${w.replace(/'/g, "''")}'`).join(',')});
`;
      
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="${updateSQL.replace(/"/g, '\\"')}"`,
          { timeout: 60000 }
        );
        updated += 1;
        deleted += otherVariants.length;
        process.stdout.write(`\r  Processed ${updated}/${variants.length} merges...`);
      } catch (error: any) {
        console.error(`\n⚠️  Error merging ${v.baseForm}: ${error.message}`);
      }
    } else {
      // Base form doesn't exist - insert it with merged frequency, delete variants
      const deleteVariantsSQL = `
INSERT INTO word_frequencies (pashto_word, frequency_total) 
VALUES ('${v.baseForm.replace(/'/g, "''")}', ${v.totalFrequency});

DELETE FROM word_frequencies 
WHERE pashto_word IN (${v.variants.map(w => `'${w.replace(/'/g, "''")}'`).join(',')});
`;
      
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="${deleteVariantsSQL.replace(/"/g, '\\"')}"`,
          { timeout: 60000 }
        );
        updated += 1;
        deleted += v.variants.length;
        process.stdout.write(`\r  Processed ${updated}/${variants.length} merges...`);
      } catch (error: any) {
        console.error(`\n⚠️  Error merging ${v.baseForm}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Merged ${updated} word groups, deleted ${deleted} duplicate entries`);
  
  // Verify results
  console.log(`\n📊 Verifying results...\n`);
  
  const { stdout: verifyOut } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total_words, SUM(frequency_total) as total_frequency FROM word_frequencies;" --json`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
  
  const verifyResult = JSON.parse(verifyOut);
  const verifyData = Array.isArray(verifyResult) ? verifyResult[0] : verifyResult;
  const stats = verifyData.results?.[0];
  
  console.log(`Final word_frequencies stats:`);
  console.log(`  Total unique words: ${stats.total_words.toLocaleString()}`);
  console.log(`  Total frequency count: ${stats.total_frequency.toLocaleString()}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Y-ending normalization complete!');
  console.log('All Pashto y-variants now standardized to ی (standard Afghan Pashto form)');
  
  // Now update word_verse_mapping table
  console.log('\n🔄 Updating word_verse_mapping table...\n');
  
  // Get all unique words from word_verse_mapping that need normalization
  const { stdout: mappingOut } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word FROM word_verse_mapping WHERE pashto_word LIKE '%ئ' OR pashto_word LIKE '%ے';" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const mappingResult = JSON.parse(mappingOut);
  const mappingData = Array.isArray(mappingResult) ? mappingResult[0] : mappingResult;
  const mappingWords = mappingData.results || [];
  
  console.log(`📊 Found ${mappingWords.length} words in word_verse_mapping to normalize`);
  
  if (mappingWords.length > 0) {
    // Update word_verse_mapping in batches
    const batchSize = 50;
    let updated = 0;
    
    for (let i = 0; i < mappingWords.length; i += batchSize) {
      const batch = mappingWords.slice(i, i + batchSize);
      const updates = batch.map((w: any) => {
        const normalized = normalizeYEndings(w.pashto_word);
        if (normalized !== w.pashto_word) {
          return {
            old: w.pashto_word.replace(/'/g, "''"),
            new: normalized.replace(/'/g, "''"),
          };
        }
        return null;
      }).filter((u: any) => u !== null);
      
      if (updates.length > 0) {
        const updateSQL = updates.map((u: any) => 
          `UPDATE word_verse_mapping SET pashto_word = '${u.new}' WHERE pashto_word = '${u.old}';`
        ).join('\n');
        
        try {
          await execAsync(
            `npx wrangler d1 execute pashto-bible-db --remote --command="${updateSQL.replace(/"/g, '\\"')}"`,
            { timeout: 60000 }
          );
          updated += updates.length;
          process.stdout.write(`\r  Updated ${updated}/${mappingWords.length} word mappings...`);
        } catch (error: any) {
          console.error(`\n⚠️  Error updating batch: ${error.message}`);
        }
      }
    }
    
    console.log(`\n✅ Updated ${updated} word mappings in word_verse_mapping table`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Complete normalization finished!');
  console.log('Both word_frequencies and word_verse_mapping tables updated.');
}

if (require.main === module) {
  mergeYVariants()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { normalizeYEndings, mergeYVariants };


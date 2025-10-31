/**
 * Finalize Y-ending normalization - handle compound words and remaining variants
 * This script normalizes words that contain ئ or ے in the middle or in compound forms
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const STANDARD_Y = '\u06CC'; // ی

// Verb forms that should preserve ئ at the end
const PRESERVE_EY_VERBS = new Set([
  'شئ', 'کړئ', 'وکړئ', 'ځئ', 'راځئ', 'راشئ', 'یئ', 'وئ',
  'وایئ', 'ووایئ', 'غواړئ', 'پرېږدئ', 'ساتئ', 'ورکړئ', 'وګورئ', 'ګورئ',
  'اوسئ', 'پوهېږئ', 'ونیسئ', 'خورئ', 'لرئ', 'کېنئ', 'کېږئ', 'يرېږئ',
]);

function normalizeYEndings(word: string): string {
  let normalized = word;
  
  // Check if this is an exact verb form that should preserve ئ
  const isExactVerbForm = PRESERVE_EY_VERBS.has(word);
  
  if (!isExactVerbForm) {
    // Normalize ئ at end of words to ی
    if (word.endsWith('\u0626')) { // ئ
      normalized = normalized.slice(0, -1) + STANDARD_Y;
    }
    
    // Normalize ے at end of words to ی
    if (word.endsWith('\u06D2')) { // ے
      normalized = normalized.slice(0, -1) + STANDARD_Y;
    }
    
    // Normalize ئ in the middle of words (for compound words)
    // Examples: خُدائ په → خُدای په, ووئیل → وویل
    normalized = normalized.replace(/\u0626([^ئ\u06CC\u06D0\u06CD])/g, STANDARD_Y + '$1');
    
    // Normalize ے in the middle of words
    normalized = normalized.replace(/\u06D2([^\u06D2\u06CC\u06D0\u06CD])/g, STANDARD_Y + '$1');
  }
  
  return normalized;
}

async function finalizeNormalization(): Promise<void> {
  console.log('🔄 Finalizing Y-ending normalization...\n');
  
  // Get all words with ئ or ے
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total FROM word_frequencies WHERE pashto_word LIKE '%ئ%' OR pashto_word LIKE '%ے%' ORDER BY frequency_total DESC;" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const words = data.results || [];
  
  console.log(`📊 Found ${words.length} words with ئ or ے`);
  
  // Group by normalized form
  const normalizedGroups = new Map<string, {
    words: string[];
    totalFrequency: number;
  }>();
  
  for (const word of words) {
    const normalized = normalizeYEndings(word.pashto_word);
    
    if (normalized !== word.pashto_word) {
      if (!normalizedGroups.has(normalized)) {
        normalizedGroups.set(normalized, {
          words: [],
          totalFrequency: 0,
        });
      }
      
      const group = normalizedGroups.get(normalized)!;
      group.words.push(word.pashto_word);
      group.totalFrequency += word.frequency_total;
    }
  }
  
  console.log(`\n📊 Found ${normalizedGroups.size} groups to normalize\n`);
  
  // Show examples
  let count = 0;
  for (const [normalized, group] of normalizedGroups) {
    if (count < 10) {
      console.log(`  ${normalized} (total: ${group.totalFrequency})`);
      for (const variant of group.words.slice(0, 3)) {
        const freq = words.find((w: any) => w.pashto_word === variant)?.frequency_total || 0;
        console.log(`    - ${variant} (${freq})`);
      }
      count++;
    }
  }
  
  // Update database
  console.log(`\n💾 Normalizing ${normalizedGroups.size} word groups...\n`);
  
  let updated = 0;
  let deleted = 0;
  
  for (const [normalized, group] of normalizedGroups) {
    // Check if normalized form already exists
    const existingWord = words.find((w: any) => w.pashto_word === normalized);
    
    if (existingWord) {
      // Update existing normalized form with merged frequency
      const otherVariants = group.words.filter(w => w !== normalized);
      const totalFreq = existingWord.frequency_total + group.totalFrequency;
      
      const updateSQL = `
UPDATE word_frequencies 
SET frequency_total = ${totalFreq}
WHERE pashto_word = '${normalized.replace(/'/g, "''")}';

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
        process.stdout.write(`\r  Processed ${updated}/${normalizedGroups.size} groups...`);
      } catch (error: any) {
        console.error(`\n⚠️  Error: ${error.message}`);
      }
    } else {
      // Insert normalized form, delete variants
      const insertSQL = `
INSERT INTO word_frequencies (pashto_word, frequency_total) 
VALUES ('${normalized.replace(/'/g, "''")}', ${group.totalFrequency});

DELETE FROM word_frequencies 
WHERE pashto_word IN (${group.words.map(w => `'${w.replace(/'/g, "''")}'`).join(',')});
`;
      
      try {
        await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="${insertSQL.replace(/"/g, '\\"')}"`,
          { timeout: 60000 }
        );
        updated += 1;
        deleted += group.words.length;
        process.stdout.write(`\r  Processed ${updated}/${normalizedGroups.size} groups...`);
      } catch (error: any) {
        console.error(`\n⚠️  Error: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Normalized ${updated} groups, deleted ${deleted} duplicate entries`);
  
  // Update word_verse_mapping
  console.log(`\n🔄 Updating word_verse_mapping...\n`);
  
  const { stdout: mappingOut } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT DISTINCT pashto_word FROM word_verse_mapping WHERE pashto_word LIKE '%ئ%' OR pashto_word LIKE '%ے%';" --json`,
    { maxBuffer: 50 * 1024 * 1024, timeout: 120000 }
  );
  
  const mappingResult = JSON.parse(mappingOut);
  const mappingData = Array.isArray(mappingResult) ? mappingResult[0] : mappingResult;
  const mappingWords = mappingData.results || [];
  
  console.log(`📊 Found ${mappingWords.length} words in word_verse_mapping to normalize`);
  
  if (mappingWords.length > 0) {
    const batchSize = 50;
    let mappingUpdated = 0;
    
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
          mappingUpdated += updates.length;
          process.stdout.write(`\r  Updated ${mappingUpdated}/${mappingWords.length} mappings...`);
        } catch (error: any) {
          console.error(`\n⚠️  Error: ${error.message}`);
        }
      }
    }
    
    console.log(`\n✅ Updated ${mappingUpdated} word mappings`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Finalization complete!');
}

if (require.main === module) {
  finalizeNormalization()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { normalizeYEndings, finalizeNormalization };


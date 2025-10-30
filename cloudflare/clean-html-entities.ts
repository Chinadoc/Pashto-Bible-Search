/**
 * Clean HTML entities from verses table and rebuild word frequencies
 * Removes &nbsp;, &amp;, &quot;, &#XXXX; etc.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

function decodeHtmlEntities(text: string): string {
  // Decode common HTML entities
  let cleaned = text
    .replace(/&nbsp;/g, ' ')           // Non-breaking space
    .replace(/&amp;/g, '&')            // Ampersand
    .replace(/&quot;/g, '"')           // Double quote
    .replace(/&apos;/g, "'")           // Single quote
    .replace(/&lt;/g, '<')             // Less than
    .replace(/&gt;/g, '>')             // Greater than
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))  // Numeric entities
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))  // Hex entities
    .replace(/\u00A0/g, ' ')           // Non-breaking space Unicode
    .trim();
  
  return cleaned;
}

async function getVersesWithHtmlEntities(): Promise<Array<{
  id: number;
  ref: string;
  text: string;
}>> {
  console.log('📖 Finding verses with HTML entities...');
  
  const verses: Array<{ id: number; ref: string; text: string }> = [];
  const pageSize = 5000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT id, ref, text FROM verses WHERE text LIKE '%&%' OR text LIKE '%<%' OR text LIKE '%>%' LIMIT ${pageSize} OFFSET ${offset};" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const output = JSON.parse(stdout);
    const result = Array.isArray(output) ? output[0] : output;
    
    if (result.results && result.results.length > 0) {
      verses.push(...result.results);
      offset += pageSize;
      process.stdout.write(`\r   Found ${verses.length} verses...`);
      
      if (result.results.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Found ${verses.length} verses with HTML entities`);
  return verses;
}

async function updateVerses(verses: Array<{ id: number; ref: string; text: string }>): Promise<void> {
  console.log('\n🧹 Cleaning HTML entities from verses...');
  
  const batchSize = 50; // Further reduced to avoid auth issues
  const batches: Array<Array<{ id: number; ref: string; text: string }>> = [];
  
  for (let i = 0; i < verses.length; i += batchSize) {
    batches.push(verses.slice(i, i + batchSize));
  }
  
  console.log(`📤 Updating ${batches.length} batches...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const updates = batch.map(verse => {
      const cleanedText = decodeHtmlEntities(verse.text);
      const escape = (str: string) => str.replace(/'/g, "''");
      
      return `UPDATE verses SET text = '${escape(cleanedText)}', updated_at = strftime('%s', 'now') WHERE id = ${verse.id};`;
    });
    
    const sql = updates.join('\n');
    
    try {
      await executeD1Sql(sql);
      successCount += batch.length;
      
      if ((i + 1) % 5 === 0) {
        process.stdout.write(`\r   Updated batch ${i + 1}/${batches.length} (${successCount} verses)...`);
      }
      
      // Small delay to avoid rate limiting
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error: any) {
      errorCount += batch.length;
      console.error(`\n   ⚠️  Error on batch ${i + 1}: ${error.message}`);
      
      // If auth error, wait and retry
      if (error.message.includes('Authentication') || error.message.includes('code: 10000')) {
        console.log(`   Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        try {
          await executeD1Sql(sql);
          successCount += batch.length;
          errorCount -= batch.length;
          console.log(`   ✅ Retry successful for batch ${i + 1}`);
        } catch (retryError: any) {
          console.error(`   ❌ Retry failed: ${retryError.message}`);
        }
      }
    }
  }
  
  console.log(`\n✅ Cleaned ${successCount} verses`);
  if (errorCount > 0) {
    console.log(`⚠️  Failed to clean ${errorCount} verses`);
  }
}

async function checkWordFrequenciesForHtmlEntities(): Promise<number> {
  console.log('\n🔍 Checking word frequencies for HTML entities...');
  
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM word_frequencies_enhanced WHERE pashto_word LIKE '%&%' OR pashto_word LIKE '%<%' OR pashto_word LIKE '%>%' OR pashto_word LIKE '%;%';" --json`
  );
  
  const output = JSON.parse(stdout);
  const result = Array.isArray(output) ? output[0] : output;
  
  const count = result.results?.[0]?.count || 0;
  
  if (count > 0) {
    console.log(`⚠️  Found ${count} words with HTML entities in word_frequencies`);
    
    // Show sample
    const { stdout: sampleStdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word FROM word_frequencies_enhanced WHERE pashto_word LIKE '%&%' OR pashto_word LIKE '%<%' OR pashto_word LIKE '%>%' LIMIT 20;" --json`
    );
    
    const sampleOutput = JSON.parse(sampleStdout);
    const sampleResult = Array.isArray(sampleOutput) ? sampleOutput[0] : sampleOutput;
    
    if (sampleResult.results) {
      console.log('   Examples:');
      for (const word of sampleResult.results) {
        console.log(`     - ${word.pashto_word}`);
      }
    }
  } else {
    console.log('✅ No HTML entities found in word frequencies');
  }
  
  return count;
}

async function deleteWordsWithHtmlEntities(): Promise<void> {
  console.log('\n🗑️  Deleting words with HTML entities from word_frequencies...');
  
  const deleteSql = `
DELETE FROM word_frequencies_enhanced 
WHERE pashto_word LIKE '%&%' 
   OR pashto_word LIKE '%<%' 
   OR pashto_word LIKE '%>%' 
   OR pashto_word LIKE '%;%'
   OR pashto_word LIKE '%nbsp%'
   OR pashto_word LIKE '%amp%';
`;
  
  await executeD1Sql(deleteSql);
  
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM word_frequencies_enhanced;" --json`
  );
  
  const output = JSON.parse(stdout);
  const result = Array.isArray(output) ? output[0] : output;
  const remaining = result.results?.[0]?.count || 0;
  
  console.log(`✅ Words remaining: ${remaining}`);
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-clean-html-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Failed: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('🚀 Cleaning HTML Entities from Verses and Word Frequencies\n');
  console.log('='.repeat(70));
  
  try {
    // Check word frequencies first
    const wordCount = await checkWordFrequenciesForHtmlEntities();
    
    // Get verses with HTML entities
    const verses = await getVersesWithHtmlEntities();
    
    if (verses.length === 0 && wordCount === 0) {
      console.log('\n✅ No HTML entities found - all clean!');
      return;
    }
    
    // Update verses
    if (verses.length > 0) {
      await updateVerses(verses);
    }
    
    // Delete words with HTML entities
    if (wordCount > 0) {
      await deleteWordsWithHtmlEntities();
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ HTML entity cleanup complete!');
    console.log(`\n📝 Next steps:`);
    console.log('   1. Re-run word frequency builder to regenerate clean entries');
    console.log('   2. Verify verses are clean: SELECT COUNT(*) FROM verses WHERE text LIKE \'%&%\';');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


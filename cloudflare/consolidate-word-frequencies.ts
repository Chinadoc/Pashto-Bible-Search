/**
 * Consolidate word frequencies to use word_frequencies_enhanced
 * This script will:
 * 1. Complete the enhanced build if needed
 * 2. Replace word_frequencies with word_frequencies_enhanced
 * 3. Clean up old tables
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function consolidateTables(): Promise<void> {
  console.log('🔄 Consolidating word frequency tables...\n');
  
  // Check current state
  console.log('📊 Current table status:');
  const { stdout: counts } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT 'word_frequencies' as table_name, COUNT(*) as rows FROM word_frequencies UNION ALL SELECT 'word_frequencies_new', COUNT(*) FROM word_frequencies_new UNION ALL SELECT 'word_frequencies_enhanced', COUNT(*) FROM word_frequencies_enhanced;" --json`
  );
  
  const result = JSON.parse(counts);
  if (result.results) {
    result.results.forEach((t: any) => {
      console.log(`   ${t.table_name.padEnd(30)} ${t.rows.toLocaleString().padStart(10)} rows`);
    });
  }
  
  console.log('\n📋 Plan:');
  console.log('   1. Keep: word_frequencies_enhanced (most features)');
  console.log('   2. Replace: word_frequencies with enhanced version');
  console.log('   3. Keep: word_frequencies_new as backup');
  console.log('\n⚠️  Note: Enhanced version has fewer rows but more features.');
  console.log('   If you need more data, we should complete the enhanced build first.\n');
  
  console.log('🔧 To consolidate:');
  console.log('   1. Complete enhanced build: npx tsx cloudflare/build-word-frequencies-enhanced.ts');
  console.log('   2. Then run: npx tsx cloudflare/consolidate-word-frequencies.ts --replace\n');
}

async function replaceOldTable(): Promise<void> {
  console.log('🔄 Replacing word_frequencies with enhanced version...\n');
  
  const sql = `
-- Backup old table
CREATE TABLE IF NOT EXISTS word_frequencies_backup AS SELECT * FROM word_frequencies;

-- Drop old table
DROP TABLE IF EXISTS word_frequencies;

-- Rename enhanced to main
ALTER TABLE word_frequencies_enhanced RENAME TO word_frequencies;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_base ON word_frequencies(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_type ON word_frequencies(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict ON word_frequencies(dictionary_id);
CREATE INDEX IF NOT EXISTS idx_word_freq_issues ON word_frequencies(has_issues);
`;
  
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-consolidate-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    console.log('📤 Executing consolidation...');
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`⚠️  ${stderr}`);
    }
    
    console.log('✅ Consolidation complete!');
    console.log('\n📊 New structure:');
    console.log('   ✅ word_frequencies (main table - from enhanced)');
    console.log('   📦 word_frequencies_backup (backup of old)');
    console.log('   📦 word_frequencies_new (kept as backup)');
    console.log('   📦 word_frequencies_enhanced (old name, can be dropped)');
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  const args = process.argv.slice(2);
  const shouldReplace = args.includes('--replace');
  
  if (shouldReplace) {
    await replaceOldTable();
  } else {
    await consolidateTables();
  }
}

main().catch(console.error);


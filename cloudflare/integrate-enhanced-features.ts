/**
 * Integrate enhanced features into word_frequencies_new
 * and delete original word_frequencies table
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-integrate-${Date.now()}.sql`);
  
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
  console.log('🔄 Integrating Enhanced Features into word_frequencies_new\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Add enhanced columns to word_frequencies_new
    console.log('\n📝 Step 1: Adding enhanced columns to word_frequencies_new...');
    
    // Check existing columns first
    const { stdout: columnsInfo } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="PRAGMA table_info(word_frequencies_new);" --json`
    );
    
    const columnsResult = JSON.parse(columnsInfo);
    const existingColumns = new Set<string>();
    if (columnsResult.results) {
      columnsResult.results.forEach((col: any) => {
        existingColumns.add(col.name.toLowerCase());
      });
    }
    
    const columnsToAdd: Array<{name: string; sql: string}> = [];
    
    if (!existingColumns.has('base_form')) {
      columnsToAdd.push({ name: 'base_form', sql: 'ALTER TABLE word_frequencies_new ADD COLUMN base_form TEXT;' });
    }
    if (!existingColumns.has('word_type')) {
      columnsToAdd.push({ name: 'word_type', sql: 'ALTER TABLE word_frequencies_new ADD COLUMN word_type TEXT;' });
    }
    if (!existingColumns.has('confidence_score')) {
      columnsToAdd.push({ name: 'confidence_score', sql: 'ALTER TABLE word_frequencies_new ADD COLUMN confidence_score REAL DEFAULT 1.0;' });
    }
    if (!existingColumns.has('has_issues')) {
      columnsToAdd.push({ name: 'has_issues', sql: 'ALTER TABLE word_frequencies_new ADD COLUMN has_issues INTEGER DEFAULT 0;' });
    }
    if (!existingColumns.has('issue_flags')) {
      columnsToAdd.push({ name: 'issue_flags', sql: 'ALTER TABLE word_frequencies_new ADD COLUMN issue_flags TEXT DEFAULT \'[]\';' });
    }
    
    if (columnsToAdd.length > 0) {
      console.log(`   Adding ${columnsToAdd.length} columns...`);
      for (const col of columnsToAdd) {
        try {
          await executeD1Sql(col.sql);
          console.log(`   ✅ Added ${col.name}`);
        } catch (error: any) {
          if (!error.message.includes('duplicate column')) {
            console.log(`   ⚠️  Could not add ${col.name}: ${error.message}`);
          }
        }
      }
    } else {
      console.log('   ✅ All columns already exist');
    }
    
    // Create indexes for new columns
    const indexesSql = `
CREATE INDEX IF NOT EXISTS idx_word_freq_new_base ON word_frequencies_new(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_new_type ON word_frequencies_new(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_new_issues ON word_frequencies_new(has_issues);
`;
    
    await executeD1Sql(indexesSql);
    console.log('✅ Columns and indexes ready');
    
    // Step 2: Merge enhanced data into word_frequencies_new
    console.log('\n📊 Step 2: Merging enhanced data...');
    
    const mergeSql = `
-- Update word_frequencies_new with data from enhanced where words match
UPDATE word_frequencies_new
SET 
  base_form = (
    SELECT base_form 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ),
  word_type = (
    SELECT word_type 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ),
  confidence_score = COALESCE((
    SELECT confidence_score 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), 1.0),
  has_issues = COALESCE((
    SELECT has_issues 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), 0),
  issue_flags = COALESCE((
    SELECT issue_flags 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), '[]')
WHERE EXISTS (
  SELECT 1 
  FROM word_frequencies_enhanced 
  WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
);
`;
    
    await executeD1Sql(mergeSql);
    console.log('✅ Data merged successfully');
    
    // Step 3: Insert any words from enhanced that don't exist in new
    console.log('\n➕ Step 3: Adding missing words from enhanced...');
    
    const insertMissingSql = `
INSERT INTO word_frequencies_new (
  pashto_word, base_form, word_type, frequency_total,
  frequency_afghan2023_ot, frequency_afghan2023_nt,
  frequency_yousafzai2019_ot, frequency_yousafzai2019_nt,
  frequency_rank, romanization, pos, dictionary_id, english_translation,
  confidence_score, has_issues, issue_flags, created_at, updated_at
)
SELECT 
  e.pashto_word, e.base_form, e.word_type, e.frequency_total,
  e.frequency_afghan2023_ot, e.frequency_afghan2023_nt,
  e.frequency_yousafzai2019_ot, e.frequency_yousafzai2019_nt,
  e.frequency_rank, e.romanization, e.pos, e.dictionary_id, e.english_translation,
  COALESCE(e.confidence_score, 1.0), COALESCE(e.has_issues, 0), COALESCE(e.issue_flags, '[]'),
  e.created_at, e.updated_at
FROM word_frequencies_enhanced e
WHERE NOT EXISTS (
  SELECT 1 FROM word_frequencies_new n WHERE n.pashto_word = e.pashto_word
);
`;
    
    await executeD1Sql(insertMissingSql);
    console.log('✅ Missing words added');
    
    // Step 4: Update frequency totals if enhanced has more accurate counts
    console.log('\n📈 Step 4: Updating frequency totals with enhanced data...');
    
    const updateFrequenciesSql = `
UPDATE word_frequencies_new
SET 
  frequency_total = (
    SELECT frequency_total 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ),
  frequency_afghan2023_ot = COALESCE((
    SELECT frequency_afghan2023_ot 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), frequency_afghan2023_ot),
  frequency_afghan2023_nt = COALESCE((
    SELECT frequency_afghan2023_nt 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), frequency_afghan2023_nt),
  frequency_yousafzai2019_ot = COALESCE((
    SELECT frequency_yousafzai2019_ot 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), frequency_yousafzai2019_ot),
  frequency_yousafzai2019_nt = COALESCE((
    SELECT frequency_yousafzai2019_nt 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), frequency_yousafzai2019_nt),
  romanization = COALESCE((
    SELECT romanization 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), romanization),
  pos = COALESCE((
    SELECT pos 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), pos),
  dictionary_id = COALESCE((
    SELECT dictionary_id 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), dictionary_id),
  english_translation = COALESCE((
    SELECT english_translation 
    FROM word_frequencies_enhanced 
    WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
    LIMIT 1
  ), english_translation),
  updated_at = strftime('%s', 'now')
WHERE EXISTS (
  SELECT 1 
  FROM word_frequencies_enhanced 
  WHERE word_frequencies_enhanced.pashto_word = word_frequencies_new.pashto_word
);
`;
    
    await executeD1Sql(updateFrequenciesSql);
    console.log('✅ Frequency totals updated');
    
    // Step 5: Delete original word_frequencies table
    console.log('\n🗑️  Step 5: Deleting original word_frequencies table...');
    
    const deleteOriginalSql = `
DROP TABLE IF EXISTS word_frequencies;
DROP INDEX IF EXISTS idx_word_freq_word;
DROP INDEX IF EXISTS idx_word_freq_frequency;
DROP INDEX IF EXISTS idx_word_freq_dict;
`;
    
    await executeD1Sql(deleteOriginalSql);
    console.log('✅ Original table deleted');
    
    // Step 6: Rename word_frequencies_new to word_frequencies
    console.log('\n🔄 Step 6: Renaming word_frequencies_new to word_frequencies...');
    
    const renameSql = `
ALTER TABLE word_frequencies_new RENAME TO word_frequencies;

-- Recreate indexes with correct names
CREATE INDEX IF NOT EXISTS idx_word_freq_word ON word_frequencies(pashto_word);
CREATE INDEX IF NOT EXISTS idx_word_freq_base ON word_frequencies(base_form);
CREATE INDEX IF NOT EXISTS idx_word_freq_type ON word_frequencies(word_type);
CREATE INDEX IF NOT EXISTS idx_word_freq_frequency ON word_frequencies(frequency_total DESC);
CREATE INDEX IF NOT EXISTS idx_word_freq_dict ON word_frequencies(dictionary_id);
CREATE INDEX IF NOT EXISTS idx_word_freq_issues ON word_frequencies(has_issues);
`;
    
    await executeD1Sql(renameSql);
    console.log('✅ Table renamed successfully');
    
    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Integration Complete!\n');
    
    const { stdout: finalCount } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as total, COUNT(CASE WHEN base_form IS NOT NULL THEN 1 END) as with_base, COUNT(CASE WHEN word_type IS NOT NULL THEN 1 END) as with_type, COUNT(CASE WHEN has_issues = 1 THEN 1 END) as with_issues FROM word_frequencies;" --json`
    );
    
    const result = JSON.parse(finalCount);
    if (result.results && result.results[0]) {
      const stats = result.results[0];
      console.log('📊 Final Statistics:');
      console.log(`   Total words: ${stats.total.toLocaleString()}`);
      console.log(`   With base forms: ${stats.with_base.toLocaleString()}`);
      console.log(`   With word types: ${stats.with_type.toLocaleString()}`);
      console.log(`   With issues flagged: ${stats.with_issues.toLocaleString()}`);
    }
    
    console.log('\n📋 Table Structure:');
    console.log('   ✅ word_frequencies (main table - integrated from new + enhanced)');
    console.log('   📦 word_frequencies_enhanced (kept as backup)');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


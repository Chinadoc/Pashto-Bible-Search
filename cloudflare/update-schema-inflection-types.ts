/**
 * Update database schema to add inflection_type and compound_type columns
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-schema-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('📝 Updating database schema for inflection types\n');
  console.log('='.repeat(70));
  
  try {
    // Check if columns exist
    const { stdout: columnsRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="PRAGMA table_info(word_frequencies);" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const columnsResult = JSON.parse(columnsRaw);
    const columnsData = Array.isArray(columnsResult) ? columnsResult[0] : columnsResult;
    const existingColumns = new Set<string>();
    
    if (columnsData.results) {
      columnsData.results.forEach((col: any) => {
        existingColumns.add(col.name.toLowerCase());
      });
    }
    
    console.log('\n📋 Checking existing columns...');
    
    // Add inflection_type column if it doesn't exist
    if (!existingColumns.has('inflection_type')) {
      console.log('   Adding inflection_type column...');
      await executeD1Sql('ALTER TABLE word_frequencies ADD COLUMN inflection_type TEXT;');
      console.log('   ✅ Added inflection_type column');
    } else {
      console.log('   ✅ inflection_type column already exists');
    }
    
    // Add compound_type column if it doesn't exist
    if (!existingColumns.has('compound_type')) {
      console.log('   Adding compound_type column...');
      await executeD1Sql('ALTER TABLE word_frequencies ADD COLUMN compound_type TEXT;');
      console.log('   ✅ Added compound_type column');
    } else {
      console.log('   ✅ compound_type column already exists');
    }
    
    // Create indexes
    console.log('\n📝 Creating indexes...');
    const indexesSql = `
      CREATE INDEX IF NOT EXISTS idx_word_freq_inflection_type ON word_frequencies(inflection_type);
      CREATE INDEX IF NOT EXISTS idx_word_freq_compound_type ON word_frequencies(compound_type);
    `;
    
    await executeD1Sql(indexesSql);
    console.log('   ✅ Indexes created');
    
    console.log('\n✅ Schema update complete!');
    
  } catch (error: any) {
    console.error(`\n❌ Schema update failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


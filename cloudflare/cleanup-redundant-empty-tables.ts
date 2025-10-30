/**
 * Cleanup Redundant and Empty Tables
 * 
 * Deletes:
 * 1. verses table (redundant - data exists in verses_afghan2023 and verses_yousafzai)
 * 2. All empty tables: dictionary, grammar_rules, irregular_verbs, nouns_lexicon, verbs_lexicon, video_transcripts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function cleanupTables(): Promise<void> {
  console.log('🧹 Cleaning Up Redundant and Empty Tables\n');
  console.log('='.repeat(70));
  
  // Tables to delete
  const redundantTables = ['verses'];
  const emptyTables = [
    'dictionary',
    'grammar_rules',
    'irregular_verbs',
    'nouns_lexicon',
    'verbs_lexicon',
    'video_transcripts'
  ];
  
  const allTablesToDelete = [...redundantTables, ...emptyTables];
  
  console.log('\n📋 Tables to delete:');
  console.log(`   Redundant: ${redundantTables.join(', ')}`);
  console.log(`   Empty: ${emptyTables.join(', ')}`);
  
  // Verify counts before deletion
  console.log('\n🔍 Verifying table counts...');
  
  for (const table of allTablesToDelete) {
    try {
      const { stdout } = await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM ${table};" --json`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      
      const result = JSON.parse(stdout);
      const data = Array.isArray(result) ? result[0] : result;
      const count = data.results?.[0]?.count || 0;
      
      if (redundantTables.includes(table)) {
        console.log(`   ${table}: ${count.toLocaleString()} rows (redundant)`);
      } else {
        if (count > 0) {
          console.log(`   ⚠️  ${table}: ${count.toLocaleString()} rows (NOT EMPTY - skipping)`);
          continue;
        }
        console.log(`   ${table}: ${count} rows (empty)`);
      }
    } catch (error: any) {
      console.log(`   ⚠️  ${table}: Error checking - ${error.message}`);
      continue;
    }
  }
  
  // Confirm deletion
  console.log('\n⚠️  WARNING: About to delete tables!');
  console.log('   This action cannot be undone.');
  console.log('\n🗑️  Proceeding with deletion...\n');
  
  // Delete tables
  let deleted = 0;
  let failed = 0;
  
  for (const table of allTablesToDelete) {
    try {
      // Check count again for empty tables
      if (emptyTables.includes(table)) {
        const { stdout } = await execAsync(
          `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM ${table};" --json`,
          { maxBuffer: 10 * 1024 * 1024 }
        );
        
        const result = JSON.parse(stdout);
        const data = Array.isArray(result) ? result[0] : result;
        const count = data.results?.[0]?.count || 0;
        
        if (count > 0) {
          console.log(`   ⏭️  Skipping ${table} (has ${count} rows)`);
          continue;
        }
      }
      
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="DROP TABLE IF EXISTS ${table};"`
      );
      
      console.log(`   ✅ Deleted ${table}`);
      deleted++;
      
    } catch (error: any) {
      console.log(`   ❌ Failed to delete ${table}: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Cleanup complete!');
  console.log(`   Deleted: ${deleted} tables`);
  if (failed > 0) {
    console.log(`   Failed: ${failed} tables`);
  }
  
  // Verify remaining tables
  console.log('\n📊 Remaining tables:');
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' ORDER BY name;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    const tables = data.results || [];
    
    for (const table of tables) {
      const { stdout: countOut } = await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM ${table.name};" --json`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      
      const countResult = JSON.parse(countOut);
      const countData = Array.isArray(countResult) ? countResult[0] : countResult;
      const count = countData.results?.[0]?.count || 0;
      
      console.log(`   ✅ ${table.name}: ${count.toLocaleString()} rows`);
    }
  } catch (error: any) {
    console.log(`   ⚠️  Error listing tables: ${error.message}`);
  }
}

if (require.main === module) {
  cleanupTables()
    .then(() => {
      console.log('\n✅ Cleanup script complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { cleanupTables };


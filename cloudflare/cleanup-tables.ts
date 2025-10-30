/**
 * Quick table analysis and cleanup
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getCount(table: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM ${table};" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    return data.results?.[0]?.count || 0;
  } catch (error: any) {
    return -1;
  }
}

async function deleteTable(table: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-delete-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, `DROP TABLE IF EXISTS ${table};`, 'utf-8');
  
  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function main() {
  console.log('📊 Database Table Analysis\n');
  console.log('='.repeat(70));
  
  const tables = [
    'dictionary',
    'form_occurrences',
    'form_to_root',
    'grammar_rules',
    'inflections',
    'irregular_verbs',
    'nouns_lexicon',
    'verbs_lexicon',
    'verses',
    'video_transcripts',
    'word_frequencies',
    'word_frequencies_enhanced',
    'word_verse_mapping'
  ];
  
  console.log('\n📋 Checking table row counts...\n');
  
  const results: Array<{table: string; count: number; action: string; reason: string}> = [];
  
  for (const table of tables) {
    const count = await getCount(table);
    
    let action = 'keep';
    let reason = '';
    
    // Core tables - always keep
    if (['verses', 'word_frequencies', 'word_verse_mapping'].includes(table)) {
      action = 'keep';
      reason = 'Core table - essential';
    }
    // Redundant tables - delete
    else if (table === 'word_frequencies_enhanced' && count > 0) {
      action = 'delete';
      reason = 'Redundant - data merged into word_frequencies';
    }
    // Empty redundant tables
    else if (count === 0 && ['form_occurrences', 'form_to_root', 'inflections'].includes(table)) {
      action = 'delete';
      reason = 'Empty and redundant - data handled in word_frequencies';
    }
    // Empty but potentially useful
    else if (count === 0 && ['dictionary', 'grammar_rules', 'irregular_verbs', 'verbs_lexicon', 'nouns_lexicon', 'video_transcripts'].includes(table)) {
      action = 'keep';
      reason = 'Empty but potentially useful for future features';
    }
    // Tables with data that might be useful
    else if (count > 0) {
      action = 'keep';
      reason = `Has ${count.toLocaleString()} rows - evaluate usefulness`;
    }
    
    results.push({ table, count, action, reason });
    
    const status = count === -1 ? 'ERROR' : count === 0 ? 'EMPTY' : `${count.toLocaleString()} rows`;
    console.log(`${table.padEnd(30)} ${status.padStart(15)} - ${reason}`);
  }
  
  console.log('\n' + '='.repeat(70));
  
  const toDelete = results.filter(r => r.action === 'delete');
  const toKeep = results.filter(r => r.action === 'keep');
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Keep: ${toKeep.length} tables`);
  console.log(`   🗑️  Delete: ${toDelete.length} tables`);
  
  if (toDelete.length > 0) {
    console.log('\n🗑️  Tables to delete:');
    toDelete.forEach(({ table, count, reason }) => {
      console.log(`   - ${table} (${count} rows) - ${reason}`);
    });
    
    console.log('\n⚠️  About to delete these tables in 5 seconds...');
    console.log('   Press Ctrl+C to cancel\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    for (const { table } of toDelete) {
      console.log(`   Deleting ${table}...`);
      try {
        await deleteTable(table);
        console.log(`   ✅ Deleted ${table}`);
      } catch (error: any) {
        console.error(`   ❌ Failed: ${error.message}`);
      }
    }
    
    console.log('\n✅ Cleanup complete!');
  } else {
    console.log('\n✅ No redundant tables to delete');
  }
  
  console.log('\n💡 Recommendation:');
  console.log('   The word_frequencies table is now comprehensive and includes:');
  console.log('   - Word frequencies with translation/testament breakdown');
  console.log('   - Base forms (for inflected/conjugated forms)');
  console.log('   - Word types (compound verbs, conjugations, etc.)');
  console.log('   - Dictionary matching with confidence scores');
  console.log('   - Issue flags for data quality');
  console.log('   - Verse mappings via word_verse_mapping table');
}

main().catch(console.error);


/**
 * Analyze and clean up empty/redundant tables
 * Checks row counts and evaluates usefulness for consolidation
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkTableCounts(): Promise<Array<{name: string; count: number}>> {
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%';" --json`
  );
  
  const result = JSON.parse(stdout);
  const tables = result.results?.map((t: any) => t.name) || [];
  
  const counts: Array<{name: string; count: number}> = [];
  
  console.log('   Checking table row counts...');
  
  for (const table of tables) {
    try {
      const { stdout: countStdout } = await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM ${table};" --json`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      
      const countResult = JSON.parse(countStdout);
      const result = Array.isArray(countResult) ? countResult[0] : countResult;
      const count = result.results?.[0]?.count || 0;
      counts.push({ name: table, count });
      process.stdout.write(`\r   ${table.padEnd(30)} ${count.toLocaleString().padStart(10)} rows`);
    } catch (error: any) {
      console.error(`\n   ⚠️  Error checking ${table}: ${error.message}`);
      counts.push({ name: table, count: -1 });
    }
  }
  
  console.log('\n');
  return counts;
}

function evaluateTable(table: string, count: number): {
  keep: boolean;
  reason: string;
  action?: 'delete' | 'consolidate' | 'merge';
} {
  const empty = count === 0;
  
  // Core tables to keep
  const coreTables = ['verses', 'word_frequencies', 'word_verse_mapping'];
  if (coreTables.includes(table)) {
    return { keep: true, reason: 'Core table - essential for application' };
  }
  
  // Empty tables - evaluate for deletion
  if (empty) {
    // These might be needed for future features
    const futureUse = ['dictionary', 'grammar_rules', 'inflections', 'irregular_verbs', 'verbs_lexicon', 'nouns_lexicon'];
    
    if (futureUse.includes(table)) {
      return { 
        keep: true, 
        reason: 'Empty but potentially useful for future features',
        action: 'merge'
      };
    }
    
    // Definitely redundant empty tables
    return { 
      keep: false, 
      reason: 'Empty and redundant',
      action: 'delete'
    };
  }
  
  // Tables with data - evaluate usefulness
  switch (table) {
    case 'word_frequencies_enhanced':
      return { 
        keep: false, 
        reason: 'Redundant - data merged into word_frequencies',
        action: 'delete'
      };
    
    case 'word_frequencies_new':
      return { 
        keep: false, 
        reason: 'Redundant - data merged into word_frequencies',
        action: 'delete'
      };
    
    case 'dictionary':
      return { 
        keep: true, 
        reason: 'Useful for enrichment - consider merging into word_frequencies',
        action: 'consolidate'
      };
    
    case 'irregular_verbs':
      return { 
        keep: true, 
        reason: 'Useful for verb conjugation - consider merging into word_frequencies',
        action: 'consolidate'
      };
    
    case 'verbs_lexicon':
      return { 
        keep: true, 
        reason: 'Useful for verb data - consider merging into word_frequencies',
        action: 'consolidate'
      };
    
    case 'nouns_lexicon':
      return { 
        keep: true, 
        reason: 'Useful for noun data - consider merging into word_frequencies',
        action: 'consolidate'
      };
    
    case 'inflections':
      return { 
        keep: false, 
        reason: 'Redundant - inflections handled via base_form in word_frequencies',
        action: 'delete'
      };
    
    case 'form_occurrences':
      return { 
        keep: false, 
        reason: 'Redundant - occurrences tracked in word_frequencies',
        action: 'delete'
      };
    
    case 'form_to_root':
      return { 
        keep: false, 
        reason: 'Redundant - root relationships via base_form in word_frequencies',
        action: 'delete'
      };
    
    case 'grammar_rules':
      return { 
        keep: true, 
        reason: 'Useful for grammar processing - keep separate',
        action: undefined
      };
    
    case 'video_transcripts':
      return { 
        keep: true, 
        reason: 'Separate feature - keep',
        action: undefined
      };
    
    default:
      return { 
        keep: true, 
        reason: 'Unknown table - keeping for safety',
        action: undefined
      };
  }
}

async function deleteTable(table: string): Promise<void> {
  const sql = `DROP TABLE IF EXISTS ${table};`;
  
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-delete-${Date.now()}.sql`);
  
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
  console.log('📊 Analyzing Database Tables\n');
  console.log('='.repeat(70));
  
  try {
    // Get all table counts
    console.log('\n📋 Checking table row counts...');
    const counts = await checkTableCounts();
    
    console.log('\n📊 Table Analysis:\n');
    
    const toDelete: string[] = [];
    const toConsolidate: string[] = [];
    const toKeep: string[] = [];
    
    for (const { name, count } of counts) {
      const evaluation = evaluateTable(name, count);
      const status = count === -1 ? 'ERROR' : count === 0 ? 'EMPTY' : `${count.toLocaleString()} rows`;
      
      console.log(`${name.padEnd(30)} ${status.padStart(15)}`);
      console.log(`   ${evaluation.reason}`);
      console.log(`   Action: ${evaluation.action || 'keep'}`);
      
      if (evaluation.action === 'delete') {
        toDelete.push(name);
      } else if (evaluation.action === 'consolidate' || evaluation.action === 'merge') {
        toConsolidate.push(name);
      } else {
        toKeep.push(name);
      }
      
      console.log('');
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('\n📋 Summary:');
    console.log(`   ✅ Keep: ${toKeep.length} tables`);
    console.log(`   🔄 Consolidate: ${toConsolidate.length} tables`);
    console.log(`   🗑️  Delete: ${toDelete.length} tables`);
    
    if (toDelete.length > 0) {
      console.log('\n🗑️  Tables to delete:');
      toDelete.forEach(t => console.log(`   - ${t}`));
      
      console.log('\n⚠️  About to delete these tables in 5 seconds...');
      console.log('   Press Ctrl+C to cancel\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      for (const table of toDelete) {
        console.log(`   Deleting ${table}...`);
        try {
          await deleteTable(table);
          console.log(`   ✅ Deleted ${table}`);
        } catch (error: any) {
          console.error(`   ❌ Failed to delete ${table}: ${error.message}`);
        }
      }
      
      console.log('\n✅ Cleanup complete!');
    } else {
      console.log('\n✅ No tables to delete - all tables are either useful or empty but kept for future use');
    }
    
    if (toConsolidate.length > 0) {
      console.log('\n💡 Tables to consider consolidating:');
      toConsolidate.forEach(t => console.log(`   - ${t} (could merge data into word_frequencies)`));
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


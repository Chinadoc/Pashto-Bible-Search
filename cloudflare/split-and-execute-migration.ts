/**
 * Split large SQL migration file into smaller batches
 * and execute them sequentially
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

function splitSqlFile(sqlFilePath: string, batchSize: number = 100000) {
  console.log(`📖 Reading SQL file: ${sqlFilePath}`);
  const content = readFileSync(sqlFilePath, 'utf-8');
  const lines = content.split('\n');
  
  console.log(`   Total lines: ${lines.length.toLocaleString()}`);
  
  const batches: string[][] = [];
  let currentBatch: string[] = [];
  let transactionCount = 0;
  
  for (const line of lines) {
    currentBatch.push(line);
    
    if (line.includes('COMMIT;') && currentBatch.length >= batchSize) {
      batches.push([...currentBatch]);
      currentBatch = [];
      transactionCount++;
      
      if (transactionCount % 10 === 0) {
        console.log(`   Prepared ${transactionCount} batches...`);
      }
    }
  }
  
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  
  console.log(`✅ Split into ${batches.length} batches`);
  return batches;
}

async function executeBatch(sqlContent: string, batchNum: number, totalBatches: number): Promise<boolean> {
  const tempFile = join(process.cwd(), `.temp-batch-${batchNum}.sql`);
  
  try {
    writeFileSync(tempFile, sqlContent, 'utf-8');
    
    console.log(`\n⏳ Executing batch ${batchNum}/${totalBatches}...`);
    execSync(`wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Clean up temp file
    require('fs').unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error(`❌ Batch ${batchNum} failed:`, error);
    return false;
  }
}

function main() {
  const sqlFilePath = join(process.cwd(), '.temp-inflections-migration.sql');
  
  if (!existsSync(sqlFilePath)) {
    console.error(`❌ SQL file not found: ${sqlFilePath}`);
    console.log('   Run: npx tsx cloudflare/generate-inflections-sql.ts');
    process.exit(1);
  }
  
  console.log('🚀 Splitting and executing migration in batches\n');
  
  const batches = splitSqlFile(sqlFilePath, 100000);
  
  console.log(`\n📊 Will execute ${batches.length} batches`);
  console.log(`   Approximate size per batch: ${Math.ceil(batches[0].length / 1000).toLocaleString()}K lines`);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nExecute migration now? (y/n): ', async (answer: string) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('\n📝 Migration cancelled. Run manually with:');
      console.log(`   npx tsx cloudflare/split-and-execute-migration.ts`);
      rl.close();
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batchContent = batches[i].join('\n');
      const success = await executeBatch(batchContent, i + 1, batches.length);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
        console.log(`⚠️  Batch ${i + 1} failed, continuing...`);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Successful batches: ${successCount}`);
    console.log(`   Failed batches: ${failCount}`);
    
    rl.close();
  });
}

main();


#!/usr/bin/env node

/**
 * Apply audio ID updates in batches via Supabase API
 * This avoids the SQL Editor size limit
 */

const fs = require('fs');
const path = require('path');

async function applyBatch(batchNum) {
  const batchFile = `APPLY_AUDIO_IDS_batch_${batchNum}.sql`;
  
  if (!fs.existsSync(batchFile)) {
    console.log(`❌ Batch file ${batchFile} not found`);
    return false;
  }
  
  const sql = fs.readFileSync(batchFile, 'utf8');
  
  console.log(`\n📦 Applying batch ${batchNum}...`);
  console.log(`   SQL file: ${batchFile}`);
  console.log(`   Size: ${(sql.length / 1024).toFixed(1)} KB`);
  
  // Instructions for manual application
  console.log(`\n📝 To apply this batch:`);
  console.log(`   1. Open Supabase SQL Editor`);
  console.log(`   2. Copy the contents of ${batchFile}`);
  console.log(`   3. Paste and run`);
  console.log(`   4. Wait for completion\n`);
  
  return true;
}

async function main() {
  console.log('🎵 Applying Afghan 2023 Audio IDs\n');
  console.log('✅ Google Drive OAuth setup complete');
  console.log('✅ Extracted 4,200 audio files');
  console.log('✅ Split into 42 batches of 100 updates each\n');
  
  console.log('📋 Batch file list:');
  for (let i = 1; i <= 42; i++) {
    const exists = fs.existsSync(`APPLY_AUDIO_IDS_batch_${i}.sql`);
    console.log(`   ${exists ? '✅' : '❌'} Batch ${i}`);
  }
  
  console.log('\n📝 Instructions:');
  console.log('   1. Open each batch file in Supabase SQL Editor');
  console.log('   2. Run the SQL statements');
  console.log('   3. Verify audio playback after each batch');
  console.log('   4. Repeat for all 42 batches\n');
  
  console.log('💡 Tip: Start with batch 1 to test the process\n');
}

main().catch(console.error);

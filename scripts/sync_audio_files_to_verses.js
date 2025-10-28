#!/usr/bin/env node

/**
 * Sync Audio Files Table to Verses Tables
 * 
 * This script:
 * 1. Reads from audio_files table (source of truth)
 * 2. Syncs Google Drive IDs to verses and verses_yousafzai tables
 * 3. Ensures each verse has unique, correct audio mappings
 * 4. Provides detailed verification and progress tracking
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// ============================================================
// CONFIGURATION
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// MAIN SYNC FUNCTION
// ============================================================

async function syncAudioFilesToVerses() {
  console.log('🎵 Starting Audio Files → Verses Sync\n');
  const startTime = Date.now();

  try {
    // Step 1: Fetch all audio files
    console.log('📂 Step 1: Fetching audio_files table...');
    const { data: audioFiles, error: fetchError } = await supabase
      .from('audio_files')
      .select('id, book, chapter, verse, google_drive_file_id, translation_key, google_drive_url');

    if (fetchError) {
      throw new Error(`Failed to fetch audio_files: ${fetchError.message}`);
    }

    console.log(`✅ Found ${audioFiles.length} audio file records\n`);

    // Step 2: Group by translation
    console.log('📊 Step 2: Grouping by translation...');
    const byTranslation = {
      yousafzai2019: audioFiles.filter(a => a.translation_key === 'yousafzai2019'),
      afghan2023: audioFiles.filter(a => a.translation_key === 'afghan2023')
    };

    console.log(`   - Yousafzai 2019: ${byTranslation.yousafzai2019.length} files`);
    console.log(`   - Afghan 2023: ${byTranslation.afghan2023.length} files\n`);

    // Step 3: Sync Yousafzai to verses_yousafzai
    console.log('🔄 Step 3: Syncing Yousafzai audio to verses_yousafzai table...');
    const yousafzaiResult = await syncTranslation(
      'verses_yousafzai',
      byTranslation.yousafzai2019,
      'yousafzai2019'
    );

    // Step 4: Sync Afghan 2023 to verses
    console.log('\n🔄 Step 4: Syncing Afghan 2023 audio to verses table...');
    const afghanResult = await syncTranslation(
      'verses',
      byTranslation.afghan2023,
      'afghan2023'
    );

    // Step 5: Verification
    console.log('\n✅ Step 5: Verifying sync...');
    await verifySync();

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Sync Complete! (${elapsed}s)`);
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Yousafzai: ${yousafzaiResult.success} updated, ${yousafzaiResult.errors} errors`);
    console.log(`   ✅ Afghan 2023: ${afghanResult.success} updated, ${afghanResult.errors} errors`);
    console.log(`   📈 Total: ${yousafzaiResult.success + afghanResult.success} verses synced`);

  } catch (error) {
    console.error(`\n❌ Fatal Error: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================
// SYNC TRANSLATION
// ============================================================

async function syncTranslation(tableName, audioFiles, translationKey) {
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(audioFiles.length / BATCH_SIZE);

  console.log(`   Processing ${audioFiles.length} files in ${totalBatches} batches...\n`);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, audioFiles.length);
    const batch = audioFiles.slice(start, end);

    for (const audioFile of batch) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .update({
            audio_public_url: audioFile.google_drive_url,
            audio_storage_path: `audio/${translationKey}/${audioFile.book}_${audioFile.chapter}_${audioFile.verse}.mp3`
          })
          .eq('book', audioFile.book)
          .eq('chapter', audioFile.chapter)
          .eq('verse', audioFile.verse)
          .select('id');

        if (error) {
          errorCount++;
          errors.push({
            verse: `${audioFile.book} ${audioFile.chapter}:${audioFile.verse}`,
            error: error.message
          });
        } else if (data && data.length > 0) {
          successCount++;
        }
      } catch (err) {
        errorCount++;
        errors.push({
          verse: `${audioFile.book} ${audioFile.chapter}:${audioFile.verse}`,
          error: err.message
        });
      }
    }

    const progress = ((i + 1) / totalBatches * 100).toFixed(1);
    console.log(`   [${progress}%] Batch ${i + 1}/${totalBatches}: ${successCount} synced, ${errorCount} errors`);

    // Small delay to avoid rate limiting
    if (i < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Log any errors
  if (errors.length > 0) {
    console.log(`\n   ⚠️  Errors encountered:`);
    errors.slice(0, 5).forEach(err => {
      console.log(`      - ${err.verse}: ${err.error}`);
    });
    if (errors.length > 5) {
      console.log(`      ... and ${errors.length - 5} more errors`);
    }
  }

  return { success: successCount, errors: errorCount };
}

// ============================================================
// VERIFICATION
// ============================================================

async function verifySync() {
  try {
    // Check verses_yousafzai
    const { data: yousafzaiStats } = await supabase
      .from('verses_yousafzai')
      .select('id')
      .not('audio_public_url', 'is', null);

    // Check verses
    const { data: versesStats } = await supabase
      .from('verses')
      .select('id')
      .not('audio_public_url', 'is', null);

    console.log(`\n   📈 Verses with Audio URLs:`);
    console.log(`      - verses_yousafzai: ${yousafzaiStats?.length || 0} verses`);
    console.log(`      - verses: ${versesStats?.length || 0} verses`);

    // Sample check - verify different IDs
    console.log(`\n   🔍 Sample Verification (first 3 verses):"`);
    
    const { data: sampleYousafzai } = await supabase
      .from('verses_yousafzai')
      .select('book, chapter, verse, audio_public_url')
      .limit(3);

    if (sampleYousafzai) {
      sampleYousafzai.forEach(v => {
        const fileId = v.audio_public_url?.match(/id=([^&]+)/)?.[1] || 'unknown';
        console.log(`      - ${v.book} ${v.chapter}:${v.verse} → ${fileId}`);
      });
    }

  } catch (error) {
    console.warn(`⚠️  Verification check failed: ${error.message}`);
  }
}

// ============================================================
// RUN SYNC
// ============================================================

syncAudioFilesToVerses().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

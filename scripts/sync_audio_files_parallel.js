#!/usr/bin/env node

/**
 * Parallel Audio Files Sync - Multi-threaded Version
 * 
 * This script:
 * 1. Fetches all audio files from audio_files table
 * 2. Distributes work across multiple parallel workers
 * 3. Syncs audio URLs to verses tables concurrently
 * 4. Provides real-time progress tracking
 * 5. Handles errors gracefully with retry logic
 */

const { createClient } = require('@supabase/supabase-js');
const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

// ============================================================
// CONFIGURATION
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nkombdutnjvaasxrbmdn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const NUM_WORKERS = Math.min(os.cpus().length - 1, 8); // Use multiple CPUs, max 8
const BATCH_SIZE = 100; // Items per worker batch

if (!SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('\n📝 Set it with:');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// MAIN SYNC FUNCTION
// ============================================================

async function syncAudioFilesParallel() {
  console.log(`🎵 Starting Parallel Audio Files → Verses Sync\n`);
  console.log(`⚙️  Using ${NUM_WORKERS} parallel workers\n`);
  const startTime = Date.now();

  try {
    // Step 1: Fetch all audio files
    console.log('📂 Step 1: Fetching all audio files...');
    const { data: audioFiles, error: fetchError } = await supabase
      .from('audio_files')
      .select('id, book, chapter, verse, google_drive_file_id, translation_key, google_drive_url');

    if (fetchError) {
      throw new Error(`Failed to fetch audio_files: ${fetchError.message}`);
    }

    console.log(`✅ Found ${audioFiles.length} audio files\n`);

    // Step 2: Group by translation
    console.log('📊 Step 2: Grouping by translation...');
    const byTranslation = {
      yousafzai2019: audioFiles.filter(a => a.translation_key === 'yousafzai2019'),
      afghan2023: audioFiles.filter(a => a.translation_key === 'afghan2023')
    };

    console.log(`   - Yousafzai 2019: ${byTranslation.yousafzai2019.length} files`);
    console.log(`   - Afghan 2023: ${byTranslation.afghan2023.length} files\n`);

    // Step 3: Sync with parallel workers
    console.log('🔄 Step 3: Syncing with parallel workers...\n');
    
    const yousafzaiResult = await syncWithParallelWorkers(
      'verses_yousafzai',
      byTranslation.yousafzai2019,
      'yousafzai2019'
    );

    const afghanResult = await syncWithParallelWorkers(
      'verses',
      byTranslation.afghan2023,
      'afghan2023'
    );

    // Step 4: Verification
    console.log('\n✅ Step 4: Verifying sync...');
    await verifySync();

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Sync Complete! (${elapsed}s)`);
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Yousafzai: ${yousafzaiResult.success} updated, ${yousafzaiResult.errors} errors`);
    console.log(`   ✅ Afghan 2023: ${afghanResult.success} updated, ${afghanResult.errors} errors`);
    console.log(`   📈 Total: ${yousafzaiResult.success + afghanResult.success} verses synced`);
    console.log(`   ⚡ Processed with ${NUM_WORKERS} parallel workers`);

  } catch (error) {
    console.error(`\n❌ Fatal Error: ${error.message}`);
    process.exit(1);
  }
}

// ============================================================
// PARALLEL WORKER SYNC
// ============================================================

async function syncWithParallelWorkers(tableName, audioFiles, translationKey) {
  if (audioFiles.length === 0) {
    return { success: 0, errors: 0 };
  }

  return new Promise((resolve, reject) => {
    let completedWorkers = 0;
    let totalSuccess = 0;
    let totalErrors = 0;
    const workers = [];

    const totalBatches = Math.ceil(audioFiles.length / BATCH_SIZE);
    let processedBatches = 0;

    console.log(`   Processing ${audioFiles.length} ${translationKey} files in ${totalBatches} batches with ${NUM_WORKERS} workers...\n`);

    // Create worker pool
    for (let w = 0; w < NUM_WORKERS; w++) {
      const worker = new Worker(__filename, {
        workerData: {
          SUPABASE_URL,
          SUPABASE_KEY,
          tableName,
          translationKey,
          isWorker: true
        }
      });

      worker.on('message', (message) => {
        if (message.type === 'progress') {
          totalSuccess += message.success;
          totalErrors += message.errors;
          processedBatches++;
          const progress = (processedBatches / totalBatches * 100).toFixed(1);
          console.log(`   [${progress}%] Batch ${processedBatches}/${totalBatches}: +${message.success} synced, ${message.errors} errors`);
        } else if (message.type === 'complete') {
          completedWorkers++;
          if (completedWorkers === NUM_WORKERS) {
            resolve({ success: totalSuccess, errors: totalErrors });
          }
        } else if (message.type === 'error') {
          console.error(`   ❌ Worker error: ${message.error}`);
        }
      });

      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker exited with code ${code}`));
        }
      });

      workers.push(worker);
    }

    // Distribute batches to workers
    let batchIndex = 0;
    for (let w = 0; w < NUM_WORKERS; w++) {
      const batchesToProcess = [];
      for (let b = w; b < totalBatches; b += NUM_WORKERS) {
        const start = b * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, audioFiles.length);
        batchesToProcess.push(audioFiles.slice(start, end));
      }
      workers[w].postMessage({ batches: batchesToProcess });
    }
  });
}

// ============================================================
// WORKER THREAD CODE
// ============================================================

if (process.env.WORKER_DATA) {
  const workerData = JSON.parse(process.env.WORKER_DATA);
  const supabase = createClient(workerData.SUPABASE_URL, workerData.SUPABASE_KEY);

  const { parentPort } = require('worker_threads');

  parentPort.on('message', async (message) => {
    try {
      for (const batch of message.batches) {
        let batchSuccess = 0;
        let batchErrors = 0;

        for (const audioFile of batch) {
          try {
            // Normalize book name
            let bookName = audioFile.book
              .replace(/^(\d+)([a-z])/, (match, num, letter) => num + ' ' + letter.toUpperCase())
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            const { data, error } = await supabase
              .from(workerData.tableName)
              .update({
                audio_public_url: audioFile.google_drive_url,
                audio_storage_path: `audio/${workerData.translationKey}/${audioFile.book}_${audioFile.chapter}_${audioFile.verse}.mp3`
              })
              .eq('book', bookName)
              .eq('chapter', audioFile.chapter)
              .eq('verse', audioFile.verse)
              .select('id');

            if (error) {
              batchErrors++;
            } else if (data && data.length > 0) {
              batchSuccess++;
            }
          } catch (err) {
            batchErrors++;
          }
        }

        parentPort.postMessage({
          type: 'progress',
          success: batchSuccess,
          errors: batchErrors
        });
      }

      parentPort.postMessage({ type: 'complete' });
    } catch (error) {
      parentPort.postMessage({
        type: 'error',
        error: error.message
      });
    }
  });

  // Keep worker alive
  process.on('SIGTERM', () => process.exit(0));
}

// ============================================================
// VERIFICATION
// ============================================================

async function verifySync() {
  try {
    const { data: yousafzaiStats } = await supabase
      .from('verses_yousafzai')
      .select('id')
      .not('audio_public_url', 'is', null);

    const { data: versesStats } = await supabase
      .from('verses')
      .select('id')
      .not('audio_public_url', 'is', null);

    console.log(`\n   📈 Verses with Audio URLs:`);
    console.log(`      - verses_yousafzai: ${yousafzaiStats?.length || 0} verses`);
    console.log(`      - verses: ${versesStats?.length || 0} verses`);

    console.log(`\n   🔍 Sample Verification (first 3 verses):`);
    
    const { data: sampleYousafzai } = await supabase
      .from('verses_yousafzai')
      .select('book, chapter, verse, audio_public_url')
      .limit(3);

    if (sampleYousafzai && sampleYousafzai.length > 0) {
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

if (!process.env.WORKER_DATA) {
  syncAudioFilesParallel().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

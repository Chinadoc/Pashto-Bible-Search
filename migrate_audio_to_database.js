#!/usr/bin/env node
/**
 * Migration script to populate the audio_files table from JSON data
 * Run this after creating the audio_files table in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateAudioData() {
  console.log('🚀 Starting audio data migration to Supabase...');

  try {
    // Load main Google Drive audio data
    const mainAudioPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
    const mainData = JSON.parse(fs.readFileSync(mainAudioPath, 'utf8'));

    // Load Yousafzai audio data
    const yousafzaiAudioPath = path.join(process.cwd(), 'yousafzai_google_drive_audio_urls.json');
    const yousafzaiData = JSON.parse(fs.readFileSync(yousafzaiAudioPath, 'utf8'));

    console.log(`📊 Found ${Object.keys(mainData).length} main audio entries`);
    console.log(`📊 Found ${Object.keys(yousafzaiData).length} Yousafzai audio entries`);

    // Prepare data for insertion
    const audioFilesData = [];

    // Process main audio data (Afghan 2023)
    for (const [filename, entry] of Object.entries(mainData)) {
      if (entry?.google_drive_file_id && entry?.book && entry?.chapter && entry?.verse) {
        const verseRef = `${entry.book} ${entry.chapter}:${entry.verse}`;
        audioFilesData.push({
          verse_reference: verseRef,
          translation_key: 'afghan2023',
          book: entry.book,
          chapter: parseInt(entry.chapter),
          verse: parseInt(entry.verse),
          google_drive_file_id: entry.google_drive_file_id,
          google_drive_url: entry.google_drive_url,
          file_size_bytes: entry.file_size || null,
          duration_seconds: entry.duration || null,
          audio_quality: 'high' // Assume high quality for main audio
        });
      }
    }

    // Process Yousafzai audio data
    for (const [filename, entry] of Object.entries(yousafzaiData)) {
      if (entry?.google_drive_file_id && entry?.book && entry?.chapter && entry?.verse) {
        const verseRef = `${entry.book} ${entry.chapter}:${entry.verse}`;
        audioFilesData.push({
          verse_reference: verseRef,
          translation_key: 'yousafzai2019',
          book: entry.book,
          chapter: parseInt(entry.chapter),
          verse: parseInt(entry.verse),
          google_drive_file_id: entry.google_drive_file_id,
          google_drive_url: entry.google_drive_url,
          file_size_bytes: entry.file_size || null,
          duration_seconds: entry.duration || null,
          audio_quality: 'high' // Assume high quality for Yousafzai audio
        });
      }
    }

    console.log(`📝 Prepared ${audioFilesData.length} entries for database insertion`);

    if (audioFilesData.length === 0) {
      console.log('❌ No valid audio entries found to migrate');
      return;
    }

    // Insert data in batches to avoid timeout
    const batchSize = 1000;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < audioFilesData.length; i += batchSize) {
      const batch = audioFilesData.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(audioFilesData.length / batchSize)} (${batch.length} entries)`);

      const { data, error } = await supabase
        .from('audio_files')
        .upsert(batch, {
          onConflict: 'verse_reference,translation_key',
          ignoreDuplicates: false
        });

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed: ${batch.length} entries`);
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully migrated: ${successCount} entries`);
    console.log(`❌ Failed: ${errorCount} entries`);
    console.log(`📁 Total processed: ${audioFilesData.length} entries`);

    if (errorCount === 0) {
      console.log(`🎉 Migration completed successfully!`);
    } else {
      console.log(`⚠️ Migration completed with errors. Check the logs above.`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAudioData();

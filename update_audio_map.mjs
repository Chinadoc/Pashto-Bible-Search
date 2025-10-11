#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load audio data from Google Drive URLs file
const audioData = JSON.parse(fs.readFileSync('google_drive_audio_urls.json', 'utf8'));

// Create audio map in the format expected by the system
const audioMap = {};

Object.entries(audioData).forEach(([filename, data]) => {
  if (data.book && data.chapter && data.verse && data.google_drive_file_id && data.google_drive_file_id !== 'TEST_ID') {
    // Convert book name to proper format (capitalize first letter)
    const bookName = data.book.charAt(0).toUpperCase() + data.book.slice(1);
    const verseRef = `${bookName} ${data.chapter}:${data.verse}`;
    audioMap[verseRef] = data.google_drive_file_id;
  }
});

console.log(`📊 Processed ${Object.keys(audioMap).length} audio entries`);
console.log('Sample entries:');
Object.entries(audioMap).slice(0, 5).forEach(([ref, id]) => {
  console.log(`${ref}: ${id}`);
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAudioMap() {
  console.log('🔄 Starting audio map update...');

  const updates = [];

  for (const [verseRef, fileId] of Object.entries(audioMap)) {
    updates.push({
      verse_ref: verseRef,
      url: fileId // The system will convert this to a download URL
    });
  }

  console.log(`📤 Sending ${updates.length} updates to Supabase...`);

  try {
    // Use upsert to insert or update existing records
    const { data, error } = await supabase
      .from('audio_by_verse')
      .upsert(updates, {
        onConflict: 'verse_ref',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('❌ Failed to update audio map:', error);
      return;
    }

    console.log(`✅ Successfully updated ${data?.length || 0} audio entries in Supabase`);

    // Verify the update by checking a few entries
    console.log('🔍 Verifying updates...');
    const testRefs = Object.keys(audioMap).slice(0, 3);
    const { data: verifyData, error: verifyError } = await supabase
      .from('audio_by_verse')
      .select('verse_ref, url')
      .in('verse_ref', testRefs);

    if (verifyError) {
      console.error('❌ Failed to verify updates:', verifyError);
    } else {
      console.log('✅ Verification results:');
      verifyData?.forEach(row => {
        console.log(`  ${row.verse_ref}: ${row.url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating audio map:', error);
  }
}

// Run the update
updateAudioMap().catch(console.error);

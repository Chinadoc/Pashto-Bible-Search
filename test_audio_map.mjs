#!/usr/bin/env node

// Test script to verify audio map loading
import fs from 'fs';
import path from 'path';

async function testAudioMap() {
  console.log('🔍 Testing audio map loading...');

  // Check if Google Drive audio file exists
  const localAudioPath = path.join(process.cwd(), 'google_drive_audio_urls.json');
  console.log(`📁 Checking for audio file at: ${localAudioPath}`);

  if (!fs.existsSync(localAudioPath)) {
    console.error('❌ Google Drive audio file not found');
    return;
  }

  // Load the audio data
  const localAudioData = JSON.parse(fs.readFileSync(localAudioPath, 'utf8'));
  console.log(`✅ Loaded ${Object.keys(localAudioData).length} audio entries`);

  // Test a few entries
  const testEntries = Object.entries(localAudioData).slice(0, 3);
  testEntries.forEach(([filename, data]) => {
    if (data.google_drive_file_id && data.google_drive_file_id !== 'TEST_ID') {
      const bookName = data.book.charAt(0).toUpperCase() + data.book.slice(1);
      const verseRef = `${bookName} ${data.chapter}:${data.verse}`;
      console.log(`✅ ${verseRef}: ${data.google_drive_file_id}`);
    }
  });

  console.log('🎯 Audio map integration test complete');
}

testAudioMap().catch(console.error);

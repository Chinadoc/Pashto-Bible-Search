#!/usr/bin/env node

/**
 * Apply Yousafzai Audio IDs via Supabase API
 * This script reads the CSV file and updates the database programmatically
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please set these environment variables and try again');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const mappings = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV manually (handling quoted values)
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    const mapping = {
      translation: values[0],
      book: values[1],
      chapter: parseInt(values[2], 10),
      verse: parseInt(values[3], 10),
      file_id: values[4],
      file_name: values[5]
    };
    
    mappings.push(mapping);
  }
  
  return mappings;
}

async function updateAudioBatch(mappings, batchNum, batchSize = 100) {
  const startIdx = (batchNum - 1) * batchSize;
  const endIdx = Math.min(startIdx + batchSize, mappings.length);
  const batch = mappings.slice(startIdx, endIdx);
  
  console.log(`\n📦 Batch ${batchNum}: Updating ${batch.length} verses (${startIdx + 1}-${endIdx})`);
  
  const updates = [];
  for (const mapping of batch) {
    const audioUrl = `https://drive.google.com/uc?id=${mapping.file_id}&export=download`;
    const storagePath = `audio/${mapping.translation}/${mapping.file_name}`;
    
    updates.push({
      book: mapping.book,
      chapter: mapping.chapter,
      verse: mapping.verse,
      audio_public_url: audioUrl,
      audio_storage_path: storagePath
    });
  }
  
  // Group updates by book for efficiency
  const updatesByBook = {};
  for (const update of updates) {
    if (!updatesByBook[update.book]) {
      updatesByBook[update.book] = [];
    }
    updatesByBook[update.book].push(update);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [book, bookUpdates] of Object.entries(updatesByBook)) {
    for (const update of bookUpdates) {
      const { error } = await supabase
        .from('verses_yousafzai')
        .update({
          audio_public_url: update.audio_public_url,
          audio_storage_path: update.audio_storage_path
        })
        .eq('book', update.book)
        .eq('chapter', update.chapter)
        .eq('verse', update.verse);
      
      if (error) {
        console.error(`❌ Error updating ${update.book} ${update.chapter}:${update.verse}:`, error.message);
        errorCount++;
      } else {
        successCount++;
      }
    }
  }
  
  console.log(`✅ Batch ${batchNum} complete: ${successCount} updated, ${errorCount} errors`);
  
  return { successCount, errorCount };
}

async function main() {
  console.log('🎵 Applying Yousafzai Audio IDs via Supabase API\n');
  
  // Read CSV file
  const csvFile = path.join(__dirname, '..', 'yousafzai_audio_mapping.csv');
  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV file not found: ${csvFile}`);
    process.exit(1);
  }
  
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const mappings = parseCSV(csvContent);
  
  console.log(`📊 Loaded ${mappings.length} audio mappings from CSV`);
  
  // Calculate batches
  const batchSize = 100;
  const totalBatches = Math.ceil(mappings.length / batchSize);
  
  console.log(`📦 Processing in ${totalBatches} batches of ${batchSize} updates each\n`);
  
  // Process batches with delay to avoid rate limiting
  let totalSuccess = 0;
  let totalErrors = 0;
  
  for (let i = 1; i <= totalBatches; i++) {
    const result = await updateAudioBatch(mappings, i, batchSize);
    totalSuccess += result.successCount;
    totalErrors += result.errorCount;
    
    // Progress indicator
    const progress = ((i / totalBatches) * 100).toFixed(1);
    console.log(`📈 Overall progress: ${progress}% (${totalSuccess} successful, ${totalErrors} errors)`);
    
    // Add delay between batches to avoid rate limiting
    if (i < totalBatches) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n🎉 Audio update complete!');
  console.log(`✅ Total successful: ${totalSuccess}`);
  console.log(`❌ Total errors: ${totalErrors}`);
  console.log(`📊 Coverage: ${((totalSuccess / mappings.length) * 100).toFixed(1)}%`);
}

main().catch(console.error);

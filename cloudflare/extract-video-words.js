/**
 * Extract words from video transcripts and add to word_frequencies
 * This script processes all video transcripts and extracts Pashto words
 */

const { execSync } = require('child_process');

const DB_NAME = 'pashto-bible-db';
const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

async function queryD1(sql) {
  const response = await fetch(`${WORKER_URL}/api/d1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Worker API error: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data.results || [];
}

function executeSQL(sql) {
  const fs = require('fs');
  const path = require('path');
  const tempFile = path.join(process.cwd(), `.temp-exec-${Date.now()}.sql`);
  fs.writeFileSync(tempFile, sql, 'utf-8');

  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024 }
    );
    return true;
  } catch (error) {
    console.error('SQL execution error:', error.message);
    return false;
  } finally {
    fs.unlinkSync(tempFile);
  }
}

function extractPashtoWords(text) {
  // Extract Pashto words (Unicode range \u0600-\u06FF)
  const words = text.match(/[\u0600-\u06FF]+/g) || [];
  return words.map(w => w.trim()).filter(w => w.length > 0);
}

function cleanWord(word) {
  // Remove punctuation and normalize
  return word
    .replace(/[.,!?؟،[\](){}«»]/g, '')
    .trim();
}

async function processVideoTranscripts() {
  console.log('🎬 Processing video transcripts to extract words...\n');

  try {
    // Step 1: Get all video transcripts
    const videos = await queryD1(`
      SELECT video_id, transcript, segments, title
      FROM video_transcripts
      WHERE transcript IS NOT NULL AND transcript != '';
    `);

    console.log(`Found ${videos.length} videos with transcripts\n`);

    if (videos.length === 0) {
      console.log('✅ No video transcripts found.');
      return;
    }

    // Step 2: Process each video
    const wordCounts = new Map(); // word -> { frequency: number, video_ids: Set }
    
    for (const video of videos) {
      const videoId = video.video_id;
      const transcript = video.transcript || '';
      
      console.log(`Processing video: ${videoId}`);
      
      // Extract words from transcript
      const words = extractPashtoWords(transcript);
      
      // Count words per video
      const videoWordCounts = new Map();
      for (const word of words) {
        const cleaned = cleanWord(word);
        if (cleaned && cleaned.length > 0) {
          videoWordCounts.set(cleaned, (videoWordCounts.get(cleaned) || 0) + 1);
        }
      }
      
      // Merge into global counts
      for (const [word, count] of videoWordCounts.entries()) {
        if (!wordCounts.has(word)) {
          wordCounts.set(word, { frequency: 0, video_ids: new Set() });
        }
        const entry = wordCounts.get(word);
        entry.frequency += count;
        entry.video_ids.add(videoId);
      }
      
      console.log(`   Extracted ${words.length} words, ${videoWordCounts.size} unique words`);
    }

    console.log(`\n📊 Total unique words from videos: ${wordCounts.size}\n`);

    // Step 3: Add/update word_frequencies
    console.log('💾 Adding words to word_frequencies...');
    
    const batchSize = 100;
    const allWords = Array.from(wordCounts.entries());
    let processed = 0;

    for (let i = 0; i < allWords.length; i += batchSize) {
      const batch = allWords.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(allWords.length / batchSize);

      console.log(`   Processing batch ${batchNum}/${totalBatches}...`);

      const sqlStatements = [];

      for (const [word, data] of batch) {
        // Check if word exists
        const existing = await queryD1(`SELECT id, frequency_total FROM word_frequencies WHERE pashto_word = '${word.replace(/'/g, "''")}' LIMIT 1;`);
        const existingWord = existing[0];

        if (existingWord) {
          // Update existing word - add video frequency
          // Note: We're adding frequency, but video-specific tracking would need a separate table
          sqlStatements.push(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ${data.frequency},
              updated_at = strftime('%s', 'now')
            WHERE id = ${existingWord.id};
          `);
        } else {
          // Insert new word
          // Note: video_ids would ideally be stored in a separate table
          sqlStatements.push(`
            INSERT INTO word_frequencies (
              pashto_word,
              frequency_total,
              frequency_afghan2023_ot,
              frequency_afghan2023_nt,
              frequency_yousafzai2019_ot,
              frequency_yousafzai2019_nt,
              frequency_rank,
              created_at,
              updated_at
            ) VALUES (
              '${word.replace(/'/g, "''")}',
              ${data.frequency},
              0,
              0,
              0,
              0,
              0,
              strftime('%s', 'now'),
              strftime('%s', 'now')
            );
          `);
        }
      }

      // Execute batch
      if (sqlStatements.length > 0) {
        const sql = sqlStatements.join('\n');
        const success = await executeSQL(sql);
        if (success) {
          processed += batch.length;
          console.log(`   ✅ Batch ${batchNum} completed`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 4: Create video_word_mappings table for searchability
    console.log('\n🔗 Creating video_word_mappings table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS video_word_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT NOT NULL,
        pashto_word TEXT NOT NULL,
        frequency INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(video_id, pashto_word)
      );
      
      CREATE INDEX IF NOT EXISTS idx_video_word_video ON video_word_mappings(video_id);
      CREATE INDEX IF NOT EXISTS idx_video_word_word ON video_word_mappings(pashto_word);
    `;
    
    await executeSQL(createTableSQL);

    // Step 5: Populate video_word_mappings
    console.log('📝 Populating video_word_mappings...');
    
    const mappingSQL = [];
    
    for (const video of videos) {
      const videoId = video.video_id;
      const transcript = video.transcript || '';
      const words = extractPashtoWords(transcript);
      
      const videoWordCounts = new Map();
      for (const word of words) {
        const cleaned = cleanWord(word);
        if (cleaned && cleaned.length > 0) {
          videoWordCounts.set(cleaned, (videoWordCounts.get(cleaned) || 0) + 1);
        }
      }
      
      for (const [word, count] of videoWordCounts.entries()) {
        mappingSQL.push(`
          INSERT OR REPLACE INTO video_word_mappings (video_id, pashto_word, frequency, updated_at)
          VALUES ('${videoId.replace(/'/g, "''")}', '${word.replace(/'/g, "''")}', ${count}, strftime('%s', 'now'));
        `);
      }
    }

    // Execute in batches
    const mappingBatchSize = 500;
    for (let i = 0; i < mappingSQL.length; i += mappingBatchSize) {
      const batch = mappingSQL.slice(i, i + mappingBatchSize);
      const sql = batch.join('\n');
      await executeSQL(sql);
      console.log(`   Processed ${Math.min(i + mappingBatchSize, mappingSQL.length)}/${mappingSQL.length} mappings...`);
    }

    // Step 6: Recalculate ranks
    console.log('\n📊 Recalculating frequency ranks...');
    await executeSQL(`
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      );
    `);

    console.log('\n✅ Processing complete!');
    console.log(`   - Videos processed: ${videos.length}`);
    console.log(`   - Unique words extracted: ${wordCounts.size}`);
    console.log(`   - Video-word mappings created: ${mappingSQL.length}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

processVideoTranscripts();


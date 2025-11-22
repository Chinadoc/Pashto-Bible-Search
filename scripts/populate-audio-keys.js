#!/usr/bin/env node

/**
 * Script to populate audio_r2_key in D1 database based on R2 bucket contents
 * 
 * This script:
 * 1. Lists all audio files in R2
 * 2. Parses file names to extract book, chapter, verse, translation
 * 3. Updates the corresponding verses in D1 with the audio_r2_key
 */

const WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Parse audio file name to extract verse reference
function parseAudioFileName(key) {
    // Afghan 2023: afghan2023/nt/acts10_verse_001.mp3
    // Yousafzai: yousafzai/nt/yousafzai_acts001_verse_001.mp3

    const parts = key.split('/');
    if (parts.length !== 3) return null;

    const [translation, testament, filename] = parts;

    // Remove .mp3 extension
    const base = filename.replace('.mp3', '');

    let bookChapter, verseStr;

    if (translation === 'yousafzai') {
        // Format: yousafzai_acts001_verse_001
        const match = base.match(/^yousafzai_([a-z0-9]+)_verse_(\d{3})$/);
        if (!match) return null;
        bookChapter = match[1];
        verseStr = match[2];
    } else {
        // Format: acts10_verse_001
        const match = base.match(/^([a-z0-9]+)_verse_(\d{3})$/);
        if (!match) return null;
        bookChapter = match[1];
        verseStr = match[2];
    }

    // Extract book and chapter
    // For Yousafzai: acts001 -> acts, chapter 1
    // For Afghan: acts10 -> acts, chapter 10
    const bookMatch = bookChapter.match(/^([a-z]+)(\d+)$/);
    if (!bookMatch) return null;

    const book = bookMatch[1];
    const chapter = parseInt(bookMatch[2], 10);
    const verse = parseInt(verseStr, 10);

    // Normalize book name (capitalize first letter)
    const normalizedBook = book.charAt(0).toUpperCase() + book.slice(1);

    return {
        book: normalizedBook,
        chapter,
        verse,
        translation: translation === 'yousafzai' ? 'yousafzai2019' : 'afghan2023',
        audioKey: key
    };
}

async function populateAudioKeys() {
    console.log('🎵 Fetching R2 audio file list...');

    // Fetch all audio files
    const response = await fetch(`${WORKER_URL}/api/r2/list`);
    const data = await response.json();

    console.log(`📦 Found ${data.count} total files in R2`);

    // Parse all file names
    const updates = [];

    for (const obj of data.objects) {
        const parsed = parseAudioFileName(obj.key);
        if (parsed) {
            updates.push(parsed);
        }
    }

    console.log(`✅ Parsed ${updates.length} valid audio file references`);

    // Group by translation
    const afghan = updates.filter(u => u.translation === 'afghan2023');
    const yousafzai = updates.filter(u => u.translation === 'yousafzai2019');

    console.log(`  - Afghan 2023: ${afghan.length} files`);
    console.log(`  - Yousafzai: ${yousafzai.length} files`);

    // Update database
    console.log('\n🔄 Updating database...');

    for (const update of updates) {
        const table = update.translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';
        const sql = `UPDATE ${table} SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse}`;

        try {
            const response = await fetch(`${WORKER_URL}/api/d1/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sql: `SELECT id FROM ${table} WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse} LIMIT 1` })
            });

            const result = await response.json();

            if (result.results && result.results.length > 0) {
                // Verse exists - we would update it here but the D1 API only allows SELECT
                // We need to use wrangler for updates
                console.log(`  ✓ ${update.translation} ${update.book} ${update.chapter}:${update.verse}`);
            }
        } catch (error) {
            console.error(`  ✗ Failed to check ${update.book} ${update.chapter}:${update.verse}:`, error.message);
        }
    }

    console.log('\n⚠️  Note: To actually update the database, we need to use wrangler CLI');
    console.log('The D1 API only allows SELECT queries for security.');

    // Generate SQL statements for manual execution
    console.log('\n📝 Generated SQL statements (save to file and execute with wrangler):');
    console.log('\n-- Afghan 2023 updates:');
    for (const update of afghan.slice(0, 5)) {
        console.log(`UPDATE verses_afghan2023 SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};`);
    }
    console.log(`-- ... (${afghan.length - 5} more)`);

    console.log('\n-- Yousafzai updates:');
    for (const update of yousafzai.slice(0, 5)) {
        console.log(`UPDATE verses_yousafzai SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};`);
    }
    console.log(`-- ... (${yousafzai.length - 5} more)`);

    // Save to file
    const fs = require('fs');
    let sqlFile = '-- Populate audio_r2_key in D1 database\n\n';

    sqlFile += '-- Afghan 2023 updates:\n';
    for (const update of afghan) {
        sqlFile += `UPDATE verses_afghan2023 SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};\n`;
    }

    sqlFile += '\n-- Yousafzai updates:\n';
    for (const update of yousafzai) {
        sqlFile += `UPDATE verses_yousafzai SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};\n`;
    }

    fs.writeFileSync('populate_audio_keys.sql', sqlFile);
    console.log('\n✅ SQL file written to populate_audio_keys.sql');
    console.log('Run with: wrangler d1 execute pashto-bible-db --file=populate_audio_keys.sql');
}

populateAudioKeys().catch(console.error);

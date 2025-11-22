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
    console.log('🎵 Fetching ALL R2 audio files...');

    // Fetch ALL audio files by paginating through the bucket
    let allObjects = [];
    let cursor = undefined;
    let page = 0;

    do {
        page++;
        const url = cursor
            ? `${WORKER_URL}/api/r2/list?cursor=${encodeURIComponent(cursor)}`
            : `${WORKER_URL}/api/r2/list`;

        console.log(`  Fetching page ${page}...`);
        const response = await fetch(url);
        const data = await response.json();

        if (data.objects && data.objects.length > 0) {
            allObjects = allObjects.concat(data.objects);
            console.log(`  → Got ${data.objects.length} files (total: ${allObjects.length})`);
        }

        cursor = data.cursor;

        // Safety limit to prevent infinite loops
        if (page > 1000) {
            console.warn('⚠️  Reached page limit of 1000, stopping pagination');
            break;
        }
    } while (cursor);

    console.log(`\n📦 Found ${allObjects.length} total files in R2`);

    // Parse all file names
    const updates = [];

    for (const obj of allObjects) {
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

    // Group by book to show coverage
    const afghanBooks = new Set(afghan.map(u => u.book));
    const yousafzaiBooks = new Set(yousafzai.map(u => u.book));

    console.log(`\n📚 Book coverage:`);
    console.log(`  - Afghan 2023: ${afghanBooks.size} books - ${Array.from(afghanBooks).sort().join(', ')}`);
    console.log(`  - Yousafzai: ${yousafzaiBooks.size} books - ${Array.from(yousafzaiBooks).sort().join(', ')}`);

    // Save to file
    const fs = require('fs');
    let sqlFile = `-- Populate audio_r2_key in D1 database\n`;
    sqlFile += `-- Generated on ${new Date().toISOString()}\n`;
    sqlFile += `-- Total updates: ${updates.length}\n\n`;

    sqlFile += `-- Afghan 2023 updates (${afghan.length} verses):\n`;
    for (const update of afghan) {
        sqlFile += `UPDATE verses_afghan2023 SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};\n`;
    }

    sqlFile += `\n-- Yousafzai updates (${yousafzai.length} verses):\n`;
    for (const update of yousafzai) {
        sqlFile += `UPDATE verses_yousafzai SET audio_r2_key = '${update.audioKey}' WHERE book = '${update.book}' AND chapter = ${update.chapter} AND verse = ${update.verse};\n`;
    }

    fs.writeFileSync('populate_audio_keys.sql', sqlFile);
    console.log(`\n✅ SQL file written to populate_audio_keys.sql (${updates.length} updates)`);
    console.log('Run with: npx wrangler d1 execute pashto-bible-db --remote --file=populate_audio_keys.sql');
}

populateAudioKeys().catch(console.error);

#!/usr/bin/env node

/**
 * Extract Yousafzai Audio Files from Google Drive
 * 
 * This script:
 * 1. Searches for all Yousafzai audio files in Google Drive
 * 2. Extracts file IDs and names
 * 3. Maps file names to book/chapter/verse
 * 4. Generates CSV for database updates
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Configuration
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const token = JSON.parse(fs.readFileSync('drive_token.json', 'utf8'));
const oauth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);
oauth2Client.setCredentials(token);
const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const BOOK_MAPPING = {
  'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth',
  '1samuel': '1 Samuel', '2samuel': '2 Samuel', '1kings': '1 Kings', '2kings': '2 Kings',
  '1chronicles': '1 Chronicles', '2chronicles': '2 Chronicles', 'ezra': 'Ezra',
  'nehemiah': 'Nehemiah', 'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms',
  'proverbs': 'Proverbs', 'ecclesiastes': 'Ecclesiastes', 'songofsolomon': 'Song of Solomon',
  'songofsongs': 'Song of Solomon', 'songsofsolomon': 'Song of Solomon',
  'isaiah': 'Isaiah', 'jeremiah': 'Jeremiah', 'lamentations': 'Lamentations',
  'ezekiel': 'Ezekiel', 'daniel': 'Daniel', 'hosea': 'Hosea', 'joel': 'Joel',
  'amos': 'Amos', 'obadiah': 'Obadiah', 'jonah': 'Jonah', 'micah': 'Micah',
  'nahum': 'Nahum', 'habakkuk': 'Habakkuk', 'zephaniah': 'Zephaniah', 'haggai': 'Haggai',
  'zechariah': 'Zechariah', 'malachi': 'Malachi', 'matthew': 'Matthew', 'mark': 'Mark',
  'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'romans': 'Romans',
  '1corinthians': '1 Corinthians', '2corinthians': '2 Corinthians', 'galatians': 'Galatians',
  'ephesians': 'Ephesians', 'philippians': 'Philippians', 'colossians': 'Colossians',
  '1thessalonians': '1 Thessalonians', '2thessalonians': '2 Thessalonians',
  '1timothy': '1 Timothy', '2timothy': '2 Timothy', 'titus': 'Titus', 'philemon': 'Philemon',
  'hebrews': 'Hebrews', 'james': 'James', '1peter': '1 Peter', '2peter': '2 Peter',
  '1john': '1 John', '2john': '2 John', '3john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation'
};

// Parse Yousafzai filename: yousafzai_genesis001_verse_001.mp3
function parseYousafzaiFilename(filename) {
  // Pattern 1: yousafzai_{bookname}{zero-padded-chapter}_verse_{zero-padded-verse}.mp3
  let match = filename.match(/yousafzai_(\w+?)(\d{2,3})_verse_(\d{2,3})\.mp3/i);
  
  // Pattern 2: yousafzai_{book-name}{zero-padded-chapter}_verse_{zero-padded-verse}.mp3 (with hyphens)
  if (!match) {
    match = filename.match(/yousafzai_([\w-]+?)(\d{2,3})_verse_(\d{2,3})\.mp3/i);
  }
  
  if (!match) return null;
  
  const bookNameLower = match[1].toLowerCase();
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);
  
  // Normalize book name (remove hyphens and handle special cases)
  let normalizedBookName = bookNameLower.replace(/-/g, '');
  
  // Handle special case: song-of-songs → songsofsolomon
  if (normalizedBookName === 'songofsongs') {
    normalizedBookName = 'songsofsolomon';
  }
  
  const bookName = BOOK_MAPPING[normalizedBookName];
  if (!bookName) {
    // Try with '1' or '2' prefix
    const withPrefix = '1' + normalizedBookName;
    const bookNameWithPrefix = BOOK_MAPPING[withPrefix];
    if (bookNameWithPrefix) {
      return { bookName: bookNameWithPrefix, chapter, verse };
    }
    
    // Try with '2' prefix
    const withPrefix2 = '2' + normalizedBookName;
    const bookNameWithPrefix2 = BOOK_MAPPING[withPrefix2];
    if (bookNameWithPrefix2) {
      return { bookName: bookNameWithPrefix2, chapter, verse };
    }
    
    console.warn(`⚠️  Could not map book: ${bookNameLower} (normalized: ${normalizedBookName})`);
    return null;
  }
  
  return { bookName, chapter, verse };
}

async function getAllYousafzaiFiles() {
  console.log('🔍 Searching for all Yousafzai audio files...\n');
  
  const results = [];
  let pageToken = null;
  let count = 0;
  
  do {
    const response = await drive.files.list({
      q: "name contains 'yousafzai' and mimeType = 'audio/mpeg' and trashed = false",
      spaces: 'drive',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 1000,
      pageToken: pageToken
    });
    
    const files = response.data.files || [];
    results.push(...files);
    count += files.length;
    
    if (count % 1000 === 0) {
      console.log(`  📊 Found ${count} files so far...`);
    }
    
    pageToken = response.data.nextPageToken;
  } while (pageToken);
  
  console.log(`✅ Found ${results.length} total Yousafzai audio files\n`);
  return results;
}

async function main() {
  console.log('🎵 Extracting Yousafzai Audio Files from Google Drive\n');
  
  // Get all files
  const files = await getAllYousafzaiFiles();
  
  // Process and map files
  const mappings = [];
  const errors = [];
  
  console.log('📝 Processing files...\n');
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const parsed = parseYousafzaiFilename(file.name);
    
    if (parsed) {
      mappings.push({
        translation: 'yousafzai',
        book: parsed.bookName,
        chapter: parsed.chapter,
        verse: parsed.verse,
        file_id: file.id,
        file_name: file.name
      });
    } else {
      errors.push(file.name);
    }
    
    if ((i + 1) % 1000 === 0) {
      console.log(`  ✅ Processed ${i + 1}/${files.length} files (${mappings.length} mapped, ${errors.length} errors)`);
    }
  }
  
  console.log(`\n✅ Processing complete:`);
  console.log(`   Mapped: ${mappings.length} files`);
  console.log(`   Errors: ${errors.length} files`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Files that couldn't be parsed:`);
    errors.slice(0, 10).forEach(name => console.log(`   - ${name}`));
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more`);
    }
  }
  
  // Write mappings to CSV
  const csvFile = path.join(__dirname, '..', 'yousafzai_audio_mapping.csv');
  const csvContent = [
    'translation,book,chapter,verse,file_id,file_name',
    ...mappings.map(m => 
      `${m.translation},${m.book},${m.chapter},${m.verse},${m.file_id},"${m.file_name}"`
    )
  ].join('\n');
  
  fs.writeFileSync(csvFile, csvContent);
  console.log(`\n✅ Saved mapping to: ${csvFile}`);
  console.log(`📊 Total mappings: ${mappings.length}`);
  
  // Generate SQL for reference
  const sqlFile = path.join(__dirname, '..', 'APPLY_YOUSAFZAI_AUDIO_IDS.sql');
  const sqlStatements = generateSQL(mappings);
  fs.writeFileSync(sqlFile, sqlStatements);
  console.log(`✅ Generated SQL: ${sqlFile}\n`);
  
  console.log('🎉 Extraction complete!');
  console.log('📝 Next steps:');
  console.log('   1. Review the mappings in yousafzai_audio_mapping.csv');
  console.log('   2. Run the application script to update Supabase');
  console.log('   3. Test audio playback\n');
}

function generateSQL(mappings) {
  const statements = [
    '-- Auto-generated SQL to update Yousafzai audio IDs in Supabase',
    '-- Generated from Google Drive API file extraction\n',
    '-- Update Yousafzai audio IDs',
  ];
  
  for (const m of mappings) {
    const url = `https://drive.google.com/uc?id=${m.file_id}&export=download`;
    statements.push(
      `UPDATE public.verses_yousafzai SET audio_public_url = '${url}', audio_storage_path = 'audio/yousafzai/${m.file_name}' WHERE book = '${m.book}' AND chapter = ${m.chapter} AND verse = ${m.verse};`
    );
  }
  
  return statements.join('\n');
}

main().catch(console.error);

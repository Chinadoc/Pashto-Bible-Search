#!/usr/bin/env node

/**
 * Audio File Mapping Extractor
 * 
 * This script helps identify and map audio files from Google Drive to database verses.
 * Since we can't access Google Drive API directly without authentication, this provides
 * a manual workflow to:
 * 1. List files from Google Drive folders
 * 2. Extract file IDs from shared links
 * 3. Create a mapping between file names and verses
 * 4. Generate SQL to update the database
 */

const fs = require('fs');
const path = require('path');

// Book name to number mapping (helps with file naming patterns)
const BOOK_MAPPING = {
  // Old Testament
  'Genesis': '01', 'Exodus': '02', 'Leviticus': '03', 'Numbers': '04', 'Deuteronomy': '05',
  'Joshua': '06', 'Judges': '07', 'Ruth': '08', '1 Samuel': '09', '2 Samuel': '10',
  '1 Kings': '11', '2 Kings': '12', '1 Chronicles': '13', '2 Chronicles': '14',
  'Ezra': '15', 'Nehemiah': '16', 'Esther': '17', 'Job': '18', 'Psalms': '19',
  'Proverbs': '20', 'Ecclesiastes': '21', 'Song of Solomon': '22', 'Isaiah': '23',
  'Jeremiah': '24', 'Lamentations': '25', 'Ezekiel': '26', 'Daniel': '27', 'Hosea': '28',
  'Joel': '29', 'Amos': '30', 'Obadiah': '31', 'Jonah': '32', 'Micah': '33', 'Nahum': '34',
  'Habakkuk': '35', 'Zephaniah': '36', 'Haggai': '37', 'Zechariah': '38', 'Malachi': '39',
  // New Testament
  'Matthew': '40', 'Mark': '41', 'Luke': '42', 'John': '43', 'Acts': '44', 'Romans': '45',
  '1 Corinthians': '46', '2 Corinthians': '47', 'Galatians': '48', 'Ephesians': '49',
  'Philippians': '50', 'Colossians': '51', '1 Thessalonians': '52', '2 Thessalonians': '53',
  '1 Timothy': '54', '2 Timothy': '55', 'Titus': '56', 'Philemon': '57', 'Hebrews': '58',
  'James': '59', '1 Peter': '60', '2 Peter': '61', '1 John': '62', '2 John': '63', '3 John': '64',
  'Jude': '65', 'Revelation': '66'
};

// Reverse mapping (number to name)
const NUMBER_TO_BOOK = Object.fromEntries(
  Object.entries(BOOK_MAPPING).map(([name, num]) => [num, name])
);

console.log('📁 Audio File Mapping Extractor');
console.log('================================\n');

console.log('✋ MANUAL WORKFLOW:\n');

console.log('1. 📂 Go to your Google Drive folders:');
console.log('   - Yousafzai: https://drive.google.com/drive/u/0/folders/1m-Mv7r01GHTqXkz2FxAXfANn_7sSHRSUC');
console.log('   - Afghan 2023: (path from your Drive)\n');

console.log('2. 📝 For each folder:');
console.log('   - List all files');
console.log('   - Extract file IDs from share links');
console.log('   - Match filenames to verses using pattern:\n');

console.log('   Yousafzai Pattern: yousafzai_{bookname}{chapter}_{verse}.mp3');
console.log('   Examples:');
console.log('   - yousafzai_zechariah014_verse_011.mp3 → Zechariah 14:11');
console.log('   - yousafzai_genesis001_verse_001.mp3 → Genesis 1:1\n');

console.log('3. 🔗 To get file IDs from Google Drive:');
console.log('   - Right-click file → Get link');
console.log('   - Link format: https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link');
console.log('   - Extract the FILE_ID\n');

console.log('4. 📊 Create a CSV mapping file with this structure:');
console.log('   translation,book,chapter,verse,file_id,file_name');
console.log('   yousafzai,Zechariah,14,11,1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2,yousafzai_zechariah014_verse_011.mp3\n');

console.log('5. 📤 Save the mapping as: audio_mapping.csv\n');

console.log('Helper Function: Parse Yousafzai Filename\n');

// Helper function to parse Yousafzai filenames
function parseYousafzaiFilename(filename) {
  // Pattern: yousafzai_genesis001_verse_001.mp3
  const match = filename.match(/yousafzai_(\w+?)(\d{2,3})_verse_(\d{3})\.mp3/i);
  if (!match) return null;
  
  const [, bookName, chapterNum, verseNum] = match;
  const chapter = parseInt(chapterNum, 10);
  const verse = parseInt(verseNum, 10);
  
  return { bookName, chapter, verse };
}

console.log('Example: parseYousafzaiFilename("yousafzai_zechariah014_verse_011.mp3")');
console.log('Result:', parseYousafzaiFilename("yousafzai_zechariah014_verse_011.mp3"));
console.log();

console.log('Once you have audio_mapping.csv, run:');
console.log('node scripts/apply_audio_mapping.js');

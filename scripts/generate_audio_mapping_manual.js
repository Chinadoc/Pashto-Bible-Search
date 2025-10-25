#!/usr/bin/env node

/**
 * Manual Audio File Mapping Generator
 * 
 * Since OAuth is having redirect issues, this script lets you:
 * 1. Manually list files from Google Drive
 * 2. Extract file IDs from shared links
 * 3. Generate the SQL to update Supabase
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BOOK_MAPPING = {
  'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers',
  'deuteronomy': 'Deuteronomy', 'joshua': 'Joshua', 'judges': 'Judges', 'ruth': 'Ruth',
  '1samuel': '1 Samuel', '2samuel': '2 Samuel', '1kings': '1 Kings', '2kings': '2 Kings',
  '1chronicles': '1 Chronicles', '2chronicles': '2 Chronicles', 'ezra': 'Ezra',
  'nehemiah': 'Nehemiah', 'esther': 'Esther', 'job': 'Job', 'psalms': 'Psalms',
  'proverbs': 'Proverbs', 'ecclesiastes': 'Ecclesiastes', 'songofsolomon': 'Song of Solomon',
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

function parseYousafzaiFilename(filename) {
  const match = filename.match(/yousafzai_(\w+?)(\d{2,3})_verse_(\d{3})\.mp3/i);
  if (!match) return null;
  
  const bookNameLower = match[1].toLowerCase();
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);
  
  const bookName = BOOK_MAPPING[bookNameLower];
  if (!bookName) {
    console.warn(`⚠️  Could not map book: ${bookNameLower}`);
    return null;
  }
  
  return { bookName, chapter, verse };
}

function parseAfghan2023Filename(filename) {
  let match = filename.match(/afghan_(\w+?)_(\d{1,3})_(\d{1,3})\.mp3/i);
  if (match) {
    const bookNameLower = match[1].toLowerCase();
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);
    
    const bookName = BOOK_MAPPING[bookNameLower];
    if (!bookName) {
      console.warn(`⚠️  Could not map book: ${bookNameLower}`);
      return null;
    }
    
    return { bookName, chapter, verse };
  }
  
  match = filename.match(/(\w+?)_(\d{1,3})_(\d{1,3})\.mp3/i);
  if (match) {
    const bookNameLower = match[1].toLowerCase();
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);
    
    const bookName = BOOK_MAPPING[bookNameLower];
    if (!bookName) {
      console.warn(`⚠️  Could not map book: ${bookNameLower}`);
      return null;
    }
    
    return { bookName, chapter, verse };
  }
  
  return null;
}

async function processAudioMappingCSV() {
  console.log('📋 Manual Audio File Mapping\n');
  console.log('Instructions:');
  console.log('1. Go to your Google Drive folder');
  console.log('2. For each audio file, right-click → "Get link"');
  console.log('3. Copy the link and extract the FILE_ID');
  console.log('   Link format: https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link\n');
  
  console.log('4. Create a file named: audio_files.txt');
  console.log('5. Put one line per file in this format:');
  console.log('   filename.mp3,FILE_ID\n');
  console.log('Example:');
  console.log('   yousafzai_genesis001_verse_001.mp3,1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2');
  console.log('   yousafzai_genesis001_verse_002.mp3,1dGh5_7kL9mN2oPq3rSt4uVw5xYz6aB7\n');
  
  // Check if audio_files.txt exists
  const audioFilesPath = path.join(__dirname, '..', 'audio_files.txt');
  
  if (!fs.existsSync(audioFilesPath)) {
    console.error('❌ audio_files.txt not found!');
    console.error(`   Please create it at: ${audioFilesPath}\n`);
    process.exit(1);
  }
  
  console.log('📖 Reading audio_files.txt...\n');
  
  const content = fs.readFileSync(audioFilesPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const mappings = [];
  
  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length !== 2) {
      console.warn(`⚠️  Skipping invalid line: ${line}`);
      continue;
    }
    
    const [filename, fileId] = parts;
    
    let parsed;
    if (filename.startsWith('yousafzai_')) {
      parsed = parseYousafzaiFilename(filename);
      if (parsed) {
        mappings.push({
          translation: 'yousafzai',
          book: parsed.bookName,
          chapter: parsed.chapter,
          verse: parsed.verse,
          file_id: fileId,
          file_name: filename
        });
      }
    } else {
      parsed = parseAfghan2023Filename(filename);
      if (parsed) {
        mappings.push({
          translation: 'afghan2023',
          book: parsed.bookName,
          chapter: parsed.chapter,
          verse: parsed.verse,
          file_id: fileId,
          file_name: filename
        });
      }
    }
  }
  
  console.log(`✅ Mapped ${mappings.length} files\n`);
  
  if (mappings.length === 0) {
    console.error('❌ No valid mappings found!');
    process.exit(1);
  }
  
  // Generate SQL
  const sqlFile = path.join(__dirname, '..', 'APPLY_AUDIO_IDS.sql');
  const statements = [
    '-- Auto-generated SQL to update audio IDs in Supabase',
    '-- Generated from manual audio file mapping\n',
    '-- First, clear all placeholder/incorrect audio',
    `UPDATE public.verses SET audio_public_url = NULL, audio_storage_path = NULL WHERE audio_public_url LIKE '%1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY%';\n`,
  ];
  
  const yousafzaiMappings = mappings.filter(m => m.translation === 'yousafzai');
  const afghanMappings = mappings.filter(m => m.translation === 'afghan2023');
  
  if (yousafzaiMappings.length > 0) {
    statements.push('-- Update Yousafzai audio IDs');
    for (const m of yousafzaiMappings) {
      const url = `https://drive.google.com/uc?id=${m.file_id}&export=download`;
      statements.push(
        `UPDATE public.verses_yousafzai SET audio_public_url = '${url}', audio_storage_path = 'audio/yousafzai/${m.file_name}' WHERE book = '${m.book}' AND chapter = ${m.chapter} AND verse = ${m.verse};`
      );
    }
    statements.push('');
  }
  
  if (afghanMappings.length > 0) {
    statements.push('-- Update Afghan 2023 audio IDs');
    for (const m of afghanMappings) {
      const url = `https://drive.google.com/uc?id=${m.file_id}&export=download`;
      statements.push(
        `UPDATE public.verses SET audio_public_url = '${url}', audio_storage_path = 'audio/afghan2023/${m.file_name}' WHERE book = '${m.book}' AND chapter = ${m.chapter} AND verse = ${m.verse};`
      );
    }
  }
  
  fs.writeFileSync(sqlFile, statements.join('\n'));
  
  console.log(`✅ Generated SQL: ${sqlFile}`);
  console.log('\n🎉 Next steps:');
  console.log('1. Review the mappings above');
  console.log('2. Copy entire contents of APPLY_AUDIO_IDS.sql');
  console.log('3. Go to Supabase SQL Editor');
  console.log('4. Paste and run the SQL');
  console.log('5. Test audio playback\n');
}

processAudioMappingCSV().catch(console.error);

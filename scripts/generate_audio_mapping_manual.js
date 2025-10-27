#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BOOK_MAPPING = {
  'Genesis': 'Genesis', 'Exodus': 'Exodus', 'Leviticus': 'Leviticus', 'Numbers': 'Numbers',
  'Deuteronomy': 'Deuteronomy', 'Joshua': 'Joshua', 'Judges': 'Judges', 'Ruth': 'Ruth',
  '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel', '1 Kings': '1 Kings', '2 Kings': '2 Kings',
  '1 Chronicles': '1 Chronicles', '2 Chronicles': '2 Chronicles', 'Ezra': 'Ezra', 'Nehemiah': 'Nehemiah',
  'Esther': 'Esther', 'Job': 'Job', 'Psalm': 'Psalms', 'Psalms': 'Psalms', 'Proverbs': 'Proverbs',
  'Ecclesiastes': 'Ecclesiastes', 'Isaiah': 'Isaiah', 'Jeremiah': 'Jeremiah', 'Lamentations': 'Lamentations',
  'Ezekiel': 'Ezekiel', 'Daniel': 'Daniel', 'Hosea': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos',
  'Obadiah': 'Obadiah', 'Jonah': 'Jonah', 'Micah': 'Micah', 'Nahum': 'Nahum', 'Habakkuk': 'Habakkuk',
  'Zephaniah': 'Zephaniah', 'Haggai': 'Haggai', 'Zechariah': 'Zechariah', 'Malachi': 'Malachi',
  'Matthew': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke', 'John': 'John', 'Acts': 'Acts',
  'Romans': 'Romans', '1 Corinthians': '1 Corinthians', '2 Corinthians': '2 Corinthians',
  'Galatians': 'Galatians', 'Ephesians': 'Ephesians', 'Philippians': 'Philippians',
  'Colossians': 'Colossians', '1 Thessalonians': '1 Thessalonians', '2 Thessalonians': '2 Thessalonians',
  '1 Timothy': '1 Timothy', '2 Timothy': '2 Timothy', 'Titus': 'Titus', 'Philemon': 'Philemon',
  'Hebrews': 'Hebrews', 'James': 'James', '1 Peter': '1 Peter', '2 Peter': '2 Peter',
  '1 John': '1 John', '2 John': '2 John', '3 John': '3 John', 'Jude': 'Jude', 'Revelation': 'Revelation'
};

function parseYousafzaiFilename(filename) {
  // Example: yousafzai_genesis001_verse_001.mp3
  const match = filename.match(/yousafzai_([a-z0-9]+)_verse_(\d+)\.mp3/i);
  if (!match) return null;
  
  const bookPart = match[1];
  const verseNum = parseInt(match[2]);
  
  // Parse "genesis001" -> chapter 1, book "Genesis"
  const bookMatch = bookPart.match(/([a-z]+)(\d+)/i);
  if (!bookMatch) return null;
  
  const bookNameRaw = bookMatch[1];
  const chapter = parseInt(bookMatch[2]);
  
  const bookName = Object.keys(BOOK_MAPPING).find(k => k.toLowerCase().replace(/ /g, '') === bookNameRaw.toLowerCase()) 
    || bookNameRaw.charAt(0).toUpperCase() + bookNameRaw.slice(1);
  
  return { bookName, chapter, verse: verseNum };
}

function parseAfghan2023Filename(filename) {
  // Example: afghan_genesis01_01.mp3 or ot_genesis_01_01.mp3
  const match = filename.match(/(?:afghan|ot)_([a-z0-9]+)_(\d+)_(\d+)\.mp3/i);
  if (!match) return null;
  
  const bookPart = match[1];
  const chapter = parseInt(match[2]);
  const verse = parseInt(match[3]);
  
  const bookName = Object.keys(BOOK_MAPPING).find(k => k.toLowerCase().replace(/ /g, '') === bookPart.toLowerCase())
    || bookPart.charAt(0).toUpperCase() + bookPart.slice(1);
  
  return { bookName, chapter, verse };
}

async function processAudioMappingCSV() {
  console.log('📋 Manual Audio File Mapping\n');
  console.log('Instructions:');
  console.log('1. Go to your Google Drive folder');
  console.log('2. For each audio file, right-click → "Get link"');
  console.log('3. Copy the link and extract the FILE_ID');
  console.log('   Link format: https://drive.google.com/file/d/{FILE_ID}/view?usp=drive_link\n');
  
  console.log('4. Create a file named: audio_files.txt in this directory');
  console.log('5. Put one line per file in this format:');
  console.log('   filename.mp3,FILE_ID\n');
  console.log('Example:');
  console.log('   yousafzai_genesis001_verse_001.mp3,1C33n0QfM_Vfboiit6ePXmVbvn05eGcm2');
  console.log('   yousafzai_genesis001_verse_002.mp3,1dGh5_7kL9mN2oPq3rSt4uVw5xYz6aB7\n');
  
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
    if (filename.toLowerCase().startsWith('yousafzai')) {
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
  
  const sqlFile = path.join(__dirname, '..', 'APPLY_AUDIO_IDS.sql');
  const statements = [
    '-- Auto-generated SQL to update audio IDs in Supabase',
    '-- Generated from manual audio file mapping\n',
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
  console.log('\n📊 Summary:');
  console.log(`   - Yousafzai files: ${yousafzaiMappings.length}`);
  console.log(`   - Afghan 2023 files: ${afghanMappings.length}`);
  console.log('\n🎉 Next steps:');
  console.log('1. Review the mappings above');
  console.log('2. Copy entire contents of APPLY_AUDIO_IDS.sql');
  console.log('3. Go to Supabase SQL Editor');
  console.log('4. Paste and run the SQL');
  console.log('5. Test audio playback\n');
}

processAudioMappingCSV().catch(console.error);

#!/usr/bin/env node

/**
 * Fetch Audio File IDs from Google Drive
 * 
 * This script uses the Google Drive API to:
 * 1. List all files in Yousafzai and Afghan 2023 audio folders
 * 2. Extract file names and IDs
 * 3. Map file names to book/chapter/verse
 * 4. Generate CSV for database updates
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');

// Configuration
const YOUSAFZAI_FOLDER_ID = '1m-Mv7r01GHTqXkz2FxAXfANn_7sSHRSUC';
const AFGHAN_FOLDER_ID = '1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC'; // OT Afghan 2023

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

// Parse Yousafzai filename: yousafzai_genesis001_verse_001.mp3
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

// Parse Afghan 2023 filename (supports multiple patterns)
function parseAfghan2023Filename(filename) {
  // Pattern 1: jonah001_verse_014.mp3 (most common)
  let match = filename.match(/(\w+?)(\d{2,3})_verse_(\d{2,3})\.mp3/i);
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
  
  // Pattern 2: afghan_{bookname}_{chapter}_{verse}.mp3
  match = filename.match(/afghan_(\w+?)_(\d{1,3})_(\d{1,3})\.mp3/i);
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
  
  // Pattern 3: {bookname}_{chapter}_{verse}.mp3
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

async function getAllAudioFilesRecursive(drive, folderId) {
  const results = [];
  
  async function traverseFolder(currentFolderId) {
    // Get all files in current folder
    let pageToken = null;
    do {
      const response = await drive.files.list({
        q: `'${currentFolderId}' in parents and trashed = false`,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
        pageSize: 1000,
        pageToken: pageToken
      });
      
      const items = response.data.files || [];
      
      for (const item of items) {
        if (item.mimeType === 'audio/mpeg') {
          results.push(item);
        } else if (item.mimeType === 'application/vnd.google-apps.folder') {
          // Recursively search subfolders
          await traverseFolder(item.id);
        }
      }
      
      pageToken = response.data.nextPageToken;
    } while (pageToken);
  }
  
  await traverseFolder(folderId);
  return results;
}

async function listFilesInFolder(drive, folderId, folderName) {
  console.log(`\n📂 Fetching files from ${folderName}...`);
  
  try {
    const results = await getAllAudioFilesRecursive(drive, folderId);
    console.log(`✅ Found ${results.length} audio files`);
    return results;
  } catch (error) {
    console.error(`❌ Error listing files: ${error.message}`);
    return [];
  }
}

async function authenticateAndFetch() {
  console.log('🔐 Authenticating with Google Drive API...\n');
  
  // For this to work, you need to:
  // 1. Create a Google Cloud project
  // 2. Enable Drive API
  // 3. Create OAuth 2.0 credentials
  // 4. Save credentials to credentials.json
  
  const keyFile = path.join(__dirname, '..', 'credentials.json');
  
  if (!fs.existsSync(keyFile)) {
    console.error('❌ credentials.json not found!');
    console.error('\n📝 To set up Google Drive API access:');
    console.error('   1. Go to: https://console.cloud.google.com/');
    console.error('   2. Create a new project');
    console.error('   3. Enable Google Drive API');
    console.error('   4. Create OAuth 2.0 credentials (Desktop application)');
    console.error('   5. Download as JSON and save as: credentials.json\n');
    process.exit(1);
  }
  
  const credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
  
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  
  // Check for existing token
  const tokenFile = path.join(__dirname, '..', 'drive_token.json');
  let token;
  
  if (fs.existsSync(tokenFile)) {
    token = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
    oauth2Client.setCredentials(token);
  } else {
    // Get new token
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.readonly'],
      redirect_uri: 'http://localhost:8080'
    });
    
    console.log('🔗 Visit this URL to authorize:\n', authUrl, '\n');
    
    const code = await new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Enter the authorization code: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
  }
  
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  // Fetch files from both folders
  const yousafzaiFiles = await listFilesInFolder(drive, YOUSAFZAI_FOLDER_ID, 'Yousafzai 2019');
  const afghanFiles = await listFilesInFolder(drive, AFGHAN_FOLDER_ID, 'Afghan 2023');
  
  // Process and map files
  const mappings = [];
  
  console.log('\n📝 Processing Yousafzai files...');
  for (const file of yousafzaiFiles) {
    const parsed = parseYousafzaiFilename(file.name);
    if (parsed) {
      mappings.push({
        translation: 'yousafzai',
        book: parsed.bookName,
        chapter: parsed.chapter,
        verse: parsed.verse,
        file_id: file.id,
        file_name: file.name,
        web_link: file.webViewLink
      });
    }
  }
  console.log(`✅ Mapped ${mappings.filter(m => m.translation === 'yousafzai').length} Yousafzai files`);
  
  console.log('\n📝 Processing Afghan 2023 files...');
  for (const file of afghanFiles) {
    const parsed = parseAfghan2023Filename(file.name);
    if (parsed) {
      mappings.push({
        translation: 'afghan2023',
        book: parsed.bookName,
        chapter: parsed.chapter,
        verse: parsed.verse,
        file_id: file.id,
        file_name: file.name,
        web_link: file.webViewLink
      });
    }
  }
  console.log(`✅ Mapped ${mappings.filter(m => m.translation === 'afghan2023').length} Afghan 2023 files`);
  
  // Write mappings to CSV
  const csvFile = path.join(__dirname, '..', 'audio_mapping.csv');
  const csvContent = [
    'translation,book,chapter,verse,file_id,file_name',
    ...mappings.map(m => 
      `${m.translation},${m.book},${m.chapter},${m.verse},${m.file_id},"${m.file_name}"`
    )
  ].join('\n');
  
  fs.writeFileSync(csvFile, csvContent);
  console.log(`\n✅ Saved mapping to: ${csvFile}`);
  console.log(`📊 Total mappings: ${mappings.length}`);
  
  // Generate SQL
  const sqlFile = path.join(__dirname, '..', 'APPLY_AUDIO_IDS.sql');
  const sqlStatements = generateSQL(mappings);
  fs.writeFileSync(sqlFile, sqlStatements);
  console.log(`✅ Generated SQL: ${sqlFile}\n`);
  
  console.log('🎉 Next steps:');
  console.log('   1. Review the mappings in audio_mapping.csv');
  console.log('   2. Run the SQL from APPLY_AUDIO_IDS.sql in Supabase');
  console.log('   3. Test audio playback\n');
}

function generateSQL(mappings) {
  const statements = [
    '-- Auto-generated SQL to update audio IDs in Supabase',
    '-- Generated from Google Drive API file extraction\n',
    '-- First, clear all placeholder/incorrect audio',
    `UPDATE public.verses SET audio_public_url = NULL, audio_storage_path = NULL WHERE audio_public_url LIKE '%1_v_gsp-7e90or0oB7fEzUpqKwm2WPDYY%';\n`,
  ];
  
  // Group by translation
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
  }
  
  if (afghanMappings.length > 0) {
    statements.push('\n-- Update Afghan 2023 audio IDs');
    for (const m of afghanMappings) {
      const url = `https://drive.google.com/uc?id=${m.file_id}&export=download`;
      statements.push(
        `UPDATE public.verses SET audio_public_url = '${url}', audio_storage_path = 'audio/afghan2023/${m.file_name}' WHERE book = '${m.book}' AND chapter = ${m.chapter} AND verse = ${m.verse};`
      );
    }
  }
  
  return statements.join('\n');
}

// Run
if (require.main === module) {
  const authCode = process.argv[2];
  if (authCode) {
    // If code provided as argument, use it directly
    const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'credentials.json'), 'utf8'));
    const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    oauth2Client.getToken(authCode, async (err, tokens) => {
      if (err) {
        console.error('❌ Error getting token:', err.message);
        process.exit(1);
      }
      oauth2Client.setCredentials(tokens);
      fs.writeFileSync(path.join(__dirname, '..', 'drive_token.json'), JSON.stringify(tokens, null, 2));
      console.log('✅ Token saved!\n');
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      // Continue with fetching files...
      const yousafzaiFiles = await listFilesInFolder(drive, YOUSAFZAI_FOLDER_ID, 'Yousafzai 2019');
      const afghanFiles = await listFilesInFolder(drive, AFGHAN_FOLDER_ID, 'Afghan 2023');
      
      // Process files...
      const mappings = [];
      
      console.log('\n📝 Processing Yousafzai files...');
      for (const file of yousafzaiFiles) {
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
        }
      }
      console.log(`✅ Mapped ${mappings.filter(m => m.translation === 'yousafzai').length} Yousafzai files`);
      
      console.log('\n📝 Processing Afghan 2023 files...');
      for (const file of afghanFiles) {
        const parsed = parseAfghan2023Filename(file.name);
        if (parsed) {
          mappings.push({
            translation: 'afghan2023',
            book: parsed.bookName,
            chapter: parsed.chapter,
            verse: parsed.verse,
            file_id: file.id,
            file_name: file.name
          });
        }
      }
      console.log(`✅ Mapped ${mappings.filter(m => m.translation === 'afghan2023').length} Afghan 2023 files`);
      
      // Generate output
      const csvFile = path.join(__dirname, '..', 'audio_mapping.csv');
      const csvContent = [
        'translation,book,chapter,verse,file_id,file_name',
        ...mappings.map(m => `${m.translation},${m.book},${m.chapter},${m.verse},${m.file_id},"${m.file_name}"`)
      ].join('\n');
      fs.writeFileSync(csvFile, csvContent);
      console.log(`\n✅ Saved mapping to: ${csvFile}`);
      
      const sqlFile = path.join(__dirname, '..', 'APPLY_AUDIO_IDS.sql');
      const sqlStatements = generateSQL(mappings);
      fs.writeFileSync(sqlFile, sqlStatements);
      console.log(`✅ Generated SQL: ${sqlFile}\n`);
      
      console.log('🎉 Next steps:');
      console.log('   1. Review the mappings in audio_mapping.csv');
      console.log('   2. Run the SQL from APPLY_AUDIO_IDS.sql in Supabase');
      console.log('   3. Test audio playback\n');
    });
  } else {
    authenticateAndFetch().catch(console.error);
  }
}

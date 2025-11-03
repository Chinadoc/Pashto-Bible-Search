/**
 * Extract biblical proper noun names from English Bible translations
 * 
 * For each word flagged as a potential biblical name:
 * 1. Find verses containing that word in Pashto using word_verse_mapping
 * 2. Get the verse references (book, chapter, verse)
 * 3. Look up English translations for those verses using Bible API
 * 4. Extract the English name from the verse context
 * 5. Use that as the romanization/translation
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

// Words to look up
const WORDS_TO_LOOKUP = [
  'اخى', 'اب', 'ايل', 'اِلى', 'اېل', 'عزر', 'لابان',
  'موسی', 'داود', 'یعقوب', 'یوسف', 'هارون', 'سلیمان',
  'یوحنا', 'مریم', 'پترس', 'پولس', 'توماس', 'اندریاس'
];

/**
 * Query D1 for verses containing a Pashto word
 */
async function findVersesWithWord(pashtoWord) {
  try {
    // First, get verse references from word_verse_mapping
    const mappingQuery = `SELECT DISTINCT ref, book, chapter, verse FROM word_verse_mapping WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}' LIMIT 5;`;
    const mappingCmd = `wrangler d1 execute pashto-bible-db --remote --command="${mappingQuery}" --json`;
    
    const mappingOutput = execSync(mappingCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    const mappingResult = JSON.parse(mappingOutput);
    
    if (!mappingResult.results || mappingResult.results.length === 0) {
      return [];
    }
    
    // Now get the actual verse text
    const refs = mappingResult.results.map(r => r.ref);
    const verseQuery = `SELECT ref, book, chapter, verse, text FROM verses_afghan2023 WHERE ref IN (${refs.map(r => `'${r.replace(/'/g, "''")}'`).join(', ')}) LIMIT 5;`;
    const verseCmd = `wrangler d1 execute pashto-bible-db --remote --command="${verseQuery}" --json`;
    
    const verseOutput = execSync(verseCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    const verseResult = JSON.parse(verseOutput);
    
    return verseResult.results || [];
  } catch (error) {
    console.error(`Error querying verses for ${pashtoWord}:`, error.message);
    return [];
  }
}

/**
 * Get English translation for a verse reference using Bible API
 * Uses api.bible or bible-api.com
 */
async function getEnglishVerse(ref) {
  try {
    // Parse ref (e.g., "Genesis 29:1")
    const match = ref.match(/^(\d*\s*[A-Za-z]+)\s+(\d+):(\d+)$/);
    if (!match) return null;
    
    const [, book, chapter, verse] = match;
    
    // Use Bible API (free tier)
    // Format: https://api.bible/v1/bibles/{bibleId}/passages/{passageId}
    // Or use bible-api.com: https://bible-api.com/genesis+29:1
    
    const bibleApiUrl = `https://bible-api.com/${encodeURIComponent(book.toLowerCase())}+${chapter}:${verse}?translation=kjv`;
    
    const fetch = require('node-fetch');
    const response = await fetch(bibleApiUrl);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error(`Error fetching English verse for ${ref}:`, error.message);
    return null;
  }
}

/**
 * Extract name from English verse context
 * Look for capitalized words that might be names
 */
function extractNameFromEnglishVerse(englishText, pashtoWord) {
  if (!englishText) return null;
  
  // Common biblical names to look for
  const commonNames = [
    'Laban', 'El', 'Ab', 'Ahi', 'Ali', 'Azar', 'Moses', 'David', 'Jacob', 
    'Joseph', 'Aaron', 'Solomon', 'John', 'Mary', 'Peter', 'Paul', 'Thomas',
    'Andrew', 'Philip', 'Bartholomew', 'Matthew', 'James', 'Thaddeus', 'Simon',
    'Judas', 'Noah', 'Ishmael', 'Isaac', 'Esau', 'Rachel', 'Leah', 'Benjamin',
    'Joshua', 'Samson', 'Ruth', 'Samuel', 'Saul', 'Jonathan', 'Daniel', 'Job',
    'Ezekiel', 'Isaiah', 'Jeremiah', 'Hosea', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Ezra', 'Nehemiah',
    'Esther'
  ];
  
  // Look for names in the text
  for (const name of commonNames) {
    if (englishText.includes(name)) {
      return name;
    }
  }
  
  // Fallback: look for capitalized words (potential names)
  const words = englishText.split(/\s+/);
  const capitalized = words.filter(w => /^[A-Z][a-z]+$/.test(w.replace(/[.,;:!?]/g, '')));
  
  // Return the first capitalized word that's not a common English word
  const commonWords = ['The', 'And', 'But', 'For', 'With', 'From', 'That', 'This', 'Then', 'When', 'Where', 'Who', 'What', 'Which', 'Why', 'How', 'He', 'She', 'It', 'They', 'We', 'You', 'His', 'Her', 'Its', 'Their', 'Our', 'Your', 'Him', 'Her', 'Them', 'Us'];
  
  for (const word of capitalized) {
    const cleanWord = word.replace(/[.,;:!?]/g, '');
    if (!commonWords.includes(cleanWord) && cleanWord.length > 2) {
      return cleanWord;
    }
  }
  
  return null;
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Finding verses and English translations for biblical names...\n');
  
  const nameMapping = {};
  const verseExamples = {};
  
  // Check if node-fetch is available, otherwise use built-in fetch
  let fetch;
  try {
    fetch = require('node-fetch');
  } catch (e) {
    // Use native fetch if available (Node 18+)
    fetch = global.fetch || require('https').get;
  }
  
  for (const pashtoWord of WORDS_TO_LOOKUP) {
    console.log(`📖 Processing: ${pashtoWord}`);
    
    const verses = await findVersesWithWord(pashtoWord);
    
    if (verses.length === 0) {
      console.log(`   ⚠️  No verses found`);
      continue;
    }
    
    console.log(`   Found ${verses.length} verses`);
    
    // Try to get English translation for first verse
    const firstVerse = verses[0];
    const englishText = await getEnglishVerse(firstVerse.ref);
    
    if (englishText) {
      console.log(`   English verse: ${englishText.substring(0, 100)}...`);
      
      const englishName = extractNameFromEnglishVerse(englishText, pashtoWord);
      
      if (englishName) {
        nameMapping[pashtoWord] = englishName;
        console.log(`   ✅ Extracted name: ${englishName}`);
      } else {
        console.log(`   ⚠️  Could not extract name from English verse`);
      }
    } else {
      console.log(`   ⚠️  Could not fetch English translation`);
    }
    
    // Store examples
    verseExamples[pashtoWord] = {
      pashto_verses: verses.slice(0, 2).map(v => ({
        ref: v.ref,
        text: v.text.substring(0, 150) + '...'
      })),
      english_text: englishText ? englishText.substring(0, 200) + '...' : null
    };
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Found ${Object.keys(nameMapping).length} names\n`);
  
  // Generate SQL
  const updates = [];
  for (const [pashtoWord, englishName] of Object.entries(nameMapping)) {
    updates.push(`-- Biblical name: ${pashtoWord} (${englishName})`);
    updates.push(`UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '${englishName.replace(/'/g, "''")}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}';`);
    updates.push('');
  }
  
  // Write SQL file
  const sqlPath = join(process.cwd(), 'cloudflare/identify-biblical-names-from-verses.sql');
  const sql = [
    '-- Identify biblical proper nouns from verse context',
    '-- Generated by analyzing verses containing these words and matching to English translations',
    '',
    '-- Add word_type column if missing',
    "ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;",
    '',
    '-- Update biblical names',
    ...updates,
    '',
    '-- Create index',
    'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
  ].join('\n');
  
  writeFileSync(sqlPath, sql, 'utf-8');
  
  // Write verse examples to JSON for reference
  const examplesPath = join(process.cwd(), 'cloudflare/biblical-name-verse-examples.json');
  writeFileSync(examplesPath, JSON.stringify(verseExamples, null, 2), 'utf-8');
  
  console.log(`✅ Generated:`);
  console.log(`   - ${sqlPath}`);
  console.log(`   - ${examplesPath}\n`);
  
  console.log('📋 Next steps:');
  console.log('   1. Review the verse examples in biblical-name-verse-examples.json');
  console.log('   2. Verify English names match the Pashto context');
  console.log('   3. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/identify-biblical-names-from-verses.sql\n');
}

main().catch(console.error);

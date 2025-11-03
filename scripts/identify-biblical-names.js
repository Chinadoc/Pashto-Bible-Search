/**
 * Identify and label biblical proper nouns (names) in word_frequencies table
 * 
 * Many words in the frequency list don't have dictionary matches because they
 * are proper nouns (biblical names) that aren't in the general dictionary.
 * 
 * This script:
 * 1. Identifies words with "no_dictionary_match" flag
 * 2. Checks if they match common biblical name patterns
 * 3. Updates word_type to "proper_noun" or "name"
 * 4. Adds romanization for known biblical names
 * 5. Updates pos to "n. prop." (proper noun)
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

// Common biblical names in Pashto transliteration
// Format: Pashto word -> English name
const BIBLICAL_NAMES = {
  // Old Testament names
  'اخى': 'Ahi',
  'اب': 'Ab',
  'ايل': 'El',
  'اِلى': 'Ali',
  'اېل': 'El',
  'عزر': 'Azar',
  'لابان': 'Laban',
  'ابراهیم': 'Abraham',
  'عیسی': 'Jesus',
  'موسی': 'Moses',
  'داود': 'David',
  'یعقوب': 'Jacob',
  'یوسف': 'Joseph',
  'هارون': 'Aaron',
  'سلیمان': 'Solomon',
  'مریم': 'Mary',
  'یوحنا': 'John',
  'پترس': 'Peter',
  'پولس': 'Paul',
  'توماس': 'Thomas',
  'اندریاس': 'Andrew',
  'یعقوب': 'James',
  'فیلیپ': 'Philip',
  'برتولما': 'Bartholomew',
  'متای': 'Matthew',
  'یعقوب': 'James (son of Zebedee)',
  'یعقوب': 'James (son of Alphaeus)',
  'تادی': 'Thaddeus',
  'سیمون': 'Simon',
  'یهودا': 'Judas',
  'نوح': 'Noah',
  'اسماعیل': 'Ishmael',
  'اسحاق': 'Isaac',
  'عیسو': 'Esau',
  'راحیل': 'Rachel',
  'لیا': 'Leah',
  'یوسف': 'Joseph',
  'بنیامین': 'Benjamin',
  'یوشع': 'Joshua',
  'سامسون': 'Samson',
  'روت': 'Ruth',
  'سموئیل': 'Samuel',
  'ساول': 'Saul',
  'یوناتان': 'Jonathan',
  'دانیال': 'Daniel',
  'ایوب': 'Job',
  'حزقیال': 'Ezekiel',
  'اشعیا': 'Isaiah',
  'یرمیا': 'Jeremiah',
  'هوشع': 'Hosea',
  'یونس': 'Jonah',
  'میکا': 'Micah',
  'ناحوم': 'Nahum',
  'حبقوق': 'Habakkuk',
  'صفنیا': 'Zephaniah',
  'حجی': 'Haggai',
  'زکریا': 'Zechariah',
  'ملاخی': 'Malachi',
  'عزرا': 'Ezra',
  'نحمیا': 'Nehemiah',
  'استر': 'Esther',
  'حکمت': 'Wisdom',
  'جامعات': 'Ecclesiastes',
  'غزل': 'Song of Songs',
  'مزامیر': 'Psalms',
  'امثال': 'Proverbs',
  'مزامیر': 'Psalms',
};

/**
 * Check if a word looks like a biblical name
 * Heuristics:
 * - Short words (2-4 characters) that aren't in dictionary
 * - Contains Arabic/Persian characters common in names
 * - Ends in common name endings
 */
function looksLikeBiblicalName(word) {
  // Already in our known list
  if (BIBLICAL_NAMES[word]) return true;
  
  // Very short words (2-3 chars) are often names
  if (word.length <= 3 && word.length >= 2) {
    // Check if it has vowel marks that suggest it's a name
    // Names often don't follow Pashto inflection patterns
    return true;
  }
  
  // Common biblical name patterns
  // Names ending in certain suffixes
  const nameEndings = ['یل', 'ایا', 'یا', 'ول', 'ان', 'ان'];
  for (const ending of nameEndings) {
    if (word.endsWith(ending) && word.length <= 6) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get romanization for biblical name
 */
function getBiblicalNameRomanization(pashtoWord) {
  return BIBLICAL_NAMES[pashtoWord] || null;
}

/**
 * Generate SQL to update word_frequencies for proper nouns
 */
function generateProperNounSQL() {
  const updates = [];
  let nameCount = 0;
  let romanizationAdded = 0;

  console.log('🔍 Identifying biblical proper nouns...\n');

  // Process known biblical names
  for (const [pashtoWord, englishName] of Object.entries(BIBLICAL_NAMES)) {
    const romanization = getBiblicalNameRomanization(pashtoWord);
    
    updates.push(`-- Biblical name: ${pashtoWord} (${englishName})`);
    updates.push(`UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '${romanization.replace(/'/g, "''")}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}';`);
    nameCount++;
    if (romanization) {
      romanizationAdded++;
    }
  }

  console.log(`   Found ${nameCount} known biblical names`);
  console.log(`   Generated ${updates.length / 2} update statements\n`);

  return updates;
}

/**
 * Generate SQL for words with no_dictionary_match flag
 * that might be proper nouns
 */
function generateProperNounIdentificationSQL() {
  const updates = [];
  
  console.log('📝 Generating SQL to identify proper nouns from issue flags...\n');

  // SQL to update words with no_dictionary_match that look like names
  updates.push(`-- Update words with no_dictionary_match flag that are likely proper nouns`);
  updates.push(`-- These are words that don't appear in the dictionary but are likely biblical names`);
  updates.push(`UPDATE word_frequencies`);
  updates.push(`SET word_type = 'proper_noun',`);
  updates.push(`    pos = 'n. prop.',`);
  updates.push(`    has_issues = 0,`);
  updates.push(`    issue_flags = '[]'`);
  updates.push(`WHERE has_issues = 1`);
  updates.push(`  AND issue_flags LIKE '%no_dictionary_match%'`);
  updates.push(`  AND (pashto_word IN (${Object.keys(BIBLICAL_NAMES).map(w => `'${w.replace(/'/g, "''")}'`).join(', ')}));`);
  updates.push('');

  console.log(`   Generated identification SQL\n`);

  return updates;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting biblical proper noun identification script...\n');

  // Generate SQL
  const nameUpdates = generateProperNounSQL();
  const identificationSQL = generateProperNounIdentificationSQL();

  // Combine SQL
  const allSQL = [
    '-- Identify and label biblical proper nouns (names)',
    '-- Many words without dictionary matches are actually biblical names',
    '',
    '-- Add word_type column if missing',
    'ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;',
    '',
    '-- Update known biblical names',
    ...nameUpdates,
    '',
    '-- Update words flagged as no_dictionary_match that are known names',
    ...identificationSQL,
    '',
    '-- Create index for faster lookups',
    'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
  ].join('\n');

  // Write SQL file
  const sqlPath = join(process.cwd(), 'cloudflare/identify-biblical-names.sql');
  writeFileSync(sqlPath, allSQL, 'utf-8');

  console.log(`✅ Generated SQL file:`);
  console.log(`   - ${sqlPath}\n`);

  console.log('📋 Next steps:');
  console.log('   1. Review the SQL file');
  console.log('   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/identify-biblical-names.sql');
  console.log('   3. This will update word_type to "proper_noun" and pos to "n. prop." for biblical names\n');
}

main().catch(console.error);


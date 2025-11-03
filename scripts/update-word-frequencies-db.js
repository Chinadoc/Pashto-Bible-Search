/**
 * Update word_frequencies table in D1 database:
 * 1. Add inflection_pattern column if missing
 * 2. Label inflection pattern types for all patterns
 * 3. Remove punctuation from words
 * 4. Fix romanization (pull from dictionary if missing)
 * 5. Apply inflection rules for correct romanization
 */

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

// Load data files
const frequencyListPath = join(process.cwd(), 'app/data/word_frequency_list.json');
const dictionaryPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');

console.log('🔍 Loading data files...\n');

const frequencyList = JSON.parse(readFileSync(frequencyListPath, 'utf-8'));
const dictRaw = JSON.parse(readFileSync(dictionaryPath, 'utf-8'));
const dictionary = Array.isArray(dictRaw.entries) 
  ? dictRaw.entries 
  : (Array.isArray(dictRaw) ? dictRaw : []);

console.log(`   Loaded ${frequencyList.length} frequency entries`);
console.log(`   Loaded ${dictionary.length} dictionary entries\n`);

// Create dictionary lookup maps
const dictByPashto = new Map();
for (const entry of dictionary) {
  if (entry.p) {
    dictByPashto.set(entry.p, entry);
    // Also index normalized versions (ي vs ی)
    const normalized = entry.p.replace(/ي/g, 'ی');
    if (normalized !== entry.p && !dictByPashto.has(normalized)) {
      dictByPashto.set(normalized, entry);
    }
  }
}

// Create frequency map with pattern info
const frequencyMap = new Map();
for (const entry of frequencyList) {
  frequencyMap.set(entry.pashto, entry);
  // Also index without punctuation
  const withoutPunct = entry.pashto.replace(/[؟،؛.!?.,;:]/g, '').trim();
  if (withoutPunct !== entry.pashto && !frequencyMap.has(withoutPunct)) {
    frequencyMap.set(withoutPunct, entry);
  }
}

/**
 * Remove punctuation from Pashto word
 * Removes: ؟،؛.!?.,;:»«›‹""''()[]{} etc.
 */
function removePunctuation(word) {
  // Remove all punctuation marks including Arabic/Persian punctuation
  return word.replace(/[؟،؛.!?.,;:»«›‹""''()\[\]{}،؛]/g, '').trim();
}

/**
 * Get romanization from dictionary
 */
function getRomanizationFromDict(pashtoWord) {
  const entry = dictByPashto.get(pashtoWord);
  if (entry) {
    return entry.f || entry.g || entry.f_primary || null;
  }
  return null;
}

/**
 * Apply inflection rules to get correct romanization
 * For inflected forms, we need to derive from base form
 */
function getRomanizationForInflected(pashtoWord, baseWord, inflectionLabel, pattern) {
  // Get base form romanization
  const baseEntry = dictByPashto.get(baseWord);
  if (!baseEntry) return null;
  
  const baseRom = baseEntry.f || baseEntry.g || baseEntry.f_primary;
  if (!baseRom) return null;
  
  // For now, return base romanization
  // TODO: Apply specific inflection rules based on pattern and inflection_label
  // This would require implementing the actual inflection transformations
  return baseRom;
}

/**
 * Generate SQL updates for word_frequencies table
 */
function generateUpdateSQL() {
  const updates = [];
  const updatesWithPattern = [];
  let processedCount = 0;
  let romanizationFixedCount = 0;
  let punctuationRemovedCount = 0;
  let patternLabeledCount = 0;

  console.log('📝 Generating SQL updates...\n');

  // First pass: process all entries to remove punctuation (even without patterns)
  for (const entry of frequencyList) {
    const pashtoWord = entry.pashto;
    const cleanedWord = removePunctuation(pashtoWord);
    const hasPunctuation = cleanedWord !== pashtoWord;
    
    if (hasPunctuation) {
      // Always remove punctuation, even if no pattern
      updates.push(`UPDATE word_frequencies SET pashto_word = '${cleanedWord.replace(/'/g, "''")}' WHERE pashto_word = '${pashtoWord.replace(/'/g, "''")}';`);
      punctuationRemovedCount++;
    }
  }

  // Second pass: process entries with patterns
  for (const entry of frequencyList) {
    const pashtoWord = entry.pashto;
    const cleanedWord = removePunctuation(pashtoWord);
    const hasPunctuation = cleanedWord !== pashtoWord;
    const wordToUpdate = hasPunctuation ? cleanedWord : pashtoWord;
    
    // Skip if no pattern info
    if (!entry.pattern) continue;
    
    processedCount++;
    
    // SQL updates for this word
    const sqlUpdates = [];
    
    // 1. Add inflection pattern type
    sqlUpdates.push(`UPDATE word_frequencies SET inflection_pattern = '${entry.pattern}' WHERE pashto_word = '${wordToUpdate.replace(/'/g, "''")}';`);
    patternLabeledCount++;
    
    // 2. Fix romanization if missing
    const needsRomanization = !entry.romanization || entry.romanization === '';
    
    if (needsRomanization) {
      let romanization = null;
      
      // First try direct lookup
      romanization = getRomanizationFromDict(pashtoWord);
      
      // If not found, try cleaned word
      if (!romanization && hasPunctuation) {
        romanization = getRomanizationFromDict(cleanedWord);
      }
      
      // If inflected, try base form
      if (!romanization && entry.base_word) {
        romanization = getRomanizationForInflected(
          cleanedWord,
          entry.base_word,
          entry.inflection_label,
          entry.pattern
        );
        
        // Fallback: try base word directly
        if (!romanization) {
          romanization = getRomanizationFromDict(entry.base_word);
        }
      }
      
      if (romanization) {
        sqlUpdates.push(`UPDATE word_frequencies SET romanization = '${romanization.replace(/'/g, "''")}' WHERE pashto_word = '${wordToUpdate.replace(/'/g, "''")}';`);
        romanizationFixedCount++;
      }
    }
    
    if (sqlUpdates.length > 0) {
      updates.push(...sqlUpdates);
      
      // Separate updates for pattern labeling
      updatesWithPattern.push(`UPDATE word_frequencies SET inflection_pattern = '${entry.pattern}' WHERE pashto_word = '${wordToUpdate.replace(/'/g, "''")}';`);
    }
  }

  // Third pass: fix romanization for words without patterns (after punctuation removal)
  for (const entry of frequencyList) {
    const pashtoWord = entry.pashto;
    const cleanedWord = removePunctuation(pashtoWord);
    const hasPunctuation = cleanedWord !== pashtoWord;
    const wordToUpdate = hasPunctuation ? cleanedWord : pashtoWord;
    
    // Skip if already processed in pattern pass
    if (entry.pattern) continue;
    
    // Only process if needs romanization
    const needsRomanization = !entry.romanization || entry.romanization === '';
    if (!needsRomanization) continue;
    
    // Try to get romanization from dictionary
    let romanization = getRomanizationFromDict(pashtoWord);
    if (!romanization && hasPunctuation) {
      romanization = getRomanizationFromDict(cleanedWord);
    }
    
    if (romanization) {
      updates.push(`UPDATE word_frequencies SET romanization = '${romanization.replace(/'/g, "''")}' WHERE pashto_word = '${wordToUpdate.replace(/'/g, "''")}';`);
      romanizationFixedCount++;
    }
  }

  return { updates, updatesWithPattern };
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting word_frequencies update script...\n');

  // Generate SQL
  const { updates, updatesWithPattern } = generateUpdateSQL();

  // Write SQL files
  const sqlPath = join(process.cwd(), 'cloudflare/update-word-frequencies.sql');
  const patternOnlySqlPath = join(process.cwd(), 'cloudflare/update-word-frequencies-patterns-only.sql');

  // Full update SQL
  const fullSQL = [
    '-- Update word_frequencies table',
    '-- 1. Add inflection_pattern column if missing',
    '-- 2. Label inflection pattern types',
    '-- 3. Remove punctuation from words',
    '-- 4. Fix romanization',
    '',
    '-- Add inflection_pattern column if it doesn\'t exist',
    'ALTER TABLE word_frequencies ADD COLUMN inflection_pattern TEXT;',
    '',
    '-- Update statements',
    ...updates,
    '',
    '-- Create index for faster lookups',
    'CREATE INDEX IF NOT EXISTS idx_word_frequencies_pattern ON word_frequencies (inflection_pattern);',
  ].join('\n');

  // Pattern-only SQL (for quick updates)
  const patternSQL = [
    '-- Update inflection_pattern column only',
    '-- Add column if missing',
    'ALTER TABLE word_frequencies ADD COLUMN inflection_pattern TEXT;',
    '',
    '-- Update pattern labels',
    ...updatesWithPattern,
    '',
    '-- Create index',
    'CREATE INDEX IF NOT EXISTS idx_word_frequencies_pattern ON word_frequencies (inflection_pattern);',
  ].join('\n');

  writeFileSync(sqlPath, fullSQL, 'utf-8');
  writeFileSync(patternOnlySqlPath, patternSQL, 'utf-8');

  console.log(`✅ Generated SQL files:`);
  console.log(`   - ${sqlPath}`);
  console.log(`   - ${patternOnlySqlPath}\n`);

  console.log('📋 Next steps:');
  console.log('   1. Review the SQL files');
  console.log('   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/update-word-frequencies.sql');
  console.log('   OR');
  console.log('   3. Run pattern-only update: wrangler d1 execute pashto-bible-db --remote --file cloudflare/update-word-frequencies-patterns-only.sql\n');
}

main().catch(console.error);


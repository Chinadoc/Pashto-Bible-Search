/**
 * Populate Noun/Adjective Inflection Types
 * 
 * Based on: https://grammar.lingdocs.com/inflection/inflection-intro/
 * 
 * Determines if each noun/adjective is:
 * - plain (base form, no inflection)
 * - 1st inflection (ends with ې, ي, or ه)
 * - 2nd inflection (ends with و, یو, or يو)
 * 
 * Uses word_frequencies table to get all nouns/adjectives,
 * then determines inflection type and populates nouns_lexicon table.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

// Inflection endings based on LingDocs grammar
const FIRST_INFLECTION_ENDINGS = ['ې', 'ي', 'ه'];
const SECOND_INFLECTION_ENDINGS = ['و', 'یو', 'يو'];

interface WordFrequency {
  pashto_word: string;
  frequency_total: number;
  romanization?: string;
  pos?: string;
  word_type: 'noun' | 'adjective';
}

interface NounLexiconEntry {
  pashto_word: string;
  romanized?: string;
  gender: string;
  number: string;
  inflection_type: 'plain' | '1st' | '2nd';
  frequency: number;
}

/**
 * Query D1 for nouns/adjectives from word_frequencies using wrangler
 */
async function getNounsAndAdjectivesFromD1(): Promise<WordFrequency[]> {
  console.log('📖 Querying word_frequencies for nouns and adjectives...');
  
  try {
    // Use wrangler to query D1 directly
    const command = `wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, romanization, pos, word_type FROM word_frequencies WHERE word_type IN ('noun', 'adjective') ORDER BY frequency_total DESC;" --json`;
    const output = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    
    // Parse JSON output from wrangler
    try {
      const parsed = JSON.parse(output);
      const results = parsed[0]?.results || [];
      
      console.log(`   ✅ Found ${results.length} nouns/adjectives`);
      
      return results.map((r: any) => ({
        pashto_word: r.pashto_word,
        frequency_total: r.frequency_total || 0,
        romanization: r.romanization || undefined,
        pos: r.pos || undefined,
        word_type: r.word_type as 'noun' | 'adjective',
      }));
    } catch (parseError) {
      // Try to extract JSON from output if it's wrapped in other text
      const jsonMatch = output.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const results = parsed[0]?.results || [];
        console.log(`   ✅ Found ${results.length} nouns/adjectives`);
        return results.map((r: any) => ({
          pashto_word: r.pashto_word,
          frequency_total: r.frequency_total || 0,
          romanization: r.romanization || undefined,
          pos: r.pos || undefined,
          word_type: r.word_type as 'noun' | 'adjective',
        }));
      }
      throw parseError;
    }
  } catch (error) {
    console.error('Error querying D1:', error);
    console.log('   Trying alternative method...');
    
    // Fallback: write SQL to temp file and execute
    const tempSql = join(process.cwd(), '.temp-query-nouns.sql');
    writeFileSync(tempSql, `SELECT pashto_word, frequency_total, romanization, pos, word_type FROM word_frequencies WHERE word_type IN ('noun', 'adjective') ORDER BY frequency_total DESC LIMIT 10000;`, 'utf-8');
    
    try {
      const command = `wrangler d1 execute pashto-bible-db --remote --file=${tempSql} --json`;
      const output = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      const parsed = JSON.parse(output);
      const results = parsed[0]?.results || [];
      console.log(`   ✅ Found ${results.length} nouns/adjectives`);
      return results.map((r: any) => ({
        pashto_word: r.pashto_word,
        frequency_total: r.frequency_total || 0,
        romanization: r.romanization || undefined,
        pos: r.pos || undefined,
        word_type: r.word_type as 'noun' | 'adjective',
      }));
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Determine inflection type based on word form
 * Returns 'plain', '1st', or '2nd'
 */
function determineInflectionType(word: string): 'plain' | '1st' | '2nd' {
  // Check for 2nd inflection endings first (longer patterns)
  for (const ending of SECOND_INFLECTION_ENDINGS) {
    if (word.endsWith(ending)) {
      return '2nd';
    }
  }
  
  // Check for 1st inflection endings
  for (const ending of FIRST_INFLECTION_ENDINGS) {
    if (word.endsWith(ending)) {
      return '1st';
    }
  }
  
  // Default to plain (base form)
  return 'plain';
}

/**
 * Infer gender from word ending (basic heuristic)
 */
function inferGender(word: string, pos?: string): string {
  // Feminine markers
  if (word.endsWith('ه') || word.endsWith('ې') || word.endsWith('ګه')) {
    return 'f';
  }
  
  // Masculine markers
  if (word.endsWith('ی') || word.endsWith('ي') || word.endsWith('ون')) {
    return 'm';
  }
  
  // Default based on POS if available
  if (pos && pos.toLowerCase().includes('feminine')) {
    return 'f';
  }
  
  // Default to masculine
  return 'm';
}

/**
 * Infer number from word ending (basic heuristic)
 */
function inferNumber(word: string): string {
  // Plural markers
  const pluralMarkers = ['ونه', 'ان', 'ګان', 'ګانې', 'یان', 'یانې', 'ونو', 'انو', 'ګانو'];
  for (const marker of pluralMarkers) {
    if (word.endsWith(marker)) {
      return 'plural';
    }
  }
  
  // Could be plural if ends with و (but might be 2nd inflection)
  if (word.endsWith('و') && !word.endsWith('وو')) {
    // This is ambiguous - could be plural or 2nd inflection
    // We'll default to singular and let the inflection type handle it
  }
  
  return 'singular';
}

/**
 * Get base word form (remove inflection endings)
 */
function getBaseForm(word: string, inflectionType: 'plain' | '1st' | '2nd'): string {
  if (inflectionType === 'plain') {
    return word;
  }
  
  // Try to find and remove inflection endings
  if (inflectionType === '2nd') {
    for (const ending of SECOND_INFLECTION_ENDINGS) {
      if (word.endsWith(ending)) {
        return word.slice(0, -ending.length);
      }
    }
  }
  
  if (inflectionType === '1st') {
    for (const ending of FIRST_INFLECTION_ENDINGS) {
      if (word.endsWith(ending)) {
        return word.slice(0, -ending.length);
      }
    }
  }
  
  return word;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Populating Noun/Adjective Inflection Types\n');
  console.log('Based on: https://grammar.lingdocs.com/inflection/inflection-intro/\n');
  
  // Step 1: Get nouns and adjectives from word_frequencies
  const words = await getNounsAndAdjectivesFromD1();
  console.log(`✅ Found ${words.length} nouns/adjectives in word_frequencies\n`);
  
  if (words.length === 0) {
    console.error('❌ No nouns/adjectives found. Make sure word_frequencies table is populated.');
    return;
  }
  
  // Step 2: Determine inflection types and group by base form
  console.log('🔍 Analyzing inflection types...');
  
  const lexiconEntries = new Map<string, NounLexiconEntry>();
  const inflectionTypeCounts = {
    plain: 0,
    '1st': 0,
    '2nd': 0,
  };
  
  for (const word of words) {
    const inflectionType = determineInflectionType(word.pashto_word);
    inflectionTypeCounts[inflectionType]++;
    
    // Get base form (for grouping)
    const baseForm = getBaseForm(word.pashto_word, inflectionType);
    
    // Use base form as key, but store the most frequent form
    if (!lexiconEntries.has(baseForm)) {
      lexiconEntries.set(baseForm, {
        pashto_word: baseForm, // Store base form
        romanized: word.romanization,
        gender: inferGender(word.pashto_word, word.pos),
        number: inferNumber(word.pashto_word),
        inflection_type: inflectionType,
        frequency: word.frequency_total,
      });
    } else {
      // Update if this form has higher frequency
      const existing = lexiconEntries.get(baseForm)!;
      if (word.frequency_total > existing.frequency) {
        existing.frequency = word.frequency_total;
        existing.inflection_type = inflectionType;
        existing.romanized = word.romanization || existing.romanized;
      }
    }
  }
  
  console.log(`\n📊 Inflection Type Distribution:`);
  console.log(`   Plain (base form): ${inflectionTypeCounts.plain}`);
  console.log(`   1st inflection: ${inflectionTypeCounts['1st']}`);
  console.log(`   2nd inflection: ${inflectionTypeCounts['2nd']}`);
  console.log(`\n   Unique base forms: ${lexiconEntries.size}`);
  
  // Step 3: Generate SQL
  console.log(`\n📝 Generating SQL...`);
  
  const sql: string[] = [];
  sql.push('-- Noun/Adjective Inflection Types');
  sql.push(`-- Generated: ${new Date().toISOString()}`);
  sql.push(`-- Based on: https://grammar.lingdocs.com/inflection/inflection-intro/`);
  sql.push(`-- Total entries: ${lexiconEntries.size}`);
  sql.push('');
  
  // Add inflection_type column if it doesn't exist
  // Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
  // We'll try to add it, and if it fails, that's okay (column already exists)
  sql.push('-- Add inflection_type column if it doesn\'t exist');
  sql.push('-- If this fails, the column already exists - that\'s fine');
  sql.push('-- ALTER TABLE nouns_lexicon ADD COLUMN inflection_type TEXT;');
  sql.push('');
  
  // Generate INSERT OR REPLACE statements
  for (const entry of lexiconEntries.values()) {
    sql.push(`INSERT OR REPLACE INTO nouns_lexicon (`);
    sql.push(`  pashto_word,`);
    sql.push(`  romanized,`);
    sql.push(`  gender,`);
    sql.push(`  number,`);
    sql.push(`  inflection_pattern,`);
    sql.push(`  inflection_type,`);
    sql.push(`  frequency`);
    sql.push(`) VALUES (`);
    sql.push(`  '${entry.pashto_word.replace(/'/g, "''")}',`);
    sql.push(`  ${entry.romanized ? `'${entry.romanized.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  '${entry.gender}',`);
    sql.push(`  '${entry.number}',`);
    // Map inflection_type to inflection_pattern number:
    // plain = 1 (basic pattern)
    // 1st = 1 (basic pattern) 
    // 2nd = 1 (basic pattern, but inflection_type will distinguish)
    const patternNum = 1; // Default to basic pattern
    sql.push(`  ${patternNum},`);
    sql.push(`  '${entry.inflection_type}',`);
    sql.push(`  ${entry.frequency}`);
    sql.push(`);`);
    sql.push('');
  }
  
  const sqlPath = join(process.cwd(), '.temp-noun-inflection-types.sql');
  writeFileSync(sqlPath, sql.join('\n'), 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`   ${lexiconEntries.size} INSERT statements`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
  console.log(`\n💡 Note: This populates inflection types based on word endings.`);
  console.log(`   The inflection_type field may need to be added to nouns_lexicon table.`);
}

main().catch(console.error);


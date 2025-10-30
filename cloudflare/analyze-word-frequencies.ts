/**
 * Analyze and flag problematic word frequency entries
 * 
 * Flags:
 * 1. Words with roman characters (should be Pashto-only)
 * 2. Words that don't match dictionary entries
 * 3. Words without part of speech (pos is null/empty)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

interface WordAnalysis {
  pashto_word: string;
  has_roman_chars: boolean;
  matches_dictionary: boolean;
  has_pos: boolean;
  issues: string[];
  confidence_score?: number;
  pos?: string;
  dictionary_id?: number;
}

// Check if word contains roman characters
function hasRomanCharacters(word: string): boolean {
  // Match any ASCII letters (a-z, A-Z)
  return /[a-zA-Z]/.test(word);
}

// Check if word is valid Pashto (Arabic script range)
function isValidPashto(word: string): boolean {
  // Pashto uses Arabic script Unicode range
  // Allow digits and common punctuation but flag if contains roman letters
  const pashtoRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u0660-\u0669\u06F0-\u06F9\d\.,;:!?()[\]{}'"]+$/;
  return pashtoRegex.test(word);
}

async function loadDictionary(): Promise<Map<string, any>> {
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  
  try {
    const content = await readFile(dictPath, 'utf-8');
    const data = JSON.parse(content);
    const entries = Array.isArray(data) ? data : (data.entries || []);
    
    const dictMap = new Map<string, any>();
    
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (entry.p) {
          dictMap.set(entry.p, entry);
        }
      }
    }
    
    return dictMap;
  } catch (error: any) {
    console.warn(`⚠️  Could not load dictionary: ${error.message}`);
    return new Map();
  }
}

async function getAllWordFrequencies(): Promise<Array<{
  pashto_word: string;
  pos?: string;
  dictionary_id?: number;
  confidence_score?: number;
}>> {
  console.log('📖 Fetching all word frequencies from D1...');
  
  const allWords: Array<{
    pashto_word: string;
    pos?: string;
    dictionary_id?: number;
    confidence_score?: number;
  }> = [];
  
  const pageSize = 5000;
  let offset = 0;
  let hasMore = true;
  
  // Try word_frequencies_enhanced first, fallback to word_frequencies
  let tableName = 'word_frequencies_enhanced';
  let columns = 'pashto_word, pos, dictionary_id, confidence_score';
  
  // Check if enhanced table exists and has columns
  try {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT ${columns} FROM ${tableName} LIMIT 1;" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
  } catch (e) {
    // Fallback to basic table
    tableName = 'word_frequencies';
    columns = 'pashto_word, pos, dictionary_id';
  }
  
  while (hasMore) {
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT ${columns} FROM ${tableName} LIMIT ${pageSize} OFFSET ${offset};" --json`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const output = JSON.parse(stdout);
    const result = Array.isArray(output) ? output[0] : output;
    
    if (result.results && result.results.length > 0) {
      allWords.push(...result.results);
      offset += pageSize;
      process.stdout.write(`\r   Fetched ${allWords.length} words...`);
      
      if (result.results.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Found ${allWords.length} words total`);
  return allWords;
}

function analyzeWords(
  words: Array<{ pashto_word: string; pos?: string; dictionary_id?: number; confidence_score?: number }>,
  dictionary: Map<string, any>
): Map<string, WordAnalysis> {
  const analysis = new Map<string, WordAnalysis>();
  
  console.log('\n🔍 Analyzing words for issues...');
  
  let processed = 0;
  let romanChars = 0;
  let noDictionary = 0;
  let noPOS = 0;
  
  for (const word of words) {
    const issues: string[] = [];
    let hasRoman = false;
    let matchesDict = false;
    let hasPOS = false;
    
    // Check for roman characters
    if (hasRomanCharacters(word.pashto_word)) {
      hasRoman = true;
      issues.push('contains_roman_chars');
      romanChars++;
    }
    
    // Check dictionary match
    if (word.dictionary_id && dictionary.has(word.pashto_word)) {
      matchesDict = true;
    } else if (!word.dictionary_id || word.confidence_score === 0) {
      issues.push('no_dictionary_match');
      noDictionary++;
    } else {
      matchesDict = true; // Has dictionary_id even if not in our map
    }
    
    // Check for part of speech
    if (!word.pos || word.pos.trim() === '' || word.pos === 'Unknown' || word.pos === 'unknown') {
      issues.push('no_part_of_speech');
      noPOS++;
    } else {
      hasPOS = true;
    }
    
    analysis.set(word.pashto_word, {
      pashto_word: word.pashto_word,
      has_roman_chars: hasRoman,
      matches_dictionary: matchesDict,
      has_pos: hasPOS,
      issues,
      confidence_score: word.confidence_score,
      pos: word.pos,
      dictionary_id: word.dictionary_id
    });
    
    processed++;
    if (processed % 1000 === 0) {
      process.stdout.write(`\r   Analyzed ${processed}/${words.length} words...`);
    }
  }
  
  console.log(`\n✅ Analysis complete:`);
  console.log(`   📊 Total words: ${words.length}`);
  console.log(`   ⚠️  With roman chars: ${romanChars}`);
  console.log(`   ⚠️  No dictionary match: ${noDictionary}`);
  console.log(`   ⚠️  No POS: ${noPOS}`);
  
  return analysis;
}

async function updateDatabaseFlags(analysis: Map<string, WordAnalysis>): Promise<void> {
  console.log('\n💾 Updating database with flags...');
  
  // Determine which table to use
  let tableName = 'word_frequencies_enhanced';
  try {
    await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT 1 FROM ${tableName} LIMIT 1;" --json`
    );
  } catch (e) {
    tableName = 'word_frequencies';
  }
  
  console.log(`📋 Using table: ${tableName}`);
  
  // Check if columns exist and add them if not
  // SQLite doesn't support IF NOT EXISTS in ALTER TABLE, so we check first
  try {
    const check = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT has_issues FROM ${tableName} LIMIT 1;" --json`
    );
    console.log('   ✅ Flag columns already exist');
  } catch (e) {
    // Columns don't exist, add them
    console.log('   📝 Adding flag columns...');
    const addFlagsSQL = `
ALTER TABLE ${tableName} ADD COLUMN has_issues INTEGER DEFAULT 0;
ALTER TABLE ${tableName} ADD COLUMN issue_flags TEXT DEFAULT '[]';
CREATE INDEX IF NOT EXISTS idx_word_freq_issues_${tableName.replace(/[^a-z0-9]/g, '_')} ON ${tableName}(has_issues);
`;
    await executeD1Sql(addFlagsSQL);
  }
  
  // Update in batches
  const batchSize = 500;
  const words = Array.from(analysis.entries());
  const batches: Array<Array<[string, WordAnalysis]>> = [];
  
  for (let i = 0; i < words.length; i += batchSize) {
    batches.push(words.slice(i, i + batchSize));
  }
  
  console.log(`📤 Updating ${batches.length} batches...`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const updates = batch.map(([word, analysis]) => {
      const escape = (str: any) => str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`;
      const hasIssues = analysis.issues.length > 0 ? 1 : 0;
      const flagsJson = JSON.stringify(analysis.issues);
      
      return `UPDATE ${tableName} SET has_issues = ${hasIssues}, issue_flags = ${escape(flagsJson)} WHERE pashto_word = ${escape(word)};`;
    });
    
    const sql = updates.join('\n');
    await executeD1Sql(sql);
    
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`\r   Updated batch ${i + 1}/${batches.length}...`);
    }
  }
  
  console.log(`\n✅ Updated ${words.length} words with flags`);
}

async function executeD1Sql(sql: string): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-analyze-${Date.now()}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  ${stderr}`);
    }
  } catch (error: any) {
    console.error(`   ❌ Failed: ${error.message}`);
    throw error;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function generateReport(analysis: Map<string, WordAnalysis>): Promise<void> {
  console.log('\n📋 Generating detailed report...\n');
  
  // Group by issue type
  const romanChars: WordAnalysis[] = [];
  const noDictionary: WordAnalysis[] = [];
  const noPOS: WordAnalysis[] = [];
  const multipleIssues: WordAnalysis[] = [];
  
  for (const word of analysis.values()) {
    if (word.issues.length === 0) continue;
    
    if (word.has_roman_chars) romanChars.push(word);
    if (!word.matches_dictionary) noDictionary.push(word);
    if (!word.has_pos) noPOS.push(word);
    if (word.issues.length > 1) multipleIssues.push(word);
  }
  
  console.log('='.repeat(70));
  console.log('📊 ISSUE BREAKDOWN\n');
  
  console.log(`🔤 Words with roman characters (${romanChars.length}):`);
  const romanSample = romanChars.slice(0, 20);
  for (const word of romanSample) {
    console.log(`   - ${word.pashto_word.padEnd(30)} (pos: ${word.pos || 'N/A'})`);
  }
  if (romanChars.length > 20) {
    console.log(`   ... and ${romanChars.length - 20} more`);
  }
  
  console.log(`\n📚 Words without dictionary match (${noDictionary.length}):`);
  const noDictSample = noDictionary.slice(0, 20);
  for (const word of noDictSample) {
    console.log(`   - ${word.pashto_word.padEnd(30)} (pos: ${word.pos || 'N/A'}, confidence: ${word.confidence_score || 0})`);
  }
  if (noDictionary.length > 20) {
    console.log(`   ... and ${noDictionary.length - 20} more`);
  }
  
  console.log(`\n🏷️  Words without part of speech (${noPOS.length}):`);
  const noPOSSample = noPOS.slice(0, 20);
  for (const word of noPOSSample) {
    console.log(`   - ${word.pashto_word.padEnd(30)} (dict: ${word.dictionary_id ? 'yes' : 'no'})`);
  }
  if (noPOS.length > 20) {
    console.log(`   ... and ${noPOS.length - 20} more`);
  }
  
  console.log(`\n⚠️  Words with multiple issues (${multipleIssues.length}):`);
  const multiSample = multipleIssues.slice(0, 10);
  for (const word of multiSample) {
    console.log(`   - ${word.pashto_word.padEnd(30)} [${word.issues.join(', ')}]`);
  }
  if (multipleIssues.length > 10) {
    console.log(`   ... and ${multipleIssues.length - 10} more`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Analysis complete!');
  console.log(`\n📈 Summary:`);
  console.log(`   Total words analyzed: ${analysis.size}`);
  console.log(`   Clean words (no issues): ${analysis.size - romanChars.length - noDictionary.length - noPOS.length}`);
  console.log(`   Words with issues: ${Array.from(analysis.values()).filter(w => w.issues.length > 0).length}`);
}

async function main() {
  console.log('🚀 Analyzing Word Frequency Entries for Issues\n');
  console.log('='.repeat(70));
  
  try {
    // Load dictionary
    console.log('📚 Loading dictionary...');
    const dictionary = await loadDictionary();
    console.log(`✅ Loaded ${dictionary.size} dictionary entries\n`);
    
    // Get all word frequencies
    const words = await getAllWordFrequencies();
    
    // Analyze
    const analysis = analyzeWords(words, dictionary);
    
    // Update database with flags
    await updateDatabaseFlags(analysis);
    
    // Generate report
    await generateReport(analysis);
    
    // Show sample queries
    console.log('\n📝 Sample queries to investigate issues:');
    console.log('\n1. Words with roman characters:');
    console.log('   SELECT pashto_word, pos, issue_flags FROM word_frequencies WHERE has_issues = 1 AND issue_flags LIKE \'%contains_roman_chars%\' LIMIT 20;');
    
    console.log('\n2. Words without dictionary match:');
    console.log('   SELECT pashto_word, pos, confidence_score FROM word_frequencies WHERE has_issues = 1 AND issue_flags LIKE \'%no_dictionary_match%\' LIMIT 20;');
    
    console.log('\n3. Words without POS:');
    console.log('   SELECT pashto_word, dictionary_id, confidence_score FROM word_frequencies WHERE has_issues = 1 AND issue_flags LIKE \'%no_part_of_speech%\' LIMIT 20;');
    
    console.log('\n4. Words with multiple issues:');
    console.log('   SELECT pashto_word, issue_flags FROM word_frequencies WHERE has_issues = 1 AND json_array_length(issue_flags) > 1 LIMIT 20;');
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


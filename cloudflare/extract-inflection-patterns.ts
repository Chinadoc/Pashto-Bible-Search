/**
 * Extract Inflection Patterns from LingDocs Dictionary Entries
 * 
 * This script:
 * 1. Loads dictionary entries from full_dictionary_enriched.json
 * 2. Uses LingDocs library to determine inflection pattern for each noun/adjective
 * 3. Generates SQL to update nouns_lexicon table with inflection_pattern field
 * 
 * Pattern numbers:
 * 0 = None (noInf)
 * 1 = Basic (Pattern 1)
 * 2 = Unstressed ی (Pattern 2)
 * 3 = Stressed ی (Pattern 3)
 * 4 = Pashtoon (Pattern 4)
 * 5 = Squish (Pattern 5)
 * 6 = Feminine Inanimate ي (Pattern 6)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Try to load LingDocs library
async function loadLingDocsLibrary(): Promise<any> {
  try {
    const libPath = join(process.cwd(), '../pashto-inflector/src/lib/dist/lib/library.cjs');
    const { pathToFileURL } = await import('url');
    const moduleUrl = pathToFileURL(libPath).href;
    const mod = await import(/* webpackIgnore: true */ moduleUrl);
    return mod;
  } catch (error) {
    console.error('Failed to load LingDocs library:', error);
    return null;
  }
}

// Infer pattern from word structure (fallback if LingDocs unavailable)
function inferPatternFromStructure(word: string, gender?: string, pos?: string): number {
  // Pattern 0: No inflection
  if (pos && !pos.includes('noun') && !pos.includes('adj')) {
    return 0;
  }

  // Pattern 4: Pashtoon (ends with ون)
  if (word.endsWith('ون')) {
    return 4;
  }

  // Pattern 3: Stressed ی (typically masculine nouns)
  if (word.endsWith('ی') && gender !== 'f') {
    // Could be Pattern 3, but hard to distinguish from Pattern 2 without stress marks
    // Default to Pattern 2 for safety
    return 2;
  }

  // Pattern 2: Unstressed ی
  if (word.endsWith('ی') || word.endsWith('ي')) {
    return 2;
  }

  // Pattern 6: Feminine inanimate ending in ي
  if (word.endsWith('ي') && gender === 'f') {
    return 6;
  }

  // Pattern 1: Basic (default for most nouns/adjectives)
  return 1;
}

async function main() {
  console.log('🚀 Extracting Inflection Patterns from Dictionary\n');

  // Load dictionary
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  if (!require('fs').existsSync(dictPath)) {
    console.error(`❌ Dictionary file not found at ${dictPath}`);
    return;
  }

  const dictData = JSON.parse(readFileSync(dictPath, 'utf-8'));
  const entries = dictData.entries || (Array.isArray(dictData) ? dictData : []);

  console.log(`📖 Loaded ${entries.length} dictionary entries`);

  // Load LingDocs library
  const LingDocs = await loadLingDocsLibrary();
  const getInflectionPattern = LingDocs?.getInflectionPattern;

  if (!getInflectionPattern) {
    console.warn('⚠️  LingDocs library not available, using fallback inference');
  }

  // Filter for nouns and adjectives
  const nounsAndAdjs = entries.filter((entry: any) => {
    const pos = entry.pos_family || entry.c || '';
    const posLower = pos.toLowerCase();
    return (
      posLower.includes('noun') ||
      posLower.includes('adj') ||
      posLower.includes('n.') ||
      posLower.startsWith('adj')
    );
  });

  console.log(`\n🔍 Found ${nounsAndAdjs.length} nouns/adjectives`);

  // Extract patterns
  const patternMap = new Map<string, number>();
  let lingdocsCount = 0;
  let fallbackCount = 0;

  for (const entry of nounsAndAdjs) {
    const word = entry.p;
    if (!word) continue;

    let pattern = 0;

    if (getInflectionPattern) {
      try {
        // Try to use LingDocs function
        // Need to check if entry is inflectable
        const isInflectable = entry.c && (
          entry.c.includes('n.') ||
          entry.c.includes('adj') ||
          entry.pos_family === 'noun' ||
          entry.pos_family === 'adjective'
        );

        if (isInflectable && !entry.noInf) {
          // Create a proper entry object for LingDocs
          const lingdocsEntry = {
            ts: entry.ts,
            p: entry.p,
            f: entry.f,
            g: entry.g,
            c: entry.c || entry.c_norm,
            gender: entry.gender,
            noInf: entry.noInf || false,
            infap: entry.infap,
            infaf: entry.infaf,
            infbp: entry.infbp,
            infbf: entry.infbf,
          };

          try {
            pattern = getInflectionPattern(lingdocsEntry);
            lingdocsCount++;
          } catch (error) {
            // Fallback to inference
            pattern = inferPatternFromStructure(word, entry.gender, entry.c);
            fallbackCount++;
          }
        } else {
          pattern = 0; // No inflection
        }
      } catch (error) {
        pattern = inferPatternFromStructure(word, entry.gender, entry.c);
        fallbackCount++;
      }
    } else {
      pattern = inferPatternFromStructure(word, entry.gender, entry.c);
      fallbackCount++;
    }

    patternMap.set(word, pattern);
  }

  console.log(`\n📊 Pattern Extraction:`);
  console.log(`   LingDocs: ${lingdocsCount}`);
  console.log(`   Fallback: ${fallbackCount}`);
  console.log(`   Total: ${patternMap.size}`);

  // Count patterns
  const patternCounts = new Map<number, number>();
  for (const pattern of patternMap.values()) {
    patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
  }

  console.log(`\n📈 Pattern Distribution:`);
  const patternNames: Record<number, string> = {
    0: 'None (noInf)',
    1: 'Basic (Pattern 1)',
    2: 'Unstressed ی (Pattern 2)',
    3: 'Stressed ی (Pattern 3)',
    4: 'Pashtoon (Pattern 4)',
    5: 'Squish (Pattern 5)',
    6: 'Feminine Inanimate ي (Pattern 6)',
  };

  for (const [patternNum, count] of Array.from(patternCounts.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`   Pattern ${patternNum} (${patternNames[patternNum]}): ${count}`);
  }

  // Generate SQL to update nouns_lexicon table
  console.log(`\n📝 Generating SQL...`);

  const sql: string[] = [];
  sql.push('-- Update inflection_pattern for nouns and adjectives');
  sql.push('-- Patterns: 0=None, 1=Basic, 2=Unstressed ی, 3=Stressed ی, 4=Pashtoon, 5=Squish, 6=Feminine Inanimate ي');
  sql.push('');

  // First, add inflection_pattern column if it doesn't exist
  sql.push('-- Add inflection_pattern column if not exists');
  sql.push('ALTER TABLE nouns_lexicon ADD COLUMN inflection_pattern INTEGER DEFAULT 1;');
  sql.push('');

  // Generate UPDATE statements
  for (const [word, pattern] of patternMap.entries()) {
    sql.push(`UPDATE nouns_lexicon SET inflection_pattern = ${pattern} WHERE pashto_word = '${word.replace(/'/g, "''")}';`);
  }

  const sqlContent = sql.join('\n');
  const sqlPath = join(process.cwd(), '.temp-inflection-patterns.sql');
  writeFileSync(sqlPath, sqlContent, 'utf-8');

  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`\n📊 SQL File Statistics:`);
  console.log(`   Total UPDATE statements: ${patternMap.size}`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main().catch(console.error);



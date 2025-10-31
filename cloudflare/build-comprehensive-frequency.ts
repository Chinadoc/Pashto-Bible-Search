/**
 * Build Comprehensive Word Frequency List
 * 
 * Integrates:
 * 1. Word frequency data
 * 2. Word-to-verse mappings
 * 3. Verb dictionary entries (with stems)
 * 4. Dictionary entries (romanization, POS, etc.)
 * 
 * Output: Enhanced word frequency list with all integrated data
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface WordFrequencyEntry {
  pashto: string;
  frequency: number;
  romanization?: string;
  pos?: string;
  verse_refs?: string[];
  root?: string | string[] | null;
  normalized_word?: string;
  // Verb-specific fields
  verb_stems?: {
    imperfective?: { p?: string; f?: string };
    perfective?: { p?: string; f?: string };
  };
  verb_roots?: {
    imperfective?: { p?: string; f?: string };
    perfective?: { p?: string; f?: string };
  };
  past_participle?: string;
  is_verb?: boolean;
  is_irregular_verb?: boolean;
  conjugation_pattern?: string;
}

interface WordIndexEntry {
  original_word: string;
  normalized_word: string;
  root: string | string[] | null;
  ref: string;
}

interface DictionaryEntry {
  p: string;
  f?: string;
  g?: string;
  e?: string;
  c?: string;
  pos_family?: string;
  psp?: string;
  psf?: string;
  ssp?: string;
  ssf?: string;
  prp?: string;
  prf?: string;
  pprtp?: string;
  pprtf?: string;
}

/**
 * Load word frequency list
 */
function loadFrequencyList(): Map<string, WordFrequencyEntry> {
  const freqMap = new Map<string, WordFrequencyEntry>();
  
  try {
    const freqPath = join(process.cwd(), 'app/data/word_frequency_list.json');
    const freqData = JSON.parse(readFileSync(freqPath, 'utf-8'));
    
    for (const entry of freqData) {
      if (entry.pashto) {
        freqMap.set(entry.pashto, {
          pashto: entry.pashto,
          frequency: entry.frequency || 0,
          romanization: entry.romanization,
          pos: entry.pos,
        });
      }
    }
    
    console.log(`✅ Loaded ${freqMap.size} words from frequency list`);
  } catch (error) {
    console.warn('⚠️  Could not load frequency list:', error);
  }
  
  return freqMap;
}

/**
 * Load word index and group by word
 */
function loadWordIndex(): Map<string, { verse_refs: Set<string>; roots: Set<string>; normalized_words: Set<string> }> {
  const indexMap = new Map<string, { verse_refs: Set<string>; roots: Set<string>; normalized_words: Set<string> }>();
  
  try {
    const indexPath = join(process.cwd(), 'word_index.json');
    const indexData: WordIndexEntry[] = JSON.parse(readFileSync(indexPath, 'utf-8'));
    
    for (const entry of indexData) {
      const word = entry.original_word;
      if (!word) continue;
      
      if (!indexMap.has(word)) {
        indexMap.set(word, {
          verse_refs: new Set(),
          roots: new Set(),
          normalized_words: new Set(),
        });
      }
      
      const data = indexMap.get(word)!;
      data.verse_refs.add(entry.ref);
      data.normalized_words.add(entry.normalized_word);
      
      if (entry.root) {
        if (Array.isArray(entry.root)) {
          entry.root.forEach(r => data.roots.add(r));
        } else {
          data.roots.add(entry.root);
        }
      }
    }
    
    console.log(`✅ Loaded ${indexMap.size} words from word index`);
  } catch (error) {
    console.warn('⚠️  Could not load word index:', error);
  }
  
  return indexMap;
}

/**
 * Load verb dictionary entries
 */
function loadVerbDictionary(): Map<string, DictionaryEntry> {
  const verbMap = new Map<string, DictionaryEntry>();
  
  try {
    const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
    const dictData = JSON.parse(readFileSync(dictPath, 'utf-8'));
    const entries: DictionaryEntry[] = dictData.entries || (Array.isArray(dictData) ? dictData : []);
    
    // Filter for verbs
    const verbEntries = entries.filter((entry: DictionaryEntry) => 
      entry.pos_family === 'verb' || 
      entry.c === 'verb' || 
      entry.c?.includes('verb') ||
      entry.c?.startsWith('v.')
    );
    
    for (const entry of verbEntries) {
      if (entry.p) {
        verbMap.set(entry.p, entry);
      }
    }
    
    console.log(`✅ Loaded ${verbMap.size} verbs from dictionary`);
  } catch (error) {
    console.warn('⚠️  Could not load verb dictionary:', error);
  }
  
  return verbMap;
}

/**
 * Load full dictionary for romanization and POS
 */
function loadFullDictionary(): Map<string, DictionaryEntry> {
  const dictMap = new Map<string, DictionaryEntry>();
  
  try {
    const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
    const dictData = JSON.parse(readFileSync(dictPath, 'utf-8'));
    const entries: DictionaryEntry[] = dictData.entries || (Array.isArray(dictData) ? dictData : []);
    
    for (const entry of entries) {
      if (entry.p) {
        // Use first entry if multiple exist (or merge?)
        if (!dictMap.has(entry.p)) {
          dictMap.set(entry.p, entry);
        }
      }
    }
    
    console.log(`✅ Loaded ${dictMap.size} entries from full dictionary`);
  } catch (error) {
    console.warn('⚠️  Could not load full dictionary:', error);
  }
  
  return dictMap;
}

/**
 * Merge all data sources into comprehensive frequency list
 */
function mergeData(
  freqMap: Map<string, WordFrequencyEntry>,
  indexMap: Map<string, { verse_refs: Set<string>; roots: Set<string>; normalized_words: Set<string> }>,
  verbMap: Map<string, DictionaryEntry>,
  fullDictMap: Map<string, DictionaryEntry>
): WordFrequencyEntry[] {
  const merged = new Map<string, WordFrequencyEntry>();
  
  // Start with frequency data
  for (const [word, entry] of freqMap.entries()) {
    merged.set(word, { ...entry });
  }
  
  // Add verse references from word index
  for (const [word, indexData] of indexMap.entries()) {
    const entry = merged.get(word) || {
      pashto: word,
      frequency: 0,
    };
    
    entry.verse_refs = Array.from(indexData.verse_refs).sort();
    entry.root = indexData.roots.size === 1 
      ? Array.from(indexData.roots)[0]
      : Array.from(indexData.roots);
    entry.normalized_word = Array.from(indexData.normalized_words)[0] || word;
    
    // Update frequency if verse count is higher
    if (entry.verse_refs.length > entry.frequency) {
      entry.frequency = entry.verse_refs.length;
    }
    
    merged.set(word, entry);
  }
  
  // Add verb dictionary data
  for (const [word, verbEntry] of verbMap.entries()) {
    const entry = merged.get(word) || {
      pashto: word,
      frequency: 0,
    };
    
    entry.is_verb = true;
    entry.pos = entry.pos || 'verb';
    
    // Add verb stems
    if (verbEntry.psp || verbEntry.psf || verbEntry.ssp || verbEntry.ssf) {
      entry.verb_stems = {};
      if (verbEntry.psp || verbEntry.psf) {
        entry.verb_stems.imperfective = {
          p: verbEntry.psp,
          f: verbEntry.psf,
        };
      }
      if (verbEntry.ssp || verbEntry.ssf) {
        entry.verb_stems.perfective = {
          p: verbEntry.ssp,
          f: verbEntry.ssf,
        };
      }
    }
    
    // Add verb roots
    if (verbEntry.prp || verbEntry.prf) {
      entry.verb_roots = {
        imperfective: {
          p: verbEntry.p,
          f: verbEntry.f,
        },
        perfective: {
          p: verbEntry.prp,
          f: verbEntry.prf,
        },
      };
    }
    
    // Add past participle
    if (verbEntry.pprtp) {
      entry.past_participle = verbEntry.pprtp;
    }
    
    // Determine if irregular
    if (verbEntry.psp || verbEntry.ssp || verbEntry.prp || verbEntry.noOo || verbEntry.sepOo) {
      entry.is_irregular_verb = true;
      
      // Determine conjugation pattern
      if (verbEntry.ssp && verbEntry.ssp !== verbEntry.psp) {
        entry.conjugation_pattern = 'stem_variation';
      } else if (verbEntry.prp && verbEntry.prp !== verbEntry.p) {
        entry.conjugation_pattern = 'root_variation';
      } else if (verbEntry.noOo) {
        entry.conjugation_pattern = 'no_oo_prefix';
      } else if (verbEntry.sepOo) {
        entry.conjugation_pattern = 'separated_oo_prefix';
      } else {
        entry.conjugation_pattern = 'regular';
      }
    }
    
    // Update romanization from verb entry if not present
    if (!entry.romanization && verbEntry.f) {
      entry.romanization = verbEntry.f;
    }
    
    merged.set(word, entry);
  }
  
  // Add dictionary data (romanization, POS) for words not yet enriched
  for (const [word, dictEntry] of fullDictMap.entries()) {
    const entry = merged.get(word);
    if (!entry) {
      // Add dictionary-only words with low frequency
      merged.set(word, {
        pashto: word,
        frequency: 0,
        romanization: dictEntry.f || dictEntry.g,
        pos: dictEntry.pos_family || dictEntry.c,
      });
    } else {
      // Enhance existing entry
      if (!entry.romanization && dictEntry.f) {
        entry.romanization = dictEntry.f;
      }
      if (!entry.pos && (dictEntry.pos_family || dictEntry.c)) {
        entry.pos = dictEntry.pos_family || dictEntry.c;
      }
    }
  }
  
  return Array.from(merged.values()).sort((a, b) => b.frequency - a.frequency);
}

/**
 * Generate SQL for D1 word_frequencies and form_occurrences tables
 */
function generateSQL(entries: WordFrequencyEntry[]): string {
  const sql: string[] = [];
  
  sql.push('-- Comprehensive Word Frequency List');
  sql.push('-- Includes frequency, verse references, verb stems, and dictionary data');
  sql.push('');
  sql.push('BEGIN TRANSACTION;');
  sql.push('');
  
  // Insert into word_frequencies
  sql.push('-- ========================================');
  sql.push('-- WORD FREQUENCIES');
  sql.push('-- ========================================');
  sql.push('');
  
  let rank = 1;
  for (const entry of entries) {
    // Determine word_type from POS
    let wordType = null;
    if (entry.is_verb) {
      wordType = 'verb';
    } else if (entry.pos) {
      if (entry.pos.includes('noun') || entry.pos.includes('n.')) {
        wordType = 'noun';
      } else if (entry.pos.includes('adj')) {
        wordType = 'adjective';
      }
    }
    
    sql.push(`INSERT OR REPLACE INTO word_frequencies (`);
    sql.push(`  pashto_word,`);
    sql.push(`  frequency_total,`);
    sql.push(`  frequency_rank,`);
    sql.push(`  romanization,`);
    sql.push(`  pos,`);
    sql.push(`  verse_count,`);
    sql.push(`  word_type`);
    sql.push(`) VALUES (`);
    sql.push(`  '${entry.pashto.replace(/'/g, "''")}',`);
    sql.push(`  ${entry.frequency || 0},`);
    sql.push(`  ${rank++},`);
    sql.push(`  ${entry.romanization ? `'${entry.romanization.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${entry.pos ? `'${entry.pos.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${entry.verse_refs ? entry.verse_refs.length : 0},`);
    sql.push(`  ${wordType ? `'${wordType}'` : 'NULL'}`);
    sql.push(`);`);
    sql.push('');
  }
  
  // Insert verse references into form_occurrences
  sql.push('-- ========================================');
  sql.push('-- FORM OCCURRENCES (Verse References)');
  sql.push('-- ========================================');
  sql.push('');
  
  for (const entry of entries) {
    if (entry.verse_refs && entry.verse_refs.length > 0) {
      const verseRefsJson = JSON.stringify(entry.verse_refs).replace(/'/g, "''");
      sql.push(`INSERT OR REPLACE INTO form_occurrences (`);
      sql.push(`  pashto_form,`);
      sql.push(`  verse_refs,`);
      sql.push(`  frequency`);
      sql.push(`) VALUES (`);
      sql.push(`  '${entry.pashto.replace(/'/g, "''")}',`);
      sql.push(`  '${verseRefsJson}',`);
      sql.push(`  ${entry.frequency || 0}`);
      sql.push(`);`);
      sql.push('');
    }
  }
  
  sql.push('COMMIT;');
  
  return sql.join('\n');
}

async function main() {
  console.log('🚀 Building Comprehensive Word Frequency List\n');
  
  // Load all data sources
  const freqMap = loadFrequencyList();
  const indexMap = loadWordIndex();
  const verbMap = loadVerbDictionary();
  const fullDictMap = loadFullDictionary();
  
  // Merge data
  console.log('\n📊 Merging data sources...');
  const merged = mergeData(freqMap, indexMap, verbMap, fullDictMap);
  
  console.log(`\n✅ Merged ${merged.length} words`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Total words: ${merged.length}`);
  console.log(`   Words with verse refs: ${merged.filter(e => e.verse_refs && e.verse_refs.length > 0).length}`);
  console.log(`   Verbs: ${merged.filter(e => e.is_verb).length}`);
  console.log(`   Irregular verbs: ${merged.filter(e => e.is_irregular_verb).length}`);
  console.log(`   Words with stems: ${merged.filter(e => e.verb_stems).length}`);
  
  // Save enriched JSON
  const enrichedPath = join(process.cwd(), 'app/data/word_frequency_list_comprehensive.json');
  const enrichedData: Record<string, any> = {};
  for (const entry of merged) {
    enrichedData[entry.pashto] = {
      frequency: entry.frequency,
      romanization: entry.romanization,
      pos: entry.pos,
      verse_refs: entry.verse_refs,
      root: entry.root,
      normalized_word: entry.normalized_word,
      verb_stems: entry.verb_stems,
      verb_roots: entry.verb_roots,
      past_participle: entry.past_participle,
      is_verb: entry.is_verb,
      is_irregular_verb: entry.is_irregular_verb,
      conjugation_pattern: entry.conjugation_pattern,
    };
  }
  writeFileSync(enrichedPath, JSON.stringify(enrichedData, null, 2), 'utf-8');
  console.log(`\n✅ Saved enriched data to: ${enrichedPath}`);
  
  // Generate SQL
  console.log('\n📝 Generating SQL...');
  const sql = generateSQL(merged);
  const sqlPath = join(process.cwd(), '.temp-word-frequencies-comprehensive.sql');
  writeFileSync(sqlPath, sql, 'utf-8');
  console.log(`✅ SQL file created: ${sqlPath}`);
  
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main().catch(console.error);


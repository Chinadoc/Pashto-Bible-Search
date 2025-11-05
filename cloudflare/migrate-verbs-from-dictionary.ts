/**
 * Migrate Verb Dictionary Entries from LingDocs Dictionary to D1
 * 
 * This script:
 * 1. Loads verbs from full_dictionary_enriched.json
 * 2. Extracts stem data (psp, ssp, prp, psf, ssf, prf)
 * 3. Maps to D1 verbs_lexicon and irregular_verbs tables
 * 4. Generates SQL for batch insertion
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface DictionaryEntry {
  ts?: number;
  p: string; // Pashto word
  f?: string; // Phonetics
  g?: string; // Simplified phonetics
  e?: string; // English
  c?: string; // Part of speech
  pos_family?: string;
  // Verb-specific fields
  psp?: string; // Imperfective (present) stem Pashto
  psf?: string; // Imperfective stem Phonetics
  ssp?: string; // Perfective (subjunctive) stem Pashto
  ssf?: string; // Perfective stem Phonetics
  prp?: string; // Perfective root Pashto
  prf?: string; // Perfective root Phonetics
  pprtp?: string; // Past participle Pashto
  pprtf?: string; // Past participle Phonetics
  tppp?: string; // 3rd person singular masc short past Pashto
  tppf?: string; // 3rd person singular masc short past Phonetics
  noOo?: boolean; // Does not take و prefix
  sepOo?: boolean; // Takes separate و prefix
  shortIntrans?: boolean;
  ec?: string; // English conjugation
  ep?: string; // English particle
}

interface VerbLexiconEntry {
  verb_root: string;
  stems: {
    imperfective?: { p?: string; f?: string };
    perfective?: { p?: string; f?: string };
  };
  roots: {
    imperfective?: { p?: string; f?: string };
    perfective?: { p?: string; f?: string };
  };
  past_participle?: string;
  romanization?: { p?: string; f?: string };
  conjugation_pattern: string;
  examples?: any[];
  notes?: string;
}

/**
 * Determine if a verb is irregular based on dictionary entry
 */
function isIrregularVerb(entry: DictionaryEntry): boolean {
  // Verbs with explicit stems are usually irregular
  if (entry.psp || entry.ssp || entry.prp) {
    return true;
  }
  
  // Verbs with special flags
  if (entry.noOo || entry.sepOo || entry.shortIntrans) {
    return true;
  }
  
  // Verbs with third person singular special form
  if (entry.tppp || entry.tppf) {
    return true;
  }
  
  // Check if English conjugation suggests irregularity
  if (entry.ec && entry.ec.includes(',')) {
    const parts = entry.ec.split(',');
    if (parts.length >= 5) {
      // Has full conjugation form (see,sees,seeing,saw,seen) suggests irregular
      return true;
    }
  }
  
  return false;
}

/**
 * Convert dictionary entry to D1 verb lexicon entry
 */
function convertToVerbLexicon(entry: DictionaryEntry): VerbLexiconEntry | null {
  if (!entry.p) return null;
  
  const verbRoot = entry.p;
  
  // Build stems object
  const stems: VerbLexiconEntry['stems'] = {};
  if (entry.psp || entry.psf) {
    stems.imperfective = {
      p: entry.psp,
      f: entry.psf,
    };
  }
  if (entry.ssp || entry.ssf) {
    stems.perfective = {
      p: entry.ssp,
      f: entry.ssf,
    };
  }
  
  // Build roots object
  const roots: VerbLexiconEntry['roots'] = {};
  if (entry.p) {
    roots.imperfective = {
      p: entry.p, // Infinitive is imperfective root
      f: entry.f,
    };
  }
  if (entry.prp || entry.prf) {
    roots.perfective = {
      p: entry.prp,
      f: entry.prf,
    };
  }
  
  // Determine conjugation pattern
  let conjugationPattern = 'regular';
  if (entry.ssp && entry.ssp !== entry.psp) {
    conjugationPattern = 'stem_variation';
  }
  if (entry.prp && entry.prp !== entry.p) {
    conjugationPattern = 'root_variation';
  }
  if (entry.noOo) {
    conjugationPattern = 'no_oo_prefix';
  }
  if (entry.sepOo) {
    conjugationPattern = 'separated_oo_prefix';
  }
  
  // Build romanization
  const romanization: { p?: string; f?: string } = {};
  if (entry.p) romanization.p = entry.p;
  if (entry.f) romanization.f = entry.f;
  
  // Build examples array
  const examples: any[] = [];
  if (entry.e) {
    examples.push({
      pashto: entry.p,
      english: entry.e,
      romanization: entry.f,
    });
  }
  
  // Build notes
  const notes: string[] = [];
  if (entry.ec) notes.push(`English: ${entry.ec}`);
  if (entry.ep) notes.push(`Particle: ${entry.ep}`);
  if (entry.shortIntrans) notes.push('Has short intransitive form');
  
  return {
    verb_root: verbRoot,
    stems: Object.keys(stems).length > 0 ? stems : undefined,
    roots: Object.keys(roots).length > 0 ? roots : undefined,
    past_participle: entry.pprtp || undefined,
    romanization: Object.keys(romanization).length > 0 ? romanization : undefined,
    conjugation_pattern: conjugationPattern,
    examples: examples.length > 0 ? examples : undefined,
    notes: notes.length > 0 ? notes.join('; ') : undefined,
  };
}

/**
 * Generate SQL for inserting verbs into D1
 */
function generateSQL(
  regularVerbs: VerbLexiconEntry[],
  irregularVerbs: VerbLexiconEntry[]
): string {
  const sql: string[] = [];
  
  sql.push('-- Verb Dictionary Migration from LingDocs');
  sql.push('-- Generated from full_dictionary_enriched.json');
  sql.push('');
  sql.push('BEGIN TRANSACTION;');
  sql.push('');
  
  // Insert regular verbs into verbs_lexicon
  sql.push('-- ========================================');
  sql.push('-- REGULAR VERBS (verbs_lexicon)');
  sql.push('-- ========================================');
  sql.push('');
  
  for (const verb of regularVerbs) {
    sql.push(`INSERT OR REPLACE INTO verbs_lexicon (`);
    sql.push(`  verb_root,`);
    sql.push(`  stems,`);
    sql.push(`  roots,`);
    sql.push(`  past_participle,`);
    sql.push(`  romanization,`);
    sql.push(`  conjugation_pattern,`);
    sql.push(`  examples,`);
    sql.push(`  notes`);
    sql.push(`) VALUES (`);
    sql.push(`  '${verb.verb_root.replace(/'/g, "''")}',`);
    sql.push(`  ${verb.stems ? `'${JSON.stringify(verb.stems).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.roots ? `'${JSON.stringify(verb.roots).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.past_participle ? `'${verb.past_participle.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.romanization ? `'${JSON.stringify(verb.romanization).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  '${verb.conjugation_pattern.replace(/'/g, "''")}',`);
    sql.push(`  ${verb.examples ? `'${JSON.stringify(verb.examples).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.notes ? `'${verb.notes.replace(/'/g, "''")}'` : 'NULL'}`);
    sql.push(`);`);
    sql.push('');
  }
  
  // Insert irregular verbs into irregular_verbs
  sql.push('-- ========================================');
  sql.push('-- IRREGULAR VERBS (irregular_verbs)');
  sql.push('-- ========================================');
  sql.push('');
  
  for (const verb of irregularVerbs) {
    // Determine irregularity type
    let irregularityType = 'unknown';
    if (verb.stems?.imperfective && verb.stems.perfective) {
      irregularityType = 'stem_variation';
    } else if (verb.roots?.perfective) {
      irregularityType = 'root_variation';
    } else if (verb.conjugation_pattern === 'no_oo_prefix') {
      irregularityType = 'prefix_exception';
    } else if (verb.conjugation_pattern === 'separated_oo_prefix') {
      irregularityType = 'separated_prefix';
    }
    
    sql.push(`INSERT OR REPLACE INTO irregular_verbs (`);
    sql.push(`  verb_root,`);
    sql.push(`  stems,`);
    sql.push(`  roots,`);
    sql.push(`  past_participle,`);
    sql.push(`  romanization,`);
    sql.push(`  irregularity_type,`);
    sql.push(`  conjugation_pattern,`);
    sql.push(`  examples,`);
    sql.push(`  notes`);
    sql.push(`) VALUES (`);
    sql.push(`  '${verb.verb_root.replace(/'/g, "''")}',`);
    sql.push(`  ${verb.stems ? `'${JSON.stringify(verb.stems).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.roots ? `'${JSON.stringify(verb.roots).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.past_participle ? `'${verb.past_participle.replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.romanization ? `'${JSON.stringify(verb.romanization).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  '${irregularityType.replace(/'/g, "''")}',`);
    sql.push(`  '${verb.conjugation_pattern.replace(/'/g, "''")}',`);
    sql.push(`  ${verb.examples ? `'${JSON.stringify(verb.examples).replace(/'/g, "''")}'` : 'NULL'},`);
    sql.push(`  ${verb.notes ? `'${verb.notes.replace(/'/g, "''")}'` : 'NULL'}`);
    sql.push(`);`);
    sql.push('');
  }
  
  sql.push('COMMIT;');
  
  return sql.join('\n');
}

async function main() {
  console.log('🚀 Migrating Verb Dictionary Entries to D1\n');
  
  // Load dictionary
  const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
  let dictData: any;
  
  try {
    const dictRaw = readFileSync(dictPath, 'utf-8');
    dictData = JSON.parse(dictRaw);
    console.log('✅ Loaded dictionary file');
  } catch (error) {
    console.error('❌ Failed to load dictionary:', error);
    process.exit(1);
  }
  
  const entries: DictionaryEntry[] = dictData.entries || (Array.isArray(dictData) ? dictData : []);
  console.log(`📖 Found ${entries.length} total entries\n`);
  
  // Filter for verbs
  const verbEntries = entries.filter((entry: DictionaryEntry) => 
    entry.pos_family === 'verb' || 
    entry.c === 'verb' || 
    entry.c?.includes('verb') ||
    entry.c?.startsWith('v.')
  );
  
  console.log(`🔍 Found ${verbEntries.length} verb entries\n`);
  
  // Convert and categorize verbs
  const regularVerbs: VerbLexiconEntry[] = [];
  const irregularVerbs: VerbLexiconEntry[] = [];
  
  for (const entry of verbEntries) {
    const verbEntry = convertToVerbLexicon(entry);
    if (!verbEntry) continue;
    
    if (isIrregularVerb(entry)) {
      irregularVerbs.push(verbEntry);
    } else {
      regularVerbs.push(verbEntry);
    }
  }
  
  console.log(`📊 Statistics:`);
  console.log(`   Regular verbs: ${regularVerbs.length}`);
  console.log(`   Irregular verbs: ${irregularVerbs.length}`);
  console.log(`   Total: ${regularVerbs.length + irregularVerbs.length}\n`);
  
  // Count verbs with explicit stem data
  const withStems = verbEntries.filter(e => e.psp || e.ssp || e.prp).length;
  console.log(`   Verbs with explicit stem data (psp/ssp/prp): ${withStems}\n`);
  
  // Generate SQL
  console.log('📝 Generating SQL...');
  const sql = generateSQL(regularVerbs, irregularVerbs);
  
  const sqlPath = join(process.cwd(), '.temp-verbs-dictionary-migration.sql');
  require('fs').writeFileSync(sqlPath, sql, 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`\n📊 SQL File Statistics:`);
  console.log(`   Regular verbs: ${regularVerbs.length}`);
  console.log(`   Irregular verbs: ${irregularVerbs.length}`);
  console.log(`   Total INSERT statements: ${regularVerbs.length + irregularVerbs.length}`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main().catch(console.error);





/**
 * Populate D1 tables from LingDocs word data
 *
 * This script:
 * 1. Fetches word data from LingDocs (or uses cached version)
 * 2. Extracts verb metadata (type, transitivity, helper, stems)
 * 3. Extracts all conjugated forms with grammatical metadata
 * 4. Upserts into D1 tables:
 *    - verb_forms (all conjugations)
 *    - verbs_lexicon (verb metadata)
 *    - inflection_reasons (grammatical explanations)
 *
 * Usage:
 *   npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399
 *   npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399 --force
 */

import crypto from 'crypto';
import { fetchLingDocsWord, extractLingDocsForms } from './fetch-lingdocs-word';

interface VerbFormInsert {
  base_verb: string;
  form: string;
  form_type?: string;
  tense?: string;
  person?: string;
  number?: string;
  gender?: string;
  voice?: string;
  aspect?: string;
  source_word_id: number;
  source_checksum: string;
}

interface VerbLexiconInsert {
  pashto_word: string;
  verb_type: string;
  transitivity?: string;
  helper?: string;
  imperfective_stem?: string;
  perfective_stem?: string;
  perfective_root?: string;
  past_participle?: string;
  romanization?: string;
  english?: string;
  source_word_id: number;
  source_checksum: string;
}

interface InflectionReasonInsert {
  pashto_form: string;
  base_word: string;
  inflection_type: string;
  grammatical_context?: string;
  source_word_id: number;
}

/**
 * Calculate checksum for word data
 */
function calculateChecksum(data: any): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Extract verb metadata from LingDocs word
 */
function extractVerbMetadata(wordData: any): VerbLexiconInsert {
  // Parse verb type from category string (e.g., "v. dyn. comp. trans.")
  const category = wordData.c || '';
  const verbType = category.includes('dyn. comp.') ? 'dynamic_compound'
    : category.includes('stat. comp.') ? 'stative_compound'
    : 'simple';

  const transitivity = category.includes('trans.') ? 'transitive'
    : category.includes('intrans.') ? 'intransitive'
    : undefined;

  const helper = wordData.conjugation?.helper;

  const checksum = calculateChecksum(wordData);

  return {
    pashto_word: wordData.p,
    verb_type: verbType,
    transitivity,
    helper,
    imperfective_stem: wordData.prp, // present stem
    perfective_stem: wordData.psp,   // past stem perfective
    perfective_root: wordData.ssp,   // short past stem
    past_participle: wordData.ppf,   // past participle
    romanization: wordData.f,
    english: wordData.e,
    source_word_id: wordData.i,
    source_checksum: checksum,
  };
}

/**
 * Populate verb_forms table
 */
async function populateVerbForms(
  db: any,
  wordData: any,
  lingdocsForms: Map<string, any>,
  force: boolean = false
): Promise<number> {
  const lemma = wordData.p;
  const wordId = wordData.i;
  const checksum = calculateChecksum(wordData);

  // Check if already populated and up-to-date
  if (!force) {
    const existing = await db.prepare(`
      SELECT COUNT(*) as count, source_checksum
      FROM verb_forms
      WHERE base_verb = ? AND source_word_id = ?
      LIMIT 1
    `).bind(lemma, wordId).first();

    if (existing && existing.count > 0 && existing.source_checksum === checksum) {
      console.log(`✅ verb_forms for "${lemma}" already up-to-date (checksum match)`);
      return 0;
    }
  }

  // Delete existing forms for this verb
  await db.prepare(`
    DELETE FROM verb_forms
    WHERE base_verb = ? AND source_word_id = ?
  `).bind(lemma, wordId).run();

  console.log(`🗑️  Deleted existing forms for "${lemma}"`);

  // Insert new forms
  let insertedCount = 0;
  const batch = [];

  for (const [form, metadata] of lingdocsForms.entries()) {
    // Parse person and number from metadata.person (e.g., "1sg" → person=1, number=sg)
    let person = metadata.person?.match(/^\d+/)?.[0]; // Extract "1", "2", "3"
    let number = metadata.person?.match(/(sg|pl)$/)?.[0]; // Extract "sg" or "pl"

    const insert: VerbFormInsert = {
      base_verb: lemma,
      form: form,
      form_type: metadata.form_type,
      tense: metadata.tense,
      person: person,
      number: number,
      gender: metadata.gender,
      voice: metadata.voice,
      aspect: metadata.aspect,
      source_word_id: wordId,
      source_checksum: checksum,
    };

    batch.push(insert);
    insertedCount++;

    // Batch insert every 100 rows
    if (batch.length >= 100) {
      await insertBatch(db, 'verb_forms', batch);
      batch.length = 0;
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await insertBatch(db, 'verb_forms', batch);
  }

  console.log(`✅ Inserted ${insertedCount} verb forms for "${lemma}"`);
  return insertedCount;
}

/**
 * Populate verbs_lexicon table
 */
async function populateVerbsLexicon(
  db: any,
  wordData: any,
  force: boolean = false
): Promise<boolean> {
  const lemma = wordData.p;
  const wordId = wordData.i;
  const checksum = calculateChecksum(wordData);

  // Check if already exists
  if (!force) {
    const existing = await db.prepare(`
      SELECT source_checksum
      FROM verbs_lexicon
      WHERE pashto_word = ?
      LIMIT 1
    `).bind(lemma).first();

    if (existing && existing.source_checksum === checksum) {
      console.log(`✅ verbs_lexicon for "${lemma}" already up-to-date`);
      return false;
    }
  }

  const metadata = extractVerbMetadata(wordData);

  // Upsert
  await db.prepare(`
    INSERT OR REPLACE INTO verbs_lexicon (
      pashto_word, verb_type, transitivity, helper,
      imperfective_stem, perfective_stem, perfective_root, past_participle,
      romanization, english, source_word_id, source_checksum, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    metadata.pashto_word,
    metadata.verb_type,
    metadata.transitivity,
    metadata.helper,
    metadata.imperfective_stem,
    metadata.perfective_stem,
    metadata.perfective_root,
    metadata.past_participle,
    metadata.romanization,
    metadata.english,
    metadata.source_word_id,
    metadata.source_checksum
  ).run();

  console.log(`✅ Upserted verbs_lexicon for "${lemma}" (type: ${metadata.verb_type})`);
  return true;
}

/**
 * Populate inflection_reasons table (for grammatical tooltips)
 */
async function populateInflectionReasons(
  db: any,
  wordData: any,
  lingdocsForms: Map<string, any>
): Promise<number> {
  const lemma = wordData.p;
  const wordId = wordData.i;
  const verbType = extractVerbMetadata(wordData).verb_type;

  // Generate explanations for each form
  const batch: InflectionReasonInsert[] = [];

  for (const [form, metadata] of lingdocsForms.entries()) {
    // Build grammatical context explanation
    const contextParts: string[] = [];
    if (metadata.person) contextParts.push(metadata.person);
    if (metadata.tense) contextParts.push(metadata.tense);
    if (metadata.aspect) contextParts.push(metadata.aspect);
    if (metadata.gender) contextParts.push(metadata.gender);

    const grammaticalContext = contextParts.join(' ');

    // Determine inflection type
    let inflectionType = 'conjugation';
    if (verbType === 'dynamic_compound') inflectionType = 'dynamic_compound_conjugation';
    else if (verbType === 'stative_compound') inflectionType = 'stative_compound_conjugation';

    batch.push({
      pashto_form: form,
      base_word: lemma,
      inflection_type: inflectionType,
      grammatical_context: grammaticalContext || 'verb form',
      source_word_id: wordId,
    });
  }

  // Delete existing reasons for this word
  await db.prepare(`
    DELETE FROM inflection_reasons
    WHERE base_word = ? AND source_word_id = ?
  `).bind(lemma, wordId).run();

  // Insert new reasons
  if (batch.length > 0) {
    await insertBatch(db, 'inflection_reasons', batch);
    console.log(`✅ Inserted ${batch.length} inflection reasons for "${lemma}"`);
  }

  return batch.length;
}

/**
 * Batch insert helper
 */
async function insertBatch(db: any, table: string, rows: any[]): Promise<void> {
  if (rows.length === 0) return;

  // Get column names from first row
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');

  const sql = `
    INSERT OR REPLACE INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;

  for (const row of rows) {
    const values = columns.map(col => row[col] ?? null);
    await db.prepare(sql).bind(...values).run();
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`❌ Usage: npx tsx scripts/populate-lingdocs-word-to-d1.ts <wordId> [--force]`);
    console.error(`   Example: npx tsx scripts/populate-lingdocs-word-to-d1.ts 1527815399`);
    process.exit(1);
  }

  const wordIdArg = args[0];
  const wordId = parseInt(wordIdArg, 10);
  const force = args.includes('--force');

  if (isNaN(wordId)) {
    console.error(`❌ Invalid word ID: ${wordIdArg}`);
    process.exit(1);
  }

  console.log(`🚀 Populating D1 from LingDocs word ${wordId}${force ? ' (forced)' : ''}...\n`);

  // Fetch word data
  const wordData = await fetchLingDocsWord(wordId);
  if (!wordData) {
    console.error(`❌ Failed to fetch word ${wordId}`);
    process.exit(1);
  }

  console.log(`📚 Processing: "${wordData.p}" (${wordData.f})`);
  console.log(`   Category: ${wordData.c}`);
  console.log(`   Definition: ${wordData.e}\n`);

  // Extract forms
  const lingdocsForms = extractLingDocsForms(wordData);

  // Connect to D1
  const { getD1Database } = await import('../utils/d1');
  const db = getD1Database();

  if (!db) {
    console.error(`❌ D1 database not available`);
    process.exit(1);
  }

  // Populate tables
  console.log(`📝 Populating D1 tables...\n`);

  const verbFormsCount = await populateVerbForms(db, wordData, lingdocsForms, force);
  const verbsLexiconUpdated = await populateVerbsLexicon(db, wordData, force);
  const inflectionReasonsCount = await populateInflectionReasons(db, wordData, lingdocsForms);

  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ POPULATION COMPLETE`);
  console.log(`${'='.repeat(80)}`);
  console.log(`   Word: "${wordData.p}" (ID: ${wordId})`);
  console.log(`   Verb Forms: ${verbFormsCount} inserted`);
  console.log(`   Verbs Lexicon: ${verbsLexiconUpdated ? 'Updated' : 'Skipped (up-to-date)'}`);
  console.log(`   Inflection Reasons: ${inflectionReasonsCount} inserted`);
  console.log(`${'='.repeat(80)}\n`);

  console.log(`🔍 Verify the data:`);
  console.log(`   SELECT * FROM verb_forms WHERE base_verb = '${wordData.p}' LIMIT 10;`);
  console.log(`   SELECT * FROM verbs_lexicon WHERE pashto_word = '${wordData.p}';`);
  console.log(`\n🌐 Compare with LingDocs:`);
  console.log(`   https://dictionary.lingdocs.com/word?id=${wordId}`);
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { populateVerbForms, populateVerbsLexicon, populateInflectionReasons };

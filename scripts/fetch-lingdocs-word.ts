/**
 * Fetch and validate word data from LingDocs
 *
 * This script:
 * 1. Fetches word data from https://storage.lingdocs.com/dictionary/words/{id}.json
 * 2. Compares with D1 database verb_forms/inflections tables
 * 3. Reports discrepancies and missing conjugations
 * 4. Provides actionable update commands
 *
 * Usage:
 *   npx tsx scripts/fetch-lingdocs-word.ts 1527815399
 *   npx tsx scripts/fetch-lingdocs-word.ts --word وهل
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

interface LingDocsWordData {
  ts: number;
  i: number; // word ID
  p: string; // Pashto
  f: string; // romanization
  g: string; // guide/pronunciation
  e: string; // English definition
  c: string; // category (e.g., "v. dyn. comp. trans.")

  // Verb-specific fields
  psp?: string; // past stem perfective
  psf?: string; // past stem perfective romanization
  ssp?: string; // past stem short perfective
  ssf?: string; // past stem short perfective romanization
  prp?: string; // present stem
  prf?: string; // present stem romanization

  // Compound verb metadata
  separationAtP?: number;
  separationAtF?: number;

  // Links
  l?: number; // linked entry ID (for compounds)

  // Conjugation data (if verb)
  conjugation?: {
    type: 'verb' | 'noun';
    verbType?: 'dynamic_compound' | 'stative_compound' | 'simple';
    transitivity?: 'transitive' | 'intransitive';
    helper?: string; // e.g., "کول" for compounds

    // Conjugation tables
    imperfective?: any;
    perfective?: any;
    participle?: any;
    modal?: any;
  };
}

interface D1VerbFormRow {
  id: number;
  base_verb: string;
  form: string;
  form_type?: string;
  tense?: string;
  person?: string;
  number?: string;
  gender?: string;
  voice?: string;
  aspect?: string;
  source_word_id?: number;
  source_checksum?: string;
  created_at?: string;
}

interface ComparisonResult {
  wordId: number;
  lemma: string;
  lingdocsMetadata: {
    verbType?: string;
    transitivity?: string;
    helper?: string;
    totalForms: number;
  };
  d1Metadata: {
    exists: boolean;
    totalForms: number;
    sourceChecksum?: string;
  };
  comparison: {
    formsInBoth: string[];
    formsOnlyInLingDocs: string[];
    formsOnlyInD1: string[];
    metadataMismatches: Array<{
      form: string;
      field: string;
      lingdocs: string;
      d1: string;
    }>;
  };
  checksumMatch: boolean;
  recommendation: 'up_to_date' | 'needs_update' | 'missing_in_d1' | 'drift_detected';
}

/**
 * Fetch word data from LingDocs storage
 */
async function fetchLingDocsWord(wordId: number): Promise<LingDocsWordData | null> {
  const url = `https://storage.lingdocs.com/dictionary/words/${wordId}.json`;

  console.log(`📡 Fetching word ${wordId} from LingDocs...`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Fetched word data for "${data.p}" (${data.f})`);

    return data;
  } catch (error) {
    console.error(`❌ Error fetching word:`, error);
    return null;
  }
}

/**
 * Calculate checksum for word data (for drift detection)
 */
function calculateChecksum(data: any): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Extract all conjugated forms from LingDocs data
 */
function extractLingDocsForms(wordData: LingDocsWordData): Map<string, any> {
  const forms = new Map<string, any>();

  if (!wordData.conjugation) {
    console.warn(`⚠️  Word "${wordData.p}" has no conjugation data`);
    return forms;
  }

  const { conjugation } = wordData;

  // Helper to flatten nested conjugation structure
  const flattenConjugation = (obj: any, context: { tense?: string; person?: string; gender?: string; aspect?: string } = {}): void => {
    if (!obj) return;

    // Base case: Pashto string object { p: string, f: string }
    if (typeof obj.p === 'string') {
      const form = obj.p.trim();
      if (!forms.has(form)) {
        forms.set(form, {
          form,
          romanized: obj.f,
          ...context,
          source: 'lingdocs',
        });
      }
      return;
    }

    // Handle arrays (person conjugations: 1sg, 2sg, 3sg, 1pl, 2pl, 3pl)
    if (Array.isArray(obj)) {
      const personLabels = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
      obj.forEach((item, idx) => {
        flattenConjugation(item, { ...context, person: personLabels[idx] });
      });
      return;
    }

    // Handle objects (tense/aspect/gender nesting)
    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        let newContext = { ...context };

        // Map keys to metadata fields
        if (key === 'imperfective') newContext.aspect = 'imperfective';
        else if (key === 'perfective') newContext.aspect = 'perfective';
        else if (key === 'nonImperative') newContext.tense = 'non-imperative';
        else if (key === 'imperative') newContext.tense = 'imperative';
        else if (key === 'long') newContext.form_type = 'long';
        else if (key === 'short') newContext.form_type = 'short';
        else if (key === 'masc') newContext.gender = 'masculine';
        else if (key === 'fem') newContext.gender = 'feminine';

        flattenConjugation(value, newContext);
      }
    }
  };

  // Extract all conjugation forms
  flattenConjugation(conjugation, {});

  console.log(`📊 Extracted ${forms.size} unique forms from LingDocs conjugation data`);

  return forms;
}

/**
 * Fetch D1 verb forms for a word
 */
async function fetchD1VerbForms(db: any, lemma: string): Promise<Map<string, D1VerbFormRow>> {
  const forms = new Map<string, D1VerbFormRow>();

  try {
    const result = await db.prepare(`
      SELECT
        id, base_verb, form, form_type, tense, person, number,
        gender, voice, aspect, source_word_id, source_checksum, created_at
      FROM verb_forms
      WHERE base_verb = ?
      ORDER BY form
    `).bind(lemma).all();

    for (const row of result.results || []) {
      forms.set(row.form, row as D1VerbFormRow);
    }

    console.log(`💾 Found ${forms.size} forms in D1 for "${lemma}"`);
  } catch (error) {
    console.error(`❌ Error querying D1:`, error);
  }

  return forms;
}

/**
 * Compare LingDocs and D1 data
 */
function compareWordData(
  wordData: LingDocsWordData,
  lingdocsForms: Map<string, any>,
  d1Forms: Map<string, D1VerbFormRow>
): ComparisonResult {
  const formsInBoth: string[] = [];
  const formsOnlyInLingDocs: string[] = [];
  const formsOnlyInD1: string[] = [];
  const metadataMismatches: ComparisonResult['comparison']['metadataMismatches'] = [];

  // Check forms in LingDocs
  for (const [form, lingdocsData] of lingdocsForms.entries()) {
    const d1Row = d1Forms.get(form);

    if (d1Row) {
      formsInBoth.push(form);

      // Check metadata matches
      if (lingdocsData.tense && d1Row.tense && lingdocsData.tense !== d1Row.tense) {
        metadataMismatches.push({
          form,
          field: 'tense',
          lingdocs: lingdocsData.tense,
          d1: d1Row.tense,
        });
      }
      if (lingdocsData.person && d1Row.person && lingdocsData.person !== d1Row.person) {
        metadataMismatches.push({
          form,
          field: 'person',
          lingdocs: lingdocsData.person,
          d1: d1Row.person,
        });
      }
    } else {
      formsOnlyInLingDocs.push(form);
    }
  }

  // Check forms only in D1
  for (const [form] of d1Forms.entries()) {
    if (!lingdocsForms.has(form)) {
      formsOnlyInD1.push(form);
    }
  }

  // Extract verb metadata from LingDocs
  const verbType = wordData.c?.includes('dyn. comp.') ? 'dynamic_compound'
    : wordData.c?.includes('stat. comp.') ? 'stative_compound'
    : 'simple';

  const transitivity = wordData.c?.includes('trans.') ? 'transitive'
    : wordData.c?.includes('intrans.') ? 'intransitive'
    : undefined;

  const helper = wordData.conjugation?.helper;

  // Calculate checksums
  const lingdocsChecksum = calculateChecksum(wordData);
  const d1Checksum = d1Forms.size > 0
    ? Array.from(d1Forms.values())[0]?.source_checksum
    : undefined;

  const checksumMatch = d1Checksum === lingdocsChecksum;

  // Determine recommendation
  let recommendation: ComparisonResult['recommendation'];
  if (d1Forms.size === 0) {
    recommendation = 'missing_in_d1';
  } else if (!checksumMatch) {
    recommendation = 'drift_detected';
  } else if (formsOnlyInLingDocs.length > 0 || metadataMismatches.length > 0) {
    recommendation = 'needs_update';
  } else {
    recommendation = 'up_to_date';
  }

  return {
    wordId: wordData.i,
    lemma: wordData.p,
    lingdocsMetadata: {
      verbType,
      transitivity,
      helper,
      totalForms: lingdocsForms.size,
    },
    d1Metadata: {
      exists: d1Forms.size > 0,
      totalForms: d1Forms.size,
      sourceChecksum: d1Checksum,
    },
    comparison: {
      formsInBoth,
      formsOnlyInLingDocs,
      formsOnlyInD1,
      metadataMismatches,
    },
    checksumMatch,
    recommendation,
  };
}

/**
 * Print comparison report
 */
function printComparisonReport(result: ComparisonResult): void {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 LINGDOCS vs D1 COMPARISON: ${result.lemma} (ID: ${result.wordId})`);
  console.log('='.repeat(80));

  // Metadata
  console.log(`\n📚 LingDocs Metadata:`);
  console.log(`   Verb Type: ${result.lingdocsMetadata.verbType || 'N/A'}`);
  console.log(`   Transitivity: ${result.lingdocsMetadata.transitivity || 'N/A'}`);
  console.log(`   Helper: ${result.lingdocsMetadata.helper || 'N/A'}`);
  console.log(`   Total Forms: ${result.lingdocsMetadata.totalForms}`);

  console.log(`\n💾 D1 Database Metadata:`);
  console.log(`   Exists: ${result.d1Metadata.exists ? 'Yes' : 'No'}`);
  console.log(`   Total Forms: ${result.d1Metadata.totalForms}`);
  console.log(`   Source Checksum: ${result.d1Metadata.sourceChecksum || 'N/A'}`);

  // Comparison
  console.log(`\n🔍 Comparison Results:`);
  console.log(`   Forms in Both: ${result.comparison.formsInBoth.length}`);
  console.log(`   Forms Only in LingDocs: ${result.comparison.formsOnlyInLingDocs.length}`);
  console.log(`   Forms Only in D1: ${result.comparison.formsOnlyInD1.length}`);
  console.log(`   Metadata Mismatches: ${result.comparison.metadataMismatches.length}`);
  console.log(`   Checksum Match: ${result.checksumMatch ? '✅ Yes' : '❌ No'}`);

  // Show examples of discrepancies
  if (result.comparison.formsOnlyInLingDocs.length > 0) {
    console.log(`\n⚠️  Forms Missing in D1 (examples):`);
    result.comparison.formsOnlyInLingDocs.slice(0, 10).forEach(form => {
      console.log(`     - ${form}`);
    });
    if (result.comparison.formsOnlyInLingDocs.length > 10) {
      console.log(`     ... and ${result.comparison.formsOnlyInLingDocs.length - 10} more`);
    }
  }

  if (result.comparison.formsOnlyInD1.length > 0) {
    console.log(`\n🔵 Forms Only in D1 (possibly irregular/manual additions):`);
    result.comparison.formsOnlyInD1.slice(0, 5).forEach(form => {
      console.log(`     - ${form}`);
    });
  }

  if (result.comparison.metadataMismatches.length > 0) {
    console.log(`\n⚠️  Metadata Mismatches (examples):`);
    result.comparison.metadataMismatches.slice(0, 5).forEach(mismatch => {
      console.log(`     - ${mismatch.form}: ${mismatch.field}`);
      console.log(`       LingDocs: ${mismatch.lingdocs}`);
      console.log(`       D1:       ${mismatch.d1}`);
    });
  }

  // Recommendation
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📋 RECOMMENDATION: ${result.recommendation.toUpperCase().replace(/_/g, ' ')}`);

  switch (result.recommendation) {
    case 'up_to_date':
      console.log(`✅ D1 data is up-to-date with LingDocs. No action needed.`);
      break;
    case 'needs_update':
      console.log(`⚠️  D1 data needs updating. Run:`);
      console.log(`   npx tsx scripts/update-d1-from-lingdocs.ts ${result.wordId}`);
      break;
    case 'missing_in_d1':
      console.log(`❌ Word not found in D1. Run:`);
      console.log(`   npx tsx scripts/populate-lingdocs-word-to-d1.ts ${result.wordId}`);
      break;
    case 'drift_detected':
      console.log(`⚠️  Checksum mismatch - LingDocs data has changed. Re-import:`);
      console.log(`   npx tsx scripts/refresh-lingdocs-word.ts ${result.wordId}`);
      break;
  }
  console.log(`${'='.repeat(80)}\n`);
}

/**
 * Save word data to local cache
 */
async function saveToCache(wordData: LingDocsWordData): Promise<void> {
  const cacheDir = path.join(process.cwd(), 'app/data/lingdocs/words');
  await fs.mkdir(cacheDir, { recursive: true });

  const cachePath = path.join(cacheDir, `${wordData.i}.json`);
  await fs.writeFile(cachePath, JSON.stringify(wordData, null, 2));

  console.log(`💾 Saved to cache: ${cachePath}`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(`❌ Usage: npx tsx scripts/fetch-lingdocs-word.ts <wordId>`);
    console.error(`   Example: npx tsx scripts/fetch-lingdocs-word.ts 1527815399`);
    process.exit(1);
  }

  const wordIdArg = args[0];
  const wordId = parseInt(wordIdArg, 10);

  if (isNaN(wordId)) {
    console.error(`❌ Invalid word ID: ${wordIdArg}`);
    process.exit(1);
  }

  // Fetch from LingDocs
  const wordData = await fetchLingDocsWord(wordId);
  if (!wordData) {
    console.error(`❌ Failed to fetch word ${wordId}`);
    process.exit(1);
  }

  // Save to cache
  await saveToCache(wordData);

  // Extract conjugation forms
  const lingdocsForms = extractLingDocsForms(wordData);

  // Fetch D1 data
  console.log(`\n💾 Querying D1 database...`);
  const { getD1Database } = await import('../utils/d1');
  const db = getD1Database();

  if (!db) {
    console.error(`❌ D1 database not available`);
    process.exit(1);
  }

  const d1Forms = await fetchD1VerbForms(db, wordData.p);

  // Compare
  const comparison = compareWordData(wordData, lingdocsForms, d1Forms);

  // Print report
  printComparisonReport(comparison);

  // Save comparison report
  const reportPath = path.join(process.cwd(), `lingdocs-d1-comparison-${wordId}.json`);
  await fs.writeFile(reportPath, JSON.stringify(comparison, null, 2));
  console.log(`📄 Detailed comparison saved to: ${reportPath}`);
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { fetchLingDocsWord, extractLingDocsForms, compareWordData, ComparisonResult };

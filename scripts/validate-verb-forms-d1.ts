/**
 * Validate verb_forms table against LingDocs truth
 *
 * This script:
 * 1. Samples verbs from verb_forms table
 * 2. Generates conjugations using official LingDocs library
 * 3. Compares D1 data vs LingDocs output
 * 4. Reports accuracy metrics
 *
 * Run: npx tsx scripts/validate-verb-forms-d1.ts
 */

import { conjugateVerb, inflectWord } from '@lingdocs/ps-react';
import type { Types as T } from '@lingdocs/ps-react';

interface ValidationResult {
  verb: string;
  totalFormsInD1: number;
  totalFormsInLingDocs: number;
  exactMatches: number;
  missingInD1: string[];
  extraInD1: string[];
  labelMismatches: Array<{ form: string; d1Label: string; lingdocsLabel: string }>;
  accuracy: number; // percentage
}

interface ValidationSummary {
  totalVerbs: number;
  averageAccuracy: number;
  perfectMatches: number; // Verbs with 100% accuracy
  goodMatches: number;    // Verbs with >95% accuracy
  poorMatches: number;    // Verbs with <80% accuracy
  details: ValidationResult[];
}

/**
 * Get verb forms from D1 verb_forms table
 */
async function getD1VerbForms(db: any, baseVerb: string): Promise<Map<string, string>> {
  const forms = new Map<string, string>();

  try {
    const result = await db.prepare(`
      SELECT form, form_type, tense, person, number
      FROM verb_forms
      WHERE base_verb = ?
      LIMIT 200
    `).bind(baseVerb).all();

    for (const row of result.results || []) {
      const form = row.form;

      // Reconstruct label from metadata (matching LingDocs format)
      const labelParts: string[] = [];
      if (row.person) labelParts.push(row.person);
      if (row.number) labelParts.push(row.number);
      if (row.tense) labelParts.push(row.tense);
      if (row.form_type) labelParts.push(row.form_type);

      const label = labelParts.length > 0 ? labelParts.join(' ') : 'Form';
      forms.set(form, label);
    }
  } catch (error) {
    console.error(`Error querying D1 for ${baseVerb}:`, error);
  }

  return forms;
}

/**
 * Get verb forms from official LingDocs library
 */
function getLingDocsVerbForms(verbEntry: T.VerbDictionaryEntry): Map<string, string> {
  const forms = new Map<string, string>();

  try {
    const conjugation = conjugateVerb(verbEntry);
    if (!conjugation) {
      console.warn(`LingDocs conjugation failed for ${verbEntry.p}`);
      return forms;
    }

    // Flatten conjugation structure (similar to lingdocs_integration.ts:220-357)
    const flattenConjugation = (obj: any, label: string = ''): void => {
      if (!obj) return;

      // Base case: If it's a Pashto string object { p: string, f: string }
      if (typeof obj.p === 'string') {
        forms.set(obj.p.trim(), label || 'Form');
        return;
      }

      // Handle arrays (person conjugations)
      if (Array.isArray(obj)) {
        const personLabels = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
        obj.forEach((item, idx) => {
          const personLabel = personLabels[idx] || '';
          const nextLabel = personLabel ? `${personLabel} ${label}`.trim() : label;
          flattenConjugation(item, nextLabel);
        });
        return;
      }

      // Handle objects (tense/aspect/gender/length nesting)
      if (typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
          let nextLabel = label;

          // Map keys to readable labels
          const keyMap: Record<string, string> = {
            'imperfective': 'Present',
            'perfective': 'Subjunctive',
            'past': 'Past',
            'nonImperative': '',
            'imperative': 'Imperative',
            'long': '(long)',
            'short': '(short)',
            'masc': 'Masc',
            'fem': 'Fem',
          };

          const keyLabel = keyMap[key] || key;
          nextLabel = keyLabel ? `${label} ${keyLabel}`.trim() : label;

          flattenConjugation(value, nextLabel);
        }
      }
    };

    flattenConjugation(conjugation, '');
  } catch (error) {
    console.error(`Error generating LingDocs forms for ${verbEntry.p}:`, error);
  }

  return forms;
}

/**
 * Compare verb forms and calculate accuracy
 */
function compareVerbForms(
  verb: string,
  d1Forms: Map<string, string>,
  lingdocsForms: Map<string, string>
): ValidationResult {
  let exactMatches = 0;
  const missingInD1: string[] = [];
  const extraInD1: string[] = [];
  const labelMismatches: ValidationResult['labelMismatches'] = [];

  // Check forms in LingDocs
  for (const [form, lingdocsLabel] of lingdocsForms.entries()) {
    const d1Label = d1Forms.get(form);

    if (!d1Label) {
      missingInD1.push(form);
    } else if (normalizeLabel(d1Label) === normalizeLabel(lingdocsLabel)) {
      exactMatches++;
    } else {
      labelMismatches.push({ form, d1Label, lingdocsLabel });
    }
  }

  // Check forms in D1 that aren't in LingDocs
  for (const [form] of d1Forms.entries()) {
    if (!lingdocsForms.has(form)) {
      extraInD1.push(form);
    }
  }

  // Calculate accuracy
  const totalExpected = lingdocsForms.size;
  const accuracy = totalExpected > 0 ? (exactMatches / totalExpected) * 100 : 0;

  return {
    verb,
    totalFormsInD1: d1Forms.size,
    totalFormsInLingDocs: lingdocsForms.size,
    exactMatches,
    missingInD1,
    extraInD1,
    labelMismatches,
    accuracy,
  };
}

/**
 * Normalize labels for comparison (ignore minor differences)
 */
function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
    .trim();
}

/**
 * Main validation function
 */
async function validateVerbForms(
  db: any,
  dictionary: T.DictionaryEntry[],
  sampleSize: number = 100
): Promise<ValidationSummary> {
  console.log(`🔍 Starting validation of verb_forms table against LingDocs...`);
  console.log(`📊 Sample size: ${sampleSize} verbs\n`);

  // Get sample of verbs from dictionary
  const verbs = dictionary.filter((entry: any) =>
    entry.c?.startsWith('v.') && entry.p && 'psp' in entry
  ).slice(0, sampleSize);

  console.log(`✅ Found ${verbs.length} verbs to validate\n`);

  const results: ValidationResult[] = [];
  let totalAccuracy = 0;
  let perfectMatches = 0;
  let goodMatches = 0;
  let poorMatches = 0;

  for (let i = 0; i < verbs.length; i++) {
    const verb = verbs[i] as T.VerbDictionaryEntry;
    const verbWord = verb.p;

    if ((i + 1) % 10 === 0) {
      console.log(`📝 Progress: ${i + 1}/${verbs.length} verbs validated`);
    }

    // Get forms from both sources
    const d1Forms = await getD1VerbForms(db, verbWord);
    const lingdocsForms = getLingDocsVerbForms(verb);

    // Compare and calculate accuracy
    const result = compareVerbForms(verbWord, d1Forms, lingdocsForms);
    results.push(result);

    totalAccuracy += result.accuracy;

    if (result.accuracy === 100) perfectMatches++;
    else if (result.accuracy >= 95) goodMatches++;
    else if (result.accuracy < 80) poorMatches++;
  }

  const averageAccuracy = verbs.length > 0 ? totalAccuracy / verbs.length : 0;

  return {
    totalVerbs: verbs.length,
    averageAccuracy,
    perfectMatches,
    goodMatches,
    poorMatches,
    details: results,
  };
}

/**
 * Print validation report
 */
function printReport(summary: ValidationSummary): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION REPORT: verb_forms vs LingDocs');
  console.log('='.repeat(80));

  console.log(`\n✅ Overall Accuracy: ${summary.averageAccuracy.toFixed(2)}%`);
  console.log(`📝 Total Verbs Validated: ${summary.totalVerbs}`);
  console.log(`\n🎯 Match Quality:`);
  console.log(`   Perfect (100%): ${summary.perfectMatches} verbs`);
  console.log(`   Good (≥95%):    ${summary.goodMatches} verbs`);
  console.log(`   Poor (<80%):    ${summary.poorMatches} verbs`);

  // Show examples of poor matches
  if (summary.poorMatches > 0) {
    console.log(`\n⚠️  Verbs with Poor Matches (<80% accuracy):`);
    const poorExamples = summary.details
      .filter(r => r.accuracy < 80)
      .slice(0, 5);

    for (const example of poorExamples) {
      console.log(`\n   ${example.verb}: ${example.accuracy.toFixed(1)}% accuracy`);
      console.log(`   - D1 has ${example.totalFormsInD1} forms, LingDocs has ${example.totalFormsInLingDocs}`);
      console.log(`   - Missing in D1: ${example.missingInD1.length} forms`);
      console.log(`   - Extra in D1: ${example.extraInD1.length} forms`);
      if (example.missingInD1.length > 0) {
        console.log(`     Examples: ${example.missingInD1.slice(0, 3).join(', ')}`);
      }
    }
  }

  // Recommendation
  console.log(`\n${'='.repeat(80)}`);
  if (summary.averageAccuracy >= 95) {
    console.log(`✅ RECOMMENDATION: verb_forms table is ACCURATE enough for production use`);
    console.log(`   You can proceed with Phase 1 (fast verb lookup)`);
  } else if (summary.averageAccuracy >= 90) {
    console.log(`⚠️  RECOMMENDATION: verb_forms table has MINOR discrepancies`);
    console.log(`   Review poor matches before proceeding with Phase 1`);
  } else {
    console.log(`❌ RECOMMENDATION: verb_forms table needs UPDATE`);
    console.log(`   Run re-population from LingDocs before using for production`);
  }
  console.log(`${'='.repeat(80)}\n`);
}

/**
 * Run validation
 */
async function main() {
  try {
    // Import D1 database
    const { getD1Database } = await import('../utils/d1');
    const db = getD1Database();

    if (!db) {
      throw new Error('D1 database not available');
    }

    // Load dictionary
    console.log('📚 Loading LingDocs dictionary...');
    const fs = await import('fs/promises');
    const path = await import('path');
    const dictPath = path.join(process.cwd(), 'app/data/full_dictionary_enriched.json');
    const dictData = JSON.parse(await fs.readFile(dictPath, 'utf8'));
    const dictionary = dictData.entries || [];

    console.log(`✅ Loaded ${dictionary.length} dictionary entries\n`);

    // Run validation
    const summary = await validateVerbForms(db, dictionary, 100);

    // Print report
    printReport(summary);

    // Save detailed results to file
    const resultsPath = path.join(process.cwd(), 'validation-report.json');
    await fs.writeFile(resultsPath, JSON.stringify(summary, null, 2));
    console.log(`📄 Detailed results saved to: validation-report.json`);

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { validateVerbForms, ValidationResult, ValidationSummary };

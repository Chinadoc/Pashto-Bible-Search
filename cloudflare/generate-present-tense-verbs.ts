/**
 * Generate Present Tense Verb Conjugations Using LingDocs
 * 
 * This script uses the LingDocs pashto-inflector library to generate
 * all present tense conjugations for verbs and store them in D1.
 * 
 * Present tense endings:
 * - 1sg: کوم (kawúm)
 * - 1pl: کوو (kawóo)
 * - 2sg: کوې (kawé)
 * - 2pl: کوئ (kawéy)
 * - 3sg: کوي (kawée)
 * - 3pl: کوي (kawée)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Import LingDocs integration helper
import { generateVerbVariantsLingDocs } from '../app/utils/lingdocs_integration';

// Import LingDocs library directly
let LingDocs: any;

async function loadLingDocs() {
  try {
    // Try to import from pashto-inflector submodule
    const libraryPath = join(process.cwd(), 'pashto-inflector/src/lib/dist/lib/library.js');
    if (require('fs').existsSync(libraryPath)) {
      LingDocs = require(libraryPath);
      console.log('✅ Loaded LingDocs library from submodule');
      return true;
    }
    
    // Try npm package
    try {
      LingDocs = require('@lingdocs/pashto-inflector');
      console.log('✅ Loaded LingDocs library from npm');
      return true;
    } catch (e) {
      console.warn('⚠️  Could not load from npm, trying alternative...');
    }
    
    return false;
  } catch (error) {
    console.error('❌ Failed to load LingDocs library:', error);
    return false;
  }
}

interface PresentTenseForm {
  form: string;
  person: '1st' | '2nd' | '3rd';
  number: 'singular' | 'plural';
  romanization?: string;
}

interface VerbEntry {
  root: string;
  infinitive?: string;
  presentTense: PresentTenseForm[];
}

/**
 * Generate present tense forms for a verb using LingDocs
 */
async function generatePresentTenseForms(verbRoot: string, dictionaryEntry?: any): Promise<PresentTenseForm[]> {
  const forms: PresentTenseForm[] = [];
  
  // First try using the existing LingDocs integration helper
  try {
    const variants = await generateVerbVariantsLingDocs(verbRoot, { cap: 100 });
    
    // Filter for present tense forms
    const presentVariants = variants.filter(v => 
      v.label && (
        v.label.toLowerCase().includes('present') ||
        v.label.toLowerCase().includes('1sg') ||
        v.label.toLowerCase().includes('2sg') ||
        v.label.toLowerCase().includes('3sg')
      )
    );
    
    // Map variants to PresentTenseForm format
    for (const variant of presentVariants) {
      const label = variant.label.toLowerCase();
      
      // Extract person and number from label
      let person: '1st' | '2nd' | '3rd' | null = null;
      let number: 'singular' | 'plural' | null = null;
      
      if (label.includes('1sg') || label.includes('1st singular')) {
        person = '1st';
        number = 'singular';
      } else if (label.includes('1pl') || label.includes('1st plural')) {
        person = '1st';
        number = 'plural';
      } else if (label.includes('2sg') || label.includes('2nd singular')) {
        person = '2nd';
        number = 'singular';
      } else if (label.includes('2pl') || label.includes('2nd plural')) {
        person = '2nd';
        number = 'plural';
      } else if (label.includes('3sg') || label.includes('3rd singular')) {
        person = '3rd';
        number = 'singular';
      } else if (label.includes('3pl') || label.includes('3rd plural')) {
        person = '3rd';
        number = 'plural';
      }
      
      if (person && number) {
        forms.push({
          form: variant.form,
          person,
          number,
          romanization: variant.romanized,
        });
      }
    }
    
    // If we got present tense forms, return them
    if (forms.length >= 6) {
      return forms;
    }
  } catch (error) {
    console.warn(`⚠️  LingDocs integration helper failed for "${verbRoot}":`, error);
  }
  
  // Fallback: Try direct LingDocs API
  if (LingDocs && LingDocs.conjugateVerb && dictionaryEntry) {
    try {
      const conjugation = LingDocs.conjugateVerb(dictionaryEntry);
      if (conjugation && conjugation.imperfective && conjugation.imperfective.nonImperative) {
        const imperfective = conjugation.imperfective.nonImperative;
        if (Array.isArray(imperfective) && imperfective.length === 6) {
          const personLabels: Array<'1st' | '2nd' | '3rd'> = ['1st', '2nd', '3rd', '1st', '2nd', '3rd'];
          const numberLabels: Array<'singular' | 'plural'> = ['singular', 'singular', 'singular', 'plural', 'plural', 'plural'];
          
          imperfective.forEach((personLine: any, idx: number) => {
            if (Array.isArray(personLine) && personLine.length >= 2) {
              const mascLine = personLine[0]; // Masculine
              if (Array.isArray(mascLine) && mascLine.length >= 2) {
                const longForm = mascLine[0]; // Long form
                if (Array.isArray(longForm) && longForm.length > 0) {
                  const formData = longForm[0];
                  if (formData && formData.p) {
                    forms.push({
                      form: formData.p,
                      person: personLabels[idx],
                      number: numberLabels[idx],
                      romanization: formData.f,
                    });
                  }
                }
              }
            }
          });
        }
      }
      
      if (forms.length >= 6) {
        return forms;
      }
    } catch (error) {
      console.warn(`⚠️  Direct LingDocs API failed for "${verbRoot}":`, error);
    }
  }
  
  // Final fallback: pattern-based generation
  // Use psp (imperfective stem) from dictionary entry if available
  const psp = dictionaryEntry?.psp;
  return generatePresentTenseByPattern(verbRoot, psp);
}

/**
 * Fallback: Generate present tense by pattern
 * For کول (kawul): stem is "کو", add endings: کوم, کوو, کوې, کوئ, کوي, کوي
 * 
 * If `psp` (imperfective stem) is provided from dictionary, use that directly.
 * Otherwise, infer stem from infinitive.
 */
function generatePresentTenseByPattern(verbRoot: string, psp?: string): PresentTenseForm[] {
  const forms: PresentTenseForm[] = [];
  
  // Use explicit stem from dictionary if available (most accurate)
  let stem = psp;
  
  // Otherwise, infer stem from infinitive
  if (!stem) {
    stem = verbRoot;
    
    // Remove infinitive endings - check longest first!
    // Special handling: "کول" ends with "ول" but removing 2 chars from 3-char string gives wrong result
    // So we use substring(0, length - 1) to get the stem "کو" from "کول"
    
    if (verbRoot.length >= 3 && verbRoot.endsWith('ېدل')) {
      stem = verbRoot.substring(0, verbRoot.length - 3); // کېدل → کې
    } else if (verbRoot.length >= 3 && verbRoot.endsWith('یدل')) {
      stem = verbRoot.substring(0, verbRoot.length - 3); // Alternate ending
    } else if (verbRoot.endsWith('ول')) {
      // Special case: for verbs ending in "ول", remove just the "ل" to get stem
      // کول (3 chars) → کو (2 chars) by removing last char, not last 2
      stem = verbRoot.substring(0, verbRoot.length - 1); // کول → کو
    } else if (verbRoot.endsWith('ل')) {
      stem = verbRoot.substring(0, verbRoot.length - 1); // تلل → تل
    }
  }
  
  if (!stem) {
    console.warn(`⚠️  Could not determine stem for "${verbRoot}"`);
    return [];
  }
  
  // Present tense endings match your example:
  // کول → کوم, کوو, کوې, کوئ, کوي, کوي
  forms.push({ form: stem + 'م', person: '1st', number: 'singular' }); // کوم
  forms.push({ form: stem + 'و', person: '1st', number: 'plural' });   // کوو
  forms.push({ form: stem + 'ې', person: '2nd', number: 'singular' }); // کوې
  forms.push({ form: stem + 'ئ', person: '2nd', number: 'plural' });   // کوئ
  forms.push({ form: stem + 'ي', person: '3rd', number: 'singular' }); // کوي
  forms.push({ form: stem + 'ي', person: '3rd', number: 'plural' });   // کوي
  
  return forms;
}

/**
 * Load verb data from D1 via Cloudflare Worker API
 */
async function loadVerbsFromD1(workerUrl?: string): Promise<Array<{ root: string; entry: any }>> {
  const verbs: Array<{ root: string; entry: any }> = [];
  
  if (!workerUrl) {
    workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';
  }
  
  try {
    console.log(`🌩️  Attempting to load verbs from D1 via ${workerUrl}...`);
    
    // Query all verbs from D1
    // Note: We'll need to fetch all verbs, which might require pagination
    // For now, we'll try to get verbs via the API endpoints
    
    // Since there's no "list all verbs" endpoint, we'll fall back to dictionary
    console.log('⚠️  D1 API does not support listing all verbs, falling back to dictionary');
    return [];
  } catch (error) {
    console.warn('⚠️  Could not load from D1:', error);
    return [];
  }
}

/**
 * Convert D1 verb entry to dictionary entry format
 */
function convertD1VerbToDictEntry(d1Verb: any): any {
  const stems = typeof d1Verb.stems === 'string' ? JSON.parse(d1Verb.stems) : d1Verb.stems;
  const roots = typeof d1Verb.roots === 'string' ? JSON.parse(d1Verb.roots) : d1Verb.roots;
  
  return {
    p: d1Verb.verb_root,
    f: roots?.imperfective?.f || stems?.imperfective?.f,
    c: 'verb',
    pos_family: 'verb',
    psp: stems?.imperfective?.p,
    psf: stems?.imperfective?.f,
    ssp: stems?.perfective?.p,
    ssf: stems?.perfective?.f,
    prp: roots?.perfective?.p,
    prf: roots?.perfective?.f,
    pprtp: d1Verb.past_participle,
  };
}

/**
 * Load verbs from dictionary with proper LingDocs entry format
 */
async function loadVerbsWithEntries(): Promise<Array<{ root: string; entry: any }>> {
  const verbs: Array<{ root: string; entry: any }> = [];
  
  // Try to load from D1 first (if configured)
  const d1Verbs = await loadVerbsFromD1();
  if (d1Verbs.length > 0) {
    console.log(`✅ Loaded ${d1Verbs.length} verbs from D1`);
    return d1Verbs;
  }
  
  // Fallback: Try to load from dictionary
  try {
    const dictPath = join(process.cwd(), 'app/data/full_dictionary_enriched.json');
    if (require('fs').existsSync(dictPath)) {
      const dictData = JSON.parse(readFileSync(dictPath, 'utf-8'));
      const entries = dictData.entries || (Array.isArray(dictData) ? dictData : []);
      
      // Filter for verbs
      const verbEntries = entries.filter((entry: any) => 
        entry.pos_family === 'verb' || 
        entry.c === 'verb' || 
        entry.c?.includes('verb') ||
        entry.c?.startsWith('v.')
      );
      
      for (const entry of verbEntries) {
        const root = entry.p || entry.pashto;
        if (root) {
          verbs.push({ root, entry });
        }
      }
      
      const withStems = verbEntries.filter((e: any) => e.psp).length;
      console.log(`✅ Loaded ${verbs.length} verbs from dictionary`);
      console.log(`   ${withStems} verbs have explicit stem data (psp)`);
      return verbs;
    }
  } catch (error) {
    console.warn('⚠️  Could not load from dictionary:', error);
  }
  
  // Fallback: Create basic entries for common verbs
  console.log('⚠️  Using fallback verb entries');
  const commonVerbs = [
    { p: 'کول', f: 'kawul', c: 'verb' },      // to do/make
    { p: 'کېدل', f: 'kedul', c: 'verb' },      // to become
    { p: 'تلل', f: 'tlal', c: 'verb' },        // to go
    { p: 'راتلل', f: 'ratlal', c: 'verb' },    // to come
    { p: 'خوړل', f: 'khawrul', c: 'verb' },    // to eat
    { p: 'وینل', f: 'weenal', c: 'verb' },     // to see
  ];
  
  return commonVerbs.map(v => ({ root: v.p, entry: v }));
}

/**
 * Generate SQL for inserting present tense forms into D1
 */
function generateSQL(verbs: VerbEntry[]): string {
  const sql: string[] = [];
  
  sql.push('-- Present Tense Verb Conjugations');
  sql.push('-- Generated from LingDocs pashto-inflector');
  sql.push('');
  sql.push('BEGIN TRANSACTION;');
  sql.push('');
  
  for (const verb of verbs) {
    for (const form of verb.presentTense) {
      const grammaticalInfo = JSON.stringify({
        category: 'verb',
        tense: 'present',
        person: form.person,
        number: form.number,
        label: `${form.person} ${form.number} Present`,
      });
      
      sql.push(`INSERT OR REPLACE INTO inflections (`);
      sql.push(`  base_word,`);
      sql.push(`  inflected_form,`);
      sql.push(`  grammatical_info,`);
      sql.push(`  frequency`);
      sql.push(`) VALUES (`);
      sql.push(`  '${verb.root.replace(/'/g, "''")}',`);
      sql.push(`  '${form.form.replace(/'/g, "''")}',`);
      sql.push(`  '${grammaticalInfo.replace(/'/g, "''")}',`);
      sql.push(`  0`);
      sql.push(`);`);
      sql.push('');
      
      // Also populate form_to_root
      sql.push(`INSERT OR REPLACE INTO form_to_root (`);
      sql.push(`  word_form,`);
      sql.push(`  root_word,`);
      sql.push(`  frequency`);
      sql.push(`) VALUES (`);
      sql.push(`  '${form.form.replace(/'/g, "''")}',`);
      sql.push(`  '${verb.root.replace(/'/g, "''")}',`);
      sql.push(`  0`);
      sql.push(`);`);
      sql.push('');
    }
  }
  
  sql.push('COMMIT;');
  
  return sql.join('\n');
}

async function main() {
  console.log('🚀 Generating Present Tense Verb Conjugations\n');
  
  // Load LingDocs library
  const lingdocsLoaded = await loadLingDocs();
  if (!lingdocsLoaded) {
    console.log('⚠️  LingDocs not available, using pattern-based generation');
  }
  
  // Load verbs
  const verbData = await loadVerbsWithEntries();
  console.log(`📖 Processing ${verbData.length} verbs...\n`);
  
  const verbEntries: VerbEntry[] = [];
  
  for (const { root, entry } of verbData) {
    const hasStem = entry?.psp ? ' (has psp)' : '';
    console.log(`   Processing: ${root}${hasStem}`);
    const presentTense = await generatePresentTenseForms(root, entry);
    
    if (presentTense.length > 0) {
      verbEntries.push({
        root,
        presentTense,
      });
      
      const method = entry?.psp ? 'using dictionary stem' : 'inferred from pattern';
      console.log(`     ✅ Generated ${presentTense.length} present tense forms (${method})`);
      if (verbEntries.length <= 10) { // Only show details for first 10
        presentTense.forEach(f => {
          console.log(`        ${f.person} ${f.number}: ${f.form}${f.romanization ? ` (${f.romanization})` : ''}`);
        });
      }
    } else {
      console.log(`     ⚠️  No forms generated`);
    }
  }
  
  // Generate SQL
  console.log(`\n📝 Generating SQL...`);
  const sql = generateSQL(verbEntries);
  
  const sqlPath = join(process.cwd(), '.temp-present-tense-verbs.sql');
  require('fs').writeFileSync(sqlPath, sql, 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Verbs processed: ${verbEntries.length}`);
  console.log(`   Total forms: ${verbEntries.reduce((sum, v) => sum + v.presentTense.length, 0)}`);
  console.log(`\n🚀 To execute:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main().catch(console.error);


/**
 * Enrich D1 verb_forms table with perfective forms (و- prefix)
 * 
 * The LingDocs conjugation tables show that many Pashto verbs have both:
 * - Imperfective forms (present/continuous): وهم، وهې، وهي...
 * - Perfective forms (past/subjunctive): ووهم، ووهلم، ووهه...
 * 
 * D1 currently only has the imperfective forms. This script adds the perfective forms
 * that actually appear in the Bible text.
 */

import { execSync } from 'child_process';

// Perfective prefix patterns from LingDocs
const PERFECTIVE_PREFIX = 'و';  // Added to imperfective to make perfective

interface VerbFormEntry {
  base_verb: string;
  form: string;
  form_type: string;
  tense: string;
  person: string;
}

// Known verbs in the Bible with their perfective counterparts
const VERB_PERFECTIVE_MAPPINGS: Record<string, string[]> = {
  // وهل (wahul - to hit) - perfective forms
  'وهل': [
    // Perfective subjunctive (ووه-)
    { form: 'ووهم', form_type: 'subjunctive', tense: 'perfective', person: '1sg' },
    { form: 'ووهې', form_type: 'subjunctive', tense: 'perfective', person: '2sg' },
    { form: 'ووهي', form_type: 'subjunctive', tense: 'perfective', person: '3sg' },
    { form: 'ووهو', form_type: 'subjunctive', tense: 'perfective', person: '1pl' },
    { form: 'ووهئ', form_type: 'subjunctive', tense: 'perfective', person: '2pl' },
    { form: 'ووهي', form_type: 'subjunctive', tense: 'perfective', person: '3pl' },
    // Simple past (ووهل-)
    { form: 'ووهلم', form_type: 'past', tense: 'simple_past', person: '1sg' },
    { form: 'ووهلې', form_type: 'past', tense: 'simple_past', person: '2sg' },
    { form: 'ووهلو', form_type: 'past', tense: 'simple_past', person: '3sg_m' },
    { form: 'ووهله', form_type: 'past', tense: 'simple_past', person: '3sg_f' },
    { form: 'ووهلو', form_type: 'past', tense: 'simple_past', person: '1pl' },
    { form: 'ووهلئ', form_type: 'past', tense: 'simple_past', person: '2pl' },
    { form: 'ووهل', form_type: 'past', tense: 'simple_past', person: '3pl' },
    // Perfective imperative
    { form: 'ووهه', form_type: 'imperative', tense: 'perfective', person: '2sg' },
    // Perfective ability
    { form: 'ووهلی شم', form_type: 'ability', tense: 'perfective', person: '1sg' },
    { form: 'ووهلی شې', form_type: 'ability', tense: 'perfective', person: '2sg' },
    { form: 'ووهلی شي', form_type: 'ability', tense: 'perfective', person: '3sg' },
    { form: 'ووهلی شو', form_type: 'ability', tense: 'perfective', person: '1pl' },
    { form: 'ووهلی شئ', form_type: 'ability', tense: 'perfective', person: '2pl' },
    { form: 'ووهلی شي', form_type: 'ability', tense: 'perfective', person: '3pl' },
    { form: 'ووهلی شوم', form_type: 'ability', tense: 'perfective_past', person: '1sg' },
    { form: 'ووهلی شوې', form_type: 'ability', tense: 'perfective_past', person: '2sg' },
    { form: 'ووهلی شو', form_type: 'ability', tense: 'perfective_past', person: '3sg_m' },
    { form: 'ووهلی شوه', form_type: 'ability', tense: 'perfective_past', person: '3sg_f' },
    { form: 'ووهلی شو', form_type: 'ability', tense: 'perfective_past', person: '1pl' },
    { form: 'ووهلی شوئ', form_type: 'ability', tense: 'perfective_past', person: '2pl' },
    { form: 'ووهلی شول', form_type: 'ability', tense: 'perfective_past', person: '3pl' },
  ] as any[],
};

async function generatePerfectiveFormsFromExisting() {
  console.log('Generating perfective forms for existing verbs...\n');
  
  // Get unique base verbs from D1
  const cmd = `npx wrangler d1 execute pashto-bible-db --remote --command "SELECT DISTINCT base_verb FROM verb_forms LIMIT 100" --json`;
  
  try {
    const result = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    const parsed = JSON.parse(result);
    const verbs = parsed[0]?.results?.map((r: any) => r.base_verb).filter(Boolean) || [];
    
    console.log(`Found ${verbs.length} unique verbs in D1`);
    
    // For each verb, generate perfective forms if they start with imperfective
    const perfectives: VerbFormEntry[] = [];
    
    for (const verb of verbs) {
      // Get existing forms for this verb
      const formsCmd = `npx wrangler d1 execute pashto-bible-db --remote --command "SELECT form, form_type, person FROM verb_forms WHERE base_verb = '${verb}'" --json`;
      const formsResult = execSync(formsCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      const formsParsed = JSON.parse(formsResult);
      const existingForms = formsParsed[0]?.results || [];
      
      // Create a set of existing forms
      const existingFormSet = new Set(existingForms.map((f: any) => f.form));
      
      // Generate perfective forms by adding و- prefix
      for (const form of existingForms) {
        const perfectiveForm = PERFECTIVE_PREFIX + form.form;
        
        // Only add if not already exists
        if (!existingFormSet.has(perfectiveForm)) {
          perfectives.push({
            base_verb: verb,
            form: perfectiveForm,
            form_type: form.form_type === 'present' ? 'subjunctive' : form.form_type,
            tense: 'perfective',
            person: form.person,
          });
        }
      }
    }
    
    console.log(`\nGenerated ${perfectives.length} new perfective forms`);
    
    // Show sample
    console.log('\nSample perfective forms:');
    perfectives.slice(0, 20).forEach(f => {
      console.log(`  ${f.base_verb} -> ${f.form} (${f.form_type} ${f.person})`);
    });
    
    return perfectives;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function insertPerfectiveForms(forms: VerbFormEntry[]) {
  console.log(`\nInserting ${forms.length} perfective forms into D1...`);
  
  // Batch insert (max 100 at a time for D1)
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < forms.length; i += BATCH_SIZE) {
    const batch = forms.slice(i, i + BATCH_SIZE);
    
    const values = batch.map(f => 
      `('${f.base_verb}', '${f.form}', '${f.form_type}', '${f.tense}', '${f.person}')`
    ).join(',');
    
    const sql = `INSERT OR IGNORE INTO verb_forms (base_verb, form, form_type, tense, person) VALUES ${values}`;
    
    try {
      const cmd = `npx wrangler d1 execute pashto-bible-db --remote --command "${sql.replace(/"/g, '\\"')}"`;
      execSync(cmd, { encoding: 'utf-8' });
      console.log(`  Inserted batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(forms.length/BATCH_SIZE)}`);
    } catch (error) {
      console.error(`  Error inserting batch:`, error);
    }
  }
  
  console.log('Done!');
}

async function main() {
  console.log('=== Enrich D1 with Perfective Verb Forms ===\n');
  
  // First, manually add the known perfective forms for وهل
  console.log('Adding known perfective forms for وهل...');
  const wahulForms = VERB_PERFECTIVE_MAPPINGS['وهل'];
  
  if (wahulForms) {
    const fullForms = wahulForms.map((f: any) => ({
      ...f,
      base_verb: 'وهل'
    }));
    await insertPerfectiveForms(fullForms);
  }
  
  // Then generate for other verbs
  // const generatedForms = await generatePerfectiveFormsFromExisting();
  // await insertPerfectiveForms(generatedForms);
  
  console.log('\n=== Complete ===');
}

main().catch(console.error);


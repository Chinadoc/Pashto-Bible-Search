#!/usr/bin/env node
/**
 * Import inflected dictionary data into Cloudflare D1
 * Creates tables for:
 * 1. lingdocs_dictionary - base entries with inflection/conjugation JSON
 * 2. lingdocs_forms - reverse lookup from any form to base entry
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load inflected dictionary
const dictPath = path.join(__dirname, '../data/lingdocs-inflected.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log(`Processing ${dict.entries.length} dictionary entries...`);

// Generate forms lookup table
const formsLookup = [];

for (const entry of dict.entries) {
  // Add base form
  formsLookup.push({
    form: entry.pashto,
    base_ts: entry.ts,
    form_type: 'base',
    phonetics: entry.phonetics,
  });
  
  // Add inflected forms
  if (entry.inflections && entry.inflections.forms) {
    for (const form of entry.inflections.forms) {
      if (form.p && form.p !== entry.pashto) {
        formsLookup.push({
          form: form.p,
          base_ts: entry.ts,
          form_type: form.type,
          phonetics: form.f,
        });
      }
    }
  }
  
  // Add verb forms
  if (entry.verbInfo) {
    // Add present forms
    if (entry.verbInfo.presentForms) {
      for (const form of entry.verbInfo.presentForms) {
        formsLookup.push({
          form: form.p,
          base_ts: entry.ts,
          form_type: `present_${form.person}`,
          phonetics: form.f,
        });
      }
    }
    
    // Add imperfective stem
    if (entry.verbInfo.imperfectiveStem) {
      formsLookup.push({
        form: entry.verbInfo.imperfectiveStem.p,
        base_ts: entry.ts,
        form_type: 'imperfective_stem',
        phonetics: entry.verbInfo.imperfectiveStem.f,
      });
    }
    
    // Add past participle
    if (entry.verbInfo.pastParticiple) {
      formsLookup.push({
        form: entry.verbInfo.pastParticiple.p,
        base_ts: entry.ts,
        form_type: 'past_participle',
        phonetics: entry.verbInfo.pastParticiple.f,
      });
    }
  }
}

console.log(`Generated ${formsLookup.length} form lookups`);

// Generate SQL for forms lookup table
const createFormsTable = `
CREATE TABLE IF NOT EXISTS lingdocs_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form TEXT NOT NULL,
  base_ts INTEGER NOT NULL,
  form_type TEXT,
  phonetics TEXT,
  FOREIGN KEY (base_ts) REFERENCES lingdocs_dictionary(ts)
);
CREATE INDEX IF NOT EXISTS idx_lingdocs_forms_form ON lingdocs_forms(form);
CREATE INDEX IF NOT EXISTS idx_lingdocs_forms_base ON lingdocs_forms(base_ts);
`;

// Generate SQL for updating lingdocs_dictionary with inflection JSON
function escape(s) {
  if (!s) return '';
  return s.replace(/'/g, "''");
}

// Generate batch SQL files
const BATCH_SIZE = 200;
const sqlDir = '/tmp/inflections_sql';

try {
  fs.mkdirSync(sqlDir, { recursive: true });
} catch (e) {}

// Write create table SQL
fs.writeFileSync(path.join(sqlDir, '00_create_table.sql'), createFormsTable);
console.log('Generated create table SQL');

// Generate forms insert SQL in batches
for (let i = 0; i < formsLookup.length; i += BATCH_SIZE) {
  const batch = formsLookup.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;
  
  const values = batch.map(f => 
    `('${escape(f.form)}', ${f.base_ts}, '${escape(f.form_type)}', '${escape(f.phonetics)}')`
  ).join(',\n');
  
  const sql = `INSERT INTO lingdocs_forms (form, base_ts, form_type, phonetics) VALUES
${values};`;
  
  fs.writeFileSync(path.join(sqlDir, `forms_${String(batchNum).padStart(4, '0')}.sql`), sql);
}

console.log(`Generated ${Math.ceil(formsLookup.length / BATCH_SIZE)} forms batch SQL files`);

// Update dictionary entries with inflection JSON
const updateBatches = [];
for (const entry of dict.entries) {
  const inflectionData = entry.inflections || entry.verbInfo || null;
  if (inflectionData) {
    updateBatches.push({
      ts: entry.ts,
      inflection_info: JSON.stringify(inflectionData)
    });
  }
}

for (let i = 0; i < updateBatches.length; i += BATCH_SIZE) {
  const batch = updateBatches.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE) + 1;
  
  const updates = batch.map(b => 
    `UPDATE lingdocs_dictionary SET inflection_info = '${escape(b.inflection_info)}' WHERE ts = ${b.ts};`
  ).join('\n');
  
  fs.writeFileSync(path.join(sqlDir, `update_${String(batchNum).padStart(4, '0')}.sql`), updates);
}

console.log(`Generated ${Math.ceil(updateBatches.length / BATCH_SIZE)} update batch SQL files`);

console.log(`\nSQL files generated in ${sqlDir}`);
console.log('\nTo import, run from cloudflare directory:');
console.log(`
for f in ${sqlDir}/*.sql; do
  echo "Importing $f..."
  npx wrangler d1 execute pashto-bible-db --remote --file="$f"
done
`);


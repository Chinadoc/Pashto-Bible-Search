/**
 * Simple SQL Generator for Inflections Migration
 * 
 * Generates SQL file that can be executed with wrangler d1 execute
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface InflectionEntry {
  form: string;
  romanization?: string;
  category?: string;
  label?: string;
  pos?: string;
  frequency?: number;
}

type InflectionsCache = Record<string, InflectionEntry[]>;

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function main() {
  const cachePath = join(process.cwd(), 'app/data/inflections_cache.json');
  const sqlPath = join(process.cwd(), '.temp-inflections-migration.sql');
  
  console.log('📖 Loading inflections cache...');
  const cacheContent = readFileSync(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  console.log(`✅ Loaded ${Object.keys(cache).length} base words`);
  
  const sql: string[] = [];
  sql.push('-- Inflections Migration');
  sql.push('-- Generated from inflections_cache.json');
  sql.push('');
  sql.push('BEGIN TRANSACTION;');
  sql.push('');
  
  let totalInflections = 0;
  const batchSize = 5000;
  
  for (const [baseWord, inflections] of Object.entries(cache)) {
    if (!Array.isArray(inflections) || inflections.length === 0) continue;
    
    for (const inflection of inflections) {
      if (!inflection.form || inflection.form === baseWord) continue;
      
      totalInflections++;
      
      const grammaticalInfo = JSON.stringify({
        category: inflection.category || 'unknown',
        label: inflection.label || inflection.category || 'unknown',
        pos: inflection.pos || inflection.category || 'unknown',
        romanization: inflection.romanization || null,
      });
      
      const examples = inflection.romanization 
        ? JSON.stringify([{ romanization: inflection.romanization }])
        : null;
      
      sql.push(`INSERT OR IGNORE INTO inflections (base_word, inflected_form, grammatical_info, frequency, examples)`);
      sql.push(`VALUES ('${escapeSql(baseWord)}', '${escapeSql(inflection.form)}', '${escapeSql(grammaticalInfo)}', ${inflection.frequency || 0}, ${examples ? `'${escapeSql(examples)}'` : 'NULL'});`);
      
      sql.push(`INSERT OR IGNORE INTO form_to_root (word_form, root_word, frequency)`);
      sql.push(`VALUES ('${escapeSql(inflection.form)}', '${escapeSql(baseWord)}', ${inflection.frequency || 0});`);
      
      if (totalInflections % batchSize === 0) {
        sql.push('');
        sql.push('COMMIT;');
        sql.push('BEGIN TRANSACTION;');
        sql.push('');
        console.log(`   Prepared ${totalInflections.toLocaleString()} inflections...`);
      }
    }
  }
  
  sql.push('');
  sql.push('COMMIT;');
  
  console.log(`\n📝 Writing SQL file...`);
  writeFileSync(sqlPath, sql.join('\n'), 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Base words: ${Object.keys(cache).length.toLocaleString()}`);
  console.log(`   Total inflections: ${totalInflections.toLocaleString()}`);
  console.log(`\n🚀 To execute migration:`);
  console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlPath}`);
}

main();



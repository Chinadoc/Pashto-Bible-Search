/**
 * Generate SQL to populate inflections table
 * 
 * Reads app/data/inflections_cache.json and generates SQL INSERT statements
 * to populate the inflections table in D1.
 * 
 * Usage: npx tsx cloudflare/generate-inflections-sql.ts > cloudflare/populate-inflections.sql
 */

import { readFileSync } from 'fs';
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

function generateInflectionsSQL(): string {
  const cachePath = join(process.cwd(), 'app/data/inflections_cache.json');
  // Use stderr for logging, stdout will be pure SQL
  process.stderr.write(`📖 Loading inflections cache from: ${cachePath}\n`);
  
  const cacheContent = readFileSync(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  process.stderr.write(`✅ Loaded ${Object.keys(cache).length} base words\n`);
  
  const sql: string[] = [];
  sql.push('-- Populate inflections table from inflections_cache.json');
  sql.push('-- Generated automatically - do not edit manually');
  sql.push('');
  // Note: D1 handles transactions automatically, no BEGIN/COMMIT needed
  
  let totalInflections = 0;
  let batchCount = 0;
  const batchSize = 500;
  
  for (const [baseWord, inflections] of Object.entries(cache)) {
    if (!Array.isArray(inflections) || inflections.length === 0) continue;
    
    for (const inflection of inflections) {
      if (!inflection.form || inflection.form === baseWord) continue;
      
      const base = escapeSql(baseWord);
      const form = escapeSql(inflection.form);
      const grammaticalInfo = JSON.stringify({
        category: inflection.category || 'unknown',
        label: inflection.label || inflection.category || 'unknown',
        pos: inflection.pos || inflection.category || 'unknown',
        romanization: inflection.romanization || null,
      }).replace(/'/g, "''");
      
      const frequency = inflection.frequency || 0;
      const examples = inflection.romanization 
        ? JSON.stringify([{ romanization: inflection.romanization }]).replace(/'/g, "''")
        : '[]';
      
      sql.push(`INSERT OR IGNORE INTO inflections (base_word, inflected_form, grammatical_info, frequency, examples)`);
      sql.push(`VALUES ('${base}', '${form}', '${grammaticalInfo}', ${frequency}, '${examples}');`);
      
      totalInflections++;
      
      // Progress indicator
      if (totalInflections % batchSize === 0) {
        batchCount++;
        sql.push(`-- Batch ${batchCount}: ${totalInflections} inflections inserted`);
      }
    }
  }
  
  sql.push('');
  sql.push('-- Populate form_to_root table from inflections');
  sql.push('INSERT OR IGNORE INTO form_to_root (word_form, root_word, frequency)');
  sql.push('SELECT inflected_form, base_word, frequency');
  sql.push('FROM inflections');
  sql.push('WHERE inflected_form != base_word;');
  sql.push('');
  
  sql.push(`-- Total inflections: ${totalInflections}`);
  sql.push(`-- Total base words: ${Object.keys(cache).length}`);
  
  process.stderr.write(`\n✅ Generated SQL for ${totalInflections.toLocaleString()} inflections\n`);
  process.stderr.write(`   From ${Object.keys(cache).length.toLocaleString()} base words\n`);
  
  return sql.join('\n');
}

// Generate and output SQL (stdout only, no console.log)
const sql = generateInflectionsSQL();
process.stdout.write(sql);

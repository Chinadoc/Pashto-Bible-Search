#!/usr/bin/env node
/**
 * Run Inflections Migration
 * 
 * This script migrates inflections_cache.json to D1
 * Run with: npm run migrate:inflections
 * Or: node cloudflare/run-inflections-migration.js
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface InflectionEntry {
  form: string;
  romanization?: string;
  category?: string;
  label?: string;
  pos?: string;
  frequency?: number;
}

type InflectionsCache = Record<string, InflectionEntry[]>;

async function runMigration() {
  console.log('🚀 Starting Inflections Migration to D1\n');
  
  const cachePath = join(process.cwd(), 'app/data/inflections_cache.json');
  
  console.log('📖 Loading inflections cache...');
  const cacheContent = readFileSync(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  console.log(`✅ Loaded ${Object.keys(cache).length} base words`);
  
  // Create SQL file for batch insert
  const sqlFile = join(process.cwd(), '.temp-inflections-migration.sql');
  const sql: string[] = [];
  
  sql.push('BEGIN TRANSACTION;');
  
  let totalInflections = 0;
  const batchSize = 1000;
  let batchCount = 0;
  
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
      }).replace(/'/g, "''");
      
      const examples = inflection.romanization 
        ? JSON.stringify([{ romanization: inflection.romanization }]).replace(/'/g, "''")
        : 'NULL';
      
      sql.push(`
        INSERT OR IGNORE INTO inflections (
          base_word,
          inflected_form,
          grammatical_info,
          frequency,
          examples
        ) VALUES (
          '${baseWord.replace(/'/g, "''")}',
          '${inflection.form.replace(/'/g, "''")}',
          '${grammaticalInfo}',
          ${inflection.frequency || 0},
          ${examples === 'NULL' ? 'NULL' : `'${examples}'`}
        );
      `);
      
      // Also populate form_to_root
      sql.push(`
        INSERT OR IGNORE INTO form_to_root (
          word_form,
          root_word,
          frequency
        ) VALUES (
          '${inflection.form.replace(/'/g, "''")}',
          '${baseWord.replace(/'/g, "''")}',
          ${inflection.frequency || 0}
        );
      `);
      
      // Commit in batches to avoid memory issues
      if (totalInflections % batchSize === 0) {
        sql.push('COMMIT;');
        sql.push('BEGIN TRANSACTION;');
        batchCount++;
        console.log(`   Prepared batch ${batchCount} (${totalInflections} inflections)...`);
      }
    }
    
    if (totalInflections % 10000 === 0) {
      console.log(`   Processed ${totalInflections.toLocaleString()} inflections...`);
    }
  }
  
  sql.push('COMMIT;');
  
  console.log(`\n📝 Writing SQL file with ${totalInflections.toLocaleString()} inflections...`);
  require('fs').writeFileSync(sqlFile, sql.join('\n'), 'utf-8');
  
  console.log(`✅ SQL file created: ${sqlFile}`);
  console.log(`\n📊 Statistics:`);
  console.log(`   Base words: ${Object.keys(cache).length.toLocaleString()}`);
  console.log(`   Total inflections: ${totalInflections.toLocaleString()}`);
  console.log(`   Batches: ${batchCount + 1}`);
  
  console.log(`\n🚀 Executing migration...`);
  console.log(`   Run: wrangler d1 execute pashto-bible-db --remote --file=${sqlFile}`);
  
  // Ask user if they want to execute now
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nExecute migration now? (y/n): ', (answer: string) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\n⏳ Executing migration (this may take a while)...\n');
      try {
        execSync(`wrangler d1 execute pashto-bible-db --remote --file=${sqlFile}`, {
          stdio: 'inherit',
          cwd: process.cwd()
        });
        console.log('\n✅ Migration completed successfully!');
      } catch (error) {
        console.error('\n❌ Migration failed:', error);
      }
    } else {
      console.log('\n📝 SQL file saved. Run manually with:');
      console.log(`   wrangler d1 execute pashto-bible-db --remote --file=${sqlFile}`);
    }
    rl.close();
  });
}

runMigration().catch(console.error);


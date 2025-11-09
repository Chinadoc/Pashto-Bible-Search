/**
 * Migrate Inflections Cache to D1
 * 
 * Populates D1 inflections table from app/data/inflections_cache.json
 * Also populates form_to_root mapping table for reverse lookups
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

interface MigrationStats {
  baseWords: number;
  totalInflections: number;
  uniqueForms: number;
  errors: number;
}

async function migrateInflectionsToD1(
  db: D1Database,
  cachePath: string = join(process.cwd(), 'app/data/inflections_cache.json')
): Promise<MigrationStats> {
  console.log('📖 Loading inflections cache...');
  const cacheContent = readFileSync(cachePath, 'utf-8');
  const cache: InflectionsCache = JSON.parse(cacheContent);
  
  console.log(`✅ Loaded ${Object.keys(cache).length} base words`);
  
  const stats: MigrationStats = {
    baseWords: 0,
    totalInflections: 0,
    uniqueForms: 0,
    errors: 0,
  };
  
  const uniqueFormsSet = new Set<string>();
  const batchSize = 1000;
  let batch: Array<{ base: string; form: string; entry: InflectionEntry }> = [];
  
  // Process all base words and their inflections
  for (const [baseWord, inflections] of Object.entries(cache)) {
    if (!Array.isArray(inflections) || inflections.length === 0) continue;
    
    stats.baseWords++;
    
    for (const inflection of inflections) {
      if (!inflection.form || inflection.form === baseWord) continue;
      
      stats.totalInflections++;
      uniqueFormsSet.add(inflection.form);
      
      batch.push({
        base: baseWord,
        form: inflection.form,
        entry: inflection,
      });
      
      // Insert in batches
      if (batch.length >= batchSize) {
        await insertBatch(db, batch, stats);
        batch = [];
      }
    }
    
    // Progress indicator
    if (stats.baseWords % 1000 === 0) {
      console.log(`   Processed ${stats.baseWords} base words, ${stats.totalInflections} inflections`);
    }
  }
  
  // Insert remaining batch
  if (batch.length > 0) {
    await insertBatch(db, batch, stats);
  }
  
  stats.uniqueForms = uniqueFormsSet.size;
  
  console.log(`\n✅ Migration complete:`);
  console.log(`   Base words: ${stats.baseWords.toLocaleString()}`);
  console.log(`   Total inflections: ${stats.totalInflections.toLocaleString()}`);
  console.log(`   Unique forms: ${stats.uniqueForms.toLocaleString()}`);
  console.log(`   Errors: ${stats.errors}`);
  
  return stats;
}

async function insertBatch(
  db: D1Database,
  batch: Array<{ base: string; form: string; entry: InflectionEntry }>,
  stats: MigrationStats
): Promise<void> {
  const inflectionsStmt = db.prepare(`
    INSERT OR IGNORE INTO inflections (
      base_word,
      inflected_form,
      grammatical_info,
      frequency,
      examples
    ) VALUES (?, ?, ?, ?, ?)
  `);
  
  const formToRootStmt = db.prepare(`
    INSERT OR IGNORE INTO form_to_root (
      word_form,
      root_word,
      frequency
    ) VALUES (?, ?, ?)
  `);
  
  const stmts: D1PreparedStatement[] = [];
  
  for (const { base, form, entry } of batch) {
    const grammaticalInfo = JSON.stringify({
      category: entry.category || 'unknown',
      label: entry.label || entry.category || 'unknown',
      pos: entry.pos || entry.category || 'unknown',
      romanization: entry.romanization || null,
    });
    
    const examples = entry.romanization ? JSON.stringify([{ romanization: entry.romanization }]) : null;
    
    stmts.push(
      inflectionsStmt.bind(
        base,
        form,
        grammaticalInfo,
        entry.frequency || 0,
        examples
      )
    );
    
    stmts.push(
      formToRootStmt.bind(
        form,
        base,
        entry.frequency || 0
      )
    );
  }
  
  try {
    await db.batch(stmts);
  } catch (error) {
    console.error(`   Error inserting batch:`, error);
    stats.errors += batch.length;
  }
}

async function populateFormToRootMapping(db: D1Database): Promise<void> {
  console.log('\n🔗 Populating form_to_root mapping from inflections...');
  
  const result = await db.prepare(`
    INSERT OR IGNORE INTO form_to_root (word_form, root_word, frequency)
    SELECT inflected_form, base_word, frequency
    FROM inflections
    WHERE inflected_form != base_word
  `).run();
  
  console.log(`✅ Populated ${result.meta.changes} form-to-root mappings`);
}

export async function runMigration(env: { DB: D1Database }) {
  console.log('🚀 Starting Inflections Migration to D1\n');
  
  try {
    const stats = await migrateInflectionsToD1(env.DB);
    await populateFormToRootMapping(env.DB);
    
    console.log('\n✅ Migration completed successfully!');
    return stats;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}










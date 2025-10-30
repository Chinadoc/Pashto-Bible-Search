/**
 * Migration script to export data from Supabase and import to Cloudflare D1
 * 
 * Usage:
 * 1. Set environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npx tsx cloudflare/migrate-supabase-to-d1.ts
 */

import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Verse {
  id: number;
  ref: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  text_normalized?: string;
  testament: 'OT' | 'NT';
  translation_key: string;
  dialect?: string;
  audio_storage_path?: string;
  audio_public_url?: string;
  audio_url?: string;
  audio_r2_key?: string;
  tags?: any;
  created_at: string;
  updated_at: string;
}

interface WordOccurrence {
  id: number;
  word: string;
  translation_key: string;
  frequency: number;
  verse_refs: string[];
  tf_idf_scores?: number[];
  primary_verse_ref?: string;
}

/**
 * Convert ISO timestamp to Unix timestamp (for SQLite)
 */
function toUnixTimestamp(isoString: string | null | undefined): number | null {
  if (!isoString) return null;
  return Math.floor(new Date(isoString).getTime() / 1000);
}

/**
 * Escape SQL string for SQLite
 */
function escapeSql(str: string | null | undefined): string {
  if (!str) return "''";
  return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Export verses from Supabase
 */
async function exportVerses(table: 'verses' | 'verses_yousafzai'): Promise<Verse[]> {
  // Try multiple approaches:
  // 1. Named views/tables: 'Afghan 2023 Verses', 'Yousafzai Verses'
  // 2. Raw table names: 'verses', 'verses_yousafzai'
  // 3. Single table with translation filter: 'verses' with translation column
  
  if (table === 'verses_yousafzai') {
    // Try named view first
    console.log(`📖 Trying: Yousafzai Verses...`);
    let { data, error } = await supabase
      .from('Yousafzai Verses')
      .select('*')
      .order('id')
      .limit(1);
    
    if (!error && data) {
      console.log(`✅ Found: Yousafzai Verses, exporting all data...`);
      const { data: allData, error: allError } = await supabase
        .from('Yousafzai Verses')
        .select('*')
        .order('id');
      
      if (allError) throw new Error(`Failed: ${allError.message}`);
      console.log(`✅ Exported ${allData?.length || 0} verses`);
      return allData || [];
    }
    
    // Try verses table with translation filter
    console.log(`📖 Trying: verses table with translation filter...`);
    const { data: filteredData, error: filteredError } = await supabase
      .from('verses')
      .select('*')
      .eq('translation_key', 'yousafzai2019')
      .order('id')
      .limit(1);
    
    if (!filteredError && filteredData) {
      console.log(`✅ Found: verses table with translation filter, exporting all data...`);
      const { data: allData, error: allError } = await supabase
        .from('verses')
        .select('*')
        .eq('translation_key', 'yousafzai2019')
        .order('id');
      
      if (allError) throw new Error(`Failed: ${allError.message}`);
      console.log(`✅ Exported ${allData?.length || 0} verses`);
      return allData || [];
    }
    
    throw new Error(`Failed to find Yousafzai verses. Tried: 'Yousafzai Verses', 'verses' with translation filter`);
  } else {
    // Afghan 2023 - try named view first
    console.log(`📖 Trying: Afghan 2023 Verses...`);
    const { data, error } = await supabase
      .from('Afghan 2023 Verses')
      .select('*')
      .order('id')
      .limit(1);
    
    if (!error && data) {
      console.log(`✅ Found: Afghan 2023 Verses, exporting all data (paginated)...`);
      
      // Get all data with pagination (Supabase default limit is 1000)
      const allVerses: Verse[] = [];
      let page = 0;
      const pageSize = 1000;
      
      while (true) {
        const { data: pageData, error: pageError } = await supabase
          .from('Afghan 2023 Verses')
          .select('*')
          .order('id')
          .range(page * pageSize, (page + 1) * pageSize - 1);
        
        if (pageError) throw new Error(`Failed: ${pageError.message}`);
        if (!pageData || pageData.length === 0) break;
        
        allVerses.push(...pageData);
        console.log(`   Loaded ${allVerses.length} verses so far...`);
        
        if (pageData.length < pageSize) break; // Last page
        page++;
      }
      
      console.log(`✅ Exported ${allVerses.length} verses total`);
      return allVerses;
    }
    
    throw new Error(`Failed to find Afghan 2023 verses. Tried: 'Afghan 2023 Verses'`);
  }
}

/**
 * Export word occurrences from Supabase
 */
async function exportWordOccurrences(): Promise<WordOccurrence[]> {
  console.log('📊 Exporting word_occurrence_index...');
  
  const { data, error } = await supabase
    .from('word_occurrence_index')
    .select('*')
    .order('id');

  if (error) {
    throw new Error(`Failed to export word_occurrence_index: ${error.message}`);
  }

  console.log(`✅ Exported ${data?.length || 0} word occurrences`);
  return data || [];
}

/**
 * Generate SQL INSERT statements for verses
 */
function generateVerseInserts(verses: Verse[], table: 'verses' | 'verses_yousafzai'): string {
  const chunks: string[] = [];
  
  // Process in batches of 500
  for (let i = 0; i < verses.length; i += 500) {
    const batch = verses.slice(i, i + 500);
    const values = batch.map(v => {
      const audioR2Key = v.audio_r2_key || v.audio_storage_path || null;
      const tagsJson = v.tags ? JSON.stringify(v.tags) : '[]';
      
      return `(${v.id}, ${escapeSql(v.ref)}, ${escapeSql(v.book)}, ${v.chapter}, ${v.verse}, ${escapeSql(v.text)}, ${escapeSql(v.text_normalized)}, ${escapeSql(v.testament)}, ${escapeSql(v.translation_key)}, ${escapeSql(v.dialect)}, ${escapeSql(audioR2Key)}, ${escapeSql(v.audio_public_url)}, ${toUnixTimestamp(v.created_at) || 'NULL'}, ${toUnixTimestamp(v.updated_at) || 'NULL'}${table === 'verses_yousafzai' ? `, ${escapeSql(tagsJson)}` : ''})`;
    });
    
    const columns = table === 'verses_yousafzai' 
      ? '(id, ref, book, chapter, verse, text, text_normalized, testament, translation_key, dialect, audio_r2_key, audio_public_url, created_at, updated_at, tags)'
      : '(id, ref, book, chapter, verse, text, text_normalized, testament, translation_key, dialect, audio_r2_key, audio_public_url, created_at, updated_at)';
    
    chunks.push(`INSERT INTO ${table} ${columns} VALUES\n${values.join(',\n')};`);
  }
  
  return chunks.join('\n\n');
}

/**
 * Generate SQL INSERT statements for word occurrences
 */
function generateWordOccurrenceInserts(occurrences: WordOccurrence[]): string {
  const chunks: string[] = [];
  
  for (let i = 0; i < occurrences.length; i += 500) {
    const batch = occurrences.slice(i, i + 500);
    const values = batch.map(occ => {
      const verseRefsJson = JSON.stringify(occ.verse_refs);
      const tfIdfJson = occ.tf_idf_scores ? JSON.stringify(occ.tf_idf_scores) : '[]';
      
      return `(${occ.id}, ${escapeSql(occ.word)}, ${escapeSql(occ.translation_key)}, ${occ.frequency}, ${escapeSql(verseRefsJson)}, ${escapeSql(tfIdfJson)}, ${escapeSql(occ.primary_verse_ref)}, ${toUnixTimestamp(new Date().toISOString()) || 'NULL'}, ${toUnixTimestamp(new Date().toISOString()) || 'NULL'})`;
    });
    
    chunks.push(`INSERT INTO word_occurrence_index (id, word, translation_key, frequency, verse_refs, tf_idf_scores, primary_verse_ref, created_at, updated_at) VALUES\n${values.join(',\n')};`);
  }
  
  return chunks.join('\n\n');
}

/**
 * Execute SQL file against D1 database
 */
async function executeD1Sql(sql: string, databaseName: string = 'pashto-bible-db'): Promise<void> {
  console.log('🔧 Executing SQL against D1...');
  
  // Write SQL to temp file
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), '.temp-d1-migration.sql');
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    // Execute using wrangler d1 execute with --remote flag
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute ${databaseName} --remote --file=${tempFile}`
    );
    
    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('warning')) console.error(stderr);
    
    console.log('✅ SQL executed successfully');
  } catch (error: any) {
    console.error(`❌ Failed to execute SQL: ${error.message}`);
    throw error;
  } finally {
    // Clean up temp file
    await fs.unlink(tempFile).catch(() => {});
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration from Supabase to Cloudflare D1...\n');
  
  try {
    // Export data
    const versesAfghan = await exportVerses('verses');
    
    // Try to export Yousafzai, but don't fail if it doesn't exist
    let versesYousafzai: Verse[] = [];
    try {
      versesYousafzai = await exportVerses('verses_yousafzai');
    } catch (error: any) {
      console.warn(`⚠️  Could not export Yousafzai verses: ${error.message}`);
      console.warn(`   This is OK - Yousafzai may be stored separately or not in Supabase`);
    }
    
    // Try to export word occurrences (may not exist)
    let wordOccurrences: WordOccurrence[] = [];
    try {
      wordOccurrences = await exportWordOccurrences();
    } catch (error: any) {
      console.warn(`⚠️  Could not export word occurrences: ${error.message}`);
      console.warn(`   Continuing without word occurrences...`);
    }
    
    // Generate SQL
    console.log('\n📝 Generating SQL INSERT statements...');
    const versesAfghanSql = generateVerseInserts(versesAfghan, 'verses');
    const versesYousafzaiSql = generateVerseInserts(versesYousafzai, 'verses_yousafzai');
    const wordOccurrencesSql = generateWordOccurrenceInserts(wordOccurrences);
    
    // Split into smaller chunks for D1 (SQLite has transaction size limits)
    const fs = await import('fs/promises');
    const batchSize = 100; // Insert 100 rows per file (D1 has strict limits)
    
    // Split Afghan verses into batches
    const afghanBatches: string[] = [];
    for (let i = 0; i < versesAfghan.length; i += batchSize) {
      const batch = versesAfghan.slice(i, i + batchSize);
      const batchSql = generateVerseInserts(batch, 'verses');
      afghanBatches.push(batchSql);
    }
    
    // Create multiple SQL files
    const sqlFiles: string[] = [];
    
    // File 1: Schema info + first batch
    const firstFile = [
      '-- Migration from Supabase to Cloudflare D1',
      '-- Generated automatically',
      '-- Part 1 of many',
      '',
      '-- Afghan 2023 verses (batch 1)',
      afghanBatches[0] || '',
    ].join('\n');
    
    await fs.writeFile('cloudflare/d1-migration-data-part1.sql', firstFile, 'utf-8');
    sqlFiles.push('cloudflare/d1-migration-data-part1.sql');
    
    // Remaining batches
    for (let i = 1; i < afghanBatches.length; i++) {
      const batchFile = [
        `-- Migration part ${i + 1}`,
        `-- Afghan 2023 verses (batch ${i + 1})`,
        afghanBatches[i],
      ].join('\n');
      
      const filename = `cloudflare/d1-migration-data-part${i + 1}.sql`;
      await fs.writeFile(filename, batchFile, 'utf-8');
      sqlFiles.push(filename);
    }
    
    // Yousafzai batches (if any)
    if (versesYousafzai.length > 0) {
      const yousafzaiBatches: string[] = [];
      for (let i = 0; i < versesYousafzai.length; i += batchSize) {
        const batch = versesYousafzai.slice(i, i + batchSize);
        const batchSql = generateVerseInserts(batch, 'verses_yousafzai');
        yousafzaiBatches.push(batchSql);
      }
      
      for (let i = 0; i < yousafzaiBatches.length; i++) {
        const filename = `cloudflare/d1-migration-data-yousafzai-part${i + 1}.sql`;
        await fs.writeFile(filename, [
          `-- Yousafzai 2019 verses (batch ${i + 1})`,
          yousafzaiBatches[i],
        ].join('\n'), 'utf-8');
        sqlFiles.push(filename);
      }
    }
    
    console.log(`✅ Generated ${sqlFiles.length} SQL files:`);
    sqlFiles.forEach(f => console.log(`   - ${f}`));
    
    // Optionally execute immediately
    const executeNow = process.env.EXECUTE_NOW === 'true';
    if (executeNow) {
      console.log('\n🚀 Executing migrations...');
      for (const file of sqlFiles) {
        console.log(`   Executing ${file}...`);
        await executeD1Sql(await fs.readFile(file, 'utf-8'));
      }
      console.log('✅ All migrations executed!');
    } else {
      console.log('\n💡 To execute these migrations, run:');
      sqlFiles.forEach(f => {
        console.log(`   npx wrangler d1 execute pashto-bible-db --remote --file=${f}`);
      });
      console.log('\n   Or set EXECUTE_NOW=true to execute automatically');
    }
    
    console.log('\n✅ Migration script completed!');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrate();



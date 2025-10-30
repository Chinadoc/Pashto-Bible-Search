/**
 * Migration script to import data from LOCAL JSON files to Cloudflare D1
 * Much faster than exporting from Supabase!
 * 
 * Usage:
 * 1. Set environment variables: (none needed, uses local files)
 * 2. Run: npx tsx cloudflare/migrate-from-local-files.ts
 */

import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface YousafzaiVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  text_html?: string;
  translation?: string;
  dialect?: string;
  book_slug?: string;
  tags?: any;
  audio_verse_url?: string;
  audio_storage_filename?: string;
}

interface AfghanVerse {
  ref: string;
  text: string;
  chapter?: number;
  verse?: number;
  book?: string;
}

/**
 * Parse reference string (e.g., "1 Chronicles 1:1") into parts
 */
function parseRef(ref: string): { book: string; chapter: number; verse: number } | null {
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verse: parseInt(match[3], 10),
  };
}

/**
 * Determine testament from book name
 */
function getTestament(book: string): 'OT' | 'NT' {
  const ntBooks = new Set([
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ]);
  return ntBooks.has(book) ? 'NT' : 'OT';
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
 * Generate verse reference string
 */
function generateRef(book: string, chapter: number, verse: number): string {
  return `${book} ${chapter}:${verse}`;
}

/**
 * Load Yousafzai verses from local JSON
 */
function loadYousafzaiVerses(): YousafzaiVerse[] {
  console.log('📖 Loading Yousafzai verses from local file...');
  
  const filePath = 'yousafzai_all_verses.json';
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  if (!Array.isArray(data)) {
    throw new Error('Yousafzai file should be an array');
  }
  
  console.log(`✅ Loaded ${data.length} Yousafzai verses`);
  return data;
}

/**
 * Load Afghan 2023 verses from local JSON
 * Tries multiple sources to get the most complete dataset
 */
function loadAfghanVerses(): AfghanVerse[] {
  // Try compressed cache first (most complete)
  const cachePath = 'cache/verses.json.gz';
  try {
    const zlib = require('zlib');
    console.log('📖 Loading Afghan 2023 verses from compressed cache...');
    const compressed = readFileSync(cachePath);
    const decompressed = zlib.gunzipSync(compressed);
    const data = JSON.parse(decompressed.toString('utf-8'));
    
    // Handle both array and object formats
    let verses: AfghanVerse[] = [];
    if (Array.isArray(data)) {
      verses = data;
    } else if (typeof data === 'object') {
      // Object format: { "ref": { ref, text, ... } } or { "ref": "text" }
      verses = Object.entries(data).map(([ref, value]) => {
        if (typeof value === 'string') {
          // Simple format: { "ref": "text" }
          return { ref, text: value };
        } else if (typeof value === 'object' && value !== null) {
          // Complex format: { "ref": { ref, text, chapter, verse, ... } }
          const v = value as any;
          // Extract book from ref if not present
          const parsed = parseRef(v.ref || ref);
          return {
            ref: v.ref || ref,
            text: v.text || '',
            chapter: v.chapter || parsed?.chapter || 0,
            verse: v.verse || parsed?.verse || 0,
            book: v.book || parsed?.book || '',
          };
        }
        return { ref, text: String(value || '') };
      });
    }
    
    console.log(`✅ Loaded ${verses.length} Afghan 2023 verses from cache`);
    return verses;
  } catch (error: any) {
    console.warn(`⚠️  Could not load from cache: ${error.message}`);
    console.log('📖 Trying public/assets/pashto_bible.json...');
    
    // Fallback to public file
    const filePath = 'public/assets/pashto_bible.json';
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    
    if (!Array.isArray(data)) {
      throw new Error('Afghan file should be an array');
    }
    
    console.log(`✅ Loaded ${data.length} Afghan 2023 verses from public file`);
    return data;
  }
}

/**
 * Generate SQL INSERT statements for verses
 */
function generateVerseInserts(
  verses: (YousafzaiVerse | { ref: string; text: string; chapter?: number; verse?: number; book?: string })[],
  table: 'verses' | 'verses_yousafzai',
  startId: number = 1
): { sql: string; nextId: number } {
  const chunks: string[] = [];
  let currentId = startId;
  
  // Process in batches of 100 (D1 limit)
  for (let i = 0; i < verses.length; i += 100) {
    const batch = verses.slice(i, i + 100);
    const values = batch.map(v => {
      let book: string;
      let chapter: number;
      let verse: number;
      let text: string;
      let ref: string;
      let textHtml: string | null = null;
      let tags: string = '[]';
      let audioR2Key: string | null = null;
      let audioPublicUrl: string | null = null;
      
      if ('book' in v && 'chapter' in v && 'verse' in v) {
        // Yousafzai format
        book = v.book;
        chapter = v.chapter;
        verse = v.verse;
        text = String(v.text || ''); // Ensure string
        ref = generateRef(book, chapter, verse);
        textHtml = v.text_html || null;
        tags = v.tags ? JSON.stringify(v.tags) : '[]';
        audioR2Key = v.audio_storage_filename ? `yousafzai/${v.testament || 'OT'}/${v.audio_storage_filename}` : null;
        audioPublicUrl = v.audio_verse_url || null;
      } else {
        // Afghan format - may have parsed data already or just ref/text
        if ('book' in v && v.book && 'chapter' in v && v.chapter && 'verse' in v && v.verse) {
          // Already parsed from cache file
          book = String(v.book);
          chapter = Number(v.chapter);
          verse = Number(v.verse);
          text = String(v.text || '');
          ref = v.ref || generateRef(book, chapter, verse);
        } else {
          // Need to parse ref
          const parsed = parseRef(v.ref);
          if (!parsed) {
            throw new Error(`Cannot parse ref: ${v.ref}`);
          }
          book = parsed.book;
          chapter = parsed.chapter;
          verse = parsed.verse;
          text = typeof v.text === 'string' ? v.text : String(v.text || '');
          ref = v.ref;
        }
      }
      
      const testament = getTestament(book);
      const translationKey = table === 'verses_yousafzai' ? 'yousafzai2019' : 'afghan2023';
      const dialect = table === 'verses_yousafzai' ? 'yousafzai' : 'afghan';
      
      // Generate audio R2 key for Afghan if not set
      if (table === 'verses' && !audioR2Key) {
        const bookSlug = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        audioR2Key = `afghan2023/${testament.toLowerCase()}/${bookSlug}${chapter}_verse_${verse}.mp3`;
      }
      
      const id = currentId++;
      const createdAt = Math.floor(Date.now() / 1000);
      
      if (table === 'verses_yousafzai') {
        return `(${id}, ${escapeSql(ref)}, ${escapeSql(book)}, ${chapter}, ${verse}, ${escapeSql(text)}, ${escapeSql(null)}, ${escapeSql(testament)}, ${escapeSql(translationKey)}, ${escapeSql(dialect)}, ${escapeSql(audioR2Key)}, ${escapeSql(audioPublicUrl)}, ${createdAt}, ${createdAt}, ${escapeSql(tags)})`;
      } else {
        return `(${id}, ${escapeSql(ref)}, ${escapeSql(book)}, ${chapter}, ${verse}, ${escapeSql(text)}, ${escapeSql(null)}, ${escapeSql(testament)}, ${escapeSql(translationKey)}, ${escapeSql(dialect)}, ${escapeSql(audioR2Key)}, ${escapeSql(audioPublicUrl)}, ${createdAt}, ${createdAt})`;
      }
    });
    
    const columns = table === 'verses_yousafzai' 
      ? '(id, ref, book, chapter, verse, text, text_normalized, testament, translation_key, dialect, audio_r2_key, audio_public_url, created_at, updated_at, tags)'
      : '(id, ref, book, chapter, verse, text, text_normalized, testament, translation_key, dialect, audio_r2_key, audio_public_url, created_at, updated_at)';
    
    chunks.push(`INSERT INTO ${table} ${columns} VALUES\n${values.join(',\n')};`);
  }
  
  return { sql: chunks.join('\n\n'), nextId: currentId };
}

/**
 * Execute SQL file against D1 database
 */
async function executeD1Sql(sql: string, databaseName: string = 'pashto-bible-db'): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), '.temp-d1-migration.sql');
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
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
    await fs.unlink(tempFile).catch(() => {});
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration from LOCAL FILES to Cloudflare D1...\n');
  
  try {
    // Load local data
    const yousafzaiVerses = loadYousafzaiVerses();
    const afghanVerses = loadAfghanVerses();
    
    console.log(`\n📊 Summary:`);
    console.log(`   Yousafzai: ${yousafzaiVerses.length} verses`);
    console.log(`   Afghan 2023: ${afghanVerses.length} verses`);
    console.log(`   Total: ${yousafzaiVerses.length + afghanVerses.length} verses\n`);
    
    // Generate SQL batches
    console.log('📝 Generating SQL INSERT statements...');
    
    const fs = await import('fs/promises');
    const batchSize = 100; // 100 rows per file (D1 limit)
    const sqlFiles: string[] = [];
    
    // Process Yousafzai verses
    let currentId = 1;
    for (let i = 0; i < yousafzaiVerses.length; i += batchSize) {
      const batch = yousafzaiVerses.slice(i, i + batchSize);
      const { sql, nextId } = generateVerseInserts(batch, 'verses_yousafzai', currentId);
      currentId = nextId;
      
      const filename = `cloudflare/d1-migration-yousafzai-part${Math.floor(i / batchSize) + 1}.sql`;
      await fs.writeFile(filename, [
        `-- Yousafzai 2019 verses (batch ${Math.floor(i / batchSize) + 1})`,
        sql,
      ].join('\n'), 'utf-8');
      sqlFiles.push(filename);
    }
    
    // Process Afghan verses
    for (let i = 0; i < afghanVerses.length; i += batchSize) {
      const batch = afghanVerses.slice(i, i + batchSize);
      const { sql, nextId } = generateVerseInserts(batch, 'verses', currentId);
      currentId = nextId;
      
      const filename = `cloudflare/d1-migration-afghan-part${Math.floor(i / batchSize) + 1}.sql`;
      await fs.writeFile(filename, [
        `-- Afghan 2023 verses (batch ${Math.floor(i / batchSize) + 1})`,
        sql,
      ].join('\n'), 'utf-8');
      sqlFiles.push(filename);
    }
    
    console.log(`✅ Generated ${sqlFiles.length} SQL files:`);
    sqlFiles.slice(0, 10).forEach(f => console.log(`   - ${f}`));
    if (sqlFiles.length > 10) {
      console.log(`   ... and ${sqlFiles.length - 10} more`);
    }
    
    // Optionally execute immediately
    const executeNow = process.env.EXECUTE_NOW === 'true';
    if (executeNow) {
      console.log('\n🚀 Executing migrations...');
      let success = 0;
      let failed = 0;
      
      for (const file of sqlFiles) {
        try {
          const sql = await fs.readFile(file, 'utf-8');
          await executeD1Sql(sql);
          success++;
          if (success % 10 === 0) {
            console.log(`   Progress: ${success}/${sqlFiles.length} files executed...`);
          }
        } catch (error: any) {
          failed++;
          console.error(`   ❌ Failed: ${file}`);
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`\n✅ Migration completed!`);
      console.log(`   ✅ Successful: ${success}`);
      console.log(`   ❌ Failed: ${failed}`);
    } else {
      console.log('\n💡 To execute these migrations, run:');
      console.log(`   EXECUTE_NOW=true npx tsx cloudflare/migrate-from-local-files.ts`);
      console.log('\n   Or execute manually:');
      sqlFiles.slice(0, 5).forEach(f => {
        console.log(`   npx wrangler d1 execute pashto-bible-db --remote --file=${f}`);
      });
      console.log(`   ... (${sqlFiles.length - 5} more files)`);
    }
    
    console.log('\n✅ Migration script completed!');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrate();


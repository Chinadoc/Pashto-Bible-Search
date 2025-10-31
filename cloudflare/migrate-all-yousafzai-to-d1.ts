/**
 * Migrate ALL Yousafzai 2019 verses from JSON file to verses_yousafzai table
 * The JSON file has ~30,410 verses that need to be migrated
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
  translation: string;
  dialect: string;
  book_slug?: string;
}

function getTestament(book: string): 'OT' | 'NT' {
  const otBooks = new Set([
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ]);
  
  if (otBooks.has(book)) return 'OT';
  
  const numberedMatch = book.match(/^(\d+)\s+(.+)$/);
  if (numberedMatch) {
    const numberedBook = `${numberedMatch[1]} ${numberedMatch[2]}`;
    if (otBooks.has(numberedBook)) return 'OT';
  }
  
  return 'NT';
}

function normalizeBookSlug(book: string): string {
  let cleaned = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  
  // For numbered books like "1chronicles", keep the number first: "1chronicles"
  // This matches R2 naming convention (e.g., "1chronicles008" not "chronicles1008")
  const numberedMatch = cleaned.match(/^(\d+)([a-z]+)$/);
  if (numberedMatch) {
    const [, num, name] = numberedMatch;
    return `${num}${name}`; // Keep number first, not reversed
  }
  
  return cleaned;
}

function getR2AudioKey(book: string, chapter: number, verse: number): string {
  const cleanBook = normalizeBookSlug(book);
  const testament = getTestament(book).toLowerCase();
  // Chapter numbers must be zero-padded to 3 digits to match R2 naming convention
  return `yousafzai/${testament}/yousafzai_${cleanBook}${chapter.toString().padStart(3, '0')}_verse_${verse.toString().padStart(3, '0')}.mp3`;
}

function escapeSql(str: string | null | undefined): string {
  if (!str) return "''";
  return `'${str.replace(/'/g, "''")}'`;
}

function cleanHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function executeD1Batch(
  verses: YousafzaiVerse[],
  batchNum: number,
  totalBatches: number,
  retryCount: number = 0
): Promise<boolean> {
  const values = verses.map(v => {
    const audioR2Key = getR2AudioKey(v.book, v.chapter, v.verse);
    const testament = getTestament(v.book);
    const timestamp = Math.floor(Date.now() / 1000);
    const cleanedText = cleanHtmlEntities(v.text);
    const ref = `${v.book} ${v.chapter}:${v.verse}`;
    
    return `(${escapeSql(ref)}, ${escapeSql(v.book)}, ${v.chapter}, ${v.verse}, ${escapeSql(cleanedText)}, ${escapeSql(null)}, ${escapeSql(v.text_html || null)}, ${escapeSql(testament)}, 'yousafzai2019', 'yousafzai', '[]', ${escapeSql(audioR2Key)}, NULL, ${timestamp}, ${timestamp})`;
  });
  
  const sql = `INSERT OR REPLACE INTO verses_yousafzai (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES\n${values.join(',\n')};`;
  
  const fs = await import('fs/promises');
  const path = await import('path');
  const tempFile = path.join(process.cwd(), `.temp-yousafzai-batch-${batchNum}.sql`);
  
  await fs.writeFile(tempFile, sql, 'utf-8');
  
  try {
    const { stdout, stderr } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
      { maxBuffer: 50 * 1024 * 1024, timeout: 120000, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`   ⚠️  Batch ${batchNum}/${totalBatches}: ${stderr}`);
    }
    return true;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    // Retry logic for transient errors
    if (retryCount < 3 && (
      errorMsg.includes('timeout') ||
      errorMsg.includes('ECONNRESET') ||
      errorMsg.includes('ETIMEDOUT') ||
      errorMsg.includes('502') ||
      errorMsg.includes('503')
    )) {
      console.log(`   ⚠️  Batch ${batchNum}/${totalBatches} failed (attempt ${retryCount + 1}/3), retrying in 5s...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return executeD1Batch(verses, batchNum, totalBatches, retryCount + 1);
    }
    
    // For UNIQUE constraint errors, try inserting individually
    if (errorMsg.includes('UNIQUE constraint')) {
      console.log(`   ⚠️  Batch ${batchNum}/${totalBatches} has UNIQUE constraint issues, inserting individually...`);
      return await insertIndividually(verses, batchNum, totalBatches);
    }
    
    console.error(`   ❌ Batch ${batchNum}/${totalBatches} failed: ${errorMsg.substring(0, 200)}`);
    return false;
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }
}

async function insertIndividually(
  verses: YousafzaiVerse[],
  batchNum: number,
  totalBatches: number
): Promise<boolean> {
  let successCount = 0;
  let failCount = 0;
  
  for (const verse of verses) {
    const audioR2Key = getR2AudioKey(verse.book, verse.chapter, verse.verse);
    const testament = getTestament(verse.book);
    const timestamp = Math.floor(Date.now() / 1000);
    const cleanedText = cleanHtmlEntities(verse.text);
    const ref = `${verse.book} ${verse.chapter}:${verse.verse}`;
    
    const sql = `INSERT OR REPLACE INTO verses_yousafzai (ref, book, chapter, verse, text, text_normalized, text_html, testament, translation_key, dialect, tags, audio_r2_key, audio_public_url, created_at, updated_at) VALUES (${escapeSql(ref)}, ${escapeSql(verse.book)}, ${verse.chapter}, ${verse.verse}, ${escapeSql(cleanedText)}, ${escapeSql(null)}, ${escapeSql(verse.text_html || null)}, ${escapeSql(testament)}, 'yousafzai2019', 'yousafzai', '[]', ${escapeSql(audioR2Key)}, NULL, ${timestamp}, ${timestamp});`;
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const tempFile = path.join(process.cwd(), `.temp-yousafzai-individual-${Date.now()}.sql`);
    
    await fs.writeFile(tempFile, sql, 'utf-8');
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --file=${tempFile}`,
        { maxBuffer: 10 * 1024 * 1024, timeout: 30000, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
      );
      successCount++;
    } catch (error: any) {
      failCount++;
      console.error(`      Failed: ${ref} - ${error.message.substring(0, 100)}`);
    } finally {
      await fs.unlink(tempFile).catch(() => {});
    }
  }
  
  console.log(`   ✅ Inserted ${successCount}/${verses.length} verses individually (${failCount} failed)`);
  return failCount === 0;
}

async function main() {
  console.log('🚀 Migrating ALL Yousafzai 2019 Verses to verses_yousafzai table\n');
  console.log('='.repeat(70));
  
  try {
    // Load JSON file
    console.log('\n📖 Loading yousafzai_all_verses.json...');
    const jsonPath = 'app/data/yousafzai_all_verses.json';
    const fileContent = readFileSync(jsonPath, 'utf-8');
    const verses: YousafzaiVerse[] = JSON.parse(fileContent);
    
    console.log(`   Loaded ${verses.length.toLocaleString()} verses`);
    
    // Filter out invalid verses
    const validVerses = verses.filter(v => 
      v.book && 
      v.chapter > 0 && 
      v.verse > 0 && 
      v.text && 
      v.text.trim().length > 0
    );
    
    console.log(`   Valid verses: ${validVerses.length.toLocaleString()}`);
    
    // Insert in batches
    const batchSize = 100;
    const batches: YousafzaiVerse[][] = [];
    
    for (let i = 0; i < validVerses.length; i += batchSize) {
      batches.push(validVerses.slice(i, i + batchSize));
    }
    
    // Check existing verses to resume from where we left off
    const { stdout: existingRaw } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT COUNT(*) as count FROM verses_yousafzai;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    const existingResult = JSON.parse(existingRaw);
    const existingData = Array.isArray(existingResult) ? existingResult[0] : existingResult;
    const existingCount = existingData.results?.[0]?.count || 0;
    
    console.log(`\n📊 Existing verses in database: ${existingCount.toLocaleString()}`);
    console.log(`   Remaining to insert: ${(validVerses.length - existingCount).toLocaleString()}`);
    
    // Skip batches that are already inserted
    const skipBatches = Math.floor(existingCount / batchSize);
    const startIndex = skipBatches * batchSize;
    
    if (skipBatches > 0) {
      console.log(`\n⏭️  Skipping first ${skipBatches} batches (already inserted), resuming from batch ${skipBatches + 1}...`);
    }
    
    console.log(`\n💾 Inserting ${batches.length} batches into verses_yousafzai table...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = skipBatches; i < batches.length; i++) {
      const success = await executeD1Batch(batches[i], i + 1, batches.length);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      const inserted = Math.min((i + 1) * batchSize, validVerses.length);
      process.stdout.write(`\r   Processed batch ${i + 1}/${batches.length} (${inserted.toLocaleString()} verses, ${successCount} succeeded, ${failCount} failed)...`);
      
      // Small delay to avoid rate limiting
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`\n✅ Processed ${batches.length - skipBatches} batches (${successCount} succeeded, ${failCount} failed)`);
    
    console.log(`\n✅ Inserted ${validVerses.length.toLocaleString()} Yousafzai 2019 verses`);
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ Migration complete!');
    console.log('='.repeat(70));
    
    const { stdout } = await execAsync(
      `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT testament, COUNT(*) as count FROM verses_yousafzai GROUP BY testament ORDER BY testament;" --json`,
      { maxBuffer: 10 * 1024 * 1024, cwd: '/Users/jeremysamuels/Documents/pashto-bible-search' }
    );
    
    const result = JSON.parse(stdout);
    const data = Array.isArray(result) ? result[0] : result;
    
    console.log('\n📊 Final counts:');
    if (data.results) {
      data.results.forEach((row: any) => {
        console.log(`   ${row.testament}: ${row.count.toLocaleString()} verses`);
      });
    }
    
  } catch (error: any) {
    console.error(`\n❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);

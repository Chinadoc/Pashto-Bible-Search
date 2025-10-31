/**
 * Fix audio_r2_key values in verses_yousafzai table to match R2 naming convention
 * R2 files use 3-digit zero-padded chapter numbers (e.g., exodus001, not exodus1)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

function getCorrectR2AudioKey(book: string, chapter: number, verse: number): string {
  const cleanBook = normalizeBookSlug(book);
  const testament = getTestament(book).toLowerCase();
  // Chapter numbers must be zero-padded to 3 digits to match R2 naming convention
  return `yousafzai/${testament}/yousafzai_${cleanBook}${chapter.toString().padStart(3, '0')}_verse_${verse.toString().padStart(3, '0')}.mp3`;
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

async function fixAudioR2Keys(): Promise<void> {
  console.log('🔧 Fixing audio_r2_key padding in verses_yousafzai table...\n');
  
  // Fetch all verses with audio_r2_key (no limit to process all)
  console.log('📊 Fetching verses with audio_r2_key...\n');
  const { stdout } = await execAsync(
    `npx wrangler d1 execute pashto-bible-db --remote --command="SELECT book, chapter, verse, audio_r2_key FROM verses_yousafzai WHERE audio_r2_key IS NOT NULL;" --json`,
    { maxBuffer: 100 * 1024 * 1024, timeout: 180000 }
  );
  
  const result = JSON.parse(stdout);
  const data = Array.isArray(result) ? result[0] : result;
  const verses = data.results || [];
  
  console.log(`📊 Found ${verses.length} verses with audio_r2_key\n`);
  
  // Build UPDATE statements
  const updates: Array<{ book: string; chapter: number; verse: number; oldKey: string; newKey: string }> = [];
  
  for (const verse of verses) {
    const correctKey = getCorrectR2AudioKey(verse.book, verse.chapter, verse.verse);
    if (verse.audio_r2_key !== correctKey) {
      updates.push({
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        oldKey: verse.audio_r2_key,
        newKey: correctKey,
      });
    }
  }
  
  console.log(`📊 Found ${updates.length} verses that need updating\n`);
  
  if (updates.length === 0) {
    console.log('✅ All audio_r2_key values are correct!\n');
    return;
  }
  
  // Update in batches
  const batchSize = 100;
  let updated = 0;
  
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const updateStatements = batch.map(u => {
      const escapeSql = (str: string) => `'${str.replace(/'/g, "''")}'`;
      return `UPDATE verses_yousafzai SET audio_r2_key = ${escapeSql(u.newKey)} WHERE book = ${escapeSql(u.book)} AND chapter = ${u.chapter} AND verse = ${u.verse};`;
    }).join('\n');
    
    try {
      await execAsync(
        `npx wrangler d1 execute pashto-bible-db --remote --command="${updateStatements.replace(/"/g, '\\"')}"`,
        { timeout: 60000 }
      );
      updated += batch.length;
      process.stdout.write(`\r   Updated ${updated}/${updates.length} verses...`);
    } catch (error: any) {
      console.error(`\n⚠️  Error updating batch: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Fixed ${updated} audio_r2_key values\n`);
  
  // Show some examples
  if (updates.length > 0) {
    console.log('📋 Example fixes:');
    updates.slice(0, 5).forEach(u => {
      console.log(`   ${u.oldKey} → ${u.newKey}`);
    });
    console.log('');
  }
}

fixAudioR2Keys().catch(console.error);


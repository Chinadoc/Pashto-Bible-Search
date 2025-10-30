/**
 * PARALLEL Audio Migration - Upload with multiple concurrent workers
 * Uses worker pool pattern for concurrent uploads
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import * as https from 'https';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET_NAME = 'pashto-bible-audio';
const CONCURRENT_WORKERS = 15; // Increased from 5 to 15 for faster uploads
const MAX_CONCURRENT_UPLOADS = 30; // Increased concurrent uploads per worker

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing Cloudflare R2 credentials');
  process.exit(1);
}

// Initialize R2 S3 client with increased socket limits for parallel uploads
// Create custom HTTP agent with increased socket limits
const httpsAgent = new https.Agent({
  maxSockets: 500, // Allow up to 500 concurrent connections
  keepAlive: true,
  keepAliveMsecs: 1000,
});

const httpHandler = new NodeHttpHandler({
  httpsAgent: httpsAgent,
  socketAcquisitionTimeout: 60000,
});

const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  maxAttempts: 3,
  requestHandler: httpHandler,
});

function getTestament(book: string): 'ot' | 'nt' {
  const otBooks = new Set([
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
    'joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings',
    '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther', 'job',
    'psalms', 'proverbs', 'ecclesiastes', 'songofsolomon', 'song', 'isaiah',
    'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel',
    'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah',
    'haggai', 'zechariah', 'malachi'
  ]);
  
  const bookLower = book.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return otBooks.has(bookLower) ? 'ot' : 'nt';
}

function normalizeBookSlug(book: string): string {
  return book.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(\d)([a-z])/, '$2$1'); // Move leading number to end (1john -> john1)
}

function getR2Key(filePath: string): string {
  const filename = basename(filePath);
  const dirname = filePath.split('/').slice(-3, -1).join('/');
  const fullPath = filePath.toLowerCase();
  
  // Pattern 1: Yousafzai files - yousafzai_{book}{chapter}_verse_{verse}.mp3
  const yousafzaiMatch = filename.match(/^yousafzai_([a-z]+)(\d+)_verse_(\d+)\.mp3$/i);
  if (yousafzaiMatch) {
    const [, book] = yousafzaiMatch;
    const testament = getTestament(book);
    return `yousafzai/${testament}/${filename}`;
  }
  
  // Pattern 2: Afghan 2023 files - {book}{chapter}_verse_{verse}.mp3 (may have spaces like " 2.mp3")
  // Example: matthew6_verse_18.mp3, matthew6_verse_18 2.mp3
  const afghanMatch = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)(\s\d+)?\.mp3$/i);
  if (afghanMatch) {
    const [, book, chapter, verse] = afghanMatch;
    const testament = getTestament(book);
    const cleanBook = normalizeBookSlug(book);
    // Remove space from verse number if present, pad to 3 digits
    const cleanVerse = verse.trim().padStart(3, '0');
    const normalizedFilename = `${cleanBook}${chapter}_verse_${cleanVerse}.mp3`;
    return `afghan2023/${testament}/${normalizedFilename}`;
  }
  
  // Pattern 3: Numbered files in pashto_proverbs_complete (001.mp3, 002.mp3, etc.)
  // These are sequential Proverbs verses - need to calculate chapter/verse
  if (fullPath.includes('pashto_proverbs_complete') || fullPath.includes('proverbs_audio')) {
    const verseMatch = filename.match(/^(\d+)\.mp3$/i);
    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1], 10);
      // Proverbs has 31 chapters with varying verses per chapter
      // Chapters 1-9 have varying lengths, but we'll estimate based on average
      // For now, using a simple mapping (can be refined)
      // Proverbs verse numbers: 1-915 total
      // Rough estimate: each chapter ~30 verses
      const chapter = Math.min(31, Math.ceil(verseNum / 30));
      const verseInChapter = verseNum - ((chapter - 1) * 30);
      const normalizedFilename = `proverbs${chapter}_verse_${verseInChapter.toString().padStart(3, '0')}.mp3`;
      return `afghan2023/ot/${normalizedFilename}`;
    }
  }
  
  // Pattern 4: Check directory structure for clues
  if (dirname.includes('yousafzai')) {
    const testament = dirname.includes('ot') || dirname.includes('old') ? 'ot' : 'nt';
    return `yousafzai/${testament}/${filename}`;
  }
  
  if (dirname.includes('afghan') || dirname.includes('2023') || dirname.includes('Pashto')) {
    // Try to extract book from directory name or filename
    const dirMatch = dirname.match(/([a-z]+)/i);
    if (dirMatch) {
      const book = dirMatch[1];
      const testament = getTestament(book);
      // Try to parse filename again
      const filenameMatch = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)(\s\d+)?\.mp3$/i);
      if (filenameMatch) {
        const [, bookName, chapter, verse] = filenameMatch;
        const cleanBook = normalizeBookSlug(bookName);
        const cleanVerse = verse.trim().padStart(3, '0');
        const normalizedFilename = `${cleanBook}${chapter}_verse_${cleanVerse}.mp3`;
        return `afghan2023/${testament}/${normalizedFilename}`;
      }
      return `afghan2023/${testament}/${filename}`;
    }
    return `afghan2023/unknown/${filename}`;
  }
  
  // Pattern 5: Generic verse files - skip these (they'll be deleted)
  if (filename.match(/^verse-\d+\.mp3$/i)) {
    return `_unlabeled/${filename}`;
  }
  
  // Default: put in unknown folder
  return `_unknown/${filename}`;
}

async function findMp3Files(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await findMp3Files(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.mp3') {
        files.push(fullPath);
      }
    }
  } catch (error: any) {
    console.error(`   ❌ Error reading ${dir}: ${error.message}`);
    throw error; // Re-throw to see what's wrong
  }
  return files;
}

async function checkIfExists(key: string): Promise<boolean> {
  try {
    await r2Client.send(new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(filePath: string, r2Key: string, retries: number = 3): Promise<boolean> {
  // First, verify file exists
  try {
    await stat(filePath);
  } catch {
    // File doesn't exist - try to find it
    const filename = basename(filePath);
    const searchPaths = [
      filePath,
      join('yousafzai_audio_files', filename),
      join(process.cwd(), 'yousafzai_audio_files', filename),
      join('Pashto new testament with audio', filename),
      join(process.cwd(), 'Pashto new testament with audio', filename),
    ];
    
    let foundPath = null;
    for (const searchPath of searchPaths) {
      try {
        await stat(searchPath);
        foundPath = searchPath;
        break;
      } catch {
        continue;
      }
    }
    
    if (!foundPath) {
      return false; // File truly doesn't exist
    }
    
    filePath = foundPath; // Use found path
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check if already exists
      if (await checkIfExists(r2Key)) {
        return true; // Skip if already uploaded
      }

      const fileData = await readFile(filePath);
      const stats = await stat(filePath);
      const filename = basename(filePath);

      // Extract metadata from filename
      const yousafzaiMatch = filename.match(/^yousafzai_([a-z]+)(\d+)_verse_(\d+)\.mp3$/i);
      const afghanMatch = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)(\s\d+)?\.mp3$/i);
      
      const metadata: Record<string, string> = {
        'original-filename': filename,
        'source-path': filePath.replace(process.cwd(), '').substring(0, 200),
        'upload-date': new Date().toISOString(),
      };

      if (yousafzaiMatch) {
        const [, book, chapter, verse] = yousafzaiMatch;
        metadata['translation'] = 'yousafzai2019';
        metadata['book'] = book;
        metadata['chapter'] = chapter;
        metadata['verse'] = verse;
        metadata['testament'] = getTestament(book);
      } else if (afghanMatch) {
        const [, book, chapter, verse] = afghanMatch;
        metadata['translation'] = 'afghan2023';
        metadata['book'] = normalizeBookSlug(book);
        metadata['chapter'] = chapter;
        metadata['verse'] = verse.trim();
        metadata['testament'] = getTestament(book);
      }

      await r2Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileData,
        ContentType: 'audio/mpeg',
        CacheControl: 'public, max-age=31536000',
        Metadata: metadata,
        ContentLength: stats.size,
      }));

      return true;
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      const isConnectionError = error.message?.includes('ECONNRESET') || 
                                error.message?.includes('ETIMEDOUT') ||
                                error.message?.includes('timeout') ||
                                error.code === 'ECONNRESET';
      
      if (isConnectionError && !isLastAttempt) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * attempt, 5000)));
        continue;
      }
      
      if (isLastAttempt) {
        return false;
      }
    }
  }
  
  return false;
}

async function uploadBatch(files: Array<{ path: string; key: string }>, workerId: number): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Process files in parallel chunks
  const chunkSize = MAX_CONCURRENT_UPLOADS;
  
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    
    // Upload all files in this chunk in parallel
    const results = await Promise.allSettled(
      chunk.map(file => uploadFile(file.path, file.key))
    );
    
    // Count successes and failures
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        success++;
      } else {
        failed++;
      }
    }
    
    // Progress update every chunk
    const totalProcessed = Math.min(i + chunkSize, files.length);
    if (totalProcessed % 50 === 0 || totalProcessed === files.length) {
      process.stdout.write(`\rWorker ${workerId}: ${success}/${files.length} uploaded (${failed} failed)     `);
    }
    
    // Small delay between chunks to avoid overwhelming R2
    if (i + chunkSize < files.length) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  return { success, failed };
}

async function main() {
  console.log('🚀 PARALLEL Audio Upload to R2\n');
  console.log(`📊 Using ${CONCURRENT_WORKERS} concurrent workers`);
  console.log('='.repeat(60));

  // Find all audio files
  console.log('\n📁 Finding audio files...');
  const audioDirs = [
    'yousafzai_audio_files',
    'Pashto new testament with audio',
    '/Users/jeremysamuels/Downloads/pashto_proverbs_complete',
    '/Users/jeremysamuels/Downloads/proverbs_audio',
    'ot_audio_files', // Afghan 2023 OT audio (Proverbs, Judges, etc.)
  ];
  let allFiles: string[] = [];

  for (const dir of audioDirs) {
    try {
      const files = await findMp3Files(dir);
      allFiles.push(...files);
      console.log(`   ✅ Found ${files.length} files in ${dir}`);
    } catch (error: any) {
      console.warn(`   ⚠️  Skipping ${dir}: ${error.message}`);
    }
  }

  console.log(`\n📊 Total: ${allFiles.length} audio files found`);

  // Map files to R2 keys
  console.log('\n🔗 Mapping files to R2 keys...');
  const fileMap = allFiles.map(filePath => ({
    path: filePath,
    key: getR2Key(filePath),
  }));

  // Filter to valid files (skip unknown and unlabeled)
  const validFiles = fileMap.filter(f => 
    !f.key.startsWith('_unknown') && 
    !f.key.startsWith('_unlabeled')
  );
  
  const yousafzaiFiles = validFiles.filter(f => f.key.startsWith('yousafzai/'));
  const afghanFiles = validFiles.filter(f => f.key.startsWith('afghan2023/'));
  
  console.log(`   ✅ ${validFiles.length} files ready for upload`);
  console.log(`      - ${yousafzaiFiles.length} Yousafzai files`);
  console.log(`      - ${afghanFiles.length} Afghan 2023 files`);

  // Split into batches for workers
  const batchSize = Math.ceil(validFiles.length / CONCURRENT_WORKERS);
  const batches: Array<Array<{ path: string; key: string }>> = [];

  for (let i = 0; i < validFiles.length; i += batchSize) {
    batches.push(validFiles.slice(i, i + batchSize));
  }

  console.log(`\n📤 Uploading with ${batches.length} workers...\n`);

  // Upload batches in parallel
  const startTime = Date.now();
  const results = await Promise.all(
    batches.map((batch, idx) => uploadBatch(batch, idx + 1))
  );

  const totalSuccess = results.reduce((sum, r) => sum + r.success, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Upload Complete!');
  console.log(`📊 Success: ${totalSuccess} files`);
  console.log(`⚠️  Failed: ${totalFailed} files`);
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log(`⚡ Rate: ${(totalSuccess / parseFloat(duration)).toFixed(1)} files/sec`);
}

main().catch(console.error);


/**
 * Migration script to upload audio files from LOCAL directories to Cloudflare R2
 * Much faster than downloading from Supabase/Google Drive!
 * 
 * Usage:
 * 1. Set environment variables:
 *    - CLOUDFLARE_ACCOUNT_ID
 *    - CLOUDFLARE_R2_ACCESS_KEY_ID
 *    - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 * 2. Run: npx tsx cloudflare/migrate-audio-from-local.ts
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET_NAME = 'pashto-bible-audio';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing Cloudflare R2 credentials');
  console.error('Set: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

// Initialize R2 S3 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Required for R2
});

/**
 * Recursively find all MP3 files in a directory
 */
async function findMp3Files(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await findMp3Files(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.mp3') {
        files.push(fullPath);
      }
    }
  } catch (error: any) {
    console.warn(`⚠️  Error reading directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Determine testament from book name
 */
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

/**
 * Normalize book name to slug format
 */
function normalizeBookSlug(book: string): string {
  return book.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(\d)([a-z])/, '$2$1'); // Move leading number to end (1john -> john1)
}

/**
 * Determine R2 key from file path with proper labeling
 */
function getR2Key(filePath: string): string {
  const filename = basename(filePath);
  const dirname = filePath.split('/').slice(-3, -1).join('/'); // Get parent directories
  
  // Pattern 1: Yousafzai files - yousafzai_{book}{chapter}_verse_{verse}.mp3
  // Example: yousafzai_psalms001_verse_001.mp3
  const yousafzaiMatch = filename.match(/^yousafzai_([a-z]+)(\d+)_verse_(\d+)\.mp3$/i);
  if (yousafzaiMatch) {
    const [, book, chapter, verse] = yousafzaiMatch;
    const testament = getTestament(book);
    // Keep original filename for clarity
    return `yousafzai/${testament}/${filename}`;
  }
  
  // Pattern 2: Afghan 2023 files - {book}{chapter}_verse_{verse}.mp3
  // Example: matthew6_verse_18.mp3, genesis1_verse_1.mp3
  const afghanMatch = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)(\s\d+)?\.mp3$/i);
  if (afghanMatch) {
    const [, book, chapter, verse] = afghanMatch;
    const testament = getTestament(book);
    // Standardize filename: remove spaces, ensure proper format
    const cleanBook = normalizeBookSlug(book);
    const normalizedFilename = `${cleanBook}${chapter}_verse_${verse.padStart(3, '0')}.mp3`;
    return `afghan2023/${testament}/${normalizedFilename}`;
  }
  
  // Pattern 3: Check directory structure for clues
  if (dirname.includes('yousafzai') || dirname.includes('yousafzai')) {
    const testament = dirname.includes('ot') || dirname.includes('old') ? 'ot' : 'nt';
    return `yousafzai/${testament}/${filename}`;
  }
  
  if (dirname.includes('afghan') || dirname.includes('2023')) {
    // Try to extract book from directory name
    const dirMatch = dirname.match(/([a-z]+)/i);
    if (dirMatch) {
      const book = dirMatch[1];
      const testament = getTestament(book);
      return `afghan2023/${testament}/${filename}`;
    }
    return `afghan2023/unknown/${filename}`;
  }
  
  // Pattern 4: Generic verse files - try to infer from path
  if (filename.match(/^verse-\d+\.mp3$/i)) {
    // These are poorly labeled - put in temp folder for manual review
    return `_unlabeled/${filename}`;
  }
  
  // Default: put in unknown folder
  return `_unknown/${filename}`;
}

/**
 * Check if file exists in R2
 */
async function fileExistsInR2(r2Key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
      })
    );
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Upload file to R2 with proper metadata
 */
async function uploadToR2(filePath: string, r2Key: string): Promise<void> {
  // Check if already exists
  if (await fileExistsInR2(r2Key)) {
    console.log(`⏭️  Skipping ${r2Key} (already exists)`);
    return;
  }
  
  // Read file
  const fileData = await readFile(filePath);
  const stats = await stat(filePath);
  
  // Extract metadata from filename for better organization
  const filename = basename(filePath);
  const metadata: Record<string, string> = {
    'original-filename': filename,
    'source-path': filePath.replace(process.cwd(), '').substring(0, 200),
    'upload-date': new Date().toISOString(),
  };
  
  // Parse filename for additional metadata
  const yousafzaiMatch = filename.match(/^yousafzai_([a-z]+)(\d+)_verse_(\d+)\.mp3$/i);
  const afghanMatch = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)(\s\d+)?\.mp3$/i);
  
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
    metadata['verse'] = verse;
    metadata['testament'] = getTestament(book);
  }
  
  // Upload with metadata
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileData,
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=31536000',
      Metadata: metadata,
      ContentLength: stats.size,
    })
  );
  
  console.log(`✅ Uploaded ${r2Key} (${(stats.size / 1024).toFixed(1)} KB)`);
}

/**
 * Main migration function
 */
async function migrateAudio() {
  console.log('🚀 Starting audio migration from LOCAL FILES to Cloudflare R2...\n');
  
  // Find all audio directories - organized by source
  const audioDirs = [
    // Yousafzai audio (if exists)
    'yousafzai_split_audio',
    'yousafzai_audio',
    // Afghan 2023 audio (if exists)
    'afghan2023_audio',
    'audio_clips',
    // Chapter-level splits (need verse-level organization)
    'pashto-bible-react/split_output',
    // Root directory (may have mixed files)
    '.',
  ];
  
  console.log('🔍 Searching for MP3 files in:');
  audioDirs.forEach(d => console.log(`   - ${d}`));
  console.log('');
  
  const allFiles: string[] = [];
  
  for (const dir of audioDirs) {
    try {
      const files = await findMp3Files(dir);
      console.log(`📦 Found ${files.length} MP3 files in ${dir}`);
      allFiles.push(...files);
    } catch (error: any) {
      console.warn(`⚠️  Skipping ${dir}: ${error.message}`);
    }
  }
  
  // Remove duplicates
  const uniqueFiles = Array.from(new Set(allFiles));
  
  console.log(`\n📊 Total unique MP3 files: ${uniqueFiles.length}\n`);
  
  if (uniqueFiles.length === 0) {
    console.log('❌ No MP3 files found!');
    console.log('💡 Make sure audio files are in one of these directories:');
    audioDirs.forEach(d => console.log(`   - ${d}`));
    process.exit(1);
  }
  
  // Upload files
  console.log('📤 Uploading files to R2 with proper labeling...\n');
  console.log('📁 R2 Structure:');
  console.log('   yousafzai/nt/  - Yousafzai 2019 New Testament');
  console.log('   yousafzai/ot/  - Yousafzai 2019 Old Testament');
  console.log('   afghan2023/nt/ - Afghan 2023 New Testament');
  console.log('   afghan2023/ot/ - Afghan 2023 Old Testament');
  console.log('   _unlabeled/    - Files needing manual review\n');
  
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;
  const uploadedByCategory: Record<string, number> = {};
  
  // Process in batches
  const batchSize = 10;
  for (let i = 0; i < uniqueFiles.length; i += batchSize) {
    const batch = uniqueFiles.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (filePath) => {
        try {
          const r2Key = getR2Key(filePath);
          const category = r2Key.split('/')[0]; // Extract category (yousafzai, afghan2023, _unlabeled, etc.)
          
          const existed = await fileExistsInR2(r2Key);
          
          if (existed) {
            skipped++;
            return;
          }
          
          await uploadToR2(filePath, r2Key);
          uploaded++;
          uploadedByCategory[category] = (uploadedByCategory[category] || 0) + 1;
        } catch (error: any) {
          errors++;
          console.error(`❌ Failed to migrate ${filePath}: ${error.message}`);
        }
      })
    );
    
    // Progress update
    if ((i + batchSize) % 100 === 0 || i + batchSize >= uniqueFiles.length) {
      console.log(`\n📊 Progress: ${i + batchSize}/${uniqueFiles.length} files processed`);
      console.log(`   ✅ Uploaded: ${uploaded}`);
      console.log(`   ⏭️  Skipped: ${skipped}`);
      console.log(`   ❌ Errors: ${errors}\n`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n✅ Migration completed!');
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📁 Total processed: ${uniqueFiles.length}`);
  console.log('\n📊 Uploaded by category:');
  Object.entries(uploadedByCategory).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} files`);
  });
  
  if (uploadedByCategory['_unlabeled'] || uploadedByCategory['_unknown']) {
    console.log('\n⚠️  Warning: Some files are in _unlabeled/ or _unknown/ folders.');
    console.log('   These need manual review and proper naming.');
    console.log('   Check R2 bucket for files that need reorganization.');
  }
}

// Run migration
migrateAudio();


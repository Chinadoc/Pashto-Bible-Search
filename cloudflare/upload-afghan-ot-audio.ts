/**
 * Upload Afghan 2023 OT Audio Files to R2
 * Uploads verse files from ot_audio_files directory to R2 with proper labeling
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
const CONCURRENT_WORKERS = 15;
const MAX_CONCURRENT_UPLOADS = 30;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing Cloudflare R2 credentials');
  process.exit(1);
}

// Initialize R2 S3 client with increased socket limits
const httpsAgent = new https.Agent({
  maxSockets: 500,
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

function normalizeBookSlug(book: string): string {
  return book.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/^(\d)([a-z])/, '$2$1'); // Move leading number to end (1john -> john1)
}

/**
 * Convert local file path to R2 key
 * Example: ot_audio_files/genesis/chapter-1-verses/genesis1_verse_001.mp3
 * -> afghan2023/ot/genesis1_verse_001.mp3
 */
function getR2Key(filePath: string): string {
  const filename = basename(filePath);
  const pathParts = filePath.split('/');
  
  // Pattern: {book}{chapter}_verse_{verse}.mp3
  // Example: genesis1_verse_001.mp3
  const match = filename.match(/^([a-z0-9]+)(\d+)_verse_(\d+)\.mp3$/i);
  
  if (!match) {
    console.warn(`⚠️  Could not parse filename: ${filename}`);
    return `_unknown/${filename}`;
  }
  
  const [, book, chapter, verse] = match;
  const cleanBook = normalizeBookSlug(book);
  const normalizedFilename = `${cleanBook}${chapter}_verse_${verse.padStart(3, '0')}.mp3`;
  
  // All files from ot_audio_files are OT
  return `afghan2023/ot/${normalizedFilename}`;
}

async function checkExists(key: string): Promise<boolean> {
  try {
    await r2Client.send(new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function uploadFile(filePath: string, key: string, retries = 3): Promise<boolean> {
  // Skip unknown files
  if (key.startsWith('_unknown')) {
    return false;
  }

  // Check if already exists
  if (await checkExists(key)) {
    return true; // Already uploaded
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const fileContent = await readFile(filePath);
      const fileStats = await stat(filePath);

      await r2Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: 'audio/mpeg',
        Metadata: {
          'source': 'afghan2023-ot',
          'uploaded-at': new Date().toISOString(),
        },
      }));

      return true;
    } catch (error: any) {
      const isNetworkError = error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT';
      
      if (isNetworkError && attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
        console.log(`   ⏳ Retry ${attempt}/${retries} after ${delay}ms: ${basename(filePath)}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error(`   ❌ Failed to upload ${basename(filePath)}: ${error.message}`);
      return false;
    }
  }
  
  return false;
}

async function findVerseFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories (e.g., chapter-1-verses)
        const subFiles = await findVerseFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.mp3') && entry.name.includes('_verse_')) {
        files.push(fullPath);
      }
    }
  } catch (error: any) {
    console.warn(`⚠️  Error reading directory ${dir}: ${error.message}`);
  }
  
  return files;
}

async function uploadBatch(
  files: Array<{ path: string; key: string }>,
  workerId: number
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  let uploaded = 0;
  let skipped = 0;

  for (const file of files) {
    const exists = await checkExists(file.key);
    if (exists) {
      skipped++;
      continue;
    }

    const result = await uploadFile(file.path, file.key);
    if (result) {
      success++;
      uploaded++;
    } else {
      failed++;
    }

    // Progress update every 10 files
    if ((uploaded + skipped) % 10 === 0) {
      process.stdout.write(`\r   Worker ${workerId}: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`);
    }
  }

  return { success, failed };
}

async function main() {
  console.log('🚀 Uploading Afghan 2023 OT Audio to R2\n');
  console.log(`📊 Using ${CONCURRENT_WORKERS} concurrent workers`);
  console.log('='.repeat(60));

  // Find all verse files
  console.log('\n📁 Finding verse files in ot_audio_files...');
  const audioDir = join(process.cwd(), 'ot_audio_files');
  const allFiles = await findVerseFiles(audioDir);

  console.log(`   ✅ Found ${allFiles.length} verse files`);

  // Map files to R2 keys
  console.log('\n🔗 Mapping files to R2 keys...');
  const fileMap = allFiles.map(filePath => ({
    path: filePath,
    key: getR2Key(filePath),
  }));

  // Filter out unknown files
  const validFiles = fileMap.filter(f => !f.key.startsWith('_unknown'));
  const afghanFiles = validFiles.filter(f => f.key.startsWith('afghan2023/'));

  console.log(`   ✅ ${validFiles.length} files ready for upload`);
  console.log(`      - ${afghanFiles.length} Afghan 2023 OT files`);

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
  if (totalSuccess > 0) {
    console.log(`⚡ Rate: ${(totalSuccess / parseFloat(duration)).toFixed(1)} files/sec`);
  }
  console.log(`\n📁 Files uploaded to: afghan2023/ot/`);
}

main().catch(console.error);



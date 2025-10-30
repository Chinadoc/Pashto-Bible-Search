/**
 * Migration script to upload audio files from Supabase Storage/Google Drive to Cloudflare R2
 * 
 * Usage:
 * 1. Set environment variables:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - CLOUDFLARE_ACCOUNT_ID
 *    - CLOUDFLARE_R2_ACCESS_KEY_ID
 *    - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 * 2. Run: npx tsx cloudflare/migrate-audio-to-r2.ts
 */

import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = 'pashto-bible-audio';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('Missing Cloudflare R2 credentials');
  console.error('Get them from: https://dash.cloudflare.com/?to=/:account/r2/api-tokens');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize R2 S3 client (R2 is S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * List all audio files from Supabase Storage
 */
async function listSupabaseAudioFiles(): Promise<string[]> {
  console.log('📦 Listing audio files from Supabase Storage...');
  
  const files: string[] = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage
      .from('audio')
      .list('', {
        limit: pageSize,
        offset: page * pageSize,
        sortBy: { column: 'name', order: 'asc' },
      });
    
    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      break;
    }
    
    // Filter for MP3 files and collect paths
    for (const item of data) {
      if (item.name?.endsWith('.mp3')) {
        files.push(item.name);
      } else if (!item.name?.includes('.')) {
        // Might be a folder, recursively list
        const nestedFiles = await listFilesRecursive(item.name);
        files.push(...nestedFiles);
      }
    }
    
    if (data.length < pageSize) {
      break;
    }
    
    page++;
  }
  
  console.log(`✅ Found ${files.length} audio files in Supabase Storage`);
  return files;
}

/**
 * Recursively list files in a folder
 */
async function listFilesRecursive(prefix: string): Promise<string[]> {
  const files: string[] = [];
  
  const { data, error } = await supabase.storage
    .from('audio')
    .list(prefix, {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    });
  
  if (error) {
    console.warn(`Warning: Failed to list ${prefix}: ${error.message}`);
    return files;
  }
  
  if (!data) return files;
  
  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
    
    if (item.name?.endsWith('.mp3')) {
      files.push(fullPath);
    } else if (!item.name?.includes('.')) {
      // Recursive folder listing
      const nestedFiles = await listFilesRecursive(fullPath);
      files.push(...nestedFiles);
    }
  }
  
  return files;
}

/**
 * Download file from Supabase Storage
 */
async function downloadFromSupabase(filePath: string): Promise<Uint8Array> {
  const { data, error } = await supabase.storage
    .from('audio')
    .download(filePath);
  
  if (error) {
    throw new Error(`Failed to download ${filePath}: ${error.message}`);
  }
  
  if (!data) {
    throw new Error(`No data returned for ${filePath}`);
  }
  
  return new Uint8Array(await data.arrayBuffer());
}

/**
 * Upload file to R2
 */
async function uploadToR2(
  r2Key: string,
  fileData: Uint8Array,
  contentType: string = 'audio/mpeg'
): Promise<void> {
  // Check if file already exists
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
      })
    );
    console.log(`⏭️  Skipping ${r2Key} (already exists)`);
    return;
  } catch (error: any) {
    // File doesn't exist, proceed with upload
    if (error.name !== 'NotFound') {
      throw error;
    }
  }
  
  // Upload file
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileData,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    })
  );
  
  console.log(`✅ Uploaded ${r2Key}`);
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
 * Main migration function
 */
async function migrateAudio() {
  console.log('🚀 Starting audio migration from Supabase Storage to Cloudflare R2...\n');
  
  try {
    // List all audio files
    const audioFiles = await listSupabaseAudioFiles();
    
    if (audioFiles.length === 0) {
      console.log('⚠️  No audio files found in Supabase Storage');
      return;
    }
    
    console.log(`\n📤 Uploading ${audioFiles.length} files to R2...\n`);
    
    let uploaded = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process files in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < audioFiles.length; i += batchSize) {
      const batch = audioFiles.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (filePath) => {
          try {
            // Use the same path structure in R2
            const r2Key = filePath;
            
            // Check if already uploaded
            if (await fileExistsInR2(r2Key)) {
              skipped++;
              return;
            }
            
            // Download from Supabase
            const fileData = await downloadFromSupabase(filePath);
            
            // Upload to R2
            await uploadToR2(r2Key, fileData);
            uploaded++;
          } catch (error: any) {
            console.error(`❌ Failed to migrate ${filePath}: ${error.message}`);
            errors++;
          }
        })
      );
      
      // Progress update
      if ((i + batchSize) % 100 === 0) {
        console.log(`\n📊 Progress: ${i + batchSize}/${audioFiles.length} files processed`);
      }
    }
    
    console.log('\n✅ Migration completed!');
    console.log(`   Uploaded: ${uploaded}`);
    console.log(`   Skipped (already exists): ${skipped}`);
    console.log(`   Errors: ${errors}`);
    
    // Update database with R2 keys (optional)
    console.log('\n💡 To update database with R2 keys, run the database migration script');
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateAudio();




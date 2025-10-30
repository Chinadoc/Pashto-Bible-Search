/**
 * Delete chapter-level audio files from R2
 * Keeps only individual verse files to save space
 * 
 * Chapter files pattern: {book}_{chapter}.mp3 (e.g., 1-chronicles_1.mp3)
 * Verse files pattern: {book}{chapter}_verse_{verse}.mp3 (keep these)
 */

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET_NAME = 'pashto-bible-audio';

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Missing Cloudflare R2 credentials');
  process.exit(1);
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

/**
 * Check if a file is a chapter file (not a verse file)
 * Chapter files: {book}_{chapter}.mp3 (e.g., 1-chronicles_1.mp3, genesis_1.mp3)
 * Verse files: {book}{chapter}_verse_{verse}.mp3 (keep these)
 */
function isChapterFile(key: string): boolean {
  const filename = key.split('/').pop() || '';
  
  // Always keep verse files
  if (filename.includes('_verse_')) {
    return false;
  }
  
  // Chapter files match pattern: {book}_{chapter}.mp3
  // Examples: 1-chronicles_1.mp3, genesis_1.mp3, matthew_5.mp3
  // Pattern: book name (may have numbers), underscore, chapter number, .mp3
  const chapterPattern = /^[a-z0-9-]+_\d+\.mp3$/i;
  
  return chapterPattern.test(filename);
}

async function listAllObjects(prefix: string = ''): Promise<string[]> {
  console.log(`📖 Listing objects with prefix: ${prefix || '(root)'}...`);
  
  const allKeys: string[] = [];
  let continuationToken: string | undefined;
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });
    
    const response = await r2Client.send(command);
    
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) {
          allKeys.push(obj.Key);
        }
      }
    }
    
    continuationToken = response.NextContinuationToken;
    
    if (allKeys.length % 1000 === 0 && allKeys.length > 0) {
      process.stdout.write(`\r   Found ${allKeys.length} objects...`);
    }
  } while (continuationToken);
  
  console.log(`\n✅ Found ${allKeys.length} total objects`);
  return allKeys;
}

async function deleteObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) {
    console.log('✅ No files to delete');
    return;
  }
  
  console.log(`\n🗑️  Deleting ${keys.length} chapter files...`);
  
  // Delete in batches of 1000 (R2 limit)
  const batchSize = 1000;
  let deleted = 0;
  
  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    
    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: batch.map(key => ({ Key: key })),
        Quiet: false,
      },
    });
    
    try {
      const response = await r2Client.send(command);
      
      if (response.Deleted) {
        deleted += response.Deleted.length;
      }
      
      if (response.Errors && response.Errors.length > 0) {
        console.error(`\n⚠️  Errors deleting batch:`);
        for (const error of response.Errors) {
          console.error(`   ${error.Key}: ${error.Message}`);
        }
      }
      
      process.stdout.write(`\r   Deleted ${deleted}/${keys.length} files...`);
      
      // Small delay to avoid rate limiting
      if ((i + batchSize) < keys.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error: any) {
      console.error(`\n❌ Error deleting batch starting at ${i}: ${error.message}`);
      throw error;
    }
  }
  
  console.log(`\n✅ Successfully deleted ${deleted} chapter files`);
}

async function main() {
  console.log('🚀 Deleting Chapter-Level Audio Files from R2\n');
  console.log('='.repeat(70));
  console.log('📋 Strategy:');
  console.log('   ✅ Keep: Verse files (containing "_verse_")');
  console.log('   ❌ Delete: Chapter files ({book}_{chapter}.mp3)');
  console.log('='.repeat(70) + '\n');
  
  try {
    // List all objects
    const allKeys = await listAllObjects();
    
    // Separate chapter files from verse files
    const chapterFiles: string[] = [];
    const verseFiles: string[] = [];
    const otherFiles: string[] = [];
    
    console.log('\n🔍 Analyzing files...');
    
    for (const key of allKeys) {
      if (isChapterFile(key)) {
        chapterFiles.push(key);
      } else if (key.includes('_verse_')) {
        verseFiles.push(key);
      } else {
        otherFiles.push(key);
      }
    }
    
    console.log(`\n📊 File breakdown:`);
    console.log(`   📝 Verse files (keeping): ${verseFiles.length}`);
    console.log(`   📚 Chapter files (deleting): ${chapterFiles.length}`);
    console.log(`   ❓ Other files: ${otherFiles.length}`);
    
    // Show sample chapter files
    if (chapterFiles.length > 0) {
      console.log(`\n📋 Sample chapter files to delete:`);
      const samples = chapterFiles.slice(0, 20);
      for (const file of samples) {
        console.log(`   - ${file}`);
      }
      if (chapterFiles.length > 20) {
        console.log(`   ... and ${chapterFiles.length - 20} more`);
      }
    }
    
    // Show sample verse files
    if (verseFiles.length > 0) {
      console.log(`\n📋 Sample verse files (keeping):`);
      const samples = verseFiles.slice(0, 10);
      for (const file of samples) {
        console.log(`   ✅ ${file}`);
      }
      if (verseFiles.length > 10) {
        console.log(`   ... and ${verseFiles.length - 10} more`);
      }
    }
    
    // Confirm deletion
    console.log(`\n⚠️  WARNING: About to delete ${chapterFiles.length} chapter files!`);
    console.log('   This will free up storage space but cannot be undone.');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Delete chapter files
    await deleteObjects(chapterFiles);
    
    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Cleanup complete!');
    console.log(`\n📊 Final status:`);
    console.log(`   ✅ Verse files preserved: ${verseFiles.length}`);
    console.log(`   ❌ Chapter files deleted: ${chapterFiles.length}`);
    console.log(`   📁 Other files: ${otherFiles.length}`);
    
    // Verify deletion
    console.log('\n🔍 Verifying deletion...');
    const remainingKeys = await listAllObjects();
    const remainingChapterFiles = remainingKeys.filter(isChapterFile);
    
    if (remainingChapterFiles.length === 0) {
      console.log('✅ All chapter files successfully deleted!');
    } else {
      console.log(`⚠️  Warning: ${remainingChapterFiles.length} chapter files still remain:`);
      remainingChapterFiles.slice(0, 10).forEach(file => {
        console.log(`   - ${file}`);
      });
    }
    
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);


/**
 * Cleanup script to delete root-level verse-X.mp3 files from R2
 */

import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

async function listRootObjects(): Promise<string[]> {
  const objects: string[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: '', // Root level
      Delimiter: '/', // Only get root-level objects
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(command);
    
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Key.match(/^verse-\d+\.mp3$/i)) {
          objects.push(obj.Key);
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

async function deleteObjects(keys: string[]): Promise<void> {
  console.log(`\n🗑️  Deleting ${keys.length} root-level verse-X.mp3 files...\n`);
  
  for (const key of keys) {
    try {
      await r2Client.send(new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }));
      console.log(`   ✅ Deleted: ${key}`);
    } catch (error: any) {
      console.error(`   ❌ Failed to delete ${key}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🧹 Cleaning up root-level verse-X.mp3 files from R2...\n');
  
  const rootFiles = await listRootObjects();
  
  if (rootFiles.length === 0) {
    console.log('✅ No root-level verse-X.mp3 files found. Nothing to delete.');
    return;
  }
  
  console.log(`📋 Found ${rootFiles.length} root-level verse-X.mp3 files:`);
  rootFiles.forEach(file => console.log(`   - ${file}`));
  
  await deleteObjects(rootFiles);
  
  console.log('\n✅ Cleanup complete!');
}

main().catch(console.error);



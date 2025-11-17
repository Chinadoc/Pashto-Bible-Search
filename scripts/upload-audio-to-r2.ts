/**
 * Upload audio files to Cloudflare R2 using AWS SDK
 * This script provides batch upload functionality with progress tracking
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

interface UploadConfig {
  translation: 'afghan2023' | 'yousafzai2019';
  testament: 'ot' | 'nt';
  localDirectory: string;
  bucketName: string;
  skipExisting: boolean;
  dryRun: boolean;
}

interface UploadResult {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{ file: string; error: string }>;
}

class R2AudioUploader {
  private s3Client: S3Client;
  private config: UploadConfig;

  constructor(config: UploadConfig) {
    this.config = config;

    // Initialize S3 client with R2 credentials
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Check if file already exists in R2
   */
  async fileExists(r2Key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucketName,
          Key: r2Key,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Upload a single audio file to R2
   */
  async uploadFile(localPath: string, r2Key: string): Promise<void> {
    const fileBuffer = readFileSync(localPath);
    const fileStats = statSync(localPath);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: 'audio/mpeg',
        ContentLength: fileStats.size,
        Metadata: {
          'original-filename': basename(localPath),
          'upload-timestamp': new Date().toISOString(),
          'translation': this.config.translation,
          'testament': this.config.testament,
        },
      })
    );
  }

  /**
   * Generate R2 key from filename
   */
  generateR2Key(filename: string): string {
    return `${this.config.translation}/${this.config.testament}/${filename}`;
  }

  /**
   * Get all MP3 files from local directory
   */
  getAudioFiles(): string[] {
    const files: string[] = [];

    function scanDirectory(dir: string) {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
          files.push(fullPath);
        }
      }
    }

    scanDirectory(this.config.localDirectory);
    return files;
  }

  /**
   * Upload all audio files
   */
  async uploadAll(): Promise<UploadResult> {
    const result: UploadResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    console.log('🔍 Scanning for audio files...');
    const audioFiles = this.getAudioFiles();
    console.log(`📁 Found ${audioFiles.length} MP3 files\n`);

    if (audioFiles.length === 0) {
      console.log('❌ No MP3 files found in directory');
      return result;
    }

    console.log('📤 Starting upload...\n');

    for (let i = 0; i < audioFiles.length; i++) {
      const filePath = audioFiles[i];
      const filename = basename(filePath);
      const r2Key = this.generateR2Key(filename);
      const progress = `[${i + 1}/${audioFiles.length}]`;

      try {
        // Check if file exists (if skipExisting is enabled)
        if (this.config.skipExisting) {
          const exists = await this.fileExists(r2Key);
          if (exists) {
            console.log(`${progress} ⏭️  Skipped (exists): ${filename}`);
            result.skipped++;
            continue;
          }
        }

        // Dry run mode - don't actually upload
        if (this.config.dryRun) {
          console.log(`${progress} 🔍 Would upload: ${filename} -> ${r2Key}`);
          result.success++;
          continue;
        }

        // Upload the file
        await this.uploadFile(filePath, r2Key);
        console.log(`${progress} ✅ Uploaded: ${filename}`);
        result.success++;
      } catch (error: any) {
        console.error(`${progress} ❌ Failed: ${filename} - ${error.message}`);
        result.failed++;
        result.errors.push({
          file: filename,
          error: error.message,
        });
      }
    }

    return result;
  }

  /**
   * Print upload summary
   */
  printSummary(result: UploadResult) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Upload Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successful:  ${result.success}`);
    console.log(`⏭️  Skipped:     ${result.skipped}`);
    console.log(`❌ Failed:      ${result.failed}`);
    console.log('='.repeat(60));

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      for (const error of result.errors) {
        console.log(`  - ${error.file}: ${error.error}`);
      }
    }
  }
}

/**
 * Main function
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node upload-audio-to-r2.js <translation> <local-directory> [options]');
    console.log('');
    console.log('Arguments:');
    console.log('  translation      afghan2023 or yousafzai2019');
    console.log('  local-directory  Path to directory containing MP3 files');
    console.log('');
    console.log('Options:');
    console.log('  --testament=<ot|nt>  Override testament (default: nt for afghan2023, ot for yousafzai2019)');
    console.log('  --skip-existing      Skip files that already exist in R2');
    console.log('  --dry-run            Show what would be uploaded without uploading');
    console.log('');
    console.log('Environment variables:');
    console.log('  R2_ENDPOINT          R2 endpoint URL');
    console.log('  R2_ACCESS_KEY_ID     R2 access key');
    console.log('  R2_SECRET_ACCESS_KEY R2 secret key');
    console.log('');
    console.log('Examples:');
    console.log('  npm run upload-audio afghan2023 ./audio/afghan2023/');
    console.log('  npm run upload-audio yousafzai2019 ./audio/yousafzai/ --skip-existing');
    console.log('  npm run upload-audio afghan2023 ./audio/afghan2023/ --dry-run');
    process.exit(1);
  }

  const translation = args[0] as 'afghan2023' | 'yousafzai2019';
  const localDirectory = args[1];

  // Parse options
  const testament = args.find(arg => arg.startsWith('--testament='))?.split('=')[1] as 'ot' | 'nt' ||
    (translation === 'afghan2023' ? 'nt' : 'ot');
  const skipExisting = args.includes('--skip-existing');
  const dryRun = args.includes('--dry-run');

  // Validate translation
  if (!['afghan2023', 'yousafzai2019'].includes(translation)) {
    console.error('❌ Error: Invalid translation. Must be "afghan2023" or "yousafzai2019"');
    process.exit(1);
  }

  // Check environment variables
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ Error: Missing R2 credentials');
    console.error('Set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables');
    console.error('');
    console.error('You can find these in .dev.vars file or Cloudflare dashboard');
    process.exit(1);
  }

  // Configuration
  const config: UploadConfig = {
    translation,
    testament,
    localDirectory,
    bucketName: 'pashto-bible-audio',
    skipExisting,
    dryRun,
  };

  console.log('🚀 Cloudflare R2 Audio Uploader');
  console.log('='.repeat(60));
  console.log(`Translation:     ${config.translation}`);
  console.log(`Testament:       ${config.testament}`);
  console.log(`Local directory: ${config.localDirectory}`);
  console.log(`R2 bucket:       ${config.bucketName}`);
  console.log(`Skip existing:   ${config.skipExisting ? 'Yes' : 'No'}`);
  console.log(`Dry run:         ${config.dryRun ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));
  console.log('');

  // Create uploader and run
  const uploader = new R2AudioUploader(config);

  try {
    const result = await uploader.uploadAll();
    uploader.printSummary(result);

    // Exit with error code if there were failures
    if (result.failed > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { R2AudioUploader, UploadConfig, UploadResult };

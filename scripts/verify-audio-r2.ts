/**
 * Verify audio files in R2 and update D1 database
 * This script checks which audio files exist in R2 and updates the verses table
 */

import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';

interface VerifyConfig {
  translation: 'afghan2023' | 'yousafzai2019';
  testament: 'ot' | 'nt';
  bucketName: string;
  d1DatabaseId?: string;
  updateD1: boolean;
}

interface VerifyResult {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  missingInD1: number;
  files: Array<{
    key: string;
    size: number;
    ref: string | null;
  }>;
}

class R2AudioVerifier {
  private s3Client: S3Client;
  private config: VerifyConfig;

  constructor(config: VerifyConfig) {
    this.config = config;

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
   * List all audio files in R2 with given prefix
   */
  async listAudioFiles(): Promise<Array<{ key: string; size: number }>> {
    const prefix = `${this.config.translation}/${this.config.testament}/`;
    const files: Array<{ key: string; size: number }> = [];

    let continuationToken: string | undefined;

    do {
      const response = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.config.bucketName,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      );

      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key && object.Key.endsWith('.mp3')) {
            files.push({
              key: object.Key,
              size: object.Size || 0,
            });
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return files;
  }

  /**
   * Parse R2 key to extract verse reference
   * Format: afghan2023/nt/matthew1_verse_001.mp3 -> Matthew 1:1
   */
  parseR2Key(r2Key: string): { book: string; chapter: number; verse: number } | null {
    const prefix = `${this.config.translation}/${this.config.testament}/`;

    if (!r2Key.startsWith(prefix)) {
      return null;
    }

    const filename = r2Key.substring(prefix.length).replace('.mp3', '');

    // Pattern: bookname{chapter}_verse_{verse_padded}
    // Examples: matthew1_verse_001, 1john3_verse_016
    const match = filename.match(/^(.+?)(\d+)_verse_(\d+)$/);

    if (!match) {
      return null;
    }

    const bookSlug = match[1];
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);

    // Convert book slug back to proper book name
    const book = this.slugToBookName(bookSlug);

    return { book, chapter, verse };
  }

  /**
   * Convert book slug back to proper book name
   * Examples: "matthew" -> "Matthew", "1john" -> "1 John"
   */
  slugToBookName(slug: string): string {
    // Common book mappings
    const bookMap: Record<string, string> = {
      // New Testament
      'matthew': 'Matthew',
      'mark': 'Mark',
      'luke': 'Luke',
      'john': 'John',
      'acts': 'Acts',
      'romans': 'Romans',
      '1corinthians': '1 Corinthians',
      '2corinthians': '2 Corinthians',
      'galatians': 'Galatians',
      'ephesians': 'Ephesians',
      'philippians': 'Philippians',
      'colossians': 'Colossians',
      '1thessalonians': '1 Thessalonians',
      '2thessalonians': '2 Thessalonians',
      '1timothy': '1 Timothy',
      '2timothy': '2 Timothy',
      'titus': 'Titus',
      'philemon': 'Philemon',
      'hebrews': 'Hebrews',
      'james': 'James',
      '1peter': '1 Peter',
      '2peter': '2 Peter',
      '1john': '1 John',
      '2john': '2 John',
      '3john': '3 John',
      'jude': 'Jude',
      'revelation': 'Revelation',
      // Old Testament
      'genesis': 'Genesis',
      'exodus': 'Exodus',
      'leviticus': 'Leviticus',
      'numbers': 'Numbers',
      'deuteronomy': 'Deuteronomy',
      'joshua': 'Joshua',
      'judges': 'Judges',
      'ruth': 'Ruth',
      '1samuel': '1 Samuel',
      '2samuel': '2 Samuel',
      '1kings': '1 Kings',
      '2kings': '2 Kings',
      '1chronicles': '1 Chronicles',
      '2chronicles': '2 Chronicles',
      'ezra': 'Ezra',
      'nehemiah': 'Nehemiah',
      'esther': 'Esther',
      'job': 'Job',
      'psalm': 'Psalm',
      'psalms': 'Psalms',
      'proverbs': 'Proverbs',
      'ecclesiastes': 'Ecclesiastes',
      'songofsolomon': 'Song of Solomon',
      'isaiah': 'Isaiah',
      'jeremiah': 'Jeremiah',
      'lamentations': 'Lamentations',
      'ezekiel': 'Ezekiel',
      'daniel': 'Daniel',
      'hosea': 'Hosea',
      'joel': 'Joel',
      'amos': 'Amos',
      'obadiah': 'Obadiah',
      'jonah': 'Jonah',
      'micah': 'Micah',
      'nahum': 'Nahum',
      'habakkuk': 'Habakkuk',
      'zephaniah': 'Zephaniah',
      'haggai': 'Haggai',
      'zechariah': 'Zechariah',
      'malachi': 'Malachi',
    };

    return bookMap[slug] || slug;
  }

  /**
   * Verify all audio files and generate report
   */
  async verifyAll(): Promise<VerifyResult> {
    console.log('🔍 Listing audio files in R2...');
    const files = await this.listAudioFiles();

    console.log(`📁 Found ${files.length} audio files\n`);

    const result: VerifyResult = {
      totalFiles: files.length,
      validFiles: 0,
      invalidFiles: 0,
      missingInD1: 0,
      files: [],
    };

    for (const file of files) {
      const parsed = this.parseR2Key(file.key);

      if (parsed) {
        const ref = `${parsed.book} ${parsed.chapter}:${parsed.verse}`;
        result.validFiles++;
        result.files.push({
          key: file.key,
          size: file.size,
          ref,
        });
        console.log(`✅ ${ref.padEnd(20)} -> ${file.key} (${this.formatSize(file.size)})`);
      } else {
        result.invalidFiles++;
        result.files.push({
          key: file.key,
          size: file.size,
          ref: null,
        });
        console.log(`❌ Invalid format: ${file.key}`);
      }
    }

    return result;
  }

  /**
   * Format file size in human-readable format
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Generate SQL to update D1 database
   */
  generateUpdateSQL(): string {
    const table = this.config.translation === 'afghan2023' ? 'verses_afghan2023' : 'verses_yousafzai';
    const translation = this.config.translation;
    const testament = this.config.testament.toUpperCase();

    return `-- Update audio_r2_key for ${translation} ${testament} verses
UPDATE ${table}
SET audio_r2_key = '${translation}/${this.config.testament}/' ||
                   lower(replace(book, ' ', '')) ||
                   chapter ||
                   '_verse_' ||
                   printf('%03d', verse) ||
                   '.mp3'
WHERE testament = '${testament}' AND audio_r2_key IS NULL;

-- Verify update
SELECT book, chapter, verse, audio_r2_key
FROM ${table}
WHERE testament = '${testament}' AND audio_r2_key IS NOT NULL
LIMIT 10;`;
  }

  /**
   * Print verification summary
   */
  printSummary(result: VerifyResult) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Verification Summary');
    console.log('='.repeat(60));
    console.log(`Total files:     ${result.totalFiles}`);
    console.log(`✅ Valid files:   ${result.validFiles}`);
    console.log(`❌ Invalid files: ${result.invalidFiles}`);
    console.log('='.repeat(60));

    if (this.config.updateD1) {
      console.log('\n📝 SQL to update D1 database:');
      console.log('='.repeat(60));
      console.log(this.generateUpdateSQL());
      console.log('='.repeat(60));
      console.log('\nTo apply these changes, run:');
      console.log(`wrangler d1 execute ${this.config.d1DatabaseId} --command "..."`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node verify-audio-r2.js <translation> [options]');
    console.log('');
    console.log('Arguments:');
    console.log('  translation   afghan2023 or yousafzai2019');
    console.log('');
    console.log('Options:');
    console.log('  --testament=<ot|nt>     Override testament (default: nt for afghan2023, ot for yousafzai2019)');
    console.log('  --update-d1             Generate SQL to update D1 database');
    console.log('  --d1-db-id=<id>         D1 database ID (for update command)');
    console.log('');
    console.log('Environment variables:');
    console.log('  R2_ENDPOINT             R2 endpoint URL');
    console.log('  R2_ACCESS_KEY_ID        R2 access key');
    console.log('  R2_SECRET_ACCESS_KEY    R2 secret key');
    console.log('');
    console.log('Examples:');
    console.log('  npm run verify-audio afghan2023');
    console.log('  npm run verify-audio yousafzai2019 --update-d1 --d1-db-id=abc123');
    process.exit(1);
  }

  const translation = args[0] as 'afghan2023' | 'yousafzai2019';

  // Parse options
  const testament = args.find(arg => arg.startsWith('--testament='))?.split('=')[1] as 'ot' | 'nt' ||
    (translation === 'afghan2023' ? 'nt' : 'ot');
  const updateD1 = args.includes('--update-d1');
  const d1DatabaseId = args.find(arg => arg.startsWith('--d1-db-id='))?.split('=')[1] || 'pashto-bible-db';

  // Validate translation
  if (!['afghan2023', 'yousafzai2019'].includes(translation)) {
    console.error('❌ Error: Invalid translation. Must be "afghan2023" or "yousafzai2019"');
    process.exit(1);
  }

  // Check environment variables
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ Error: Missing R2 credentials');
    console.error('Set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables');
    process.exit(1);
  }

  const config: VerifyConfig = {
    translation,
    testament,
    bucketName: 'pashto-bible-audio',
    d1DatabaseId,
    updateD1,
  };

  console.log('🔍 Cloudflare R2 Audio Verifier');
  console.log('='.repeat(60));
  console.log(`Translation:  ${config.translation}`);
  console.log(`Testament:    ${config.testament}`);
  console.log(`R2 bucket:    ${config.bucketName}`);
  console.log(`Update D1:    ${config.updateD1 ? 'Yes' : 'No'}`);
  console.log('='.repeat(60));
  console.log('');

  const verifier = new R2AudioVerifier(config);

  try {
    const result = await verifier.verifyAll();
    verifier.printSummary(result);
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { R2AudioVerifier, VerifyConfig, VerifyResult };

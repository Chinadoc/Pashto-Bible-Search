#!/usr/bin/env node
/**
 * Catalog and analyze all audio files in Cloudflare R2
 * Generates comprehensive coverage report by translation, testament, and book
 */

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

interface AudioFile {
  key: string;
  size: number;
  lastModified: Date;
  translation: 'afghan2023' | 'yousafzai2019' | 'unknown';
  testament: 'ot' | 'nt' | 'unknown';
  book: string;
  chapter: number;
  verse: number;
  ref: string;
}

interface BookStats {
  name: string;
  chapters: Set<number>;
  verses: number;
  totalSize: number;
}

interface TranslamentStats {
  name: string;
  translation: string;
  testament: string;
  files: number;
  verses: number;
  books: Map<string, BookStats>;
  totalSize: number;
}

interface CoverageReport {
  totalFiles: number;
  totalSize: number;
  translations: {
    afghan2023: {
      nt: TranslamentStats;
      ot: TranslamentStats;
    };
    yousafzai2019: {
      nt: TranslamentStats;
      ot: TranslamentStats;
    };
  };
  invalidFiles: string[];
}

class R2AudioCatalog {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(bucketName: string = 'pashto-bible-audio') {
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true, // Required for R2 compatibility
    });
  }

  /**
   * List all files in R2 bucket
   */
  async listAllFiles(): Promise<Array<{ key: string; size: number; lastModified: Date }>> {
    const files: Array<{ key: string; size: number; lastModified: Date }> = [];
    let continuationToken: string | undefined;

    console.log('🔍 Scanning R2 bucket:', this.bucketName);
    console.log('');

    do {
      const response = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          ContinuationToken: continuationToken,
        })
      );

      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key && object.Key.endsWith('.mp3')) {
            files.push({
              key: object.Key,
              size: object.Size || 0,
              lastModified: object.LastModified || new Date(),
            });
          }
        }
      }

      continuationToken = response.NextContinuationToken;
      process.stdout.write(`\rFound ${files.length} audio files...`);
    } while (continuationToken);

    console.log('\n');
    return files;
  }

  /**
   * Parse R2 key to extract metadata
   * Format: {translation}/{testament}/{bookslug}{chapter}_verse_{verse}.mp3
   */
  parseAudioFile(key: string, size: number, lastModified: Date): AudioFile | null {
    const parts = key.split('/');

    if (parts.length < 3) {
      return null;
    }

    const translation = parts[0] as 'afghan2023' | 'yousafzai2019' | 'unknown';
    const testament = parts[1] as 'ot' | 'nt' | 'unknown';
    const filename = parts[2].replace('.mp3', '');

    // Parse filename: bookname{chapter}_verse_{verse}
    const match = filename.match(/^(.+?)(\d+)_verse_(\d+)$/);

    if (!match) {
      return null;
    }

    const bookSlug = match[1];
    const chapter = parseInt(match[2], 10);
    const verse = parseInt(match[3], 10);

    const book = this.slugToBookName(bookSlug);
    const ref = `${book} ${chapter}:${verse}`;

    return {
      key,
      size,
      lastModified,
      translation,
      testament,
      book,
      chapter,
      verse,
      ref,
    };
  }

  /**
   * Convert book slug to proper book name
   */
  slugToBookName(slug: string): string {
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
      'song': 'Song of Solomon',
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
   * Create empty translation/testament stats
   */
  createEmptyStats(name: string, translation: string, testament: string): TranslamentStats {
    return {
      name,
      translation,
      testament,
      files: 0,
      verses: 0,
      books: new Map<string, BookStats>(),
      totalSize: 0,
    };
  }

  /**
   * Analyze all files and generate coverage report
   */
  async generateReport(): Promise<CoverageReport> {
    const files = await this.listAllFiles();

    const report: CoverageReport = {
      totalFiles: files.length,
      totalSize: 0,
      translations: {
        afghan2023: {
          nt: this.createEmptyStats('Afghan 2023 - New Testament', 'afghan2023', 'nt'),
          ot: this.createEmptyStats('Afghan 2023 - Old Testament', 'afghan2023', 'ot'),
        },
        yousafzai2019: {
          nt: this.createEmptyStats('Yousafzai 2019 - New Testament', 'yousafzai2019', 'nt'),
          ot: this.createEmptyStats('Yousafzai 2019 - Old Testament', 'yousafzai2019', 'ot'),
        },
      },
      invalidFiles: [],
    };

    console.log('📊 Analyzing audio files...\n');

    for (const file of files) {
      const parsed = this.parseAudioFile(file.key, file.size, file.lastModified);

      if (!parsed) {
        report.invalidFiles.push(file.key);
        continue;
      }

      report.totalSize += file.size;

      // Get the appropriate stats object
      let stats: TranslamentStats | undefined;
      if (parsed.translation === 'afghan2023' && parsed.testament === 'nt') {
        stats = report.translations.afghan2023.nt;
      } else if (parsed.translation === 'afghan2023' && parsed.testament === 'ot') {
        stats = report.translations.afghan2023.ot;
      } else if (parsed.translation === 'yousafzai2019' && parsed.testament === 'nt') {
        stats = report.translations.yousafzai2019.nt;
      } else if (parsed.translation === 'yousafzai2019' && parsed.testament === 'ot') {
        stats = report.translations.yousafzai2019.ot;
      }

      if (!stats) continue;

      // Update stats
      stats.files++;
      stats.verses++;
      stats.totalSize += file.size;

      // Update book stats
      if (!stats.books.has(parsed.book)) {
        stats.books.set(parsed.book, {
          name: parsed.book,
          chapters: new Set<number>(),
          verses: 0,
          totalSize: 0,
        });
      }

      const bookStats = stats.books.get(parsed.book)!;
      bookStats.chapters.add(parsed.chapter);
      bookStats.verses++;
      bookStats.totalSize += file.size;
    }

    return report;
  }

  /**
   * Format file size in human-readable format
   */
  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  /**
   * Print detailed report
   */
  printReport(report: CoverageReport) {
    console.log('═'.repeat(80));
    console.log('📊 R2 AUDIO CATALOG - COMPREHENSIVE COVERAGE REPORT');
    console.log('═'.repeat(80));
    console.log('');
    console.log(`Total Files:  ${report.totalFiles.toLocaleString()}`);
    console.log(`Total Size:   ${this.formatSize(report.totalSize)}`);
    console.log('');

    // Print each translation/testament combination
    const sections = [
      { key: 'afghan2023-nt', stats: report.translations.afghan2023.nt, emoji: '🇦🇫 📖' },
      { key: 'afghan2023-ot', stats: report.translations.afghan2023.ot, emoji: '🇦🇫 📜' },
      { key: 'yousafzai2019-nt', stats: report.translations.yousafzai2019.nt, emoji: '📗 📖' },
      { key: 'yousafzai2019-ot', stats: report.translations.yousafzai2019.ot, emoji: '📗 📜' },
    ];

    for (const section of sections) {
      this.printTranslamentStats(section.emoji, section.stats);
    }

    // Print invalid files if any
    if (report.invalidFiles.length > 0) {
      console.log('═'.repeat(80));
      console.log('⚠️  INVALID FILES');
      console.log('═'.repeat(80));
      console.log('');
      for (const file of report.invalidFiles) {
        console.log(`  ❌ ${file}`);
      }
      console.log('');
    }
  }

  /**
   * Print stats for a specific translation/testament
   */
  printTranslamentStats(emoji: string, stats: TranslamentStats) {
    console.log('═'.repeat(80));
    console.log(`${emoji}  ${stats.name.toUpperCase()}`);
    console.log('═'.repeat(80));
    console.log('');
    console.log(`Files:   ${stats.files.toLocaleString()}`);
    console.log(`Verses:  ${stats.verses.toLocaleString()}`);
    console.log(`Books:   ${stats.books.size}`);
    console.log(`Size:    ${this.formatSize(stats.totalSize)}`);
    console.log('');

    if (stats.books.size > 0) {
      console.log('Books Coverage:');
      console.log('─'.repeat(80));

      // Sort books by verses (descending)
      const sortedBooks = Array.from(stats.books.values()).sort((a, b) => b.verses - a.verses);

      for (const book of sortedBooks) {
        const chapterCount = book.chapters.size;
        const chapterList = Array.from(book.chapters).sort((a, b) => a - b);
        const chapterRange =
          chapterCount > 0
            ? chapterCount === 1
              ? `ch.${chapterList[0]}`
              : `ch.${chapterList[0]}-${chapterList[chapterList.length - 1]}`
            : '';

        console.log(
          `  ${book.name.padEnd(20)} │ ${String(book.verses).padStart(5)} verses │ ` +
            `${String(chapterCount).padStart(3)} chapters │ ${chapterRange.padEnd(12)} │ ` +
            `${this.formatSize(book.totalSize).padStart(10)}`
        );
      }

      console.log('');
    } else {
      console.log('  ⚠️  No audio files found\n');
    }
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(report: CoverageReport): string {
    const jsonReport = {
      summary: {
        totalFiles: report.totalFiles,
        totalSize: report.totalSize,
        totalSizeFormatted: this.formatSize(report.totalSize),
        generatedAt: new Date().toISOString(),
      },
      translations: {
        afghan2023: {
          nt: this.translamentStatsToJSON(report.translations.afghan2023.nt),
          ot: this.translamentStatsToJSON(report.translations.afghan2023.ot),
        },
        yousafzai2019: {
          nt: this.translamentStatsToJSON(report.translations.yousafzai2019.nt),
          ot: this.translamentStatsToJSON(report.translations.yousafzai2019.ot),
        },
      },
      invalidFiles: report.invalidFiles,
    };

    return JSON.stringify(jsonReport, null, 2);
  }

  /**
   * Convert TranslamentStats to JSON-serializable format
   */
  translamentStatsToJSON(stats: TranslamentStats) {
    return {
      name: stats.name,
      files: stats.files,
      verses: stats.verses,
      bookCount: stats.books.size,
      totalSize: stats.totalSize,
      totalSizeFormatted: this.formatSize(stats.totalSize),
      books: Array.from(stats.books.values()).map(book => ({
        name: book.name,
        verses: book.verses,
        chapters: Array.from(book.chapters).sort((a, b) => a - b),
        chapterCount: book.chapters.size,
        totalSize: book.totalSize,
        totalSizeFormatted: this.formatSize(book.totalSize),
      })),
    };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node catalog-r2-audio.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --json          Output report as JSON');
    console.log('  --output=FILE   Save report to file (use with --json)');
    console.log('  --help, -h      Show this help message');
    console.log('');
    console.log('Environment variables:');
    console.log('  R2_ENDPOINT          R2 endpoint URL');
    console.log('  R2_ACCESS_KEY_ID     R2 access key');
    console.log('  R2_SECRET_ACCESS_KEY R2 secret key');
    console.log('');
    console.log('Example:');
    console.log('  node catalog-r2-audio.js');
    console.log('  node catalog-r2-audio.js --json --output=coverage.json');
    process.exit(0);
  }

  // Check environment variables
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('❌ Error: Missing R2 credentials');
    console.error('Set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables');
    console.error('');
    console.error('These should be in your .dev.vars file');
    process.exit(1);
  }

  const jsonOutput = args.includes('--json');
  const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

  const catalog = new R2AudioCatalog();

  try {
    const report = await catalog.generateReport();

    if (jsonOutput) {
      const json = catalog.generateJSONReport(report);

      if (outputFile) {
        const fs = require('fs');
        fs.writeFileSync(outputFile, json);
        console.log(`✅ Report saved to: ${outputFile}`);
      } else {
        console.log(json);
      }
    } else {
      catalog.printReport(report);
    }

    console.log('✅ Catalog complete!');
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { R2AudioCatalog };

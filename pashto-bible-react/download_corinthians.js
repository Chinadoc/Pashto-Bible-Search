#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

class CorinthiansDownloader {
  constructor() {
    this.baseUrl = 'https://afghanbibles.org';
    this.audioBaseUrl = 'https://afghanbibles.org/pashto-afeastern-audio';
    this.outputDir = path.join(__dirname, 'corinthians_audio');
    this.chapters = {
      '1-corinthians': 16,
      '2-corinthians': 13
    };
  }

  async init() {
    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Create subdirectories for each book
    Object.keys(this.chapters).forEach(book => {
      const bookDir = path.join(this.outputDir, book);
      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir, { recursive: true });
      }
    });
  }

  async downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(outputPath);
      const request = https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${outputPath}`);
          resolve(outputPath);
        });
      });

      request.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });

      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    });
  }

  async getChapterVerses(book, chapter) {
    try {
      const url = `${this.baseUrl}/eng/pashto-bible/${book}/${book}-${chapter}`;
      console.log(`Fetching chapter info: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Extract verse numbers from the HTML - look for verse content
      // The verses appear to be in the main content area
      const verseRegex = /(\d+)\s*([^<\d\n]+)/g;
      const verses = [];
      let match;

      // Look for numbered content that might be verses
      while ((match = verseRegex.exec(html)) !== null) {
        const verseNum = parseInt(match[1]);
        if (verseNum > 0 && verseNum < 100) { // Reasonable verse range
          verses.push(verseNum);
        }
      }

      // Alternative: Look for superscript numbers or verse markers
      const supRegex = /<sup[^>]*>(\d+)<\/sup>/gi;
      while ((match = supRegex.exec(html)) !== null) {
        const verseNum = parseInt(match[1]);
        if (!verses.includes(verseNum)) {
          verses.push(verseNum);
        }
      }

      // If no verses found with regex, try to estimate based on chapter length
      if (verses.length === 0) {
        console.log(`No verses detected with regex for ${book} ${chapter}, estimating...`);
        // Return a reasonable estimate - most chapters have 10-50 verses
        return Array.from({ length: 25 }, (_, i) => i + 1);
      }

      // Sort and remove duplicates
      const uniqueVerses = [...new Set(verses)].sort((a, b) => a - b);

      console.log(`Found ${uniqueVerses.length} verses in ${book} ${chapter}:`, uniqueVerses.slice(0, 10), uniqueVerses.length > 10 ? '...' : '');
      return uniqueVerses;

    } catch (error) {
      console.error(`Error fetching chapter ${book}-${chapter}:`, error.message);
      return [];
    }
  }

  async downloadChapter(book, chapter) {
    const audioUrl = `${this.audioBaseUrl}/${book}-${chapter}.mp3?inline=mp3`;
    const outputPath = path.join(this.outputDir, book, `${book}-${chapter}.mp3`);

    try {
      console.log(`Downloading ${book} chapter ${chapter}...`);
      await this.downloadFile(audioUrl, outputPath);
      return outputPath;
    } catch (error) {
      console.error(`Failed to download ${book} ${chapter}:`, error.message);
      return null;
    }
  }

  async splitIntoVerses(book, chapter, downloadedFile) {
    // For now, we'll create placeholder verse files
    // In a real implementation, you'd need to:
    // 1. Parse the jktags or use some other method to identify verse boundaries
    // 2. Use ffmpeg or similar to split the audio file

    const verses = await this.getChapterVerses(book, chapter);
    const verseDir = path.join(this.outputDir, book, `chapter-${chapter}-verses`);

    if (!fs.existsSync(verseDir)) {
      fs.mkdirSync(verseDir, { recursive: true });
    }

    console.log(`Creating ${verses.length} verse files for ${book} ${chapter}...`);

    // For now, create empty files as placeholders
    // You'd replace this with actual audio splitting logic
    for (const verse of verses) {
      const versePath = path.join(verseDir, `${book}-${chapter}-${verse}.mp3`);
      try {
        // Copy the full chapter file as a placeholder
        // In production, you'd split based on time markers
        fs.copyFileSync(downloadedFile, versePath);
        console.log(`Created: ${versePath}`);
      } catch (error) {
        console.error(`Failed to create verse file: ${versePath}`, error.message);
      }
    }

    return verses.length;
  }

  async processAllChapters() {
    await this.init();

    for (const [book, chapterCount] of Object.entries(this.chapters)) {
      console.log(`\n=== Processing ${book} ===`);

      for (let chapter = 1; chapter <= chapterCount; chapter++) {
        console.log(`\n--- Chapter ${chapter} ---`);

        // Download the full chapter
        const downloadedFile = await this.downloadChapter(book, chapter);

        if (downloadedFile) {
          // Split into verses
          await this.splitIntoVerses(book, chapter, downloadedFile);
        }

        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n=== Download Complete ===');
    console.log(`Files saved to: ${this.outputDir}`);
  }

  async run() {
    try {
      await this.processAllChapters();
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the downloader
if (require.main === module) {
  const downloader = new CorinthiansDownloader();
  downloader.run();
}

module.exports = CorinthiansDownloader;

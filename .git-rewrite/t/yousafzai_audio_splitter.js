#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

class YousafzaiAudioSplitter {
  constructor() {
    this.baseUrl = 'https://afghanbibles.org';
    this.audioBaseUrl = 'https://afghanbibles.org/pashto-yusufzai-audio';
    this.outputDir = path.join(__dirname, 'yousafzai_split_audio');
    this.dialectQuery = 'yusufzai';
    
    // Books to process (just Psalms and Proverbs for Yousafzai)
    this.books = {
      'psalms': 150,
      'proverbs': 31
    };
  }

  async getChapterInfo(book, chapter) {
    try {
      const url = `${this.baseUrl}/eng/pashto-bible/${book}/${book}-${chapter}?prefdialect=${this.dialectQuery}`;
      console.log(`Fetching chapter info: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Get jktags using the correct pattern
      const jktagsMatch = html.match(/id=["']jktags["'][^>]*data-tags=["']([^"']+)["']/);
      const jktags = jktagsMatch ? jktagsMatch[1] : null;

      // Get verse count by counting verse spans
      const verseSpanMatches = html.match(/class=["']verseno\b[^"']*["'][^>]*>/g) || [];
      const verseCount = verseSpanMatches.length || 0;

      console.log(`Chapter ${chapter}: verses=${verseCount}, jktags=${jktags ? 'found' : 'not found'}`);

      return { jktags, verseCount, html };

    } catch (error) {
      console.error(`Error fetching chapter ${chapter}:`, error.message);
      return null;
    }
  }

  // Use the exact decoder from your proper_audio_splitter.js
  decodeJktagsVerses(jktags, expectedVerses) {
    try {
      const rev = jktags.split('').reverse().join('')
        .replace(/&41/g, '====').replace(/&3/g, '===').replace(/&2/g, '==').replace(/&1/g, '=');
      
      const rot = rev.replace(/[a-zA-Z]/g, c => {
        const code = c.charCodeAt(0);
        const base = code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + 13) % 26) + base);
      });
      
      const decoded = Buffer.from(rot, 'base64').toString('utf8');
      const tuples = JSON.parse('[' + decoded + ']');
      
      // Collect earliest start per verse number
      const verseStart = new Map();
      for (const t of tuples) {
        if (!Array.isArray(t) || t.length < 3) continue;
        const start = Number(t[0]);
        const tag = t[2];
        if (Number.isFinite(start) && typeof tag === 'number' && tag > 0 && tag < 1000) {
          const v = tag | 0;
          if (!verseStart.has(v) || start < verseStart.get(v)) verseStart.set(v, start);
        }
      }
      
      // Build markers list sorted by verse number
      const verses = expectedVerses && expectedVerses > 0 ? expectedVerses : Math.max(...Array.from(verseStart.keys()));
      const markers = [];
      for (let v = 1; v <= verses; v++) {
        const s = verseStart.get(v);
        if (typeof s === 'number') markers.push({ verse: v, startTime: Math.round(s * 100) / 100 }); // Round to 2 decimal places
      }
      return markers;
    } catch (error) {
      console.error('Error decoding jktags:', error);
      return [];
    }
  }

  async downloadAudioFile(book, chapter) {
    const audioUrl = `${this.audioBaseUrl}/${book}-${chapter}.mp3`;
    const outputPath = path.join(this.outputDir, `${book}-${chapter}.mp3`);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Skip if already exists
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      console.log(`Already downloaded: ${outputPath}`);
      return outputPath;
    }

    return new Promise((resolve, reject) => {
      console.log(`Downloading: ${audioUrl}`);
      const file = fs.createWriteStream(outputPath);

      const request = https.get(audioUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
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

  async splitAudioFile(inputFile, markers, outputDir, book, chapter) {
    console.log(`Splitting ${inputFile} into ${markers.length} verses...`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if ffmpeg is available
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' });
    } catch (error) {
      console.error('ffmpeg not found. Please install ffmpeg to split audio files.');
      console.log('On macOS: brew install ffmpeg');
      console.log('On Ubuntu: sudo apt install ffmpeg');
      return [];
    }

    const clipFiles = [];

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const nextMarker = markers[i + 1];

      const startTime = marker.startTime;
      const duration = nextMarker ? nextMarker.startTime - startTime : 10; // Default 10s for last verse

      // Create filename matching Supabase pattern: yousafzai_psalms001_verse_001.mp3
      const fileName = `yousafzai_${book}${chapter.toString().padStart(3, '0')}_verse_${marker.verse.toString().padStart(3, '0')}.mp3`;
      const outputFile = path.join(outputDir, fileName);

      // Skip if already exists
      if (fs.existsSync(outputFile) && fs.statSync(outputFile).size > 0) {
        console.log(`Already exists: ${fileName}`);
        clipFiles.push({ fileName, verse: marker.verse, startTime, duration });
        continue;
      }

      try {
        // Add small padding to avoid clipping
        const paddedStart = Math.max(0, startTime - 0.15);
        const paddedDuration = duration + 0.4;

        const ffmpegCmd = `ffmpeg -ss ${paddedStart} -i "${inputFile}" -t ${paddedDuration} -c:a libmp3lame -ar 44100 -ac 1 -q:a 4 -af aresample=async=1:first_pts=0 "${outputFile}" -y`;

        console.log(`Creating verse ${marker.verse} (start: ${startTime}s, duration: ${duration}s)`);
        execSync(ffmpegCmd, { stdio: 'pipe' });

        clipFiles.push({ fileName, verse: marker.verse, startTime, duration, filePath: outputFile });

      } catch (error) {
        console.error(`Failed to create verse ${marker.verse}:`, error.message);
      }
    }

    return clipFiles;
  }

  async processChapter(book, chapter) {
    try {
      console.log(`\n=== Processing ${book.toUpperCase()} Chapter ${chapter} ===`);

      // Get chapter info and jktags
      const chapterInfo = await this.getChapterInfo(book, chapter);
      if (!chapterInfo) {
        console.log(`Skipping ${book} ${chapter} - could not fetch info`);
        return [];
      }

      const { jktags, verseCount } = chapterInfo;

      if (!jktags) {
        console.log(`Skipping ${book} ${chapter} - no jktags found`);
        return [];
      }

      // Decode markers from jktags
      const markers = this.decodeJktagsVerses(jktags, verseCount);
      console.log(`Decoded ${markers.length} markers from jktags`);

      if (markers.length === 0) {
        console.log(`No valid markers for ${book} ${chapter}`);
        return [];
      }

      // Download audio file
      const audioFile = await this.downloadAudioFile(book, chapter);

      // Create verse output directory
      const verseOutputDir = path.join(this.outputDir, book, `chapter-${chapter}-verses`);

      // Split audio
      const clipFiles = await this.splitAudioFile(audioFile, markers, verseOutputDir, book, chapter);

      console.log(`✅ Completed ${book} Chapter ${chapter} - ${clipFiles.length} verses created`);
      return clipFiles;

    } catch (error) {
      console.error(`❌ Error processing ${book} ${chapter}:`, error.message);
      return [];
    }
  }

  async processBook(book, startChapter = 1, endChapter = null) {
    const totalChapters = this.books[book];
    if (!totalChapters) {
      console.error(`Unknown book: ${book}`);
      return;
    }

    const end = endChapter || totalChapters;
    const allClips = [];

    for (let chapter = startChapter; chapter <= end; chapter++) {
      const clips = await this.processChapter(book, chapter);
      allClips.push(...clips);

      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n🎉 Completed ${book}: ${allClips.length} total verse clips`);
    return allClips;
  }

  async run() {
    try {
      const arg1 = process.argv[2];
      const arg2 = process.argv[3];
      const arg3 = process.argv[4];

      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      if (arg1 && this.books[arg1]) {
        // Process specific book: node yousafzai_audio_splitter.js psalms [start] [end]
        const start = arg2 ? parseInt(arg2) : 1;
        const end = arg3 ? parseInt(arg3) : null;
        await this.processBook(arg1, start, end);
      } else if (arg1 === 'test') {
        // Test with just Psalms 1-2
        await this.processBook('psalms', 1, 2);
      } else {
        // Process all books
        for (const book of Object.keys(this.books)) {
          await this.processBook(book);
        }
      }

      console.log(`\n📁 All files saved to: ${this.outputDir}`);

    } catch (error) {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the splitter
if (require.main === module) {
  const splitter = new YousafzaiAudioSplitter();
  splitter.run();
}

module.exports = YousafzaiAudioSplitter;




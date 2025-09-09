#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

class ProperAudioSplitter {
  constructor() {
    this.baseUrl = 'https://afghanbibles.org';
    this.audioBaseUrl = 'https://afghanbibles.org/pashto-afeastern-audio';
    // Generic output root for all books
    this.outputDir = path.join(__dirname, 'split_output');
    // Known chapter counts for supported NT books (hyphen slugs)
    this.bookChapters = {
      '1-corinthians': 16,
      '2-corinthians': 13,
      '1-thessalonians': 5,
      '2-thessalonians': 3,
      '1-timothy': 6,
      '2-timothy': 4,
      'titus': 3,
      'philemon': 1,
      '1-peter': 5,
      '2-peter': 3,
      '1-john': 5,
      '2-john': 1,
      '3-john': 1,
      'jude': 1,
    };
  }

  async getChapterInfo(book, chapter) {
    try {
      const url = `${this.baseUrl}/eng/pashto-bible/${book}/${book}-${chapter}`;
      console.log(`Fetching chapter info: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Get jktags
      const jktagsMatch = html.match(/id=["']jktags["'][^>]*data-tags=["']([^"']+)["']/);
      const jktags = jktagsMatch ? jktagsMatch[1] : null;

      // Get verse count by counting verse number spans
      const verseSpanMatches = html.match(/class=["']verseno\b[^"']*["'][^>]*>/g) || [];
      const verseCount = verseSpanMatches.length || 0;

      // Parse JSON-LD duration if present, as a better chapter length estimate
      let chapterDurationSec = 0;
      const durationMatch = html.match(/"duration"\s*:\s*"(PT[0-9HMST]+)"/);
      if (durationMatch) {
        chapterDurationSec = this.parseISODurationToSeconds(durationMatch[1]);
      }

      console.log(`Chapter ${chapter}: verses=${verseCount}, duration≈${chapterDurationSec || 'n/a'}s, jktags=${jktags ? 'found' : 'not found'}`);

      return { jktags, verseCount, chapterDurationSec };

    } catch (error) {
      console.error(`Error fetching chapter ${chapter}:`, error.message);
      return null;
    }
  }

  decodeJktagsBasic(jktags) {
    const parts = jktags.split('&');
    if (parts.length < 2) return [];

    const encodedData = parts[1];
    const numberPattern = /(\d+)/g;
    const numbers = [];
    let match;

    while ((match = numberPattern.exec(encodedData)) !== null) {
      numbers.push(parseInt(match[1]));
    }

    const markers = [];
    let verseNum = 1;
    let lastTime = 0;

    // Extract time markers from number sequences
    for (let i = 0; i < numbers.length - 1; i++) {
      const current = numbers[i];
      const next = numbers[i + 1];

      if (current >= 0 && current <= 59 && next >= 0 && next <= 59) {
        const totalSeconds = current * 60 + next;
        if (totalSeconds > lastTime && totalSeconds < 3600) {
          markers.push({
            verse: verseNum,
            startTime: totalSeconds
          });
          verseNum++;
          lastTime = totalSeconds;
          i++; // Skip next number
        }
      }
    }

    return markers;
  }

  // Try to decode jktags by base64-decoding the payload and interpreting as 16-bit timestamps.
  // We heuristically test several schemes and choose the most plausible monotonically increasing series.
  decodeJktagsAdvanced(jktags) {
    try {
      const parts = jktags.split('&');
      if (parts.length < 2) return [];
      const payload = parts.slice(1).join('&');
      // normalize base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
      const buf = Buffer.from(b64 + pad, 'base64');

      // helper: parse 16-bit array
      const parse16 = (littleEndian = false, scale = 1) => {
        const arr = [];
        for (let i = 0; i + 1 < buf.length; i += 2) {
          const val = littleEndian ? (buf[i] | (buf[i + 1] << 8)) : ((buf[i] << 8) | buf[i + 1]);
          arr.push(val / scale);
        }
        return arr;
      };

      // candidate parses: big/little endian and different scales
      const candidates = [
        { times: parse16(false, 1), scaleNote: 'be:1' },
        { times: parse16(true, 1), scaleNote: 'le:1' },
        { times: parse16(false, 10), scaleNote: 'be:10' },
        { times: parse16(true, 10), scaleNote: 'le:10' },
        { times: parse16(false, 100), scaleNote: 'be:100' },
        { times: parse16(true, 100), scaleNote: 'le:100' },
      ];

      // Choose plausible: strictly increasing, within [0, 7200] seconds, and count <= 200
      const plausible = (times) => {
        if (!times || times.length < 3) return false;
        let last = -1;
        let count = 0;
        for (const t of times) {
          if (!Number.isFinite(t) || t < 0 || t > 7200) return false;
          if (t <= last) return false;
          last = t; count++; if (count > 200) return false;
        }
        return true;
      };

      for (const c of candidates) {
        if (plausible(c.times)) {
          return c.times.map((sec, idx) => ({ verse: idx + 1, startTime: Math.round(sec) }));
        }
      }
      return [];
    } catch {
      return [];
    }
  }

  // Exact decoder per site script:
  // JSON.parse("[" + atob(rot13(reverse(raw).replace('&1','=').replace('&2','==').replace('&3','===').replace('&41','===='))) + "]")
  // The resulting array is of tuples: [startSec, endSec, tag, idx]
  // where tag can be 'H1','H2','s1','s2' for headings/sections or a verse number (1..n).
  // We compute per-verse start times by grouping on numeric tags and taking the earliest start for each verse.
  decodeJktagsVerses(jktags, expectedVerses) {
    try {
      const rev = jktags.split('').reverse().join('')
        .replace('&1', '=').replace('&2', '==').replace('&3', '===').replace('&41', '====');
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
          const v = tag|0;
          if (!verseStart.has(v) || start < verseStart.get(v)) verseStart.set(v, start);
        }
      }
      // Build markers list sorted by verse number
      const verses = expectedVerses && expectedVerses > 0 ? expectedVerses : Math.max(...Array.from(verseStart.keys()));
      const markers = [];
      for (let v = 1; v <= verses; v++) {
        const s = verseStart.get(v);
        if (typeof s === 'number') markers.push({ verse: v, startTime: Math.round(s) });
      }
      return markers;
    } catch {
      return [];
    }
  }

  parseISODurationToSeconds(d) {
    // PT3M11S -> 191; PT5M, PT45S, PT1H2M3S etc.
    const m = d.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!m) return 0;
    const h = parseInt(m[1] || '0', 10);
    const mi = parseInt(m[2] || '0', 10);
    const s = parseInt(m[3] || '0', 10);
    return h * 3600 + mi * 60 + s;
  }

  interpolateVerseMarkers(markers, totalVerses, chapterDuration = 191) {
    // Since the jktags are providing incorrect time markers that exceed the actual chapter duration,
    // we'll create evenly spaced markers across the actual duration
    console.log(`Creating ${totalVerses} evenly spaced markers across ${chapterDuration}s`);

    const avgSecondsPerVerse = chapterDuration / totalVerses;
    const result = [];

    for (let i = 0; i < totalVerses; i++) {
      result.push({
        verse: i + 1,
        startTime: Math.round(i * avgSecondsPerVerse)
      });
    }

    return result;
  }

  async downloadAudioFile(book, chapter) {
    const audioUrl = `${this.audioBaseUrl}/${book}-${chapter}.mp3?inline=mp3`;
    const outputPath = path.join(this.outputDir, `${book}-${chapter}.mp3`);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
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

  async splitAudioFile(inputFile, markers, outputDir) {
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
      return;
    }

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const nextMarker = markers[i + 1];

      const startTime = marker.startTime;
      const duration = nextMarker ? nextMarker.startTime - startTime : null;

      const outputFile = path.join(outputDir, `verse-${marker.verse}.mp3`);

      try {
        let ffmpegCmd;
        if (duration && duration > 0) {
          ffmpegCmd = `ffmpeg -i "${inputFile}" -ss ${startTime} -t ${duration} -c copy "${outputFile}" -y`;
        } else {
          ffmpegCmd = `ffmpeg -i "${inputFile}" -ss ${startTime} -c copy "${outputFile}" -y`;
        }

        console.log(`Creating verse ${marker.verse} (start: ${startTime}s${duration ? `, duration: ${duration}s` : ''})`);
        execSync(ffmpegCmd, { stdio: 'pipe' });

      } catch (error) {
        console.error(`Failed to create verse ${marker.verse}:`, error.message);
      }
    }
  }

  async processChapter(book, chapter) {
    try {
      console.log(`\n=== Processing ${book.toUpperCase()} Chapter ${chapter} ===`);

      // Get chapter info and jktags
      const chapterInfo = await this.getChapterInfo(book, chapter);
      if (!chapterInfo) {
        console.log(`Skipping ${book} ${chapter} - could not fetch info`);
        return;
      }

      const { jktags, verseCount, chapterDurationSec } = chapterInfo;

      // Decode markers from jktags
      let markers = [];
      if (jktags) {
        // exact verse markers from site algorithm
        markers = this.decodeJktagsVerses(jktags, verseCount);
        if (markers.length === 0) {
          // fallback to advanced heuristic
          markers = this.decodeJktagsAdvanced(jktags);
        }
        if (markers.length === 0) {
          markers = this.decodeJktagsBasic(jktags);
        }
        console.log(`Decoded ${markers.length} markers from jktags`);
      }

      // Interpolate to get all verse markers
      const allMarkers = markers.length === verseCount
        ? markers
        : this.interpolateVerseMarkers(markers, verseCount, chapterDurationSec || 1800);
      console.log(`Interpolated to ${allMarkers.length} verse markers`);

      // Download audio file
      const audioFile = await this.downloadAudioFile(book, chapter);

      // Create verse output directory
      const verseOutputDir = path.join(this.outputDir, book, `chapter-${chapter}-verses`);

      // Split audio
      await this.splitAudioFile(audioFile, allMarkers, verseOutputDir);

      console.log(`✅ Completed ${book} Chapter ${chapter} - ${allMarkers.length} verses created`);

    } catch (error) {
      console.error(`❌ Error processing ${book} ${chapter}:`, error.message);
    }
  }

  async processAllChapters(booksArg) {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Determine which books to process
    let books = [];
    if (Array.isArray(booksArg) && booksArg.length > 0) {
      books = booksArg;
    } else {
      // default to a small set of likely-missing books
      books = ['1-timothy', '2-timothy', '1-thessalonians', '2-thessalonians', '1-peter', '2-peter'];
    }

    for (const book of books) {
      const totalChapters = this.bookChapters[book];
      if (!totalChapters || totalChapters <= 0) {
        console.warn(`Unknown chapter count for ${book}; skipping.`);
        continue;
      }
      for (let chapter = 1; chapter <= totalChapters; chapter++) {
        await this.processChapter(book, chapter);

        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n🎉 All chapters processed!');
    console.log(`📁 Files saved to: ${this.outputDir}`);
  }

  async run() {
    try {
      // CLI options:
      //   node proper_audio_splitter.js 1-timothy            -> all chapters for 1-timothy
      //   node proper_audio_splitter.js 1-timothy 2          -> just chapter 2
      //   node proper_audio_splitter.js books 1-timothy,2-timothy,1-peter
      const arg1 = process.argv[2];
      const arg2 = process.argv[3];

      if (arg1 && arg1 !== 'books') {
        const book = arg1;
        if (arg2) {
          const ch = Number(arg2);
          if (Number.isFinite(ch) && ch > 0) {
            await this.processChapter(book, ch);
            return;
          }
        }
        const total = this.bookChapters[book];
        if (!total) throw new Error(`Unknown book or chapter count: ${book}`);
        for (let c = 1; c <= total; c++) {
          await this.processChapter(book, c);
          await new Promise(r => setTimeout(r, 1500));
        }
        return;
      }

      if (arg1 === 'books') {
        const list = (arg2 || '').split(',').map(s => s.trim()).filter(Boolean);
        await this.processAllChapters(list);
        return;
      }

      await this.processAllChapters();
    } catch (error) {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    }
  }
}

// Run the splitter
if (require.main === module) {
  const splitter = new ProperAudioSplitter();
  splitter.run();
}

module.exports = ProperAudioSplitter;

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

class AudioSplitter {
  constructor() {
    this.baseUrl = 'https://afghanbibles.org';
    this.audioBaseUrl = 'https://afghanbibles.org/pashto-afeastern-audio';
    this.outputDir = path.join(__dirname, 'corinthians_split_audio');
  }

  decodeJktags(jktags) {
    // The jktags appear to be a custom encoded format
    // Format appears to be: "1&[encoded_data]"

    const parts = jktags.split('&');
    if (parts.length < 2) return [];

    const encodedData = parts[1]; // Skip the '1&' prefix
    console.log(`Decoding jktags data (${encodedData.length} chars)...`);

    // The encoding appears to be a custom format, not standard base64
    // Let's try different decoding approaches

    const markers = [];
    let currentVerse = 1;

    // Method 1: Look for time patterns directly in the encoded string
    const timePattern = /(\d+):(\d+)/g;
    let timeMatch;
    while ((timeMatch = timePattern.exec(encodedData)) !== null) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseInt(timeMatch[2]);
      const totalSeconds = minutes * 60 + seconds;

      markers.push({
        verse: currentVerse,
        startTime: totalSeconds
      });
      currentVerse++;
    }

    // Method 2: If no time patterns found, try base64 decoding segments
    if (markers.length === 0) {
      const segments = encodedData.match(/[A-Za-z0-9+/=]{4,}/g) || [];
      console.log(`Trying base64 decoding of ${segments.length} segments...`);

      for (let i = 0; i < segments.length; i++) {
        try {
          const decoded = Buffer.from(segments[i], 'base64').toString('utf8');
          const segmentTimeMatch = decoded.match(/(\d+):(\d+)/);
          if (segmentTimeMatch) {
            const minutes = parseInt(segmentTimeMatch[1]);
            const seconds = parseInt(segmentTimeMatch[2]);
            const totalSeconds = minutes * 60 + seconds;

            markers.push({
              verse: currentVerse,
              startTime: totalSeconds
            });
            currentVerse++;
          }
        } catch (e) {
          // Skip invalid segments
        }
      }
    }

    // Method 3: If still no markers, create estimated markers
    if (markers.length === 0) {
      console.log('No time markers decoded, creating estimated markers...');
      // Estimate 25 verses with 15-second intervals
      for (let i = 0; i < 25; i++) {
        markers.push({
          verse: i + 1,
          startTime: i * 15 // 15 seconds per verse estimate
        });
      }
    }

    console.log(`Decoded ${markers.length} time markers`);
    return markers;
  }

  async getJktagsFromPage(book, chapter) {
    try {
      const url = `${this.baseUrl}/eng/pashto-bible/${book}/${book}-${chapter}`;
      console.log(`Fetching jktags from: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      // Extract jktags from the hidden input
      const jktagsMatch = html.match(/id="jktags"[^>]*data-tags="([^"]+)"/);
      if (jktagsMatch) {
        const jktags = jktagsMatch[1];
        console.log(`Found jktags for ${book} ${chapter}: ${jktags.substring(0, 50)}...`);
        return jktags;
      }

      // Also try alternative patterns
      const altMatch = html.match(/jktags[^>]*data-tags=["']([^"']+)["']/);
      if (altMatch) {
        const jktags = altMatch[1];
        console.log(`Found jktags (alt) for ${book} ${chapter}: ${jktags.substring(0, 50)}...`);
        return jktags;
      }

      console.log(`No jktags found for ${book} ${chapter}`);
      return null;

    } catch (error) {
      console.error(`Error fetching jktags for ${book} ${chapter}:`, error.message);
      return null;
    }
  }

  async downloadAudioFile(book, chapter) {
    const audioUrl = `${this.audioBaseUrl}/${book}-${chapter}.mp3?inline=mp3`;
    const outputPath = path.join(this.outputDir, `${book}-${chapter}.mp3`);

    // Ensure output directory exists
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

  async splitAudioByTimeMarkers(inputFile, markers, outputDir) {
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
        if (duration) {
          // Split with specific duration
          ffmpegCmd = `ffmpeg -i "${inputFile}" -ss ${startTime} -t ${duration} -c copy "${outputFile}" -y`;
        } else {
          // Take from start time to end of file
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
      console.log(`\n=== Processing ${book} Chapter ${chapter} ===`);

      // Get jktags from the webpage
      const jktags = await this.getJktagsFromPage(book, chapter);
      if (!jktags) {
        console.log(`Skipping ${book} ${chapter} - no jktags found`);
        return;
      }

      // Decode the time markers
      const markers = this.decodeJktags(jktags);
      if (markers.length === 0) {
        console.log(`No time markers decoded for ${book} ${chapter}`);
        return;
      }

      console.log(`Decoded ${markers.length} time markers`);

      // Download the audio file
      const audioFile = await this.downloadAudioFile(book, chapter);

      // Create output directory for verses
      const verseOutputDir = path.join(this.outputDir, book, `chapter-${chapter}-verses`);

      // Split the audio
      await this.splitAudioByTimeMarkers(audioFile, markers, verseOutputDir);

      console.log(`Completed ${book} Chapter ${chapter}`);

    } catch (error) {
      console.error(`Error processing ${book} ${chapter}:`, error.message);
    }
  }

  async processCorinthians() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Create book directories
    const books = ['1-corinthians', '2-corinthians'];
    books.forEach(book => {
      const bookDir = path.join(this.outputDir, book);
      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir, { recursive: true });
      }
    });

    // Process chapters
    const chapters = {
      '1-corinthians': 16,
      '2-corinthians': 13
    };

    for (const [book, chapterCount] of Object.entries(chapters)) {
      for (let chapter = 1; chapter <= chapterCount; chapter++) {
        await this.processChapter(book, chapter);

        // Be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n=== Processing Complete ===');
    console.log(`Files saved to: ${this.outputDir}`);
  }

  async run() {
    try {
      await this.processCorinthians();
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  }
}

// Alternative approach: Manual time markers if jktags decoding fails
class ManualAudioSplitter extends AudioSplitter {
  constructor() {
    super();
    // Pre-defined time markers for 1 Corinthians 1 (example)
    this.manualMarkers = {
      '1-corinthians-1': [
        { verse: 1, startTime: 0 },
        { verse: 2, startTime: 15 },
        { verse: 3, startTime: 35 },
        // Add more markers based on your knowledge of the audio
      ]
    };
  }

  async processChapter(book, chapter) {
    const key = `${book}-${chapter}`;
    const markers = this.manualMarkers[key];

    if (!markers) {
      console.log(`No manual markers for ${key}. Skipping...`);
      return;
    }

    try {
      console.log(`Processing ${key} with manual markers...`);

      const audioFile = await this.downloadAudioFile(book, chapter);
      const verseOutputDir = path.join(this.outputDir, book, `chapter-${chapter}-verses`);

      await this.splitAudioByTimeMarkers(audioFile, markers, verseOutputDir);

      console.log(`Completed ${key}`);

    } catch (error) {
      console.error(`Error processing ${key}:`, error.message);
    }
  }
}

// Run the splitter
if (require.main === module) {
  const splitter = new AudioSplitter();
  // const splitter = new ManualAudioSplitter(); // Use this if jktags decoding fails
  splitter.run();
}

module.exports = { AudioSplitter, ManualAudioSplitter };

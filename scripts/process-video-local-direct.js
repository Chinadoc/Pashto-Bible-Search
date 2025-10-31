/**
 * Local video processing script
 * Uses dependencies from video-processor-service
 * 
 * Run from project root:
 *   NODE_PATH=./video-processor-service/node_modules:$NODE_PATH node scripts/process-video-local-direct.js <youtubeUrl>
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { createReadStream } = require('fs');
const { writeFile, unlink, readFile, stat, mkdir } = require('fs/promises');
const { join } = require('path');
const path = require('path');

// Try to use video-processor-service dependencies, fallback to local
let FormData, axios;
const servicePath = path.join(__dirname, '../video-processor-service');
const formDataPath = path.join(servicePath, 'node_modules/form-data');
const axiosPath = path.join(servicePath, 'node_modules/axios');

try {
  // First try local (when running from video-processor-service directory)
  FormData = require('form-data');
  axios = require('axios');
} catch (e) {
  // Try from video-processor-service node_modules
  try {
    FormData = require(formDataPath);
    axios = require(axiosPath);
  } catch (e2) {
    console.error('Could not find form-data or axios.');
    console.error('Please run: cd video-processor-service && npm install');
    process.exit(1);
  }
}

// Import timestamp alignment functions
const { transcribeWithWhisper, alignTranscriptionsImproved } = require(path.join(servicePath, 'src/timestamp-alignment'));

// Try to use video-processor-service dependencies, fallback to local
let FormData, axios;
const path = require('path');
const servicePath = path.join(__dirname, '../video-processor-service');
const formDataPath = path.join(servicePath, 'node_modules/form-data');
const axiosPath = path.join(servicePath, 'node_modules/axios');

try {
  // First try local (when running from video-processor-service directory)
  FormData = require('form-data');
  axios = require('axios');
} catch (e) {
  // Try from video-processor-service node_modules
  try {
    FormData = require(formDataPath);
    axios = require(axiosPath);
  } catch (e2) {
    console.error('Could not find form-data or axios.');
    console.error('Please run: cd video-processor-service && npm install');
    process.exit(1);
  }
}

const execAsync = promisify(exec);
const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function downloadVideoAudio(youtubeUrl, videoId) {
  const tempDir = join(process.cwd(), 'temp');
  await mkdir(tempDir, { recursive: true });
  const outputPath = join(tempDir, `${videoId}.mp3`);
  
  const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" "${youtubeUrl}"`;
  await execAsync(cmd, { timeout: 300000 });
  return outputPath;
}

async function getVideoDuration(audioFile) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioFile}"`,
      { timeout: 30000 }
    );
    return parseFloat(stdout.trim()) || 0;
  } catch (error) {
    console.warn('Failed to get video duration:', error.message);
    return 0;
  }
}

async function transcribeWithElevenLabs(audioFile, apiKey) {
  let fileStats = await stat(audioFile);
  const maxSize = 25 * 1024 * 1024;
  
  let finalAudioFile = audioFile;
  
  if (fileStats.size > maxSize) {
    const compressedPath = audioFile.replace('.mp3', '_compressed.mp3');
    await execAsync(`ffmpeg -i "${audioFile}" -b:a 64k -y "${compressedPath}"`, { timeout: 120000 });
    finalAudioFile = compressedPath;
    fileStats = await stat(finalAudioFile);
  }
  
  console.log(`📤 Sending to ElevenLabs: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
  
  const formData = new FormData();
  const fileStream = createReadStream(finalAudioFile);
  
  formData.append('file', fileStream, {
    filename: 'audio.mp3',
    contentType: 'audio/mpeg',
    knownLength: fileStats.size,
  });
  formData.append('language', 'ps');
  formData.append('model_id', 'scribe_v1');
  
  // Use axios.default if needed (for some module systems)
  const axiosInstance = axios.default || axios;
  
  const response = await axiosInstance.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
    headers: {
      'xi-api-key': apiKey,
      ...formData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  
  if (finalAudioFile !== audioFile) {
    await unlink(finalAudioFile).catch(() => {});
  }
  
  return response.data.text || '';
}

async function segmentTranscriptBySentences(text, videoDuration) {
  const segments = [];
  const sentences = text.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
  if (sentences.length === 0) return segments;
  
  if (videoDuration > 0) {
    const totalWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
    let currentTime = 0;
    
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      
      const wordCount = sentence.split(/\s+/).length;
      const proportion = totalWords > 0 ? wordCount / totalWords : 1 / sentences.length;
      const duration = Math.max(2, videoDuration * proportion);
      
      segments.push({
        text: sentence.trim(),
        startTime: Math.round(currentTime * 10) / 10,
        endTime: Math.round((currentTime + duration) * 10) / 10,
      });
      
      currentTime += duration;
    }
    
    if (segments.length > 0) {
      const lastEndTime = segments[segments.length - 1].endTime;
      const actualDuration = lastEndTime;
      
      if (actualDuration < videoDuration - 1) {
        const scaleFactor = videoDuration / actualDuration;
        let normalizedTime = 0;
        
        for (let i = 0; i < segments.length; i++) {
          const originalDuration = segments[i].endTime - segments[i].startTime;
          const scaledDuration = originalDuration * scaleFactor;
          
          segments[i].startTime = Math.round(normalizedTime * 10) / 10;
          segments[i].endTime = Math.round((normalizedTime + scaledDuration) * 10) / 10;
          normalizedTime += scaledDuration;
        }
      }
      
      segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      
      if (segments[segments.length - 1].endTime > videoDuration) {
        const compressionFactor = videoDuration / segments[segments.length - 1].endTime;
        let compressedTime = 0;
        
        for (let i = 0; i < segments.length; i++) {
          const originalDuration = segments[i].endTime - segments[i].startTime;
          const compressedDuration = originalDuration * compressionFactor;
          
          segments[i].startTime = Math.round(compressedTime * 10) / 10;
          segments[i].endTime = Math.round((compressedTime + compressedDuration) * 10) / 10;
          compressedTime += compressedDuration;
        }
        
        segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      }
    }
  }
  
  return segments;
}

async function extractAudioSegments(audioFile, segments, videoId) {
  const tempDir = join(process.cwd(), 'temp');
  const segmentFiles = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(tempDir, `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      const paddingStart = 0.15;
      const paddingEnd = 0.25;
      
      const start = Math.max(0, segment.startTime - paddingStart);
      const end = segment.endTime + paddingEnd;
      const duration = end - start;
      
      const ffmpegCmd = `ffmpeg -ss ${start.toFixed(3)} -i "${audioFile}" -t ${duration.toFixed(3)} -c:a libmp3lame -ar 44100 -ac 1 -q:a 4 -af aresample=async=1:first_pts=0 "${outputPath}" -y`;
      
      await execAsync(ffmpegCmd, { timeout: 60000 });
      segmentFiles.push(outputPath);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Extracted ${i + 1}/${segments.length} segments...`);
      }
    } catch (error) {
      console.warn(`Failed to extract segment ${i + 1}:`, error.message);
    }
  }
  
  return segmentFiles;
}

async function uploadToR2(segmentFiles, videoId) {
  const r2Keys = [];
  
  for (let i = 0; i < segmentFiles.length; i++) {
    const segmentFile = segmentFiles[i];
    const r2Key = `videos/${videoId}/segment_${i + 1}.mp3`;
    
    try {
      const fileBuffer = await readFile(segmentFile);
      
      const uploadResponse = await fetch(`${CLOUDFLARE_WORKER_URL}/api/r2/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: r2Key,
          data: fileBuffer.toString('base64'),
        }),
      });
      
      if (uploadResponse.ok) {
        r2Keys.push(r2Key);
        if ((i + 1) % 10 === 0) {
          console.log(`   Uploaded ${i + 1}/${segmentFiles.length} segments...`);
        }
      }
    } catch (error) {
      console.warn(`Failed to upload segment ${i + 1}:`, error.message);
    }
  }
  
  return r2Keys;
}

async function storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys) {
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      youtubeUrl,
      videoId,
      transcript,
      segments,
      transcription_service: 'elevenlabs',
      r2Keys: r2Keys.join(','),
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to store metadata: ${errorText}`);
  }
  
  return await response.json();
}

async function processVideo(youtubeUrl, elevenlabsApiKey) {
  const startTime = Date.now();
  let audioFile = null;
  let segmentFiles = [];
  
  console.log(`\n🎬 ========== LOCAL VIDEO PROCESSING STARTED ==========`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);
  
  try {
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    const videoId = videoIdMatch[1];
    console.log(`🎯 Extracted video ID: ${videoId}`);
    
    console.log(`\n📥 Step 1: Downloading video audio...`);
    audioFile = await downloadVideoAudio(youtubeUrl, videoId);
    const fileStats = await stat(audioFile);
    console.log(`✅ Audio downloaded: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Step 2: Two-pass transcription
    console.log(`\n🎤 Step 2: Two-pass transcription for accurate timestamps...`);
    let whisperData = null;
    let elevenLabsTranscript = null;
    let segments = [];
    
    try {
      // Pass 1: Whisper for timestamps
      console.log(`\n   📍 Pass 1: Whisper transcription (for timestamps)...`);
      try {
        const useLocalWhisper = !process.env.OPENAI_API_KEY || process.env.USE_LOCAL_WHISPER === 'true';
        whisperData = await transcribeWithWhisper(audioFile, useLocalWhisper);
        
        const videoDuration = whisperData.segments.length > 0 
          ? Math.max(...whisperData.segments.map(s => s.end || 0))
          : await getVideoDuration(audioFile);
        
        console.log(`   ✅ Whisper transcription completed:`);
        console.log(`      Text length: ${whisperData.text.length} chars`);
        console.log(`      Words with timestamps: ${whisperData.words.length}`);
        console.log(`      Video duration: ${videoDuration}s (${formatDuration(videoDuration)})`);
        
        // Pass 2: ElevenLabs for quality
        console.log(`\n   📍 Pass 2: ElevenLabs transcription (for quality)...`);
        elevenLabsTranscript = await transcribeWithElevenLabs(audioFile, elevenlabsApiKey);
        console.log(`   ✅ ElevenLabs transcription completed:`);
        console.log(`      Text length: ${elevenLabsTranscript.length} chars`);
        console.log(`      First 100 chars: ${elevenLabsTranscript.substring(0, 100)}...`);
        
        // Pass 3: Align
        console.log(`\n   📍 Pass 3: Aligning transcriptions...`);
        segments = alignTranscriptionsImproved(whisperData.words, whisperData.segments, elevenLabsTranscript);
        
        console.log(`✅ Two-pass transcription completed:`);
        console.log(`   Segments: ${segments.length}`);
        if (segments.length > 0) {
          console.log(`   First segment: ${segments[0].startTime}s - ${segments[0].endTime}s`);
          console.log(`   Last segment: ${segments[segments.length - 1].startTime}s - ${segments[segments.length - 1].endTime}s`);
        }
        
      } catch (whisperError) {
        console.warn(`⚠️ Whisper transcription failed: ${whisperError.message}`);
        console.log(`   Falling back to single-pass (ElevenLabs + proportional timing)...`);
        
        // Fallback: use ElevenLabs only with proportional timing
        elevenLabsTranscript = await transcribeWithElevenLabs(audioFile, elevenlabsApiKey);
        const videoDuration = await getVideoDuration(audioFile);
        segments = await segmentTranscriptBySentences(elevenLabsTranscript, videoDuration);
        
        console.log(`✅ Fallback transcription completed:`);
        console.log(`   Using proportional timing (less accurate)`);
      }
    } catch (error) {
      console.error(`❌ Transcription failed:`, error.message);
      throw error;
    }
    
    const transcript = elevenLabsTranscript || (whisperData ? whisperData.text : '');
    
    console.log(`\n🎵 Step 5: Extracting audio segments...`);
    segmentFiles = await extractAudioSegments(audioFile, segments, videoId);
    console.log(`✅ Extracted ${segmentFiles.length} audio segments`);
    
    console.log(`\n☁️ Step 6: Uploading to Cloudflare R2...`);
    const r2Keys = await uploadToR2(segmentFiles, videoId);
    console.log(`✅ Uploaded ${r2Keys.length} segments to R2`);
    
    console.log(`\n💾 Step 7: Storing metadata in D1...`);
    await storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys);
    console.log(`✅ Metadata stored in D1`);
    
    console.log(`\n🧹 Cleaning up...`);
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ ========== PROCESSING COMPLETE ==========`);
    console.log(`   Total duration: ${totalDuration}s`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   Segments: ${segments.length}`);
    console.log(`   R2 keys: ${r2Keys.length}`);
    console.log(`========================================\n`);
    
  } catch (error) {
    console.error(`\n❌ ========== PROCESSING ERROR ==========`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error(`==========================================\n`);
    
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    
    process.exit(1);
  }
}

const youtubeUrl = process.argv[2];
const elevenlabsApiKey = process.argv[3] || process.env.ELEVENLABS_API_KEY || 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543';

if (!youtubeUrl) {
  console.error('Usage: node scripts/process-video-local-direct.js <youtubeUrl> [elevenlabsApiKey]');
  console.error('Example: node scripts/process-video-local-direct.js "https://www.youtube.com/watch?v=u9sU5l92Th4"');
  process.exit(1);
}

processVideo(youtubeUrl, elevenlabsApiKey).catch(console.error);


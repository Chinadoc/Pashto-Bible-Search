const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const { writeFile, unlink, readFile, stat, mkdir } = require('fs/promises');
const { join } = require('path');
const FormData = require('form-data');
const cors = require('cors');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pashto-video-processor' });
});

/**
 * Format duration helper
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Download YouTube video audio using yt-dlp
 */
async function downloadVideoAudio(youtubeUrl, videoId) {
  const tempDir = join('/tmp', 'video-processing');
  const outputPath = join(tempDir, `${videoId}.mp3`);
  
  try {
    await mkdir(tempDir, { recursive: true });
    
    const cmd = `yt-dlp --extract-audio --audio-format mp3 --output "${outputPath}" "${youtubeUrl}"`;
    await execAsync(cmd, { timeout: 300000 });
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

/**
 * Get video duration using ffprobe
 */
async function getVideoDuration(audioFile) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioFile}"`,
      { timeout: 30000 }
    );
    return parseFloat(stdout.trim()) || 0;
  } catch (error) {
    console.warn('Failed to get video duration, using estimated:', error.message);
    return 0;
  }
}

/**
 * Transcribe audio with ElevenLabs
 */
async function transcribeWithElevenLabs(audioFile, apiKey) {
  const fileStats = await stat(audioFile);
  const maxSize = 25 * 1024 * 1024; // 25MB
  
  let finalAudioFile = audioFile;
  
  // Compress if needed
  if (fileStats.size > maxSize) {
    const compressedPath = audioFile.replace('.mp3', '_compressed.mp3');
    await execAsync(`ffmpeg -i "${audioFile}" -b:a 64k -y "${compressedPath}"`, { timeout: 120000 });
    finalAudioFile = compressedPath;
  }
  
  // Read file and create FormData for ElevenLabs
  const audioBuffer = await readFile(finalAudioFile);
  
  const formData = new FormData();
  // Use a Blob-like object or pass the buffer with proper options
  // For Node.js form-data, we need to pass the buffer with proper options
  formData.append('file', audioBuffer, {
    filename: 'audio.mp3',
    contentType: 'audio/mpeg',
    knownLength: audioBuffer.length, // Specify the length for better compatibility
  });
  formData.append('language', 'ps');
  formData.append('model_id', 'scribe_v1');
  
  console.log(`📤 Sending to ElevenLabs: ${(audioBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Language: ps, Model: scribe_v1`);
  
  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      ...formData.getHeaders(), // This sets Content-Type with boundary
    },
    body: formData,
  });
  
  if (finalAudioFile !== audioFile) {
    await unlink(finalAudioFile).catch(() => {});
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs error: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  return result.text || '';
}

/**
 * Segment transcript by sentences with proper duration distribution
 * Ensures segments cover the full video duration
 */
async function segmentTranscriptBySentences(text, videoDuration) {
  const segments = [];
  const sentences = text.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
  if (sentences.length === 0) return segments;
  
  // If we have video duration, distribute time proportionally
  if (videoDuration > 0) {
    const totalWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
    let currentTime = 0;
    
    // First pass: distribute proportionally
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
    
    // Normalize: ensure segments cover full video duration
    if (segments.length > 0) {
      const lastEndTime = segments[segments.length - 1].endTime;
      const actualDuration = lastEndTime;
      
      // If segments don't cover full duration, scale them
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
      
      // Ensure last segment ends exactly at video duration
      segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      
      // If segments exceed duration, compress them
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
        
        // Ensure last segment ends at video duration
        segments[segments.length - 1].endTime = Math.round(videoDuration * 10) / 10;
      }
    }
  } else {
    // Fallback to estimated duration
    let currentTime = 0;
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      
      const wordCount = sentence.split(/\s+/).length;
      const estimatedDuration = Math.max(3, Math.min(15, wordCount * 0.4));
      
      segments.push({
        text: sentence.trim(),
        startTime: currentTime,
        endTime: currentTime + estimatedDuration,
      });
      
      currentTime += estimatedDuration;
    }
  }
  
  return segments;
}

/**
 * Extract audio segments using ffmpeg with precise timing and padding
 */
async function extractAudioSegments(audioFile, segments, videoId) {
  const tempDir = join('/tmp', 'video-processing');
  const segmentFiles = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(tempDir, `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      // Use precise decimal times (not Math.floor)
      // Add small padding before start to avoid clipping words
      const paddingStart = 0.15; // 150ms before
      const paddingEnd = 0.25;   // 250ms after
      
      const start = Math.max(0, segment.startTime - paddingStart);
      const end = segment.endTime + paddingEnd;
      const duration = end - start;
      
      // Use precise decimal format for ffmpeg
      // Re-encode instead of copy to get precise cuts (not just keyframe cuts)
      const ffmpegCmd = `ffmpeg -ss ${start.toFixed(3)} -i "${audioFile}" -t ${duration.toFixed(3)} -c:a libmp3lame -ar 44100 -ac 1 -q:a 4 -af aresample=async=1:first_pts=0 "${outputPath}" -y`;
      
      console.log(`   Extracting segment ${i + 1}: ${segment.startTime.toFixed(2)}s - ${segment.endTime.toFixed(2)}s (duration: ${duration.toFixed(2)}s)`);
      
      await execAsync(ffmpegCmd, { timeout: 60000 });
      
      segmentFiles.push(outputPath);
    } catch (error) {
      console.warn(`Failed to extract segment ${i + 1}:`, error.message);
    }
  }
  
  return segmentFiles;
}

/**
 * Upload audio segments to Cloudflare R2 via Worker
 */
async function uploadToR2(segmentFiles, videoId) {
  const r2Keys = [];
  
  for (let i = 0; i < segmentFiles.length; i++) {
    const segmentFile = segmentFiles[i];
    const r2Key = `videos/${videoId}/segment_${i + 1}.mp3`;
    
    try {
      // Read file as buffer
      const fileBuffer = await readFile(segmentFile);
      
      // Upload to R2 via Cloudflare Worker
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
      } else {
        console.warn(`Failed to upload segment ${i + 1} to R2`);
      }
    } catch (error) {
      console.warn(`Failed to upload segment ${i + 1}:`, error.message);
    }
  }
  
  return r2Keys;
}

/**
 * Store metadata in Cloudflare D1 via Worker
 */
async function storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys, transcriptionService) {
  const response = await fetch(`${CLOUDFLARE_WORKER_URL}/api/video/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      youtubeUrl,
      videoId,
      transcript,
      segments,
      transcription_service: transcriptionService || 'elevenlabs',
      r2Keys: r2Keys.join(','),
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to store metadata: ${errorText}`);
  }
  
  return await response.json();
}

/**
 * Main video processing endpoint
 */
app.post('/process-video', async (req, res) => {
  const startTime = Date.now();
  let audioFile = null;
  let segmentFiles = [];
  
  console.log(`\n🎬 ========== VIDEO PROCESSING STARTED ==========`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Request body keys: ${Object.keys(req.body).join(', ')}`);
  
  try {
    const { youtubeUrl, apiKeys } = req.body;
    
    console.log(`\n📥 Parsing request:`);
    console.log(`   YouTube URL: ${youtubeUrl || 'MISSING'}`);
    console.log(`   Has API keys object: ${!!apiKeys}`);
    console.log(`   ElevenLabs in request: ${!!apiKeys?.elevenlabs}`);
    console.log(`   ElevenLabs in env: ${!!process.env.ELEVENLABS_API_KEY}`);
    
    if (!youtubeUrl) {
      console.error(`❌ Missing YouTube URL`);
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    // Extract video ID
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      console.error(`❌ Invalid YouTube URL format: ${youtubeUrl}`);
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    const videoId = videoIdMatch[1];
    console.log(`🎯 Extracted video ID: ${videoId}`);
    
    const elevenlabsKey = apiKeys?.elevenlabs || process.env.ELEVENLABS_API_KEY;
    
    if (!elevenlabsKey) {
      console.error(`❌ ElevenLabs API key not found`);
      console.error(`   Checked: apiKeys.elevenlabs=${!!apiKeys?.elevenlabs}, env.ELEVENLABS_API_KEY=${!!process.env.ELEVENLABS_API_KEY}`);
      return res.status(400).json({ 
        error: 'ElevenLabs API key is required',
        details: 'Please provide apiKeys.elevenlabs in request or set ELEVENLABS_API_KEY environment variable'
      });
    }
    
    console.log(`\n✅ Configuration validated:`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   ElevenLabs key: ${elevenlabsKey.substring(0, 10)}...${elevenlabsKey.substring(elevenlabsKey.length - 4)}`);
    console.log(`   Cloudflare Worker URL: ${CLOUDFLARE_WORKER_URL}`);
    
    // Step 1: Download video audio
    console.log(`\n📥 Step 1: Downloading video audio...`);
    const downloadStartTime = Date.now();
    try {
      audioFile = await downloadVideoAudio(youtubeUrl, videoId);
      const downloadDuration = ((Date.now() - downloadStartTime) / 1000).toFixed(2);
      const fileStats = await stat(audioFile);
      console.log(`✅ Audio downloaded successfully:`);
      console.log(`   File: ${audioFile}`);
      console.log(`   Size: ${(fileStats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Duration: ${downloadDuration}s`);
    } catch (error) {
      console.error(`❌ Download failed:`, error.message);
      throw error;
    }
    
    // Step 2: Transcribe with ElevenLabs
    console.log(`\n🎤 Step 2: Transcribing with ElevenLabs...`);
    const transcribeStartTime = Date.now();
    let transcript;
    try {
      transcript = await transcribeWithElevenLabs(audioFile, elevenlabsKey);
      const transcribeDuration = ((Date.now() - transcribeStartTime) / 1000).toFixed(2);
      console.log(`✅ Transcription completed:`);
      console.log(`   Duration: ${transcribeDuration}s`);
      console.log(`   Transcript length: ${transcript.length} characters`);
      console.log(`   First 100 chars: ${transcript.substring(0, 100)}...`);
    } catch (error) {
      console.error(`❌ Transcription failed:`, error.message);
      throw error;
    }
    
    // Step 2.5: Get actual video duration BEFORE segmentation
    // This is critical - we need accurate duration to properly segment
    console.log(`\n⏱️ Step 2.5: Getting video duration (CRITICAL for accurate timestamps)...`);
    const durationStartTime = Date.now();
    let videoDuration;
    try {
      videoDuration = await getVideoDuration(audioFile);
      const durationDuration = ((Date.now() - durationStartTime) / 1000).toFixed(2);
      console.log(`✅ Video duration retrieved:`);
      console.log(`   Processing time: ${durationDuration}s`);
      console.log(`   Video length: ${videoDuration}s (${formatDuration(videoDuration)})`);
      
      if (videoDuration === 0 || !videoDuration) {
        console.error(`❌ CRITICAL: Could not get video duration!`);
        console.error(`   This will cause incorrect segment timestamps.`);
        console.error(`   Aborting to prevent incorrect data.`);
        throw new Error('Failed to get video duration - cannot proceed without accurate timestamps');
      }
      
      // Verify duration is reasonable (at least 1 second)
      if (videoDuration < 1) {
        console.error(`❌ CRITICAL: Video duration seems incorrect: ${videoDuration}s`);
        throw new Error(`Invalid video duration: ${videoDuration}s`);
      }
      
      console.log(`✅ Duration validated: ${videoDuration}s (${formatDuration(videoDuration)})`);
    } catch (error) {
      console.error(`❌ CRITICAL ERROR: Failed to get duration:`, error.message);
      throw error; // Don't proceed without accurate duration
    }
    
    // Step 3: Segment transcript with proper duration
    console.log(`\n✂️ Step 3: Segmenting transcript...`);
    const segmentStartTime = Date.now();
    let segments;
    try {
      segments = await segmentTranscriptBySentences(transcript, videoDuration);
      const segmentDuration = ((Date.now() - segmentStartTime) / 1000).toFixed(2);
      const lastSegmentEnd = segments[segments.length - 1]?.endTime || 0;
      console.log(`✅ Segmentation completed:`);
      console.log(`   Duration: ${segmentDuration}s`);
      console.log(`   Total segments: ${segments.length}`);
      console.log(`   Coverage: ${formatDuration(lastSegmentEnd)} / ${formatDuration(videoDuration)}`);
      console.log(`   First segment: ${segments[0]?.startTime}s - ${segments[0]?.endTime}s`);
      console.log(`   Last segment: ${segments[segments.length - 1]?.startTime}s - ${segments[segments.length - 1]?.endTime}s`);
      if (segments.length > 0) {
        console.log(`   Sample text: ${segments[0]?.text?.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error(`❌ Segmentation failed:`, error.message);
      throw error;
    }
    
    // Step 4: Extract audio segments
    console.log(`\n🎵 Step 4: Extracting audio segments...`);
    const extractStartTime = Date.now();
    try {
      segmentFiles = await extractAudioSegments(audioFile, segments, videoId);
      const extractDuration = ((Date.now() - extractStartTime) / 1000).toFixed(2);
      console.log(`✅ Audio extraction completed:`);
      console.log(`   Duration: ${extractDuration}s`);
      console.log(`   Segments extracted: ${segmentFiles.length}/${segments.length}`);
      if (segmentFiles.length < segments.length) {
        console.warn(`⚠️ Some segments failed to extract`);
      }
    } catch (error) {
      console.error(`❌ Audio extraction failed:`, error.message);
      throw error;
    }
    
    // Step 5: Upload to R2
    console.log(`\n☁️ Step 5: Uploading to Cloudflare R2...`);
    const uploadStartTime = Date.now();
    let r2Keys;
    try {
      r2Keys = await uploadToR2(segmentFiles, videoId);
      const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
      console.log(`✅ Upload completed:`);
      console.log(`   Duration: ${uploadDuration}s`);
      console.log(`   Segments uploaded: ${r2Keys.length}/${segmentFiles.length}`);
      if (r2Keys.length > 0) {
        console.log(`   First R2 key: ${r2Keys[0]}`);
        console.log(`   Last R2 key: ${r2Keys[r2Keys.length - 1]}`);
      }
      if (r2Keys.length < segmentFiles.length) {
        console.warn(`⚠️ Some segments failed to upload`);
      }
    } catch (error) {
      console.error(`❌ Upload failed:`, error.message);
      throw error;
    }
    
    // Step 6: Store metadata in D1
    console.log(`\n💾 Step 6: Storing metadata in D1...`);
    const storeStartTime = Date.now();
    try {
      await storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys, 'elevenlabs');
      const storeDuration = ((Date.now() - storeStartTime) / 1000).toFixed(2);
      console.log(`✅ Metadata stored:`);
      console.log(`   Duration: ${storeDuration}s`);
    } catch (error) {
      console.error(`❌ Metadata storage failed:`, error.message);
      throw error;
    }
    
    // Cleanup
    console.log(`\n🧹 Cleaning up temporary files...`);
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    console.log(`✅ Cleanup completed`);
    
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ ========== VIDEO PROCESSING SUCCESS ==========`);
    console.log(`   Total duration: ${totalDuration}s`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   Segments: ${segments.length}`);
    console.log(`   R2 keys: ${r2Keys.length}`);
    console.log(`========================================\n`);
    
    res.json({
      success: true,
      videoId,
      transcript,
      segments,
      r2Keys,
      message: `✅ Video processed successfully! ${segments.length} segments created.`,
    });
    
  } catch (error) {
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`\n❌ ========== VIDEO PROCESSING ERROR ==========`);
    console.error(`   Duration: ${totalDuration}s`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error(`==========================================\n`);
    
    // Cleanup on error
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Video processor service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});


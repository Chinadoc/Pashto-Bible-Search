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
  formData.append('file', audioBuffer, {
    filename: 'audio.mp3',
    contentType: 'audio/mpeg',
  });
  formData.append('language', 'ps');
  formData.append('model_id', 'scribe_v1');
  
  const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      ...formData.getHeaders(),
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
 * Extract audio segments using ffmpeg
 */
async function extractAudioSegments(audioFile, segments, videoId) {
  const tempDir = join('/tmp', 'video-processing');
  const segmentFiles = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const outputPath = join(tempDir, `${videoId}_segment_${i + 1}.mp3`);
    
    try {
      const start = Math.floor(segment.startTime);
      const duration = Math.floor(segment.endTime - segment.startTime);
      
      await execAsync(
        `ffmpeg -i "${audioFile}" -ss ${start} -t ${duration} -acodec copy "${outputPath}" -y`,
        { timeout: 60000 }
      );
      
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
  let audioFile = null;
  let segmentFiles = [];
  
  try {
    const { youtubeUrl, apiKeys } = req.body;
    
    if (!youtubeUrl) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    // Extract video ID
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    const videoId = videoIdMatch[1];
    
    const elevenlabsKey = apiKeys?.elevenlabs || process.env.ELEVENLABS_API_KEY;
    
    if (!elevenlabsKey) {
      return res.status(400).json({ error: 'ElevenLabs API key is required' });
    }
    
    console.log(`🎬 Processing video ${videoId}...`);
    
    // Step 1: Download video audio
    console.log('📥 Downloading video audio...');
    audioFile = await downloadVideoAudio(youtubeUrl, videoId);
    console.log('✅ Audio downloaded');
    
    // Step 2: Transcribe with ElevenLabs
    console.log('🎤 Transcribing with ElevenLabs...');
    const transcript = await transcribeWithElevenLabs(audioFile, elevenlabsKey);
    console.log('✅ Transcription completed');
    
    // Step 2.5: Get actual video duration
    console.log('⏱️ Getting video duration...');
    const videoDuration = await getVideoDuration(audioFile);
    console.log(`✅ Video duration: ${videoDuration}s (${formatDuration(videoDuration)})`);
    
    // Step 3: Segment transcript with proper duration
    console.log('✂️ Segmenting transcript...');
    const segments = await segmentTranscriptBySentences(transcript, videoDuration);
    console.log(`✅ Created ${segments.length} segments covering ${formatDuration(segments[segments.length - 1]?.endTime || 0)}`);
    
    // Step 4: Extract audio segments
    console.log('🎵 Extracting audio segments...');
    segmentFiles = await extractAudioSegments(audioFile, segments, videoId);
    console.log(`✅ Extracted ${segmentFiles.length} audio segments`);
    
    // Step 5: Upload to R2
    console.log('☁️ Uploading to Cloudflare R2...');
    const r2Keys = await uploadToR2(segmentFiles, videoId);
    console.log(`✅ Uploaded ${r2Keys.length} segments to R2`);
    
    // Step 6: Store metadata in D1
    console.log('💾 Storing metadata in D1...');
    await storeMetadata(youtubeUrl, videoId, transcript, segments, r2Keys, 'elevenlabs');
    console.log('✅ Metadata stored in D1');
    
    // Cleanup
    if (audioFile) {
      await unlink(audioFile).catch(() => {});
    }
    for (const file of segmentFiles) {
      await unlink(file).catch(() => {});
    }
    
    res.json({
      success: true,
      videoId,
      transcript,
      segments,
      r2Keys,
      message: `✅ Video processed successfully! ${segments.length} segments created.`,
    });
    
  } catch (error) {
    console.error('Video processing error:', error);
    
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
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Video processor service running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});


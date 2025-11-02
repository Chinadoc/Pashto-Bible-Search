/**
 * WhisperX Forced Alignment Wrapper
 * Uses WhisperX API service (cloud) or local Python script for accurate word-level timestamps
 * Takes existing transcription (from ElevenLabs) and audio, returns accurate timestamps
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { existsSync, createReadStream } = require('fs');
const { join } = require('path');
const FormData = require('form-data');
const axios = require('axios');

const execAsync = promisify(exec);

/**
 * Use WhisperX forced alignment to get accurate timestamps from existing transcription
 * Tries cloud API first, falls back to local Python script
 * 
 * @param {string} audioFile - Path to audio file
 * @param {string} transcriptionText - Existing transcription text (high quality from ElevenLabs)
 * @param {string} language - Language code (default: "ps" for Pashto)
 * @returns {Promise<{text: string, words: Array, segments: Array}>}
 */
async function alignWithWhisperX(audioFile, transcriptionText, language = 'ps') {
  console.log(`🔗 Using WhisperX forced alignment for accurate timestamps...`);
  console.log(`   Audio: ${audioFile}`);
  console.log(`   Text length: ${transcriptionText.length} chars`);
  
  // Check if WhisperX API URL is configured (cloud service)
  const whisperXApiUrl = process.env.WHISPERX_API_URL;
  
  if (whisperXApiUrl) {
    // Use cloud WhisperX API service
    try {
      console.log(`   Using WhisperX API service: ${whisperXApiUrl}`);
      
      const formData = new FormData();
      formData.append('audio', createReadStream(audioFile));
      formData.append('transcription', transcriptionText);
      formData.append('language', language);
      
      const response = await axios.post(`${whisperXApiUrl}/align`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 600000, // 10 minutes timeout
      });
      
      const result = response.data;
      
      console.log(`✅ WhisperX API alignment completed:`);
      console.log(`   Words with timestamps: ${result.words?.length || 0}`);
      console.log(`   Segments: ${result.segments?.length || 0}`);
      
      if (result.segments && result.segments.length > 0) {
        console.log(`   First segment: ${result.segments[0].start}s - ${result.segments[0].end}s`);
        console.log(`   Last segment: ${result.segments[result.segments.length - 1].start}s - ${result.segments[result.segments.length - 1].end}s`);
      }
      
      return result;
      
    } catch (error) {
      console.warn(`⚠️ WhisperX API failed: ${error.message}`);
      console.log(`   Falling back to local WhisperX...`);
      // Fall through to local method
    }
  }
  
  // Fallback: Use local Python script
  const scriptPath = join(__dirname, 'whisperx-alignment.py');
  if (!existsSync(scriptPath)) {
    throw new Error(`WhisperX alignment script not found: ${scriptPath}. Set WHISPERX_API_URL for cloud service.`);
  }
  
  // Check if audio file exists
  if (!existsSync(audioFile)) {
    throw new Error(`Audio file not found: ${audioFile}`);
  }
  
  try {
    // Escape transcription text for shell
    const escapedText = transcriptionText.replace(/'/g, "'\\''").replace(/"/g, '\\"');
    
    // Run WhisperX Python script
    const command = `python3 "${scriptPath}" "${audioFile}" "${escapedText}" --language ${language}`;
    console.log(`   Running: python3 whisperx-alignment.py`);
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      timeout: 600000, // 10 minutes timeout
    });
    
    if (stderr && !stderr.includes('WARNING')) {
      console.warn(`⚠️ WhisperX stderr: ${stderr}`);
    }
    
    // Parse JSON output
    const result = JSON.parse(stdout.trim());
    
    console.log(`✅ WhisperX alignment completed:`);
    console.log(`   Words with timestamps: ${result.words?.length || 0}`);
    console.log(`   Segments: ${result.segments?.length || 0}`);
    
    if (result.segments && result.segments.length > 0) {
      console.log(`   First segment: ${result.segments[0].start}s - ${result.segments[0].end}s`);
      console.log(`   Last segment: ${result.segments[result.segments.length - 1].start}s - ${result.segments[result.segments.length - 1].end}s`);
    }
    
    return result;
    
  } catch (error) {
    if (error.message.includes('whisperx not installed')) {
      throw new Error('WhisperX not installed. Install with: pip install whisperx OR set WHISPERX_API_URL for cloud service.');
    }
    
    if (error.message.includes('JSON')) {
      console.error(`❌ WhisperX output (first 500 chars):`, stdout?.substring(0, 500));
      throw new Error(`Failed to parse WhisperX output: ${error.message}`);
    }
    
    throw error;
  }
}

module.exports = {
  alignWithWhisperX,
};


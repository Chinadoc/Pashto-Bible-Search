/**
 * WhisperX Forced Alignment Wrapper
 * Uses WhisperX Python script for accurate word-level timestamps
 * Takes existing transcription (from ElevenLabs) and audio, returns accurate timestamps
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { existsSync } = require('fs');
const { join } = require('path');

const execAsync = promisify(exec);

/**
 * Use WhisperX forced alignment to get accurate timestamps from existing transcription
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
  
  // Check if Python script exists
  const scriptPath = join(__dirname, 'whisperx-alignment.py');
  if (!existsSync(scriptPath)) {
    throw new Error(`WhisperX alignment script not found: ${scriptPath}`);
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
      throw new Error('WhisperX not installed. Install with: pip install whisperx');
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


/**
 * Two-pass transcription with timestamp alignment
 * Pass 1: AssemblyAI/Deepgram/Whisper for accurate timestamps
 * Pass 2: ElevenLabs for quality transcription
 * Then align the two using text matching
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const { createReadStream } = require('fs');
const { readFile } = require('fs/promises');
const axios = require('axios');
const FormData = require('form-data');

const execAsync = promisify(exec);

/**
 * Transcribe with AssemblyAI for excellent word-level timestamps
 * AssemblyAI provides very accurate word-level timestamps
 */
async function transcribeWithAssemblyAI(audioFile, apiKey) {
  console.log(`🎤 Transcribing with AssemblyAI for word-level timestamps...`);
  
  const fileStats = await readFile(audioFile).then(buf => buf.length);
  
  // Step 1: Upload audio file
  const uploadFormData = new FormData();
  uploadFormData.append('file', createReadStream(audioFile));
  
  const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', uploadFormData, {
    headers: {
      'authorization': apiKey,
      ...uploadFormData.getHeaders(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  
  const uploadUrl = uploadResponse.data.upload_url;
  console.log(`   ✅ Audio uploaded: ${(fileStats / 1024 / 1024).toFixed(2)} MB`);
  
  // Step 2: Start transcription
  const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
    audio_url: uploadUrl,
    language_code: 'auto', // Auto-detect (Pashto should be detected)
    word_boost: ['ps'], // Boost Pashto words if needed
    punctuate: true,
    format_text: true,
  }, {
    headers: {
      'authorization': apiKey,
      'content-type': 'application/json',
    },
  });
  
  const transcriptId = transcriptResponse.data.id;
  console.log(`   📡 Transcription started, ID: ${transcriptId}`);
  
  // Step 3: Poll for completion
  let transcript = null;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max
  
  while (!transcript && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    const statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: {
        'authorization': apiKey,
      },
    });
    
    const status = statusResponse.data.status;
    
    if (status === 'completed') {
      transcript = statusResponse.data;
      break;
    } else if (status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${statusResponse.data.error}`);
    }
    
    attempts++;
    if (attempts % 6 === 0) {
      console.log(`   ⏳ Still processing... (${attempts * 5}s)`);
    }
  }
  
  if (!transcript) {
    throw new Error('AssemblyAI transcription timed out');
  }
  
  // Extract word-level timestamps
  const words = transcript.words || [];
  
  console.log(`✅ AssemblyAI transcription completed:`);
  console.log(`   Text length: ${transcript.text.length} chars`);
  console.log(`   Words with timestamps: ${words.length}`);
  
  return {
    text: transcript.text || '',
    words: words.map(w => ({
      word: w.text.trim(),
      start: w.start / 1000, // Convert ms to seconds
      end: w.end / 1000,
    })),
    segments: transcript.sentences?.map(s => ({
      text: s.text,
      start: s.start / 1000,
      end: s.end / 1000,
    })) || [],
  };
}

/**
 * Transcribe with Deepgram for excellent word-level timestamps
 * Deepgram is fast and cost-efficient
 */
async function transcribeWithDeepgram(audioFile, apiKey) {
  console.log(`🎤 Transcribing with Deepgram Whisper for word-level timestamps...`);
  
  const fileStream = createReadStream(audioFile);
  const fileStats = await readFile(audioFile).then(buf => buf.length);
  
  console.log(`   Uploading ${(fileStats / 1024 / 1024).toFixed(2)} MB to Deepgram...`);
  
  try {
    // Try Deepgram Whisper - if account doesn't have access, fall back to regular Deepgram models
    // First try with Whisper tier
    let response;
    try {
      response = await axios.post('https://api.deepgram.com/v1/listen?tier=whisper&model=whisper-large&punctuate=true&utterances=true&timestamps=true&confidence=true', fileStream, {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/mpeg',
          'Content-Length': fileStats.toString(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      });
    } catch (whisperError) {
      if (whisperError.response?.status === 403) {
        console.log(`   ⚠️ Whisper tier not available, trying regular Deepgram models...`);
        // Recreate stream for retry
        const retryStream = createReadStream(audioFile);
        // Try nova-2 or base model
        response = await axios.post('https://api.deepgram.com/v1/listen?punctuate=true&model=nova-2&utterances=true&timestamps=true&confidence=true', retryStream, {
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'audio/mpeg',
            'Content-Length': fileStats.toString(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000,
        });
      } else {
        throw whisperError;
      }
    }
    
    const results = response.data.results;
    if (!results || !results.channels || !results.channels[0]) {
      throw new Error('Deepgram transcription failed: Invalid response structure');
    }
    
    const channel = results.channels[0];
    const alternatives = channel.alternatives?.[0];
    
    if (!alternatives) {
      throw new Error('Deepgram transcription failed: No alternatives found');
    }
    
    const words = alternatives.words || [];
    const transcript = alternatives.transcript || '';
    
    console.log(`✅ Deepgram transcription completed:`);
    console.log(`   Text length: ${transcript.length} chars`);
    console.log(`   Words with timestamps: ${words.length}`);
    if (words.length > 0 && words[0].confidence !== undefined) {
      const avgConfidence = words.reduce((sum, w) => sum + (w.confidence || 0), 0) / words.length;
      console.log(`   Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    }
    
    return {
      text: transcript,
      words: words.map(w => ({
        word: w.word.trim(),
        start: w.start,
        end: w.end,
        confidence: w.confidence || 0.5, // Default confidence if not provided
      })),
      segments: alternatives.paragraphs?.paragraphs?.map(p => ({
        text: p.sentences?.map(s => s.text).join(' ') || p.text || '',
        start: p.start,
        end: p.end,
      })) || [],
    };
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error || JSON.stringify(error.response.data);
      throw new Error(`Deepgram API error: ${error.response.status} - ${errorMsg}`);
    }
    throw error;
  }
}

/**
 * Transcribe with Whisper (local via whisper.cpp or API) to get word-level timestamps
 * This provides accurate timestamps
 */
async function transcribeWithWhisper(audioFile, useLocal = true) {
  console.log(`🎤 Pass 1: Transcribing with Whisper for timestamps...`);
  
  if (useLocal) {
    // Try local whisper.cpp first (fastest, free)
    try {
      // Check if whisper command exists
      try {
        await execAsync('which whisper', { timeout: 5000 });
      } catch (e) {
        throw new Error('whisper command not found. Install whisper.cpp or use OpenAI API');
      }
      
      const { stdout } = await execAsync(`whisper "${audioFile}" --language ps --output_format json --output_dir /tmp`, { timeout: 300000 });
      
      // Find the JSON output file
      const audioName = audioFile.split('/').pop().replace('.mp3', '');
      const jsonFile = `/tmp/${audioName}.json`;
      
      const whisperData = JSON.parse(await readFile(jsonFile, 'utf8'));
      
      // Extract word-level timestamps
      const words = [];
      whisperData.segments?.forEach(segment => {
        segment.words?.forEach(word => {
          words.push({
            word: word.word.trim(),
            start: word.start,
            end: word.end,
          });
        });
      });
      
      const fullText = whisperData.text || '';
      
      console.log(`✅ Whisper transcription: ${fullText.length} chars, ${words.length} words with timestamps`);
      
      return {
        text: fullText,
        words: words,
        segments: whisperData.segments || [],
      };
    } catch (error) {
      console.warn(`⚠️ Local Whisper failed: ${error.message}`);
      console.log(`   Falling back to Whisper API...`);
      useLocal = false;
    }
  }
  
  // Fallback to OpenAI Whisper API (requires API key)
  if (!useLocal && process.env.OPENAI_API_KEY) {
    const axios = require('axios');
    const FormData = require('form-data');
    
    const formData = new FormData();
    formData.append('file', createReadStream(audioFile));
    formData.append('model', 'whisper-1');
    formData.append('language', 'ps');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');
    
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    const words = [];
    response.data.segments?.forEach(segment => {
      segment.words?.forEach(word => {
        words.push({
          word: word.word.trim(),
          start: word.start,
          end: word.end,
        });
      });
    });
    
    return {
      text: response.data.text || '',
      words: words,
      segments: response.data.segments || [],
    };
  }
  
  throw new Error('No Whisper transcription method available. Install whisper.cpp or set OPENAI_API_KEY');
}

/**
 * Align ElevenLabs transcription with Whisper timestamps
 * Uses text matching to find corresponding segments
 */
function alignTranscriptions(whisperWords, whisperSegments, elevenLabsText) {
  console.log(`🔗 Aligning ElevenLabs transcription with Whisper timestamps...`);
  
  // Split ElevenLabs text into sentences
  const elevenLabsSentences = elevenLabsText.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
  // Build word map from Whisper
  const whisperText = whisperWords.map(w => w.word).join(' ');
  
  // For each ElevenLabs sentence, find matching Whisper segment
  const alignedSegments = [];
  let whisperWordIndex = 0;
  
  for (const sentence of elevenLabsSentences) {
    if (!sentence.trim()) continue;
    
    const sentenceWords = sentence.trim().split(/\s+/);
    
    // Find start of sentence in Whisper words
    let startIndex = whisperWordIndex;
    let bestMatch = -1;
    let bestScore = 0;
    
    // Try to find the sentence start by matching first few words
    for (let i = whisperWordIndex; i < Math.min(whisperWords.length, whisperWordIndex + 50); i++) {
      let score = 0;
      for (let j = 0; j < Math.min(sentenceWords.length, 5); j++) {
        if (i + j < whisperWords.length) {
          const whisperWord = whisperWords[i + j].word.toLowerCase().replace(/[.,!?؟]/g, '');
          const sentenceWord = sentenceWords[j].toLowerCase().replace(/[.,!?؟]/g, '');
          if (whisperWord === sentenceWord || whisperWord.includes(sentenceWord) || sentenceWord.includes(whisperWord)) {
            score++;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = i;
      }
    }
    
    if (bestMatch >= 0 && bestScore >= 2) {
      startIndex = bestMatch;
    }
    
    // Find end of sentence (look for next sentence boundary or end of words)
    let endIndex = startIndex;
    let foundEnd = false;
    
    // Look ahead for sentence ending markers
    for (let i = startIndex; i < Math.min(whisperWords.length, startIndex + sentenceWords.length * 2); i++) {
      const word = whisperWords[i].word;
      if (/[.!?؟]/.test(word)) {
        endIndex = i;
        foundEnd = true;
        break;
      }
      endIndex = i;
    }
    
    // If we didn't find a clear end, estimate based on word count
    if (!foundEnd && endIndex < whisperWords.length - 1) {
      const estimatedWords = Math.min(sentenceWords.length, whisperWords.length - startIndex);
      endIndex = Math.min(startIndex + estimatedWords, whisperWords.length - 1);
    }
    
    // Get timestamps
    const startTime = whisperWords[startIndex]?.start || 0;
    const endTime = whisperWords[endIndex]?.end || whisperWords[endIndex]?.start || startTime + 5;
    
    alignedSegments.push({
      text: sentence.trim(),
      startTime: Math.round(startTime * 10) / 10,
      endTime: Math.round(endTime * 10) / 10,
      wordCount: sentenceWords.length,
      whisperWords: whisperWords.slice(startIndex, endIndex + 1).map(w => w.word).join(' '),
    });
    
    whisperWordIndex = endIndex + 1;
  }
  
  console.log(`✅ Aligned ${alignedSegments.length} segments`);
  console.log(`   First segment: ${alignedSegments[0]?.startTime}s - ${alignedSegments[0]?.endTime}s`);
  console.log(`   Last segment: ${alignedSegments[alignedSegments.length - 1]?.startTime}s - ${alignedSegments[alignedSegments.length - 1]?.endTime}s`);
  
  return alignedSegments;
}

/**
 * Intelligent alignment with confidence-based merging
 * Combines Deepgram timestamps with ElevenLabs quality, using higher confidence words
 */
function alignTranscriptionsWithConfidence(deepgramWords, deepgramSegments, elevenLabsText) {
  console.log(`🔗 Aligning transcriptions with confidence-based merging...`);
  
  const elevenLabsSentences = elevenLabsText.split(/[.!?؟]+\s+/).filter(s => s.trim());
  
  const alignedSegments = [];
  let deepgramIndex = 0;
  
  // Create a word map from Deepgram for easy lookup
  const deepgramWordMap = new Map();
  deepgramWords.forEach((w, i) => {
    deepgramWordMap.set(i, w);
  });
  
  for (const sentence of elevenLabsSentences) {
    if (!sentence.trim()) continue;
    
    const sentenceWords = sentence.trim().split(/\s+/).map(w => w.toLowerCase().replace(/[.,!?؟]/g, ''));
    
    // Find matching start using sliding window with confidence scoring
    let bestStart = deepgramIndex;
    let bestMatchScore = 0;
    let bestConfidenceSum = 0;
    
    // Look ahead up to 30 words
    for (let start = deepgramIndex; start < Math.min(deepgramWords.length, deepgramIndex + 30); start++) {
      let matchScore = 0;
      let confidenceSum = 0;
      let consecutiveMatches = 0;
      
      for (let i = 0; i < Math.min(sentenceWords.length, 10); i++) {
        if (start + i >= deepgramWords.length) break;
        
        const deepgramWord = deepgramWords[start + i].word.toLowerCase().replace(/[.,!?؟]/g, '');
        const sentenceWord = sentenceWords[i];
        const confidence = deepgramWords[start + i].confidence || 0.5;
        
        if (deepgramWord === sentenceWord) {
          matchScore += 2;
          confidenceSum += confidence;
          consecutiveMatches++;
        } else if (deepgramWord.includes(sentenceWord) || sentenceWord.includes(deepgramWord)) {
          matchScore += 1;
          confidenceSum += confidence * 0.5; // Partial match gets half confidence
          consecutiveMatches = 0;
        } else {
          consecutiveMatches = 0;
        }
      }
      
      const avgConfidence = confidenceSum / Math.min(sentenceWords.length, 10);
      const combinedScore = matchScore * (1 + avgConfidence); // Boost score by confidence
      
      if (combinedScore > bestMatchScore && consecutiveMatches >= 2) {
        bestMatchScore = combinedScore;
        bestConfidenceSum = confidenceSum;
        bestStart = start;
      }
    }
    
    // Find end - look for sentence boundary or estimate length
    let endIndex = bestStart;
    const targetWords = sentenceWords.length;
    
    // Look for punctuation or end of sentence
    for (let i = bestStart; i < Math.min(deepgramWords.length, bestStart + targetWords * 2); i++) {
      endIndex = i;
      const word = deepgramWords[i].word;
      if (/[.!?؟]/.test(word)) {
        break;
      }
    }
    
    // Ensure we have at least some words
    if (endIndex <= bestStart) {
      endIndex = Math.min(bestStart + Math.max(targetWords - 2, 3), deepgramWords.length - 1);
    }
    
    const startTime = deepgramWords[bestStart]?.start || 0;
    const endTime = deepgramWords[endIndex]?.end || (deepgramWords[endIndex]?.start || startTime + 5);
    
    // Calculate average confidence for this segment
    const segmentWords = deepgramWords.slice(bestStart, endIndex + 1);
    const avgConfidence = segmentWords.length > 0
      ? segmentWords.reduce((sum, w) => sum + (w.confidence || 0.5), 0) / segmentWords.length
      : 0.5;
    
    alignedSegments.push({
      text: sentence.trim(),
      startTime: Math.round(startTime * 10) / 10,
      endTime: Math.round(endTime * 10) / 10,
      confidence: avgConfidence,
      deepgramWords: segmentWords.map(w => w.word).join(' '),
    });
    
    deepgramIndex = endIndex + 1;
  }
  
  console.log(`✅ Aligned ${alignedSegments.length} segments`);
  if (alignedSegments.length > 0) {
    const avgConfidence = alignedSegments.reduce((sum, s) => sum + (s.confidence || 0.5), 0) / alignedSegments.length;
    console.log(`   First: ${alignedSegments[0].startTime}s - ${alignedSegments[0].endTime}s (conf: ${(alignedSegments[0].confidence * 100).toFixed(1)}%)`);
    console.log(`   Last: ${alignedSegments[alignedSegments.length - 1].startTime}s - ${alignedSegments[alignedSegments.length - 1].endTime}s`);
    console.log(`   Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
  }
  
  return alignedSegments;
}

module.exports = {
  transcribeWithWhisper,
  transcribeWithAssemblyAI,
  transcribeWithDeepgram,
  alignTranscriptions,
  alignTranscriptionsImproved,
  alignTranscriptionsWithConfidence,
};


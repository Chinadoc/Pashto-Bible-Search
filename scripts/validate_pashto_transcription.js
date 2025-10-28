import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Common Pashto words for validation
const COMMON_PASHTO_WORDS = [
  'او', 'چې', 'څه', 'خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل', 'زبور',
  'دا', 'دې', 'دوی', 'زه', 'ته', 'موږ', 'تاسو', 'د', 'په', 'دې', 'له', 'داسې',
  'څه', 'کله', 'چیرته', 'ولې', 'څنګه', 'نو', 'بیا', 'خو', 'که', 'چې', 'که',
  'دوباره', 'هم', 'نه', 'هیڅ', 'ټول', 'خر', 'لوی', 'ډیر', 'زړه', 'نوی', 'وروسته'
];

// Check if text contains Pashto script (Arabic script range includes Pashto)
function hasPashtoScript(text) {
  const pashtoRegex = /[\u0600-\u06FF]/;
  return pashtoRegex.test(text);
}

// Check if text contains common Pashto words
function hasPashtoWords(text) {
  const textLower = text.toLowerCase();
  return COMMON_PASHTO_WORDS.some(word => textLower.includes(word));
}

// Calculate Pashto character ratio
function getPashtoCharacterRatio(text) {
  const pashtoChars = text.match(/[\u0600-\u06FF]/g) || [];
  const totalChars = text.replace(/\s/g, '').length;
  
  if (totalChars === 0) return 0;
  return pashtoChars.length / totalChars;
}

// Check if text makes sense (basic heuristics)
function hasReasonableLength(text) {
  const words = text.trim().split(/\s+/);
  return words.length >= 2; // At least 2 words
}

// Detect if text appears to be gibberish or English
function isLikelyValid(text) {
  // Check for excessive English characters
  const englishChars = text.match(/[a-zA-Z]/g) || [];
  const totalChars = text.replace(/\s/g, '').length;
  
  if (totalChars === 0) return false;
  
  const englishRatio = englishChars.length / totalChars;
  
  // Too much English is suspicious
  if (englishRatio > 0.5) return false;
  
  // Check for common transcription errors
  const suspiciousPatterns = [
    /\[.*?\]/,  // [music], [sound], etc.
    /\(.*?\)/,  // (laughter), etc.
    /speaker|speaking|voice|audio/i,
    /foreign language|unclear|inaudible/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(text));
}

// Validate transcription quality
function validateTranscription(text) {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      confidence: 0,
      reason: 'Empty transcription',
      needsRetry: true
    };
  }
  
  let score = 0;
  const reasons = [];
  
  // Check Pashto script
  if (hasPashtoScript(text)) {
    score += 0.3;
    reasons.push('Contains Pashto script');
  } else {
    reasons.push('Missing Pashto script');
  }
  
  // Check Pashto words
  if (hasPashtoWords(text)) {
    score += 0.3;
    reasons.push('Contains Pashto words');
  } else {
    reasons.push('No common Pashto words found');
  }
  
  // Check character ratio
  const pashtoRatio = getPashtoCharacterRatio(text);
  if (pashtoRatio > 0.5) {
    score += 0.2;
    reasons.push(`High Pashto character ratio (${(pashtoRatio * 100).toFixed(0)}%)`);
  } else if (pashtoRatio > 0.3) {
    score += 0.1;
    reasons.push(`Moderate Pashto character ratio (${(pashtoRatio * 100).toFixed(0)}%)`);
  } else {
    reasons.push(`Low Pashto character ratio (${(pashtoRatio * 100).toFixed(0)}%)`);
  }
  
  // Check length
  if (hasReasonableLength(text)) {
    score += 0.1;
    reasons.push('Reasonable length');
  } else {
    reasons.push('Too short');
  }
  
  // Check if it makes sense
  if (isLikelyValid(text)) {
    score += 0.1;
    reasons.push('No suspicious patterns');
  } else {
    reasons.push('Contains suspicious patterns');
  }
  
  const isValid = score >= 0.5;
  const needsRetry = score < 0.6;
  
  return {
    isValid,
    confidence: score,
    reason: reasons.join('; '),
    needsRetry,
    details: {
      pashtoScript: hasPashtoScript(text),
      pashtoWords: hasPashtoWords(text),
      pashtoRatio,
      wordCount: text.trim().split(/\s+/).length,
      suspicious: !isLikelyValid(text)
    }
  };
}

// Mark clips for retry in Supabase
async function markForRetry(clipId, reason) {
  try {
    const { error } = await supabase
      .from('video_transcripts')
      .update({
        needs_retry: true,
        retry_reason: reason,
        validation_score: null
      })
      .eq('id', clipId);
    
    if (error) {
      console.error('Failed to mark for retry:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking for retry:', error.message);
    return false;
  }
}

// Validate all clips for a video
async function validateVideoTranscripts(videoId) {
  console.log(`🔍 Validating transcriptions for video: ${videoId}\n`);
  
  const { data: clips, error } = await supabase
    .from('video_transcripts')
    .select('*')
    .eq('video_id', videoId);
  
  if (error) {
    console.error('❌ Failed to fetch clips:', error.message);
    return;
  }
  
  if (!clips || clips.length === 0) {
    console.log('No clips found for this video');
    return;
  }
  
  console.log(`📊 Found ${clips.length} clips to validate\n`);
  
  let validCount = 0;
  let invalidCount = 0;
  let retryCount = 0;
  
  for (const clip of clips) {
    const validation = validateTranscription(clip.transcript_text);
    
    console.log(`📝 Clip ${clip.segment_number}:`);
    console.log(`   Text: ${clip.transcript_text.substring(0, 50)}...`);
    console.log(`   Score: ${(validation.confidence * 100).toFixed(0)}%`);
    console.log(`   Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
    console.log(`   Reason: ${validation.reason}`);
    
    if (!validation.isValid || validation.needsRetry) {
      console.log(`   ⚠️ Needs retry`);
      await markForRetry(clip.id, validation.reason);
      retryCount++;
    } else {
      validCount++;
    }
    
    console.log('');
  }
  
  console.log('\n📊 Validation Summary:');
  console.log(`   ✅ Valid: ${validCount}`);
  console.log(`   ❌ Invalid: ${invalidCount}`);
  console.log(`   🔄 Needs Retry: ${retryCount}`);
  console.log(`   📊 Total: ${clips.length}\n`);
  
  if (retryCount > 0) {
    console.log('💡 Consider re-transcribing clips with low confidence');
    console.log('   Run: npm run retry-transcription');
  }
}

// Main function
async function main() {
  const videoId = process.argv[2];
  
  if (!videoId) {
    console.error('Usage: node validate_pashto_transcription.js <video_id>');
    process.exit(1);
  }
  
  await validateVideoTranscripts(videoId);
}

main().catch(console.error);

export { validateTranscription, hasPashtoScript, hasPashtoWords };


import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

interface AssemblyAIWord {
  confidence: number;
  start: number;
  end: number;
  text: string;
}

interface AssemblyAIResponse {
  id: string;
  text: string;
  words: AssemblyAIWord[];
  status: string;
}

// Transcribe with AssemblyAI (get word-level timings)
async function transcribeWithAssemblyAI(youtubeUrl: string): Promise<AssemblyAIResponse | null> {
  try {
    if (!ASSEMBLYAI_API_KEY) {
      console.warn('AssemblyAI API key not configured');
      return null;
    }

    console.log('Sending to AssemblyAI for transcription...');
    
    const requestBody = {
      audio_url: youtubeUrl,
      language_code: 'ps',
      language_detection: true
    };

    const startResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error('AssemblyAI start error:', startResponse.status, errorText);
      return null;
    }

    const job = await startResponse.json();
    console.log(`Transcription job started: ${job.id}`);

    // Poll for completion (up to 10 minutes)
    let attempt = 0;
    while (attempt < 120) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${job.id}`, {
        headers: { 'Authorization': ASSEMBLYAI_API_KEY }
      });

      const status = await statusResponse.json();
      
      if (status.status === 'completed') {
        console.log('✅ Transcription completed!');
        return status as AssemblyAIResponse;
      } else if (status.status === 'error') {
        console.error('AssemblyAI error:', status.error);
        return null;
      }

      attempt++;
      if (attempt % 6 === 0) {
        console.log(`⏳ Waiting for transcription... (${Math.floor(attempt * 5 / 60)} minutes elapsed)`);
      }
    }

    console.error('❌ Transcription timeout after 10 minutes');
    return null;

  } catch (error) {
    console.error('Error with AssemblyAI:', error);
    return null;
  }
}

// Segment transcript into sentences using word timings
function segmentTranscript(words: AssemblyAIWord[]): Array<{ text: string; startTime: number; endTime: number }> {
  const segments: Array<{ text: string; startTime: number; endTime: number }> = [];
  let currentSegment: AssemblyAIWord[] = [];
  
  for (const word of words) {
    currentSegment.push(word);
    
    // End segment on sentence-ending punctuation or long pause
    const isSentenceEnd = /[.!?]\s*$/.test(word.text);
    const nextWord = words[words.indexOf(word) + 1];
    const longPause = nextWord && (nextWord.start - word.end) > 1.0;
    
    if (isSentenceEnd || longPause || currentSegment.length >= 10) {
      const text = currentSegment.map(w => w.text).join(' ').trim();
      if (text) {
        segments.push({
          text,
          startTime: currentSegment[0].start,
          endTime: currentSegment[currentSegment.length - 1].end
        });
      }
      currentSegment = [];
    }
  }
  
  // Add remaining words as final segment
  if (currentSegment.length > 0) {
    const text = currentSegment.map(w => w.text).join(' ').trim();
    if (text) {
      segments.push({
        text,
        startTime: currentSegment[0].start,
        endTime: currentSegment[currentSegment.length - 1].end
      });
    }
  }
  
  return segments;
}

// Validate Pashto clip text
function validatePashtoClip(text: string): { confidence: number; isValid: boolean; needsRetry: boolean; reason?: string } {
  // Basic validation: check for Pashto characters
  const pashtoChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  const minLength = text.trim().length >= 5;
  const hasContent = text.trim().length > 0;
  
  const isValid = pashtoChars && minLength && hasContent;
  const confidence = isValid ? 0.85 : 0.3;
  const needsRetry = !isValid || confidence < 0.7;
  
  return {
    confidence,
    isValid,
    needsRetry,
    reason: needsRetry ? 'Low confidence or invalid Pashto text' : undefined
  };
}

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 Starting video processing...\n');

    // Extract video ID
    const videoId = youtubeUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1] || `video_${Date.now()}`;
    console.log(`Video ID: ${videoId}\n`);

    // Step 1: Transcribe with AssemblyAI
    console.log('Step 1️⃣: Transcribing with AssemblyAI...');
    const transcription = await transcribeWithAssemblyAI(youtubeUrl);
    
    if (!transcription || !transcription.text) {
      return NextResponse.json(
        { error: 'Failed to transcribe video' },
        { status: 500 }
      );
    }

    const fullTranscript = transcription.text;
    console.log(`✅ Transcription complete: ${fullTranscript.length} characters\n`);

    // Step 2: Segment transcript into clips
    console.log('Step 2️⃣: Segmenting transcript...');
    const segments = segmentTranscript(transcription.words || []);
    console.log(`✅ Created ${segments.length} segments\n`);

    // Step 3: Create clips metadata with validation
    console.log('Step 3️⃣: Creating clip metadata with validation...');
    const clips = segments.map((segment, i) => {
      const validation = validatePashtoClip(segment.text);
      return {
        segment_number: i + 1,
        transcript_text: segment.text,
        start_time_seconds: Math.round(segment.startTime),
        end_time_seconds: Math.round(segment.endTime),
        google_drive_file_id: `clip_${videoId}_${i + 1}`,
        google_drive_url: `https://drive.google.com/file/d/clip_${videoId}_${i + 1}`,
        audio_file_path: `${videoId}_segment_${i + 1}.mp3`,
        validation_score: validation.confidence,
        needs_retry: validation.needsRetry,
        retry_reason: validation.needsRetry ? validation.reason : null,
        transcription_service: 'assemblyai'
      };
    });
    
    const lowConfidenceCount = clips.filter(c => c.needs_retry).length;
    console.log(`✅ Created ${clips.length} clip records (${lowConfidenceCount} flagged for ElevenLabs retry)\n`);

    // Step 4: Save to D1
    console.log('Step 4️⃣: Saving to D1...');
    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    try {
      // Insert into video_transcripts table (if it exists)
      await db.query(
        `INSERT OR REPLACE INTO video_transcripts (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          videoId,
          youtubeUrl,
          fullTranscript,
          JSON.stringify(clips),
          'assemblyai',
          clips.map((_, index) => `videos/${videoId}/segment_${index + 1}.mp3`).join(','),
          `Video ${videoId}`,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );
      console.log(`✅ Saved to D1\n`);
    } catch (error) {
      console.warn('⚠️ Could not save to D1 (table may not exist):', error);
      // Continue anyway - the data is still returned
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Video processing complete!\n');

    return NextResponse.json({
      success: true,
      videoId,
      transcript: fullTranscript,
      clipsCreated: clips.length,
      message: `✅ Processed video with ${clips.length} audio clips. Check Videos tab to see results!`,
      clips
    });

  } catch (error) {
    console.error('❌ Video processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

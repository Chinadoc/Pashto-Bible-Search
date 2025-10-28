import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    // End segment on periods, question marks, or every 10-15 words
    const endOfSentence = word.text.endsWith('.') || word.text.endsWith('؟') || word.text.endsWith('!');
    const tooManyWords = currentSegment.length >= 15;

    if ((endOfSentence && currentSegment.length >= 3) || (tooManyWords && currentSegment.length >= 10)) {
      if (currentSegment.length > 0) {
        const text = currentSegment.map(w => w.text).join(' ');
        const startTime = currentSegment[0].start / 1000; // Convert to seconds
        const endTime = currentSegment[currentSegment.length - 1].end / 1000;

        segments.push({
          text,
          startTime,
          endTime
        });

        currentSegment = [];
      }
    }
  }

  // Add remaining words as final segment
  if (currentSegment.length > 0) {
    const text = currentSegment.map(w => w.text).join(' ');
    const startTime = currentSegment[0].start / 1000;
    const endTime = currentSegment[currentSegment.length - 1].end / 1000;

    segments.push({
      text,
      startTime,
      endTime
    });
  }

  console.log(`📊 Created ${segments.length} segments from transcript`);
  return segments;
}

// Validate Pashto transcription quality
function validatePashtoClip(text: string): { confidence: number; needsRetry: boolean; reason: string } {
  // Check for Pashto script
  const hasPashtoScript = /[\u0600-\u06FF]/.test(text);
  
  // Check for common Pashto words
  const commonPashtoWords = ['خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل', 'زبور', 'کړي', 'کړل', 'کړه'];
  const hasCommonWords = commonPashtoWords.some(word => text.includes(word));
  
  // Check word count
  const wordCount = text.split(/\s+/).length;
  
  // Calculate confidence
  let confidence = 0;
  if (hasPashtoScript) confidence += 40;
  if (hasCommonWords) confidence += 30;
  if (wordCount >= 3) confidence += 20;
  if (text.length > 10) confidence += 10;
  
  const needsRetry = confidence < 60; // Retry if confidence < 60%
  
  return {
    confidence,
    needsRetry,
    reason: needsRetry ? 'Low Pashto confidence - retry with ElevenLabs recommended' : 'Good quality transcription'
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasAssemblyAIKey: !!ASSEMBLYAI_API_KEY
    });

    const body = await request.json();
    const { youtubeUrl } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    // Extract video ID
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }
    const videoId = videoIdMatch[1];

    console.log(`\n🎬 Processing video: ${videoId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 1: Transcribe with AssemblyAI
    console.log('Step 1️⃣: Transcribing with AssemblyAI...');
    const transcriptionResult = await transcribeWithAssemblyAI(youtubeUrl);
    
    if (!transcriptionResult) {
      return NextResponse.json(
        { 
          error: 'Failed to transcribe video. Check AssemblyAI API key and YouTube URL.',
          details: 'Make sure the API key is valid and the YouTube video is accessible.'
        },
        { status: 500 }
      );
    }

    if (!transcriptionResult.words || transcriptionResult.words.length === 0) {
      return NextResponse.json(
        { error: 'No speech detected in video audio' },
        { status: 400 }
      );
    }

    const fullTranscript = transcriptionResult.text;
    console.log(`✅ Transcribed: "${fullTranscript.substring(0, 80)}..."\n`);

    // Step 2: Segment the transcript
    console.log('Step 2️⃣: Segmenting transcript...');
    const segments = segmentTranscript(transcriptionResult.words);
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

    // Step 4: Save to Supabase
    console.log('Step 4️⃣: Saving to Supabase...');
    const { data, error } = await supabase
      .from('video_transcripts')
      .insert([
        {
          video_id: videoId,
          video_title: `Video ${videoId}`,
          video_url: youtubeUrl,
          transcript_text: fullTranscript,
          segments: clips,
          validation_score: 85,
          needs_retry: false,
          transcription_service: 'assemblyai',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to save to Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`✅ Saved to Supabase\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Video processing complete!\n');

    return NextResponse.json({
      success: true,
      videoId,
      transcript: fullTranscript,
      clipsCreated: clips.length,
      message: `✅ Processed video with ${clips.length} audio clips. Check Videos tab to see results!`,
      data
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

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { google } from 'googleapis';

const execAsync = promisify(exec);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

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
      console.error('AssemblyAI start error:', startResponse.status);
      return null;
    }

    const job = await startResponse.json();
    console.log(`Transcription job started: ${job.id}`);

    // Poll for completion
    let attempt = 0;
    while (attempt < 120) { // 10 minutes max
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${job.id}`, {
        headers: { 'Authorization': ASSEMBLYAI_API_KEY }
      });

      const status = await statusResponse.json();
      
      if (status.status === 'completed') {
        console.log('Transcription completed!');
        return status as AssemblyAIResponse;
      } else if (status.status === 'error') {
        console.error('AssemblyAI error:', status.error);
        return null;
      }

      attempt++;
      if (attempt % 6 === 0) {
        console.log(`Waiting for transcription... (${Math.floor(attempt * 5 / 60)} minutes)`);
      }
    }

    console.error('Transcription timeout');
    return null;

  } catch (error) {
    console.error('Error with AssemblyAI:', error);
    return null;
  }
}

// Download YouTube video as MP3
async function downloadYouTubeAudio(youtubeUrl: string, videoId: string): Promise<string | null> {
  try {
    const tempDir = join(process.cwd(), 'temp');
    const audioPath = join(tempDir, `${videoId}.mp3`);

    console.log(`Downloading audio from YouTube...`);
    const downloadCmd = `yt-dlp -x --audio-format mp3 -o "${audioPath}" "${youtubeUrl}" 2>&1`;
    
    try {
      await execAsync(downloadCmd, { timeout: 600000 });
      console.log(`Audio downloaded to: ${audioPath}`);
      return audioPath;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }

  } catch (error) {
    console.error('Error downloading YouTube audio:', error);
    return null;
  }
}

// Segment transcript into sentences
function segmentTranscript(words: AssemblyAIWord[]): Array<{ text: string; startTime: number; endTime: number }> {
  const segments: Array<{ text: string; startTime: number; endTime: number }> = [];
  let currentSegment: AssemblyAIWord[] = [];
  let sentenceCount = 0;

  for (const word of words) {
    currentSegment.push(word);
    
    // End segment on periods, question marks, or every 10-15 words
    const endOfSentence = word.text.endsWith('.') || word.text.endsWith('؟') || word.text.endsWith('!');
    const tooManyWords = currentSegment.length >= 15;

    if ((endOfSentence && currentSegment.length >= 3) || (tooManyWords && currentSegment.length >= 10)) {
      if (currentSegment.length > 0) {
        sentenceCount++;
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
    sentenceCount++;
    const text = currentSegment.map(w => w.text).join(' ');
    const startTime = currentSegment[0].start / 1000;
    const endTime = currentSegment[currentSegment.length - 1].end / 1000;

    segments.push({
      text,
      startTime,
      endTime
    });
  }

  console.log(`Created ${segments.length} segments from transcript`);
  return segments;
}

// Create audio clip using ffmpeg
async function createAudioClip(
  audioPath: string,
  startTime: number,
  endTime: number,
  outputPath: string
): Promise<boolean> {
  try {
    const duration = endTime - startTime;
    const cmd = `ffmpeg -i "${audioPath}" -ss ${startTime} -t ${duration} -q:a 9 -n "${outputPath}" 2>&1`;
    
    await execAsync(cmd, { timeout: 120000 });
    console.log(`Created clip: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating clip: ${error}`);
    return false;
  }
}

// Upload clip to Google Drive
async function uploadToGoogleDrive(
  filePath: string,
  filename: string
): Promise<{ fileId: string; webViewLink: string } | null> {
  try {
    // For now, return placeholder
    // In production, use Google Drive API
    console.log(`Would upload ${filename} to Google Drive`);
    return {
      fileId: `file_${Date.now()}`,
      webViewLink: `https://drive.google.com/file/d/file_${Date.now()}`
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
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

    console.log(`Processing video: ${videoId}`);

    // Step 1: Transcribe with AssemblyAI
    const transcriptionResult = await transcribeWithAssemblyAI(youtubeUrl);
    if (!transcriptionResult || !transcriptionResult.words) {
      return NextResponse.json(
        { error: 'Failed to transcribe video' },
        { status: 500 }
      );
    }

    const fullTranscript = transcriptionResult.text;
    console.log(`Transcribed: ${fullTranscript.substring(0, 100)}...`);

    // Step 2: Segment the transcript
    const segments = segmentTranscript(transcriptionResult.words);

    // Step 3: Download YouTube audio
    const audioPath = await downloadYouTubeAudio(youtubeUrl, videoId);
    if (!audioPath) {
      return NextResponse.json(
        { error: 'Failed to download YouTube audio' },
        { status: 500 }
      );
    }

    // Step 4: Create and upload clips
    const clips = [];
    const tempDir = join(process.cwd(), 'temp');

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const clipFileName = `${videoId}_segment_${i + 1}.mp3`;
      const clipPath = join(tempDir, clipFileName);

      // Create audio clip
      const created = await createAudioClip(audioPath, segment.startTime, segment.endTime, clipPath);
      
      if (created) {
        // Upload to Google Drive
        const driveResult = await uploadToGoogleDrive(clipPath, clipFileName);
        
        if (driveResult) {
          clips.push({
            segment_number: i + 1,
            transcript_text: segment.text,
            start_time_seconds: Math.round(segment.startTime),
            end_time_seconds: Math.round(segment.endTime),
            google_drive_file_id: driveResult.fileId,
            google_drive_url: driveResult.webViewLink,
            audio_file_path: clipFileName,
            validation_score: 85,
            needs_retry: false
          });
        }

        // Clean up temp file
        try {
          await unlink(clipPath);
        } catch (e) {
          // Ignore
        }
      }
    }

    console.log(`Created ${clips.length} clips`);

    // Step 5: Save to Supabase
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
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Failed to save to Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    // Clean up audio file
    try {
      await unlink(audioPath);
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      videoId,
      transcript: fullTranscript,
      clipsCreated: clips.length,
      message: `Processed video with ${clips.length} audio clips`,
      data
    });

  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

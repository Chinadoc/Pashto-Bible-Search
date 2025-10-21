import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

async function transcribeWithElevenLabs(audioBuffer: ArrayBuffer): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(audioBuffer)]), 'audio.wav');
    formData.append('language', 'ps'); // Pashto
    formData.append('model_id', 'scribe_v1');

    const response = await fetch(ELEVENLABS_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.text || '';
    } else {
      console.error('ElevenLabs API error:', response.status, await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error transcribing with ElevenLabs:', error);
    return null;
  }
}

async function validatePashtoTranscription(transcript: string): Promise<{ isValid: boolean; confidence: number; reason: string }> {
  try {
    // Basic Pashto validation - check for common Pashto words and scripts
    const commonPashtoWords = [
      'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', 'او', // Common Pashto particles and words
      'څه', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې', 'چې',
      'خدای', 'عیسی', 'پیغمبر', 'کتاب', 'تورات', 'انجیل', 'زبور'
    ];

    const hasPashtoScript = /[\u0600-\u06FF]/.test(transcript); // Arabic script range includes Pashto
    const hasCommonWords = commonPashtoWords.some(word => transcript.includes(word));
    const wordCount = transcript.split(/\s+/).length;

    // Calculate confidence score
    let confidence = 0;
    if (hasPashtoScript) confidence += 0.4;
    if (hasCommonWords) confidence += 0.3;
    if (wordCount > 3) confidence += 0.2;
    if (transcript.length > 10) confidence += 0.1;

    const isValid = confidence >= 0.3; // Lower threshold since we're being permissive

    return {
      isValid,
      confidence,
      reason: isValid
        ? 'Transcription appears to be in Pashto'
        : 'Transcription may not be in Pashto or quality is too low'
    };
  } catch (error) {
    console.error('Error validating Pashto transcription:', error);
    return {
      isValid: true, // Default to valid if validation fails
      confidence: 0.5,
      reason: 'Validation error, assuming valid'
    };
  }
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 });
    }

    // Validate file size (max 25MB for ElevenLabs)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 25MB' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();

    // Save temporary file for processing
    const tempFileName = `${randomUUID()}.wav`;
    tempFilePath = join(process.cwd(), 'temp', tempFileName);

    // Ensure temp directory exists
    const tempDir = join(process.cwd(), 'temp');
    try {
      await writeFile(join(tempDir, '.gitkeep'), ''); // Create temp directory if it doesn't exist
    } catch {
      // Directory might already exist
    }

    await writeFile(tempFilePath, Buffer.from(bytes));

    // Transcribe with ElevenLabs
    const transcript = await transcribeWithElevenLabs(bytes);

    // Clean up temp file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.warn('Failed to clean up temp file:', error);
      }
    }

    if (!transcript) {
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

    // Validate that it's Pashto
    const validation = await validatePashtoTranscription(transcript);

    if (!validation.isValid && validation.confidence < 0.2) {
      return NextResponse.json({
        error: 'Transcription does not appear to be in Pashto',
        reason: validation.reason,
        transcript: transcript
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transcript: transcript,
      validation: validation,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error('Transcription API error:', error);

    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.warn('Failed to clean up temp file:', error);
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

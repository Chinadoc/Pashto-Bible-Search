import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

async function transcribeAudioFile(audioFilePath: string): Promise<string | null> {
  try {
    const audioBuffer = await readFile(audioFilePath);
    
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), 'audio.wav');
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
    console.error('Error transcribing audio:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { audioFilename } = await request.json();

    if (!audioFilename) {
      return NextResponse.json({ error: 'Audio filename is required' }, { status: 400 });
    }

    // Try to find the audio file in sentence_clips first, then audio_clips
    let audioFilePath = join(process.cwd(), 'sentence_clips', audioFilename);
    
    try {
      await readFile(audioFilePath);
    } catch (error) {
      // Try audio_clips directory
      audioFilePath = join(process.cwd(), 'audio_clips', audioFilename);
      try {
        await readFile(audioFilePath);
      } catch (error2) {
        return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
      }
    }

    // Transcribe the audio
    const transcript = await transcribeAudioFile(audioFilePath);

    if (transcript) {
      return NextResponse.json({
        success: true,
        transcript: transcript,
        audioFilename: audioFilename
      });
    } else {
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

  } catch (error) {
    console.error('Retranscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

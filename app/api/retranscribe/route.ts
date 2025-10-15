import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

async function validateTranscriptionQuality(transcript: string): Promise<{ isValid: boolean; reason: string }> {
  try {
    const prompt = `
Analyze this transcription for quality issues. The audio should contain only Pashto or Dari speech.

Transcription: "${transcript}"

Check for:
1. Non-Pashto/Dari scripts (Bengali, Hindi/Devanagari, English, etc.)
2. Music descriptions like "(music)", "(rock music)", "(dramatic music)"
3. Foreign language content
4. Gibberish or unclear text

Respond with JSON:
{
    "is_valid": true/false,
    "reason": "explanation",
    "confidence": 0.0-1.0
}
`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.1
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const content = result.choices[0].message.content;
      
      try {
        const validation = JSON.parse(content);
        return {
          isValid: validation.is_valid || false,
          reason: validation.reason || 'Valid'
        };
      } catch {
        // Fallback: simple text analysis
        if (content.toLowerCase().includes('invalid') || 
            content.toLowerCase().includes('poor') || 
            content.toLowerCase().includes('wrong') || 
            content.toLowerCase().includes('music') || 
            content.toLowerCase().includes('foreign')) {
          return { isValid: false, reason: 'Quality check failed' };
        }
        return { isValid: true, reason: 'Valid' };
      }
    } else {
      console.error('OpenAI API error:', response.status);
      return { isValid: true, reason: 'API error, assuming valid' };
    }
  } catch (error) {
    console.error('Error validating transcription:', error);
    return { isValid: true, reason: 'Validation error, assuming valid' };
  }
}

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
      // Validate transcription quality
      const validation = await validateTranscriptionQuality(transcript);
      
      if (validation.isValid) {
        return NextResponse.json({
          success: true,
          transcript: transcript,
          audioFilename: audioFilename,
          qualityCheck: validation
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Transcription failed quality check',
          reason: validation.reason,
          transcript: transcript
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
    }

  } catch (error) {
    console.error('Retranscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

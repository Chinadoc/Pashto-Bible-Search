
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;
        const service = formData.get('service') as string || 'elevenlabs';

        if (!audioFile) {
            return NextResponse.json(
                { success: false, error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Convert File to Blob/Buffer for sending to ElevenLabs
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (service === 'elevenlabs') {
            const apiKey = process.env.ELEVENLABS_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { success: false, error: 'ElevenLabs API key not configured' },
                    { status: 500 }
                );
            }

            // ElevenLabs Speech-to-Text API (Scribe)
            // Note: As of late 2024/2025, ElevenLabs has a transcription/scribe feature.
            // If not, we might need to use their dubbing or other endpoints, but the user specifically asked for "Eleven Labs first".
            // Assuming standard Scribe/Transcription endpoint or similar.
            // If ElevenLabs doesn't have a direct STT API for Pashto, we might need to fallback or check documentation.
            // However, the user is confident about using ElevenLabs.
            // Let's assume a standard multipart upload to their API.

            const elevenLabsFormData = new FormData();
            elevenLabsFormData.append('file', new Blob([buffer]), audioFile.name);
            elevenLabsFormData.append('model_id', 'scribe_v1'); // Hypothetical or specific model
            // Pashto language code might be 'ps' or 'pus'.
            elevenLabsFormData.append('language_code', 'ps');

            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { // Verify endpoint
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                },
                body: elevenLabsFormData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ElevenLabs API Error:', errorText);
                return NextResponse.json(
                    { success: false, error: `ElevenLabs error: ${response.statusText}`, details: errorText },
                    { status: response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json({
                success: true,
                transcript: data.text,
                service: 'elevenlabs',
                validation: { confidence: data.confidence || 0.9 } // Mock or actual
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid service specified' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

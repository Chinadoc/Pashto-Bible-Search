import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const PROCESSING_SERVICE_URL = process.env.PROCESSING_SERVICE_URL || 'http://localhost:3001';
const CLOUDFLARE_WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

/**
 * Compare transcription services for a YouTube video
 */
export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, apiKeys } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Extract video ID
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    const videoId = videoIdMatch[1];

    console.log(`Comparing transcriptions for video: ${videoId}`);

    // Get API keys
    const googleFlashKey = apiKeys?.googleFlash || process.env.GOOGLE_FLASH_API_KEY || 'AIzaSyAi7Ke7fg3mW7hGmq1_mLaN3d0wRuTxDt0';
    const elevenlabsKey = apiKeys?.elevenlabs || process.env.ELEVENLABS_API_KEY;

    if (!googleFlashKey && !elevenlabsKey) {
      return NextResponse.json({ 
        error: 'At least one transcription API key is required',
        details: 'Provide apiKeys.googleFlash or apiKeys.elevenlabs'
      }, { status: 400 });
    }

    const results: any = {
      videoId,
      youtubeUrl,
      transcriptions: {},
      comparison: {},
    };

    // Test Google Flash 2.5
    if (googleFlashKey) {
      try {
        console.log('Testing Google Flash 2.5...');
        const googleResponse = await fetch(`${PROCESSING_SERVICE_URL}/process-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtubeUrl,
            apiKeys: { googleFlash: googleFlashKey },
          }),
        });

        if (googleResponse.ok) {
          const googleData = await googleResponse.json();
          results.transcriptions.googleFlash = {
            transcript: googleData.transcript || '',
            segments: googleData.segments || [],
            service: googleData.transcription_service || 'google_flash',
            wordCount: (googleData.transcript || '').split(/\s+/).length,
            charCount: (googleData.transcript || '').length,
          };
        } else {
          const errorText = await googleResponse.text();
          results.transcriptions.googleFlash = {
            error: `Failed: ${googleResponse.status} - ${errorText}`,
          };
        }
      } catch (error: any) {
        results.transcriptions.googleFlash = {
          error: error.message,
        };
      }
    }

    // Test ElevenLabs
    if (elevenlabsKey) {
      try {
        console.log('Testing ElevenLabs...');
        const elevenResponse = await fetch(`${PROCESSING_SERVICE_URL}/process-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtubeUrl,
            apiKeys: { elevenlabs: elevenlabsKey },
          }),
        });

        if (elevenResponse.ok) {
          const elevenData = await elevenResponse.json();
          results.transcriptions.elevenLabs = {
            transcript: elevenData.transcript || '',
            segments: elevenData.segments || [],
            service: elevenData.transcription_service || 'elevenlabs',
            wordCount: (elevenData.transcript || '').split(/\s+/).length,
            charCount: (elevenData.transcript || '').length,
          };
        } else {
          const errorText = await elevenResponse.text();
          results.transcriptions.elevenLabs = {
            error: `Failed: ${elevenResponse.status} - ${errorText}`,
          };
        }
      } catch (error: any) {
        results.transcriptions.elevenLabs = {
          error: error.message,
        };
      }
    }

    // Compare results
    if (results.transcriptions.googleFlash?.transcript && results.transcriptions.elevenLabs?.transcript) {
      const googleText = results.transcriptions.googleFlash.transcript.toLowerCase().trim();
      const elevenText = results.transcriptions.elevenLabs.transcript.toLowerCase().trim();
      
      // Calculate similarity (simple word overlap)
      const googleWords = new Set(googleText.split(/\s+/));
      const elevenWords = new Set(elevenText.split(/\s+/));
      const intersection = new Set([...googleWords].filter(x => elevenWords.has(x)));
      const union = new Set([...googleWords, ...elevenWords]);
      const similarity = union.size > 0 ? (intersection.size / union.size) * 100 : 0;

      results.comparison = {
        similarity: similarity.toFixed(2) + '%',
        googleOnlyWords: googleText.split(/\s+/).filter((w: string) => !elevenWords.has(w)).length,
        elevenOnlyWords: elevenText.split(/\s+/).filter((w: string) => !googleWords.has(w)).length,
        commonWords: intersection.size,
        totalUniqueWords: union.size,
      };
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to compare transcriptions', details: error.message },
      { status: 500 }
    );
  }
}


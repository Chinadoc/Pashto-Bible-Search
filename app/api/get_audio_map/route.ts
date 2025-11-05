import { NextRequest, NextResponse } from 'next/server';
import { loadAudioMap } from '@/app/lib/audio-map';

export const runtime = 'nodejs';

function shouldRefresh(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const forceRefresh =
      shouldRefresh(params.get('refresh')) || shouldRefresh(params.get('clear_cache'));
    const debug = params.get('debug') === '1';

    // Load audio map from Google Drive (no Supabase dependency)
    const googleDriveAudioMap = await loadAudioMap(forceRefresh);

    const stats = {
      googleDrive: Object.keys(googleDriveAudioMap).length,
      combined: Object.keys(googleDriveAudioMap).length,
    };

    console.log('Audio map stats:', stats);

    if (debug) {
      return NextResponse.json({
        stats,
        googleDriveSample: Object.keys(googleDriveAudioMap).slice(0, 5),
        combinedSample: Object.keys(googleDriveAudioMap).slice(0, 5),
      });
    }

    return NextResponse.json(googleDriveAudioMap);
  } catch (error) {
    console.error('Failed to load audio map:', error);
    return NextResponse.json(
      {
        error: 'Failed to load audio map',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

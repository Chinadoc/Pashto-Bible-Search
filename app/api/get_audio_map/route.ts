import { NextRequest, NextResponse } from 'next/server';
import { loadAudioMap } from '@/app/lib/audio-map';
import { loadSupabaseAudioMap } from '@/app/lib/supabase-audio';

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

    const [googleDriveAudioMap, supabaseAudioMap] = await Promise.all([
      loadAudioMap(forceRefresh),
      loadSupabaseAudioMap(),
    ]);

    const combinedAudioMap: Record<string, string> = { ...googleDriveAudioMap };
    for (const [key, value] of Object.entries(supabaseAudioMap)) {
      if (!combinedAudioMap[key]) {
        combinedAudioMap[key] = value;
      }
    }

    const stats = {
      googleDrive: Object.keys(googleDriveAudioMap).length,
      supabase: Object.keys(supabaseAudioMap).length,
      combined: Object.keys(combinedAudioMap).length,
    };

    console.log('Audio map stats:', stats);

    if (debug) {
      return NextResponse.json({
        stats,
        supabaseSample: Object.keys(supabaseAudioMap).slice(0, 5),
        googleDriveSample: Object.keys(googleDriveAudioMap).slice(0, 5),
        combinedSample: Object.keys(combinedAudioMap).slice(0, 5),
      });
    }

    return NextResponse.json(combinedAudioMap);
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

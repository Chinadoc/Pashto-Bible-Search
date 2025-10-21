import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { supabase } from '@/app/utils/supabase';

export const runtime = 'nodejs';

function shouldRefresh(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

async function loadSupabaseAudioMap(): Promise<Record<string, string>> {
  try {
    // Load Afghan 2023 audio URLs from Supabase
    const { data, error } = await supabase
      .from('audio_by_verse')
      .select('verse_ref, url')
      .not('url', 'is', null);

    if (error) {
      console.error('Supabase audio map error:', error);
      return {};
    }

    const audioMap: Record<string, string> = {};
    if (data) {
      for (const row of data) {
        if (row.verse_ref && row.url) {
          audioMap[row.verse_ref] = row.url;
        }
      }
    }

    console.log(`Loaded ${Object.keys(audioMap).length} audio entries from Supabase`);
    return audioMap;
  } catch (error) {
    console.error('Error loading Supabase audio map:', error);
    return {};
  }
}

async function loadGoogleDriveAudioMaps(): Promise<Record<string, string>> {
  const audioMap: Record<string, string> = {};

  // For now, return empty map since the file is too large for Vercel functions
  // TODO: Implement a more efficient loading mechanism or use Supabase for this data
  console.log('Google Drive audio maps not loaded - file too large for Vercel functions');

  return audioMap;
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const forceRefresh =
      shouldRefresh(params.get('refresh')) || shouldRefresh(params.get('clear_cache'));

    // Load audio maps
    const googleDriveAudioMap = await loadGoogleDriveAudioMaps();

    // For now, only use Google Drive data since Supabase doesn't have URLs yet
    const combinedAudioMap = googleDriveAudioMap;

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


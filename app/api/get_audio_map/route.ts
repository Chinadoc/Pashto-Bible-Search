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

  // Load from included JSON file (only the main one for now)
  const filename = 'google_drive_audio_urls.json';

  try {
    const filePath = path.join(process.cwd(), filename);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (data && typeof data === 'object') {
      const entries = Object.entries(data as Record<string, unknown>);
      for (const [key, value] of entries) {
        if (typeof value === 'string') {
          audioMap[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          const record = value as Record<string, unknown>;
          const url = record.google_drive_file_id ?? record.google_drive_url ?? record.url ?? record.direct_url;
          if (typeof url === 'string') {
            audioMap[key] = url;
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to load ${filename}:`, error);
  }

  console.log(`Loaded ${Object.keys(audioMap).length} audio entries from Google Drive file`);
  return audioMap;
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const forceRefresh =
      shouldRefresh(params.get('refresh')) || shouldRefresh(params.get('clear_cache'));

    // Load audio maps
    const [supabaseAudioMap, googleDriveAudioMap] = await Promise.all([
      loadSupabaseAudioMap(),
      loadGoogleDriveAudioMaps()
    ]);

    // Combine both maps (Google Drive takes precedence for conflicts)
    const combinedAudioMap = { ...supabaseAudioMap, ...googleDriveAudioMap };

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


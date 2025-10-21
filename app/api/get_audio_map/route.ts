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
    // Load Afghan 2023 NT audio from Supabase storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('audio')
      .list('', { limit: 1000 });

    if (storageError) {
      console.error('Supabase storage error:', storageError);
      return {};
    }

    const audioMap: Record<string, string> = {};
    if (storageData) {
      for (const file of storageData) {
        if (file.name && file.name.endsWith('.mp3')) {
          // Extract verse reference from filename (e.g., "1corinthians11_verse_32.mp3")
          const match = file.name.match(/^(.+?)(\d+)_verse_(\d+)\.mp3$/);
          if (match) {
            const [, book, chapter, verse] = match;
            const bookName = book.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
            const verseRef = `${bookName} ${chapter}:${verse}`;
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('audio')
              .getPublicUrl(file.name);
            
            if (urlData?.publicUrl) {
              audioMap[verseRef] = urlData.publicUrl;
            }
          }
        }
      }
    }

    console.log(`Loaded ${Object.keys(audioMap).length} Afghan 2023 NT audio entries from Supabase`);
    return audioMap;
  } catch (error) {
    console.error('Error loading Supabase audio map:', error);
    return {};
  }
}

async function loadGoogleDriveAudioMaps(): Promise<Record<string, string>> {
  const audioMap: Record<string, string> = {};

  try {
    // Load Afghan 2023 OT audio from Google Drive
    const afghanOtData = await loadGoogleDriveFolder('1m-Mv7r01GHTgXkzFxAXfANn_7sSHRSUC');
    Object.assign(audioMap, afghanOtData);

    // Load Yousafzai audio from Google Drive (search for files)
    const yousafzaiData = await loadYousafzaiAudioFromDrive();
    Object.assign(audioMap, yousafzaiData);

    console.log(`Loaded ${Object.keys(audioMap).length} Google Drive audio entries`);
    return audioMap;
  } catch (error) {
    console.error('Error loading Google Drive audio maps:', error);
    return {};
  }
}

async function loadGoogleDriveFolder(folderId: string): Promise<Record<string, string>> {
  // For now, return empty - would need Google Drive API integration
  console.log(`Google Drive folder ${folderId} loading not implemented yet`);
  return {};
}

async function loadYousafzaiAudioFromDrive(): Promise<Record<string, string>> {
  // For now, return empty - would need Google Drive API integration
  console.log('Yousafzai Google Drive audio loading not implemented yet');
  return {};
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


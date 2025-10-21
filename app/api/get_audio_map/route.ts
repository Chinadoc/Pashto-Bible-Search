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
    // Since the Supabase storage API isn't working, we'll manually add known Mark files
    // This is a temporary solution until we can properly list the storage bucket
    const audioMap: Record<string, string> = {};
    
    // Add Mark files manually (we know they exist from the direct URL test)
    const markFiles = [
      'mark1_verse_1.mp3', 'mark1_verse_2.mp3', 'mark1_verse_3.mp3', 'mark1_verse_4.mp3',
      'mark1_verse_5.mp3', 'mark1_verse_6.mp3', 'mark1_verse_7.mp3', 'mark1_verse_8.mp3',
      'mark1_verse_9.mp3', 'mark1_verse_10.mp3', 'mark1_verse_11.mp3', 'mark1_verse_12.mp3',
      'mark1_verse_13.mp3', 'mark1_verse_14.mp3', 'mark1_verse_15.mp3', 'mark1_verse_16.mp3',
      'mark1_verse_17.mp3', 'mark1_verse_18.mp3', 'mark1_verse_19.mp3', 'mark1_verse_20.mp3',
      'mark1_verse_21.mp3', 'mark1_verse_22.mp3', 'mark1_verse_23.mp3', 'mark1_verse_24.mp3'
    ];
    
    for (const filename of markFiles) {
      const match = filename.match(/^(.+?)(\d+)_verse_(\d+)\.mp3$/);
      if (match) {
        const [, book, chapter, verse] = match;
        const bookName = book.charAt(0).toUpperCase() + book.slice(1);
        const verseRef = `${bookName} ${chapter}:${verse}`;
        const publicUrl = `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/${filename}`;
        audioMap[verseRef] = publicUrl;
      }
    }

    console.log(`Loaded ${Object.keys(audioMap).length} Mark audio entries from Supabase`);
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


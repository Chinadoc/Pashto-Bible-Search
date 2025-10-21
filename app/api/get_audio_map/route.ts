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
    // Load NT audio files from Supabase public storage
    // Using direct URLs since the storage API requires different authentication
    const audioMap: Record<string, string> = {};
    const baseUrl = 'https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio';
    
    // Helper function to add a range of verses for a book/chapter
    const addVerses = (book: string, chapter: number, startVerse: number, endVerse: number) => {
      for (let verse = startVerse; verse <= endVerse; verse++) {
        const filename = `${book.toLowerCase()}${chapter}_verse_${verse}.mp3`;
        const bookName = book.toLowerCase(); // Keep lowercase to match existing format
        const verseRef = `${bookName} ${chapter}:${verse}`;
        audioMap[verseRef] = `${baseUrl}/${filename}`;
      }
    };
    
    // Mark chapter 1 (verses 1-45 based on typical Mark 1 length)
    addVerses('Mark', 1, 1, 45);
    
    // Add more chapters as they become available
    // For now, just add Mark 1 since we know those files exist

    console.log(`Loaded ${Object.keys(audioMap).length} NT audio entries from Supabase`);
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
    const debug = params.get('debug') === '1';

    // Load audio maps
    const [supabaseAudioMap, googleDriveAudioMap] = await Promise.all([
      loadSupabaseAudioMap(),
      loadGoogleDriveAudioMaps()
    ]);

    // Combine both maps (Google Drive takes precedence for conflicts)
    const combinedAudioMap = { ...supabaseAudioMap, ...googleDriveAudioMap };

    const stats = {
      supabase: Object.keys(supabaseAudioMap).length,
      googleDrive: Object.keys(googleDriveAudioMap).length,
      combined: Object.keys(combinedAudioMap).length
    };
    
    console.log(`Audio map stats:`, stats);

    if (debug) {
      return NextResponse.json({
        stats,
        supabaseSample: Object.keys(supabaseAudioMap).slice(0, 5),
        googleDriveSample: Object.keys(googleDriveAudioMap).slice(0, 5),
        combinedSample: Object.keys(combinedAudioMap).slice(0, 5)
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


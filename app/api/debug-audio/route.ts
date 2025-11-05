import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get('book') || 'Judges';
  const chapter = searchParams.get('chapter') || '7';

  try {
    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    const verses = await db.query<{ book: string; chapter: number; verse: number; audio_public_url?: string; audio_storage_path?: string; audio_r2_key?: string }>(
      `SELECT book, chapter, verse, audio_public_url, audio_storage_path, audio_r2_key FROM verses_yousafzai WHERE book = ? AND chapter = ? LIMIT 5`,
      [book, parseInt(chapter)]
    );

    const versesArray = verses || [];

    return NextResponse.json({
      book,
      chapter,
      verses: versesArray.map((v: any) => ({
        ref: `${v.book} ${v.chapter}:${v.verse}`,
        audio_public_url: v.audio_public_url,
        audio_storage_path: v.audio_storage_path,
        audio_r2_key: v.audio_r2_key,
        url_type: v.audio_r2_key ? 'Cloudflare R2' :
                 v.audio_public_url?.includes('drive.google.com') ? 'Google Drive' : 
                 v.audio_public_url?.includes('supabase.co') ? 'Supabase' : 'Unknown'
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch audio URLs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

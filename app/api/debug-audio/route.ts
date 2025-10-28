import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get('book') || 'Judges';
  const chapter = searchParams.get('chapter') || '7';

  try {
    const { data: verses, error } = await supabase
      .from('verses_yousafzai')
      .select('book, chapter, verse, audio_public_url, audio_storage_path')
      .eq('book', book)
      .eq('chapter', parseInt(chapter))
      .limit(5);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const versesArray = verses || [];

    return NextResponse.json({
      book,
      chapter,
      verses: versesArray.map((v) => ({
        ref: `${v.book} ${v.chapter}:${v.verse}`,
        audio_public_url: v.audio_public_url,
        audio_storage_path: v.audio_storage_path,
        url_type: v.audio_public_url?.includes('drive.google.com') ? 'Google Drive' : 
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


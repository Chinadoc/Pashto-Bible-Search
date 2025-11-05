import { NextRequest, NextResponse } from 'next/server';
import { getD1ClientOrThrow } from '@/utils/d1-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    const rows = await db.query<{
      id: number;
      video_id: string;
      transcript: string;
      segments: string;
      created_at: string;
    }>(
      `SELECT id, video_id, transcript, segments, created_at FROM video_transcripts WHERE transcript LIKE ? LIMIT ?`,
      [`%${query}%`, limit]
    );

    const results = (rows || []).map((item) => ({
      id: item.id,
      verse_reference: `video_${item.video_id}`,
      audio_filename: '',
      transcript: item.transcript,
      segments: item.segments ? JSON.parse(item.segments) : null,
      file_size: null,
      duration_seconds: null,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search transcripts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    let db;
    try {
      db = getD1ClientOrThrow();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }

    const rows = await db.query<{
      id: number;
      video_id: string;
      transcript: string;
      segments: string;
      created_at: string;
    }>(
      `SELECT id, video_id, transcript, segments, created_at FROM video_transcripts WHERE transcript LIKE ? LIMIT ?`,
      [`%${query}%`, limit]
    );

    const results = (rows || []).map((item) => ({
      id: item.id,
      verse_reference: `video_${item.video_id}`,
      audio_filename: '',
      transcript: item.transcript,
      segments: item.segments ? JSON.parse(item.segments) : null,
      file_size: null,
      duration_seconds: null,
      created_at: item.created_at,
    }));

    return NextResponse.json({
      query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Search transcripts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

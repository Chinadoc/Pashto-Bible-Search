import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/utils/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    // Search for transcripts in audio_mappings table
    // We stored transcripts in the audio_path field
    const { data, error } = await supabase
      .from('audio_mappings')
      .select('*')
      .ilike('audio_path', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Format results for frontend
    const results = data?.map(item => ({
      id: item.id,
      verse_reference: item.verse_reference,
      audio_filename: item.audio_filename,
      transcript: item.audio_path, // This contains our transcript
      file_size: item.file_size,
      duration_seconds: item.duration_seconds,
      created_at: item.created_at
    })) || []

    return NextResponse.json({
      query,
      results,
      total: results.length
    })

  } catch (error) {
    console.error('Search transcripts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 10 } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Search for transcripts in audio_mappings table
    const { data, error } = await supabase
      .from('audio_mappings')
      .select('*')
      .ilike('audio_path', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Format results for frontend
    const results = data?.map(item => ({
      id: item.id,
      verse_reference: item.verse_reference,
      audio_filename: item.audio_filename,
      transcript: item.audio_path, // This contains our transcript
      file_size: item.file_size,
      duration_seconds: item.duration_seconds,
      created_at: item.created_at
    })) || []

    return NextResponse.json({
      query,
      results,
      total: results.length
    })

  } catch (error) {
    console.error('Search transcripts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

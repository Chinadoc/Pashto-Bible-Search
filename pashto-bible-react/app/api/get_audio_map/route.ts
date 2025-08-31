import { NextResponse } from 'next/server'
import { supabase, TABLES } from '../../../utils/supabase'
import type { AudioMap } from '../../../types'

export async function GET() {
  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({})
    }

    // Try optimized DB view first, if present
    const { data: viewData, error: viewError } = await supabase
      .from('audio_by_verse' as any)
      .select('verse_ref, url')
      .limit(10000)

    // Convert the data to the expected AudioMap format
    const audioMap: AudioMap = {}

    if (viewData && Array.isArray(viewData) && viewData.length > 0) {
      for (const row of viewData as Array<{ verse_ref?: string | null; url?: string | null }>) {
        if (row.verse_ref && row.url) audioMap[row.verse_ref] = row.url
      }
    }

    // If the view doesn't exist or returned nothing, fall back to tables
    // Get all audio mappings from the dedicated table
    const { data: audioData, error } = await supabase
      .from(TABLES.AUDIO_MAPPINGS)
      .select('verse_reference, audio_filename, audio_path')
      .order('verse_reference')

    if (error && !viewError && Object.keys(audioMap).length === 0) {
      console.error('Audio map fetch error:', error)
      return NextResponse.json(
        {},
        { status: 500 }
      )
    }

    if (audioData) {
      for (const mapping of audioData) {
        const { verse_reference, audio_filename, audio_path } = mapping as { verse_reference?: string | null; audio_filename?: string | null; audio_path?: string | null };

        if (!verse_reference) continue;

        let url = ''
        if (audio_path && /^https?:\/\//i.test(audio_path)) {
          url = audio_path
        } else if (audio_filename) {
          // In this dataset, audio_filename may actually be a Drive ID; detect by extension
          if (/\.mp3$/i.test(audio_filename)) {
            url = `https://storage.googleapis.com/pashto-bible-audio/${audio_filename}`
          } else {
            url = `https://drive.google.com/uc?export=download&id=${audio_filename}`
          }
        } else if (/\.mp3$/i.test(verse_reference)) {
          // Fall back to using the verse_reference as a filename key
          url = `https://storage.googleapis.com/pashto-bible-audio/${verse_reference}`
        }

        if (url) {
          audioMap[verse_reference] = url
        }
      }
    }

    // Also pull from verses table if drive IDs or filenames exist
    const { data: versesData, error: versesError } = await supabase
      .from(TABLES.VERSES)
      .select('book, chapter, verse, audio_filename, audio_drive_id')
      .or('audio_filename.not.is.null,audio_drive_id.not.is.null')

    if (versesError) {
      console.warn('Audio map (verses) fetch warning:', versesError)
    }

    if (versesData) {
      for (const v of versesData as Array<{ book: string; chapter: number; verse: number; audio_filename?: string | null; audio_drive_id?: string | null }>) {
        const ref = `${v.book} ${v.chapter}:${v.verse}`
        // Prefer Drive ID when provided, else fall back to storage filename
        let url = ''
        if (v.audio_drive_id) {
          url = `https://drive.google.com/uc?export=download&id=${v.audio_drive_id}`
        } else if (v.audio_filename) {
          url = `https://storage.googleapis.com/pashto-bible-audio/${v.audio_filename}`
        }
        if (url) {
          // Do not overwrite explicit path from audio_mappings if it exists
          if (!audioMap[ref]) audioMap[ref] = url
        }
      }
    }

    return NextResponse.json(audioMap)

  } catch (error) {
    console.error('Audio map error:', error)
    return NextResponse.json(
      {},
      { status: 500 }
    )
  }
}

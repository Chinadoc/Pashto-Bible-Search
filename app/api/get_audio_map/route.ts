import { NextRequest, NextResponse } from 'next/server'
import { supabase, TABLES } from '../../../utils/supabase'
import type { AudioMap } from '../../../types'

// Simple in-memory cache to reduce storage/list churn during a server's lifetime
let AUDIO_MAP_CACHE: { data: AudioMap; ts: number } | null = null
const AUDIO_MAP_TTL_MS = 10 * 60 * 1000 // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl?.searchParams?.get('refresh') === '1'
    // Force refresh to get updated URLs without Drive links
    const shouldRefresh = forceRefresh || request.nextUrl?.searchParams?.get('clear_cache') === '1'
    if (!shouldRefresh && AUDIO_MAP_CACHE && Date.now() - AUDIO_MAP_CACHE.ts < AUDIO_MAP_TTL_MS) {
      return NextResponse.json(AUDIO_MAP_CACHE.data)
    }
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({})
    }

    // Try optimized DB view first, if present (via REST to avoid TS generics)
    let viewError: unknown = null
    let viewData: Array<{ verse_ref?: string | null; url?: string | null }> | null = null
    try {
      const viewRes = await fetch(`${supabaseUrl}/rest/v1/audio_by_verse?select=verse_ref,url&limit=10000`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })
      if (viewRes.ok) {
        viewData = await viewRes.json()
      }
    } catch (e) {
      viewError = e
    }

    // Convert the data to the expected AudioMap format
    const audioMap: AudioMap = {}

    if (viewData && Array.isArray(viewData) && viewData.length > 0) {
      for (const row of viewData as Array<{ verse_ref?: string | null; url?: string | null }>) {
        if (!row.verse_ref || !row.url) continue
        const isDrive = /drive\.google|docs\.google/i.test(row.url)
        // Strongly prefer non-Drive URLs; only use Drive as absolute last resort
        if (!isDrive) audioMap[row.verse_ref] = row.url
      }
    }

    // If the view doesn't exist or returned nothing, fall back to tables
    // Fetch audio_mappings in pages to avoid PostgREST limits
    const pageSize = 1000
    let from = 0
    while (true) {
      const { data: audioData, error } = await supabase
        .from(TABLES.AUDIO_MAPPINGS)
        .select('verse_reference, audio_filename, audio_path')
        .order('verse_reference')
        .range(from, from + pageSize - 1)

      if (error) {
        if (!viewError && Object.keys(audioMap).length === 0) {
          console.error('Audio map fetch error:', error)
          return NextResponse.json({}, { status: 500 })
        }
        break
      }

      if (!audioData || audioData.length === 0) break

      for (const mapping of audioData) {
        const { verse_reference, audio_filename, audio_path } = mapping as { verse_reference?: string | null; audio_filename?: string | null; audio_path?: string | null };

        if (!verse_reference) continue;

        let url = ''
        const storageBase = `${supabaseUrl}/storage/v1/object/public/audio/`
        if (audio_path && /^https?:\/\//i.test(audio_path)) {
          url = audio_path
        } else if (audio_filename && /\.mp3$/i.test(audio_filename)) {
          // Prefer Supabase Storage public URL for mp3 filenames
          url = storageBase + encodeURIComponent(audio_filename)
        } else if (/\.mp3$/i.test(verse_reference)) {
          // Fall back to using the verse_reference as filename in Storage
          url = storageBase + encodeURIComponent(verse_reference)
        } else {
          // No storage-compatible filename – skip (do not emit Drive URLs)
          url = ''
        }

        if (url) {
          // Strongly prefer Supabase Storage URLs over Drive URLs
          const existing = audioMap[verse_reference]
          const isStorage = url.includes('/storage/v1/object/public/')
          const isDrive = /drive\.google|docs\.google/i.test(url)
          const existingIsDrive = existing && /drive\.google|docs\.google/i.test(existing)

          // Always prefer Storage over Drive, and replace existing Drive URLs with Storage
          if (!existing || isStorage || (!isDrive && existingIsDrive)) {
            audioMap[verse_reference] = url
          }
          // Also add alternate keys for numeric-leading vs trailing
          // 1john1_verse_x.mp3 <-> john11_verse_x.mp3 (but we only move single leading/trailing digit)
          const alt1 = verse_reference.replace(/^(\d)([a-z].*)/, (_m, d, rest) => `${rest}${d}`)
          const alt2 = verse_reference.replace(/^([a-z]+?)(\d)(_.+)/, (_m, rest, d, tail) => `${d}${rest}${tail}`)
          for (const alt of [alt1, alt2]) {
            if (alt && alt !== verse_reference) {
              const existingAlt = audioMap[alt]
              const existingAltIsDrive = existingAlt && /drive\.google|docs\.google/i.test(existingAlt)
              if (!existingAlt || (isStorage && existingAltIsDrive)) audioMap[alt] = url
            }
          }
        }
      }

      from += audioData.length
      if (audioData.length < pageSize) break
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
        // Prefer Supabase Storage, fall back to Drive only if no storage alternative
        let url = ''
        if (v.audio_filename && /\.mp3$/i.test(v.audio_filename)) {
          // Use Supabase Storage public URL for mp3 filenames
          const storageBase = `${supabaseUrl}/storage/v1/object/public/audio/`
          url = storageBase + encodeURIComponent(v.audio_filename)
        } else if (v.audio_drive_id) {
          // Only use Drive as last resort
          url = `https://drive.google.com/uc?export=download&id=${v.audio_drive_id}`
        }
        if (url) {
          // Do not overwrite explicit path from audio_mappings if it exists
          if (!audioMap[ref]) audioMap[ref] = url
        }
      }
    }

    // Supplement with Yousafzai chapter audio (per-verse mapping to chapter files)
    try {
      const { data: yousafzaiData, error: yousafzaiError } = await supabase
        .from('verses_yousafzai')
        .select('book, chapter, verse, audio_chapter_url')

      if (yousafzaiError) {
        console.warn('Audio map (verses_yousafzai) fetch warning:', yousafzaiError)
      }

      if (Array.isArray(yousafzaiData)) {
        for (const row of yousafzaiData as Array<{ book?: string | null; chapter?: number | null; verse?: number | null; audio_chapter_url?: string | null }>) {
          if (!row?.book || row.chapter == null || row.verse == null) continue
          const url = typeof row.audio_chapter_url === 'string' && row.audio_chapter_url ? row.audio_chapter_url : ''
          if (!url) continue
          const ref = `${row.book} ${row.chapter}:${row.verse}`
          if (!audioMap[ref]) {
            audioMap[ref] = url
          }
        }
      }
    } catch (yError) {
      console.warn('Audio map (verses_yousafzai) catch:', yError)
    }

    // Finally, ensure we include everything present in Storage bucket (authoritative)
    try {
      const pageSizeStorage = 1000
      let offset = 0
      const storageBase = `${supabaseUrl}/storage/v1/object/public/audio/`
      while (true) {
        const { data: list, error: listErr } = await supabase.storage
          .from('audio')
          .list('', { limit: pageSizeStorage, offset })

        if (listErr) {
          console.warn('Storage list warning:', listErr)
          break
        }

        if (!list || list.length === 0) break

        for (const item of list) {
          if (!item || !item.name || !/\.mp3$/i.test(item.name)) continue
          const file = item.name
          const url = storageBase + encodeURIComponent(file)
          // Strongly prefer Supabase Storage URLs
          const existing = audioMap[file]
          const existingIsDrive = existing && /drive\.google|docs\.google/i.test(existing)
          if (!existing || existingIsDrive) audioMap[file] = url

          // add numeric-leading/trailing alternates
          const alt1 = file.replace(/^(\d)([a-z].*)/, (_m, d, rest) => `${rest}${d}`)
          const alt2 = file.replace(/^([a-z]+?)(\d)(_.+)/, (_m, rest, d, tail) => `${d}${rest}${tail}`)
          for (const alt of [alt1, alt2]) {
            if (alt && alt !== file) {
              const existAlt = audioMap[alt]
              const existAltIsDrive = existAlt && /drive\.google|docs\.google/i.test(existAlt)
              if (!existAlt || existAltIsDrive) audioMap[alt] = url
            }
          }
        }

        offset += list.length
        if (list.length < pageSizeStorage) break
      }
    } catch (e) {
      console.warn('Storage sync warning:', e)
    }

    // Save to cache
    AUDIO_MAP_CACHE = { data: audioMap, ts: Date.now() }
    return NextResponse.json(audioMap)

  } catch (error) {
    console.error('Audio map error:', error)
    return NextResponse.json(
      {},
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'
import type { AudioMap } from '../../../types'

// Book abbreviation mapping
const ABBR: Record<string, string> = {
  'Genesis': 'gen', 'Exodus': 'exo', 'Leviticus': 'lev', 'Numbers': 'num', 'Deuteronomy': 'deu',
  'Joshua': 'jos', 'Judges': 'jdg', 'Ruth': 'rut', '1 Samuel': '1sam', '2 Samuel': '2sam',
  '1 Kings': '1kgs', '2 Kings': '2kgs', '1 Chronicles': '1chr', '2 Chronicles': '2chr',
  'Ezra': 'ezr', 'Nehemiah': 'neh', 'Esther': 'est', 'Job': 'job', 'Psalms': 'psa',
  'Proverbs': 'pro', 'Ecclesiastes': 'ecc', 'Song of Solomon': 'sng', 'Isaiah': 'isa',
  'Jeremiah': 'jer', 'Lamentations': 'lam', 'Ezekiel': 'eze', 'Daniel': 'dan',
  'Hosea': 'hos', 'Joel': 'joe', 'Amos': 'amo', 'Obadiah': 'oba', 'Jonah': 'jon',
  'Micah': 'mic', 'Nahum': 'nah', 'Habakkuk': 'hab', 'Zephaniah': 'zep',
  'Haggai': 'hag', 'Zechariah': 'zec', 'Malachi': 'mal',
  'Matthew': 'mat', 'Mark': 'mar', 'Luke': 'luk', 'John': 'joh', 'Acts': 'act',
  'Romans': 'rom', '1 Corinthians': '1cor', '2 Corinthians': '2cor', 'Galatians': 'gal',
  'Ephesians': 'eph', 'Philippians': 'phi', 'Colossians': 'col', '1 Thessalonians': '1th',
  '2 Thessalonians': '2th', '1 Timothy': '1tim', '2 Timothy': '2tim', 'Titus': 'tit',
  'Philemon': 'phm', 'Hebrews': 'heb', 'James': 'jas', '1 Peter': '1pet',
  '2 Peter': '2pet', '1 John': '1joh', '2 John': '2joh', '3 John': '3joh',
  'Jude': 'jud', 'Revelation': 'rev'
}

// Simple in-memory cache to reduce storage/list churn during a server's lifetime
let AUDIO_MAP_CACHE: { data: AudioMap; ts: number } | null = null
const AUDIO_MAP_TTL_MS = 10 * 60 * 1000 // 10 minutes

const OT_BOOKS = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra',
  'Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon',
  'Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
])

// Books to exclude from audio map due to text/audio version mismatches
const EXCLUDED_BOOKS = new Set([
  'Leviticus' // Audio is Yousafzai 2019, but text is Afghan 2023 - causing mismatch
])

// OT books that have confirmed Yousafzai 2019 audio on Afghan Bibles
const OT_BOOKS_WITH_AUDIO = new Set([
  'Isaiah', 'Ezekiel', 'Amos', 'Jonah', 'Proverbs', 'Judges', 'Psalms'
])

function bookFromRef(ref: string | null | undefined): string {
  if (!ref) return ''
  const m = ref.match(/^(.+?)\s+\d+:\d+$/)
  return m ? m[1].trim() : ''
}

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

    console.log('🔍 Audio map API called:', {
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
      supabaseKey: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
      shouldRefresh,
      hasCache: !!AUDIO_MAP_CACHE
    })

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      console.warn('❌ Supabase credentials missing or invalid, returning empty audio map')
      return NextResponse.json({})
    }

    // Try optimized DB view first, if present (via REST to avoid TS generics)
    let viewError: unknown = null
    let viewData: Array<{ verse_ref?: string | null; url?: string | null }> | null = null
    try {
      console.log('🔍 Attempting to fetch audio_by_verse view...')
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
        console.log(`✅ Audio view query succeeded: ${viewData?.length || 0} records`)
      } else {
        console.warn('❌ Audio view query failed:', viewRes.status, viewRes.statusText)
        const errorText = await viewRes.text()
        console.warn('Error details:', errorText)
      }
    } catch (e) {
      viewError = e
      console.warn('❌ Audio view fetch error:', e)
    }

    // Convert the data to the expected AudioMap format
    const audioMap: AudioMap = {}

    // Load Google Drive audio data first (primary source)
    try {
      const fs = await import('fs');
      const path = await import('path');
      // Try both root and public directory locations
      const possiblePaths = [
        path.join(process.cwd(), 'google_drive_audio_urls.json'),
        path.join(process.cwd(), 'public', 'google_drive_audio_urls.json')
      ];

      let localPath = null;
      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          localPath = testPath;
          break;
        }
      }

      if (localPath) {
        const localAudioData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        let localCount = 0;
        Object.entries(localAudioData).forEach(([filename, data]: [string, any]) => {
          if (data.book && data.chapter && data.verse) {
            const bookName = data.book.charAt(0).toUpperCase() + data.book.slice(1);
            // Skip excluded books to prevent text/audio mismatches
            if (EXCLUDED_BOOKS.has(bookName)) {
              return;
            }
            // Only include OT books that have confirmed Yousafzai 2019 audio
            if (OT_BOOKS.has(bookName) && !OT_BOOKS_WITH_AUDIO.has(bookName)) {
              return;
            }
            const verseRef = `${bookName} ${data.chapter}:${data.verse}`;
            // Use file ID if available, otherwise extract from URL
            let fileId = data.google_drive_file_id;
            if (!fileId && data.google_drive_url) {
              // Extract file ID from URL: https://drive.google.com/uc?id=FILE_ID&export=download
              const urlMatch = data.google_drive_url.match(/id=([^&]+)/);
              fileId = urlMatch ? urlMatch[1] : null;
            }
            if (fileId && fileId !== 'TEST_ID' && fileId !== 'FILE_ID_HERE') {
              audioMap[verseRef] = fileId;
              localCount++;
            }
          }
        });
        console.log(`🔗 Loaded ${localCount} Google Drive audio entries from ${localPath}`);
      } else {
        console.warn('Local Google Drive audio file not found in any location');
      }
    } catch (localError) {
      console.warn('Failed to load local Google Drive audio data:', localError);
    }

    if (viewData && Array.isArray(viewData) && viewData.length > 0) {
      for (const row of viewData as Array<{ verse_ref?: string | null; url?: string | null }>) {
        if (!row.verse_ref || !row.url) continue
        const book = bookFromRef(row.verse_ref)
        if (OT_BOOKS.has(book) || EXCLUDED_BOOKS.has(book)) continue
        // Only include OT books that have confirmed Yousafzai 2019 audio
        if (OT_BOOKS.has(book) && !OT_BOOKS_WITH_AUDIO.has(book)) continue
        const isDrive = /drive\.google|docs\.google/i.test(row.url)
        // Only add if not already in local data (Google Drive takes precedence)
        if (!audioMap[row.verse_ref] && !isDrive) {
          audioMap[row.verse_ref] = row.url
        }
      }
    }

    // If the view doesn't exist or returned nothing, fall back to tables
    // Fetch audio_mappings in pages to avoid PostgREST limits
    const pageSize = 1000
    let from = 0
    let queryTimeout: NodeJS.Timeout | null = null

    try {
      console.log('🔍 Attempting to fetch from audio_by_verse table...')
      while (true) {
        // Set a timeout for each query to prevent hanging
        const queryPromise = supabase
          .from('audio_by_verse')
          .select('verse_ref, url')
          .order('verse_ref')
          .range(from, from + pageSize - 1)

        const timeoutPromise = new Promise((_, reject) => {
          queryTimeout = setTimeout(() => reject(new Error('Query timeout')), 10000)
        })

        const { data: audioData, error } = await Promise.race([queryPromise, timeoutPromise]) as any

        if (queryTimeout) {
          clearTimeout(queryTimeout)
          queryTimeout = null
        }

        if (error) {
          console.error('❌ Audio map table fetch error:', error)
          if (!viewError && Object.keys(audioMap).length === 0) {
            console.error('❌ No data from view or table, returning 500')
            return NextResponse.json({ error: 'Database query failed', details: error.message }, { status: 500 })
          }
          break
        }

        if (!audioData || audioData.length === 0) break

        for (const mapping of audioData) {
        const { verse_ref, url: mappingUrl } = mapping as { verse_ref?: string | null; url?: string | null };

        if (!verse_ref || !mappingUrl) continue;
        const book = bookFromRef(verse_ref)
        if (OT_BOOKS.has(book) || EXCLUDED_BOOKS.has(book)) continue
        // Only include OT books that have confirmed Yousafzai 2019 audio
        if (OT_BOOKS.has(book) && !OT_BOOKS_WITH_AUDIO.has(book)) continue

        let url = mappingUrl

        if (url) {
          // Strongly prefer Supabase Storage URLs over Drive URLs
          const existing = audioMap[verse_ref]
          const isStorage = url.includes('/storage/v1/object/public/')
          const isDrive = /drive\.google|docs\.google/i.test(url)
          const existingIsDrive = existing && /drive\.google|docs\.google/i.test(existing)

          // Always prefer Storage over Drive, and replace existing Drive URLs with Storage
          if (!existing || isStorage || (!isDrive && existingIsDrive)) {
            audioMap[verse_ref] = url
          }
          // Also add alternate keys for numeric-leading vs trailing
          // 1john1_verse_x.mp3 <-> john11_verse_x.mp3 (but we only move single leading/trailing digit)
          const alt1 = verse_ref.replace(/^(\d)([a-z].*)/, (_m, d, rest) => `${rest}${d}`)
          const alt2 = verse_ref.replace(/^([a-z]+?)(\d)(_.+)/, (_m, rest, d, tail) => `${d}${rest}${tail}`)
          for (const alt of [alt1, alt2]) {
            if (alt && alt !== verse_ref) {
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
    } catch (error) {
      console.error('Audio map query error:', error)
      if (queryTimeout) {
        clearTimeout(queryTimeout)
      }
      if (!viewError && Object.keys(audioMap).length === 0) {
        return NextResponse.json({}, { status: 500 })
      }
    } finally {
      if (queryTimeout) {
        clearTimeout(queryTimeout)
      }
    }

    // Also pull from verses table if drive IDs or filenames exist
    const { data: versesData, error: versesError } = await supabase
      .from('verses')
      .select('book, chapter, verse, audio_filename, audio_drive_id')
      .or('audio_filename.not.is.null,audio_drive_id.not.is.null')

    if (versesError) {
      console.warn('Audio map (verses) fetch warning:', versesError)
    }

    if (versesData) {
      for (const v of versesData as Array<{ book: string; chapter: number; verse: number; audio_filename?: string | null; audio_drive_id?: string | null }>) {
        // Skip excluded books to prevent text/audio mismatches
        if (EXCLUDED_BOOKS.has(v.book)) continue
        // Only include OT books that have confirmed Yousafzai 2019 audio
        if (OT_BOOKS.has(v.book) && !OT_BOOKS_WITH_AUDIO.has(v.book)) continue
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
          // Skip excluded books to prevent text/audio mismatches
          if (EXCLUDED_BOOKS.has(row.book)) continue
          // Only include OT books that have confirmed Yousafzai 2019 audio
          if (OT_BOOKS.has(row.book) && !OT_BOOKS_WITH_AUDIO.has(row.book)) continue
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
          
          // Extract book name from filename to check whitelist
          const match = file.match(/^(?:(\d+)([a-zA-Z]+)|([a-zA-Z]+)(\d+))_verse_(\d+)\.mp3$/i)
          if (match) {
            const bookName = match[2] || match[3]
            const fullBookName = Object.keys(ABBR).find(key => ABBR[key].toLowerCase() === bookName.toLowerCase()) || bookName
            // Skip excluded books to prevent text/audio mismatches
            if (EXCLUDED_BOOKS.has(fullBookName)) continue
            // Only include OT books that have confirmed Yousafzai 2019 audio
            if (OT_BOOKS.has(fullBookName) && !OT_BOOKS_WITH_AUDIO.has(fullBookName)) continue
          }
          
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
    console.error('❌ Audio map error:', error)
    // Return error details for debugging instead of empty object
    return NextResponse.json({ 
      error: 'Audio map generation failed', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

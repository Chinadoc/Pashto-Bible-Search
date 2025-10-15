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
let YOUSAFZAI_AUDIO_MAP_CACHE: { data: AudioMap; ts: number } | null = null
const AUDIO_MAP_TTL_MS = 30 * 60 * 1000 // 30 minutes

function bookFromRef(ref: string | null | undefined): string {
  if (!ref) return ''
  const m = ref.match(/^(.+?)\s+\d+:\d+$/)
  return m ? m[1].trim() : ''
}

export async function GET(request: NextRequest) {
  try {
    const forceRefresh = request.nextUrl?.searchParams?.get('refresh') === '1'
    const shouldRefresh = forceRefresh || request.nextUrl?.searchParams?.get('clear_cache') === '1'
    if (!shouldRefresh && YOUSAFZAI_AUDIO_MAP_CACHE && Date.now() - YOUSAFZAI_AUDIO_MAP_CACHE.ts < AUDIO_MAP_TTL_MS) {
      return NextResponse.json(YOUSAFZAI_AUDIO_MAP_CACHE.data)
    }
    
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      console.warn('❌ Supabase credentials missing or invalid, returning empty audio map')
      return NextResponse.json({})
    }

    // Convert the data to the expected AudioMap format
    const audioMap: AudioMap = {}

    // Load Google Drive audio data for Yousafzai books (Genesis to Revelation)
    try {
      const fs = await import('fs');
      const path = await import('path');
      const possiblePaths = [
        path.join(process.cwd(), 'yousafzai_google_drive_audio_urls.json'),
        path.join(process.cwd(), 'public', 'yousafzai_google_drive_audio_urls.json')
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
            const verseRef = `${bookName} ${data.chapter}:${data.verse}`;
            // Use file ID if available, otherwise extract from URL
            let fileId = data.google_drive_file_id;
            if (!fileId && data.google_drive_url) {
              const urlMatch = data.google_drive_url.match(/id=([^&]+)/);
              fileId = urlMatch ? urlMatch[1] : null;
            }
            if (fileId && fileId !== 'TEST_ID' && fileId !== 'FILE_ID_HERE') {
              audioMap[verseRef] = fileId;
              localCount++;
            }
          }
        });
        console.log(`🔗 Loaded ${localCount} Yousafzai Google Drive audio entries from ${localPath}`);
      }
    } catch (localError) {
      console.warn('Failed to load local Yousafzai Google Drive audio data:', localError);
    }

    // Load Supabase Storage audio for Yousafzai books
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
          
          // Only add if not already in Google Drive data
          if (!audioMap[file]) {
            audioMap[file] = url
          }

          // Add alternate keys for numeric-leading vs trailing
          const alt1 = file.replace(/^(\d)([a-z].*)/, (_m, d, rest) => `${rest}${d}`)
          const alt2 = file.replace(/^([a-z]+?)(\d)(_.+)/, (_m, rest, d, tail) => `${d}${rest}${tail}`)
          for (const alt of [alt1, alt2]) {
            if (alt && alt !== file && !audioMap[alt]) {
              audioMap[alt] = url
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
    YOUSAFZAI_AUDIO_MAP_CACHE = { data: audioMap, ts: Date.now() }
    return NextResponse.json(audioMap)

  } catch (error) {
    console.error('❌ Yousafzai audio map error:', error)
    return NextResponse.json({ 
      error: 'Yousafzai audio map generation failed', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

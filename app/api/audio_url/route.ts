import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

// Simple in-memory cache for audio URLs (server-side)
const audioUrlCache = new Map<string, { url: string; expires: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// CDN configuration for faster audio delivery
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_BASE_URL || 'https://cdn.jsdelivr.net'

/**
 * Generate signed URL for private audio files
 * Usage: GET /api/audio_url?ref=Genesis%201:1
 */
// Helpers to mirror filename logic used elsewhere
function normalizeBookNameToSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function altNumericBookSlugBothWays(bookSlug: string): string[] {
  const out = new Set<string>();
  out.add(bookSlug);
  const m1 = bookSlug.match(/^(\d)([a-z].*)$/);
  if (m1) out.add(`${m1[2]}${m1[1]}`);
  const m2 = bookSlug.match(/^([a-z]+?)(\d)$/);
  if (m2) out.add(`${m2[1]}${m2[2]}`);
  return Array.from(out);
}

function hyphenSlug(book: string): string {
  return book.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function candidatePathsFromRef(ref: string): string[] {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return [];
  const book = m[1].trim();
  const chapter = Number(m[2]);
  const verse = Number(m[3]);
  if (!book || Number.isNaN(chapter) || Number.isNaN(verse)) return [];
  const slug = normalizeBookNameToSlug(book);

  // Optimized candidate selection - prioritize most likely paths first
  const candidates = [];

  // 1. Yousafzai individual verse clips (highest priority for Psalms/Proverbs)
  if (['Psalms', 'Proverbs'].includes(book)) {
    const chapPad = String(chapter).padStart(3, '0');
    const verPad = String(verse).padStart(3, '0');
    const yousafzaiBase = `yousafzai_${slug}${chapPad}_verse_${verPad}.mp3`;
    candidates.push(`yousafzai/${yousafzaiBase}`);
  }

  // 2. Standard patterns (existing)
  const base = `${chapter}_verse_${verse}.mp3`;
  candidates.push(`${slug}${base}`);

  // 3. Alternative numeric patterns
  const alts = altNumericBookSlugBothWays(slug).map(s => `${s}${base}`);
  candidates.push(...alts);

  // 4. Nested patterns (less common)
  const hy = hyphenSlug(book);
  candidates.push(`${hy}/chapter-${chapter}-verses/verse-${verse}.mp3`);

  return candidates;
}

export async function GET(request: NextRequest) {
  const started = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    const bucket = searchParams.get('bucket')
    const object = searchParams.get('object')
    const path = searchParams.get('path')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check cache first
    const cacheKey = `${ref}-${bucket || 'audio'}-${object || path || ''}`
    const cached = audioUrlCache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json({
        url: cached.url,
        ref,
        filename: object || path || '',
        isSigned: true,
        ms: Date.now() - started,
        cached: true
      })
    }

    let targetBucket = bucket || 'audio'
    let targetObject = object || path

    // If we have a ref but no bucket/object, look up in audio map first
    // For Afghan 2023, prioritize Google Drive (more reliable)
    if (ref && !targetObject) {
      try {
        // First check the audio map for Google Drive file IDs
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pashto-bible-search.vercel.app';
        const audioMapResponse = await fetch(`${baseUrl}/api/get_audio_map?clear_cache=1`, {
          cache: 'no-store'
        });
        if (audioMapResponse.ok) {
          const audioMap = await audioMapResponse.json();
          const audioEntry = audioMap[ref];
          if (audioEntry) {
            // For Afghan 2023 (Matthew, Mark, Luke, John), use Google Drive proxy
            const isAfghan2023 = ref && (ref.toLowerCase().includes('matthew') || ref.toLowerCase().includes('mark') || ref.toLowerCase().includes('luke') || ref.toLowerCase().includes('john'));

            if (isAfghan2023 && typeof audioEntry === 'string' && !audioEntry.startsWith('http')) {
              // Use Google Drive proxy for Afghan 2023
              const proxyUrl = `/api/audio_proxy?fileId=${audioEntry}&ref=${encodeURIComponent(ref)}`;
              return NextResponse.json({
                url: proxyUrl,
                ref,
                filename: '',
                isSigned: false,
                ms: Date.now() - started,
                source: 'google-drive'
              });
            }

            // If it's already a URL, return it directly
            if (typeof audioEntry === 'string' && audioEntry.startsWith('http')) {
              return NextResponse.json({
                url: audioEntry,
                ref,
                filename: '',
                isSigned: false,
                ms: Date.now() - started,
                source: 'direct-url'
              });
            }
          }
        }
      } catch (audioMapError) {
        console.warn(`Failed to lookup ${ref} in audio map:`, audioMapError);
      }

      // Fallback to Supabase audio_map table/view
      try {
        const { data } = await supabase
          .from('audio_map')
          .select('bucket,object,direct,storage_path')
          .eq('ref', ref)
          .limit(1)

        if (data?.[0]) {
          const entry = data[0] as any
          // Use bucket/object if available, otherwise try storage_path
          if (entry.bucket && entry.object) {
            targetBucket = entry.bucket
            targetObject = entry.object
          } else if (entry.storage_path) {
            targetObject = entry.storage_path
          }
          console.log(`Found audio entry for ${ref}:`, entry)
        }
      } catch (dbError) {
        console.warn(`Failed to lookup ${ref} in audio_map:`, dbError)
      }
    }

    // For Afghan 2023 audio, try to use direct Supabase storage URL without signing for better browser compatibility
    if (ref && !targetObject && (ref.toLowerCase().includes('matthew') || ref.toLowerCase().includes('mark') || ref.toLowerCase().includes('luke') || ref.toLowerCase().includes('john'))) {
      try {
        const candidates = candidatePathsFromRef(ref);
        for (const candidate of candidates) {
          // Try to access the file directly (public access)
          const directUrl = `https://nkombdutnjvaasxrbmdn.supabase.co/storage/v1/object/public/audio/${candidate}`;
          const testResponse = await fetch(directUrl, { method: 'HEAD' });
          if (testResponse.ok) {
            return NextResponse.json({
              url: directUrl,
              ref,
              filename: candidate,
              isSigned: false,
              ms: Date.now() - started,
            });
          }
        }
      } catch (directError) {
        console.warn(`Failed to find direct URL for ${ref}:`, directError);
      }
    }

    // If we still don't have a target object, generate from ref
    if (!targetObject && ref) {
      const candidates = candidatePathsFromRef(ref)
      // Try candidates in order until we find one that exists
      for (const candidate of candidates) {
        const { data } = await supabase.storage
          .from(targetBucket)
          .createSignedUrl(candidate, 60 * 60)

        if (data?.signedUrl) {
          targetObject = candidate
          console.log(`Found audio file for ${ref}: ${candidate}`)
          break
        }
      }
    }

    if (!targetObject) {
      return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })
    }

    // Try Supabase Storage first - this should work for files uploaded to the bucket
    // Use longer expiry for Afghan 2023 audio (24 hours) to handle slow loading
    const isAfghanAudio = ref && (ref.toLowerCase().includes('matthew') || ref.toLowerCase().includes('mark') || ref.toLowerCase().includes('luke') || ref.toLowerCase().includes('john'));
    const expiryTime = isAfghanAudio ? 24 * 60 * 60 : 60 * 60; // 24 hours for Afghan, 1 hour for others

    const { data, error } = await supabase.storage
      .from(targetBucket)
      .createSignedUrl(targetObject, expiryTime)

    if (error || !data?.signedUrl) {
      console.warn(`Failed to create signed URL for ${targetBucket}/${targetObject}:`, error)
      return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })
    }

    // Force download when used in links by adding download=1
    const hasQuery = data.signedUrl.includes('?')
    const withDl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'

    // Use CDN if configured, otherwise use direct Supabase URL for better CORS compatibility
    let finalUrl = withDl
    if (CDN_BASE_URL && CDN_BASE_URL !== 'https://cdn.jsdelivr.net') {
      // Replace Supabase domain with CDN domain
      finalUrl = withDl.replace(
        /https:\/\/[^\/]+\.supabase\.co/,
        CDN_BASE_URL
      )
    } else {
      // For Afghan 2023 audio, use direct Supabase URL which should work better with CORS
      finalUrl = withDl
    }

    // Cache the result
    audioUrlCache.set(cacheKey, {
      url: finalUrl,
      expires: Date.now() + CACHE_TTL
    })

    return NextResponse.json({
      url: finalUrl,
      ref,
      filename: targetObject,
      isSigned: true,
      ms: Date.now() - started,
      cdn: !!CDN_BASE_URL && CDN_BASE_URL !== 'https://cdn.jsdelivr.net'
    })

  } catch (error) {
    console.error('Audio URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio URL' },
      { status: 500 }
    )
  }
}

/**
 * Alternative: Batch signed URLs for multiple verses
 * Usage: POST /api/audio_url with body: { refs: ["Genesis 1:1", "Genesis 1:2"] }
 */
export async function POST(request: NextRequest) {
  const started = Date.now()

  try {
    const body = await request.json().catch(() => ({})) as { refs?: string[] }
    const refs = body.refs || []

    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'Refs array required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const results: Record<string, { url: string; filename: string; isSigned: boolean }> = {}

    // Process each ref with optimized candidate selection
    for (const ref of refs) {
      try {
        const isAfghanAudio = ref && (ref.toLowerCase().includes('matthew') || ref.toLowerCase().includes('mark') || ref.toLowerCase().includes('luke') || ref.toLowerCase().includes('john'));

        // For Afghan 2023, check Google Drive audio map first (more reliable)
        if (isAfghanAudio) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pashto-bible-search.vercel.app';
            const audioMapResponse = await fetch(`${baseUrl}/api/get_audio_map?clear_cache=1`, {
              cache: 'no-store'
            });
            if (audioMapResponse.ok) {
              const audioMap = await audioMapResponse.json();
              const audioEntry = audioMap[ref];
              if (audioEntry && typeof audioEntry === 'string' && !audioEntry.startsWith('http')) {
                // Use Google Drive proxy for Afghan 2023
                const proxyUrl = `/api/audio_proxy?fileId=${audioEntry}&ref=${encodeURIComponent(ref)}`;
                results[ref] = {
                  url: proxyUrl,
                  filename: '',
                  isSigned: false,
                  source: 'google-drive'
                }
                console.log(`Batch found Google Drive audio for ${ref}`)
                continue; // Move to next ref
              }
            }
          } catch (audioMapError) {
            console.warn(`Failed to lookup ${ref} in audio map:`, audioMapError);
          }
        }

        // For non-Afghan audio, use Supabase storage
        const candidates = candidatePathsFromRef(ref)

        // If not Afghan or direct URL not found, use signed URLs
        if (!results[ref] || !results[ref].url) {
          let foundUrl = ''
          let foundFilename = ''

          for (const candidate of candidates) {
            const expiryTime = isAfghanAudio ? 24 * 60 * 60 : 60 * 60; // 24 hours for Afghan, 1 hour for others

            const { data, error } = await supabase.storage
              .from('audio')
              .createSignedUrl(candidate, expiryTime)

            if (!error && data?.signedUrl) {
              const hasQuery = data.signedUrl.includes('?')
              foundUrl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'

              // Use CDN if configured, otherwise use direct Supabase URL for better CORS compatibility
              if (CDN_BASE_URL && CDN_BASE_URL !== 'https://cdn.jsdelivr.net') {
                foundUrl = foundUrl.replace(
                  /https:\/\/[^\/]+\.supabase\.co/,
                  CDN_BASE_URL
                )
              } else {
                foundUrl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'
              }

              foundFilename = candidate
              console.log(`Batch found signed audio for ${ref}: ${candidate}`)
              break
            }
          }

          results[ref] = {
            url: foundUrl,
            filename: foundFilename,
            isSigned: !!foundUrl
          }
        }
      } catch {
        results[ref] = { url: '', filename: '', isSigned: false };
      }
    }

    return NextResponse.json({
      urls: results,
      count: Object.keys(results).length,
      ms: Date.now() - started,
      performance: {
        total: Date.now() - started,
        average: (Date.now() - started) / Object.keys(results).length
      }
    });
  } catch (error) {
    console.error('Batch audio URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio URLs' },
      { status: 500 }
    );
  }
}

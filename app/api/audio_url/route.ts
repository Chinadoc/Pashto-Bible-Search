import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

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

  // Standard patterns (existing)
  const base = `${chapter}_verse_${verse}.mp3`;
  const primary = `${slug}${base}`;
  const alts = altNumericBookSlugBothWays(slug).map(s => `${s}${base}`);
  const hy = hyphenSlug(book);
  const nested = [`${hy}/chapter-${chapter}-verses/verse-${verse}.mp3`];

  // Yousafzai patterns (new - zero-padded, yousafzai prefix)
  const chapPad = String(chapter).padStart(3, '0');
  const verPad = String(verse).padStart(3, '0');
  const yousafzaiBase = `yousafzai_${slug}${chapPad}_verse_${verPad}.mp3`;
  const yousafzaiPath = `yousafzai/${yousafzaiBase}`;

  return Array.from(new Set([primary, ...alts, ...nested, yousafzaiPath]));
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

    let targetBucket = bucket || 'audio'
    let targetObject = object || path

    // If we have a ref but no bucket/object, look up in audio map first
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
            // If it's a Google Drive file ID, return the direct download URL
            if (typeof audioEntry === 'string' && !audioEntry.startsWith('http')) {
              const driveUrl = `https://drive.google.com/uc?export=download&id=${audioEntry}`;
              return NextResponse.json({
                url: driveUrl,
                ref,
                filename: '',
                isSigned: false,
                ms: Date.now() - started,
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

    // If we still don't have a target object, generate from ref
    if (!targetObject && ref) {
      const candidates = candidatePathsFromRef(ref)
      targetObject = candidates[0] // Take first candidate only
    }

    if (!targetObject) {
      return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })
    }

    // Try Supabase Storage first - this should work for files uploaded to the bucket
    const { data, error } = await supabase.storage
      .from(targetBucket)
      .createSignedUrl(targetObject, 60 * 60)

    if (error || !data?.signedUrl) {
      console.warn(`Failed to create signed URL for ${targetBucket}/${targetObject}:`, error)
      return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })
    }

    // Force download when used in links by adding download=1
    const hasQuery = data.signedUrl.includes('?')
    const withDl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'

    return NextResponse.json({
      url: withDl,
      ref,
      filename: targetObject,
      isSigned: true,
      ms: Date.now() - started,
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
        const candidates = candidatePathsFromRef(ref)
        const primaryCandidate = candidates[0] // Use first candidate only for performance

        const { data, error } = await supabase.storage
          .from('audio')
          .createSignedUrl(primaryCandidate, 60 * 60)

        if (!error && data?.signedUrl) {
          const hasQuery = data.signedUrl.includes('?')
          const withDl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'
          results[ref] = { url: withDl, filename: primaryCandidate, isSigned: true }
        } else {
          results[ref] = { url: '', filename: '', isSigned: false }
        }
      } catch {
        results[ref] = { url: '', filename: '', isSigned: false }
      }
    }

    return NextResponse.json({
      urls: results,
      count: Object.keys(results).length,
      ms: Date.now() - started
    })

  } catch (error) {
    console.error('Batch audio URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio URLs' },
      { status: 500 }
    )
  }
}

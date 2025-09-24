import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase'

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
  const base = `${chapter}_verse_${verse}.mp3`;
  const primary = `${slug}${base}`;
  const alts = altNumericBookSlugBothWays(slug).map(s => `${s}${base}`);
  const hy = hyphenSlug(book);
  // Also support nested paths like: 1-corinthians/chapter-1-verses/verse-1.mp3
  const nested = [`${hy}/chapter-${chapter}-verses/verse-${verse}.mp3`];
  return Array.from(new Set([primary, ...alts, ...nested]));
}

export async function GET(request: NextRequest) {
  const started = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')

    if (!ref) {
      return NextResponse.json({ error: 'Reference parameter required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Use only the primary candidate (most common pattern) for performance
    const candidates = candidatePathsFromRef(ref)
    const primaryCandidate = candidates[0] // Take first candidate only

    // Try Supabase Storage first - this should work for files uploaded to the 'audio' bucket
    const { data, error } = await supabase.storage
      .from('audio')
      .createSignedUrl(primaryCandidate, 60 * 60)

    if (error || !data?.signedUrl) {
      return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })
    }

    // Force download when used in links by adding download=1
    const hasQuery = data.signedUrl.includes('?')
    const withDl = data.signedUrl + (hasQuery ? '&' : '?') + 'download=1'

    return NextResponse.json({
      url: withDl,
      ref,
      filename: primaryCandidate,
      isSigned: true,
      ms: Date.now() - started,
    })

    // No match in storage — return empty (client will hide audio controls)
    return NextResponse.json({ url: '', ref, filename: '', isSigned: false, ms: Date.now() - started })

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

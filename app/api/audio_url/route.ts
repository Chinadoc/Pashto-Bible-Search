import { NextRequest, NextResponse } from 'next/server';
import {
  loadAudioMap,
  audioEntryToUrl,
  refToFilename as mapRefToFilename,
  filenameVariants as mapFilenameVariants,
} from '@/app/lib/audio-map';
import type { AudioMap } from '@/types';

export const runtime = 'nodejs';

function normalizeRef(ref: string): string {
  return ref.trim().replace(/\s+/g, ' ');
}

function lookupAudioEntry(ref: string, audioMap: AudioMap): { key: string; value: string } | null {
  const candidates = new Set<string>();
  candidates.add(ref);

  const trimmed = normalizeRef(ref);
  candidates.add(trimmed);
  candidates.add(trimmed.toLowerCase());

  const filename = mapRefToFilename(trimmed);
  if (filename) {
    candidates.add(filename);
    candidates.add(filename.toLowerCase());
    for (const variant of mapFilenameVariants(trimmed)) {
      candidates.add(variant);
      candidates.add(variant.toLowerCase());
    }
  }

  for (const key of candidates) {
    const value = audioMap[key];
    if (typeof value === 'string' && value.length > 0) {
      return { key, value };
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 });
  }

  try {
    const audioMap = await loadAudioMap(false);
    const match = lookupAudioEntry(ref, audioMap);
    if (!match) {
      return NextResponse.json(
        {
          error: 'Audio not found',
          ref,
        },
        { status: 404 },
      );
    }

    const url = audioEntryToUrl(match.value);
    if (!url) {
      return NextResponse.json(
        {
          error: 'Unable to resolve audio URL',
          ref,
          key: match.key,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ref,
      url,
      key: match.key,
      source: 'audio-map',
      isSigned: false,
    });
  } catch (error) {
    console.error('Failed to resolve audio URL:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URL',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refs: unknown = body?.refs;
    if (!Array.isArray(refs) || refs.length === 0) {
      return NextResponse.json({ error: 'Expected refs array with at least one item' }, { status: 400 });
    }

    const stringRefs = refs.map((item) => String(item)).filter(Boolean);
    if (stringRefs.length === 0) {
      return NextResponse.json({ error: 'Refs array contained no usable values' }, { status: 400 });
    }

    const audioMap = await loadAudioMap(false);
    const urls: Record<string, string | null> = {};

    for (const ref of stringRefs) {
      const match = lookupAudioEntry(ref, audioMap);
      if (!match) {
        urls[ref] = null;
        continue;
      }
      const url = audioEntryToUrl(match.value);
      urls[ref] = url || null;
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Failed to batch resolve audio URLs:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve audio URLs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

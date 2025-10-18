import { NextResponse } from 'next/server';
import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const ALLOWED_EXTENSIONS = new Set(['wav', 'mp3', 'm4a', 'aac']);

type ClipMeta = {
  filename: string;
  title: string;
  description?: string;
  tags?: string[];
  query?: string;
  durationSeconds?: number;
};

let cachedResponse: { clips: ClipMeta[]; generatedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedResponse && now - cachedResponse.generatedAt < CACHE_TTL_MS) {
      return NextResponse.json(cachedResponse);
    }

    const sentenceClipsDir = join(process.cwd(), 'sentence_clips');
    let entries: string[] = [];
    try {
      entries = await readdir(sentenceClipsDir);
    } catch (err) {
      console.warn('VideosPanel: sentence_clips directory missing', err);
      cachedResponse = { clips: [], generatedAt: now };
      return NextResponse.json(cachedResponse);
    }

    const clips: ClipMeta[] = entries
      .filter((filename) => {
        const ext = parse(filename).ext.slice(1).toLowerCase();
        return ALLOWED_EXTENSIONS.has(ext);
      })
      .map((filename) => {
        const extless = parse(filename).name;
        const parts = extless.split('｜').map((part) => part.trim()).filter(Boolean);
        const tags: string[] = [];
        let title = extless;
        let query: string | undefined;

        if (parts.length >= 2) {
          title = `${parts[0]} — ${parts[1]}`;
          tags.push(parts[0], parts[1]);
        } else if (parts.length === 1) {
          title = parts[0];
          tags.push(parts[0]);
        }

        if (parts.length >= 3) {
          const finalPart = parts[parts.length - 1];
          query = finalPart.replace(/_segment.*$/i, '').trim();
          if (query) {
            tags.push('sentence');
          }
        }

        return {
          filename,
          title,
          tags: Array.from(new Set(tags.map((tag) => tag.replace(/\s+/g, ' ')))),
          query,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    cachedResponse = { clips, generatedAt: now };
    return NextResponse.json(cachedResponse);
  } catch (error) {
    console.error('Failed to load sentence clips list', error);
    return NextResponse.json(
      { error: 'Failed to load clips' },
      { status: 500 },
    );
  }
}


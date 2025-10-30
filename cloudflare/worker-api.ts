/**
 * Cloudflare Worker API Routes for Pashto Bible Search
 * Provides API endpoints for database queries and audio access via D1 + R2
 */

export interface Env {
  DB: D1Database;
  AUDIO_BUCKET: R2Bucket;
}

// ========================================
// Helper Functions
// ========================================

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function errorResponse(message: string, status: number = 500): Response {
  return jsonResponse({ error: message }, status);
}

// Helper to parse JSON safely from SQLite TEXT columns
function parseJsonSafe<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

// ========================================
// API Routes
// ========================================

/**
 * Search verses by text query
 */
async function searchVerses(
  env: Env,
  query: string,
  options: {
    translation?: 'afghan2023' | 'yousafzai2019';
    testament?: 'OT' | 'NT';
    limit?: number;
  } = {}
): Promise<Response> {
  const { translation = 'afghan2023', testament, limit = 100 } = options;
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    let sql = `SELECT * FROM ${table} WHERE text LIKE ?`;
    const params: any[] = [`%${query}%`];

    if (testament) {
      sql += ` AND testament = ?`;
      params.push(testament);
    }

    sql += ` ORDER BY book, chapter, verse LIMIT ?`;
    params.push(limit);

    const result = await env.DB.prepare(sql).bind(...params).all();

    // Convert SQLite timestamps to ISO strings
    const verses = result.results?.map((verse: any) => ({
      ...verse,
      created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
      updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
      tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
    })) || [];

    return jsonResponse({ verses, count: verses.length });
  } catch (error: any) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}

/**
 * Get verses by book and chapter
 */
async function getVersesByChapter(
  env: Env,
  book: string,
  chapter: number,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Response> {
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    const result = await env.DB.prepare(
      `SELECT * FROM ${table} WHERE book = ? AND chapter = ? ORDER BY verse`
    )
      .bind(book, chapter)
      .all();

    const verses = result.results?.map((verse: any) => ({
      ...verse,
      created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
      updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
      tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
    })) || [];

    return jsonResponse({ verses, count: verses.length });
  } catch (error: any) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
  }
}

/**
 * Get verse by reference
 */
async function getVerseByRef(
  env: Env,
  ref: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<Response> {
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  try {
    const result = await env.DB.prepare(`SELECT * FROM ${table} WHERE ref = ?`)
      .bind(ref)
      .first();

    if (!result) {
      return errorResponse('Verse not found', 404);
    }

    const verse = {
      ...result,
      created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
      updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
      tags: result.tags ? parseJsonSafe(result.tags, []) : [],
    };

    return jsonResponse({ verse });
  } catch (error: any) {
    return errorResponse(`Failed to get verse: ${error.message}`, 500);
  }
}

/**
 * Search word occurrences
 */
async function searchWordOccurrences(
  env: Env,
  word: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  limit: number = 100
): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM word_occurrence_index WHERE word = ? AND translation_key = ? ORDER BY frequency DESC LIMIT ?`
    )
      .bind(word, translation, limit)
      .all();

    const occurrences = result.results?.map((occ: any) => ({
      ...occ,
      verse_refs: parseJsonSafe(occ.verse_refs, []),
      tf_idf_scores: parseJsonSafe(occ.tf_idf_scores, []),
      created_at: occ.created_at ? new Date(occ.created_at * 1000).toISOString() : null,
      updated_at: occ.updated_at ? new Date(occ.updated_at * 1000).toISOString() : null,
    })) || [];

    return jsonResponse({ occurrences, count: occurrences.length });
  } catch (error: any) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}

/**
 * Get audio URL from R2
 */
async function getAudioUrl(env: Env, r2Key: string): Promise<Response> {
  try {
    // Try to get public URL (if bucket is public) or generate signed URL
    const object = await env.AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return errorResponse('Audio file not found', 404);
    }

    // For public buckets, construct public URL
    // For private buckets, generate signed URL (requires custom domain or signed URL generation)
    const publicUrl = `https://pub-${env.AUDIO_BUCKET.accountId}.r2.dev/${r2Key}`;

    // Alternatively, serve directly through worker (better for private buckets)
    return jsonResponse({
      url: publicUrl,
      contentType: object.httpMetadata?.contentType || 'audio/mpeg',
      size: object.size,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get audio URL: ${error.message}`, 500);
  }
}

/**
 * Stream audio file from R2
 */
async function streamAudio(env: Env, r2Key: string, request: Request): Promise<Response> {
  try {
    const object = await env.AUDIO_BUCKET.get(r2Key);

    if (!object) {
      return errorResponse('Audio file not found', 404);
    }

    // Handle range requests for audio seeking
    const range = request.headers.get('Range');
    if (range && object.range) {
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1]);
        const end = match[2] ? parseInt(match[2]) : object.size - 1;
        const rangeObject = await env.AUDIO_BUCKET.get(r2Key, {
          range: { offset: start, length: end - start + 1 },
        });

        if (rangeObject) {
          return new Response(rangeObject.body, {
            status: 206,
            headers: {
              'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
              'Content-Range': `bytes ${start}-${end}/${object.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': (end - start + 1).toString(),
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    }

    // Full file response
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'audio/mpeg',
        'Content-Length': object.size.toString(),
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    return errorResponse(`Failed to stream audio: ${error.message}`, 500);
  }
}

// ========================================
// Main Request Handler
// ========================================

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Route handlers
    if (path === '/api/search' && request.method === 'GET') {
      const query = url.searchParams.get('q') || '';
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const testament = url.searchParams.get('testament') as 'OT' | 'NT' | undefined;
      const limit = parseInt(url.searchParams.get('limit') || '100');

      return searchVerses(env, query, { translation, testament, limit });
    }

    if (path === '/api/chapter' && request.method === 'GET') {
      const book = url.searchParams.get('book');
      const chapter = parseInt(url.searchParams.get('chapter') || '1');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';

      if (!book) {
        return errorResponse('Missing book parameter', 400);
      }

      return getVersesByChapter(env, book, chapter, translation);
    }

    if (path === '/api/verse' && request.method === 'GET') {
      const ref = url.searchParams.get('ref');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';

      if (!ref) {
        return errorResponse('Missing ref parameter', 400);
      }

      return getVerseByRef(env, ref, translation);
    }

    if (path === '/api/word-occurrences' && request.method === 'GET') {
      const word = url.searchParams.get('word');
      const translation = (url.searchParams.get('translation') as any) || 'afghan2023';
      const limit = parseInt(url.searchParams.get('limit') || '100');

      if (!word) {
        return errorResponse('Missing word parameter', 400);
      }

      return searchWordOccurrences(env, word, translation, limit);
    }

    if (path.startsWith('/api/audio/url/') && request.method === 'GET') {
      const r2Key = path.replace('/api/audio/url/', '');
      return getAudioUrl(env, decodeURIComponent(r2Key));
    }

    if (path.startsWith('/api/audio/stream/') && request.method === 'GET') {
      const r2Key = path.replace('/api/audio/stream/', '');
      return streamAudio(env, decodeURIComponent(r2Key), request);
    }

    return errorResponse('Not found', 404);
  },
};




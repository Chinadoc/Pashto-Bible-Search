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
// Lexicon API Routes
// ========================================

/**
 * Get all inflections for a base word
 * GET /api/inflections?base_word={word}
 */
async function getInflections(env: Env, baseWord: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    )
      .bind(baseWord)
      .all();

    const inflections = result.results?.map((inf: any) => ({
      id: inf.id,
      base_word: inf.base_word,
      inflected_form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency,
      examples: parseJsonSafe(inf.examples, []),
      created_at: inf.created_at ? new Date(inf.created_at * 1000).toISOString() : null,
      updated_at: inf.updated_at ? new Date(inf.updated_at * 1000).toISOString() : null,
    })) || [];

    return jsonResponse({ inflections, count: inflections.length });
  } catch (error: any) {
    return errorResponse(`Failed to get inflections: ${error.message}`, 500);
  }
}

/**
 * Find base word from inflected form (reverse lookup)
 * GET /api/inflections/reverse?form={form}
 */
async function getInflectionBase(env: Env, form: string): Promise<Response> {
  try {
    // First try form_to_root table
    const rootResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(form)
      .first();

    if (rootResult) {
      return jsonResponse({ base_word: rootResult.root_word, form, source: 'form_to_root' });
    }

    // Fallback to inflections table
    const inflectionResult = await env.DB.prepare(
      `SELECT base_word FROM inflections WHERE inflected_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(form)
      .first();

    if (inflectionResult) {
      return jsonResponse({ base_word: inflectionResult.base_word, form, source: 'inflections' });
    }

    return errorResponse('Base word not found', 404);
  } catch (error: any) {
    return errorResponse(`Failed to get base word: ${error.message}`, 500);
  }
}

/**
 * Get verb conjugation data
 * GET /api/verbs/{root}
 */
async function getVerbData(env: Env, root: string): Promise<Response> {
  try {
    // Try irregular_verbs first
    let result = await env.DB.prepare(
      `SELECT * FROM irregular_verbs WHERE verb_root = ? LIMIT 1`
    )
      .bind(root)
      .first();

    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
        },
        type: 'irregular',
      });
    }

    // Try regular verbs_lexicon
    result = await env.DB.prepare(
      `SELECT * FROM verbs_lexicon WHERE verb_root = ? LIMIT 1`
    )
      .bind(root)
      .first();

    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
        },
        type: 'regular',
      });
    }

    return errorResponse('Verb not found', 404);
  } catch (error: any) {
    return errorResponse(`Failed to get verb data: ${error.message}`, 500);
  }
}

/**
 * Get noun lexicon data
 * GET /api/nouns/{word}
 */
async function getNounData(env: Env, word: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM nouns_lexicon WHERE pashto_word = ? LIMIT 1`
    )
      .bind(word)
      .first();

    if (!result) {
      return errorResponse('Noun not found', 404);
    }

    return jsonResponse({
      noun: {
        ...result,
        plural_forms: parseJsonSafe(result.plural_forms, null),
        examples: parseJsonSafe(result.examples, []),
        created_at: result.created_at ? new Date(result.created_at * 1000).toISOString() : null,
        updated_at: result.updated_at ? new Date(result.updated_at * 1000).toISOString() : null,
      },
    });
  } catch (error: any) {
    return errorResponse(`Failed to get noun data: ${error.message}`, 500);
  }
}

/**
 * Get related forms for a query
 * GET /api/related-forms?query={query}
 */
async function getRelatedForms(env: Env, query: string): Promise<Response> {
  try {
    // First, try to find base word from query
    const baseWordResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    )
      .bind(query)
      .first();

    const baseWord = baseWordResult ? baseWordResult.root_word : query;

    // Get all inflections for base word
    const inflectionsResult = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    )
      .bind(baseWord)
      .all();

    const inflections = inflectionsResult.results?.map((inf: any) => ({
      form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency,
    })) || [];

    return jsonResponse({
      query,
      base_word: baseWord,
      inflections,
      count: inflections.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get related forms: ${error.message}`, 500);
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

    // Lexicon API routes
    if (path === '/api/inflections' && request.method === 'GET') {
      const baseWord = url.searchParams.get('base_word');
      if (!baseWord) {
        return errorResponse('Missing base_word parameter', 400);
      }
      return getInflections(env, baseWord);
    }

    if (path === '/api/inflections/reverse' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }
      return getInflectionBase(env, form);
    }

    if (path.startsWith('/api/verbs/') && request.method === 'GET') {
      const root = path.replace('/api/verbs/', '');
      if (!root) {
        return errorResponse('Missing verb root', 400);
      }
      return getVerbData(env, decodeURIComponent(root));
    }

    if (path.startsWith('/api/nouns/') && request.method === 'GET') {
      const word = path.replace('/api/nouns/', '');
      if (!word) {
        return errorResponse('Missing noun word', 400);
      }
      return getNounData(env, decodeURIComponent(word));
    }

    if (path === '/api/related-forms' && request.method === 'GET') {
      const query = url.searchParams.get('query');
      if (!query) {
        return errorResponse('Missing query parameter', 400);
      }
      return getRelatedForms(env, query);
    }

    return errorResponse('Not found', 404);
  },
};




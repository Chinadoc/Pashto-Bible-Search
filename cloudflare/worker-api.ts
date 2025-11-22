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

/**
 * Extract Pashto words from text
 */
function extractPashtoWords(text: string): string[] {
  const words = text.match(/[\u0600-\u06FF]+/g) || [];
  return words.map(w => w.trim()).filter(w => w.length > 0);
}

/**
 * Clean word by removing punctuation
 */
function cleanWord(word: string): string {
  return word
    .replace(/[.,!?؟،[\](){}«»]/g, '')
    .trim();
}

/**
 * Infer verb root from form (simplified version for Worker)
 */
function inferVerbRootFromForm(form: string): {
  root: string | null;
  isTransitive: boolean;
  isPerfective: boolean;
  confidence: 'high' | 'medium' | 'low';
} {
  let prefix: string | null = null;
  let stem = form;

  // Remove verb prefixes (check longer prefixes first)
  if (form.startsWith('به')) {
    prefix = 'به';
    stem = form.slice(2);
  } else if (form.startsWith('تر')) {
    prefix = 'تر';
    stem = form.slice(2);
  } else if (form.startsWith('و')) {
    prefix = 'و';
    stem = form.slice(1);
  }

  const isPerfective = prefix === 'و';
  let isTransitive = false;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  let root: string | null = null;

  // Check for verb endings (person/mood markers)
  const verbEndings = ['م', 'ې', 'ي', 'و', 'ئ', 'ه', 'ل'];
  let foundEnding = false;

  for (const ending of verbEndings) {
    if (stem.endsWith(ending) && stem.length > ending.length + 1) {
      const potentialStem = stem.slice(0, -ending.length);
      // Only remove ending if remaining part looks valid
      if (potentialStem.length >= 2) {
        stem = potentialStem;
        foundEnding = true;
        confidence = prefix ? 'high' : 'medium';
        break;
      }
    }
  }

  // Check for verb root markers to infer the base root
  if (stem.endsWith('ول')) {
    // Transitive verb root: e.g., "فرمايول"
    root = stem; // Keep the full root with "ول"
    isTransitive = true;
    confidence = 'high';
  } else if (stem.endsWith('ېدل') || stem.endsWith('یدل')) {
    // Intransitive verb root: e.g., "نومېدل"
    root = stem; // Keep the full root with "ېدل"
    isTransitive = false;
    confidence = 'high';
  } else if (stem.endsWith('کول')) {
    // Causative transitive: e.g., "کول"
    root = stem;
    isTransitive = true;
    confidence = 'high';
  } else if (stem.endsWith('کېدل')) {
    // Causative intransitive: e.g., "کېدل"
    root = stem;
    isTransitive = false;
    confidence = 'high';
  } else if (foundEnding || prefix) {
    // We found a prefix or ending, so it's likely a verb form
    // Try to construct root by adding "ول" (common transitive marker)
    // This handles cases like "وفرمایي" → "فرمايول"
    if (stem.length >= 3) {
      // Common pattern: stem + "ول" for transitive verbs
      root = stem + 'ول';
      isTransitive = true;
      confidence = prefix ? 'high' : 'medium';
    } else {
      root = stem;
      confidence = prefix ? 'medium' : 'low';
    }
  }

  // If we couldn't find a clear root and no prefix, return null
  if (!root && !prefix && !foundEnding) {
    return {
      root: null,
      isTransitive: false,
      isPerfective: false,
      confidence: 'low',
    };
  }

  return {
    root: root || stem || form,
    isTransitive,
    isPerfective,
    confidence,
  };
}

/**
 * Extract words from video transcript and add to word_frequencies with categorization
 */
async function extractWordsFromVideoTranscript(env: Env, videoId: string, transcript: string): Promise<void> {
  // Extract words
  const words = extractPashtoWords(transcript);

  // Count words
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    const cleaned = cleanWord(word);
    if (cleaned && cleaned.length > 0) {
      wordCounts.set(cleaned, (wordCounts.get(cleaned) || 0) + 1);
    }
  }

  if (wordCounts.size === 0) {
    console.log(`   No words extracted from transcript`);
    return;
  }

  // Ensure video_word_mappings table exists
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS video_word_mappings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id TEXT NOT NULL,
      pashto_word TEXT NOT NULL,
      frequency INTEGER DEFAULT 1,
      audio_r2_key TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      UNIQUE(video_id, pashto_word)
    )
  `).run();

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_video_word_video ON video_word_mappings(video_id)
  `).run().catch(() => { });

  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_video_word_word ON video_word_mappings(pashto_word)
  `).run().catch(() => { });

  // Get dictionary metadata for words (POS, inflections, etc.)
  const allWords = Array.from(wordCounts.keys());
  const wordMetadata = new Map<string, any>();

  // Query dictionary for metadata in batches
  const batchSize = 100;
  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);
    const placeholders = batch.map(() => '?').join(',');

    try {
      // First, try direct lookup
      const dictResults = await env.DB.prepare(`
        SELECT pashto_word, pos, word_type, inflection_type, compound_type,
               base_form, romanization, english_translation
        FROM word_frequencies
        WHERE pashto_word IN (${placeholders})
      `).bind(...batch).all();

      for (const row of dictResults.results || []) {
        wordMetadata.set(row.pashto_word as string, row);
      }

      // For words not found, try inferring base form and looking that up
      // This handles cases like "وفرمایيل" → "فرمایل" (LingDocs dictionary entry)
      const notFound = batch.filter(w => !wordMetadata.has(w));
      if (notFound.length > 0) {
        const inferredRoots = new Map<string, string[]>(); // form -> [possible_roots]

        for (const form of notFound) {
          const analysis = inferVerbRootFromForm(form);
          const possibleRoots: string[] = [];

          if (analysis.root && analysis.confidence !== 'low' && analysis.root !== form) {
            possibleRoots.push(analysis.root);

            // Also try removing "ول" suffix to get potential base form
            // e.g., "فرمایيول" → "فرمایي" → try "فرمایل" (LingDocs form)
            if (analysis.root.endsWith('ول') && analysis.root.length > 2) {
              const withoutOl = analysis.root.slice(0, -2);
              // Try adding "ل" to match LingDocs forms like "فرمایل"
              if (withoutOl.length >= 3) {
                possibleRoots.push(withoutOl + 'ل');
              }
            }

            // Try the stem directly (might match LingDocs imperfective root)
            if (form.startsWith('و')) {
              const stem = form.slice(1);
              // Remove common endings to get closer to root
              const cleanStem = stem.replace(/[مېيوئه]$/, '');
              if (cleanStem.length >= 3 && cleanStem !== form) {
                possibleRoots.push(cleanStem);
                // Also try with 'ل' ending (common verb root ending)
                if (!cleanStem.endsWith('ل')) {
                  possibleRoots.push(cleanStem + 'ل');
                }
              }
            }
          }

          if (possibleRoots.length > 0) {
            inferredRoots.set(form, [...new Set(possibleRoots)]); // Remove duplicates
          }
        }

        // Look up all possible roots
        if (inferredRoots.size > 0) {
          const allRoots = new Set<string>();
          for (const roots of inferredRoots.values()) {
            roots.forEach(r => allRoots.add(r));
          }

          const rootsToLookup = Array.from(allRoots);
          const rootPlaceholders = rootsToLookup.map(() => '?').join(',');

          const rootResults = await env.DB.prepare(`
            SELECT pashto_word, pos, word_type, inflection_type, compound_type,
                   base_form, romanization, english_translation
            FROM word_frequencies
            WHERE pashto_word IN (${rootPlaceholders})
          `).bind(...rootsToLookup).all();

          // Map roots back to forms (prefer exact matches, then try variations)
          const rootMap = new Map<string, any>();
          for (const row of rootResults.results || []) {
            rootMap.set(row.pashto_word as string, row);
          }

          // Associate root metadata with original forms
          for (const [form, roots] of inferredRoots.entries()) {
            // Try roots in order (most specific first)
            for (const root of roots) {
              const rootData = rootMap.get(root);
              if (rootData) {
                // Use root's metadata but keep the form's base_form as the root
                wordMetadata.set(form, {
                  ...rootData,
                  base_form: root, // The inferred root is the base form
                });
                break; // Use first match found
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`   Failed to fetch metadata for batch: ${error}`);
    }
  }

  // Process words in batches
  let processed = 0;

  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);

    for (const word of batch) {
      const count = wordCounts.get(word) || 0;
      const metadata = wordMetadata.get(word);

      try {
        // Get or create audio R2 key for this word in this video
        // Use the segment where the word appears most frequently
        const audioKey = `videos/${videoId}/full.mp3`; // Full video audio for now

        // Update or insert word_frequencies with metadata preservation
        if (metadata) {
          // Word exists in dictionary - update frequency, preserve all metadata (pos, inflection_type, etc.)
          await env.DB.prepare(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ?,
              updated_at = strftime('%s', 'now')
            WHERE pashto_word = ?
          `).bind(count, word).run();
        } else {
          // New word from video - try to infer verb metadata if it looks like a verb
          let inferredPos: string | null = null;
          let inferredWordType: string | null = null;
          let inferredInflectionType: string | null = null;
          let inferredBaseForm: string | null = null;

          // Simple verb detection: check for verb markers
          if (word.match(/^(و|به|تر)/) || word.match(/(ول|ېدل|یدل|کول|کېدل)$/) ||
            word.match(/(م|ې|ي|و|ئ)$/)) {
            // Looks like a verb - try to infer root
            const verbAnalysis = inferVerbRootFromForm(word);
            if (verbAnalysis.root && verbAnalysis.confidence !== 'low') {
              inferredPos = verbAnalysis.isTransitive ? 'v. trans.' : 'v. intrans.';
              inferredWordType = 'verb';
              inferredInflectionType = verbAnalysis.isPerfective ? 'perfective_past' :
                word.startsWith('به') ? 'future_subjunctive' : 'imperfective_present';
              inferredBaseForm = verbAnalysis.root;
            }
          }

          // Insert with inferred metadata if available
          await env.DB.prepare(`
            INSERT INTO word_frequencies (
              pashto_word, frequency_total, frequency_afghan2023_ot, frequency_afghan2023_nt,
              frequency_yousafzai2019_ot, frequency_yousafzai2019_nt, frequency_rank,
              pos, word_type, inflection_type, base_form,
              created_at, updated_at
            )
            VALUES (?, ?, 0, 0, 0, 0, 0, ?, ?, ?, ?, strftime('%s', 'now'), strftime('%s', 'now'))
            ON CONFLICT(pashto_word) DO UPDATE SET
              frequency_total = frequency_total + ?,
              pos = COALESCE(pos, ?),
              word_type = COALESCE(word_type, ?),
              inflection_type = COALESCE(inflection_type, ?),
              base_form = COALESCE(base_form, ?),
              updated_at = strftime('%s', 'now')
          `).bind(
            word, count,
            inferredPos, inferredWordType, inferredInflectionType, inferredBaseForm,
            count, inferredPos, inferredWordType, inferredInflectionType, inferredBaseForm
          ).run();
        }

        // Insert video_word_mappings with audio reference
        await env.DB.prepare(`
          INSERT OR REPLACE INTO video_word_mappings 
          (video_id, pashto_word, frequency, audio_r2_key, updated_at)
          VALUES (?, ?, ?, ?, strftime('%s', 'now'))
        `).bind(videoId, word, count, audioKey).run();

        processed++;
      } catch (error: any) {
        console.warn(`   Failed to process word "${word}": ${error.message}`);
      }
    }
  }

  // Update frequency_video for all words affected by this video
  if (processed > 0) {
    const affectedWords = Array.from(wordCounts.keys());
    const placeholders = affectedWords.map(() => '?').join(',');

    // Update frequency_video from video_word_mappings
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_video = (
        SELECT COALESCE(SUM(frequency), 0)
        FROM video_word_mappings
        WHERE video_word_mappings.pashto_word = word_frequencies.pashto_word
      )
      WHERE pashto_word IN (${placeholders})
    `).bind(...affectedWords).run().catch((err) => {
      console.warn(`   Failed to update frequency_video: ${err.message}`);
    });

    // Recalculate frequency_total (Bible + video)
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                            COALESCE(frequency_afghan2023_nt, 0) + 
                            COALESCE(frequency_yousafzai2019_ot, 0) + 
                            COALESCE(frequency_yousafzai2019_nt, 0) + 
                            COALESCE(frequency_video, 0)
      WHERE pashto_word IN (${placeholders})
    `).bind(...affectedWords).run().catch((err) => {
      console.warn(`   Failed to update frequency_total: ${err.message}`);
    });
  }

  // Recalculate ranks (do this once at the end)
  if (processed > 0) {
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      )
    `).run().catch(() => { });
  }

  console.log(`   Processed ${processed} unique words from video ${videoId}`);
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
 * Generate R2 audio key from book, chapter, verse
 * Based on actual R2 bucket structure:
 * - Afghan2023: afghan2023/nt/acts10_verse_001.mp3 (no prefix, chapter not padded)
 * - Yousafzai: yousafzai/nt/yousafzai_acts001_verse_001.mp3 (with prefix, 3-digit chapter)
 */
function generateR2AudioKey(book: string, chapter: number, verse: number, translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'): string {
  // Normalize book name: lowercase, remove spaces
  let bookSlug = book.toLowerCase().replace(/\s+/g, '');

  // Determine testament based on book name
  const OT_BOOKS = new Set([
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs', 'ecclesiastes', 'songofsongs', 'songofsolomon', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
  ]);

  const testament = OT_BOOKS.has(bookSlug) ? 'ot' : 'nt';

  // Format differs by translation
  if (translation === 'yousafzai2019') {
    // Yousafzai: yousafzai/nt/yousafzai_acts001_verse_001.mp3
    const chapterPadded = String(chapter).padStart(3, '0');
    const versePadded = String(verse).padStart(3, '0');
    return `yousafzai/${testament}/yousafzai_${bookSlug}${chapterPadded}_verse_${versePadded}.mp3`;
  } else {
    // Afghan2023: afghan2023/nt/acts10_verse_001.mp3 (chapter NOT padded)
    const versePadded = String(verse).padStart(3, '0');
    return `afghan2023/${testament}/${bookSlug}${chapter}_verse_${versePadded}.mp3`;
  }
}

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

    const workerUrl = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

    const verses = result.results?.map((verse: any) => {
      let audioPublicUrl: string | null = null;
      let audioR2Key: string | null = verse.audio_r2_key || null;

      // If no audio_r2_key in DB, try to generate it and check if it exists in R2
      if (!audioR2Key) {
        const generatedKey = generateR2AudioKey(verse.book, verse.chapter, verse.verse, translation);
        // Don't set it here - we'll verify it exists before using it
        audioR2Key = generatedKey;
      }

      // Build audio URL from R2 key if we have one
      if (audioR2Key) {
        // Verify the file exists in R2 before creating URL
        // (We'll check in parallel, but for now just create the URL)
        audioPublicUrl = `${workerUrl}/api/audio/stream/${encodeURIComponent(audioR2Key)}`;
      }

      return {
        ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        testament: verse.testament,
        dialect: translation === 'yousafzai2019' ? 'yousafzai' : 'afghan',
        audio_public_url: audioPublicUrl,
        audio_r2_key: audioR2Key,
        created_at: verse.created_at ? new Date(verse.created_at * 1000).toISOString() : null,
        updated_at: verse.updated_at ? new Date(verse.updated_at * 1000).toISOString() : null,
        tags: verse.tags ? parseJsonSafe(verse.tags, []) : [],
      };
    }) || [];

    return jsonResponse({ book, chapter, translation, verses, count: verses.length });
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

/**
 * Upload file to R2
 * POST /api/r2/upload
 */
async function uploadToR2(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || !data) {
      return errorResponse('Missing key or data', 400);
    }

    // Decode base64 data
    const buffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));

    console.log(`Uploading to R2: key=${key}, size=${buffer.length} bytes`);

    // Upload to R2
    await env.AUDIO_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Verify the upload by trying to get it back
    const verify = await env.AUDIO_BUCKET.get(key);
    if (verify === null) {
      console.error(`❌ Upload verification failed: file not found after upload`);
      return errorResponse('Upload verification failed', 500);
    }

    console.log(`✅ Successfully uploaded and verified: ${key} (${verify.size} bytes)`);

    return jsonResponse({ success: true, key, size: buffer.length });
  } catch (error: any) {
    console.error(`Upload error: ${error.message}`, error);
    return errorResponse(`Failed to upload to R2: ${error.message}`, 500);
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
 * Get verb conjugated forms from verb_forms table
 * GET /api/verb-forms?lemma={lemma}&cap={cap}
 */
async function getVerbForms(env: Env, lemma: string, cap: number = 200): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT form, tense, person, voice, gender, helper, confidence
       FROM verb_forms
       WHERE lemma = ?
       ORDER BY tense, person
       LIMIT ?`
    )
      .bind(lemma, cap)
      .all();

    if (!result.results || result.results.length === 0) {
      return jsonResponse({
        lemma,
        forms: [],
        count: 0,
        source: 'd1_verified',
      });
    }

    return jsonResponse({
      lemma,
      forms: result.results,
      count: result.results.length,
      source: 'd1_verified',
    });
  } catch (error: any) {
    return errorResponse(`Failed to get verb forms: ${error.message}`, 500);
  }
}

/**
 * Get verb lexicon metadata from verbs_lexicon table
 * GET /api/verb-lexicon?lemma={lemma}
 */
async function getVerbLexicon(env: Env, lemma: string): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM verbs_lexicon WHERE pashto_word = ?`
    )
      .bind(lemma)
      .first();

    if (!result) {
      return errorResponse('Verb not found in lexicon', 404);
    }

    return jsonResponse({
      entry: result,
      source: 'd1_verified',
    });
  } catch (error: any) {
    return errorResponse(`Failed to get verb lexicon: ${error.message}`, 500);
  }
}

/**
 * Get form occurrences (verse references) for a word form
 * GET /api/form-occurrences?form={form}&translation={translation}
 */
async function getFormOccurrences(
  env: Env,
  form: string,
  translation: 'afghan2023' | 'yousafzai2019' | null
): Promise<Response> {
  try {
    let query = env.DB.prepare(
      `SELECT pashto_form, verse_refs, frequency FROM form_occurrences WHERE pashto_form = ?`
    ).bind(form);

    if (translation) {
      query = env.DB.prepare(
        `SELECT pashto_form, verse_refs, frequency FROM form_occurrences 
         WHERE pashto_form = ? AND (translation_key = ? OR translation_key IS NULL)`
      ).bind(form, translation);
    }

    const result = await query.first();

    if (!result) {
      return errorResponse('Form not found', 404);
    }

    const verseRefs = typeof result.verse_refs === 'string'
      ? JSON.parse(result.verse_refs)
      : result.verse_refs || [];

    return jsonResponse({
      form: result.pashto_form,
      verse_refs: verseRefs,
      frequency: result.frequency || 0,
      translation: translation || null,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get form occurrences: ${error.message}`, 500);
  }
}

/**
 * Get inflection reasons for a form or base word
 * GET /api/inflection-reasons?form={form}&base_word={base_word}&translation={translation}
 */
async function getInflectionReasons(
  env: Env,
  form: string | null,
  baseWord: string | null,
  translation: 'afghan2023' | 'yousafzai2019' | null
): Promise<Response> {
  try {
    let query: any;

    if (form) {
      query = env.DB.prepare(
        `SELECT * FROM inflection_reasons WHERE pashto_form = ?`
      ).bind(form);

      if (translation) {
        query = env.DB.prepare(
          `SELECT * FROM inflection_reasons 
           WHERE pashto_form = ? AND (translation_key = ? OR translation_key IS NULL)
           ORDER BY frequency DESC`
        ).bind(form, translation);
      }
    } else if (baseWord) {
      query = env.DB.prepare(
        `SELECT * FROM inflection_reasons WHERE base_word = ?`
      ).bind(baseWord);

      if (translation) {
        query = env.DB.prepare(
          `SELECT * FROM inflection_reasons 
           WHERE base_word = ? AND (translation_key = ? OR translation_key IS NULL)
           ORDER BY frequency DESC`
        ).bind(baseWord, translation);
      }
    } else {
      return errorResponse('Must provide form or base_word', 400);
    }

    const result = await query.all();
    const reasons = result.results?.map((r: any) => ({
      pashto_form: r.pashto_form,
      base_word: r.base_word,
      verse_ref: r.verse_ref,
      inflection_type: r.inflection_type,
      is_plural: r.is_plural === 1,
      is_in_sandwich: r.is_in_sandwich === 1,
      sandwich_type: r.sandwich_type,
      is_subject_transitive_past: r.is_subject_transitive_past === 1,
      context_sentence: r.context_sentence,
      word_position: r.word_position,
      translation_key: r.translation_key,
    })) || [];

    // Aggregate reasons by form
    const aggregated: Record<string, {
      form: string;
      base_word: string;
      reasons: {
        plural: number;
        sandwich: number;
        transitive_past: number;
        sandwich_types: string[];
      };
      total_occurrences: number;
    }> = {};

    for (const reason of reasons) {
      if (!aggregated[reason.pashto_form]) {
        aggregated[reason.pashto_form] = {
          form: reason.pashto_form,
          base_word: reason.base_word,
          reasons: {
            plural: 0,
            sandwich: 0,
            transitive_past: 0,
            sandwich_types: [],
          },
          total_occurrences: 0,
        };
      }

      const agg = aggregated[reason.pashto_form];
      agg.total_occurrences++;
      if (reason.is_plural) agg.reasons.plural++;
      if (reason.is_in_sandwich) {
        agg.reasons.sandwich++;
        if (reason.sandwich_type && !agg.reasons.sandwich_types.includes(reason.sandwich_type)) {
          agg.reasons.sandwich_types.push(reason.sandwich_type);
        }
      }
      if (reason.is_subject_transitive_past) agg.reasons.transitive_past++;
    }

    return jsonResponse({
      form: form || null,
      base_word: baseWord || null,
      reasons: Object.values(aggregated),
      total: reasons.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get inflection reasons: ${error.message}`, 500);
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
// Video Processing Functions
// ========================================

/**
 * Process YouTube video: download, transcribe, store in R2/D1
 */
async function processVideo(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { youtubeUrl, videoId, apiKeys, transcript, words, segments, transcription_service, title } = body;

    if (!youtubeUrl || !videoId) {
      return errorResponse('Missing youtubeUrl or videoId', 400);
    }

    console.log(`Processing video ${videoId}...`);

    let finalTranscript: string;
    let finalWords: Array<{ start: number; end: number; text: string }>;
    let finalSegments: Array<{ text: string; startTime: number; endTime: number }>;
    let service = transcription_service || 'elevenlabs';

    // If transcript and segments are already provided (from Next.js API polling), use them
    if (transcript && segments) {
      console.log('Using provided transcript and segments');
      finalTranscript = transcript;
      finalWords = words || [];
      finalSegments = segments;
    } else {
      // Otherwise, return error (transcription should happen in Next.js API)
      return errorResponse('Transcription must be done in Next.js API, then send transcript and segments here', 400);
    }

    // Store metadata in D1
    const metadata = {
      video_id: videoId,
      youtube_url: youtubeUrl,
      transcript: finalTranscript,
      segments: finalSegments,
      transcription_service: service,
      created_at: new Date().toISOString(),
    };

    // Store in D1 (table should already exist, but create if needed)
    try {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS video_transcripts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          video_id TEXT UNIQUE NOT NULL,
          youtube_url TEXT NOT NULL,
          transcript TEXT,
          segments TEXT,
          transcription_service TEXT,
          r2_audio_key TEXT,
          title TEXT,
          created_at TEXT,
          updated_at TEXT
        )
      `).run();

      // Try to add title column if it doesn't exist (SQLite doesn't support IF NOT EXISTS for ALTER TABLE)
      try {
        await env.DB.prepare(`ALTER TABLE video_transcripts ADD COLUMN title TEXT`).run();
      } catch (alterError: any) {
        // Column might already exist, that's okay - ignore duplicate column errors
        if (!alterError.message?.includes('duplicate column') && !alterError.message?.includes('no such column')) {
          console.warn('Warning: Could not add title column:', alterError.message);
        }
      }

      // Ensure segments JSON is properly stringified (don't truncate!)
      const segmentsJson = JSON.stringify(finalSegments);

      // Generate R2 keys for all segments (comma-separated)
      const r2Keys = finalSegments.map((_, index) => `videos/${videoId}/segment_${index + 1}.mp3`).join(',');

      // Check if title column exists, if not we'll handle it gracefully
      const titleValue = title || null;

      await env.DB.prepare(`
        INSERT OR REPLACE INTO video_transcripts 
        (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        videoId,
        youtubeUrl,
        finalTranscript,
        segmentsJson, // Properly stringified JSON - full length
        service,
        r2Keys, // Store R2 keys as comma-separated string
        titleValue,
        metadata.created_at,
        metadata.created_at
      ).run();

      console.log(`✅ Stored ${finalSegments.length} segments in D1`);
      console.log(`✅ Segments JSON length: ${segmentsJson.length} characters`);
    } catch (dbError: any) {
      console.error('D1 database error:', dbError);
      return errorResponse(`Database error: ${dbError.message}`, 500);
    }

    // Extract words from transcript and add to word_frequencies
    try {
      console.log(`📝 Extracting words from transcript...`);
      await extractWordsFromVideoTranscript(env, videoId, finalTranscript);
      console.log(`✅ Words extracted and added to word_frequencies`);
    } catch (wordError: any) {
      console.warn(`⚠️ Word extraction failed (non-critical): ${wordError.message}`);
      // Don't fail the whole request if word extraction fails
    }

    // Generate audio clips metadata
    const audioClips = finalSegments.map((segment, index) => ({
      segment_number: index + 1,
      text: segment.text,
      start_time: segment.startTime,
      end_time: segment.endTime,
      duration: segment.endTime - segment.startTime,
      r2_key: `videos/${videoId}/segment_${index + 1}.mp3`,
    }));

    return jsonResponse({
      success: true,
      videoId,
      transcript: finalTranscript,
      segments: finalSegments,
      audioClips: audioClips,
      r2Keys: audioClips.map(clip => clip.r2_key),
      message: `Processed ${finalSegments.length} segments`,
    });

  } catch (error: any) {
    console.error('Video processing error:', error);
    return errorResponse(`Video processing failed: ${error.message}`, 500);
  }
}

/**
 * List all processed videos
 */
async function listVideos(env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM video_transcripts ORDER BY created_at DESC LIMIT 100`
    ).all();

    const videos = result.results?.map((video: any) => {
      // Parse segments JSON properly
      let segments: any[] = [];
      try {
        if (video.segments) {
          if (typeof video.segments === 'string') {
            segments = JSON.parse(video.segments);
          } else {
            segments = video.segments;
          }
        }
      } catch (e) {
        console.error('Failed to parse segments:', e);
        segments = [];
      }

      return {
        video_id: video.video_id,
        youtube_url: video.youtube_url,
        transcript: video.transcript,
        segments: segments,
        transcription_service: video.transcription_service,
        r2_audio_key: video.r2_audio_key,
        title: video.title || null,
        created_at: video.created_at,
        updated_at: video.updated_at,
      };
    }) || [];

    return jsonResponse({ videos, count: videos.length });
  } catch (error: any) {
    return errorResponse(`Failed to list videos: ${error.message}`, 500);
  }
}

/**
 * Delete video from D1 and R2
 * DELETE /api/video/:videoId
 */
async function deleteVideo(env: Env, videoId: string): Promise<Response> {
  try {
    // First, get the video to find segment count
    const videoResult = await env.DB.prepare(
      `SELECT * FROM video_transcripts WHERE video_id = ?`
    ).bind(videoId).first();

    if (!videoResult) {
      return errorResponse('Video not found', 404);
    }

    // Delete R2 audio files
    const r2Keys = videoResult.r2_audio_key ? videoResult.r2_audio_key.split(',') : [];
    let deletedCount = 0;
    let failedCount = 0;

    for (const r2Key of r2Keys) {
      try {
        const key = r2Key.trim();
        if (!key) continue;

        // Try multiple possible paths
        const possiblePaths = [
          key,
          `pashto-bible-audio/${key}`,
          key.toLowerCase(),
          `pashto-bible-audio/${key.toLowerCase()}`,
        ];

        let deleted = false;
        for (const path of possiblePaths) {
          const object = await env.AUDIO_BUCKET.get(path);
          if (object !== null) {
            await env.AUDIO_BUCKET.delete(path);
            deleted = true;
            deletedCount++;
            break;
          }
        }

        if (!deleted) {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.warn(`Failed to delete R2 key ${r2Key}:`, error);
      }
    }

    // Delete video_word_mappings and update frequency_video
    // First, get all words affected by this video
    const videoWordsResult = await env.DB.prepare(
      `SELECT pashto_word, frequency FROM video_word_mappings WHERE video_id = ?`
    ).bind(videoId).all();

    const affectedWords: string[] = [];
    if (videoWordsResult.results && videoWordsResult.results.length > 0) {
      // Decrement frequency_video for each word
      for (const mapping of videoWordsResult.results as any[]) {
        affectedWords.push(mapping.pashto_word);

        await env.DB.prepare(`
          UPDATE word_frequencies 
          SET frequency_video = MAX(0, COALESCE(frequency_video, 0) - ?),
              frequency_total = MAX(0, COALESCE(frequency_total, 0) - ?)
          WHERE pashto_word = ?
        `).bind(mapping.frequency, mapping.frequency, mapping.pashto_word).run().catch((err) => {
          console.warn(`Failed to update frequency_video for ${mapping.pashto_word}: ${err.message}`);
        });
      }

      // Recalculate frequency_total for affected words (safety check)
      if (affectedWords.length > 0) {
        const placeholders = affectedWords.map(() => '?').join(',');
        await env.DB.prepare(`
          UPDATE word_frequencies
          SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                                COALESCE(frequency_afghan2023_nt, 0) + 
                                COALESCE(frequency_yousafzai2019_ot, 0) + 
                                COALESCE(frequency_yousafzai2019_nt, 0) + 
                                COALESCE(frequency_video, 0)
          WHERE pashto_word IN (${placeholders})
        `).bind(...affectedWords).run().catch((err) => {
          console.warn(`Failed to recalculate frequency_total: ${err.message}`);
        });
      }
    }

    // Delete video_word_mappings entries
    await env.DB.prepare(`DELETE FROM video_word_mappings WHERE video_id = ?`)
      .bind(videoId)
      .run();

    // Delete video_transcripts entry
    await env.DB.prepare(`DELETE FROM video_transcripts WHERE video_id = ?`)
      .bind(videoId)
      .run();

    return jsonResponse({
      success: true,
      videoId,
      deletedFromD1: true,
      r2FilesDeleted: deletedCount,
      r2FilesFailed: failedCount,
      message: `Video ${videoId} deleted. ${deletedCount} R2 files deleted.`,
    });
  } catch (error: any) {
    console.error(`Error deleting video: ${error.message}`, error);
    return errorResponse(`Failed to delete video: ${error.message}`, 500);
  }
}

/**
 * Delete R2 object
 * POST /api/r2/delete
 */
async function deleteR2Object(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return errorResponse('Missing key', 400);
    }

    // Try multiple possible paths
    const possiblePaths = [
      key,
      `pashto-bible-audio/${key}`,
      key.toLowerCase(),
      `pashto-bible-audio/${key.toLowerCase()}`,
    ];

    for (const path of possiblePaths) {
      const object = await env.AUDIO_BUCKET.get(path);
      if (object !== null) {
        await env.AUDIO_BUCKET.delete(path);
        return jsonResponse({ success: true, key: path, deleted: true });
      }
    }

    return errorResponse(`Object not found: ${key}`, 404);
  } catch (error: any) {
    return errorResponse(`Failed to delete R2 object: ${error.message}`, 500);
  }
}

/**
 * Get full video audio stream from R2 (for waveform visualization)
 * GET /api/video/:videoId/audio-full
 */
async function getVideoAudioFull(env: Env, videoId: string, request: Request): Promise<Response> {
  try {
    // Try multiple possible paths for full audio
    // Note: R2 bucket name is NOT part of the key path
    const possiblePaths = [
      `videos/${videoId}/full.mp3`,  // Standard path
      `videos/${videoId}/audio.mp3`,
      `videos/${videoId.toLowerCase()}/full.mp3`,  // Lowercase video ID
    ];

    console.log(`Requesting full audio for video ${videoId}`);

    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);

        if (object !== null) {
          console.log(`✅ Found full audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }

    // If full audio not found, try to concatenate segments or return error
    console.warn(`⚠️ Full audio not found for video ${videoId}`);
    console.warn(`Tried paths: ${possiblePaths.join(', ')}`);
    return errorResponse(`Full audio file not found for video ${videoId}. Tried: ${possiblePaths.join(', ')}`, 404);
  } catch (error: any) {
    console.error(`Error getting full video audio: ${error.message}`, error);
    return errorResponse(`Failed to get full video audio: ${error.message}`, 500);
  }
}

/**
 * Get video audio stream from R2
 */
async function getVideoAudio(env: Env, videoId: string, segment: number, request: Request): Promise<Response> {
  try {
    // Try multiple possible paths - the bucket name might be included in the path
    const possiblePaths = [
      `videos/${videoId}/segment_${segment}.mp3`,  // Standard path
      `pashto-bible-audio/videos/${videoId}/segment_${segment}.mp3`,  // With bucket prefix
      `videos/${videoId.toLowerCase()}/segment_${segment}.mp3`,  // Lowercase video ID
      `pashto-bible-audio/videos/${videoId.toLowerCase()}/segment_${segment}.mp3`,  // Lowercase with prefix
    ];

    console.log(`Requesting audio for video ${videoId}, segment ${segment}`);

    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);

        // Check if object exists (get() returns null if not found)
        if (object !== null) {
          console.log(`✅ Found audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        // Continue to next path
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }

    // None of the paths worked
    console.error(`❌ Audio file not found for video ${videoId}, segment ${segment}`);
    console.error(`Tried paths: ${possiblePaths.join(', ')}`);
    return errorResponse(`Audio file not found for segment ${segment}. Tried paths: ${possiblePaths.join(', ')}`, 404);
  } catch (error: any) {
    console.error(`Error getting video audio: ${error.message}`, error);
    return errorResponse(`Failed to get video audio: ${error.message}`, 500);
  }
}

// ========================================
// Topics API Routes
// ========================================

/**
 * Get all word categories with verse counts
 * GET /api/topics/categories
 */
async function getTopicsCategories(env: Env): Promise<Response> {
  try {
    // Get all categories with verse counts
    const result = await env.DB.prepare(
      `SELECT 
        wc.category_key,
        wc.category_name,
        wc.description,
        wc.parent_category,
        COUNT(DISTINCT cvm.verse_ref) as verse_count,
        COUNT(DISTINCT cvm.pashto_word) as word_count
      FROM word_categories wc
      LEFT JOIN category_verse_mappings cvm ON wc.category_key = cvm.category_key
      GROUP BY wc.category_key, wc.category_name, wc.description, wc.parent_category
      HAVING verse_count > 0
      ORDER BY verse_count DESC, wc.category_name ASC`
    ).all();

    const categories = result.results?.map((cat: any) => ({
      category_key: cat.category_key,
      category_name: cat.category_name || cat.category_key.split('_').map((w: string) =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' '),
      description: cat.description,
      parent_category: cat.parent_category,
      verse_count: cat.verse_count || 0,
      word_count: cat.word_count || 0,
    })) || [];

    return jsonResponse({ categories, count: categories.length });
  } catch (error: any) {
    return errorResponse(`Failed to get categories: ${error.message}`, 500);
  }
}

/**
 * Get verses for a specific category
 * GET /api/topics/verses?category={category_key}&limit={limit}
 */
async function getTopicsVerses(
  env: Env,
  categoryKey: string,
  limit: number = 200,
  request?: Request
): Promise<Response> {
  try {
    if (!categoryKey) {
      return errorResponse('Missing category parameter', 400);
    }

    // Get verses for the category, joining with verse tables to get text and audio,
    // and word_frequencies to get English translation and romanization
    const result = await env.DB.prepare(
      `SELECT DISTINCT
        cvm.verse_ref,
        cvm.book,
        cvm.chapter,
        cvm.verse,
        cvm.pashto_word,
        cvm.translation_key,
        cvm.testament,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.text
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.text
          ELSE NULL
        END as text,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.audio_r2_key
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.audio_r2_key
          ELSE NULL
        END as audio_r2_key,
        CASE 
          WHEN cvm.translation_key = 'afghan2023' THEN v_afghan.audio_public_url
          WHEN cvm.translation_key = 'yousafzai2019' THEN v_yousafzai.audio_public_url
          ELSE NULL
        END as audio_public_url,
        wf.english_translation,
        wf.romanization
      FROM category_verse_mappings cvm
      LEFT JOIN verses_afghan2023 v_afghan ON 
        cvm.translation_key = 'afghan2023' AND 
        cvm.book = v_afghan.book AND 
        cvm.chapter = v_afghan.chapter AND 
        cvm.verse = v_afghan.verse
      LEFT JOIN verses_yousafzai v_yousafzai ON 
        cvm.translation_key = 'yousafzai2019' AND 
        cvm.book = v_yousafzai.book AND 
        cvm.chapter = v_yousafzai.chapter AND 
        cvm.verse = v_yousafzai.verse
      LEFT JOIN word_frequencies wf ON 
        cvm.pashto_word = wf.pashto_word
      WHERE cvm.category_key = ?
      ORDER BY cvm.book, cvm.chapter, cvm.verse
      LIMIT ?`
    )
      .bind(categoryKey, limit)
      .all();

    // Build base URL for audio streaming
    const baseUrl = request
      ? new URL(request.url).origin
      : 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

    const verses = result.results?.map((verse: any) => {
      // Build audio URL from R2 key if available
      let audioUrl = verse.audio_public_url || null;
      if (!audioUrl && verse.audio_r2_key) {
        // Use the worker's audio streaming endpoint
        audioUrl = `${baseUrl}/api/audio/stream/${encodeURIComponent(verse.audio_r2_key)}`;
      }

      return {
        verse_ref: verse.verse_ref,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        pashto_word: verse.pashto_word,
        english_translation: verse.english_translation || null,
        romanization: verse.romanization || null,
        translation_key: verse.translation_key,
        testament: verse.testament,
        text: verse.text || null,
        audio_r2_key: verse.audio_r2_key || null,
        audio_url: audioUrl,
      };
    }) || [];

    return jsonResponse({
      category: categoryKey,
      verses,
      count: verses.length,
    });
  } catch (error: any) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
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

    if (path === '/api/verb-forms' && request.method === 'GET') {
      const lemma = url.searchParams.get('lemma');
      const cap = parseInt(url.searchParams.get('cap') || '200', 10);

      if (!lemma) {
        return errorResponse('Missing lemma parameter', 400);
      }
      return getVerbForms(env, decodeURIComponent(lemma), cap);
    }

    if (path === '/api/verb-lexicon' && request.method === 'GET') {
      const lemma = url.searchParams.get('lemma');

      if (!lemma) {
        return errorResponse('Missing lemma parameter', 400);
      }
      return getVerbLexicon(env, decodeURIComponent(lemma));
    }

    if (path === '/api/form-occurrences' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      const translation = url.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019' | null;

      if (!form) {
        return errorResponse('Missing form parameter', 400);
      }
      return getFormOccurrences(env, form, translation);
    }

    if (path === '/api/inflection-reasons' && request.method === 'GET') {
      const form = url.searchParams.get('form');
      const baseWord = url.searchParams.get('base_word');
      const translation = url.searchParams.get('translation') as 'afghan2023' | 'yousafzai2019' | null;

      if (!form && !baseWord) {
        return errorResponse('Missing form or base_word parameter', 400);
      }
      return getInflectionReasons(env, form || null, baseWord || null, translation);
    }

    if (path === '/api/related-forms' && request.method === 'GET') {
      const query = url.searchParams.get('query');
      if (!query) {
        return errorResponse('Missing query parameter', 400);
      }
      return getRelatedForms(env, query);
    }

    // Topics API routes
    if (path === '/api/topics/categories' && request.method === 'GET') {
      return getTopicsCategories(env);
    }

    if (path === '/api/topics/verses' && request.method === 'GET') {
      const category = url.searchParams.get('category');
      const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get('limit') || '200')));

      if (!category) {
        return errorResponse('Missing category parameter', 400);
      }
      return getTopicsVerses(env, category, limit, request);
    }

    // Video processing routes
    if (path === '/api/video/process' && request.method === 'POST') {
      return processVideo(env, request);
    }

    if (path === '/api/video/list' && request.method === 'GET') {
      return listVideos(env);
    }

    // Get full video audio endpoint
    if (path.startsWith('/api/video/') && path.endsWith('/audio-full') && request.method === 'GET') {
      // Path format: /api/video/{videoId}/audio-full
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 2];

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return getVideoAudioFull(env, videoId, request);
    }

    // Get video audio endpoint
    if (path.startsWith('/api/video/') && path.endsWith('/audio') && request.method === 'GET') {
      // Path format: /api/video/{videoId}/audio?segment={segmentNumber}
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 2];
      const segment = parseInt(url.searchParams.get('segment') || '1');

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return getVideoAudio(env, videoId, segment, request);
    }

    // Delete video endpoint
    if (path.startsWith('/api/video/') && !path.endsWith('/audio') && request.method === 'DELETE') {
      // Path format: /api/video/{videoId}
      const pathParts = path.split('/');
      const videoId = pathParts[pathParts.length - 1];

      if (!videoId) {
        return errorResponse('Missing video ID', 400);
      }
      return deleteVideo(env, videoId);
    }

    // R2 upload endpoint
    if (path === '/api/r2/upload' && request.method === 'POST') {
      return uploadToR2(env, request);
    }

    // R2 delete endpoint
    if (path === '/api/r2/delete' && request.method === 'POST') {
      return deleteR2Object(env, request);
    }

    // R2 list endpoint (for debugging - check what files exist)
    if (path === '/api/r2/list' && request.method === 'GET') {
      const prefix = url.searchParams.get('prefix') || '';
      try {
        const objects: any[] = [];
        let cursor: string | undefined;

        do {
          const listResult = await env.AUDIO_BUCKET.list({
            prefix,
            limit: 1000,
            cursor,
          });

          if (listResult.objects) {
            objects.push(...listResult.objects.map((obj: any) => ({
              key: obj.key,
              size: obj.size,
              uploaded: obj.uploaded,
            })));
          }

          cursor = listResult.cursor;
        } while (cursor);

        return jsonResponse({
          prefix,
          count: objects.length,
          objects: objects.slice(0, 100), // Limit to first 100 for response size
        });
      } catch (error: any) {
        return errorResponse(`Failed to list R2 objects: ${error.message}`, 500);
      }
    }

    // Generic D1 query endpoint for lexicon and other queries
    if (path === '/api/d1/query' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { sql } = body;

        if (!sql || typeof sql !== 'string') {
          return errorResponse('Missing or invalid SQL query', 400);
        }

        // Security: Only allow SELECT queries
        const sqlUpper = sql.trim().toUpperCase();
        if (!sqlUpper.startsWith('SELECT')) {
          return errorResponse('Only SELECT queries are allowed', 400);
        }

        // Execute query
        const result = await env.DB.prepare(sql).all();

        return jsonResponse({
          success: true,
          results: result.results || [],
          meta: result.meta || {},
        });
      } catch (error: any) {
        return errorResponse(`Query failed: ${error.message}`, 500);
      }
    }

    return errorResponse('Not found', 404);
  },
};




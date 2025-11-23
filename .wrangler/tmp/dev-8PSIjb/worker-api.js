var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// cloudflare/update-audio-urls.ts
async function updateAudioUrls(env) {
  const publicBaseUrl = "https://pub-03f80a5e522e408e9ff0f40c3392140f.r2.dev";
  await env.DB.prepare(`
    UPDATE verses_afghan2023
    SET audio_public_url = ? || '/' || audio_r2_key
    WHERE audio_r2_key IS NOT NULL AND audio_public_url IS NULL
  `).bind(publicBaseUrl).run();
  await env.DB.prepare(`
    UPDATE verses_yousafzai
    SET audio_public_url = ? || '/' || audio_r2_key
    WHERE audio_r2_key IS NOT NULL AND audio_public_url IS NULL
  `).bind(publicBaseUrl).run();
  return { success: true };
}
__name(updateAudioUrls, "updateAudioUrls");

// cloudflare/worker-api.ts
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}
__name(errorResponse, "errorResponse");
function parseJsonSafe(jsonString, defaultValue) {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}
__name(parseJsonSafe, "parseJsonSafe");
function extractPashtoWords(text) {
  const words = text.match(/[\u0600-\u06FF]+/g) || [];
  return words.map((w) => w.trim()).filter((w) => w.length > 0);
}
__name(extractPashtoWords, "extractPashtoWords");
function cleanWord(word) {
  return word.replace(/[.,!?؟،[\](){}«»]/g, "").trim();
}
__name(cleanWord, "cleanWord");
function inferVerbRootFromForm(form) {
  let prefix = null;
  let stem = form;
  if (form.startsWith("\u0628\u0647")) {
    prefix = "\u0628\u0647";
    stem = form.slice(2);
  } else if (form.startsWith("\u062A\u0631")) {
    prefix = "\u062A\u0631";
    stem = form.slice(2);
  } else if (form.startsWith("\u0648")) {
    prefix = "\u0648";
    stem = form.slice(1);
  }
  const isPerfective = prefix === "\u0648";
  let isTransitive = false;
  let confidence = "low";
  let root = null;
  const verbEndings = ["\u0645", "\u06D0", "\u064A", "\u0648", "\u0626", "\u0647", "\u0644"];
  let foundEnding = false;
  for (const ending of verbEndings) {
    if (stem.endsWith(ending) && stem.length > ending.length + 1) {
      const potentialStem = stem.slice(0, -ending.length);
      if (potentialStem.length >= 2) {
        stem = potentialStem;
        foundEnding = true;
        confidence = prefix ? "high" : "medium";
        break;
      }
    }
  }
  if (stem.endsWith("\u0648\u0644")) {
    root = stem;
    isTransitive = true;
    confidence = "high";
  } else if (stem.endsWith("\u06D0\u062F\u0644") || stem.endsWith("\u06CC\u062F\u0644")) {
    root = stem;
    isTransitive = false;
    confidence = "high";
  } else if (stem.endsWith("\u06A9\u0648\u0644")) {
    root = stem;
    isTransitive = true;
    confidence = "high";
  } else if (stem.endsWith("\u06A9\u06D0\u062F\u0644")) {
    root = stem;
    isTransitive = false;
    confidence = "high";
  } else if (foundEnding || prefix) {
    if (stem.length >= 3) {
      root = stem + "\u0648\u0644";
      isTransitive = true;
      confidence = prefix ? "high" : "medium";
    } else {
      root = stem;
      confidence = prefix ? "medium" : "low";
    }
  }
  if (!root && !prefix && !foundEnding) {
    return {
      root: null,
      isTransitive: false,
      isPerfective: false,
      confidence: "low"
    };
  }
  return {
    root: root || stem || form,
    isTransitive,
    isPerfective,
    confidence
  };
}
__name(inferVerbRootFromForm, "inferVerbRootFromForm");
async function extractWordsFromVideoTranscript(env, videoId, transcript) {
  const words = extractPashtoWords(transcript);
  const wordCounts = /* @__PURE__ */ new Map();
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
  `).run().catch(() => {
  });
  await env.DB.prepare(`
    CREATE INDEX IF NOT EXISTS idx_video_word_word ON video_word_mappings(pashto_word)
  `).run().catch(() => {
  });
  const allWords = Array.from(wordCounts.keys());
  const wordMetadata = /* @__PURE__ */ new Map();
  const batchSize = 100;
  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);
    const placeholders = batch.map(() => "?").join(",");
    try {
      const dictResults = await env.DB.prepare(`
        SELECT pashto_word, pos, word_type, inflection_type, compound_type,
               base_form, romanization, english_translation
        FROM word_frequencies
        WHERE pashto_word IN (${placeholders})
      `).bind(...batch).all();
      for (const row of dictResults.results || []) {
        wordMetadata.set(row.pashto_word, row);
      }
      const notFound = batch.filter((w) => !wordMetadata.has(w));
      if (notFound.length > 0) {
        const inferredRoots = /* @__PURE__ */ new Map();
        for (const form of notFound) {
          const analysis = inferVerbRootFromForm(form);
          const possibleRoots = [];
          if (analysis.root && analysis.confidence !== "low" && analysis.root !== form) {
            possibleRoots.push(analysis.root);
            if (analysis.root.endsWith("\u0648\u0644") && analysis.root.length > 2) {
              const withoutOl = analysis.root.slice(0, -2);
              if (withoutOl.length >= 3) {
                possibleRoots.push(withoutOl + "\u0644");
              }
            }
            if (form.startsWith("\u0648")) {
              const stem = form.slice(1);
              const cleanStem = stem.replace(/[مېيوئه]$/, "");
              if (cleanStem.length >= 3 && cleanStem !== form) {
                possibleRoots.push(cleanStem);
                if (!cleanStem.endsWith("\u0644")) {
                  possibleRoots.push(cleanStem + "\u0644");
                }
              }
            }
          }
          if (possibleRoots.length > 0) {
            inferredRoots.set(form, [...new Set(possibleRoots)]);
          }
        }
        if (inferredRoots.size > 0) {
          const allRoots = /* @__PURE__ */ new Set();
          for (const roots of inferredRoots.values()) {
            roots.forEach((r) => allRoots.add(r));
          }
          const rootsToLookup = Array.from(allRoots);
          const rootPlaceholders = rootsToLookup.map(() => "?").join(",");
          const rootResults = await env.DB.prepare(`
            SELECT pashto_word, pos, word_type, inflection_type, compound_type,
                   base_form, romanization, english_translation
            FROM word_frequencies
            WHERE pashto_word IN (${rootPlaceholders})
          `).bind(...rootsToLookup).all();
          const rootMap = /* @__PURE__ */ new Map();
          for (const row of rootResults.results || []) {
            rootMap.set(row.pashto_word, row);
          }
          for (const [form, roots] of inferredRoots.entries()) {
            for (const root of roots) {
              const rootData = rootMap.get(root);
              if (rootData) {
                wordMetadata.set(form, {
                  ...rootData,
                  base_form: root
                  // The inferred root is the base form
                });
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn(`   Failed to fetch metadata for batch: ${error}`);
    }
  }
  let processed = 0;
  for (let i = 0; i < allWords.length; i += batchSize) {
    const batch = allWords.slice(i, i + batchSize);
    for (const word of batch) {
      const count = wordCounts.get(word) || 0;
      const metadata = wordMetadata.get(word);
      try {
        const audioKey = `videos/${videoId}/full.mp3`;
        if (metadata) {
          await env.DB.prepare(`
            UPDATE word_frequencies
            SET 
              frequency_total = frequency_total + ?,
              updated_at = strftime('%s', 'now')
            WHERE pashto_word = ?
          `).bind(count, word).run();
        } else {
          let inferredPos = null;
          let inferredWordType = null;
          let inferredInflectionType = null;
          let inferredBaseForm = null;
          if (word.match(/^(و|به|تر)/) || word.match(/(ول|ېدل|یدل|کول|کېدل)$/) || word.match(/(م|ې|ي|و|ئ)$/)) {
            const verbAnalysis = inferVerbRootFromForm(word);
            if (verbAnalysis.root && verbAnalysis.confidence !== "low") {
              inferredPos = verbAnalysis.isTransitive ? "v. trans." : "v. intrans.";
              inferredWordType = "verb";
              inferredInflectionType = verbAnalysis.isPerfective ? "perfective_past" : word.startsWith("\u0628\u0647") ? "future_subjunctive" : "imperfective_present";
              inferredBaseForm = verbAnalysis.root;
            }
          }
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
            word,
            count,
            inferredPos,
            inferredWordType,
            inferredInflectionType,
            inferredBaseForm,
            count,
            inferredPos,
            inferredWordType,
            inferredInflectionType,
            inferredBaseForm
          ).run();
        }
        await env.DB.prepare(`
          INSERT OR REPLACE INTO video_word_mappings 
          (video_id, pashto_word, frequency, audio_r2_key, updated_at)
          VALUES (?, ?, ?, ?, strftime('%s', 'now'))
        `).bind(videoId, word, count, audioKey).run();
        processed++;
      } catch (error) {
        console.warn(`   Failed to process word "${word}": ${error.message}`);
      }
    }
  }
  if (processed > 0) {
    const affectedWords = Array.from(wordCounts.keys());
    const placeholders = affectedWords.map(() => "?").join(",");
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
  if (processed > 0) {
    await env.DB.prepare(`
      UPDATE word_frequencies
      SET frequency_rank = (
        SELECT COUNT(*) + 1
        FROM word_frequencies wf2
        WHERE wf2.frequency_total > word_frequencies.frequency_total
      )
    `).run().catch(() => {
    });
  }
  console.log(`   Processed ${processed} unique words from video ${videoId}`);
}
__name(extractWordsFromVideoTranscript, "extractWordsFromVideoTranscript");
async function searchVerses(env, query, options = {}) {
  const { translation = "afghan2023", testament, limit = 100 } = options;
  const table = translation === "yousafzai2019" ? "verses_yousafzai" : "verses_afghan2023";
  try {
    let sql = `SELECT * FROM ${table} WHERE text LIKE ?`;
    const params = [`%${query}%`];
    if (testament) {
      sql += ` AND testament = ?`;
      params.push(testament);
    }
    sql += ` ORDER BY book, chapter, verse LIMIT ?`;
    params.push(limit);
    const result = await env.DB.prepare(sql).bind(...params).all();
    const verses = result.results?.map((verse) => ({
      ...verse,
      created_at: verse.created_at ? new Date(verse.created_at * 1e3).toISOString() : null,
      updated_at: verse.updated_at ? new Date(verse.updated_at * 1e3).toISOString() : null,
      tags: verse.tags ? parseJsonSafe(verse.tags, []) : []
    })) || [];
    return jsonResponse({ verses, count: verses.length });
  } catch (error) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}
__name(searchVerses, "searchVerses");
function generateR2AudioKey(book, chapter, verse, translation = "afghan2023") {
  let bookSlug = book.toLowerCase().replace(/\s+/g, "");
  const testament = translation === "afghan2023" ? "nt" : "ot";
  return `${translation}/${testament}/${bookSlug}${chapter}_verse_${String(verse).padStart(3, "0")}.mp3`;
}
__name(generateR2AudioKey, "generateR2AudioKey");
async function getVersesByChapter(env, book, chapter, translation = "afghan2023") {
  const table = translation === "yousafzai2019" ? "verses_yousafzai" : "verses_afghan2023";
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM ${table} WHERE book = ? AND chapter = ? ORDER BY verse`
    ).bind(book, chapter).all();
    const workerUrl = "https://pashtobiblesearch.jeremy-samuels17.workers.dev";
    const verses = result.results?.map((verse) => {
      let audioPublicUrl = null;
      let audioR2Key = verse.audio_r2_key || null;
      if (!audioR2Key) {
        const generatedKey = generateR2AudioKey(verse.book, verse.chapter, verse.verse, translation);
        audioR2Key = generatedKey;
      }
      if (audioR2Key) {
        audioPublicUrl = `${workerUrl}/api/audio/stream/${encodeURIComponent(audioR2Key)}`;
      }
      return {
        ref: `${verse.book} ${verse.chapter}:${verse.verse}`,
        book: verse.book,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        testament: verse.testament,
        dialect: translation === "yousafzai2019" ? "yousafzai" : "afghan",
        audio_public_url: audioPublicUrl,
        audio_r2_key: audioR2Key,
        created_at: verse.created_at ? new Date(verse.created_at * 1e3).toISOString() : null,
        updated_at: verse.updated_at ? new Date(verse.updated_at * 1e3).toISOString() : null,
        tags: verse.tags ? parseJsonSafe(verse.tags, []) : []
      };
    }) || [];
    return jsonResponse({ book, chapter, translation, verses, count: verses.length });
  } catch (error) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
  }
}
__name(getVersesByChapter, "getVersesByChapter");
async function getVerseByRef(env, ref, translation = "afghan2023") {
  const table = translation === "yousafzai2019" ? "verses_yousafzai" : "verses_afghan2023";
  try {
    const result = await env.DB.prepare(`SELECT * FROM ${table} WHERE ref = ?`).bind(ref).first();
    if (!result) {
      return errorResponse("Verse not found", 404);
    }
    const verse = {
      ...result,
      created_at: result.created_at ? new Date(result.created_at * 1e3).toISOString() : null,
      updated_at: result.updated_at ? new Date(result.updated_at * 1e3).toISOString() : null,
      tags: result.tags ? parseJsonSafe(result.tags, []) : []
    };
    return jsonResponse({ verse });
  } catch (error) {
    return errorResponse(`Failed to get verse: ${error.message}`, 500);
  }
}
__name(getVerseByRef, "getVerseByRef");
async function searchWordOccurrences(env, word, translation = "afghan2023", limit = 100) {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM word_occurrence_index WHERE word = ? AND translation_key = ? ORDER BY frequency DESC LIMIT ?`
    ).bind(word, translation, limit).all();
    const occurrences = result.results?.map((occ) => ({
      ...occ,
      verse_refs: parseJsonSafe(occ.verse_refs, []),
      tf_idf_scores: parseJsonSafe(occ.tf_idf_scores, []),
      created_at: occ.created_at ? new Date(occ.created_at * 1e3).toISOString() : null,
      updated_at: occ.updated_at ? new Date(occ.updated_at * 1e3).toISOString() : null
    })) || [];
    return jsonResponse({ occurrences, count: occurrences.length });
  } catch (error) {
    return errorResponse(`Search failed: ${error.message}`, 500);
  }
}
__name(searchWordOccurrences, "searchWordOccurrences");
async function getAudioUrl(env, r2Key) {
  try {
    const object = await env.AUDIO_BUCKET.get(r2Key);
    if (!object) {
      return errorResponse("Audio file not found", 404);
    }
    const publicUrl = `https://pub-${env.AUDIO_BUCKET.accountId}.r2.dev/${r2Key}`;
    return jsonResponse({
      url: publicUrl,
      contentType: object.httpMetadata?.contentType || "audio/mpeg",
      size: object.size
    });
  } catch (error) {
    return errorResponse(`Failed to get audio URL: ${error.message}`, 500);
  }
}
__name(getAudioUrl, "getAudioUrl");
async function streamAudio(env, r2Key, request) {
  try {
    const object = await env.AUDIO_BUCKET.get(r2Key);
    if (object) {
      const range = request.headers.get("Range");
      if (range && object.range) {
        const match = range.match(/bytes=(\d+)-(\d*)/);
        if (match) {
          const start = parseInt(match[1]);
          const end = match[2] ? parseInt(match[2]) : object.size - 1;
          const rangeObject = await env.AUDIO_BUCKET.get(r2Key, {
            range: { offset: start, length: end - start + 1 }
          });
          if (rangeObject) {
            return new Response(rangeObject.body, {
              status: 206,
              headers: {
                "Content-Type": object.httpMetadata?.contentType || "audio/mpeg",
                "Content-Range": `bytes ${start}-${end}/${object.size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": (end - start + 1).toString(),
                "Access-Control-Allow-Origin": "*"
              }
            });
          }
        }
      }
      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "audio/mpeg",
          "Content-Length": object.size.toString(),
          "Accept-Ranges": "bytes",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=31536000"
        }
      });
    }
  } catch (error) {
    console.warn(`Worker binding failed for ${r2Key}:`, error);
  }
  return errorResponse("Audio streaming requires bucket access policy configuration. Worker can list files but not retrieve them due to R2 access restrictions.", 503);
}
__name(streamAudio, "streamAudio");
async function uploadToR2(env, request) {
  try {
    const body = await request.json();
    const { key, data } = body;
    if (!key || !data) {
      return errorResponse("Missing key or data", 400);
    }
    const buffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    console.log(`Uploading to R2: key=${key}, size=${buffer.length} bytes`);
    await env.AUDIO_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType: "audio/mpeg"
      }
    });
    const verify = await env.AUDIO_BUCKET.get(key);
    if (verify === null) {
      console.error(`\u274C Upload verification failed: file not found after upload`);
      return errorResponse("Upload verification failed", 500);
    }
    console.log(`\u2705 Successfully uploaded and verified: ${key} (${verify.size} bytes)`);
    return jsonResponse({ success: true, key, size: buffer.length });
  } catch (error) {
    console.error(`Upload error: ${error.message}`, error);
    return errorResponse(`Failed to upload to R2: ${error.message}`, 500);
  }
}
__name(uploadToR2, "uploadToR2");
async function getInflections(env, baseWord) {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    ).bind(baseWord).all();
    const inflections = result.results?.map((inf) => ({
      id: inf.id,
      base_word: inf.base_word,
      inflected_form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency,
      examples: parseJsonSafe(inf.examples, []),
      created_at: inf.created_at ? new Date(inf.created_at * 1e3).toISOString() : null,
      updated_at: inf.updated_at ? new Date(inf.updated_at * 1e3).toISOString() : null
    })) || [];
    return jsonResponse({ inflections, count: inflections.length });
  } catch (error) {
    return errorResponse(`Failed to get inflections: ${error.message}`, 500);
  }
}
__name(getInflections, "getInflections");
async function getInflectionBase(env, form) {
  try {
    const rootResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    ).bind(form).first();
    if (rootResult) {
      return jsonResponse({ base_word: rootResult.root_word, form, source: "form_to_root" });
    }
    const inflectionResult = await env.DB.prepare(
      `SELECT base_word FROM inflections WHERE inflected_form = ? ORDER BY frequency DESC LIMIT 1`
    ).bind(form).first();
    if (inflectionResult) {
      return jsonResponse({ base_word: inflectionResult.base_word, form, source: "inflections" });
    }
    return errorResponse("Base word not found", 404);
  } catch (error) {
    return errorResponse(`Failed to get base word: ${error.message}`, 500);
  }
}
__name(getInflectionBase, "getInflectionBase");
async function getVerbData(env, root) {
  try {
    let result = await env.DB.prepare(
      `SELECT * FROM irregular_verbs WHERE verb_root = ? LIMIT 1`
    ).bind(root).first();
    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1e3).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1e3).toISOString() : null
        },
        type: "irregular"
      });
    }
    result = await env.DB.prepare(
      `SELECT * FROM verbs_lexicon WHERE verb_root = ? LIMIT 1`
    ).bind(root).first();
    if (result) {
      return jsonResponse({
        verb: {
          ...result,
          stems: parseJsonSafe(result.stems, null),
          roots: parseJsonSafe(result.roots, null),
          romanization: parseJsonSafe(result.romanization, null),
          examples: parseJsonSafe(result.examples, []),
          created_at: result.created_at ? new Date(result.created_at * 1e3).toISOString() : null,
          updated_at: result.updated_at ? new Date(result.updated_at * 1e3).toISOString() : null
        },
        type: "regular"
      });
    }
    return errorResponse("Verb not found", 404);
  } catch (error) {
    return errorResponse(`Failed to get verb data: ${error.message}`, 500);
  }
}
__name(getVerbData, "getVerbData");
async function getNounData(env, word) {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM nouns_lexicon WHERE pashto_word = ? LIMIT 1`
    ).bind(word).first();
    if (!result) {
      return errorResponse("Noun not found", 404);
    }
    return jsonResponse({
      noun: {
        ...result,
        plural_forms: parseJsonSafe(result.plural_forms, null),
        examples: parseJsonSafe(result.examples, []),
        created_at: result.created_at ? new Date(result.created_at * 1e3).toISOString() : null,
        updated_at: result.updated_at ? new Date(result.updated_at * 1e3).toISOString() : null
      }
    });
  } catch (error) {
    return errorResponse(`Failed to get noun data: ${error.message}`, 500);
  }
}
__name(getNounData, "getNounData");
async function getVerbForms(env, lemma, cap = 200) {
  try {
    const result = await env.DB.prepare(
      `SELECT form, tense, person, voice, gender, helper, confidence
       FROM verb_forms
       WHERE lemma = ?
       ORDER BY tense, person
       LIMIT ?`
    ).bind(lemma, cap).all();
    if (!result.results || result.results.length === 0) {
      return jsonResponse({
        lemma,
        forms: [],
        count: 0,
        source: "d1_verified"
      });
    }
    return jsonResponse({
      lemma,
      forms: result.results,
      count: result.results.length,
      source: "d1_verified"
    });
  } catch (error) {
    return errorResponse(`Failed to get verb forms: ${error.message}`, 500);
  }
}
__name(getVerbForms, "getVerbForms");
async function getFormOccurrences(env, form, translation) {
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
      return errorResponse("Form not found", 404);
    }
    const verseRefs = typeof result.verse_refs === "string" ? JSON.parse(result.verse_refs) : result.verse_refs || [];
    return jsonResponse({
      form: result.pashto_form,
      verse_refs: verseRefs,
      frequency: result.frequency || 0,
      translation: translation || null
    });
  } catch (error) {
    return errorResponse(`Failed to get form occurrences: ${error.message}`, 500);
  }
}
__name(getFormOccurrences, "getFormOccurrences");
async function getInflectionReasons(env, form, baseWord, translation) {
  try {
    let query;
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
      return errorResponse("Must provide form or base_word", 400);
    }
    const result = await query.all();
    const reasons = result.results?.map((r) => ({
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
      translation_key: r.translation_key
    })) || [];
    const aggregated = {};
    for (const reason of reasons) {
      if (!aggregated[reason.pashto_form]) {
        aggregated[reason.pashto_form] = {
          form: reason.pashto_form,
          base_word: reason.base_word,
          reasons: {
            plural: 0,
            sandwich: 0,
            transitive_past: 0,
            sandwich_types: []
          },
          total_occurrences: 0
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
      total: reasons.length
    });
  } catch (error) {
    return errorResponse(`Failed to get inflection reasons: ${error.message}`, 500);
  }
}
__name(getInflectionReasons, "getInflectionReasons");
async function getRelatedForms(env, query) {
  try {
    const baseWordResult = await env.DB.prepare(
      `SELECT root_word FROM form_to_root WHERE word_form = ? ORDER BY frequency DESC LIMIT 1`
    ).bind(query).first();
    const baseWord = baseWordResult ? baseWordResult.root_word : query;
    const inflectionsResult = await env.DB.prepare(
      `SELECT * FROM inflections WHERE base_word = ? ORDER BY frequency DESC`
    ).bind(baseWord).all();
    const inflections = inflectionsResult.results?.map((inf) => ({
      form: inf.inflected_form,
      grammatical_info: parseJsonSafe(inf.grammatical_info, {}),
      frequency: inf.frequency
    })) || [];
    return jsonResponse({
      query,
      base_word: baseWord,
      inflections,
      count: inflections.length
    });
  } catch (error) {
    return errorResponse(`Failed to get related forms: ${error.message}`, 500);
  }
}
__name(getRelatedForms, "getRelatedForms");
async function processVideo(env, request) {
  try {
    const body = await request.json();
    const { youtubeUrl, videoId, apiKeys, transcript, words, segments, transcription_service, title } = body;
    if (!youtubeUrl || !videoId) {
      return errorResponse("Missing youtubeUrl or videoId", 400);
    }
    console.log(`Processing video ${videoId}...`);
    let finalTranscript;
    let finalWords;
    let finalSegments;
    let service = transcription_service || "elevenlabs";
    if (transcript && segments) {
      console.log("Using provided transcript and segments");
      finalTranscript = transcript;
      finalWords = words || [];
      finalSegments = segments;
    } else {
      return errorResponse("Transcription must be done in Next.js API, then send transcript and segments here", 400);
    }
    const metadata = {
      video_id: videoId,
      youtube_url: youtubeUrl,
      transcript: finalTranscript,
      segments: finalSegments,
      transcription_service: service,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
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
      try {
        await env.DB.prepare(`ALTER TABLE video_transcripts ADD COLUMN title TEXT`).run();
      } catch (alterError) {
        if (!alterError.message?.includes("duplicate column") && !alterError.message?.includes("no such column")) {
          console.warn("Warning: Could not add title column:", alterError.message);
        }
      }
      const segmentsJson = JSON.stringify(finalSegments);
      const r2Keys = finalSegments.map((_, index) => `videos/${videoId}/segment_${index + 1}.mp3`).join(",");
      const titleValue = title || null;
      await env.DB.prepare(`
        INSERT OR REPLACE INTO video_transcripts 
        (video_id, youtube_url, transcript, segments, transcription_service, r2_audio_key, title, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        videoId,
        youtubeUrl,
        finalTranscript,
        segmentsJson,
        // Properly stringified JSON - full length
        service,
        r2Keys,
        // Store R2 keys as comma-separated string
        titleValue,
        metadata.created_at,
        metadata.created_at
      ).run();
      console.log(`\u2705 Stored ${finalSegments.length} segments in D1`);
      console.log(`\u2705 Segments JSON length: ${segmentsJson.length} characters`);
    } catch (dbError) {
      console.error("D1 database error:", dbError);
      return errorResponse(`Database error: ${dbError.message}`, 500);
    }
    try {
      console.log(`\u{1F4DD} Extracting words from transcript...`);
      await extractWordsFromVideoTranscript(env, videoId, finalTranscript);
      console.log(`\u2705 Words extracted and added to word_frequencies`);
    } catch (wordError) {
      console.warn(`\u26A0\uFE0F Word extraction failed (non-critical): ${wordError.message}`);
    }
    const audioClips = finalSegments.map((segment, index) => ({
      segment_number: index + 1,
      text: segment.text,
      start_time: segment.startTime,
      end_time: segment.endTime,
      duration: segment.endTime - segment.startTime,
      r2_key: `videos/${videoId}/segment_${index + 1}.mp3`
    }));
    return jsonResponse({
      success: true,
      videoId,
      transcript: finalTranscript,
      segments: finalSegments,
      audioClips,
      r2Keys: audioClips.map((clip) => clip.r2_key),
      message: `Processed ${finalSegments.length} segments`
    });
  } catch (error) {
    console.error("Video processing error:", error);
    return errorResponse(`Video processing failed: ${error.message}`, 500);
  }
}
__name(processVideo, "processVideo");
async function listVideos(env) {
  try {
    const result = await env.DB.prepare(
      `SELECT * FROM video_transcripts ORDER BY created_at DESC LIMIT 100`
    ).all();
    const videos = result.results?.map((video) => {
      let segments = [];
      try {
        if (video.segments) {
          if (typeof video.segments === "string") {
            segments = JSON.parse(video.segments);
          } else {
            segments = video.segments;
          }
        }
      } catch (e) {
        console.error("Failed to parse segments:", e);
        segments = [];
      }
      return {
        video_id: video.video_id,
        youtube_url: video.youtube_url,
        transcript: video.transcript,
        segments,
        transcription_service: video.transcription_service,
        r2_audio_key: video.r2_audio_key,
        title: video.title || null,
        created_at: video.created_at,
        updated_at: video.updated_at
      };
    }) || [];
    return jsonResponse({ videos, count: videos.length });
  } catch (error) {
    return errorResponse(`Failed to list videos: ${error.message}`, 500);
  }
}
__name(listVideos, "listVideos");
async function deleteVideo(env, videoId) {
  try {
    const videoResult = await env.DB.prepare(
      `SELECT * FROM video_transcripts WHERE video_id = ?`
    ).bind(videoId).first();
    if (!videoResult) {
      return errorResponse("Video not found", 404);
    }
    const r2Keys = videoResult.r2_audio_key ? videoResult.r2_audio_key.split(",") : [];
    let deletedCount = 0;
    let failedCount = 0;
    for (const r2Key of r2Keys) {
      try {
        const key = r2Key.trim();
        if (!key) continue;
        const possiblePaths = [
          key,
          `pashto-bible-audio/${key}`,
          key.toLowerCase(),
          `pashto-bible-audio/${key.toLowerCase()}`
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
    const videoWordsResult = await env.DB.prepare(
      `SELECT pashto_word, frequency FROM video_word_mappings WHERE video_id = ?`
    ).bind(videoId).all();
    const affectedWords = [];
    if (videoWordsResult.results && videoWordsResult.results.length > 0) {
      for (const mapping of videoWordsResult.results) {
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
      if (affectedWords.length > 0) {
        const placeholders = affectedWords.map(() => "?").join(",");
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
    await env.DB.prepare(`DELETE FROM video_word_mappings WHERE video_id = ?`).bind(videoId).run();
    await env.DB.prepare(`DELETE FROM video_transcripts WHERE video_id = ?`).bind(videoId).run();
    return jsonResponse({
      success: true,
      videoId,
      deletedFromD1: true,
      r2FilesDeleted: deletedCount,
      r2FilesFailed: failedCount,
      message: `Video ${videoId} deleted. ${deletedCount} R2 files deleted.`
    });
  } catch (error) {
    console.error(`Error deleting video: ${error.message}`, error);
    return errorResponse(`Failed to delete video: ${error.message}`, 500);
  }
}
__name(deleteVideo, "deleteVideo");
async function deleteR2Object(env, request) {
  try {
    const body = await request.json();
    const { key } = body;
    if (!key) {
      return errorResponse("Missing key", 400);
    }
    const possiblePaths = [
      key,
      `pashto-bible-audio/${key}`,
      key.toLowerCase(),
      `pashto-bible-audio/${key.toLowerCase()}`
    ];
    for (const path of possiblePaths) {
      const object = await env.AUDIO_BUCKET.get(path);
      if (object !== null) {
        await env.AUDIO_BUCKET.delete(path);
        return jsonResponse({ success: true, key: path, deleted: true });
      }
    }
    return errorResponse(`Object not found: ${key}`, 404);
  } catch (error) {
    return errorResponse(`Failed to delete R2 object: ${error.message}`, 500);
  }
}
__name(deleteR2Object, "deleteR2Object");
async function getVideoAudioFull(env, videoId, request) {
  try {
    const possiblePaths = [
      `videos/${videoId}/full.mp3`,
      // Standard path
      `videos/${videoId}/audio.mp3`,
      `videos/${videoId.toLowerCase()}/full.mp3`
      // Lowercase video ID
    ];
    console.log(`Requesting full audio for video ${videoId}`);
    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);
        if (object !== null) {
          console.log(`\u2705 Found full audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }
    console.warn(`\u26A0\uFE0F Full audio not found for video ${videoId}`);
    console.warn(`Tried paths: ${possiblePaths.join(", ")}`);
    return errorResponse(`Full audio file not found for video ${videoId}. Tried: ${possiblePaths.join(", ")}`, 404);
  } catch (error) {
    console.error(`Error getting full video audio: ${error.message}`, error);
    return errorResponse(`Failed to get full video audio: ${error.message}`, 500);
  }
}
__name(getVideoAudioFull, "getVideoAudioFull");
async function getVideoAudio(env, videoId, segment, request) {
  try {
    const possiblePaths = [
      `videos/${videoId}/segment_${segment}.mp3`,
      // Standard path
      `pashto-bible-audio/videos/${videoId}/segment_${segment}.mp3`,
      // With bucket prefix
      `videos/${videoId.toLowerCase()}/segment_${segment}.mp3`,
      // Lowercase video ID
      `pashto-bible-audio/videos/${videoId.toLowerCase()}/segment_${segment}.mp3`
      // Lowercase with prefix
    ];
    console.log(`Requesting audio for video ${videoId}, segment ${segment}`);
    for (const r2Key of possiblePaths) {
      try {
        console.log(`Trying R2 path: ${r2Key}`);
        const object = await env.AUDIO_BUCKET.get(r2Key);
        if (object !== null) {
          console.log(`\u2705 Found audio at: ${r2Key}`);
          return streamAudio(env, r2Key, request);
        } else {
          console.log(`Path ${r2Key} not found (null), trying next...`);
        }
      } catch (pathError) {
        console.log(`Path ${r2Key} error: ${pathError.message}, trying next...`);
      }
    }
    console.error(`\u274C Audio file not found for video ${videoId}, segment ${segment}`);
    console.error(`Tried paths: ${possiblePaths.join(", ")}`);
    return errorResponse(`Audio file not found for segment ${segment}. Tried paths: ${possiblePaths.join(", ")}`, 404);
  } catch (error) {
    console.error(`Error getting video audio: ${error.message}`, error);
    return errorResponse(`Failed to get video audio: ${error.message}`, 500);
  }
}
__name(getVideoAudio, "getVideoAudio");
async function getTopicsCategories(env) {
  try {
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
    const categories = result.results?.map((cat) => ({
      category_key: cat.category_key,
      category_name: cat.category_name || cat.category_key.split("_").map(
        (w) => w.charAt(0).toUpperCase() + w.slice(1)
      ).join(" "),
      description: cat.description,
      parent_category: cat.parent_category,
      verse_count: cat.verse_count || 0,
      word_count: cat.word_count || 0
    })) || [];
    return jsonResponse({ categories, count: categories.length });
  } catch (error) {
    return errorResponse(`Failed to get categories: ${error.message}`, 500);
  }
}
__name(getTopicsCategories, "getTopicsCategories");
async function getTopicsVerses(env, categoryKey, limit = 200, request) {
  try {
    if (!categoryKey) {
      return errorResponse("Missing category parameter", 400);
    }
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
    ).bind(categoryKey, limit).all();
    const baseUrl = request ? new URL(request.url).origin : "https://pashtobiblesearch.jeremy-samuels17.workers.dev";
    const verses = result.results?.map((verse) => {
      let audioUrl = verse.audio_public_url || null;
      if (!audioUrl && verse.audio_r2_key) {
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
        audio_url: audioUrl
      };
    }) || [];
    return jsonResponse({
      category: categoryKey,
      verses,
      count: verses.length
    });
  } catch (error) {
    return errorResponse(`Failed to get verses: ${error.message}`, 500);
  }
}
__name(getTopicsVerses, "getTopicsVerses");
var worker_api_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (path === "/api/search" && request.method === "GET") {
      const query = url.searchParams.get("q") || "";
      const translation = url.searchParams.get("translation") || "afghan2023";
      const testament = url.searchParams.get("testament");
      const limit = parseInt(url.searchParams.get("limit") || "100");
      return searchVerses(env, query, { translation, testament, limit });
    }
    if (path === "/api/chapter" && request.method === "GET") {
      const book = url.searchParams.get("book");
      const chapter = parseInt(url.searchParams.get("chapter") || "1");
      const translation = url.searchParams.get("translation") || "afghan2023";
      if (!book) {
        return errorResponse("Missing book parameter", 400);
      }
      return getVersesByChapter(env, book, chapter, translation);
    }
    if (path === "/api/verse" && request.method === "GET") {
      const ref = url.searchParams.get("ref");
      const translation = url.searchParams.get("translation") || "afghan2023";
      if (!ref) {
        return errorResponse("Missing ref parameter", 400);
      }
      return getVerseByRef(env, ref, translation);
    }
    if (path === "/api/word-occurrences" && request.method === "GET") {
      const word = url.searchParams.get("word");
      const translation = url.searchParams.get("translation") || "afghan2023";
      const limit = parseInt(url.searchParams.get("limit") || "100");
      if (!word) {
        return errorResponse("Missing word parameter", 400);
      }
      return searchWordOccurrences(env, word, translation, limit);
    }
    if (path.startsWith("/api/audio/url/") && request.method === "GET") {
      const r2Key = path.replace("/api/audio/url/", "");
      return getAudioUrl(env, decodeURIComponent(r2Key));
    }
    if (path.startsWith("/api/audio/stream/") && request.method === "GET") {
      const r2Key = path.replace("/api/audio/stream/", "");
      return streamAudio(env, decodeURIComponent(r2Key), request);
    }
    if (path === "/api/inflections" && request.method === "GET") {
      const baseWord = url.searchParams.get("base_word");
      if (!baseWord) {
        return errorResponse("Missing base_word parameter", 400);
      }
      return getInflections(env, baseWord);
    }
    if (path === "/api/inflections/reverse" && request.method === "GET") {
      const form = url.searchParams.get("form");
      if (!form) {
        return errorResponse("Missing form parameter", 400);
      }
      return getInflectionBase(env, form);
    }
    if (path.startsWith("/api/verbs/") && request.method === "GET") {
      const root = path.replace("/api/verbs/", "");
      if (!root) {
        return errorResponse("Missing verb root", 400);
      }
      return getVerbData(env, decodeURIComponent(root));
    }
    if (path.startsWith("/api/nouns/") && request.method === "GET") {
      const word = path.replace("/api/nouns/", "");
      if (!word) {
        return errorResponse("Missing noun word", 400);
      }
      return getNounData(env, decodeURIComponent(word));
    }
    if (path === "/api/verb-forms" && request.method === "GET") {
      const lemma = url.searchParams.get("lemma");
      const cap = parseInt(url.searchParams.get("cap") || "200", 10);
      if (!lemma) {
        return errorResponse("Missing lemma parameter", 400);
      }
      return getVerbForms(env, decodeURIComponent(lemma), cap);
    }
    if (path === "/api/form-occurrences" && request.method === "GET") {
      const form = url.searchParams.get("form");
      const translation = url.searchParams.get("translation");
      if (!form) {
        return errorResponse("Missing form parameter", 400);
      }
      return getFormOccurrences(env, form, translation);
    }
    if (path === "/api/inflection-reasons" && request.method === "GET") {
      const form = url.searchParams.get("form");
      const baseWord = url.searchParams.get("base_word");
      const translation = url.searchParams.get("translation");
      if (!form && !baseWord) {
        return errorResponse("Missing form or base_word parameter", 400);
      }
      return getInflectionReasons(env, form || null, baseWord || null, translation);
    }
    if (path === "/api/related-forms" && request.method === "GET") {
      const query = url.searchParams.get("query");
      if (!query) {
        return errorResponse("Missing query parameter", 400);
      }
      return getRelatedForms(env, query);
    }
    if (path === "/api/topics/categories" && request.method === "GET") {
      return getTopicsCategories(env);
    }
    if (path === "/api/topics/verses" && request.method === "GET") {
      const category = url.searchParams.get("category");
      const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get("limit") || "200")));
      if (!category) {
        return errorResponse("Missing category parameter", 400);
      }
      return getTopicsVerses(env, category, limit, request);
    }
    if (path === "/api/video/process" && request.method === "POST") {
      return processVideo(env, request);
    }
    if (path === "/api/video/list" && request.method === "GET") {
      return listVideos(env);
    }
    if (path.startsWith("/api/video/") && path.endsWith("/audio-full") && request.method === "GET") {
      const pathParts = path.split("/");
      const videoId = pathParts[pathParts.length - 2];
      if (!videoId) {
        return errorResponse("Missing video ID", 400);
      }
      return getVideoAudioFull(env, videoId, request);
    }
    if (path.startsWith("/api/video/") && path.endsWith("/audio") && request.method === "GET") {
      const pathParts = path.split("/");
      const videoId = pathParts[pathParts.length - 2];
      const segment = parseInt(url.searchParams.get("segment") || "1");
      if (!videoId) {
        return errorResponse("Missing video ID", 400);
      }
      return getVideoAudio(env, videoId, segment, request);
    }
    if (path.startsWith("/api/video/") && !path.endsWith("/audio") && request.method === "DELETE") {
      const pathParts = path.split("/");
      const videoId = pathParts[pathParts.length - 1];
      if (!videoId) {
        return errorResponse("Missing video ID", 400);
      }
      return deleteVideo(env, videoId);
    }
    if (path === "/api/r2/upload" && request.method === "POST") {
      return uploadToR2(env, request);
    }
    if (path === "/api/r2/delete" && request.method === "POST") {
      return deleteR2Object(env, request);
    }
    if (path === "/api/r2/list" && request.method === "GET") {
      const prefix = url.searchParams.get("prefix") || "";
      const cursor = url.searchParams.get("cursor") || void 0;
      const limit = parseInt(url.searchParams.get("limit") || "1000");
      try {
        const listResult = await env.AUDIO_BUCKET.list({
          prefix,
          limit,
          cursor
        });
        const objects = listResult.objects.map((obj) => ({
          key: obj.key,
          size: obj.size,
          uploaded: obj.uploaded
        }));
        return jsonResponse({
          prefix,
          count: objects.length,
          objects,
          cursor: listResult.cursor,
          // Return cursor for next page
          truncated: listResult.truncated
        });
      } catch (error) {
        return errorResponse(`Failed to list R2 objects: ${error.message}`, 500);
      }
    }
    if (path === "/api/update-audio-urls" && request.method === "POST") {
      try {
        const result = await updateAudioUrls(env);
        return jsonResponse(result);
      } catch (error) {
        return errorResponse(`Failed to update audio URLs: ${error.message}`, 500);
      }
    }
    if (path === "/api/d1/query" && request.method === "POST") {
      try {
        const body = await request.json();
        const { sql } = body;
        if (!sql || typeof sql !== "string") {
          return errorResponse("Missing or invalid SQL query", 400);
        }
        const sqlUpper = sql.trim().toUpperCase();
        if (!sqlUpper.startsWith("SELECT")) {
          return errorResponse("Only SELECT queries are allowed", 400);
        }
        const result = await env.DB.prepare(sql).all();
        return jsonResponse({
          success: true,
          results: result.results || [],
          meta: result.meta || {}
        });
      } catch (error) {
        return errorResponse(`Query failed: ${error.message}`, 500);
      }
    }
    return errorResponse("Not found", 404);
  }
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-615kF9/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_api_default;

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-615kF9/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker-api.js.map

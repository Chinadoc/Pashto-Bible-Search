/**
 * Normalize existing grammatical_info in D1 database
 * Converts existing string/loose JSON to standardized structure
 */

interface NormalizedGrammaticalInfo {
  person: string | null;
  tense: string | null;
  aspect: string | null;
  mood: string | null;
  gender: string | null;
  length: string | null;
  verb_type: string | null;
  participle_type: string | null;
  inflection_type: string | null;
  pos: 'verb' | 'noun' | 'adjective' | 'other';
}

/**
 * Parse existing grammatical_info string into normalized structure
 */
export function normalizeGrammaticalInfo(
  rawInfo: string | object | null,
  pos: string = 'verb'
): NormalizedGrammaticalInfo {
  const normalized: NormalizedGrammaticalInfo = {
    person: null,
    tense: null,
    aspect: null,
    mood: null,
    gender: null,
    length: null,
    verb_type: null,
    participle_type: null,
    inflection_type: null,
    pos: (pos || 'verb') as any,
  };

  if (!rawInfo) return normalized;

  let infoString = '';
  let infoObj: any = null;

  // Parse input
  if (typeof rawInfo === 'string') {
    infoString = rawInfo;
    try {
      infoObj = JSON.parse(rawInfo);
    } catch {
      // Not JSON, use as string
    }
  } else if (typeof rawInfo === 'object') {
    infoObj = rawInfo;
    infoString = JSON.stringify(rawInfo);
  }

  // If already structured, use it
  if (infoObj && typeof infoObj === 'object') {
    normalized.person = infoObj.person || infoObj.p || null;
    normalized.tense = infoObj.tense || infoObj.t || null;
    normalized.aspect = infoObj.aspect || infoObj.a || null;
    normalized.mood = infoObj.mood || infoObj.m || null;
    normalized.gender = infoObj.gender || infoObj.g || null;
    normalized.length = infoObj.length || infoObj.l || null;
    normalized.verb_type = infoObj.verb_type || infoObj.vt || null;
    normalized.participle_type = infoObj.participle_type || infoObj.pt || null;
    normalized.inflection_type = infoObj.inflection_type || infoObj.it || null;
    if (infoObj.pos) normalized.pos = infoObj.pos as any;
  }

  // Parse from string if not already structured
  if (!normalized.person || !normalized.tense) {
    const lower = infoString.toLowerCase();

    // Extract person
    const personMatch = lower.match(/\b(1sg|2sg|3sg|1pl|2pl|3pl|first|second|third|singular|plural)\b/);
    if (personMatch) {
      const match = personMatch[0];
      if (match.includes('1sg') || (match.includes('first') && match.includes('singular'))) {
        normalized.person = '1sg';
      } else if (match.includes('2sg') || (match.includes('second') && match.includes('singular'))) {
        normalized.person = '2sg';
      } else if (match.includes('3sg') || (match.includes('third') && match.includes('singular'))) {
        normalized.person = '3sg';
      } else if (match.includes('1pl') || (match.includes('first') && match.includes('plural'))) {
        normalized.person = '1pl';
      } else if (match.includes('2pl') || (match.includes('second') && match.includes('plural'))) {
        normalized.person = '2pl';
      } else if (match.includes('3pl') || (match.includes('third') && match.includes('plural'))) {
        normalized.person = '3pl';
      }
    }

    // Extract tense
    if (lower.includes('present')) normalized.tense = 'Present';
    else if (lower.includes('subjunctive')) normalized.tense = 'Subjunctive';
    else if (lower.includes('past')) normalized.tense = 'Past';
    else if (lower.includes('imperative')) normalized.tense = 'Imperative';
    else if (lower.includes('future')) normalized.tense = 'Future';

    // Extract aspect
    if (lower.includes('imperfective')) normalized.aspect = 'Imperfective';
    else if (lower.includes('perfective')) normalized.aspect = 'Perfective';

    // Extract mood
    if (lower.includes('imperative')) normalized.mood = 'Imperative';
    else if (lower.includes('subjunctive')) normalized.mood = 'Subjunctive';
    else if (lower.includes('indicative')) normalized.mood = 'Indicative';

    // Extract gender
    if (lower.includes('masc') || lower.includes('masculine')) normalized.gender = 'Masc';
    else if (lower.includes('fem') || lower.includes('feminine')) normalized.gender = 'Fem';

    // Extract length
    if (lower.includes('long')) normalized.length = 'long';
    else if (lower.includes('short')) normalized.length = 'short';

    // Extract verb type
    if (lower.includes('stative') && lower.includes('compound')) {
      normalized.verb_type = 'stative_compound';
    } else if (lower.includes('dynamic') && lower.includes('compound')) {
      normalized.verb_type = 'dynamic_compound';
    } else if (lower.includes('irregular')) {
      normalized.verb_type = 'irregular';
    } else if (lower.includes('compound')) {
      normalized.verb_type = 'stative_compound'; // Default for compound
    }

    // Extract participle type
    if (lower.includes('past') && lower.includes('participle')) {
      normalized.participle_type = 'past';
    } else if (lower.includes('present') && lower.includes('participle')) {
      normalized.participle_type = 'present';
    }

    // Extract inflection type (for nouns/adjectives)
    if (lower.includes('plain') || lower.includes('direct')) {
      normalized.inflection_type = 'plain';
    } else if (lower.includes('1st') || lower.includes('first inflection')) {
      normalized.inflection_type = '1st';
    } else if (lower.includes('2nd') || lower.includes('second inflection')) {
      normalized.inflection_type = '2nd';
    } else if (lower.includes('plural')) {
      normalized.inflection_type = 'plural';
    } else if (lower.includes('vocative')) {
      normalized.inflection_type = 'vocative';
    } else if (lower.includes('bundled')) {
      normalized.inflection_type = 'bundled';
    }
  }

  return normalized;
}

/**
 * Generate SQL UPDATE statements for normalizing existing inflections
 */
export function generateNormalizationSQL(
  db: any, // D1 database instance
  batchSize: number = 1000
): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sqlStatements: string[] = [];
      
      // Get all inflections that need normalization
      const result = await db.prepare(`
        SELECT id, base_word, inflected_form, grammatical_info, pos
        FROM inflections
        WHERE grammatical_info_normalized IS NULL
        LIMIT ?
      `).bind(batchSize).all();

      for (const row of result.results || []) {
        const normalized = normalizeGrammaticalInfo(row.grammatical_info, row.pos);
        const normalizedJson = JSON.stringify(normalized);

        const sql = `
          UPDATE inflections
          SET 
            grammatical_info_normalized = ?,
            person = ?,
            tense = ?,
            aspect = ?,
            mood = ?,
            gender = ?,
            length = ?,
            verb_type = ?,
            inflection_type = ?,
            updated_at = strftime('%s', 'now')
          WHERE id = ?
        `;

        sqlStatements.push(sql);
        
        // Also prepare the values for execution
        await db.prepare(sql).bind(
          normalizedJson,
          normalized.person,
          normalized.tense,
          normalized.aspect,
          normalized.mood,
          normalized.gender,
          normalized.length,
          normalized.verb_type,
          normalized.inflection_type,
          row.id
        ).run();
      }

      resolve(sqlStatements);
    } catch (error) {
      reject(error);
    }
  });
}


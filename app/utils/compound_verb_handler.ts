/**
 * Compound/Dynamic Verb Handler for Pashto Bible Search
 *
 * Handles searching for dynamic compound verbs like وهل (wahul)
 * which appear in texts as:
 * - Simple form: وهل
 * - With nouns: قدم وهل (qadam wahul - to walk, lit. "step to hit")
 * - With nouns: مونډه وهل (munda wahul - to punch, lit. "fist to hit")
 *
 * Dynamic compound verbs in Pashto:
 * - Have a helper verb (usually کول for transitive, کېدل for intransitive)
 * - Combine with nouns to create specific meanings
 * - The noun part can inflect (case/number)
 * - The verb part conjugates normally
 */

import type { D1Database } from '@/utils/d1';

// Type for verb lexicon row from D1
interface VerbLexiconRow {
  verb_type?: string;
  helper?: string;
  lemma?: string;
}

/**
 * Common noun stems that combine with dynamic verbs
 * These are high-frequency combinations found in biblical text
 */
const COMMON_COMPOUND_NOUNS = {
  // Movement verbs with وهل
  'وهل': [
    'قدم',     // qadam - step (to walk)
    'مونډه',   // munda - fist (to punch)
    'لاس',     // laas - hand (to hit with hand)
    'ګوته',    // gota - finger (to point)
    'سر',      // sar - head (to headbutt)
    'پښه',     // pkha - foot (to kick)
  ],
  // Action verbs with کول
  'کول': [
    'کار',     // kaar - work (to work)
    'مرسته',   // marasta - help (to help)
    'خدمت',    // khidmat - service (to serve)
    'عبادت',   // ibadat - worship (to worship)
    'دعا',     // dua - prayer (to pray)
    'محبت',    // muhabbat - love (to love)
    'ښکارنه',  // xkarana - appearance (to show)
  ],
  // Eating/consumption with خوړل
  'خوړل': [
    'ډوډۍ',    // doduy - bread/food (to eat)
    'غوښه',    // ghwakha - meat (to eat meat)
    'میوه',    // mewa - fruit (to eat fruit)
  ],
  // Giving with ورکول
  'ورکول': [
    'ډالۍ',    // daalaay - gift (to give)
    'مرسته',   // marasta - help (to help/give help)
    'ځواب',    // jawaab - answer (to answer)
  ],
};

/**
 * Check if a verb is a dynamic compound verb
 */
export async function isDynamicCompoundVerb(
  db: D1Database,
  lemma: string
): Promise<{
  isCompound: boolean;
  helper?: string;
  verbType?: string;
  commonNouns?: string[];
}> {
  try {
    const result = await db
      .prepare(
        `SELECT verb_type, helper, lemma
         FROM verbs_lexicon
         WHERE lemma = ? OR verb_root = ?
         LIMIT 1`
      )
      .bind(lemma, lemma)
      .first() as VerbLexiconRow | null;

    if (!result) {
      return { isCompound: false };
    }

    const isCompound = result.verb_type === 'dynamic_compound' || result.verb_type === 'stative_compound';

    return {
      isCompound,
      helper: result.helper,
      verbType: result.verb_type,
      commonNouns: COMMON_COMPOUND_NOUNS[lemma as keyof typeof COMMON_COMPOUND_NOUNS] || [],
    };
  } catch (error) {
    console.error('Error checking dynamic compound verb:', error);
    return { isCompound: false };
  }
}

/**
 * Generate compound verb search patterns
 * For a verb like وهل, generates patterns like:
 * - قدم وهل (qadam wahul)
 * - قدم وهي (qadam wahi - conjugated)
 * - مونډه وهل (munda wahul)
 */
export function generateCompoundVerbPatterns(
  verb: string,
  commonNouns: string[],
  conjugatedForms?: string[]
): string[] {
  const patterns: string[] = [];

  // Base verb
  patterns.push(verb);

  // For each common noun that combines with this verb
  for (const noun of commonNouns) {
    // Simple combination: noun + verb
    patterns.push(`${noun} ${verb}`);

    // If we have conjugated forms, combine with noun
    if (conjugatedForms && conjugatedForms.length > 0) {
      for (const form of conjugatedForms.slice(0, 20)) { // Limit to avoid too many patterns
        patterns.push(`${noun} ${form}`);
      }
    }

    // Also try with possessive suffix on noun (د)
    // e.g., "د قدم وهل" (of step hitting)
    patterns.push(`د ${noun} ${verb}`);
  }

  return patterns;
}

/**
 * Search for verses containing compound verb combinations
 * This expands a simple verb search to include its compound forms
 */
export async function searchCompoundVerbs(
  db: D1Database,
  verb: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023',
  limit: number = 100
): Promise<{
  verses: any[];
  patterns: string[];
  isCompound: boolean;
}> {
  // Check if this is a compound verb
  const compoundInfo = await isDynamicCompoundVerb(db, verb);

  if (!compoundInfo.isCompound || !compoundInfo.commonNouns || compoundInfo.commonNouns.length === 0) {
    // Not a compound verb or no known combinations
    return {
      verses: [],
      patterns: [verb],
      isCompound: false,
    };
  }

  // Get conjugated forms of the verb
  const verbForms = await db
    .prepare(
      `SELECT DISTINCT form
       FROM verb_forms
       WHERE lemma = ?
       LIMIT 50`
    )
    .bind(verb)
    .all();

  const conjugatedForms = verbForms.results?.map((row: any) => row.form as string) || [];

  // Generate all compound patterns
  const patterns = generateCompoundVerbPatterns(
    verb,
    compoundInfo.commonNouns,
    conjugatedForms
  );

  console.log(`🔍 Compound verb search for "${verb}":`, {
    patterns: patterns.slice(0, 10),
    totalPatterns: patterns.length,
    commonNouns: compoundInfo.commonNouns,
  });

  // Build SQL query to search for any of these patterns
  const table = translation === 'yousafzai2019' ? 'verses_yousafzai' : 'verses_afghan2023';

  // Create LIKE clauses for each pattern
  const likeConditions = patterns.map(() => `text LIKE ?`).join(' OR ');

  const query = `
    SELECT *
    FROM ${table}
    WHERE ${likeConditions}
    ORDER BY book, chapter, verse
    LIMIT ?
  `;

  // Bind parameters: each pattern with % wildcards, plus limit
  const params = [
    ...patterns.map(p => `%${p}%`),
    limit,
  ];

  try {
    const result = await db.prepare(query).bind(...params).all();

    return {
      verses: result.results || [],
      patterns,
      isCompound: true,
    };
  } catch (error) {
    console.error('Error searching compound verbs:', error);
    return {
      verses: [],
      patterns,
      isCompound: true,
    };
  }
}

/**
 * Expand a search query to include compound verb forms
 * This is called when the user searches for a verb
 */
export async function expandSearchForCompoundVerbs(
  db: D1Database,
  searchTerm: string,
  translation: 'afghan2023' | 'yousafzai2019' = 'afghan2023'
): Promise<{
  shouldExpand: boolean;
  expandedPatterns: string[];
  compoundInfo?: {
    verbType: string;
    helper: string;
    commonNouns: string[];
  };
}> {
  const compoundInfo = await isDynamicCompoundVerb(db, searchTerm);

  if (!compoundInfo.isCompound) {
    return {
      shouldExpand: false,
      expandedPatterns: [searchTerm],
    };
  }

  // Get conjugated forms
  const verbForms = await db
    .prepare(
      `SELECT DISTINCT form
       FROM verb_forms
       WHERE lemma = ?
       LIMIT 30`
    )
    .bind(searchTerm)
    .all();

  const conjugatedForms = verbForms.results?.map((row: any) => row.form as string) || [];

  // Generate compound patterns
  const patterns = generateCompoundVerbPatterns(
    searchTerm,
    compoundInfo.commonNouns || [],
    conjugatedForms
  );

  return {
    shouldExpand: true,
    expandedPatterns: patterns,
    compoundInfo: {
      verbType: compoundInfo.verbType || 'dynamic_compound',
      helper: compoundInfo.helper || 'کول',
      commonNouns: compoundInfo.commonNouns || [],
    },
  };
}

/**
 * Example usage in search API:
 *
 * const { shouldExpand, expandedPatterns, compoundInfo } =
 *   await expandSearchForCompoundVerbs(db, userQuery, translation);
 *
 * if (shouldExpand) {
 *   // Show UI indicator that we're including compound forms
 *   console.log('Searching for compound verb forms:', compoundInfo);
 *
 *   // Search using expanded patterns
 *   const results = await searchCompoundVerbs(db, userQuery, translation);
 *   return results.verses;
 * }
 */

export default {
  isDynamicCompoundVerb,
  generateCompoundVerbPatterns,
  searchCompoundVerbs,
  expandSearchForCompoundVerbs,
};

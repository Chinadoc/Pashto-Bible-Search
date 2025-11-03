/**
 * Infer verb metadata (root, stem, POS, category) for unknown verbs
 * Uses linguistic patterns to extract roots from verb forms
 */

/**
 * Common Pashto verb prefixes
 */
const VERB_PREFIXES = [
  'و',      // Perfective/transitive past prefix
  'به',     // Future/subjunctive prefix
  'څخه',    // From prefix
  'تر',     // Until/until prefix
];

/**
 * Common Pashto verb suffixes
 */
const VERB_SUFFIXES = [
  'یدل',    // Intransitive marker
  'ېدل',    // Intransitive marker variant
  'کول',    // Causative marker
  'کېدل',   // Causative intransitive
  'ول',     // Transitive marker
];

/**
 * Verb person/mood endings for parsing conjugations
 */
const VERB_ENDINGS = {
  // Present tense endings
  present: ['م', 'ې', 'ي', 'و', 'ئ', 'ې'],
  // Past tense endings
  past: ['م', 'ې', 'ه', 'و', 'ئ', 'ې'],
  // Imperative endings
  imperative: ['ه', 'ئ'],
  // Subjunctive endings
  subjunctive: ['م', 'ې', 'ي', 'و', 'ئ', 'ې'],
};

/**
 * Extract potential verb root from a verb form
 */
export function inferVerbRoot(form: string): {
  root: string | null;
  prefix: string | null;
  isTransitive: boolean;
  isPerfective: boolean;
  confidence: 'high' | 'medium' | 'low';
} {
  const originalForm = form;
  let prefix: string | null = null;
  let root = form;
  
  // Step 1: Remove verb prefixes
  for (const pref of VERB_PREFIXES) {
    if (form.startsWith(pref)) {
      prefix = pref;
      root = form.slice(pref.length);
      break;
    }
  }
  
  // Step 2: Try to extract root by removing person/mood endings
  // Check for common verb endings
  let isTransitive = false;
  let isPerfective = prefix === 'و';
  
  // Check if it ends with a verb suffix (like ویدل, کول, etc.)
  for (const suffix of VERB_SUFFIXES) {
    if (root.endsWith(suffix)) {
      // This might be a root itself, but could also be a conjugation
      // Try removing person endings first
      break;
    }
  }
  
  // Step 3: Remove person/mood endings to get stem
  let stem = root;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  // Try removing endings from all tenses
  for (const endings of Object.values(VERB_ENDINGS)) {
    for (const ending of endings) {
      if (stem.endsWith(ending) && stem.length > ending.length) {
        const potentialStem = stem.slice(0, -ending.length);
        // Check if the remaining part looks like a verb stem
        if (potentialStem.length >= 2) {
          stem = potentialStem;
          confidence = 'medium';
          
          // If we removed a prefix, confidence increases
          if (prefix) {
            confidence = 'high';
          }
          break;
        }
      }
    }
  }
  
  // Step 4: If stem ends with verb markers, extract the actual root
  if (stem.endsWith('ول')) {
    const baseRoot = stem.slice(0, -2);
    if (baseRoot.length >= 2) {
      root = baseRoot + 'ول';
      isTransitive = true;
      confidence = 'high';
    }
  } else if (stem.endsWith('یدل') || stem.endsWith('ېدل')) {
    const baseRoot = stem.slice(0, -3);
    if (baseRoot.length >= 2) {
      root = baseRoot + 'ېدل';
      isTransitive = false;
      confidence = 'high';
    }
  } else if (stem.endsWith('کول')) {
    const baseRoot = stem.slice(0, -3);
    if (baseRoot.length >= 2) {
      root = baseRoot + 'کول';
      isTransitive = true;
      confidence = 'high';
    }
  } else if (stem.endsWith('کېدل')) {
    const baseRoot = stem.slice(0, -4);
    if (baseRoot.length >= 2) {
      root = baseRoot + 'کېدل';
      isTransitive = false;
      confidence = 'high';
    }
  }
  
  // If we couldn't extract a clear root, use the stem as root
  if (root === originalForm && !prefix) {
    // Might be a noun/adjective, not a verb
    return {
      root: null,
      prefix: null,
      isTransitive: false,
      isPerfective: false,
      confidence: 'low',
    };
  }
  
  return {
    root: root || stem,
    prefix,
    isTransitive,
    isPerfective,
    confidence,
  };
}

/**
 * Categorize an unknown verb based on its form and inferred root
 */
export function categorizeUnknownVerb(
  form: string,
  inferredRoot: string | null
): {
  pos: string;
  word_type: string;
  inflection_type: string | null;
  base_form: string | null;
  category_hints: string[];
} {
  if (!inferredRoot) {
    return {
      pos: 'unknown',
      word_type: 'other',
      inflection_type: null,
      base_form: null,
      category_hints: [],
    };
  }
  
  const analysis = inferVerbRoot(form);
  const { isTransitive, isPerfective, prefix } = analysis;
  
  // Determine POS
  let pos = 'v.';
  if (isTransitive) {
    pos = 'v. trans.';
  } else {
    pos = 'v. intrans.';
  }
  
  // Determine inflection type
  let inflectionType: string | null = null;
  if (prefix === 'و') {
    inflectionType = 'perfective_past';
  } else if (prefix === 'به') {
    inflectionType = 'future_subjunctive';
  } else {
    inflectionType = 'imperfective_present';
  }
  
  // Category hints based on common verb patterns
  const categoryHints: string[] = [];
  
  if (inferredRoot.includes('کول')) {
    categoryHints.push('causative');
  }
  if (inferredRoot.includes('ېدل') || inferredRoot.includes('یدل')) {
    categoryHints.push('intransitive');
  }
  if (isPerfective) {
    categoryHints.push('perfective');
  }
  
  return {
    pos,
    word_type: 'verb',
    inflection_type: inflectionType,
    base_form: inferredRoot,
    category_hints: categoryHints,
  };
}

/**
 * Parse "وفرمایيل" - example usage
 * This would extract:
 * - Prefix: "و" (perfective/transitive past)
 * - Stem: "فرمای" 
 * - Root: likely "فرماييل" or "فرمايول"
 */
export function parseVerbForm(form: string) {
  const analysis = inferVerbRoot(form);
  const categorization = categorizeUnknownVerb(form, analysis.root);
  
  return {
    original_form: form,
    inferred_root: analysis.root,
    prefix: analysis.prefix,
    is_transitive: analysis.isTransitive,
    is_perfective: analysis.isPerfective,
    confidence: analysis.confidence,
    categorization,
  };
}


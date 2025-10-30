/**
 * Classify Compound Verbs
 * 
 * Identifies whether a compound verb is stative or dynamic based on:
 * 1. Dictionary classification (c field)
 * 2. Helper verb detection
 */

interface DictionaryEntry {
  p?: string;
  c?: string;
  c_norm?: string;
  pos_family?: string;
}

const STATIVE_HELPERS = new Set(['کېدل', 'ېدل', 'کېږدل']);
const DYNAMIC_HELPERS = new Set(['وهل', 'کول', 'کړل']);

/**
 * Parse compound verb type from dictionary POS field
 */
export function parseCompoundVerbType(entry: DictionaryEntry): 'stative' | 'dynamic' | 'unknown' {
  const pos = [
    entry.c,
    entry.c_norm,
    entry.pos_family
  ].join(' ').toLowerCase();
  
  // Check for explicit classification
  if (pos.includes('stat. comp.') || pos.includes('stative comp')) {
    return 'stative';
  }
  
  if (pos.includes('dyn. comp.') || pos.includes('dynamic comp')) {
    return 'dynamic';
  }
  
  // If it's a compound verb but type not specified, try helper detection
  if (pos.includes('comp.')) {
    return 'unknown'; // Will be resolved by helper detection
  }
  
  return 'unknown';
}

/**
 * Detect compound verb type from helper verb
 */
export function detectCompoundVerbType(form: string): 'stative' | 'dynamic' | 'unknown' {
  const normalized = form.replace(/\s+/g, '');
  
  // Check for stative helpers
  for (const helper of STATIVE_HELPERS) {
    if (normalized.includes(helper) || form.includes(helper)) {
      return 'stative';
    }
  }
  
  // Check for dynamic helpers
  for (const helper of DYNAMIC_HELPERS) {
    if (normalized.includes(helper) || form.includes(helper)) {
      return 'dynamic';
    }
  }
  
  return 'unknown';
}

/**
 * Classify a compound verb entry
 */
export function classifyCompoundVerb(
  entry: DictionaryEntry,
  form?: string
): 'stative' | 'dynamic' | 'unknown' {
  // First try dictionary classification
  const dictType = parseCompoundVerbType(entry);
  if (dictType !== 'unknown') {
    return dictType;
  }
  
  // Fallback to helper detection
  const wordToCheck = form || entry.p || '';
  return detectCompoundVerbType(wordToCheck);
}

/**
 * Check if a word is a compound verb
 */
export function isCompoundVerb(entry: DictionaryEntry): boolean {
  const pos = [
    entry.c,
    entry.c_norm,
    entry.pos_family
  ].join(' ').toLowerCase();
  
  return pos.includes('comp.');
}

/**
 * Extract main part and helper from compound verb
 * Example: "منډه وهل" → {main: "منډه", helper: "وهل"}
 */
export function parseCompoundVerb(form: string): {main: string; helper: string} | null {
  const parts = form.split(/\s+/);
  
  if (parts.length === 2) {
    const [main, helper] = parts;
    if (STATIVE_HELPERS.has(helper) || DYNAMIC_HELPERS.has(helper)) {
      return { main, helper };
    }
  }
  
  // Try fused form
  for (const helper of [...STATIVE_HELPERS, ...DYNAMIC_HELPERS]) {
    if (form.endsWith(helper) && form.length > helper.length) {
      return {
        main: form.slice(0, -helper.length),
        helper
      };
    }
  }
  
  return null;
}

if (require.main === module) {
  // Test examples
  const testEntries: Array<{entry: DictionaryEntry; form?: string}> = [
    {
      entry: { p: 'منډه وهل', c: 'v. dyn. comp. trans.' },
      form: 'منډه وهل'
    },
    {
      entry: { p: 'ګرم کېدل', c: 'v. stat. comp. intrans.' },
      form: 'ګرم کېدل'
    },
    {
      entry: { p: 'ګرمول', c: 'v. stat. comp. trans.' },
      form: 'ګرمول'
    },
    {
      entry: { p: 'خوړل', c: 'v. trans.' },
      form: 'خوړل'
    }
  ];
  
  console.log('🧪 Testing compound verb classification:\n');
  
  for (const { entry, form } of testEntries) {
    const type = classifyCompoundVerb(entry, form);
    const isCompound = isCompoundVerb(entry);
    const parsed = parseCompoundVerb(form || entry.p || '');
    
    console.log(`Word: ${entry.p}`);
    console.log(`  POS: ${entry.c}`);
    console.log(`  Is compound: ${isCompound}`);
    console.log(`  Type: ${type}`);
    if (parsed) {
      console.log(`  Parsed: main="${parsed.main}", helper="${parsed.helper}"`);
    }
    console.log('');
  }
}


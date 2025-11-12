// app/utils/noun_variants.ts
// Next.js utility module - adapted from Edge function
// Generates LingDocs-aligned noun variants (plural/case) with de-dupe + scoring

export type Variant = {
  form: string;
  label: string;  // e.g., "Plural Direct", "Oblique"
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type InflectionRow = {
  form: string;
  romanization?: string;
  category?: string;
};

const LABEL_MAP: Record<string, string> = {
  // common grammatical_info → human labels
  "plural": "Plural",
  "plural_direct": "Plural Direct",
  "plural_oblique": "Plural Oblique",
  "direct": "Direct",
  "oblique": "Oblique",
  "vocative": "Vocative",
  "genitive": "Genitive",
};

function labelFromInfo(info?: string): string {
  if (!info) return "Form";
  const key = info.toLowerCase().replace(/\s+/g, "_");
  return LABEL_MAP[key] || info;
}

function uniqBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

// Import data from static JSON files
import { getData } from '../lib/data/load';

// We'll get the data from the global data cache instead of importing directly
let freqMap: Map<string, number> | null = null;
let inflectMap: Map<string, InflectionRow[]> | null = null;
let dictionaryData: any[] | null = null;

// Initialize the maps
async function initializeMaps() {
  if (!freqMap) {
    const { frequencyMap, verses } = await getData();
    freqMap = frequencyMap;
  }
  if (!inflectMap) {
    // Load the actual inflections data that was pre-computed!
    const { inflectionsByBase } = await getData();
    inflectMap = inflectionsByBase;
  }
  if (!dictionaryData) {
    const { dictionary } = await getData();
    dictionaryData = dictionary;
  }
}

export async function generateNounVariants(
  rootOrLemma: string,
  opts?: { cap?: number }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 50)); // sensible upper bound
  const base = rootOrLemma.trim();

  // Try enhanced LingDocs-compatible generation first
  try {
    const { generateEnhancedNounVariants } = await import('./lingdocs_adapter');
    const enhanced = await generateEnhancedNounVariants(base, opts);
    if (enhanced && enhanced.length > 0) {
      console.log(`✅ Enhanced noun generation for "${base}": ${enhanced.length} forms`);
      return enhanced;
    }
  } catch (error) {
    console.warn('Enhanced noun generation failed, using legacy:', error);
  }

  // Fallback to original implementation
  // Initialize maps if needed
  await initializeMaps();

  const items: Variant[] = [];

  // Use inflections data (adapted from database query)
  const inflectRows = inflectMap?.get(base) || [];

  if (inflectRows.length) {
    for (const row of inflectRows) {
      if (!row.form) continue;
      items.push({
        form: row.form,
        label: labelFromInfo(row.category),
        pos: "noun",
        count: 0, // Will be updated with frequency data later
        score: 0,
      });
    }
  }

  // Optionally seed base form(s) (ensures at least one direct/lemma form)
  if (!items.length) {
    items.push({ form: base, label: "Direct", pos: "noun", count: 0, score: 0 });
  } else {
    // Also ensure lemma present
    items.unshift({ form: base, label: "Lemma", pos: "noun", count: 0, score: 0 });
  }

    // Generate Pattern 1 Basic inflections for masculine words ending in consonants
    console.log(`🔍 Legacy Pattern 1 masculine check for "${base}": items.length=${items.length}, endsWith consonant=${!base.endsWith('ه') && !base.endsWith('ی') && !base.endsWith('ې') && !base.endsWith('و')}`);
    if (items.length <= 1 && !base.endsWith('ه') && !base.endsWith('ی') && !base.endsWith('ې') && !base.endsWith('و')) {
      console.log(`🔧 Generating Pattern 1 masculine inflections for "${base}"`);
      
      // Pattern 1: Basic masculine (اتفاق, کور, برګ)
      const pattern1Forms = [
        { form: base, label: "Plain", pos: "noun" },           // اتفاق
        { form: base, label: "1st Inflection", pos: "noun" },  // اتفاق
        { form: base + 'و', label: "2nd Inflection", pos: "noun" }, // اتفاقو
        { form: base + 'ونه', label: "Plural", pos: "noun" },       // اتفاقونه
        { form: base + 'ونو', label: "2nd Inflection", pos: "noun" }, // اتفاقونو
        { form: base + 'ه', label: "Vocative", pos: "noun" },       // اتفاقه
        { form: base + 'و', label: "Plur. Voc.", pos: "noun" },     // اتفاقو
        { form: base + 'ه', label: "Bundled Plural", pos: "noun" }, // اتفاقه
        { form: base + 'و', label: "Bundled 2nd Inf.", pos: "noun" }, // اتفاقو
      ];
    
      for (const form of pattern1Forms) {
        if (!items.some(item => item.form === form.form)) {
          items.push({
            form: form.form,
            label: form.label,
            pos: "noun",
            count: freqMap?.get(form.form) ?? 0,
            score: freqMap?.get(form.form) ?? 0,
            flags: ['pattern1'],
          });
        }
      }
      console.log(`✅ Generated ${pattern1Forms.length} Pattern 1 masculine forms for "${base}"`);
    }

    // Generate Pattern 1 Basic inflections for feminine words ending in ه
    console.log(`🔍 Legacy Pattern 1 feminine check for "${base}": items.length=${items.length}, endsWith('ه')=${base.endsWith('ه')}`);
    if (items.length <= 1 && base.endsWith('ه')) {
      console.log(`🔧 Generating Pattern 1 feminine inflections for "${base}"`);
      const stem = base.slice(0, -1); // Remove final ه
      
      // Pattern 1: Basic feminine (اندازه, کور, ښځه)
      const pattern1Forms = [
        { form: base, label: "Plain", pos: "noun" },           // اندازه
        { form: stem + 'ې', label: "1st Inflection", pos: "noun" },  // اندازې
        { form: stem + 'و', label: "2nd Inflection", pos: "noun" }, // اندازو
        { form: stem + 'ې', label: "Vocative", pos: "noun" },       // اندازې (vocative)
      ];
    
      for (const form of pattern1Forms) {
        if (!items.some(item => item.form === form.form)) {
          items.push({
            form: form.form,
            label: form.label,
            pos: "noun",
            count: freqMap?.get(form.form) ?? 0,
            score: freqMap?.get(form.form) ?? 0,
            flags: ['pattern1'],
          });
        }
      }
      console.log(`✅ Generated ${pattern1Forms.length} Pattern 1 feminine forms for "${base}"`);
    }

  // Generate Pattern 3 stressed áy inflections if no database inflections found
  console.log(`🔍 Legacy Pattern 3 check for "${base}": items.length=${items.length}, endsWith('ی')=${base.endsWith('ی')}`);
  if (items.length <= 1 && base.endsWith('ی')) {
    console.log(`🔧 Generating Pattern 3 inflections for "${base}"`);
    const stem = base.slice(0, -1); // Remove final ی
    
    // Pattern 3: Stressed ی - áy (سوری, ځلمی, لومړی)
    const pattern3Forms = [
      { form: base, label: "Plain", pos: "noun" },           // سوری
      { form: stem + 'ي', label: "1st Inflection", pos: "noun" },  // سوري
      { form: stem + 'یو', label: "2nd Inflection", pos: "noun" }, // سوریو
      { form: stem + 'یه', label: "Vocative", pos: "noun" },       // سوریه
    ];

    for (const form of pattern3Forms) {
      if (!items.some(item => item.form === form.form)) {
        items.push({
          form: form.form,
          label: form.label,
          pos: "noun",
          count: freqMap?.get(form.form) ?? 0,
          score: freqMap?.get(form.form) ?? 0,
          flags: ['pattern3'],
        });
      }
    }
    console.log(`✅ Generated ${pattern3Forms.length} Pattern 3 forms for "${base}"`);
  }

  // De-duplicate early
  let deduped = uniqBy(items, (v) => v.form);

  // Attach frequency counts (for scoring) using local freqMap
  if (freqMap) {
    deduped = deduped.map(v => {
      const count = freqMap!.get(v.form) ?? 0;
      return { ...v, count, score: count };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return deduped.slice(0, cap);
}

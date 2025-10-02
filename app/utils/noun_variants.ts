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

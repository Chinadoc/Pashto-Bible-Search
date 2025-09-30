// app/utils/verb_variants.ts
// Next.js utility module - adapted from Edge function
// Generates verb variants across present/past/subj/future, participles,
// with irregular support and compound (stative/dynamic) flags when discoverable.
// De-dupes and frequency-scores outputs.

export type Variant = {
  form: string;
  label: string;  // e.g., "1sg Present", "Past Participle", "Stative Compound"
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

// Helper verbs that should not get compound expansions
const HELPER_VERBS = new Set(["کول", "کېدل", "وهل", "خوړل", "ساتل"]);

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

function labelFromInfo(info?: string): string {
  if (!info) return "Form";
  const s = info.toLowerCase();
  // Try to normalize common grammatical_info encodings to concise labels
  if (s.includes("present")) return s.includes("1sg") ? "1sg Present"
    : s.includes("2sg") ? "2sg Present"
    : s.includes("3sg") ? "3sg Present"
    : s.includes("pl") ? "Plural Present"
    : "Present";
  if (s.includes("past_participle")) return "Past Participle";
  if (s.includes("past")) return "Past";
  if (s.includes("subj")) return "Subjunctive";
  if (s.includes("future")) return "Future";
  if (s.includes("imperative")) return "Imperative";
  if (s.includes("progressive")) return "Progressive";
  if (s.includes("perfect")) return "Perfect";
  return info;
}

// Import data from the global data cache
import { getData } from '../lib/data/load';

// We'll get the data from the global data cache instead of importing directly
let freqMap: Map<string, number> | null = null;
let inflectMap: Map<string, any[]> | null = null;
let dictionaryData: any[] | null = null;

// Initialize the maps
async function initializeMaps() {
  if (!freqMap) {
    const { frequencyMap } = await getData();
    freqMap = frequencyMap;
  }
  if (!inflectMap) {
    // Load the actual inflections data that was pre-computed!
    const { inflectionsByBase } = await getData();
    inflectMap = inflectionsByBase;
    console.log('Loaded inflections for', inflectMap.size, 'verbs');
  }
  if (!dictionaryData) {
    const { dictionary } = await getData();
    dictionaryData = dictionary;
  }
}

export async function generateVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 60));
  const includeCompound = !!opts?.includeCompound;
  const base = rootOrInfinitive.trim();

  // Initialize maps if needed
  await initializeMaps();

  const out: Variant[] = [];

  // 2) Use inflections (preferred) for full surfaces - adapted from database
  const inflRows = inflectMap?.get(base) || [];

  for (const row of inflRows) {
    if (!row.form) continue;
    const info = (row.category ?? "") as string;
    const flags: string[] = [];
    if (/stative/i.test(info)) flags.push("stative");
    if (/dynamic/i.test(info)) flags.push("dynamic");
    if (/compound|comp\./i.test(info)) flags.push("compound");
    if (/irreg/i.test(info)) flags.push("irregular");

    const label = labelFromInfo(info);

    out.push({
      form: row.form,
      label: label,
      pos: "verb",
      flags: flags.length ? flags : undefined,
    });
  }

  // 3) Fallback to dictionary (minimal seed if inflections absent)
  if (!out.length) {
    // Check if base exists in dictionary as verb
    const dictEntry = dictionaryData?.find((entry: any) =>
      entry.pashto?.toLowerCase() === base.toLowerCase() ||
      entry.romanized?.toLowerCase().includes(base.toLowerCase())
    );

    if (dictEntry) {
      // Seed some generic labels with lemma/root itself
      out.push({ form: base, label: "Infinitive", pos: "verb" });
    } else {
      // If not in dictionary either, create some basic forms based on common patterns
      const basicForms = [
        { form: base, label: "Infinitive" }
      ];

      // Only add compound forms if base is not a helper verb
      if (!HELPER_VERBS.has(base)) {
        basicForms.push(
          { form: `${base} کول`, label: "Compound Form" },
          { form: `${base} کېدل`, label: "Stative Form" }
        );
      }

      basicForms.forEach(f => out.push({ ...f, pos: "verb" }));
    }
  }

  // 4) Generate some basic present tense forms if we have very few forms
  if (out.length < 5) {
    const basicPresentForms = [
      { form: `${base}م`, label: "1sg Present" },
      { form: `${base}و`, label: "1pl Present" },
      { form: `${base}ې`, label: "2sg Present" },
      { form: `${base}ئ`, label: "2pl Present" },
      { form: `${base}ي`, label: "3sg Present" },
      { form: `${base}ي`, label: "3pl Present" }
    ];

    // Only add forms that don't already exist
    basicPresentForms.forEach(f => {
      const exists = out.some(existing => existing.form === f.form);
      if (!exists) {
        out.push({ ...f, pos: "verb" });
      }
    });
  }

  // 5) Optional compound expansions: only when the base is *not* a helper verb.
  if (includeCompound && !HELPER_VERBS.has(base)) {
    // Very conservative additions; these will be removed if inflections already include them
    const compoundForms: Variant[] = [
      { form: `${base} کول`, label: "Dynamic Compound", pos: "verb", flags: ["compound", "dynamic"] },
      { form: `${base} کېدل`, label: "Stative Compound", pos: "verb", flags: ["compound", "stative"] },
    ];
    out.push(...compoundForms);
  }

  // De-dupe
  let deduped = uniqBy(out, v => v.form);

  // Fallback for fused stative compounds ending in ول (e.g., ګرمول)
  // This provides basic coverage until inflections DB is refreshed
  if (deduped.length < 3 && /[^ ]ول$/.test(base)) {
    const comp = base.slice(0, -2).trim();
    const impfStem = `${comp}و`;    // ګرمو-
    const perfStem = `${comp} کړ`;  // ګرم کړ-
    const seed = [
      { form: `${impfStem}م`, label: "1sg Present", pos: "verb" as const, flags: ["compound","stative"] },
      { form: `${impfStem}ي`, label: "3sg Present", pos: "verb" as const, flags: ["compound","stative"] },
      { form: `${perfStem}م`, label: "1sg Subjunctive", pos: "verb" as const, flags: ["compound","stative"] },
      { form: `${comp} کړل`, label: "Perfective Root", pos: "verb" as const, flags: ["compound","stative"] },
      { form: `${comp} کړی`, label: "Past Participle", pos: "verb" as const, flags: ["compound","stative"] },
    ];
    deduped.push(...seed);
    deduped = uniqBy(deduped, v => v.form);
  }

  // 5) Frequency scoring using local freqMap
  if (freqMap) {
    deduped = deduped.map(v => {
      const count = freqMap!.get(v.form) ?? 0;
      return { ...v, count, score: count };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return deduped.slice(0, cap);
}

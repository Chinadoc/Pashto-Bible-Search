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

// Import LingDocs conjugation engine and types
import { conjugateVerb } from '../lib/lingdocs/library';
import * as LingdocsTypes from '../lib/lingdocs/types';

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

// Convert LingDocs DictionaryEntry to our Variant format
function lingdocsToVariant(lingdocsForm: LingdocsTypes.PsString, label: string): Variant {
  return {
    form: lingdocsForm.p,
    label,
    pos: 'verb',
    romanized: lingdocsForm.f,
    count: freqMap?.get(lingdocsForm.p) || 0,
  };
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

  try {
    // 1) Try LingDocs professional conjugation engine first
    console.log('Attempting LingDocs conjugation for:', base);

    // Find the verb in our dictionary
    const dictEntry = dictionaryData?.find((entry: any) => {
      const pashtoMatch = entry.pashto?.toLowerCase() === base.toLowerCase();
      const romanizedMatch = entry.romanized?.toLowerCase().includes(base.toLowerCase());
      return pashtoMatch || romanizedMatch;
    });

    if (dictEntry) {
      // Create LingDocs DictionaryEntry format
      const lingdocsEntry: LingdocsTypes.DictionaryEntry = {
        ts: Date.now(),
        i: dictEntry.id || 0,
        p: dictEntry.pashto || base,
        f: dictEntry.romanized || base,
        g: dictEntry.romanized || base,
        e: dictEntry.english || '',
        c: dictEntry.pos === 'verb' ? 'v.' : 'v.t.',
        // Add other required fields with defaults
        r: dictEntry.frequency || 4,
      };

      // Use LingDocs conjugation engine
      const conjugation: LingdocsTypes.VerbOutput = conjugateVerb(lingdocsEntry);

      // Extract all forms from the conjugation
      if (conjugation && typeof conjugation === 'object') {
        // Handle different conjugation types (simple, compound, transitive)
        const forms: Array<{form: LingdocsTypes.PsString, label: string}> = [];

        if ('imperfective' in conjugation && conjugation.imperfective) {
          // Extract forms from imperfective aspect - just get the string form
          const impf = conjugation.imperfective;
          if (impf.nonImperative) {
            const formStr = typeof impf.nonImperative === 'string' ? impf.nonImperative :
                           (impf.nonImperative as any)?.p || String(impf.nonImperative);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Present' });
          }
          if (impf.past) {
            const formStr = typeof impf.past === 'string' ? impf.past :
                           (impf.past as any)?.p || String(impf.past);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Past' });
          }
          if (impf.future) {
            const formStr = typeof impf.future === 'string' ? impf.future :
                           (impf.future as any)?.p || String(impf.future);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Future' });
          }
          if (impf.habitualPast) {
            const formStr = typeof impf.habitualPast === 'string' ? impf.habitualPast :
                           (impf.habitualPast as any)?.p || String(impf.habitualPast);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Habitual Past' });
          }
          if (impf.imperative) {
            const formStr = typeof impf.imperative === 'string' ? impf.imperative :
                           (impf.imperative as any)?.p || String(impf.imperative);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Imperative' });
          }
        }

        if ('perfective' in conjugation && conjugation.perfective) {
          // Extract forms from perfective aspect
          const perf = conjugation.perfective;
          if (perf.nonImperative) {
            const formStr = typeof perf.nonImperative === 'string' ? perf.nonImperative :
                           (perf.nonImperative as any)?.p || String(perf.nonImperative);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Perfective Present' });
          }
          if (perf.past) {
            const formStr = typeof perf.past === 'string' ? perf.past :
                           (perf.past as any)?.p || String(perf.past);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Perfective Past' });
          }
          if (perf.future) {
            const formStr = typeof perf.future === 'string' ? perf.future :
                           (perf.future as any)?.p || String(perf.future);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Perfective Future' });
          }
          if (perf.habitualPast) {
            const formStr = typeof perf.habitualPast === 'string' ? perf.habitualPast :
                           (perf.habitualPast as any)?.p || String(perf.habitualPast);
            forms.push({ form: { p: formStr, f: formStr }, label: 'Perfective Habitual Past' });
          }
        }

        // Convert to our format
        forms.forEach(({ form, label }) => {
          if (form && typeof form === 'object' && form.p) {
            out.push(lingdocsToVariant(form, label));
          }
        });

        console.log(`Generated ${forms.length} LingDocs conjugations for ${base}`);
      }
    }

  } catch (error) {
    console.warn('LingDocs conjugation failed, falling back to legacy method:', error);
  }

  // 2) Fallback to our current inflection system if LingDocs failed
  if (out.length === 0) {
    console.log('Using fallback inflection system for:', base);
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
  }

  // 3) Final fallback to dictionary lookup
  if (out.length === 0) {
    const dictEntry = dictionaryData?.find((entry: any) =>
      entry.pashto?.toLowerCase() === base.toLowerCase() ||
      entry.romanized?.toLowerCase().includes(base.toLowerCase())
    );

    if (dictEntry) {
      out.push({ form: base, label: "Infinitive", pos: "verb" });
    } else {
      // Basic pattern-based fallback for unknown verbs
      const basicForms = [
        { form: base, label: "Infinitive" },
        { form: `${base}م`, label: "1sg Present" },
        { form: `${base}ي`, label: "3sg Present" },
        { form: `${base}ل`, label: "Past" }
      ];

      basicForms.forEach(f => out.push({ ...f, pos: "verb" }));
    }
  }

  // De-dupe and score
  let deduped = uniqBy(out, v => v.form);

  // Frequency scoring
  if (freqMap) {
    deduped = deduped.map(v => {
      const count = freqMap!.get(v.form) ?? 0;
      return { ...v, count, score: count };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return deduped.slice(0, cap);
}

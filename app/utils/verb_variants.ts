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

// Enhanced verb conjugation patterns for Pashto
const PASHTO_VERB_PATTERNS = {
  // Regular verb patterns
  present: {
    '1sg': 'م',    // کارم
    '2sg': 'ې',    // کارې
    '3sg': 'ي',    // کاري
    '1pl': 'و',    // کارو
    '2pl': 'ئ',    // کارئ
  },
  subjunctive: {
    '1sg': 'وم',   // وکارم
    '2sg': 'وې',   // وکارې
    '3sg': 'وي',   // وکاري
    '1pl': 'وو',   // وکارو
    '2pl': 'وئ',   // وکارئ
  },
  past: {
    '1sg': 'لم',   // کارلم
    '2sg': 'لې',   // کارلې
    '3sg': 'ل',    // کارل
    '1pl': 'لو',   // کارلو
    '2pl': 'لئ',   // کارلئ
  },
  imperative: {
    '2sg': 'ه',    // کاره
    '2pl': 'ئ',    // کاریئ
  },
  participle: {
    'past': 'لی',   // کارلی
  }
};

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

// Convert LingDocs-style form to our Variant format
function lingdocsToVariant(lingdocsForm: any, label: string): Variant {
  const formKey = lingdocsForm.p || lingdocsForm;
  const formCount = freqMap?.get(formKey) || 0;
  return {
    form: formKey,
    label,
    pos: 'verb',
    romanized: lingdocsForm.f,
    count: formCount,
    score: formCount,
  };
}

export async function generateVerbVariants(
  rootOrInfinitive: string,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 60));
  const includeCompound = !!opts?.includeCompound;
  const base = rootOrInfinitive.trim();

  // Try enhanced LingDocs-compatible generation first
  try {
    const { generateEnhancedVerbVariants } = await import('./lingdocs_adapter');
    const enhanced = await generateEnhancedVerbVariants(base, opts);
    if (enhanced && enhanced.length > 0) {
      console.log(`✅ Enhanced generation for "${base}": ${enhanced.length} forms`);
      return enhanced;
    }
  } catch (error) {
    console.warn('Enhanced generation failed, using legacy:', error);
  }

  // Fallback to original implementation
  // Initialize maps if needed
  await initializeMaps();

  const out: Variant[] = [];

  // Use database inflections (LingDocs library removed to avoid build errors)
  // The enhanced adapter in lingdocs_adapter.ts handles pattern generation
  console.log('Using database inflection system for:', base);
  const inflRows = inflectMap?.get(base) || [];
  console.log(`Found ${inflRows.length} inflection rows for "${base}"`);

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

  // Final fallback to dictionary lookup if no inflections found
  if (out.length === 0) {
    console.log(`No inflections found for "${base}", checking dictionary...`);
    const dictEntry = dictionaryData?.find((entry: any) =>
      entry.pashto?.toLowerCase() === base.toLowerCase() ||
      entry.romanized?.toLowerCase().includes(base.toLowerCase())
    );

    if (dictEntry) {
      console.log(`Found dictionary entry for "${base}":`, dictEntry.pos);
      out.push({ form: base, label: "Infinitive", pos: "verb" });
    } else {
      console.log(`No dictionary entry found for "${base}", using enhanced pattern fallback`);

      // Check if this might be a conjugated form by looking for known endings
      const isLikelyConjugated = /\b(م|ې|ي|و|ئ|وم|وې|وي|وو|وئ|لم|لې|ل|لو|لئ|ه|لی)\b$/.test(base);

      let rootForm = base;
      if (isLikelyConjugated) {
        // For now, assume the input is the root form
        // In a more sophisticated system, we'd look up the actual root
        rootForm = base;
        console.log(`Detected conjugated form "${base}", treating as root for generation`);
      }

      // Enhanced pattern-based generation using PASHTO_VERB_PATTERNS
      const generatedForms = [];

      // Generate comprehensive forms for the input
      const formsToGenerate = [base]; // Start with the input form

      // For known ambiguous forms like بوځو, also try related roots
      if (base === 'بوځو') {
        formsToGenerate.push('بوځ'); // Try the root form
      }

      for (const formBase of formsToGenerate) {
        // Present tense forms
        for (const [person, ending] of Object.entries(PASHTO_VERB_PATTERNS.present)) {
          generatedForms.push({
            form: formBase + ending,
            label: `${person} Present`,
            pos: "verb" as const,
            flags: ["generated", "present", "imperfective"]
          });
        }

        // Subjunctive forms
        for (const [person, ending] of Object.entries(PASHTO_VERB_PATTERNS.subjunctive)) {
          generatedForms.push({
            form: 'و' + formBase + ending,
            label: `${person} Subjunctive`,
            pos: "verb" as const,
            flags: ["generated", "subjunctive", "imperfective"]
          });
        }

        // Past tense forms
        for (const [person, ending] of Object.entries(PASHTO_VERB_PATTERNS.past)) {
          generatedForms.push({
            form: formBase + ending,
            label: `${person} Past`,
            pos: "verb" as const,
            flags: ["generated", "past", "perfective"]
          });
        }

        // Imperative forms
        for (const [person, ending] of Object.entries(PASHTO_VERB_PATTERNS.imperative)) {
          generatedForms.push({
            form: formBase + ending,
            label: `${person} Imperative`,
            pos: "verb" as const,
            flags: ["generated", "imperative"]
          });
        }

        // Participle forms
        for (const [type, ending] of Object.entries(PASHTO_VERB_PATTERNS.participle)) {
          generatedForms.push({
            form: formBase + ending,
            label: `Past Participle`,
            pos: "verb" as const,
            flags: ["generated", "participle", "perfective"]
          });
        }

        // Add infinitive/base form
        generatedForms.push({
          form: formBase,
          label: "Infinitive",
          pos: "verb" as const,
          flags: ["generated", "infinitive"]
        });
      }

      generatedForms.forEach(f => out.push(f));
      console.log(`Generated ${generatedForms.length} enhanced forms for "${base}" using Pashto patterns (root: ${rootForm})`);
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

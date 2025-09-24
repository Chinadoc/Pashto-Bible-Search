// supabase/functions/pashto-processor/verb_variants.ts
// Deno Edge Function module
// Generates verb variants across present/past/subj/future, participles,
// with irregular support and compound (stative/dynamic) flags when discoverable.
// De-dupes and frequency-scores outputs.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type Variant = {
  form: string;
  label: string;  // e.g., "1sg Present", "Past Participle", "Stative Compound"
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type DB = ReturnType<typeof createClient>;

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

export async function generateVerbVariants(
  rootOrInfinitive: string,
  db: DB,
  opts?: { cap?: number; includeCompound?: boolean }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 60));
  const includeCompound = !!opts?.includeCompound;
  const base = rootOrInfinitive.trim();

  // 1) Try irregular first
  const irregular = await db.from("irregular_verbs")
    .select("verb_root, roots, stems, past_participle")
    .or(`verb_root.eq.${base},roots.ilike.%${base}%`)
    .limit(1);

  const out: Variant[] = [];

  if (irregular.data?.length) {
    const irr = irregular.data[0];
    if (irr.past_participle) {
      out.push({
        form: irr.past_participle,
        label: "Past Participle",
        pos: "verb",
        flags: ["irregular"],
      });
    }
  }

  // 2) Use inflections (preferred) for full surfaces
  const inflRes = await db.from("inflections")
    .select("inflected_form, grammatical_info")
    .eq("base_word", base)
    .limit(500);

  for (const row of inflRes.data ?? []) {
    if (!row.inflected_form) continue;
    const info = (row.grammatical_info ?? "") as string;
    const flags: string[] = [];
    if (/stative/i.test(info)) flags.push("stative");
    if (/dynamic/i.test(info)) flags.push("dynamic");
    if (/compound|comp\./i.test(info)) flags.push("compound");
    if (/irreg/i.test(info)) flags.push("irregular");

    const label = labelFromInfo(info);
    console.log(`DEBUG: Adding verb form "${row.inflected_form}" with label "${label}" from grammatical_info "${info}"`);

    out.push({
      form: row.inflected_form,
      label: label,
      pos: "verb",
      flags: flags.length ? flags : undefined,
    });
  }

  // 3) Fallback to verbs_lexicon (minimal seed if inflections absent)
  if (!out.length) {
    console.log(`DEBUG: No inflection data found for "${base}", checking verbs_lexicon`);
    const vlex = await db.from("verbs_lexicon")
      .select("*")
      .or(`lemma.eq.${base},root.eq.${base}`)
      .limit(1);
    if (vlex.data?.length) {
      console.log(`DEBUG: Found "${base}" in verbs_lexicon, adding as infinitive`);
      // Seed some generic labels with lemma/root itself
      out.push({ form: base, label: "Infinitive", pos: "verb" });
    } else {
      console.log(`DEBUG: "${base}" not found in verbs_lexicon, generating basic forms`);
      // If not in verbs_lexicon either, create some basic forms based on common patterns
      // This ensures we always return some verb forms for debugging
      const basicForms = [
        { form: base, label: "Infinitive" },
        { form: `${base} کول`, label: "Compound Form" },
        { form: `${base} کېدل`, label: "Stative Form" }
      ];
      console.log(`DEBUG: Generated ${basicForms.length} basic forms:`, basicForms.map(f => f.form));
      basicForms.forEach(f => out.push({ ...f, pos: "verb" }));
    }
  }

  // 4) Generate some basic present tense forms if we have very few forms
  // This is a simple heuristic to ensure we always have some present tense forms
  if (out.length < 5) {
    console.log(`DEBUG: Only ${out.length} forms generated, adding basic present tense forms`);
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
        console.log(`DEBUG: Adding basic form "${f.form}" with label "${f.label}"`);
        out.push({ ...f, pos: "verb" });
      }
    });
  }

  // 5) Optional compound expansions: only when the base is *not* a helper verb.
  // We also rely primarily on inflections to surface real compound forms when they exist.
  if (includeCompound && !HELPER_VERBS.has(base)) {
    // Very conservative additions; these will be removed if inflections already include them
    // These flags help the UI distinguish
    const compoundForms: Variant[] = [
      { form: `${base} کول`, label: "Dynamic Compound", pos: "verb", flags: ["compound", "dynamic"] },
      { form: `${base} کېدل`, label: "Stative Compound", pos: "verb", flags: ["compound", "stative"] },
      // "squished" forms vary orthographically and usually come from inflection rows; do not guess too hard
    ];
    out.push(...compoundForms);
  }

  // De-dupe
  let deduped = uniqBy(out, v => v.form);

  // 5) Frequency scoring
  const forms = deduped.slice(0, 200).map(v => v.form);
  if (forms.length) {
    const freqRes = await db.from("word_frequencies")
      .select("pashto_word, frequency_count")
      .in("pashto_word", forms);

    const freqMap = new Map<string, number>();
    for (const row of freqRes.data ?? []) {
      freqMap.set(row.pashto_word, row.frequency_count ?? 0);
    }

    deduped = deduped.map(v => {
      const count = freqMap.get(v.form) ?? 0;
      return { ...v, count, score: count };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return deduped.slice(0, cap);
}


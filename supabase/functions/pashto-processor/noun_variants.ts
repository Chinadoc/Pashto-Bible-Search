// supabase/functions/pashto-processor/noun_variants.ts
// Deno Edge Function module
// Generates LingDocs-aligned noun variants (plural/case) with de-dupe + scoring

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type Variant = {
  form: string;
  label: string;  // e.g., "Plural Direct", "Oblique"
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type DB = ReturnType<typeof createClient>;

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

export async function generateNounVariants(
  rootOrLemma: string,
  db: DB,
  opts?: { cap?: number }
): Promise<Variant[]> {
  const cap = Math.max(1, Math.min(opts?.cap ?? 30, 50)); // sensible upper bound
  const base = rootOrLemma.trim();

  // Prefer inflections table (authoritative), fall back lightly to nouns_lexicon
  const [inflectRes, lexiconRes] = await Promise.all([
    db.from("inflections")
      .select("inflected_form, grammatical_info")
      .eq("base_word", base)
      .limit(200),
    db.from("nouns_lexicon")
      .select("*")
      .ilike("lemma", base)
      .limit(1),
  ]);

  const items: Variant[] = [];

  if (inflectRes.data?.length) {
    for (const row of inflectRes.data) {
      if (!row.inflected_form) continue;
      items.push({
        form: row.inflected_form,
        label: labelFromInfo(row.grammatical_info),
        pos: "noun",
      });
    }
  }

  // Optionally seed base form(s) (ensures at least one direct/lemma form)
  if (!items.length) {
    items.push({ form: base, label: "Direct", pos: "noun" });
  } else {
    // Also ensure lemma present
    items.unshift({ form: base, label: "Lemma", pos: "noun" });
  }

  // De-duplicate early
  let deduped = uniqBy(items, (v) => v.form);

  // Attach frequency counts (for scoring)
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

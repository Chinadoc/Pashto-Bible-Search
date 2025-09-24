// supabase/functions/pashto-processor/index.ts
// Deno Edge Function entry: orchestrates a 3-line pipeline
// 1) Fast frequency path
// 2) Conditionally gated fuzzy verse search
// 3) Variants (on demand) via noun_variants / verb_variants modules

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateNounVariants, type Variant as NVar } from "./noun_variants.ts";
import { generateVerbVariants, type Variant as VVar } from "./verb_variants.ts";

type Variant = NVar | VVar;

type Processed = {
  normalized: string;
  searchType: 'fast'|'fuzzy'|'enhanced';
  pos?: 'verb'|'noun'|'adjective'|'other';
  variants: string[];
  variantGroups?: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] };
  variantDetails?: Array<{
    type: string;
    description?: string;
    count: number;
    groups?: Array<{ key: string; label: string; items: Variant[] }>
  }>;
  frequency?: number;
  romanization?: string;
  root?: string;
  // Back-compat (existing function used to include this sometimes)
  fuzzyResults?: { ref: string; text: string; testament?: 'ot'|'nt' }[];
};

type EdgeResponse = Processed;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function isLatinOnly(s: string): boolean {
  // Latin letters, spaces, hyphen, apostrophe, combining; no Arabic/Pashto codepoints
  return /^[\p{Script=Latin}\s'\-]+$/u.test(s);
}

function ok<T>(data: T, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json; charset=utf-8", ...(init?.headers ?? {}) },
  });
}

function err(message: string, status = 400) {
  return ok({ error: message }, { status });
}

// Simple in-memory cache (1 hour TTL, size-bounded)
type CacheEntry = { value: EdgeResponse; expiresAt: number };
const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 500;

function getCache(key: string): EdgeResponse | null {
  const c = CACHE.get(key);
  if (!c) return null;
  if (Date.now() > c.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return c.value;
}
function setCache(key: string, value: EdgeResponse) {
  if (CACHE.size >= CACHE_MAX) {
    // drop a random key (simple + fast)
    const k = CACHE.keys().next().value;
    if (k) CACHE.delete(k);
  }
  CACHE.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return err("POST only", 405);
    }
    const { formPs, includeRelated, enableFuzzy } = await req.json()
      .catch(() => ({} as { formPs?: string; includeRelated?: boolean; enableFuzzy?: boolean }));

    const raw = (formPs ?? "").trim();
    if (!raw) return err("Missing formPs");

    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
    });

    // Normalize: detect latin-only and, if so, try romanized_dictionary/dictionary. Otherwise pass through.
    const latinOnly = isLatinOnly(raw);
    let normalized = raw;
    let romanization: string | undefined;

    if (latinOnly) {
      const rawRom = raw.toLowerCase();
      const pat = `%${rawRom}%`;

      const [romRes, dictRes] = await Promise.all([
        db.from("romanized_dictionary")
          .select("romanized,pashto")
          .ilike("romanized", pat)
          .limit(1),
        db.from("dictionary")
          .select("romanized,pashto")
          .ilike("romanized", pat)
          .limit(1),
      ]);

      const pick = romRes.data?.[0] ?? dictRes.data?.[0];
      if (pick?.pashto) {
        normalized = pick.pashto;
        romanization = pick.romanized;
        console.log(`DEBUG: Romanized lookup hit: "${raw}" → "${normalized}" (via "${pick.romanized}")`);
      } else {
        console.log(`DEBUG: Romanized lookup missed for "${raw}" with pattern "${pat}"`);
      }
    }

    const cacheKey = JSON.stringify({
      v: 2, // bump if payload shape changes
      normalized,
      includeRelated: !!includeRelated,
      fuzzyGate: !!(enableFuzzy || latinOnly),
    });
    const cached = getCache(cacheKey);
    if (cached) {
      return ok(cached);
    }

    // Parallel reads for fast path
    const freqPromise = db.from("word_frequencies")
      .select("frequency_count")
      .eq("pashto_word", normalized)
      .limit(1);

    const dictPromise = db.from("dictionary")
      .select("pos, pashto, romanized")
      .eq("pashto", normalized)
      .limit(1);

    // Fuzzy gating
    const shouldFuzzy = !!(enableFuzzy || latinOnly);

    // Try fuzzy RPC if allowed (be tolerant if not installed)
    const fuzzyPromise = shouldFuzzy
      ? db.rpc("search_verses_similar", {
          q: normalized,
          scope: "all",
          max_results: 10,
        })
      : Promise.resolve({ data: null, error: null } as any);

    // Prepare variant generation (gated)
    let posGuess: Processed["pos"] = undefined;

    const [freqRes, dictRes, fuzzyRes] = await Promise.all([
      freqPromise,
      dictPromise,
      fuzzyPromise,
    ]);

    // POS resolution (from dictionary first, fall back heuristics)
    if (dictRes.data?.[0]?.pos) {
      const posLower = String(dictRes.data[0].pos).toLowerCase();
      console.log(`DEBUG: Found "${normalized}" in dictionary with POS "${dictRes.data[0].pos}"`);
      if (posLower.startsWith("verb")) posGuess = "verb";
      else if (posLower.startsWith("noun")) posGuess = "noun";
      else if (posLower.startsWith("adj")) posGuess = "adjective";
      else posGuess = "other";
      // may also refine romanization from dictionary
      romanization = romanization ?? dictRes.data[0].romanized ?? undefined;
    } else {
      // If not in dictionary, attempt to detect via lexicons
      console.log(`DEBUG: "${normalized}" not found in dictionary, checking lexicons`);
      const [vlex, nlex] = await Promise.all([
        db.from("verbs_lexicon").select("lemma").ilike("lemma", normalized).limit(1),
        db.from("nouns_lexicon").select("lemma").ilike("lemma", normalized).limit(1),
      ]);
      console.log(`DEBUG: Found ${vlex.data?.length || 0} verb lexicon entries and ${nlex.data?.length || 0} noun lexicon entries`);
      if (vlex.data?.length) posGuess = "verb";
      else if (nlex.data?.length) posGuess = "noun";
      else {
        posGuess = "other";
        console.log(`DEBUG: "${normalized}" not found in either lexicon, defaulting to "other"`);
      }
    }

    const frequency = freqRes.data?.[0]?.frequency_count ?? undefined;

    // Variants (only when requested)
    let variantGroups: Processed["variantGroups"] = undefined;
    let variantDetails: Processed["variantDetails"] = undefined;

    if (includeRelated) {
      const groups: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] } = {};

      // Debug logging
      console.log(`DEBUG: POS guess for "${normalized}": "${posGuess}"`);

      if (posGuess === "noun") {
        const nouns = await generateNounVariants(normalized, db, { cap: 30 });
        console.log(`DEBUG: Generated ${nouns.length} noun variants`);
        groups.nouns = nouns;
      } else if (posGuess === "verb") {
        const verbs = await generateVerbVariants(normalized, db, { cap: 30, includeCompound: true });
        console.log(`DEBUG: Generated ${verbs.length} verb variants`);
        groups.verbs = verbs;
      } else {
        // Unknown POS → try both conservatively; keep whichever yields more signal
        const [nouns, verbs] = await Promise.all([
          generateNounVariants(normalized, db, { cap: 20 }),
          generateVerbVariants(normalized, db, { cap: 20, includeCompound: true }),
        ]);
        console.log(`DEBUG: Generated ${nouns.length} noun variants and ${verbs.length} verb variants for unknown POS`);
        if (nouns.length) groups.nouns = nouns;
        if (verbs.length) groups.verbs = verbs;
      }

      // If no variants were generated, force generate verb variants as fallback
      if (!groups.nouns?.length && !groups.verbs?.length) {
        console.log(`DEBUG: No variants generated, forcing verb variant generation for "${normalized}"`);
        const verbs = await generateVerbVariants(normalized, db, { cap: 30, includeCompound: true });
        console.log(`DEBUG: Forced generation resulted in ${verbs.length} verb variants`);
        groups.verbs = verbs;
      }

      // Build variantDetails (grouped + counts)
      const details: Processed["variantDetails"] = [];
      if (groups.nouns?.length) {
        details.push({
          type: "noun",
          count: groups.nouns.length,
          groups: [{ key: "n-core", label: "Noun Paradigm", items: groups.nouns }],
        });
      }
      if (groups.verbs?.length) {
        details.push({
          type: "verb",
          count: groups.verbs.length,
          groups: [{ key: "v-core", label: "Verb Surfaces", items: groups.verbs }],
        });
      }
      variantGroups = groups;
      variantDetails = details.length ? details : undefined;
    }

    // Compact variants list (0–30) for highlights
    const compactVariants: string[] = [];
    if (variantGroups) {
      const pool = [
        ...(variantGroups.nouns ?? []),
        ...(variantGroups.verbs ?? []),
        ...(variantGroups.other ?? []),
      ];
      for (const v of pool) {
        if (!compactVariants.includes(v.form)) compactVariants.push(v.form);
        if (compactVariants.length >= 30) break;
      }
    }
    if (!compactVariants.length) {
      compactVariants.push(normalized);
    }

    // Fuzzy results (tolerant if RPC missing or returns null)
    let fuzzyResults: Processed["fuzzyResults"] = undefined;
    if (shouldFuzzy && Array.isArray(fuzzyRes.data)) {
      // Expect rpc to deliver shape: { ref, text, testament? }
      fuzzyResults = fuzzyRes.data.slice(0, 10);
    }

    // Compute searchType
    const searchType: Processed["searchType"] =
      includeRelated ? "enhanced"
      : (shouldFuzzy ? "fuzzy" : "fast");

    const payload: EdgeResponse = {
      normalized,
      searchType,
      pos: posGuess,
      variants: compactVariants,
      variantGroups,
      variantDetails,
      frequency,
      romanization,
      root: normalized, // keep root = normalized for now
      fuzzyResults,     // present only if gated fuzzy ran & returned data
    };

    setCache(cacheKey, payload);
    return ok(payload);
  } catch (e) {
    // Never throw; keep the function tolerant
    return err(`Processor error: ${String(e)}`, 500);
  }
});

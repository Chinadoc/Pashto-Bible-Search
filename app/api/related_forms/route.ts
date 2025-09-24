// app/api/related_forms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Variant = {
  form: string;
  label: string;
  pos: 'noun'|'verb'|'adjective'|'other';
  score?: number;
  count?: number;
  romanized?: string;
  flags?: string[];
};

type VariantDetailGroup = { key: string; label: string; items: Variant[] };
type VariantDetails = Array<{ type: string; description?: string; count: number; groups?: VariantDetailGroup[] }>;

type RelatedFormsResponse = {
  // legacy (back-compat)
  root: string;
  forms: { form: string; count?: number; label?: string; pos?: string }[];
  total: number;
  ms: number;
  // new — mirrors Edge function
  variantDetails?: VariantDetails;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 15-minute naive cache
const TTL = 15 * 60 * 1000;
const CACHE = new Map<string, { value: RelatedFormsResponse; until: number }>();

function isLatinOnly(s: string): boolean {
  return /^[\p{Script=Latin}\s'\-]+$/u.test(s);
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await req.json().catch(() => ({}));
    // Keep contract tolerant: accept common aliases without breaking the existing caller
    const input =
      body?.form ?? body?.word ?? body?.lemma ?? body?.root ?? body?.query ?? "";

    const key = JSON.stringify({ k: input });
    const hit = CACHE.get(key);
    if (hit && Date.now() < hit.until) {
      return NextResponse.json(hit.value, { status: 200 });
    }

    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Ask the Edge function for structured variants (keeps parity with search flow)
    const efRes = await fetch(`${SUPABASE_URL}/functions/v1/pashto-processor`, {
      method: "POST",
        headers: {
        "content-type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        formPs: String(input || "").trim(),
        includeRelated: true,
        enableFuzzy: isLatinOnly(String(input || "")), // harmless here
      }),
    });

    let variantDetails: VariantDetails | undefined;
    let root = String(input || "").trim();
    let forms: { form: string; count?: number; label?: string; pos?: string }[] = [];

    if (efRes.ok) {
      const processed = await efRes.json();
      root = processed?.root || processed?.normalized || root;
      // Prefer grouped variants from the Edge function (already deduped/scored)
      const merged: Variant[] = [
        ...(processed?.variantGroups?.nouns ?? []),
        ...(processed?.variantGroups?.verbs ?? []),
        ...(processed?.variantGroups?.other ?? []),
      ];
      forms = merged.map(v => ({ form: v.form, count: v.count, label: v.label, pos: v.pos }));

      // Align to the mirrored structure so the UI can render either source
      if (processed?.variantDetails) {
        variantDetails = processed.variantDetails;
      } else if (merged.length) {
        // Synthesize a minimal structure if not present
        const nouns = merged.filter(v => v.pos === "noun");
        const verbs = merged.filter(v => v.pos === "verb");
        const groups: VariantDetails = [];
        if (nouns.length) groups.push({ type: "noun", count: nouns.length, groups: [{ key: "n-core", label: "Noun Paradigm", items: nouns }] });
        if (verbs.length) groups.push({ type: "verb", count: verbs.length, groups: [{ key: "v-core", label: "Verb Surfaces", items: verbs }] });
        variantDetails = groups.length ? groups : undefined;
      }
    } else {
      // Edge unavailable → degrade gracefully (return minimal legacy structure)
      forms = [{ form: root, label: "Form" }];
    }

    // Enrich with form_occurrences (PR #9: pashto_form + frequency)
    const uniqueForms = Array.from(new Set(forms.map(f => f.form))).slice(0, 200);
    if (uniqueForms.length) {
      const { data: occ } = await db.from("form_occurrences")
        .select("pashto_form, frequency")
        .in("pashto_form", uniqueForms);
      const occMap = new Map<string, number>();
      for (const r of occ ?? []) occMap.set(r.pashto_form, r.frequency ?? 0);

      forms = forms.map(f => ({ ...f, count: occMap.get(f.form) ?? f.count }));
      if (variantDetails) {
        for (const block of variantDetails) {
          for (const g of (block.groups ?? [])) {
            g.items = g.items.map(v => ({
              ...v,
              count: occMap.get(v.form) ?? v.count,
              score: (occMap.get(v.form) ?? v.count ?? 0),
            }));
          }
        }
      }
    }

    // Enrich with POS if missing (verbs_lexicon / nouns_lexicon)
    const missingPos = forms.filter(f => !f.pos);
    if (missingPos.length) {
      const sample = missingPos.map(f => f.form).slice(0, 200);
      const [vlex, nlex] = await Promise.all([
        db.from("verbs_lexicon").select("lemma").in("lemma", sample),
        db.from("nouns_lexicon").select("lemma").in("lemma", sample),
      ]);
      const verbs = new Set((vlex.data ?? []).map(r => r.lemma));
      const nouns = new Set((nlex.data ?? []).map(r => r.lemma));
      forms = forms.map(f => f.pos ? f : {
        ...f,
        pos: verbs.has(f.form) ? "verb" : (nouns.has(f.form) ? "noun" : undefined)
      });
    }

    const total = forms.length;
    const ms = Date.now() - t0;
    const payload: RelatedFormsResponse = { root, forms, total, ms, variantDetails };

    CACHE.set(key, { value: payload, until: Date.now() + TTL });

    return NextResponse.json(payload, { status: 200 });
  } catch (e) {
    const ms = Date.now() - t0;
    return NextResponse.json({ error: String(e), ms }, { status: 500 });
  }
}

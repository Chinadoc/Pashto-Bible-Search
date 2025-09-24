// app/api/search_phrase/route.ts
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

type Processed = {
    normalized: string;
  searchType: 'fast'|'fuzzy'|'enhanced';
  pos?: 'verb'|'noun'|'adjective'|'other';
    variants: string[];
  variantGroups?: { nouns?: Variant[]; verbs?: Variant[]; other?: Variant[] };
  variantDetails?: Array<{ type: string; description?: string; count: number; groups?: Array<{ key: string; label: string; items: Variant[]}> }>;
  frequency?: number;
  romanization?: string;
  root?: string;
  // For back-compat with the Edge function (if it returns fuzzy results already)
  fuzzyResults?: VerseResult[];
};

type VerseResult = { ref: string; text: string; testament?: 'ot'|'nt' };
type SearchPhraseRequest = {
  query: string;
  scope?: 'all'|'ot'|'nt';
  includeRelated?: boolean;
  enableFuzzy?: boolean;
  bookFilter?: string[];
  limit?: number;
};
type SearchPhraseResponse = {
  processed: Processed;
  results: VerseResult[];
  ms: number;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function isLatinOnly(s: string): boolean {
  return /^[\p{Script=Latin}\s'\-]+$/u.test(s);
}

async function localDirectSearch(
  db: any,
  needle: string,
  scope: 'all'|'ot'|'nt' = 'all',
  bookFilter?: string[],
  limit = 50
): Promise<VerseResult[]> {
  // Minimal direct search (ILIKE), preserving existing contract
  // Assumes verses table has: ref (e.g., "John 3:16"), text, testament ('ot'|'nt'), book (optional)
  let q = db.from("verses")
    .select("ref,text,testament")
    .ilike("text", `%${needle}%`)
    .limit(limit);

  if (scope === "ot") q = q.eq("testament", "ot");
  if (scope === "nt") q = q.eq("testament", "nt");
  if (bookFilter?.length) q = q.in("book", bookFilter);

  const { data } = await q;
  return (data ?? []).map((r: any) => ({
    ref: r.ref,
    text: r.text,
    testament: r.testament
  }));
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = (await req.json()) as SearchPhraseRequest;
    const query = (body.query ?? "").trim();
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const includeRelated = !!body.includeRelated;
    const scope = body.scope ?? "all";
    const limit = body.limit ?? 50;
    const latin = isLatinOnly(query);
    const enableFuzzy = !!(body.enableFuzzy || latin);

    // Edge-first
    let edgeProcessed: Processed | null = null;
    try {
      const efRes = await fetch(
        `${SUPABASE_URL}/functions/v1/pashto-processor`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            formPs: query,                // edge will normalize if romanized
            includeRelated,
            enableFuzzy,                  // auto-on when Latin-only
          }),
        }
      );

      if (efRes.ok) {
        edgeProcessed = await efRes.json() as Processed;
      }
          } catch {
      // function unavailable — fall through to local
    }

    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) as any;

    // Decide results:
    // 1) If Edge returned fuzzyResults (and gated fuzzy), prefer those.
    // 2) Otherwise, do direct/ILIKE with the best normalized token we have.
    let results: VerseResult[] = [];
    let processed: Processed;

    if (edgeProcessed) {
      processed = edgeProcessed;
      if (Array.isArray(edgeProcessed.fuzzyResults) && edgeProcessed.fuzzyResults?.length) {
        results = edgeProcessed.fuzzyResults;
    } else {
        const needle = processed.normalized || query;
        results = await localDirectSearch(db, needle, scope, body.bookFilter, limit);
      }
          } else {
      // Fallback entirely local
      const needle = query;
      results = await localDirectSearch(db, needle, scope, body.bookFilter, limit);
      processed = {
        normalized: needle,
        searchType: enableFuzzy ? "fuzzy" : "fast",
        variants: [needle],
      };
    }

    const ms = Date.now() - t0;
    const payload: SearchPhraseResponse = { processed, results, ms };
    return NextResponse.json(payload, { status: 200 });
  } catch (e) {
    const ms = Date.now() - t0;
    return NextResponse.json({ error: String(e), ms }, { status: 500 });
  }
}

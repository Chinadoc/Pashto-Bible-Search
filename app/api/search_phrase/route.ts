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
  console.log(`DEBUG: localDirectSearch called with:`, { needle, scope, bookFilter, limit });

  // Minimal direct search (ILIKE), preserving existing contract
  // Assumes verses table has: ref (e.g., "John 3:16"), text, testament ('ot'|'nt'), book (optional)
  let q = db.from("verses")
    .select("ref,text,testament")
    .ilike("text", `%${needle}%`)
    .limit(limit);

  if (scope === "ot") q = q.eq("testament", "ot");
  if (scope === "nt") q = q.eq("testament", "nt");
  if (bookFilter?.length) q = q.in("book", bookFilter);

  console.log(`DEBUG: Executing query...`);
  const { data, error } = await q;

  console.log(`DEBUG: Query result:`, {
    dataCount: data?.length ?? 0,
    error: error?.message,
    firstFewResults: data?.slice(0, 3)
  });

  if (error) {
    console.error(`DEBUG: Database error:`, error);
  }

  return (data ?? []).map((r: any) => ({
    ref: r.ref,
    text: r.text,
    testament: r.testament
  }));
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  console.log(`DEBUG: ========================================`);
  console.log(`DEBUG: SEARCH REQUEST RECEIVED at ${new Date().toISOString()}`);
  console.log(`DEBUG: ========================================`);

  try {
    const body = (await req.json()) as SearchPhraseRequest;
    const query = (body.query ?? "").trim();
    console.log(`DEBUG: Search request received:`, { query, includeRelated: body.includeRelated, scope: body.scope });

    if (!query) {
      console.log(`DEBUG: Empty query received`);
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const includeRelated = !!body.includeRelated;
    const scope = body.scope ?? "all";
    const limit = body.limit ?? 50;
    const latin = isLatinOnly(query);
    const enableFuzzy = !!(body.enableFuzzy || latin);

    console.log(`DEBUG: Search parameters:`, {
      query,
      includeRelated,
      scope,
      limit,
      latin,
      enableFuzzy
    });

    // Go directly to local search - simplest approach for now
    console.log(`DEBUG: Using direct database search only`);

    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) as any;

    // Perform local search with the original query
    console.log(`DEBUG: Searching database with query:`, query);
    const results = await localDirectSearch(db, query, scope, body.bookFilter, limit);
    console.log(`DEBUG: Database search returned:`, results.length, 'results');

    const processed: Processed = {
      normalized: query,
      searchType: enableFuzzy ? "fuzzy" : "fast",
      variants: [query],
    };

    const ms = Date.now() - t0;
    const payload: SearchPhraseResponse = { processed, results, ms };

    // Log final results for debugging
    console.log(`DEBUG: Final search results:`, {
      query,
      includeRelated,
      processedType: processed.searchType,
      variantsCount: processed.variants.length,
      resultsCount: results.length,
      ms,
      hasResults: results.length > 0
    });

    return NextResponse.json(payload, { status: 200 });
  } catch (e) {
    const ms = Date.now() - t0;
    return NextResponse.json({ error: String(e), ms }, { status: 500 });
  }
}

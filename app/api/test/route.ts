import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  console.log(`DEBUG: ========================================`);
  console.log(`DEBUG: TEST ENDPOINT CALLED at ${new Date().toISOString()}`);
  console.log(`DEBUG: ========================================`);

  try {
    const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY) as any;

    // Test 1: Basic connectivity
    console.log(`DEBUG: Testing basic connectivity...`);
    const { data: tables, error: tablesError } = await db
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);

    console.log(`DEBUG: Tables query result:`, { count: tables?.length, error: tablesError?.message });

    // Test 2: Check if verses table exists with exact case
    console.log(`DEBUG: Checking verses table with exact case...`);
    const { data: verseTableExact, error: verseTableExactError } = await db
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'verses')
      .limit(1);

    console.log(`DEBUG: Exact case verses table check:`, { exists: !!verseTableExact?.length, error: verseTableExactError?.message });

    // Test 2b: Check if verses table exists (case-insensitive)
    console.log(`DEBUG: Checking if verses table exists (case-insensitive)...`);
    const { data: verseTable, error: verseTableError } = await db
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .ilike('table_name', 'verses')
      .limit(1);

    console.log(`DEBUG: Case-insensitive verses table check:`, { exists: !!verseTable?.length, error: verseTableError?.message });

    // Test 3: Check if verses table has any data at all
    console.log(`DEBUG: Checking verses table row count...`);
    const { count: verseCount, error: countError } = await db
      .from("verses")
      .select("*", { count: "exact", head: true });

    console.log(`DEBUG: Verses table count:`, {
      count: verseCount,
      error: countError?.message
    });

    // Test 4: Try to get some verses (any verses)
    console.log(`DEBUG: Attempting to query verses table...`);
    const { data: verses, error: versesError } = await db
      .from("verses")
      .select("ref, text, testament")
      .limit(5);

    console.log(`DEBUG: Verses query result:`, {
      count: verses?.length,
      error: versesError?.message,
      sample: verses?.[0]
    });

    if (versesError) {
      console.error(`DEBUG: Verses query error:`, versesError);
    }

    // Test 5: Try searching for a known word
    console.log(`DEBUG: Testing search for common word...`);
    const { data: searchResults, error: searchError } = await db
      .from("verses")
      .select("ref, text, testament")
      .ilike("text", "%کتاب%")  // Search for "book" in Pashto
      .limit(5);

    console.log(`DEBUG: Search query result:`, {
      count: searchResults?.length,
      error: searchError?.message,
      sample: searchResults?.[0]
    });

    // Test 6: Try searching for a simpler pattern
    console.log(`DEBUG: Testing search for any text...`);
    const { data: anyResults, error: anyError } = await db
      .from("verses")
      .select("ref, text, testament")
      .ilike("text", "%ا%")  // Search for any text containing Arabic letter alef
      .limit(5);

    console.log(`DEBUG: Any text search result:`, {
      count: anyResults?.length,
      error: anyError?.message,
      sample: anyResults?.[0]
    });

    return NextResponse.json({
      success: true,
      message: "Database tests completed",
      tests: {
        connectivity: !tablesError,
        versesTableExistsExact: !!verseTableExact?.length,
        versesTableExistsCaseInsensitive: !!verseTable?.length,
        versesTableHasData: (verseCount ?? 0) > 0,
        canQueryVerses: !versesError,
        searchWorks: !searchError && (searchResults?.length ?? 0) > 0,
        anyTextSearchWorks: !anyError && (anyResults?.length ?? 0) > 0
      },
      results: {
        tables: tables?.slice(0, 3),
        versesSample: verses?.slice(0, 2),
        searchSample: searchResults?.slice(0, 2),
        anyTextSample: anyResults?.slice(0, 2)
      },
      errors: {
        tablesError: tablesError?.message,
        verseTableExactError: verseTableExactError?.message,
        verseTableError: verseTableError?.message,
        countError: countError?.message,
        versesError: versesError?.message,
        searchError: searchError?.message,
        anyError: anyError?.message
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`DEBUG: Test endpoint error:`, error);
    return NextResponse.json({
      error: "Test failed",
      details: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

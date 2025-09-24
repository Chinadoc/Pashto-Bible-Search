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

    // Test basic database connectivity
    console.log(`DEBUG: Testing database connectivity...`);
    const { data, error } = await db.from("verses")
      .select("ref, text")
      .limit(5);

    console.log(`DEBUG: Database test result:`, { count: data?.length, error: error?.message });

    if (error) {
      console.error(`DEBUG: Database error:`, error);
      return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Database connection working",
      sampleData: data,
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

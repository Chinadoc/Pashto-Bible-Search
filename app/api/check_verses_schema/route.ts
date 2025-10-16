import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey ||
        supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
      return NextResponse.json({
        status: 'ERROR',
        error: 'Supabase credentials missing or invalid',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Get a sample of verses to see the structure
    const { data: verses, error } = await supabase
      .from('verses')
      .select('*')
      .limit(5);

    if (error) {
      return NextResponse.json({
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Also get total count
    const { count, error: countError } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        status: 'ERROR',
        error: countError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Check for any columns that might indicate translation
    const sampleVerse = verses && verses.length > 0 ? verses[0] : null;
    const columns = sampleVerse ? Object.keys(sampleVerse) : [];

    return NextResponse.json({
      status: 'OK',
      totalVersesCount: count || 0,
      sampleVerses: verses || [],
      availableColumns: columns,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


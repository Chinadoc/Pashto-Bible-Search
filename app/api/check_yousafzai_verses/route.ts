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

    // Check for Yousafzai verses in Supabase
    const { data: verses, error } = await supabase
      .from('verses')
      .select('*')
      .eq('translation', 'Yousafzai 2019')
      .limit(10);

    if (error) {
      return NextResponse.json({
        status: 'ERROR',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Also check total count
    const { count, error: countError } = await supabase
      .from('verses')
      .select('*', { count: 'exact', head: true })
      .eq('translation', 'Yousafzai 2019');

    if (countError) {
      return NextResponse.json({
        status: 'ERROR',
        error: countError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'OK',
      yousafzaiVersesCount: count || 0,
      sampleVerses: verses || [],
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

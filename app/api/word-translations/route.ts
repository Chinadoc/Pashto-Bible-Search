import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get translations for Pashto words
 */
export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    const translations: Record<string, string> = {};

    // Fetch translations from word_frequencies table
    const { data: wordData, error } = await supabase
      .from('word_frequencies')
      .select('pashto_word, english_translation')
      .in('pashto_word', words)
      .limit(100);

    if (error) {
      console.error('Error fetching translations:', error);
      return NextResponse.json({ translations: {} });
    }

    // Build translations map
    wordData?.forEach((item) => {
      if (item.english_translation) {
        translations[item.pashto_word] = item.english_translation;
      }
    });

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Word translations API error:', error);
    return NextResponse.json({ translations: {} }, { status: 500 });
  }
}


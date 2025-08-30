import { NextResponse } from 'next/server';

interface FrequencyItem {
  pashto: string;
  frequency: number;
}

export const runtime = 'nodejs'; // Ensure this runs in Node.js runtime

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is not defined.');
    }

    // Function to fetch frequencies for a given testament
    const fetchFrequencies = async (testament: string | null = null) => {
      let url = `${supabaseUrl}/rest/v1/word_frequencies?select=word,frequency&order=frequency.desc&limit=100`;
      if (testament) {
        url += `&testament=eq.${testament}`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch frequency data for ${testament || 'all'}: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      // Map to the expected FrequencyItem interface
      return data.map((item: any) => ({
        pashto: item.word,
        frequency: item.frequency
      }));
    };

    const allFreq = await fetchFrequencies();
    const ntFreq = await fetchFrequencies('NT');
    const otFreq = await fetchFrequencies('OT');

    return NextResponse.json({
      nt: ntFreq,
      ot: otFreq,
      all: allFreq,
    });

  } catch (error) {
    console.error('Frequency API error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || 'https://pashtobiblesearch.jeremy-samuels17.workers.dev';

interface FrequencyItem {
  form: string;
  frequency: number;
  pos?: string;
  romanization?: string;
  english?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const pos = searchParams.get('pos') || 'any';
    const scope = searchParams.get('scope') || 'all';
    const search = searchParams.get('search') || '';

    // Try D1 via Worker first
    try {
      const workerParams = new URLSearchParams({
        limit: limit.toString(),
        pos: pos !== 'any' ? pos : '',
      });
      
      const response = await fetch(`${WORKER_URL}/api/top-words?${workerParams}`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (response.ok) {
        const data = await response.json();
        if (data.words && data.words.length > 0) {
          const items: FrequencyItem[] = data.words.map((w: any) => ({
            form: w.pashto_word || w.form,
            frequency: w.frequency_total || w.frequency || 0,
            pos: w.word_type || w.pos || '',
            romanization: w.romanization || '',
            english: w.english_translation || w.english || '',
          }));
          
          return NextResponse.json({ 
            items, 
            source: 'd1',
            total: items.length 
          });
        }
      }
    } catch (workerError) {
      console.log('Worker request failed:', workerError);
    }

    return NextResponse.json({
      items: [],
      source: 'none',
      error: 'No frequency data available'
    });
  } catch (error) {
    console.error('Error in lexicon_frequency API:', error);
    return NextResponse.json({ 
      items: [],
      source: 'error',
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

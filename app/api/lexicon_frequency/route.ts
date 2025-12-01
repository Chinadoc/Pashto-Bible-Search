import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
      console.log('Worker request failed, falling back to static data:', workerError);
    }

    // Fallback: Read from static JSON file
    const filePath = path.join(process.cwd(), 'public', 'word_frequency_list.json');

    if (!fs.existsSync(filePath)) {
      // Try creating from dictionary
      return NextResponse.json({ 
        items: [], 
        source: 'none',
        error: 'No frequency data available' 
      });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let data: any[];
    
    try {
      data = JSON.parse(fileContent);
    } catch {
      return NextResponse.json({ items: [], source: 'error' });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ items: [], source: 'error' });
    }

    // Filter and map data
    let filteredItems: FrequencyItem[] = data.map((item: any) => ({
      form: item.pashto || item.form,
      frequency: item.frequency || 0,
      pos: item.pos || '',
      romanization: item.romanization || '',
      english: item.definition || item.english || '',
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.form.includes(search) || 
        item.romanization?.toLowerCase().includes(searchLower) ||
        item.english?.toLowerCase().includes(searchLower)
      );
    }

    // Apply POS filter
    if (pos !== 'any') {
      filteredItems = filteredItems.filter(item => {
        const itemPos = item.pos?.toLowerCase() || '';
        switch (pos) {
          case 'verb':
            return itemPos.includes('v') || itemPos.includes('verb');
          case 'noun':
            return itemPos.includes('n.') || itemPos.includes('noun');
          case 'adj':
            return itemPos.includes('adj');
          default:
            return true;
        }
      });
    }

    // Sort by frequency
    filteredItems.sort((a, b) => b.frequency - a.frequency);

    // Apply limit
    const slicedItems = filteredItems.slice(0, limit);

    return NextResponse.json({ 
      items: slicedItems,
      source: 'static',
      total: filteredItems.length 
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

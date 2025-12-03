import { NextResponse } from 'next/server';
import rahmanBabaPoems from '../../../data/rahmanbaba_poems.json';
import proverbsData from '../../../data/proverbs.json';

interface RahmanBabaPoem {
  num: number;
  p1: string;
  p2: string;
  e1: string;
  e2: string;
  theme: string;
}

interface Proverb {
  num: number;
  p1: string;
  p2?: string;
  e1: string;
  e2?: string;
  theme: string;
  interp?: string;
}

/**
 * GET /api/poems
 * Returns Rahman Baba poetry and Pashto proverbs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'rahmanbaba', 'proverbs', or 'all'
    const search = searchParams.get('search') || '';
    const theme = searchParams.get('theme') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let poems: RahmanBabaPoem[] = [];
    let proverbs: Proverb[] = [];

    if (type === 'all' || type === 'rahmanbaba') {
      poems = (rahmanBabaPoems as RahmanBabaPoem[]).map(poem => ({
        ...poem,
        audioUrl: `https://rahmanbaba.speakingpashto.com/audio/${poem.num}.mp3`
      }));
    }

    if (type === 'all' || type === 'proverbs') {
      proverbs = proverbsData as Proverb[];
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      poems = poems.filter(p => 
        p.p1.includes(search) || 
        p.p2.includes(search) || 
        p.e1.toLowerCase().includes(searchLower) || 
        p.e2.toLowerCase().includes(searchLower) ||
        p.theme.toLowerCase().includes(searchLower)
      );
      proverbs = proverbs.filter(p => 
        p.p1.includes(search) || 
        (p.p2 && p.p2.includes(search)) || 
        p.e1.toLowerCase().includes(searchLower) || 
        (p.e2 && p.e2.toLowerCase().includes(searchLower)) ||
        p.theme.toLowerCase().includes(searchLower) ||
        (p.interp && p.interp.toLowerCase().includes(searchLower))
      );
    }

    // Apply theme filter
    if (theme) {
      poems = poems.filter(p => p.theme === theme);
      proverbs = proverbs.filter(p => p.theme === theme);
    }

    // Get unique themes
    const poemThemes = [...new Set(rahmanBabaPoems.map((p: RahmanBabaPoem) => p.theme))].sort();
    const proverbThemes = [...new Set((proverbsData as Proverb[]).map(p => p.theme))].sort();

    // Apply pagination
    const poemsSlice = poems.slice(offset, offset + limit);
    const proverbsSlice = proverbs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      rahmanbaba: {
        poems: poemsSlice,
        total: poems.length,
        themes: poemThemes,
        source: 'rahmanbaba.speakingpashto.com',
        attribution: 'Tuning The Heart: Best-Loved Pashto Poetry of Rahman Baba by Robert Sampson'
      },
      proverbs: {
        items: proverbsSlice,
        total: proverbs.length,
        themes: proverbThemes,
        source: 'proverbs.speakingpashto.com',
        attribution: 'Love Grows by Coming and Going: Popular Pashto Proverbs by Robert Sampson'
      },
      pagination: {
        offset,
        limit,
        hasMore: {
          poems: offset + limit < poems.length,
          proverbs: offset + limit < proverbs.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch poems' },
      { status: 500 }
    );
  }
}

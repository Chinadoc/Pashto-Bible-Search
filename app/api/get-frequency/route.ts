import { NextResponse } from 'next/server';
import { getLightweightData } from '../../lib/data/load';

interface FrequencyItem {
  pashto: string;
  frequency: number;
}

export const runtime = 'nodejs'; // Ensure this runs in Node.js runtime

export async function GET() {
  try {
    console.log('Loading frequency data...');
    const { frequencyMap } = await getLightweightData();
    console.log(`Loaded ${frequencyMap.size} frequency entries`);

    // Convert frequency map to array format
    const allFreq: FrequencyItem[] = Array.from(frequencyMap.entries())
      .map(([pashto, frequency]) => ({ pashto, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 100); // Limit to top 100

    // For NT and OT, we'd need to filter by testament if that data was available
    // For now, return the same data for all categories since we don't have testament info in the JSON
    const ntFreq = allFreq.slice(0, 50); // Top 50 for NT
    const otFreq = allFreq.slice(0, 50); // Top 50 for OT

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

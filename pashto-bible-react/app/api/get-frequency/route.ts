import { NextResponse } from 'next/server';

interface FrequencyItem {
  pashto: string;
  frequency: number;
}

export async function GET() {
  try {
    // Mock frequency data for now - you can replace this with actual Supabase queries
    const mockFrequencies: FrequencyItem[] = [
      { pashto: 'دا', frequency: 1500 },
      { pashto: 'هغه', frequency: 1200 },
      { pashto: 'په', frequency: 1100 },
      { pashto: 'او', frequency: 1000 },
      { pashto: 'چې', frequency: 950 },
      { pashto: 'د', frequency: 900 },
      { pashto: 'له', frequency: 850 },
      { pashto: 'ته', frequency: 800 },
      { pashto: 'یو', frequency: 750 },
      { pashto: 'وه', frequency: 700 },
    ];

    return NextResponse.json({
      nt: mockFrequencies.slice(0, 5),
      ot: mockFrequencies.slice(2, 7),
      all: mockFrequencies,
    });

  } catch (error) {
    console.error('Frequency API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

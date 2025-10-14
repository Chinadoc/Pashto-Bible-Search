import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface RouteParams {
  filename: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const resolvedParams = await params;
    const { filename } = resolvedParams;

    // Validate filename to prevent directory traversal
    const allowedFiles = [
      'full_dictionary_enriched.json',
      'word_frequency_list.json',
      'inflections_cache.json',
      'form_to_root_map.json',
      'form_occurrence_index.json'
    ];

    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', filename);

    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      return NextResponse.json(JSON.parse(fileContents));
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Data API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

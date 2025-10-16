import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const sentenceClipsDir = join(process.cwd(), 'sentence_clips');
    const filePath = join(sentenceClipsDir, filename);

    try {
      const fileBuffer = await readFile(filePath);

      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      const contentType = ext === 'wav' ? 'audio/wav' :
                         ext === 'mp3' ? 'audio/mpeg' :
                         ext === 'm4a' ? 'audio/mp4' : 'audio/wav';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000',
        },
      });

    } catch (error) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error serving sentence clip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

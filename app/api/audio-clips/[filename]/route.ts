import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  _request: Request,
  context: any
) {
  try {
    const filename = context.params.filename;
    
    // Security check - only allow audio files
    if (!filename.match(/\.(wav|mp3|m4a)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Try sentence_clips first, then audio_clips
    let filePath = join(process.cwd(), 'sentence_clips', filename);
    let fileBuffer;
    
    try {
      fileBuffer = await readFile(filePath);
    } catch (error) {
      // If not found in sentence_clips, try audio_clips
      filePath = join(process.cwd(), 'audio_clips', filename);
      try {
        fileBuffer = await readFile(filePath);
      } catch (error2) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    }
    
    // Determine content type based on file extension
    let contentType = 'audio/wav';
    if (filename.endsWith('.mp3')) {
      contentType = 'audio/mpeg';
    } else if (filename.endsWith('.m4a')) {
      contentType = 'audio/mp4';
    }
    
    const arrayBuffer = new ArrayBuffer(fileBuffer.byteLength)
    new Uint8Array(arrayBuffer).set(fileBuffer)

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Error serving audio file:', error);
    return NextResponse.json(
      { error: 'Failed to serve audio file' },
      { status: 500 }
    );
  }
}

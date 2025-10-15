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
    
    const filePath = join(process.cwd(), 'audio_clips', filename);
    
    try {
      const fileBuffer = await readFile(filePath);
      
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
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Error serving audio file:', error);
    return NextResponse.json(
      { error: 'Failed to serve audio file' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Run the simplified video processor
    const command = `source venv/bin/activate && python3 simple_video_processor.py "${youtubeUrl}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 1800000, // 30 minutes timeout
      });

      if (stderr) {
        console.error('Processor stderr:', stderr);
      }

      // Parse the output to extract results
      const output = stdout + stderr;
      
      if (output.includes('✅ Processing complete!')) {
        // Extract video ID from output
        const videoIdMatch = output.match(/Video ID: ([^\s]+)/);
        const chunksMatch = output.match(/Total chunks: (\d+)/);
        const successfulMatch = output.match(/Successful transcriptions: (\d+)/);
        
        const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
        const totalChunks = chunksMatch ? parseInt(chunksMatch[1]) : 0;
        const successful = successfulMatch ? parseInt(successfulMatch[1]) : 0;

        return NextResponse.json({
          success: true,
          message: 'Video processed successfully',
          videoId,
          totalChunks,
          successfulTranscriptions: successful,
          output: output
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Video processing failed',
          output: output
        }, { status: 500 });
      }

    } catch (error: any) {
      console.error('Video processing error:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to process video',
        details: error.message,
        output: error.stdout || error.stderr || ''
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

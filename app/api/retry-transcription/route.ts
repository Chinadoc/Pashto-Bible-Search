import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Check if the video results file exists
    const resultsFile = path.join(process.cwd(), 'processed_videos', `${videoId}_results.json`);
    
    if (!fs.existsSync(resultsFile)) {
      return NextResponse.json(
        { error: 'Video results not found' },
        { status: 404 }
      );
    }

    // Run the retry command
    const command = `python3 process_video_offline.py --retry ${videoId}`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 120000, // 2 minutes timeout
      });

      if (stderr) {
        console.error('Retry stderr:', stderr);
      }

      // Check if retry was successful
      if (stdout.includes('✅ Retry successful!')) {
        return NextResponse.json({
          success: true,
          message: 'Transcription retry successful',
          output: stdout
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Retry failed',
          output: stdout + stderr
        }, { status: 500 });
      }

    } catch (error: any) {
      console.error('Retry transcription error:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to retry transcription',
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

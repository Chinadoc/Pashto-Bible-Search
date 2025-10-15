import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const audioClipsDir = join(process.cwd(), 'audio_clips');
    
    try {
      const files = await readdir(audioClipsDir);
      const audioFiles = files.filter(file => 
        file.endsWith('.wav') || file.endsWith('.mp3') || file.endsWith('.m4a')
      );
      
      const audioClips = await Promise.all(
        audioFiles.map(async (file) => {
          const filePath = join(audioClipsDir, file);
          const stats = await import('fs').then(fs => fs.promises.stat(filePath));
          
          return {
            filename: file,
            name: file.replace(/\.[^/.]+$/, ''), // Remove extension
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            url: `/api/audio-clips/${file}`
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        clips: audioClips,
        count: audioClips.length
      });
      
    } catch (error) {
      // Directory doesn't exist or can't be read
      return NextResponse.json({
        success: true,
        clips: [],
        count: 0,
        message: 'Audio clips directory not found'
      });
    }
    
  } catch (error) {
    console.error('Error fetching audio clips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audio clips' },
      { status: 500 }
    );
  }
}

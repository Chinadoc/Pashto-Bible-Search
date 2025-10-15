import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const poemsDir = join(process.cwd(), 'poems');
    
    try {
      const files = await readdir(poemsDir);
      const poemFiles = files.filter(file => file.endsWith('.txt'));
      
      const poems = await Promise.all(
        poemFiles.map(async (file) => {
          const filePath = join(poemsDir, file);
          const content = await readFile(filePath, 'utf-8');
          const stats = await import('fs').then(fs => fs.promises.stat(filePath));
          
          return {
            filename: file,
            name: file.replace(/\.[^/.]+$/, ''), // Remove extension
            content: content,
            length: content.length,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        poems: poems,
        count: poems.length
      });
      
    } catch (error) {
      // Directory doesn't exist or can't be read
      return NextResponse.json({
        success: true,
        poems: [],
        count: 0,
        message: 'Poems directory not found'
      });
    }
    
  } catch (error) {
    console.error('Error fetching poems:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch poems' },
      { status: 500 }
    );
  }
}

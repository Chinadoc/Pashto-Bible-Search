#!/usr/bin/env python3
"""
Simple local HTTP server to serve Yousafzai verse audio files for testing.
This allows testing the individual verse audio functionality while we work on Supabase upload.
"""

import http.server
import socketserver
import os
from pathlib import Path
from urllib.parse import unquote

class YousafzaiAudioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.audio_dir = Path("/Users/jeremysamuels/Documents/Pashto Bible split into verses/yousafzai_split_audio")
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        # Add CORS headers for browser access
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # Parse the requested path
        path = unquote(self.path.lstrip('/'))
        
        # Look for the audio file in our directory structure
        # Expected format: yousafzai_psalms002_verse_012.mp3
        if path.startswith('yousafzai_') and path.endswith('.mp3'):
            print(f"Looking for file: {path}")

            # Parse the filename: yousafzai_psalms002_verse_012.mp3
            parts = path.replace('yousafzai_', '').replace('.mp3', '').split('_')
            if len(parts) >= 3 and parts[1] == 'verse':
                book_chapter = parts[0]  # e.g., "psalms002"
                verse_num = parts[2]     # e.g., "012"

                # Extract book and chapter
                if book_chapter.startswith('psalms'):
                    book = 'psalms'
                    chapter = book_chapter.replace('psalms', '')
                elif book_chapter.startswith('proverbs'):
                    book = 'proverbs'
                    chapter = book_chapter.replace('proverbs', '')
                else:
                    self.send_error(404, "Book not found")
                    return

                # Look for the file
                chapter_int = int(chapter)
                file_path = self.audio_dir / book / f"chapter-{chapter_int}-verses" / path

                print(f"Looking at path: {file_path}")
                print(f"File exists: {file_path.exists()}")
                
                if file_path.exists():
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(file_path.stat().st_size))
                    self.end_headers()
                    
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                    
                    print(f"✅ Served: {path}")
                    return
        
        self.send_error(404, "Audio file not found")
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

def main():
    PORT = 8888
    
    print(f"🎵 Starting Yousafzai Audio Server on port {PORT}")
    print(f"📁 Serving from: /Users/jeremysamuels/Documents/Pashto Bible split into verses/yousafzai_split_audio")
    print(f"🌐 Test URL: http://localhost:{PORT}/yousafzai_psalms002_verse_012.mp3")
    print("🔄 Press Ctrl+C to stop")
    
    with socketserver.TCPServer(("", PORT), YousafzaiAudioHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")

if __name__ == "__main__":
    main()

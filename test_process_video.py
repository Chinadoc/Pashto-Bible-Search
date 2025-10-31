#!/usr/bin/env python3
"""
Test script to process YouTube video via Cloudflare workflow
Tests the video: https://www.youtube.com/watch?v=935dWX6-c1E
"""
import requests
import json
import time

YOUTUBE_URL = 'https://www.youtube.com/watch?v=935dWX6-c1E'
CLOUDFLARE_WORKER_URL = 'https://pashtobiblesearch.jeremy-samuels17.workers.dev'

# For local testing, use localhost
# For deployed testing, use the Vercel URL
API_URL = 'http://localhost:3000/api/process-video-cloudflare'

print(f'🎬 Testing video processing workflow')
print(f'   Video: {YOUTUBE_URL}')
print(f'   API: {API_URL}')
print('')

try:
    print('📡 Sending request to process video...')
    response = requests.post(
        API_URL,
        headers={'Content-Type': 'application/json'},
        json={
            'youtubeUrl': YOUTUBE_URL,
            'apiKeys': {
                'elevenlabs': 'sk_b3f632622b08afb9a26b2fb912be9d1baa2548414f430543'
            }
        },
        timeout=600  # 10 minutes timeout
    )
    
    if response.ok:
        result = response.json()
        print(f'✅ SUCCESS!')
        print(f'   Video ID: {result.get("videoId", "unknown")}')
        print(f'   Segments: {len(result.get("segments", []))}')
        print(f'   R2 Keys: {len(result.get("r2Keys", []))}')
        print(f'   Message: {result.get("message", "")}')
        
        if result.get("segments"):
            print(f'\n📝 Sample segments:')
            for i, seg in enumerate(result.get("segments", [])[:5]):
                print(f'   {i+1}. [{seg.get("startTime", 0):.1f}s-{seg.get("endTime", 0):.1f}s] {seg.get("text", "")[:50]}...')
    else:
        print(f'❌ Failed: {response.status_code}')
        error_text = response.text[:1000]
        print(f'   {error_text}')
        
except requests.exceptions.ConnectionError:
    print('⚠️  Could not connect to local server.')
    print('')
    print('To test locally:')
    print('   1. Start dev server: npm run dev')
    print('   2. Run this script: python3 test_process_video.py')
    print('')
    print('Or test via the deployed site:')
    print('   https://pashto-bible-search.vercel.app/')
    print('   (Note: Video processing requires yt-dlp/ffmpeg, so it may not work on Vercel)')
except Exception as e:
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()


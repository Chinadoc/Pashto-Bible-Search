import asyncio
import json
import os
import time
from pathlib import Path

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

async def load_map_baseline():
    from aiohttp import ClientSession

    start = time.perf_counter()
    audio_map = {}

    local_path = Path('google_drive_audio_urls.json')
    if local_path.exists():
        data = json.loads(local_path.read_text('utf-8'))
        for filename, meta in data.items():
            book = meta.get('book')
            chapter = meta.get('chapter')
            verse = meta.get('verse')
            file_id = meta.get('google_drive_file_id')
            if not (book and isinstance(chapter, int) and isinstance(verse, int)):
                continue
            if file_id and file_id not in {'', 'FILE_ID_HERE', 'TEST_ID'}:
                key = f"{book.title()} {chapter}:{verse}"
                audio_map[key] = file_id

    drive_time = time.perf_counter() - start

    supabase_time = None
    if SUPABASE_URL and SUPABASE_KEY:
        async with ClientSession() as session:
            s_start = time.perf_counter()
            url = f"{SUPABASE_URL}/rest/v1/audio_by_verse?select=verse_ref,url&limit=10000"
            async with session.get(url, headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }) as resp:
                if resp.status == 200:
                    payload = await resp.json()
                    for row in payload:
                        ref = row.get('verse_ref')
                        link = row.get('url')
                        if not ref or not link:
                            continue
                        if ref not in audio_map and not any(word in link for word in ('drive.google', 'docs.google')):
                            audio_map[ref] = link
            supabase_time = time.perf_counter() - s_start

    total_time = time.perf_counter() - start
    return {
        'local_entries': len(audio_map),
        'drive_time': drive_time,
        'supabase_time': supabase_time,
        'total_time': total_time,
    }

async def main():
    stats = await load_map_baseline()
    print(json.dumps(stats, indent=2))

if __name__ == '__main__':
    asyncio.run(main())

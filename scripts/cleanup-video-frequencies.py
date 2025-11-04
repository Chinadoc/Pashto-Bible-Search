#!/usr/bin/env python3
"""
Clean up video frequencies when a video is deleted
This script removes a video's contribution from word_frequencies when the video is deleted.

Usage:
    python3 scripts/cleanup-video-frequencies.py <video_id>
    
Or call from API when video is deleted.
"""

import subprocess
import json
import sys

def execute_sql_command(command: str) -> dict:
    """Execute a SQL command via wrangler d1"""
    try:
        result = subprocess.run(
            ['npx', 'wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', command],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error executing SQL: {e.stderr}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print(f"Output: {result.stdout}")
        return None

def cleanup_video_frequencies(video_id: str) -> bool:
    """
    Remove a video's contribution from word_frequencies
    
    Steps:
    1. Get all words and their frequencies for this video
    2. Decrement frequency_video for each word
    3. Recalculate frequency_total
    4. Delete video_word_mappings entries
    """
    print(f"🗑️  Cleaning up frequencies for video: {video_id}")
    
    # Step 1: Get words and frequencies for this video
    query = f"""
    SELECT pashto_word, frequency
    FROM video_word_mappings
    WHERE video_id = '{video_id.replace("'", "''")}'
    """
    
    result = execute_sql_command(query)
    if not result:
        print("❌ Failed to query video_word_mappings")
        return False
    
    video_words = result.get('results', [])
    if not video_words:
        print(f"⚠️  No words found for video {video_id}")
        return True  # Nothing to clean up
    
    print(f"📝 Found {len(video_words)} word entries for this video")
    
    # Step 2: Decrement frequency_video for each word
    print("🔄 Decrementing frequency_video...")
    
    updates = []
    for row in video_words:
        word = row['pashto_word'].replace("'", "''")
        freq = row['frequency']
        
        # Decrement frequency_video (but don't go below 0)
        updates.append(f"""
        UPDATE word_frequencies 
        SET frequency_video = MAX(0, COALESCE(frequency_video, 0) - {freq}),
            frequency_total = MAX(0, COALESCE(frequency_total, 0) - {freq})
        WHERE pashto_word = '{word}';
        """)
    
    # Execute updates
    for update in updates:
        result = execute_sql_command(update.strip())
        if not result or not result.get('success'):
            print(f"⚠️  Warning: Failed to update word frequency")
    
    # Step 3: Delete video_word_mappings entries
    print("🗑️  Deleting video_word_mappings entries...")
    
    delete_query = f"""
    DELETE FROM video_word_mappings
    WHERE video_id = '{video_id.replace("'", "''")}'
    """
    
    result = execute_sql_command(delete_query)
    if not result or not result.get('success'):
        print("❌ Failed to delete video_word_mappings")
        return False
    
    deleted_count = result.get('meta', {}).get('rows_written', 0)
    print(f"✅ Deleted {deleted_count} video_word_mappings entries")
    
    # Step 4: Recalculate frequency_total for affected words (safety check)
    print("🔄 Recalculating frequency_total for affected words...")
    
    words_list = ', '.join([f"'{row['pashto_word'].replace("'", "''")}'" for row in video_words])
    recalc_query = f"""
    UPDATE word_frequencies
    SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                          COALESCE(frequency_afghan2023_nt, 0) + 
                          COALESCE(frequency_yousafzai2019_ot, 0) + 
                          COALESCE(frequency_yousafzai2019_nt, 0) + 
                          COALESCE(frequency_video, 0)
    WHERE pashto_word IN ({words_list});
    """
    
    result = execute_sql_command(recalc_query)
    if not result or not result.get('success'):
        print("⚠️  Warning: Failed to recalculate frequency_total")
    
    print(f"✅ Successfully cleaned up frequencies for video {video_id}")
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/cleanup-video-frequencies.py <video_id>")
        print("Example: python3 scripts/cleanup-video-frequencies.py abc123")
        return 1
    
    video_id = sys.argv[1]
    
    if cleanup_video_frequencies(video_id):
        return 0
    else:
        return 1

if __name__ == '__main__':
    sys.exit(main())


#!/usr/bin/env python3
"""
Populate frequency_video column in word_frequencies from video_word_mappings
This script calculates video frequencies for each word based on video_word_mappings table.
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

def main():
    print("🎬 Populating frequency_video from video_word_mappings...")
    
    # Step 1: Check if column exists
    print("📋 Checking if frequency_video column exists...")
    check_result = execute_sql_command("PRAGMA table_info(word_frequencies);")
    if not check_result:
        print("❌ Failed to check table structure")
        return 1
    
    columns = [col['name'] for col in check_result.get('results', [])]
    if 'frequency_video' not in columns:
        print("⚠️  frequency_video column not found. Please run cloudflare/add-frequency-video-column.sql first.")
        return 1
    
    print("✅ frequency_video column exists")
    
    # Step 2: Calculate video frequencies
    print("📊 Calculating video frequencies from video_word_mappings...")
    
    # Get all words with their video frequencies
    query = """
    SELECT 
      pashto_word,
      SUM(frequency) as video_freq
    FROM video_word_mappings
    GROUP BY pashto_word
    """
    
    result = execute_sql_command(query)
    if not result:
        print("❌ Failed to query video_word_mappings")
        return 1
    
    word_freqs = result.get('results', [])
    print(f"📝 Found {len(word_freqs)} words with video frequencies")
    
    # Step 3: Update word_frequencies
    print("🔄 Updating word_frequencies with video frequencies...")
    
    updates = []
    for row in word_freqs:
        word = row['pashto_word'].replace("'", "''")
        freq = row['video_freq']
        updates.append(f"UPDATE word_frequencies SET frequency_video = {freq} WHERE pashto_word = '{word}';")
    
    # Execute updates in batches
    batch_size = 100
    total_batches = (len(updates) + batch_size - 1) // batch_size
    
    for i in range(0, len(updates), batch_size):
        batch = updates[i:i + batch_size]
        batch_num = i // batch_size + 1
        print(f"  Processing batch {batch_num}/{total_batches} ({len(batch)} updates)...")
        
        sql_batch = '\n'.join(batch)
        result = execute_sql_command(sql_batch)
        
        if not result or not result.get('success'):
            print(f"⚠️  Warning: Batch {batch_num} may have failed")
    
    # Step 4: Recalculate frequency_total
    print("🔄 Recalculating frequency_total (Bible + video)...")
    
    update_total = """
    UPDATE word_frequencies
    SET frequency_total = COALESCE(frequency_afghan2023_ot, 0) + 
                          COALESCE(frequency_afghan2023_nt, 0) + 
                          COALESCE(frequency_yousafzai2019_ot, 0) + 
                          COALESCE(frequency_yousafzai2019_nt, 0) + 
                          COALESCE(frequency_video, 0);
    """
    
    result = execute_sql_command(update_total)
    if not result or not result.get('success'):
        print("❌ Failed to update frequency_total")
        return 1
    
    # Step 5: Verify
    print("✅ Verification...")
    verify_query = """
    SELECT 
      COUNT(*) as total_words,
      COUNT(CASE WHEN frequency_video > 0 THEN 1 END) as words_with_video,
      SUM(frequency_video) as total_video_freq
    FROM word_frequencies
    """
    
    verify_result = execute_sql_command(verify_query)
    if verify_result:
        stats = verify_result.get('results', [{}])[0]
        print(f"📊 Statistics:")
        print(f"  Total words: {stats.get('total_words', 0)}")
        print(f"  Words with video frequency: {stats.get('words_with_video', 0)}")
        print(f"  Total video frequency: {stats.get('total_video_freq', 0)}")
    
    print("✅ Done! frequency_video column populated successfully.")
    return 0

if __name__ == '__main__':
    sys.exit(main())


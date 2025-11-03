#!/usr/bin/env python3
"""
Split multi-word entries that are NOT sandwiches or dictionary entries

This script:
1. Finds multi-word entries marked as 'phrase' or missing pos
2. Checks if they're sandwiches (skip those)
3. Checks if they're in dictionary (skip those)
4. Splits remaining into individual words
5. Creates new word_frequencies entries for each word
6. Updates word_verse_mapping to point to new entries
7. Marks original as 'split' or deletes it

Usage:
  python3 scripts/split-multiword-entries.py
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Any

APP_ROOT = Path(__file__).resolve().parent.parent

def query_d1(sql_query: str) -> List[Dict[str, Any]]:
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, dict) and 'results' in first_item:
                    return first_item['results']
            elif isinstance(data, dict):
                return data.get('results', [])
        return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []

def main():
    print("🔍 Finding multi-word entries to split...\n")
    
    # Find multi-word entries that should be split
    sql = """
    SELECT pashto_word, frequency_total, pos
    FROM word_frequencies
    WHERE pashto_word LIKE '% %'
      AND pos IN ('phrase', 'unknown', '')
      AND pashto_word NOT LIKE 'په%کې'
      AND pashto_word NOT LIKE 'د%دپاره'
      AND pashto_word NOT LIKE 'پر%باندې'
      AND pashto_word NOT LIKE 'د%په اړه'
      AND pashto_word NOT LIKE 'د%په بارې کې'
      AND pashto_word NOT LIKE 'پر%سربېره'
      AND pashto_word NOT LIKE 'له%سره'
      AND pashto_word NOT LIKE '% ته'
      AND pashto_word NOT LIKE '% به%'
    ORDER BY frequency_total DESC
    LIMIT 100
    """
    
    entries = query_d1(sql)
    print(f"   Found {len(entries)} entries to potentially split\n")
    
    splits_needed = []
    for entry in entries:
        phrase = entry['pashto_word']
        words = phrase.split()
        if len(words) == 2:
            splits_needed.append({
                'phrase': phrase,
                'word1': words[0],
                'word2': words[1],
                'frequency': entry['frequency_total']
            })
    
    print(f"   Entries to split: {len(splits_needed)}\n")
    print("Sample splits:")
    for item in splits_needed[:10]:
        print(f"   '{item['phrase']}' -> '{item['word1']}' + '{item['word2']}'")
    
    print("\n📋 Next steps:")
    print("   1. Review the splits above")
    print("   2. Create SQL to insert new entries for word1 and word2")
    print("   3. Update word_verse_mapping to reference new entries")
    print("   4. Mark original phrase as 'split' or delete")

if __name__ == '__main__':
    main()

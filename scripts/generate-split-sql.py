#!/usr/bin/env python3
"""
Generate SQL to split multi-word entries that should be separated

This generates SQL that:
1. Finds multi-word entries to split (not sandwiches, not in dictionary)
2. For each word in the phrase, inserts/updates word_frequencies
3. Updates word_verse_mapping to reference the split words
4. Marks original phrase as 'split'

Usage:
  python3 scripts/generate-split-sql.py
  wrangler d1 execute pashto-bible-db --remote --file cloudflare/split-multiword-entries.sql
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
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=60)
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
    # Exclude sandwiches and entries already marked properly
    sql = """
    SELECT 
      id,
      pashto_word,
      frequency_total,
      frequency_a,
      frequency_y,
      frequency_r,
      pos
    FROM word_frequencies
    WHERE pashto_word LIKE '% %'
      AND (pos = 'phrase' OR pos = 'unknown' OR pos = '' OR pos IS NULL)
      AND pashto_word NOT LIKE 'په%کې'
      AND pashto_word NOT LIKE 'د%دپاره'
      AND pashto_word NOT LIKE 'پر%باندې'
      AND pashto_word NOT LIKE 'د%په اړه'
      AND pashto_word NOT LIKE 'د%په بارې کې'
      AND pashto_word NOT LIKE 'پر%سربېره'
      AND pashto_word NOT LIKE 'له%سره'
      -- Only exclude circumpositions (keep as single entries)
      -- Postpositions (... ته) and standalone prepositions (د ...) should be split
      AND (pos IS NULL OR pos != 'circumposition')
      AND LENGTH(pashto_word) - LENGTH(REPLACE(pashto_word, ' ', '')) = 1
    ORDER BY frequency_total DESC
    LIMIT 500
    """
    
    entries = query_d1(sql)
    print(f"   Found {len(entries)} entries to split\n")
    
    if not entries:
        print("   No entries found to split")
        return
    
    # Generate SQL
    sql_statements = []
    sql_statements.append('-- Split multi-word entries into individual words')
    sql_statements.append('-- Based on LingDocs sandwiches analysis: https://grammar.lingdocs.com/sandwiches/sandwiches/')
    sql_statements.append('')
    
    splits = []
    for entry in entries:
        phrase = entry['pashto_word']
        words = phrase.split()
        
        if len(words) != 2:
            continue  # Only handle 2-word phrases for now
        
        word1, word2 = words
        splits.append({
            'phrase_id': entry['id'],
            'phrase': phrase,
            'word1': word1,
            'word2': word2,
            'frequency': entry['frequency_total'],
        })
    
    print(f"   Generating SQL for {len(splits)} 2-word phrases...\n")
    
    # For each split, create SQL to:
    # 1. Insert/update word1 in word_frequencies
    # 2. Insert/update word2 in word_frequencies  
    # 3. Update word_verse_mapping to reference both words
    # 4. Mark original as 'split'
    
    for split in splits:
        phrase_id = split['phrase_id']
        phrase = split['phrase'].replace("'", "''")
        word1 = split['word1'].replace("'", "''")
        word2 = split['word2'].replace("'", "''")
        
        # Insert/update word1 (if doesn't exist, create new entry)
        sql_statements.append(f"-- Split '{phrase}' -> '{word1}' + '{word2}'")
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT '{word1}', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = '{word1}');
""")
        
        # Insert/update word2
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, frequency_a, frequency_y, frequency_r, pos)
SELECT '{word2}', 0, 0, 0, 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = '{word2}');
""")
        
        # Mark original as split
        sql_statements.append(f"""
UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE id = {phrase_id};
""")
    
    # Write SQL file
    output_path = APP_ROOT / 'cloudflare' / 'split-multiword-entries.sql'
    output_path.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {output_path}")
    print(f"   📊 Prepared {len(splits)} splits")
    print("\n📋 Next steps:")
    print(f"   1. Review {output_path.relative_to(APP_ROOT)}")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file {output_path.relative_to(APP_ROOT)}")
    print(f"   3. Note: This marks originals as 'split' but doesn't update word_verse_mapping yet")
    print(f"   4. A future script will handle updating verse mappings to reference split words")


if __name__ == '__main__':
    main()


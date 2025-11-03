#!/usr/bin/env python3
"""
Generate splitting SQL per phrase from word_frequencies

This queries the database and generates SQL to split each multi-word phrase
that should be split (postpositions, prepositions, particles).

Usage:
  python3 scripts/generate-split-sql-per-phrase.py
  wrangler d1 execute pashto-bible-db --remote --file cloudflare/split-phrases-complete.sql
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'split-phrases-complete.sql'

POSTPOSITIONS = ['ته', 'کې', 'دپاره', 'باندې', 'سره', 'سربېره']
PREPOSITIONS = ['د', 'په', 'پر', 'له']
PARTICLES = ['به']


def query_d1_batch(limit: int = 500, offset: int = 0) -> List[Dict]:
    """Query D1 database in batches using a temp SQL file"""
    import tempfile
    import os
    
    # Write SQL to temp file
    sql = f"""SELECT id, pashto_word, frequency_total, pos
FROM word_frequencies
WHERE pashto_word LIKE '% %'
  AND (pos = 'phrase' OR pos = 'postposition_phrase' OR pos = 'particle_phrase' OR pos IS NULL OR pos = '' OR pos = 'unknown')
  AND pashto_word NOT LIKE 'په%کې'
  AND pashto_word NOT LIKE 'د%دپاره'
  AND pashto_word NOT LIKE 'پر%باندې'
  AND pashto_word NOT LIKE 'د%په اړه'
  AND pashto_word NOT LIKE 'د%په بارې کې'
  AND pashto_word NOT LIKE 'پر%سربېره'
  AND pashto_word NOT LIKE 'له%سره'
  AND (pos IS NULL OR pos != 'circumposition')
  AND LENGTH(pashto_word) - LENGTH(REPLACE(pashto_word, ' ', '')) = 1
ORDER BY frequency_total DESC
LIMIT {limit} OFFSET {offset};"""
    
    temp_file = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8') as f:
            f.write(sql)
            temp_file = f.name
        
        # Note: wrangler --file doesn't return JSON for SELECT queries
        # We need to use --command with JSON output, but that's tricky with special chars
        # Let's try using Python's json module to parse the output
        cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--file', temp_file, '--json']
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                if isinstance(data, list) and len(data) > 0:
                    first_item = data[0]
                    if isinstance(first_item, dict) and 'results' in first_item:
                        return first_item['results']
                elif isinstance(data, dict):
                    return data.get('results', [])
            except json.JSONDecodeError:
                # If not JSON, try to parse as text output
                print(f"   ⚠️  Output not JSON, trying text parse...")
                return []
        else:
            print(f"   ⚠️  Query failed: {result.stderr[:300] if result.stderr else result.stdout[:300]}")
        return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []
    finally:
        if temp_file and os.path.exists(temp_file):
            try:
                os.unlink(temp_file)
            except:
                pass


def split_phrase(phrase: str) -> tuple:
    """Split a phrase into component words"""
    words = phrase.split()
    
    if len(words) < 2:
        return (phrase, None, None)
    
    # Check for postposition (... ته)
    if words[-1] in POSTPOSITIONS:
        return (' '.join(words[:-1]), words[-1], 'postposition')
    
    # Check for preposition (د ...)
    if words[0] in PREPOSITIONS:
        return (words[0], ' '.join(words[1:]), 'preposition')
    
    # Check for particle (... به)
    if 'به' in words:
        idx = words.index('به')
        if idx > 0:
            return (' '.join(words[:idx]), 'به', 'particle')
        elif idx < len(words) - 1:
            return ('به', ' '.join(words[idx+1:]), 'particle')
    
    return (phrase, None, None)


def main():
    print("🔍 Finding phrases to split...\n")
    
    # Query in batches
    all_entries = []
    batch_size = 500
    offset = 0
    
    while True:
        print(f"   Querying batch: offset {offset}...")
        entries = query_d1_batch(limit=batch_size, offset=offset)
        if not entries:
            break
        all_entries.extend(entries)
        print(f"      Found {len(entries)} entries (total: {len(all_entries)})")
        if len(entries) < batch_size:
            break
        offset += batch_size
    
    print(f"\n   ✅ Total found: {len(all_entries)} phrases to split\n")
    
    entries = all_entries
    
    if not entries:
        print("   No phrases found to split")
        return
    
    # Generate SQL
    sql_statements = []
    sql_statements.append('-- Split multi-word phrases into individual words')
    sql_statements.append('-- Generated from word_frequencies table')
    sql_statements.append('')
    
    splits = []
    for entry in entries:
        phrase = entry['pashto_word']
        word1, word2, split_type = split_phrase(phrase)
        
        if not word2:
            continue  # Can't split this one
        
        splits.append({
            'phrase_id': entry['id'],
            'phrase': phrase,
            'word1': word1,
            'word2': word2,
            'split_type': split_type,
            'frequency': entry.get('frequency_total', 0),
        })
    
    print(f"   Generating SQL for {len(splits)} splits...\n")
    
    # Generate SQL for each split
    for split in splits:
        phrase_id = split['phrase_id']
        phrase = split['phrase'].replace("'", "''")
        word1 = split['word1'].replace("'", "''")
        word2 = split['word2'].replace("'", "''")
        split_type = split['split_type']
        
        sql_statements.append(f"-- Split '{split['phrase']}' -> '{word1}' + '{word2}' ({split_type})")
        
        # Determine POS for word2
        pos2 = 'postposition' if split_type == 'postposition' else ('preposition' if split_type == 'preposition' else 'particle')
        
        # Insert/update word1
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, pos)
SELECT '{word1}', 0, NULL
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = '{word1}');
""")
        
        # Insert/update word2
        sql_statements.append(f"""
INSERT OR IGNORE INTO word_frequencies (pashto_word, frequency_total, pos)
SELECT '{word2}', 0, '{pos2}'
WHERE NOT EXISTS (SELECT 1 FROM word_frequencies WHERE pashto_word = '{word2}');
""")
        
        # Mark original as split
        sql_statements.append(f"""
UPDATE word_frequencies 
SET pos = 'split', pashto_word = pashto_word || ' [SPLIT]'
WHERE id = {phrase_id};
""")
        
        sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"   📊 Prepared {len(splits)} splits")
    print(f"\n📋 Sample splits (first 10):")
    for split in splits[:10]:
        print(f"   '{split['phrase']}' -> '{split['word1']}' + '{split['word2']}' ({split['split_type']})")
    
    print("\n⚠️  Note: This SQL creates new entries but doesn't:")
    print("   - Update word_verse_mapping to reference split words")
    print("   - Distribute frequency counts")
    print("   - Handle proper nouns from genealogies")
    print("\n💡 Next steps:")
    print(f"   1. Review {OUTPUT_SQL.relative_to(APP_ROOT)}")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")
    print(f"   3. Create follow-up script to update word_verse_mapping")


if __name__ == '__main__':
    main()


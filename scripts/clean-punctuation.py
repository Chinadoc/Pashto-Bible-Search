#!/usr/bin/env python3
"""
Clean Punctuation from Word Frequencies

This script removes punctuation, exclamation marks, question marks, and other
non-word characters from pashto_word entries for accurate searching.

Goal: Clean data for rapid searching and categorization
"""

import json
import subprocess
import re
from pathlib import Path
from typing import Dict, Any, List, Tuple

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
        print(f"   ⚠️  Error querying D1: {e}")
        return []

def clean_pashto_word(word: str) -> Tuple[str, bool]:
    """
    Clean punctuation from Pashto word
    
    Returns: (cleaned_word, was_changed)
    """
    if not word:
        return word, False
    
    original = word
    
    # Common Pashto/Arabic punctuation to remove
    # Leading/trailing punctuation
    punctuation_chars = [
        '،',  # Arabic comma
        '؛',  # Arabic semicolon
        '؟',  # Arabic question mark
        '!',  # Exclamation mark
        '?',  # Question mark
        '.',  # Period
        ',',  # Comma
        ';',  # Semicolon
        ':',  # Colon
        '(',  # Left parenthesis
        ')',  # Right parenthesis
        '[',  # Left bracket
        ']',  # Right bracket
        '{',  # Left brace
        '}',  # Right brace
        '"',  # Double quote
        "'",  # Single quote
        '`',  # Backtick
        '/',  # Forward slash
        '\\', # Backslash
        '-',  # Hyphen
        '—',  # Em dash
        '–',  # En dash
        '…',  # Ellipsis
        ' ',  # Space (leading/trailing)
    ]
    
    cleaned = word.strip()
    
    # Remove leading punctuation
    while cleaned and cleaned[0] in punctuation_chars:
        cleaned = cleaned[1:]
    
    # Remove trailing punctuation
    while cleaned and cleaned[-1] in punctuation_chars:
        cleaned = cleaned[:-1]
    
    # Remove any remaining leading/trailing spaces
    cleaned = cleaned.strip()
    
    was_changed = cleaned != original
    
    return cleaned, was_changed

def main():
    print("🧹 Cleaning Punctuation from Word Frequencies\n")
    
    # Step 1: Query all entries
    print("📊 Querying all word_frequencies entries...")
    sql = """
    SELECT id, pashto_word
    FROM word_frequencies
    WHERE pashto_word IS NOT NULL
    """
    
    entries = query_d1(sql)
    print(f"   ✅ Found {len(entries)} entries")
    
    if not entries:
        print("   ⚠️  No entries found")
        return
    
    # Step 2: Clean each entry and check for duplicates
    print("\n🔬 Cleaning entries and checking for duplicates...")
    updates = []
    cleaned_words_seen = {}  # Track cleaned words to detect duplicates
    
    for i, entry in enumerate(entries, 1):
        if i % 1000 == 0:
            print(f"   Processing {i}/{len(entries)}...")
        
        pashto_word = entry.get('pashto_word', '')
        entry_id = entry.get('id')
        
        if not pashto_word:
            continue
        
        cleaned_word, was_changed = clean_pashto_word(pashto_word)
        
        if was_changed and cleaned_word:  # Only update if changed and not empty
            # Check if cleaned word already exists
            if cleaned_word in cleaned_words_seen:
                # Skip - would create duplicate
                continue
            
            # Check if cleaned word already exists in database (case-insensitive)
            # We'll handle this in SQL with a WHERE NOT EXISTS clause
            updates.append({
                'id': entry_id,
                'original': pashto_word,
                'cleaned': cleaned_word
            })
            cleaned_words_seen[cleaned_word] = entry_id
    
    print(f"   ✅ Found {len(updates)} entries to clean")
    
    if not updates:
        print("\n✅ No punctuation found! Data is already clean.")
        return
    
    # Step 3: Generate SQL
    print("\n📝 Generating SQL updates...")
    sql_statements = []
    sql_statements.append("-- Clean Punctuation from Word Frequencies")
    sql_statements.append("-- This removes punctuation, exclamation marks, question marks, etc. from pashto_word")
    sql_statements.append("")
    
    for update in updates:
        original_escaped = "'" + update['original'].replace("'", "''") + "'"
        cleaned_escaped = "'" + update['cleaned'].replace("'", "''") + "'"
        
        # Only update if cleaned word doesn't already exist (avoid UNIQUE constraint violation)
        sql = f"""UPDATE word_frequencies 
SET pashto_word = {cleaned_escaped} 
WHERE id = {update['id']} 
AND NOT EXISTS (
    SELECT 1 FROM word_frequencies wf2 
    WHERE wf2.pashto_word = {cleaned_escaped} 
    AND wf2.id != {update['id']}
);"""
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/clean-punctuation.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(updates)} UPDATE statements")
    
    # Show sample of changes
    print("\n📋 Sample of changes:")
    for update in updates[:10]:
        print(f"   '{update['original']}' → '{update['cleaned']}'")
    
    if len(updates) > 10:
        print(f"   ... and {len(updates) - 10} more")
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/clean-punctuation.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/clean-punctuation.sql")
    print(f"   3. Verify in Cloudflare D1 Studio")

if __name__ == '__main__':
    main()


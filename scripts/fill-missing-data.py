#!/usr/bin/env python3
"""
Fill Missing Data in Word Frequencies from Dictionary

This script fills in missing romanization and POS data from the dictionary
for rapid searching. It's a quick win to populate NULL values.

Goal: Ensure all words have romanization and POS tags for fast filtering
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List

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

def load_dictionary() -> List[Dict[str, Any]]:
    """Load dictionary JSON"""
    dict_paths = [
        'docs/lexicon/full_dictionary_enriched.json',
        'full_dictionary_enriched.json',
        'public/full_dictionary_enriched.json',
        'app/data/full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        path = Path(dict_path)
        if path.exists():
            try:
                print(f'   Loading dictionary from: {path}')
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'entries' in data:
                        return data['entries']
                    elif isinstance(data, list):
                        return data
                    return []
            except Exception as e:
                print(f"   ⚠️  Error loading {dict_path}: {e}")
                continue
    
    print("   ⚠️  Dictionary not found")
    return []

def create_dictionary_lookup(dictionary_entries: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Create fast lookup dictionary by Pashto word"""
    lookup = {}
    
    for entry in dictionary_entries:
        pashto = entry.get('pashto', '') or entry.get('p', '')
        if pashto:
            # Normalize variants
            normalized = pashto.replace('ي', 'ی').replace('ى', 'ی')
            lookup[pashto] = entry
            if normalized != pashto:
                lookup[normalized] = entry
    
    return lookup

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def main():
    print("🔍 Filling Missing Data in Word Frequencies from Dictionary\n")
    
    # Step 1: Load dictionary
    print("📚 Loading dictionary...")
    dictionary_entries = load_dictionary()
    if not dictionary_entries:
        print("   ❌ Could not load dictionary")
        return
    print(f"   ✅ Loaded {len(dictionary_entries)} dictionary entries")
    
    # Create lookup dictionary
    dictionary_lookup = create_dictionary_lookup(dictionary_entries)
    print(f"   ✅ Created lookup dictionary ({len(dictionary_lookup)} entries)")
    
    # Step 2: Query words with missing data
    print("\n📊 Querying words with missing romanization or POS...")
    sql = """
    SELECT pashto_word, romanization, pos
    FROM word_frequencies
    WHERE romanization IS NULL OR pos IS NULL
    LIMIT 1000
    """
    
    missing_entries = query_d1(sql)
    print(f"   ✅ Found {len(missing_entries)} entries with missing data")
    
    if not missing_entries:
        print("   ✅ No missing data found!")
        return
    
    # Step 3: Fill in missing data
    print("\n📝 Generating SQL updates...")
    sql_statements = []
    sql_statements.append("-- Fill Missing Data in Word Frequencies from Dictionary")
    sql_statements.append("-- This fills in NULL romanization and POS values for rapid searching")
    sql_statements.append("")
    
    updated_count = 0
    
    for entry in missing_entries:
        pashto_word = entry.get('pashto_word', '').strip()
        current_rom = entry.get('romanization')
        current_pos = entry.get('pos')
        
        # Find in dictionary
        dict_entry = dictionary_lookup.get(pashto_word)
        if not dict_entry:
            normalized = pashto_word.replace('ي', 'ی').replace('ى', 'ی')
            dict_entry = dictionary_lookup.get(normalized)
        
        if not dict_entry:
            continue
        
        # Get romanization
        dict_rom = dict_entry.get('romanization') or dict_entry.get('f', '')
        dict_pos = dict_entry.get('pos') or dict_entry.get('c', '')
        
        updates = []
        
        if not current_rom and dict_rom:
            updates.append(f"romanization = {escape_sql_string(dict_rom)}")
        
        if not current_pos and dict_pos:
            updates.append(f"pos = {escape_sql_string(dict_pos)}")
        
        if updates:
            pashto_escaped = escape_sql_string(pashto_word)
            sql = f"UPDATE word_frequencies SET {', '.join(updates)} WHERE pashto_word = {pashto_escaped};"
            sql_statements.append(sql)
            updated_count += 1
    
    # Write SQL file
    output_path = Path('cloudflare/fill-missing-data.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {updated_count} UPDATE statements")
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/fill-missing-data.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/fill-missing-data.sql")
    print(f"   3. Re-run this script to fill remaining missing data")

if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Populate word_source_mapping from word_verse_mapping

Extract unique words and their sources (bible verses) to populate word_source_mapping
so we can track where words come from.
"""

import json
import subprocess
from pathlib import Path
from collections import defaultdict

def query_d1(sql_query: str):
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=120)
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

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def main():
    print("📚 Populating word_source_mapping from word_verse_mapping\n")
    
    # Get word sources grouped by word
    print("📊 Querying word_verse_mapping...")
    sql = """
    SELECT 
        pashto_word,
        translation_key,
        COUNT(*) as frequency,
        MIN(verse_ref) as first_verse_ref,
        MIN(verse_id) as first_verse_id
    FROM word_verse_mapping
    WHERE pashto_word IS NOT NULL
    GROUP BY pashto_word, translation_key
    LIMIT 10000
    """
    
    source_data = query_d1(sql)
    print(f"   ✅ Found {len(source_data)} word-source combinations")
    
    if not source_data:
        print("   ⚠️  No data found")
        return
    
    # Generate SQL
    print("\n📝 Generating SQL inserts...")
    sql_statements = []
    sql_statements.append("-- Populate word_source_mapping from word_verse_mapping")
    sql_statements.append("-- This tracks where words come from (bible verses)\n")
    
    for entry in source_data:
        pashto = escape_sql_string(entry.get('pashto_word', ''))
        source_type = "'bible'"
        source_id = escape_sql_string(entry.get('first_verse_ref', ''))
        frequency = entry.get('frequency', 1)
        translation_key = escape_sql_string(entry.get('translation_key', ''))
        
        sql = f"""INSERT OR REPLACE INTO word_source_mapping 
(pashto_word, source_type, source_id, frequency, translation_key)
VALUES ({pashto}, {source_type}, {source_id}, {frequency}, {translation_key});"""
        
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/populate-word-source-mapping.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(source_data)} INSERT statements")
    
    print("\n✅ Done!")
    print(f"\n📋 Next step:")
    print(f"   Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/populate-word-source-mapping.sql")

if __name__ == '__main__':
    main()


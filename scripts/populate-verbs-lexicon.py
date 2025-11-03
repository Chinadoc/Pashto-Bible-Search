#!/usr/bin/env python3
"""
Populate verbs_lexicon from word_frequencies

Since word_frequencies now has comprehensive verb data, populate verbs_lexicon
from it so the existing code that queries verbs_lexicon works.
"""

import json
import subprocess
from pathlib import Path

def query_d1(sql_query: str):
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

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def main():
    print("📚 Populating verbs_lexicon from word_frequencies\n")
    
    # Get all base verbs from word_frequencies
    print("📊 Querying base verbs from word_frequencies...")
    sql = """
    SELECT DISTINCT 
        pashto_word,
        imperfective_stem,
        perfective_stem,
        perfective_root,
        past_participle,
        pos,
        romanization
    FROM word_frequencies
    WHERE word_type = 'verb' 
    AND base_verb = pashto_word
    AND pashto_word IS NOT NULL
    """
    
    verbs = query_d1(sql)
    print(f"   ✅ Found {len(verbs)} base verbs")
    
    if not verbs:
        print("   ⚠️  No verbs found")
        return
    
    # Generate SQL
    print("\n📝 Generating SQL inserts...")
    sql_statements = []
    sql_statements.append("-- Populate verbs_lexicon from word_frequencies")
    sql_statements.append("-- This makes verbs_lexicon available for fast lookups\n")
    
    for verb in verbs:
        pashto = escape_sql_string(verb.get('pashto_word', ''))
        impf_stem = escape_sql_string(verb.get('imperfective_stem', ''))
        perf_stem = escape_sql_string(verb.get('perfective_stem', ''))
        perf_root = escape_sql_string(verb.get('perfective_root', ''))
        past_part = escape_sql_string(verb.get('past_participle', ''))
        pos_val = escape_sql_string(verb.get('pos', ''))
        rom = escape_sql_string(verb.get('romanization', ''))
        
        sql = f"""INSERT OR REPLACE INTO verbs_lexicon 
(pashto_word, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, english)
VALUES ({pashto}, {impf_stem}, {perf_stem}, {perf_root}, {past_part}, {pos_val}, {rom}, NULL);"""
        
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/populate-verbs-lexicon.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(verbs)} INSERT statements")
    
    print("\n✅ Done!")
    print(f"\n📋 Next step:")
    print(f"   Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/populate-verbs-lexicon.sql")

if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Identify verbs with directional pronouns attached

Directional pronouns (را, در, ور) can attach to verbs to form compound verbs:
- راکول (raakawúl) = "to give to me/us"
- درکول (dărkawúl) = "to give to you"
- ورکول (wărkawul) = "to give to him/her/it/them"

This script:
1. Queries word_frequencies for verbs that start with directional pronouns
2. Identifies the base verb (removing directional prefix)
3. Updates the database to mark these as directional verbs
4. Links them to their base verb

Based on: https://grammar.lingdocs.com/pronouns/pronouns-directional/
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'mark-directional-verbs.sql'

# Directional pronouns (from LingDocs pronouns-directional.mdx)
DIRECTIONAL_PREFIXES = {
    'را': ('raa', '1st person - to me/us'),
    'در': ('dăr', '2nd person - to you'),
    'ور': ('wăr', '3rd person - to him/her/it/them'),
}


def query_directional_verbs(limit: int = 1000, offset: int = 0) -> List[Dict]:
    """Query verbs that start with directional pronouns"""
    query_sql = f"""
    SELECT id, pashto_word, frequency_total, pos, base_verb
    FROM word_frequencies
    WHERE (
        pashto_word LIKE 'را%' OR
        pashto_word LIKE 'در%' OR
        pashto_word LIKE 'ور%'
    )
    AND (
        pos LIKE '%verb%' OR
        pos IS NULL OR
        pos = ''
    )
    ORDER BY frequency_total DESC
    LIMIT {limit} OFFSET {offset}
    """
    
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                if isinstance(data, list) and len(data) > 0:
                    if 'results' in data[0]:
                        return data[0]['results']
                elif isinstance(data, dict) and 'results' in data:
                    return data['results'] if isinstance(data['results'], list) else []
            except json.JSONDecodeError as e:
                print(f"   ⚠️  JSON parse error: {e}")
                print(f"   Output preview: {result.stdout[:500]}")
        else:
            print(f"   ⚠️  Query failed: {result.stderr[:300] if result.stderr else result.stdout[:300]}")
        return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []


def extract_base_verb(word: str) -> Optional[Tuple[str, str]]:
    """
    Extract base verb from directional verb
    
    Examples:
    - "راکول" -> ("را", "کول")
    - "ورکړ" -> ("ور", "کړ")  # perfective form
    - "درکړه" -> ("در", "کړه")
    
    Returns: (directional_prefix, base_verb) or None
    """
    for prefix in DIRECTIONAL_PREFIXES.keys():
        if word.startswith(prefix):
            base = word[len(prefix):]
            if base:  # Make sure there's something after the prefix
                return (prefix, base)
    return None


def query_base_verb_exists(base_verb: str) -> bool:
    """Check if base verb exists in word_frequencies or verbs_lexicon"""
    # Check word_frequencies
    query_sql = f"SELECT 1 FROM word_frequencies WHERE pashto_word = {json.dumps(base_verb)} LIMIT 1"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                if results:
                    return True
    except:
        pass
    
    # Check verbs_lexicon
    query_sql = f"SELECT 1 FROM verbs_lexicon WHERE verb_root = {json.dumps(base_verb)} LIMIT 1"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                if results:
                    return True
    except:
        pass
    
    return False


def escape_sql(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return "NULL"
    return "'" + text.replace("'", "''") + "'"


def main():
    print("🔍 Identifying verbs with directional pronouns...\n")
    
    # Query in batches
    all_entries = []
    batch_size = 1000
    offset = 0
    
    while True:
        print(f"   Querying batch: offset {offset}...")
        entries = query_directional_verbs(limit=batch_size, offset=offset)
        if not entries:
            break
        all_entries.extend(entries)
        print(f"      Found {len(entries)} entries (total: {len(all_entries)})")
        if len(entries) < batch_size:
            break
        offset += batch_size
    
    print(f"\n   ✅ Total found: {len(all_entries)} potential directional verbs\n")
    
    if not all_entries:
        print("   No directional verbs found")
        return
    
    # Analyze each verb
    directional_verbs = []
    unknown_prefixes = []
    
    for entry in all_entries:
        word = entry['pashto_word']
        extracted = extract_base_verb(word)
        
        if not extracted:
            unknown_prefixes.append(word)
            continue
        
        prefix, base_verb = extracted
        
        # Check if base verb exists
        base_exists = query_base_verb_exists(base_verb)
        
        directional_verbs.append({
            'id': entry['id'],
            'word': word,
            'prefix': prefix,
            'base_verb': base_verb,
            'base_exists': base_exists,
            'frequency': entry.get('frequency_total', 0),
            'current_pos': entry.get('pos'),
        })
    
    print(f"   📊 Analysis:")
    print(f"      Directional verbs: {len(directional_verbs)}")
    print(f"      Unknown prefixes: {len(unknown_prefixes)}\n")
    
    # Generate SQL
    sql_statements = []
    sql_statements.append('-- Mark verbs with directional pronouns')
    sql_statements.append('-- Based on: https://grammar.lingdocs.com/pronouns/pronouns-directional/')
    sql_statements.append('')
    
    # Group by prefix
    for prefix in DIRECTIONAL_PREFIXES.keys():
        prefix_verbs = [v for v in directional_verbs if v['prefix'] == prefix]
        if not prefix_verbs:
            continue
        
        sql_statements.append(f"-- {prefix} ({DIRECTIONAL_PREFIXES[prefix][1]})")
        
        for verb in prefix_verbs:
            word_escaped = escape_sql(verb['word'])
            base_verb_escaped = escape_sql(verb['base_verb'])
            
            # Update to mark as directional verb
            sql_statements.append(f"-- {verb['word']} (base: {verb['base_verb']})")
            
            # Set pos to indicate directional verb
            # Also set base_verb if it exists
            if verb['base_exists']:
                sql_statements.append(f"""
UPDATE word_frequencies
SET pos = COALESCE(pos || '_directional', 'verb_directional'),
    base_verb = {base_verb_escaped}
WHERE id = {verb['id']} AND (base_verb IS NULL OR base_verb = '');
""")
            else:
                sql_statements.append(f"""
UPDATE word_frequencies
SET pos = COALESCE(pos || '_directional', 'verb_directional')
WHERE id = {verb['id']};
""")
        
        sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"   📊 Prepared {len(directional_verbs)} directional verbs")
    
    print(f"\n📋 Sample directional verbs (first 10):")
    for verb in directional_verbs[:10]:
        base_status = "✓" if verb['base_exists'] else "✗"
        print(f"   {verb['word']} ({verb['prefix']} + {verb['base_verb']}) {base_status}")
    
    if unknown_prefixes:
        print(f"\n⚠️  Sample unknown prefixes (first 5):")
        for word in unknown_prefixes[:5]:
            print(f"   {word}")
    
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")


if __name__ == '__main__':
    main()


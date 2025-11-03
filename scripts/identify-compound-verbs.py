#!/usr/bin/env python3
"""
Identify and handle dynamic/stative compound words

For compound verbs like "wahul" (وهم + ل), we should:
1. Keep the compound form as a separate entry
2. Delete individual parts if they only appear in compounds
"""

import json
import subprocess
import re
import sys

# Common compound verb patterns
COMPOUND_VERB_PATTERNS = [
    # Pattern: verb stem + ل (dynamic marker)
    r'[^\s]+ل\b',  # ends with ل
    # Pattern: verb stem + و (stative marker)
    r'[^\s]+و\b',  # ends with و
]

def query_word_frequencies(pattern=None, limit=100):
    """Query word_frequencies for words matching pattern"""
    if pattern:
        cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, pos, word_type FROM word_frequencies WHERE pashto_word LIKE '%{pattern}%' AND word_type IS NULL LIMIT {limit};" --json"""
    else:
        cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, pos, word_type FROM word_frequencies WHERE word_type IS NULL ORDER BY frequency_total DESC LIMIT {limit};" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, dict) and 'results' in first_item:
                    return first_item['results']
            elif isinstance(data, dict):
                return data.get('results', [])
            return []
        else:
            print(f"   ⚠️  Error: {result.stderr[:200]}")
            return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []

def find_compound_verbs(words):
    """Identify compound verbs (dynamic/stative)"""
    compound_verbs = []
    
    # Common suffixes that indicate compound verbs
    dynamic_suffixes = ['ل', 'ول', 'ېدل', 'کول']
    stative_suffixes = ['و', 'وو', 'ېدل']
    
    for word_data in words:
        word = word_data.get('pashto_word', '')
        if not word:
            continue
        
        # Check if word ends with dynamic/stative markers
        is_dynamic = any(word.endswith(suffix) for suffix in dynamic_suffixes)
        is_stative = any(word.endswith(suffix) for suffix in stative_suffixes)
        
        # Check if it contains zero-width joiner (compound indicator)
        has_joiner = '\u200c' in word or '\u200d' in word
        
        # Check if it's likely a compound verb
        # Pattern: root + verb marker
        if (is_dynamic or is_stative) and len(word) > 2:
            # Try to identify the root
            root = word
            if is_dynamic:
                for suffix in dynamic_suffixes:
                    if word.endswith(suffix):
                        root = word[:-len(suffix)]
                        break
            elif is_stative:
                for suffix in stative_suffixes:
                    if word.endswith(suffix):
                        root = word[:-len(suffix)]
                        break
            
            compound_verbs.append({
                'word': word,
                'type': 'dynamic' if is_dynamic else 'stative',
                'root': root,
                'frequency': word_data.get('frequency_total', 0),
                'has_joiner': has_joiner,
            })
    
    return compound_verbs

def check_if_root_exists_separately(root):
    """Check if the root exists as a separate word in word_frequencies"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total FROM word_frequencies WHERE pashto_word = '{root.replace("'", "''")}' LIMIT 1;" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, dict) and 'results' in first_item:
                    results = first_item['results']
                    return len(results) > 0
            elif isinstance(data, dict):
                return len(data.get('results', [])) > 0
        return False
    except:
        return False

def main():
    print('🔍 Analyzing compound verbs (dynamic/stative)...\n')
    
    # Get all words
    all_words = query_word_frequencies(limit=1000)
    
    print(f'   Found {len(all_words)} words to analyze')
    
    # Find compound verbs
    compound_verbs = find_compound_verbs(all_words)
    
    print(f'\n   Found {len(compound_verbs)} potential compound verbs')
    
    # Analyze which roots exist separately
    to_delete = []
    to_keep = []
    
    for compound in compound_verbs:
        root = compound['root']
        if root and len(root) >= 2:
            root_exists = check_if_root_exists_separately(root)
            if root_exists:
                print(f"   ⚠️  {compound['word']} (root: {root}) - root exists separately, keep both")
                to_keep.append(compound)
            else:
                print(f"   ✅ {compound['word']} (root: {root}) - root doesn't exist separately, can delete root if found")
                # We'd need to check if root appears in word_frequencies
                # For now, just mark compound verbs
                compound['mark_as_compound'] = True
    
    # Generate SQL
    sql_updates = []
    
    # Mark compound verbs
    for compound in compound_verbs:
        if compound.get('mark_as_compound'):
            word_type = f"compound_{compound['type']}"
            sql_updates.append(f"-- {compound['word']} is a {compound['type']} compound verb")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = '{word_type}', has_issues = 0 WHERE pashto_word = '{compound['word'].replace(\"'\", \"''\")}';")
            sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/mark-compound-verbs.sql'
    sql_content = [
        '-- Mark compound verbs (dynamic/stative)',
        '-- These are verbs formed by combining a root with a verb marker',
        '',
        '-- Add word_type column if missing',
        "ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;",
        '',
    ] + sql_updates + [
        '',
        '-- Create index',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
    ]
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_content))
    
    print(f'\n✅ Generated: {sql_path}')
    print(f'   Found {len(compound_verbs)} compound verbs to mark\n')

if __name__ == '__main__':
    main()


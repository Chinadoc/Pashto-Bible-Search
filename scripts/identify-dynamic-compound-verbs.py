#!/usr/bin/env python3
"""
Identify dynamic compound verbs (v. dyn. comp. trans.)

Pattern: Noun (object complement) + Auxiliary Verb = Dynamic Compound Verb
Example: قدم (qadám, step) + وهل (wahul, to hit/strike) = قدم وهل (to take a step/to walk)

According to LingDocs grammar: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/
- Dynamic compounds conjugate using the auxiliary verb pattern
- The noun part (object complement) stays constant
- The verb part conjugates normally

Strategy:
1. Check dictionary for entries marked as "v. dyn. comp. trans." or similar
2. Identify compound patterns: Noun + Verb (with space or zero-width joiner)
3. Mark compound forms as 'compound_dynamic' in word_frequencies
4. Keep compound forms as separate entries (don't delete)
"""

import json
import subprocess
import re
import sys
from pathlib import Path

# Common auxiliary verbs used in dynamic compounds
AUXILIARY_VERBS = [
    'وهل',  # to hit/strike (most common)
    'کول',  # to do/make
    'کړل',  # to do/make (past)
    'ورکړل',  # to give
    'اخیستل',  # to take
    'کړ',  # did/made (short form)
    'شو',  # became
    'ول',  # did/made (past)
]

def load_dictionary():
    """Load dictionary JSON to check for compound verb entries"""
    dict_path = Path('docs/lexicon/full_dictionary_enriched.json')
    if not dict_path.exists():
        print(f"⚠️  Dictionary not found at {dict_path}")
        return []
    
    try:
        with open(dict_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Dictionary structure: {"info": {...}, "entries": [...]}
            if isinstance(data, dict) and 'entries' in data:
                return data['entries']
            elif isinstance(data, list):
                return data
            return []
    except Exception as e:
        print(f"⚠️  Error loading dictionary: {e}")
        return []

def query_verses_for_word(word, limit=5):
    """Query verses to see how a word appears in context"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, text FROM verses_afghan2023 WHERE text LIKE '%{word}%' LIMIT {limit};" --json"""
    
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
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []

def find_dynamic_compounds_in_dictionary(entries):
    """Find entries in dictionary marked as dynamic compound verbs"""
    compounds = []
    
    # Look for entries with "dyn. comp." or "dynamic compound" in POS or definition
    for entry in entries:
        if not isinstance(entry, dict):
            continue
            
        pos = entry.get('pos', '') or entry.get('c', '') or ''
        english = entry.get('english', '') or entry.get('e', '') or ''
        pashto = entry.get('pashto', '') or entry.get('p', '') or ''
        
        # Check if marked as dynamic compound
        is_dyn_comp = (
            'dyn. comp.' in pos.lower() or
            'dynamic compound' in pos.lower() or
            'v. dyn. comp.' in pos.lower()
        )
        
        if is_dyn_comp and pashto:
            # Check if it contains space or zero-width joiner (compound indicator)
            has_separator = ' ' in pashto or '\u200c' in pashto or '\u200d' in pashto
            
            if has_separator:
                compounds.append({
                    'pashto': pashto,
                    'english': english,
                    'pos': pos,
                    'romanization': entry.get('romanization', '') or entry.get('f', ''),
                })
    
    return compounds

def identify_compound_patterns_in_word_frequencies():
    """Identify potential dynamic compounds in word_frequencies"""
    cmd = """wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE (pashto_word LIKE '% %' OR pashto_word LIKE '%\u200c%' OR pashto_word LIKE '%\u200d%') AND pos LIKE '%verb%' LIMIT 200;" --json"""
    
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
    except Exception as e:
        print(f"⚠️  Error: {e}")
        return []

def parse_compound(compound_word):
    """Parse a compound word into noun + verb parts"""
    # Split by space, zero-width joiner, or zero-width non-joiner
    parts = re.split(r'[\s\u200c\u200d]+', compound_word.strip())
    
    if len(parts) >= 2:
        # Assume first part is noun, rest is verb
        noun_part = parts[0]
        verb_part = ' '.join(parts[1:])
        
        return {
            'noun': noun_part,
            'verb': verb_part,
            'full': compound_word,
        }
    
    return None

def check_if_auxiliary_verb(verb_part):
    """Check if verb part is a known auxiliary verb"""
    # Remove common verb endings to check root
    verb_root = verb_part
    for ending in ['ل', 'ول', 'ېدل', 'کول']:
        if verb_part.endswith(ending):
            verb_root = verb_part[:-len(ending)]
            break
    
    # Check if it matches known auxiliary verbs
    return verb_part in AUXILIARY_VERBS or verb_root in AUXILIARY_VERBS

def main():
    print('🔍 Identifying dynamic compound verbs (v. dyn. comp. trans.)...\n')
    
    # Load dictionary
    print('📚 Loading dictionary...')
    dictionary = load_dictionary()
    dict_compounds = find_dynamic_compounds_in_dictionary(dictionary)
    
    print(f'   Found {len(dict_compounds)} dynamic compounds in dictionary')
    if dict_compounds:
        print('   Examples:')
        for comp in dict_compounds[:5]:
            print(f'      - {comp["pashto"]}: {comp["english"]} ({comp["pos"]})')
    
    # Find potential compounds in word_frequencies
    print('\n📊 Analyzing word_frequencies for compound patterns...')
    freq_compounds = identify_compound_patterns_in_word_frequencies()
    
    print(f'   Found {len(freq_compounds)} potential compound verbs')
    
    # Analyze each potential compound
    confirmed_compounds = []
    
    for word_data in freq_compounds:
        word = word_data.get('pashto_word', '')
        if not word:
            continue
        
        parsed = parse_compound(word)
        if not parsed:
            continue
        
        # Check if verb part is an auxiliary verb
        is_auxiliary = check_if_auxiliary_verb(parsed['verb'])
        
        # Check if it's already in dictionary
        in_dict = any(comp['pashto'] == word for comp in dict_compounds)
        
        if is_auxiliary or in_dict:
            confirmed_compounds.append({
                'word': word,
                'noun_part': parsed['noun'],
                'verb_part': parsed['verb'],
                'frequency': word_data.get('frequency_total', 0),
                'pos': word_data.get('pos', ''),
                'in_dictionary': in_dict,
                'is_auxiliary': is_auxiliary,
            })
    
    print(f'\n   ✅ Confirmed {len(confirmed_compounds)} dynamic compound verbs')
    
    # Generate SQL
    sql_updates = []
    
    for compound in confirmed_compounds:
        word = compound['word']
        noun = compound['noun_part']
        verb = compound['verb_part']
        
        sql_updates.append(f"-- {word} = {noun} + {verb} (dynamic compound)")
        sql_updates.append(f"-- Mark as compound_dynamic")
        clean_word = word.replace("'", "''")
        
        # Update POS to include dynamic compound marker if not already present
        pos_update = "pos = 'v. dyn. comp. trans.'" if not compound['in_dictionary'] else ""
        
        if pos_update:
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'compound_dynamic', {pos_update}, has_issues = 0 WHERE pashto_word = '{clean_word}';")
        else:
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'compound_dynamic', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/mark-dynamic-compound-verbs.sql'
    sql_content = [
        '-- Mark dynamic compound verbs (v. dyn. comp. trans.)',
        '-- Pattern: Noun (object complement) + Auxiliary Verb = Dynamic Compound Verb',
        '-- Example: قدم (step) + وهل (to hit/strike) = قدم وهل (to take a step/to walk)',
        '-- Reference: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/',
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
    
    # Write analysis results
    json_path = 'cloudflare/dynamic-compound-verbs-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'dictionary_compounds': dict_compounds,
            'confirmed_compounds': confirmed_compounds,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Next steps:')
    print('   1. Review dynamic-compound-verbs-analysis.json')
    print('   2. Review and run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/mark-dynamic-compound-verbs.sql')
    print('   3. This will mark dynamic compound verbs so they can be filtered/displayed correctly\n')

if __name__ == '__main__':
    main()


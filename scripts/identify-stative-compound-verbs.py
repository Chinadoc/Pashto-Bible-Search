#!/usr/bin/env python3
"""
Identify stative compound verbs (v. stat. comp. trans./intrans.)

Pattern: Complement (adjective/noun) + Helper Verb = Stative Compound Verb
- Intransitive: complement + کېدل (kedúl, to become)
- Transitive: complement + کول (kawúl, to make)

According to LingDocs grammar: https://grammar.lingdocs.com/compound-verbs/stative-compounds/

Squishing: When complement ends in consonant or ه - u, and we're in imperfective:
- Remove ک from front of verb and join words
- Example: پاک (paak) + کول (kawúl) = پاکول (paakawúl)

Welding: Complement and verb become one block (except in perfective)
- Complement loses accent when welded
- Cannot put anything between them

Strategy:
1. Check dictionary for entries marked as "v. stat. comp." or similar
2. Identify patterns: Complement + کېدل or کول
3. Mark squished forms (پاکول) as compound_stative
4. Keep compound forms as separate entries
"""

import json
import subprocess
import re
import sys
from pathlib import Path

# Helper verbs for stative compounds
STATIVE_HELPER_VERBS = {
    'intransitive': ['کېدل', 'kedúl', 'کېږي', 'kedul'],
    'transitive': ['کول', 'kawúl', 'کوم', 'kawul'],
}

def load_dictionary():
    """Load dictionary JSON to check for stative compound verb entries"""
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

def find_stative_compounds_in_dictionary(entries):
    """Find entries in dictionary marked as stative compound verbs"""
    compounds = []
    
    # Look for entries with "stat. comp." or "stative compound" in POS
    for entry in entries:
        if not isinstance(entry, dict):
            continue
            
        pos = entry.get('pos', '') or entry.get('c', '') or ''
        english = entry.get('english', '') or entry.get('e', '') or ''
        pashto = entry.get('pashto', '') or entry.get('p', '') or ''
        romanization = entry.get('romanization', '') or entry.get('f', '') or ''
        
        # Check if marked as stative compound
        is_stat_comp = (
            'stat. comp.' in pos.lower() or
            'stative compound' in pos.lower() or
            'v. stat. comp.' in pos.lower()
        )
        
        if is_stat_comp and pashto:
            # Check if it's squished (no space, ends with ول or ېدل)
            is_squished = (
                pashto.endswith('ول') or  # transitive squished
                pashto.endswith('ېدل') or  # intransitive squished
                pashto.endswith('کول') or  # transitive unsquished
                pashto.endswith('کېدل')   # intransitive unsquished
            )
            
            # Also check for space-separated forms
            has_separator = ' ' in pashto or '\u200c' in pashto or '\u200d' in pashto
            
            # Determine transitivity
            is_transitive = 'trans' in pos.lower() or pashto.endswith('ول') or pashto.endswith('کول')
            is_intransitive = 'intrans' in pos.lower() or pashto.endswith('ېدل') or pashto.endswith('کېدل')
            
            compounds.append({
                'pashto': pashto,
                'english': english,
                'pos': pos,
                'romanization': romanization,
                'is_squished': is_squished and not has_separator,
                'has_separator': has_separator,
                'is_transitive': is_transitive,
                'is_intransitive': is_intransitive,
            })
    
    return compounds

def parse_squished_stative_compound(word):
    """Parse a squished stative compound to extract complement and verb"""
    # Pattern: complement ends in consonant/ه, then ول or ېدل
    # Squished forms: پاکول (paak + کول), بندول (band + کول)
    
    # Check for transitive squished (ends with ول)
    if word.endswith('ول'):
        complement = word[:-2]  # Remove 'ول'
        verb_part = 'کول'
        return {
            'complement': complement,
            'verb': verb_part,
            'type': 'transitive',
            'squished': True,
        }
    
    # Check for intransitive squished (ends with ېدل)
    if word.endswith('ېدل'):
        complement = word[:-3]  # Remove 'ېدل'
        verb_part = 'کېدل'
        return {
            'complement': complement,
            'verb': verb_part,
            'type': 'intransitive',
            'squished': True,
        }
    
    # Check for unsquished forms (ends with کول or کېدل)
    if word.endswith('کول'):
        complement = word[:-2]  # Remove 'کول'
        verb_part = 'کول'
        return {
            'complement': complement,
            'verb': verb_part,
            'type': 'transitive',
            'squished': False,
        }
    
    if word.endswith('کېدل'):
        complement = word[:-3]  # Remove 'کېدل'
        verb_part = 'کېدل'
        return {
            'complement': complement,
            'verb': verb_part,
            'type': 'intransitive',
            'squished': False,
        }
    
    return None

def find_matching_stative_compounds_in_word_frequencies(dict_compounds):
    """Find dictionary stative compounds that exist in word_frequencies"""
    matching_compounds = []
    
    print(f'\n🔍 Matching dictionary stative compounds with word_frequencies...')
    
    for compound in dict_compounds[:200]:  # Process first 200 to avoid timeout
        pashto = compound['pashto']
        
        # Try exact match first
        # Also try without spaces (words might be stored without spaces)
        pashto_no_space = pashto.replace(' ', '').replace('\u200c', '').replace('\u200d', '')
        
        cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word = '{pashto.replace("'", "''")}' OR pashto_word = '{pashto_no_space.replace("'", "''")}' LIMIT 1;" --json"""
        
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=5)
            if result.returncode == 0:
                data = json.loads(result.stdout)
                results = []
                if isinstance(data, list) and len(data) > 0:
                    first_item = data[0]
                    if isinstance(first_item, dict) and 'results' in first_item:
                        results = first_item['results']
                elif isinstance(data, dict):
                    results = data.get('results', [])
                
                if results:
                    matching_compounds.append({
                        'dictionary_entry': compound,
                        'word_frequency_entry': results[0],
                    })
        except Exception as e:
            # Skip on error/timeout
            continue
    
    return matching_compounds

def main():
    print('🔍 Identifying stative compound verbs (v. stat. comp.)...\n')
    
    # Load dictionary
    print('📚 Loading dictionary...')
    entries = load_dictionary()
    dict_compounds = find_stative_compounds_in_dictionary(entries)
    
    print(f'   Found {len(dict_compounds)} stative compounds in dictionary')
    
    # Separate by type
    transitive = [c for c in dict_compounds if c.get('is_transitive')]
    intransitive = [c for c in dict_compounds if c.get('is_intransitive')]
    squished = [c for c in dict_compounds if c.get('is_squished')]
    
    print(f'   - Transitive: {len(transitive)}')
    print(f'   - Intransitive: {len(intransitive)}')
    print(f'   - Squished forms: {len(squished)}')
    
    if dict_compounds:
        print('\n   Examples:')
        for comp in dict_compounds[:5]:
            comp_type = 'trans.' if comp.get('is_transitive') else 'intrans.'
            squished_label = ' (squished)' if comp.get('is_squished') else ''
            print(f'      - {comp["pashto"]}: {comp["english"]} ({comp["pos"]}){squished_label}')
    
    # Find matching compounds in word_frequencies
    print('\n🔍 Matching dictionary stative compounds with word_frequencies...')
    matching = find_matching_stative_compounds_in_word_frequencies(dict_compounds)
    print(f'   Found {len(matching)} matching compounds in word_frequencies')
    
    # Analyze each matching compound
    confirmed_compounds = []
    
    for match in matching:
        compound = match['dictionary_entry']
        word_data = match['word_frequency_entry']
        
        word = word_data.get('pashto_word', '')
        parsed = parse_squished_stative_compound(word)
        
        if parsed or compound.get('is_squished'):
            confirmed_compounds.append({
                'word': word,
                'complement': parsed['complement'] if parsed else None,
                'verb_part': parsed['verb'] if parsed else None,
                'frequency': word_data.get('frequency_total', 0),
                'pos': word_data.get('pos', ''),
                'dictionary_pos': compound.get('pos', ''),
                'english': compound.get('english', ''),
                'is_transitive': compound.get('is_transitive', False),
                'is_intransitive': compound.get('is_intransitive', False),
                'is_squished': compound.get('is_squished', False),
                'in_dictionary': True,
            })
    
    print(f'\n   ✅ Confirmed {len(confirmed_compounds)} stative compound verbs')
    
    # Generate SQL
    sql_updates = []
    
    for compound in confirmed_compounds:
        word = compound['word']
        comp_type = 'transitive' if compound.get('is_transitive') else 'intransitive'
        squished_label = ' (squished)' if compound.get('is_squished') else ''
        
        sql_updates.append(f"-- {word} = {compound.get('complement', '?')} + {compound.get('verb_part', '?')} ({comp_type} stative compound{squished_label})")
        sql_updates.append(f"-- Mark as compound_stative")
        clean_word = word.replace("'", "''")
        
        # Update POS to include stative compound marker
        pos_update = f"pos = '{compound['dictionary_pos']}'" if compound.get('dictionary_pos') else ""
        
        if pos_update:
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'compound_stative', {pos_update}, has_issues = 0 WHERE pashto_word = '{clean_word}';")
        else:
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'compound_stative', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/mark-stative-compound-verbs.sql'
    sql_content = [
        '-- Mark stative compound verbs (v. stat. comp. trans./intrans.)',
        '-- Pattern: Complement (adjective/noun) + Helper Verb = Stative Compound Verb',
        '-- Intransitive: complement + کېدل (to become)',
        '-- Transitive: complement + کول (to make)',
        '-- Example: پاک (clean) + کول (to make) = پاکول (to clean) - squished form',
        '-- Reference: https://grammar.lingdocs.com/compound-verbs/stative-compounds/',
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
    json_path = 'cloudflare/stative-compound-verbs-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'dictionary_compounds': dict_compounds[:100],  # Limit size
            'confirmed_compounds': confirmed_compounds,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Next steps:')
    print('   1. Review stative-compound-verbs-analysis.json')
    print('   2. Review and run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/mark-stative-compound-verbs.sql')
    print('   3. This will mark stative compound verbs so they can be filtered/displayed correctly')
    print('   4. Note: These compounds can be "welded" (one block) or "squished" (ک removed)')
    print('   5. In perfective aspect, complements "split out" and regain accent\n')

if __name__ == '__main__':
    main()


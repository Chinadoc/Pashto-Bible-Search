#!/usr/bin/env python3
"""
Import Verb Stems/Roots from Dictionary to Word Frequencies

This script:
1. Loads dictionary JSON file
2. Extracts all verbs with their stems/roots (psp, ssp, prp)
3. Matches verbs from dictionary to word_frequencies
4. Updates word_frequencies with base verb information
5. Generates SQL to update database

Goal: Have base verb forms and stems/roots for matching conjugations
"""

import json
import subprocess
import re
import sys
from pathlib import Path
from collections import defaultdict

def query_d1(sql_query):
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
        print(f"   ⚠️  Error: {e}")
        return []

def load_dictionary():
    """Load dictionary JSON to get verb stems/roots"""
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
                    # Dictionary structure: {"info": {...}, "entries": [...]}
                    if isinstance(data, dict) and 'entries' in data:
                        return data['entries']
                    elif isinstance(data, list):
                        return data
                    return []
            except Exception as e:
                print(f"   ⚠️  Error loading {dict_path}: {e}")
                continue
    
    print("   ⚠️  Dictionary not found in any location")
    return []

def infer_missing_stems(verb_root, psp, ssp, prp, pp):
    """Infer missing stems/roots based on verb patterns"""
    # If we have psp, try to infer others
    if psp and not ssp:
        # Perfective stem is often 'و' + imperfective stem
        if not psp.startswith('و'):
            ssp = 'و' + psp
    
    if verb_root and not prp:
        # Perfective root is often 'و' + verb_root
        if not verb_root.startswith('و'):
            prp = 'و' + verb_root
        else:
            prp = verb_root
    
    if verb_root and not pp:
        # Infer past participle from verb root
        if verb_root.endswith('ل'):
            base = verb_root[:-1]
            if base:
                # Common patterns for past participle
                if verb_root.endswith('ېدل'):
                    pp = base + 'لی'  # Remove last ل, add لی
                elif verb_root.endswith('کېدل'):
                    pp = 'شوی'  # Helper verb becomes شوی
                elif verb_root.endswith('کول'):
                    # Stative compound transitive: complement + کړی
                    comp = verb_root[:-3]  # Remove 'کول'
                    pp = comp + ' کړی'
                elif verb_root.endswith('ول') and ' ' not in verb_root:
                    # Squished stative compound: complement + کړی
                    comp = verb_root[:-2]  # Remove 'ول'
                    pp = comp + ' کړی'
                else:
                    pp = base + 'لی'
    
    return psp, ssp, prp, pp

def extract_verb_data(dictionary_entries):
    """Extract verb data with stems/roots from dictionary"""
    verbs = {}
    
    for entry in dictionary_entries:
        if not isinstance(entry, dict):
            continue
        
        pashto = entry.get('pashto', '') or entry.get('p', '')
        pos = entry.get('pos', '') or entry.get('c', '') or ''
        
        # ONLY include actual verbs (must have verb POS tag)
        if not pashto:
            continue
        
        # Must have verb POS tag (not nouns/adjectives ending in ل)
        is_verb = ('verb' in pos.lower() or 'v.' in pos.lower())
        
        if not is_verb:
            continue
        
        # Extract stems/roots from dictionary
        # psp = present stem (imperfective stem)
        # ssp = subjunctive stem (perfective stem)
        # prp = perfective root
        psp = entry.get('psp') or entry.get('present_stem') or ''
        ssp = entry.get('ssp') or entry.get('subjunctive_stem') or ''
        prp = entry.get('prp') or entry.get('perfective_root') or ''
        
        # Get past participle - check multiple fields
        pp = (
            entry.get('pp') or 
            entry.get('past_participle') or 
            entry.get('tppp') or  # past participle plural?
            ''
        )
        
        # Infer missing stems/roots
        psp, ssp, prp, pp = infer_missing_stems(pashto, psp, ssp, prp, pp)
        
        # Get romanization
        romanization = entry.get('romanization') or entry.get('f', '') or ''
        
        # Store verb data
        verbs[pashto] = {
            'pashto': pashto,
            'pos': pos,
            'psp': psp,  # Imperfective stem
            'ssp': ssp,  # Perfective stem
            'prp': prp,  # Perfective root
            'pp': pp,    # Past participle
            'romanization': romanization,
            'english': entry.get('english', '') or entry.get('e', ''),
        }
    
    return verbs

def main():
    print('🔍 Import Verb Stems/Roots from Dictionary to Word Frequencies\n')
    
    # Step 1: Load dictionary
    print('📚 Step 1: Loading dictionary...')
    dictionary_entries = load_dictionary()
    
    if not dictionary_entries:
        print('   ❌ Could not load dictionary')
        return
    
    print(f'   ✅ Loaded {len(dictionary_entries)} dictionary entries')
    
    # Step 2: Extract verb data
    print(f'\n📝 Step 2: Extracting verb data from dictionary...')
    dictionary_verbs = extract_verb_data(dictionary_entries)
    print(f'   ✅ Found {len(dictionary_verbs)} verbs in dictionary')
    
    # Show sample
    print(f'\n   Sample verbs with stems/roots:')
    for i, (verb_root, verb_data) in enumerate(list(dictionary_verbs.items())[:5]):
        print(f'      {i+1}. {verb_root}')
        print(f'         psp (imperfective stem): {verb_data["psp"] or "N/A"}')
        print(f'         ssp (perfective stem): {verb_data["ssp"] or "N/A"}')
        print(f'         prp (perfective root): {verb_data["prp"] or "N/A"}')
        print(f'         pp (past participle): {verb_data["pp"] or "N/A"}')
    
    # Step 3: Find matching verbs in word_frequencies
    print(f'\n🔍 Step 3: Matching dictionary verbs with word_frequencies...')
    
    # Get all verbs from word_frequencies
    sql = """
    SELECT pashto_word, frequency_total, pos 
    FROM word_frequencies 
    WHERE pashto_word LIKE '%ل'
    ORDER BY frequency_total DESC
    LIMIT 1000
    """
    
    word_freq_verbs = query_d1(sql)
    print(f'   Found {len(word_freq_verbs)} verbs in word_frequencies')
    
    # Match dictionary verbs to word_frequencies
    matched_verbs = []
    
    for verb_root, verb_data in dictionary_verbs.items():
        # Try exact match
        matches = [v for v in word_freq_verbs if v.get('pashto_word') == verb_root]
        
        if matches:
            matched_verbs.append({
                'verb_root': verb_root,
                'frequency': matches[0].get('frequency_total', 0),
                'pos': matches[0].get('pos', ''),
                'dictionary_data': verb_data,
            })
    
    print(f'   ✅ Matched {len(matched_verbs)} verbs')
    
    # Step 4: Generate SQL to update word_frequencies
    print(f'\n📝 Step 4: Generating SQL updates...')
    
    sql_updates = []
    
    # Add columns if missing
    sql_updates.append('-- Add columns if missing')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN base_verb TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN imperfective_stem TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN perfective_stem TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN perfective_root TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN past_participle TEXT;')
    sql_updates.append('')
    
    # Update base verbs with dictionary data
    sql_updates.append('-- Update base verbs with dictionary stems/roots')
    for verb_info in matched_verbs:
        verb_root = verb_info['verb_root']
        verb_data = verb_info['dictionary_data']
        
        clean_verb = verb_root.replace("'", "''")
        psp = (verb_data['psp'] or '').replace("'", "''")
        ssp = (verb_data['ssp'] or '').replace("'", "''")
        prp = (verb_data['prp'] or '').replace("'", "''")
        pp = (verb_data['pp'] or '').replace("'", "''")
        
        sql_updates.append(f'-- {verb_root}: psp={verb_data["psp"]}, ssp={verb_data["ssp"]}, prp={verb_data["prp"]}, pp={verb_data["pp"]}')
        sql_updates.append(f"UPDATE word_frequencies SET")
        sql_updates.append(f"  word_type = 'verb',")
        sql_updates.append(f"  base_verb = '{clean_verb}',")
        if psp:
            sql_updates.append(f"  imperfective_stem = '{psp}',")
        if ssp:
            sql_updates.append(f"  perfective_stem = '{ssp}',")
        if prp:
            sql_updates.append(f"  perfective_root = '{prp}',")
        if pp:
            sql_updates.append(f"  past_participle = '{pp}',")
        sql_updates.append(f"  has_issues = 0")
        sql_updates.append(f"WHERE pashto_word = '{clean_verb}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/import-verb-stems-from-dictionary.sql'
    sql_content = [
        '-- Import Verb Stems/Roots from Dictionary to Word Frequencies',
        '-- This adds base verb information (stems/roots) from dictionary to word_frequencies',
        '-- Reference: https://grammar.lingdocs.com/verbs/master-chart/',
        '',
    ] + sql_updates + [
        '',
        '-- Create indexes',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_verb ON word_frequencies (base_verb);',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_imperfective_stem ON word_frequencies (imperfective_stem);',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_perfective_stem ON word_frequencies (perfective_stem);',
    ]
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_content))
    
    # Write analysis results
    json_path = 'cloudflare/verb-dictionary-import.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'total_dictionary_verbs': len(dictionary_verbs),
            'total_matched': len(matched_verbs),
            'matched_verbs': matched_verbs[:100],  # Limit size
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Summary:')
    print(f'   - Dictionary verbs: {len(dictionary_verbs)}')
    print(f'   - Word_frequencies verbs: {len(word_freq_verbs)}')
    print(f'   - Matched: {len(matched_verbs)}')
    print(f'   - Coverage: {(len(matched_verbs)/len(dictionary_verbs)*100):.1f}%' if dictionary_verbs else '   - Coverage: N/A')
    print(f'\n📋 Next steps:')
    print(f'   1. Review verb-dictionary-import.json')
    print(f'   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/import-verb-stems-from-dictionary.sql')
    print(f'   3. This will add base_verb, imperfective_stem, perfective_stem, perfective_root, past_participle columns')
    print(f'   4. Then we can match conjugations to base verbs\n')

if __name__ == '__main__':
    main()


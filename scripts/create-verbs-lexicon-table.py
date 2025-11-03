#!/usr/bin/env python3
"""
Create verbs_lexicon table in D1 (similar to LingDocs approach)

This creates a lightweight verbs_lexicon table with only essential verb data:
- pashto_word (verb root)
- imperfective_stem (psp)
- perfective_stem (ssp)
- perfective_root (prp)
- past_participle (pp)
- pos (part of speech)
- romanization
- english

This is much faster than loading the full dictionary JSON.
"""

import json
import subprocess
from pathlib import Path

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
    """Load dictionary JSON"""
    dict_paths = [
        'docs/lexicon/full_dictionary_enriched.json',
        'full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        path = Path(dict_path)
        if path.exists():
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'entries' in data:
                        return data['entries']
                    elif isinstance(data, list):
                        return data
            except Exception as e:
                print(f"   ⚠️  Error loading {dict_path}: {e}")
                continue
    
    return []

def infer_missing_stems(verb_root, psp, ssp, prp, pp):
    """Infer missing stems/roots"""
    if psp and not ssp:
        if not psp.startswith('و'):
            ssp = 'و' + psp
    
    if verb_root and not prp:
        if not verb_root.startswith('و'):
            prp = 'و' + verb_root
        else:
            prp = verb_root
    
    if verb_root and not pp:
        if verb_root.endswith('ل'):
            base = verb_root[:-1]
            if base:
                if verb_root.endswith('ېدل'):
                    pp = base + 'لی'
                elif verb_root.endswith('کېدل'):
                    pp = 'شوی'
                elif verb_root.endswith('کول'):
                    comp = verb_root[:-3]
                    pp = comp + ' کړی'
                elif verb_root.endswith('ول') and ' ' not in verb_root:
                    comp = verb_root[:-2]
                    pp = comp + ' کړی'
                else:
                    pp = base + 'لی'
    
    return psp, ssp, prp, pp

def main():
    print('🔍 Creating verbs_lexicon table in D1\n')
    
    # Load dictionary
    print('📚 Loading dictionary...')
    dictionary_entries = load_dictionary()
    if not dictionary_entries:
        print('   ❌ Could not load dictionary')
        return
    
    print(f'   ✅ Loaded {len(dictionary_entries)} entries')
    
    # Extract verbs
    print(f'\n📝 Extracting verbs...')
    verbs = {}
    
    for entry in dictionary_entries:
        if not isinstance(entry, dict):
            continue
        
        pashto = entry.get('pashto', '') or entry.get('p', '')
        pos = entry.get('pos', '') or entry.get('c', '') or ''
        
        if not pashto:
            continue
        
        is_verb = ('verb' in pos.lower() or 'v.' in pos.lower())
        if not is_verb:
            continue
        
        # Extract stems/roots
        psp = entry.get('psp') or ''
        ssp = entry.get('ssp') or ''
        prp = entry.get('prp') or ''
        pp = entry.get('pp') or entry.get('past_participle') or ''
        
        # Infer missing
        psp, ssp, prp, pp = infer_missing_stems(pashto, psp, ssp, prp, pp)
        
        verbs[pashto] = {
            'pashto': pashto,
            'pos': pos,
            'psp': psp,
            'ssp': ssp,
            'prp': prp,
            'pp': pp,
            'romanization': entry.get('romanization') or entry.get('f', ''),
            'english': entry.get('english', '') or entry.get('e', ''),
        }
    
    print(f'   ✅ Found {len(verbs)} verbs')
    
    # Create table
    print(f'\n📊 Creating verbs_lexicon table...')
    
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS verbs_lexicon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pashto_word TEXT NOT NULL UNIQUE,
        imperfective_stem TEXT,
        perfective_stem TEXT,
        perfective_root TEXT,
        past_participle TEXT,
        pos TEXT,
        romanization TEXT,
        english TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_pashto ON verbs_lexicon (pashto_word);
    CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_imperfective_stem ON verbs_lexicon (imperfective_stem);
    CREATE INDEX IF NOT EXISTS idx_verbs_lexicon_perfective_stem ON verbs_lexicon (perfective_stem);
    """
    
    result = query_d1(create_table_sql)
    print('   ✅ Table created')
    
    # Generate INSERT statements
    print(f'\n📝 Generating INSERT statements...')
    
    sql_updates = []
    sql_updates.append('-- Insert verbs into verbs_lexicon')
    sql_updates.append('BEGIN TRANSACTION;')
    
    for verb_root, verb_data in verbs.items():
        clean_verb = verb_root.replace("'", "''")
        psp = (verb_data['psp'] or '').replace("'", "''")
        ssp = (verb_data['ssp'] or '').replace("'", "''")
        prp = (verb_data['prp'] or '').replace("'", "''")
        pp = (verb_data['pp'] or '').replace("'", "''")
        pos = (verb_data['pos'] or '').replace("'", "''")
        rom = (verb_data['romanization'] or '').replace("'", "''")
        eng = (verb_data['english'] or '').replace("'", "''")
        
        sql_updates.append(f"INSERT OR REPLACE INTO verbs_lexicon (pashto_word, imperfective_stem, perfective_stem, perfective_root, past_participle, pos, romanization, english)")
        sql_updates.append(f"VALUES ('{clean_verb}', '{psp}', '{ssp}', '{prp}', '{pp}', '{pos}', '{rom}', '{eng}');")
    
    sql_updates.append('COMMIT;')
    
    # Write SQL file
    sql_path = 'cloudflare/create-verbs-lexicon.sql'
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('-- Create verbs_lexicon table (LingDocs-style fast lookup)\n')
        f.write('-- This is a lightweight table with only essential verb data\n\n')
        f.write(create_table_sql)
        f.write('\n')
        f.write('\n'.join(sql_updates))
    
    print(f'   ✅ Generated {sql_path}')
    print(f'   ✅ {len(verbs)} verbs ready to insert')
    
    print(f'\n📋 Next steps:')
    print(f'   1. Review {sql_path}')
    print(f'   2. Run: wrangler d1 execute pashto-bible-db --remote --file {sql_path}')
    print(f'   3. Then query verbs_lexicon for fast verb lookups!')
    print(f'\n💡 This approach is similar to LingDocs\' dictionary_fast_index.json')
    print(f'   but stored in D1 for SQL queries and joins with word_frequencies\n')

if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Fix verbs_lexicon table:
1. Add missing irregular verbs to irregular_verbs.json
2. Populate missing imperfective/perfective stems from:
   - irregular_verbs.json
   - Dictionary entries (if available)
   - Inference rules (fallback)
3. Identify and report adverbs that shouldn't be in verbs_lexicon

Based on LingDocs grammar and irregular verb patterns
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional

APP_ROOT = Path(__file__).parent.parent
IRREGULAR_VERBS_PATH = APP_ROOT / 'irregular_verbs.json'
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'fix-verbs-lexicon-stems.sql'

# Core irregular verbs (from IRREGULAR_VERBS.md and LingDocs)
IRREGULAR_VERBS_DATA = {
    'کول': {
        'stems': {'imperfective': 'کو', 'perfective': 'وکړ'},
        'roots': {'imperfective': 'کول', 'perfective': 'وکړ'},
        'past_participle': 'کړی',
        'romanization': {
            'imperfective_stem': 'ko',
            'perfective_stem': 'óokṛ',
            'imperfective_root': 'kawúl',
            'perfective_root': 'óokṛ',
            'past_participle': 'kṛúy'
        }
    },
    'راتلل': {
        'stems': {'imperfective': 'راځ', 'perfective': 'راش'},
        'roots': {'imperfective': 'راتلل', 'perfective': 'راغلل'},
        'past_participle': 'راغلی'
    },
    'بوتلل': {
        'stems': {'imperfective': 'بیای', 'perfective': 'بوځ'},
        'roots': {'imperfective': 'بوتلل', 'perfective': 'بوتلل'},
        'past_participle': 'بوتللی'
    },
    'ورتلل': {
        'stems': {'imperfective': 'ورځ', 'perfective': 'ورش'},
        'roots': {'imperfective': 'ورتلل', 'perfective': 'ورغلل'},
        'past_participle': 'ورغلی'
    },
    'وتل': {
        'stems': {'imperfective': 'وځ', 'perfective': 'وش'},
        'roots': {'imperfective': 'وتل', 'perfective': 'وتل'},
        'past_participle': 'وتلی'
    },
    'نیول': {
        'stems': {'imperfective': 'نیس', 'perfective': 'ونی'},
        'roots': {'imperfective': 'نیول', 'perfective': 'ونیول'},
        'past_participle': 'نیولی'
    },
    'راکول': {
        'stems': {'imperfective': 'راکو', 'perfective': 'راکړ'},
        'roots': {'imperfective': 'راکول', 'perfective': 'وراکول'},
        'past_participle': 'راکړی'
    },
    'ورکول': {
        'stems': {'imperfective': 'ورکو', 'perfective': 'ورکړ'},
        'roots': {'imperfective': 'ورکول', 'perfective': 'ورکول'},
        'past_participle': 'ورکړی'
    },
    'کېدل': {
        'stems': {'imperfective': 'کېږ', 'perfective': 'وش'},
        'roots': {'imperfective': 'کېدل', 'perfective': 'وشول'},
        'past_participle': 'شوی'
    },
    'لیدل': {
        'stems': {'imperfective': 'وین', 'perfective': 'ووین'},
        'roots': {'imperfective': 'لیدل', 'perfective': 'ولیدل'},
        'past_participle': 'لیدلی'
    },
    'بوتلل': {
        'stems': {'imperfective': 'بیای', 'perfective': 'بوځ'},
        'roots': {'imperfective': 'بوتلل', 'perfective': 'بوتلل'},
        'past_participle': 'بوتللی'
    },
    'تلل': {
        'stems': {'imperfective': 'ځ', 'perfective': 'لاړ ش'},
        'roots': {'imperfective': 'تلل', 'perfective': 'لاړل'},
        'past_participle': 'تللی'
    },
    'ویل': {
        'stems': {'imperfective': 'وای', 'perfective': 'ووای'},
        'roots': {'imperfective': 'ویل', 'perfective': 'وویل'},
        'past_participle': 'ویلی'
    },
    'خوړل': {
        'stems': {'imperfective': 'خور', 'perfective': 'وخور'},
        'roots': {'imperfective': 'خوړل', 'perfective': 'وخوړل'},
        'past_participle': 'خوړلی'
    },
    'وړل': {
        'stems': {'imperfective': 'وړ', 'perfective': 'ووړ'},
        'roots': {'imperfective': 'وړل', 'perfective': 'ووړل'},
        'past_participle': 'وړلی'
    },
    'راوړل': {
        'stems': {'imperfective': 'راوړ', 'perfective': 'راووړ'},
        'roots': {'imperfective': 'راوړل', 'perfective': 'راووړل'},
        'past_participle': 'راوړلی'
    }
}

def query_d1(sql_query: str) -> List[Dict]:
    """Query D1 database"""
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', sql_query, '--json']
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
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

def load_dictionary() -> List[Dict]:
    """Load dictionary JSON"""
    dict_paths = [
        APP_ROOT / 'full_dictionary_enriched.json',
        APP_ROOT / 'docs' / 'lexicon' / 'full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        if dict_path.exists():
            try:
                with open(dict_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'entries' in data:
                        return data['entries']
                    elif isinstance(data, list):
                        return data
            except Exception as e:
                print(f"   ⚠️  Error loading {dict_path}: {e}")
                continue
    
    return []

def update_irregular_verbs_json():
    """Update irregular_verbs.json with all irregular verbs"""
    print("📝 Updating irregular_verbs.json...")
    
    # Load existing
    existing = {}
    if IRREGULAR_VERBS_PATH.exists():
        try:
            with open(IRREGULAR_VERBS_PATH, 'r', encoding='utf-8') as f:
                existing = json.load(f)
        except Exception:
            pass
    
    # Merge new data
    updated = {**existing}
    for verb, data in IRREGULAR_VERBS_DATA.items():
        if verb not in updated:
            updated[verb] = data
            print(f"   ✅ Added {verb}")
    
    # Save
    with open(IRREGULAR_VERBS_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated, f, ensure_ascii=False, indent=2)
    
    print(f"   ✅ Updated {len(updated)} irregular verbs")

def get_verb_stems_from_dictionary(verb_root: str, dictionary: List[Dict]) -> Optional[Dict]:
    """Extract stems from dictionary entry"""
    for entry in dictionary:
        pashto = entry.get('p', '')
        if pashto == verb_root:
            # Check for psp (present stem), ssp (subjunctive stem), prp (perfective root)
            psp = entry.get('psp') or entry.get('present_stem') or ''
            ssp = entry.get('ssp') or entry.get('subjunctive_stem') or ''
            
            if psp:
                return {
                    'imperfective_stem': psp,
                    'perfective_stem': ssp or '',  # May be empty
                }
    return None

def infer_stems_from_pattern(verb_root: str) -> Optional[Dict]:
    """Infer stems using pattern matching (fallback)"""
    if not verb_root or not verb_root.endswith('ل'):
        return None
    
    # Pattern: .*ندل
    if verb_root.endswith('ندل'):
        base = verb_root[:-3]
        return {
            'imperfective_stem': base + 'ن',
            'perfective_stem': 'و' + base + 'ن',
        }
    
    # Pattern: .*ېدل (intransitive)
    if verb_root.endswith('ېدل'):
        base = verb_root[:-3]
        return {
            'imperfective_stem': base + 'ېږ',
            'perfective_stem': 'و' + base + 'ېږ',
        }
    
    # Default: drop ل, add و prefix for perfective
    base = verb_root[:-1]
    return {
        'imperfective_stem': base,
        'perfective_stem': 'و' + base,
    }

def main():
    print("🔧 Fixing verbs_lexicon table...\n")
    
    # Step 1: Update irregular_verbs.json
    update_irregular_verbs_json()
    
    # Step 2: Load dictionary
    print("\n📚 Loading dictionary...")
    dictionary = load_dictionary()
    print(f"   ✅ Loaded {len(dictionary)} entries")
    
    # Step 3: Query verbs_lexicon for verbs missing stems
    print("\n🔍 Querying verbs_lexicon...")
    query = """
    SELECT id, verb_root, imperfective_stem, perfective_stem, pos, romanization
    FROM verbs_lexicon
    WHERE (imperfective_stem IS NULL OR imperfective_stem = '' OR perfective_stem IS NULL OR perfective_stem = '')
    AND pos NOT LIKE 'adv.%'
    ORDER BY verb_root
    LIMIT 1000
    """
    
    verbs_missing_stems = query_d1(query)
    print(f"   ✅ Found {len(verbs_missing_stems)} verbs missing stems")
    
    # Step 4: Query adverbs
    print("\n🔍 Querying adverbs in verbs_lexicon...")
    adv_query = """
    SELECT id, verb_root, pos
    FROM verbs_lexicon
    WHERE pos LIKE 'adv.%'
    ORDER BY verb_root
    LIMIT 100
    """
    adverbs = query_d1(adv_query)
    print(f"   ✅ Found {len(adverbs)} adverbs in verbs_lexicon")
    
    # Step 5: Generate SQL updates
    print("\n💾 Generating SQL updates...")
    sql_statements = []
    sql_statements.append('-- Fix verbs_lexicon: populate missing stems')
    sql_statements.append('-- Based on irregular_verbs.json and dictionary data')
    sql_statements.append('')
    
    # Process irregular verbs first
    irregular_updates = []
    for verb_root, data in IRREGULAR_VERBS_DATA.items():
        verbs = [v for v in verbs_missing_stems if v.get('verb_root') == verb_root]
        for verb in verbs:
            irregular_updates.append({
                'id': verb['id'],
                'verb_root': verb_root,
                'imperfective_stem': data['stems']['imperfective'],
                'perfective_stem': data['stems']['perfective'],
            })
    
    # Process other verbs
    regular_updates = []
    for verb in verbs_missing_stems[:500]:  # Limit to avoid timeout
        verb_root = verb.get('verb_root', '')
        if not verb_root or verb_root in IRREGULAR_VERBS_DATA:
            continue
        
        # Try dictionary first
        dict_stems = get_verb_stems_from_dictionary(verb_root, dictionary)
        if dict_stems:
            regular_updates.append({
                'id': verb['id'],
                'verb_root': verb_root,
                'imperfective_stem': dict_stems['imperfective_stem'],
                'perfective_stem': dict_stems['perfective_stem'],
            })
        else:
            # Fallback to inference
            inferred = infer_stems_from_pattern(verb_root)
            if inferred:
                regular_updates.append({
                    'id': verb['id'],
                    'verb_root': verb_root,
                    'imperfective_stem': inferred['imperfective_stem'],
                    'perfective_stem': inferred['perfective_stem'],
                })
    
    # Generate SQL for irregular verbs
    sql_statements.append('-- Irregular verbs (from irregular_verbs.json)')
    sql_statements.append('')
    for update in irregular_updates:
        verb_escaped = update['verb_root'].replace("'", "''")
        impf_escaped = update['imperfective_stem'].replace("'", "''")
        perf_escaped = update['perfective_stem'].replace("'", "''")
        
        sql_statements.append(f"-- {update['verb_root']}")
        sql_statements.append(f"""
UPDATE verbs_lexicon
SET imperfective_stem = '{impf_escaped}',
    perfective_stem = '{perf_escaped}'
WHERE id = {update['id']};
""")
        sql_statements.append('')
    
    # Generate SQL for regular verbs
    if regular_updates:
        sql_statements.append('-- Regular verbs (from dictionary/inference)')
        sql_statements.append('')
        for update in regular_updates[:200]:  # Limit SQL size
            verb_escaped = update['verb_root'].replace("'", "''")
            impf_escaped = update['imperfective_stem'].replace("'", "''")
            perf_escaped = update['perfective_stem'].replace("'", "''")
            
            sql_statements.append(f"-- {update['verb_root']}")
            sql_statements.append(f"""
UPDATE verbs_lexicon
SET imperfective_stem = '{impf_escaped}',
    perfective_stem = '{perf_escaped}'
WHERE id = {update['id']};
""")
            sql_statements.append('')
    
    # Report on adverbs
    if adverbs:
        sql_statements.append('-- NOTE: Adverbs found in verbs_lexicon (should be moved to separate table)')
        sql_statements.append('-- These entries should NOT be in verbs_lexicon:')
        sql_statements.append('')
        for adv in adverbs[:20]:  # Sample
            verb_escaped = adv['verb_root'].replace("'", "''")
            pos_escaped = adv['pos'].replace("'", "''")
            sql_statements.append(f"-- ID {adv['id']}: {adv['verb_root']} ({adv['pos']})")
        sql_statements.append('')
        sql_statements.append(f'-- Total: {len(adverbs)} adverbs found')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"\n📊 Summary:")
    print(f"   Irregular verbs updated: {len(irregular_updates)}")
    print(f"   Regular verbs updated: {len(regular_updates)}")
    print(f"   Adverbs found: {len(adverbs)}")
    print(f"\n✅ Generated {OUTPUT_SQL}")
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL}")

if __name__ == '__main__':
    main()


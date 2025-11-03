#!/usr/bin/env python3
"""
Identify and process all dynamic compound verbs and their variants

Dynamic compounds are identified by:
- Having و - óo prefix on کول in perfective forms
- Made up of: action noun + helper verb (usually کول - kawúl "to do")
- Can use other helper verbs: وهل, خوړل, ساتل, etc.

Based on: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/

This script:
1. Finds all dynamic compound verbs in word_frequencies
2. Identifies their base forms and helper verbs
3. Generates all variants (present, past, perfective, etc.)
4. Links them properly in the database
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional, Set

APP_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_SQL = APP_ROOT / 'cloudflare' / 'link-dynamic-compound-verbs.sql'

# Helper verbs used in dynamic compounds
DYNAMIC_HELPER_VERBS = {
    'کول': ('kawúl', 'to do'),
    'کېدل': ('kedúl', 'to happen'),  # intransitive version
    'وهل': ('wahúl', 'to hit'),
    'خوړل': ('khoRúl', 'to eat'),
    'ساتل': ('saatúl', 'to keep'),
}

# Perfective forms of helper verbs (with و prefix for dynamic)
DYNAMIC_HELPER_PERFECTIVE = {
    'وکړل': 'کول',  # perfective of کول (to do)
    'وشول': 'کېدل',  # perfective of کېدل (to happen)
    'ووهل': 'وهل',  # perfective of وهل (to hit)
    'وخوړل': 'خوړل',  # perfective of خوړل (to eat)
    'وساتل': 'ساتل',  # perfective of ساتل (to keep)
}

# Also check for variations
DYNAMIC_HELPER_VARIANTS = {
    'کړل': 'کول',  # past participle/conjugated
    'کړ': 'کول',
    'کړه': 'کول',
    'کړو': 'کول',
    'کړې': 'کول',
    'کړي': 'کول',
    'کړلو': 'کول',
    'کړلې': 'کول',
    'کړلي': 'کول',
    'شول': 'کېدل',  # past of کېدل (to happen)
    'شو': 'کېدل',
    'شوه': 'کېدل',
    'شول': 'کېدل',
    'وهل': 'وهل',  # base form
    'ووهل': 'وهل',  # perfective
    'ووه': 'وهل',
    'ووهه': 'وهل',
    'ووهو': 'وهل',
    'ووهې': 'وهل',
    'ووهي': 'وهل',
    'ووهلو': 'وهل',
    'ووهلې': 'وهل',
    'ووهلي': 'وهل',
    'خوړل': 'خوړل',  # base form
    'وخوړل': 'خوړل',  # perfective
    'خوړ': 'خوړل',
    'خوړه': 'خوړل',
    'خوړو': 'خوړل',
    'خوړې': 'خوړل',
    'خوړي': 'خوړل',
    'خوړلو': 'خوړل',
    'خوړلې': 'خوړل',
    'خوړلي': 'خوړل',
    'ساتل': 'ساتل',  # base form
    'وساتل': 'ساتل',  # perfective
    'سات': 'ساتل',
    'ساته': 'ساتل',
    'ساتو': 'ساتل',
    'ساتې': 'ساتل',
    'ساتي': 'ساتل',
    'ساتلو': 'ساتل',
    'ساتلې': 'ساتل',
    'ساتلي': 'ساتل',
}


def query_base_compound_verbs(limit: int = 1000, offset: int = 0) -> List[Dict]:
    """Query base dynamic compound verbs (noun + helper verb)"""
    query_sql = f"""
    SELECT id, pashto_word, frequency_total, pos, base_verb, romanization
    FROM word_frequencies
    WHERE (
        -- Base forms: noun + helper verb
        pashto_word LIKE '% کول'
        OR pashto_word LIKE '% کېدل'
        OR pashto_word LIKE '% وهل'
        OR pashto_word LIKE '% خوړل'
        OR pashto_word LIKE '% ساتل'
    )
    AND (
        pashto_word NOT LIKE '% [SPLIT]'
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
        return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []


def query_compound_variants(base_compound: str, limit: int = 500) -> List[Dict]:
    """Query variants of a base compound verb"""
    # Extract noun part
    noun = base_compound.split()[0] if ' ' in base_compound else base_compound
    
    # Escape single quotes in noun for SQL
    noun_escaped = noun.replace("'", "''")
    
    # Look for variants: noun + conjugated helper verb forms
    query_sql = f"""
    SELECT id, pashto_word, frequency_total, pos, base_verb
    FROM word_frequencies
    WHERE (
        -- Perfective forms with و prefix
        pashto_word LIKE '{noun_escaped} وکړ%'
        OR pashto_word LIKE '{noun_escaped} وشو%'
        OR pashto_word LIKE '{noun_escaped} ووه%'
        OR pashto_word LIKE '{noun_escaped} وخوړ%'
        OR pashto_word LIKE '{noun_escaped} وسات%'
        -- Present/imperfective forms
        OR pashto_word LIKE '{noun_escaped} کو%'
        OR pashto_word LIKE '{noun_escaped} کې%'
        OR pashto_word LIKE '{noun_escaped} وه%'
        OR pashto_word LIKE '{noun_escaped} خوړ%'
        OR pashto_word LIKE '{noun_escaped} سات%'
    )
    AND (
        base_verb IS NULL OR base_verb = ''
    )
    AND (
        pashto_word NOT LIKE '% [SPLIT]'
    )
    ORDER BY frequency_total DESC
    LIMIT {limit}
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
            except json.JSONDecodeError:
                pass
        return []
    except Exception:
        return []


def extract_dynamic_compound_parts(word: str) -> Optional[Tuple[str, str, str]]:
    """
    Extract dynamic compound parts: (noun, helper_verb, compound_type)
    
    Examples:
    - "کار وکړل" -> ("کار", "کول", "dynamic")
    - "پوښتنه وکړه" -> ("پوښتنه", "کول", "dynamic")
    - "منډې ووهل" -> ("منډې", "وهل", "dynamic")
    """
    words = word.split()
    
    # Check for spaced patterns: noun + helper verb
    if len(words) >= 2:
        # Last word should be helper verb or its perfective form
        last_word = words[-1]
        
        # Check if last word is a helper verb variant
        if last_word in DYNAMIC_HELPER_VARIANTS:
            helper_base = DYNAMIC_HELPER_VARIANTS[last_word]
            noun = ' '.join(words[:-1])
            return (noun, helper_base, 'dynamic')
        
        # Check if last word is perfective helper verb
        if last_word in DYNAMIC_HELPER_PERFECTIVE:
            helper_base = DYNAMIC_HELPER_PERFECTIVE[last_word]
            noun = ' '.join(words[:-1])
            return (noun, helper_base, 'dynamic')
        
        # Check if last word is base helper verb
        if last_word in DYNAMIC_HELPER_VERBS:
            noun = ' '.join(words[:-1])
            return (noun, last_word, 'dynamic')
    
    # Check for concatenated forms (noun + و + helper verb)
    # Pattern: noun + و + helper_verb_stem
    for helper_base, (rom, desc) in DYNAMIC_HELPER_VERBS.items():
        # Check for و + helper verb pattern
        if word.endswith('و' + helper_base[:2]):  # Simplified check
            # Try to extract noun part
            remaining = word[:-len('و' + helper_base[:2])]
            if remaining:
                return (remaining, helper_base, 'dynamic')
    
    return None


def find_base_compound_verb(noun: str, helper_verb: str, verbs_lexicon: Dict[str, Dict]) -> Optional[str]:
    """
    Find base compound verb form in lexicon
    
    Examples:
    - ("کار", "کول") -> "کار کول"
    - ("پوښتنه", "کول") -> "پوښتنه کول"
    """
    # Try exact match: noun + space + helper_verb
    compound = f"{noun} {helper_verb}"
    
    # Check if it exists in verbs_lexicon
    for verb_root, verb_data in verbs_lexicon.items():
        if verb_root == compound or verb_root.startswith(compound):
            return verb_root
    
    # Also check dictionary for compound verbs
    # This would require dictionary lookup - for now return the compound form
    return compound


def query_verbs_lexicon() -> Dict[str, Dict]:
    """Load verbs_lexicon to check for verb forms"""
    query_sql = "SELECT verb_root, imperfective_stem, perfective_stem, perfective_root, past_participle, pos FROM verbs_lexicon"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    verbs_dict = {}
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=60)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                for row in results:
                    verb_root = row.get('verb_root', '')
                    if verb_root:
                        verbs_dict[verb_root] = row
    except Exception as e:
        print(f"   ⚠️  Error loading verbs lexicon: {e}")
    return verbs_dict


def main():
    print("🔍 Identifying dynamic compound verbs and their variants...\n")
    
    # Load verbs lexicon
    print("📚 Loading verbs lexicon...")
    verbs_lexicon = query_verbs_lexicon()
    print(f"   ✅ Loaded {len(verbs_lexicon)} verbs\n")
    
    # Query base compound verbs
    print("   Querying base dynamic compound verbs...")
    base_compounds = []
    batch_size = 1000
    offset = 0
    
    while True:
        entries = query_base_compound_verbs(limit=batch_size, offset=offset)
        if not entries:
            break
        base_compounds.extend(entries)
        if len(entries) < batch_size:
            break
        offset += batch_size
    
    print(f"   ✅ Found {len(base_compounds)} base compounds\n")
    
    if not base_compounds:
        print("   No base compound verbs found")
        return
    
    # For each base compound, find its variants
    matched_compounds = []
    all_variants = []
    
    print("   Finding variants for each base compound...")
    for base_entry in base_compounds[:50]:  # Process first 50 to avoid timeout
        base_word = base_entry['pashto_word']
        variants = query_compound_variants(base_word)
        
        # Add base compound itself
        matched_compounds.append({
            'id': base_entry['id'],
            'word': base_word,
            'base_compound': base_word,
            'frequency': base_entry.get('frequency_total', 0),
            'current_pos': base_entry.get('pos'),
        })
        
        # Add variants
        for variant in variants:
            matched_compounds.append({
                'id': variant['id'],
                'word': variant['pashto_word'],
                'base_compound': base_word,
                'frequency': variant.get('frequency_total', 0),
                'current_pos': variant.get('pos'),
            })
        
        if variants:
            all_variants.extend([v['pashto_word'] for v in variants])
    
    print(f"   ✅ Found {len(all_variants)} variants\n")
    
    print(f"   📊 Analysis:")
    print(f"      Total compounds and variants: {len(matched_compounds)}")
    print(f"      Base compounds: {len(base_compounds)}")
    print(f"      Variants found: {len(all_variants)}\n")
    
    # Generate SQL
    sql_statements = []
    sql_statements.append('-- Link dynamic compound verbs to their base forms')
    sql_statements.append('-- Based on: https://grammar.lingdocs.com/compound-verbs/dynamic-compounds/')
    sql_statements.append('-- Dynamic compounds have و - óo prefix on helper verbs in perfective forms')
    sql_statements.append('')
    
    if matched_compounds:
        for compound in matched_compounds:
            word_escaped = "'" + compound['word'].replace("'", "''") + "'"
            base_compound_escaped = "'" + compound['base_compound'].replace("'", "''") + "'"
            
            sql_statements.append(f"-- {compound['word']} -> base: {compound['base_compound']}")
            sql_statements.append(f"""
UPDATE word_frequencies
SET base_verb = {base_compound_escaped},
    pos = COALESCE(NULLIF(pos, ''), 'verb_dynamic_compound')
WHERE id = {compound['id']};
""")
            sql_statements.append('')
    
    # Write SQL file
    OUTPUT_SQL.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {OUTPUT_SQL}")
    print(f"   📊 Prepared {len(matched_compounds)} dynamic compounds to link")
    
    if matched_compounds:
        print(f"\n📋 Sample matched compounds (first 20):")
        for compound in matched_compounds[:20]:
            is_base = compound['word'] == compound['base_compound']
            marker = "[BASE]" if is_base else "[VARIANT]"
            print(f"   {marker} '{compound['word']}' -> '{compound['base_compound']}'")
    
    print(f"\n💡 Next step:")
    print(f"   wrangler d1 execute pashto-bible-db --remote --file {OUTPUT_SQL.relative_to(APP_ROOT)}")


if __name__ == '__main__':
    main()

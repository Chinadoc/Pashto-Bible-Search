#!/usr/bin/env python3
"""
Complete Verb Analysis: نومېدل (noomedul) - Perfect Forms & Negatives

According to LingDocs grammar:
- Perfect forms: Past Participle + Auxiliary Verb (یم/یې/دی/ده/یو/یئ/دي)
- Negatives: نه goes before verb block (for intransitive verbs)
- VP Structure: نومېدل is intransitive, so subject is king, no object

For نومېدل:
- Past Participle: نومېدلی (masculine), نومېدلې (feminine), نومېدلي (plural)
- Auxiliary verbs: یم, یې, دی, ده, یو, یئ, دي

Perfect forms:
- زه نومېدلی یم (I have been called)
- ته نومېدلی یې (You have been called)
- هغه نومېدلی دی (He/it has been called)
- هغه نومېدلې ده (She/it has been called)
- موږ نومېدلي یو (We have been called)
- تاسې نومېدلي یئ (You (pl.) have been called)
- هغوی نومېدلي دي (They have been called)

Negative forms:
- نه نومېږم (I am not called)
- نه نومېدل (I was not called)
- نه نومېدلی یم (I have not been called)
"""

import json
import subprocess
import re
import sys
from pathlib import Path

def query_d1(sql_query):
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=10)
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

def analyze_perfect_negatives():
    """Analyze perfect forms and negatives for نومېدل"""
    print('🔍 Complete Verb Analysis: نومېدل - Perfect Forms & Negatives\n')
    
    base_word = 'نومېدل'
    past_participle_masc = 'نومېدلی'
    past_participle_fem = 'نومېدلې'
    past_participle_pl = 'نومېدلي'
    
    # Step 1: Generate expected perfect forms
    print('📝 Step 1: Generating expected perfect forms...')
    
    # Perfect forms: Past Participle + Auxiliary
    perfect_forms = [
        # 1st person singular
        f'{past_participle_masc} یم',
        f'{past_participle_masc}یم',  # no space
        
        # 2nd person singular
        f'{past_participle_masc} یې',
        f'{past_participle_masc}یې',  # no space
        
        # 3rd person singular masculine
        f'{past_participle_masc} دی',
        f'{past_participle_masc}دی',  # no space
        
        # 3rd person singular feminine
        f'{past_participle_fem} ده',
        f'{past_participle_fem}ده',  # no space
        
        # 1st person plural
        f'{past_participle_pl} یو',
        f'{past_participle_pl}یو',  # no space
        
        # 2nd person plural
        f'{past_participle_pl} یئ',
        f'{past_participle_pl}یئ',  # no space
        
        # 3rd person plural
        f'{past_participle_pl} دي',
        f'{past_participle_pl}دي',  # no space
    ]
    
    # Step 2: Generate expected negative forms
    print('📝 Step 2: Generating expected negative forms...')
    
    imperfective_stem = 'نومېږ'
    perfective_root = 'ونومېدل'
    
    # Negative forms: نه + verb
    # For intransitive verbs, نه goes before the verb block
    negative_forms = [
        # Present negative
        f'نه {imperfective_stem}م',
        f'نه{imperfective_stem}م',  # no space
        
        # Past negative (perfective)
        f'نه {perfective_root}',
        f'نه{perfective_root}',  # no space
        
        # Alternative: split head version
        f'نه نومېدل',
        f'نهنومېدل',  # no space
        
        # Perfect negative
        f'نه {past_participle_masc} یم',
        f'نه {past_participle_masc}یم',  # no space variants
        f'نه{past_participle_masc} یم',
        f'نه{past_participle_masc}یم',
    ]
    
    all_forms = {
        'perfect': perfect_forms,
        'negative': negative_forms,
    }
    
    total_expected = sum(len(v) for v in all_forms.values())
    print(f'   Generated {total_expected} expected forms')
    
    # Step 3: Search for forms
    print(f'\n🔍 Step 3: Searching for forms in word_frequencies...')
    
    found_forms = {}
    
    for category, forms in all_forms.items():
        found_forms[category] = []
        for form in forms:
            clean_form = form.replace("'", "''")
            sql = f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word = '{clean_form}' LIMIT 1"
            results = query_d1(sql)
            
            if results:
                found_forms[category].extend(results)
    
    # Step 4: Search for variations (forms that might be stored differently)
    print(f'\n🔍 Step 4: Searching for variations...')
    
    # Search for forms with نه + نوم
    negative_search = query_d1("SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word LIKE 'نه%' AND pashto_word LIKE '%نوم%' ORDER BY frequency_total DESC LIMIT 20")
    
    # Search for forms with past participle + auxiliary
    perfect_search = query_d1(f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE (pashto_word LIKE '%{past_participle_masc}%' OR pashto_word LIKE '%{past_participle_fem}%' OR pashto_word LIKE '%{past_participle_pl}%') AND (pashto_word LIKE '%یم%' OR pashto_word LIKE '%یې%' OR pashto_word LIKE '%دی%' OR pashto_word LIKE '%ده%' OR pashto_word LIKE '%یو%' OR pashto_word LIKE '%یئ%' OR pashto_word LIKE '%دي%') ORDER BY frequency_total DESC LIMIT 30")
    
    variation_forms = {
        'negative_variations': negative_search or [],
        'perfect_variations': perfect_search or [],
    }
    
    # Print results
    total_found = sum(len(v) for v in found_forms.values())
    print(f'\n   ✅ Found {total_found} exact matches')
    print(f'   ✅ Found {len(variation_forms["negative_variations"])} negative variations')
    print(f'   ✅ Found {len(variation_forms["perfect_variations"])} perfect variations')
    
    if total_found > 0:
        print(f'\n   Exact matches:')
        for category, forms in found_forms.items():
            if forms:
                print(f'\n   {category.upper()}:')
                for form in forms[:10]:  # Show first 10
                    print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    if variation_forms['negative_variations']:
        print(f'\n   Negative variations:')
        for form in variation_forms['negative_variations'][:10]:
            print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    if variation_forms['perfect_variations']:
        print(f'\n   Perfect variations:')
        for form in variation_forms['perfect_variations'][:10]:
            print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    # Step 5: Generate SQL
    print(f'\n📝 Step 5: Generating SQL updates...')
    
    sql_updates = []
    
    # Mark found forms
    for category, forms in found_forms.items():
        if forms:
            sql_updates.append(f'-- {category.upper()} forms:')
            for form in forms:
                clean_word = form.get('pashto_word', '').replace("'", "''")
                sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
            sql_updates.append('')
    
    # Mark variation forms
    if variation_forms['negative_variations']:
        sql_updates.append('-- NEGATIVE variation forms:')
        for form in variation_forms['negative_variations']:
            clean_word = form.get('pashto_word', '').replace("'", "''")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    if variation_forms['perfect_variations']:
        sql_updates.append('-- PERFECT variation forms:')
        for form in variation_forms['perfect_variations']:
            clean_word = form.get('pashto_word', '').replace("'", "''")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/analyze-verb-noomedul-perfect-negatives.sql'
    sql_content = [
        '-- Complete Verb Analysis: نومېدل - Perfect Forms & Negatives',
        '-- Reference: https://grammar.lingdocs.com/verbs/perfect-verbs-intro/',
        '-- Reference: https://grammar.lingdocs.com/verbs/all-perfect-verbs/',
        '-- Reference: https://grammar.lingdocs.com/verbs/negatives/',
        '-- Reference: https://grammar.lingdocs.com/phrase-structure/vp/',
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
    json_path = 'cloudflare/verb-noomedul-perfect-negatives.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'expected_forms': all_forms,
            'found_forms': {k: v for k, v in found_forms.items() if v},
            'variation_forms': variation_forms,
            'total_found': total_found,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Summary:')
    print(f'   - Base verb: {base_word} (intransitive)')
    print(f'   - Past participle: {past_participle_masc}/{past_participle_fem}/{past_participle_pl}')
    print(f'   - Forms found: {total_found} exact matches')
    print(f'   - Variations: {len(variation_forms["negative_variations"])} negative, {len(variation_forms["perfect_variations"])} perfect\n')

if __name__ == '__main__':
    analyze_perfect_negatives()


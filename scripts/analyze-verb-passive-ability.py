#!/usr/bin/env python3
"""
Verb Analysis: نومېدل (noomedul) - Passive Voice & Ability Forms

According to LingDocs grammar:
- Passive Voice: Past participle + auxiliary verb (different from perfect)
- Ability: Past participle + شو/شوې (can/could)

For نومېدل:
- Past Participle: نومېدلی (masculine), نومېدلې (feminine), نومېدلي (plural)
- Ability auxiliary: شو (present), شوم (past), etc.

Passive voice forms:
- نومېدلی کېږي (is called)
- نومېدلی کېدل (was called)

Ability forms:
- نومېدلی شم (I can be called)
- نومېدلی شوم (I could be called)
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

def analyze_passive_ability():
    """Analyze passive voice and ability forms for نومېدل"""
    print('🔍 Verb Analysis: نومېدل - Passive Voice & Ability Forms\n')
    
    base_word = 'نومېدل'
    past_participle_masc = 'نومېدلی'
    past_participle_fem = 'نومېدلې'
    past_participle_pl = 'نومېدلي'
    
    # Step 1: Generate expected passive voice forms
    print('📝 Step 1: Generating expected passive voice forms...')
    
    # Passive voice: Past Participle + کېدل (to become)
    # Present passive: Past participle + کېږي (imperfective)
    # Past passive: Past participle + کېدل (imperfective root)
    
    passive_forms = [
        # Present passive (imperfective)
        f'{past_participle_masc} کېږي',   # is called (m.)
        f'{past_participle_fem} کېږي',    # is called (f.)
        f'{past_participle_pl} کېږي',    # are called
        
        # Past passive (imperfective)
        f'{past_participle_masc} کېدل',   # was called (m.)
        f'{past_participle_fem} کېدل',    # was called (f.)
        f'{past_participle_pl} کېدل',     # were called
        
        # Variations without spaces
        f'{past_participle_masc}کېږي',
        f'{past_participle_fem}کېږي',
        f'{past_participle_pl}کېږي',
        f'{past_participle_masc}کېدل',
        f'{past_participle_fem}کېدل',
        f'{past_participle_pl}کېدل',
    ]
    
    # Step 2: Generate expected ability forms
    print('📝 Step 2: Generating expected ability forms...')
    
    # Ability: Past Participle + شو/شوې
    # Present ability: Past participle + شو (present endings)
    # Past ability: Past participle + شوم (past endings)
    
    ability_forms = [
        # Present ability
        f'{past_participle_masc} شم',     # I can be called
        f'{past_participle_masc} شو',     # we can be called
        f'{past_participle_masc} شې',     # you can be called
        f'{past_participle_masc} شئ',     # you (pl.) can be called
        f'{past_participle_masc} شي',     # he/it can be called
        f'{past_participle_fem} شي',      # she/it can be called
        
        # Past ability
        f'{past_participle_masc} شوم',    # I could be called
        f'{past_participle_masc} شوو',    # we could be called
        f'{past_participle_masc} شوې',    # you could be called
        f'{past_participle_masc} شوئ',    # you (pl.) could be called
        f'{past_participle_masc} شو',     # he/it could be called
        f'{past_participle_fem} شوه',     # she/it could be called
        f'{past_participle_pl} شول',      # they could be called
        
        # Variations without spaces
        f'{past_participle_masc}شم',
        f'{past_participle_masc}شو',
        f'{past_participle_masc}شې',
        f'{past_participle_masc}شوم',
        f'{past_participle_masc}شوو',
        f'{past_participle_masc}شوې',
    ]
    
    all_forms = {
        'passive': passive_forms,
        'ability': ability_forms,
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
    
    # Step 4: Search for variations
    print(f'\n🔍 Step 4: Searching for variations...')
    
    # Search for forms with past participle + کېږي or کېدل
    passive_search = query_d1(f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE (pashto_word LIKE '%{past_participle_masc}%' OR pashto_word LIKE '%{past_participle_fem}%' OR pashto_word LIKE '%{past_participle_pl}%') AND (pashto_word LIKE '%کېږي%' OR pashto_word LIKE '%کېدل%') ORDER BY frequency_total DESC LIMIT 20")
    
    # Search for forms with past participle + شو
    ability_search = query_d1(f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE (pashto_word LIKE '%{past_participle_masc}%' OR pashto_word LIKE '%{past_participle_fem}%' OR pashto_word LIKE '%{past_participle_pl}%') AND (pashto_word LIKE '%ش%' AND (pashto_word LIKE '%شم%' OR pashto_word LIKE '%شو%' OR pashto_word LIKE '%شې%' OR pashto_word LIKE '%شی%' OR pashto_word LIKE '%شئ%')) ORDER BY frequency_total DESC LIMIT 20")
    
    variation_forms = {
        'passive_variations': passive_search or [],
        'ability_variations': ability_search or [],
    }
    
    # Print results
    total_found = sum(len(v) for v in found_forms.values())
    print(f'\n   ✅ Found {total_found} exact matches')
    print(f'   ✅ Found {len(variation_forms["passive_variations"])} passive variations')
    print(f'   ✅ Found {len(variation_forms["ability_variations"])} ability variations')
    
    if total_found > 0:
        print(f'\n   Exact matches:')
        for category, forms in found_forms.items():
            if forms:
                print(f'\n   {category.upper()}:')
                for form in forms[:10]:
                    print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    if variation_forms['passive_variations']:
        print(f'\n   Passive variations:')
        for form in variation_forms['passive_variations'][:10]:
            print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    if variation_forms['ability_variations']:
        print(f'\n   Ability variations:')
        for form in variation_forms['ability_variations'][:10]:
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
    if variation_forms['passive_variations']:
        sql_updates.append('-- PASSIVE variation forms:')
        for form in variation_forms['passive_variations']:
            clean_word = form.get('pashto_word', '').replace("'", "''")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    if variation_forms['ability_variations']:
        sql_updates.append('-- ABILITY variation forms:')
        for form in variation_forms['ability_variations']:
            clean_word = form.get('pashto_word', '').replace("'", "''")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/analyze-verb-noomedul-passive-ability.sql'
    sql_content = [
        '-- Verb Analysis: نومېدل - Passive Voice & Ability Forms',
        '-- Reference: https://grammar.lingdocs.com/verbs/passive-voice/',
        '-- Reference: https://grammar.lingdocs.com/verbs/ability/',
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
    json_path = 'cloudflare/verb-noomedul-passive-ability.json'
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
    print(f'   - Base verb: {base_word}')
    print(f'   - Past participle: {past_participle_masc}/{past_participle_fem}/{past_participle_pl}')
    print(f'   - Forms found: {total_found} exact matches')
    print(f'   - Variations: {len(variation_forms["passive_variations"])} passive, {len(variation_forms["ability_variations"])} ability\n')

if __name__ == '__main__':
    analyze_passive_ability()


#!/usr/bin/env python3
"""
Extended Verb Analysis: نومېدل (noomedul) - Future and Imperative Forms

According to LingDocs grammar:
- Imperfective Future: به + Present (imperfective stem + endings)
- Perfective Future: به + Subjunctive (perfective stem + endings)
- Imperfective Imperative: Imperfective Stem + imperative ending (ـه/ـئ)
- Perfective Imperative: Perfective Stem + imperative ending (ـه/ـئ)
- Negative Imperative: مه + Imperfective Imperative

For نومېدل:
- Imperfective stem: نومېږ-
- Perfective stem: ونومېږ-

Future forms:
- Imperfective: به نومېږم, به نومېږې, به نومېږي, به نومېږو, به نومېږئ
- Perfective: به ونومېږم, به ونومېږې, به ونومېږي, به ونومېږو, به ونومېږئ

Imperative forms:
- Imperfective: نومېږه (singular), نومېږئ (plural)
- Perfective: ونومېږه (singular), ونومېږئ (plural)
- Negative: مه نومېږه, مه نومېږئ
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

def analyze_future_imperative_forms():
    """Analyze future and imperative forms of نومېدل"""
    print('🔍 Extended Verb Analysis: نومېدل - Future & Imperative Forms\n')
    
    base_word = 'نومېدل'
    imperfective_stem = 'نومېږ'
    perfective_stem = 'ونومېږ'
    
    # Step 1: Generate expected forms
    print('📝 Step 1: Generating expected forms...')
    
    # Imperfective Future: به + Present
    imperfective_future_forms = [
        'به نومېږم',
        'به نومېږې',
        'به نومېږي',
        'به نومېږو',
        'به نومېږئ',
        'به نومېږه',  # Alternative form
    ]
    
    # Perfective Future: به + Subjunctive (perfective stem)
    perfective_future_forms = [
        'به ونومېږم',
        'به ونومېږې',
        'به ونومېږي',
        'به ونومېږو',
        'به ونومېږئ',
        'به ونومېږه',
    ]
    
    # Imperfective Imperative: Imperfective Stem + imperative ending
    imperfective_imperative_forms = [
        'نومېږه',    # singular
        'نومېږئ',    # plural
    ]
    
    # Perfective Imperative: Perfective Stem + imperative ending
    perfective_imperative_forms = [
        'ونومېږه',   # singular
        'ونومېږئ',   # plural
    ]
    
    # Negative Imperative: مه + Imperfective Imperative
    negative_imperative_forms = [
        'مه نومېږه',
        'مه نومېږئ',
    ]
    
    all_expected_forms = {
        'imperfective_future': imperfective_future_forms,
        'perfective_future': perfective_future_forms,
        'imperfective_imperative': imperfective_imperative_forms,
        'perfective_imperative': perfective_imperative_forms,
        'negative_imperative': negative_imperative_forms,
    }
    
    total_expected = sum(len(v) for v in all_expected_forms.values())
    print(f'   Generated {total_expected} expected forms')
    
    # Step 2: Search for forms (with and without spaces)
    print(f'\n🔍 Step 2: Searching for forms in word_frequencies...')
    
    found_forms = {}
    
    for category, forms in all_expected_forms.items():
        found_forms[category] = []
        for form in forms:
            # Try exact match
            clean_form = form.replace("'", "''")
            sql = f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word = '{clean_form}' LIMIT 1"
            results = query_d1(sql)
            
            if results:
                found_forms[category].extend(results)
            else:
                # Try without spaces (forms might be stored without spaces)
                form_no_space = form.replace(' ', '')
                clean_form_no_space = form_no_space.replace("'", "''")
                sql = f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word = '{clean_form_no_space}' LIMIT 1"
                results = query_d1(sql)
                if results:
                    found_forms[category].extend(results)
    
    # Step 3: Also search for variations (with different spacing, punctuation)
    print(f'\n🔍 Step 3: Searching for variations...')
    
    # Search for forms containing نومېږ or ونومېږ combined with به or مه
    search_patterns = [
        'نومېږ',  # imperfective stem
        'ونومېږ',  # perfective stem
        'به نوم',  # future marker + نوم
        'مه نوم',  # negative imperative marker + نوم
    ]
    
    variation_forms = []
    
    for pattern in search_patterns:
        clean_pattern = pattern.replace("'", "''")
        sql = f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word LIKE '%{clean_pattern}%' ORDER BY frequency_total DESC LIMIT 20"
        results = query_d1(sql)
        
        for result in results:
            word = result.get('pashto_word', '')
            # Filter for forms that look like verb conjugations
            if (
                ('نومېږ' in word or 'ونومېږ' in word) and
                (word.endswith(('م', 'ې', 'ي', 'و', 'ئ', 'ه')) or
                 'به' in word or 'مه' in word)
            ):
                # Check if already found
                if not any(f.get('pashto_word') == word for forms in found_forms.values() for f in forms):
                    variation_forms.append({
                        'word': word,
                        'frequency': result.get('frequency_total', 0),
                        'pos': result.get('pos', ''),
                    })
    
    # Print results
    total_found = sum(len(v) for v in found_forms.values())
    print(f'\n   ✅ Found {total_found} exact matches')
    print(f'   ✅ Found {len(variation_forms)} variation forms')
    
    if total_found > 0:
        print(f'\n   Exact matches:')
        for category, forms in found_forms.items():
            if forms:
                print(f'\n   {category.upper()}:')
                for form in forms:
                    print(f'      - {form.get("pashto_word")}: freq={form.get("frequency_total", 0)}')
    
    if variation_forms:
        print(f'\n   Variation forms:')
        for form in variation_forms[:20]:  # Show first 20
            print(f'      - {form["word"]}: freq={form["frequency"]}')
    
    # Step 4: Generate SQL
    print(f'\n📝 Step 4: Generating SQL updates...')
    
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
    if variation_forms:
        sql_updates.append('-- VARIATION forms (future/imperative):')
        for form in variation_forms:
            clean_word = form['word'].replace("'", "''")
            sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
        sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/analyze-verb-noomedul-future-imperative.sql'
    sql_content = [
        '-- Extended Verb Analysis: نومېدل - Future & Imperative Forms',
        '-- Reference: https://grammar.lingdocs.com/verbs/future-verbs/',
        '-- Reference: https://grammar.lingdocs.com/verbs/imperative-verbs/',
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
    json_path = 'cloudflare/verb-noomedul-future-imperative.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'expected_forms': all_expected_forms,
            'found_forms': {k: v for k, v in found_forms.items() if v},
            'variation_forms': variation_forms,
            'total_found': total_found,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Summary:')
    print(f'   - Base verb: {base_word}')
    print(f'   - Imperfective stem: {imperfective_stem}')
    print(f'   - Perfective stem: {perfective_stem}')
    print(f'   - Forms found: {total_found} exact matches, {len(variation_forms)} variations\n')

if __name__ == '__main__':
    analyze_future_imperative_forms()


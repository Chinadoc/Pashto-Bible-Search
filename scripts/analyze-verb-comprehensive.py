#!/usr/bin/env python3
"""
Comprehensive verb analysis: نومېدل (noomedul)

Based on LingDocs grammar:
- Present/Subjunctive: Imperfective stem + endings
- Past: Perfective root (with و prefix or split head)
- Perfect: Past participle + auxiliary verb
- Ability: Past participle + شو/شوې
- Imperative: Imperfective stem + imperative endings

This script:
1. Finds the base verb form
2. Searches for all related conjugations in word_frequencies
3. Links them to the base verb
4. Creates a comprehensive verb entry
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

def analyze_verb_comprehensive():
    """Comprehensive analysis of نومېدل verb"""
    print('🔍 Comprehensive Verb Analysis: نومېدل (noomedul)\n')
    
    base_word = 'نومېدل'
    
    # Step 1: Find base form
    print('📊 Step 1: Finding base form...')
    clean_base = base_word.replace("'", "''")
    sql = f"SELECT pashto_word, frequency_total, pos, romanization, word_type FROM word_frequencies WHERE pashto_word = '{clean_base}' LIMIT 1"
    base_forms = query_d1(sql)
    
    if base_forms:
        base_form = base_forms[0]
        print(f'   ✅ Found: {base_form.get("pashto_word")}')
        print(f'      Frequency: {base_form.get("frequency_total", 0)}')
        print(f'      POS: {base_form.get("pos", "N/A")}')
    else:
        print(f'   ⚠️  Base form not found')
        return
    
    # Step 2: Search for all words containing نوم
    print(f'\n🔍 Step 2: Searching for related forms...')
    clean_search = 'نوم'.replace("'", "''")
    sql = f"SELECT pashto_word, frequency_total, pos FROM word_frequencies WHERE pashto_word LIKE '%{clean_search}%' ORDER BY frequency_total DESC LIMIT 50"
    all_forms = query_d1(sql)
    
    print(f'   Found {len(all_forms)} potential related forms')
    
    # Filter forms that are likely conjugations of نومېدل
    related_forms = []
    base_stem = 'نومېږ'  # imperfective stem
    base_perfective = 'ونوم'  # perfective prefix
    
    for form in all_forms:
        word = form.get('pashto_word', '')
        # Check if it's related to نومېدل
        if (
            word.startswith('نومې') or  # imperfective forms
            word.startswith('ونوم') or  # perfective forms
            word.startswith('نومېد') or  # past participle forms
            word == 'نومېدل' or  # base form
            ('نوم' in word and 'ې' in word)  # other نوم forms
        ):
            related_forms.append({
                'word': word,
                'frequency': form.get('frequency_total', 0),
                'pos': form.get('pos', ''),
            })
    
    print(f'\n   ✅ Identified {len(related_forms)} related forms:')
    for form in related_forms[:20]:  # Show first 20
        print(f'      - {form["word"]}: freq={form["frequency"]}, pos={form.get("pos", "N/A")}')
    
    # Step 3: Categorize forms
    print(f'\n📝 Step 3: Categorizing forms...')
    
    categories = {
        'base': [],
        'present': [],
        'subjunctive': [],
        'past': [],
        'past_participle': [],
        'perfect': [],
        'negative': [],
        'ability': [],
        'other': [],
    }
    
    for form in related_forms:
        word = form['word']
        
        if word == 'نومېدل':
            categories['base'].append(form)
        elif word.startswith('نومېږ'):
            if word.endswith(('م', 'ې', 'ي', 'و', 'ئ')):
                categories['present'].append(form)
            elif word.endswith('ه'):
                categories['imperative'].append(form)
            else:
                categories['other'].append(form)
        elif word.startswith('ونوم'):
            categories['past'].append(form)
        elif word.startswith('نومېدل'):
            if word.endswith(('ی', 'ې', 'ي')):
                categories['past_participle'].append(form)
            else:
                categories['other'].append(form)
        elif 'نه' in word and 'نوم' in word:
            categories['negative'].append(form)
        elif 'ش' in word and 'نوم' in word:
            categories['ability'].append(form)
        elif 'یم' in word or 'دی' in word or 'ده' in word:
            categories['perfect'].append(form)
        else:
            categories['other'].append(form)
    
    # Print categorization
    for cat, forms in categories.items():
        if forms:
            print(f'\n   {cat.upper()}:')
            for form in forms:
                print(f'      - {form["word"]}: freq={form["frequency"]}')
    
    # Step 4: Generate SQL
    print(f'\n📝 Step 4: Generating SQL updates...')
    
    sql_updates = []
    
    # Update base form
    clean_base = base_word.replace("'", "''")
    sql_updates.append(f'-- Base verb: {base_word}')
    sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb', pos = 'v. intrans.', has_issues = 0 WHERE pashto_word = '{clean_base}';")
    sql_updates.append('')
    
    # Mark conjugations
    for cat, forms in categories.items():
        if forms and cat != 'base':
            sql_updates.append(f'-- {cat.upper()} forms:')
            for form in forms:
                clean_word = form['word'].replace("'", "''")
                sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_word}';")
            sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/analyze-verb-noomedul-comprehensive.sql'
    sql_content = [
        '-- Comprehensive Verb Analysis: نومېدل (noomedul)',
        '-- Verb type: Intransitive',
        '-- Reference: https://grammar.lingdocs.com/verbs/',
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
    json_path = 'cloudflare/verb-noomedul-comprehensive.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'base_form': base_form,
            'all_forms': all_forms,
            'related_forms': related_forms,
            'categorized_forms': categories,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')

if __name__ == '__main__':
    analyze_verb_comprehensive()


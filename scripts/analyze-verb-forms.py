#!/usr/bin/env python3
"""
Analyze Pashto verb forms: stems, roots, and related conjugations

For a verb like نومېدل (noomedul, to be called):
- Imperfective Stem: نومېږ- (nooméG-)
- Imperfective Root: نومېدل (noomedúl) - long form
- Perfective Stem: ونومېږ- (óonoomeG-) - with و prefix
- Perfective Root: ونومېدل (óonoomedul) - long form
- Past Participle: نومېدلی (noomedúlay)

According to LingDocs grammar:
- Present/Subjunctive: uses imperfective stem
- Past: uses perfective root
- Perfect: uses past participle
- Split heads: in perfective aspect, prefix و can split out
- Long/Short: roots have long and short forms

Strategy:
1. Find base verb form in word_frequencies
2. Query verbs_lexicon/irregular_verbs for stems and roots
3. Generate all possible conjugations based on grammar rules
4. Search for these forms in word_frequencies
5. Update database with verb information
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

def query_word_frequencies(word, exact=False):
    """Query word_frequencies for a word"""
    clean_word = word.replace("'", "''")
    if exact:
        sql = f"SELECT pashto_word, frequency_total, pos, romanization, word_type FROM word_frequencies WHERE pashto_word = '{clean_word}' LIMIT 1"
    else:
        sql = f"SELECT pashto_word, frequency_total, pos, romanization, word_type FROM word_frequencies WHERE pashto_word LIKE '%{clean_word}%' LIMIT 20"
    
    return query_d1(sql)

def query_verb_lexicon(verb_root):
    """Query verbs_lexicon or irregular_verbs for verb data"""
    clean_root = verb_root.replace("'", "''")
    # Try irregular_verbs first
    sql = f"SELECT * FROM irregular_verbs WHERE verb_root = '{clean_root}' LIMIT 1"
    results = query_d1(sql)
    
    if results:
        return {'table': 'irregular_verbs', 'data': results[0]}
    
    # Try verbs_lexicon
    sql = f"SELECT * FROM verbs_lexicon WHERE verb_root = '{clean_root}' LIMIT 1"
    results = query_d1(sql)
    
    if results:
        return {'table': 'verbs_lexicon', 'data': results[0]}
    
    return None

def analyze_verb_noomedul():
    """Analyze نومېدل verb and find all related forms"""
    print('🔍 Analyzing verb: نومېدل (noomedul) - to be called (a name)\n')
    
    base_word = 'نومېدل'
    verb_root = 'نومېدل'  # Root is the same as base form for intransitive verbs
    
    # Step 1: Find base form in word_frequencies
    print(f'📊 Step 1: Finding base form in word_frequencies...')
    base_forms = query_word_frequencies(base_word, exact=True)
    
    if base_forms:
        base_form = base_forms[0]
        print(f'   ✅ Found: {base_form.get("pashto_word")}')
        print(f'      Frequency: {base_form.get("frequency_total", 0)}')
        print(f'      POS: {base_form.get("pos", "N/A")}')
        print(f'      Romanization: {base_form.get("romanization", "N/A")}')
    else:
        print(f'   ⚠️  Base form not found in word_frequencies')
        base_form = None
    
    # Step 2: Query verb lexicon for stems and roots
    print(f'\n📚 Step 2: Querying verb lexicon for stems and roots...')
    verb_data = query_verb_lexicon(verb_root)
    
    if verb_data:
        verb_entry = verb_data['data']
        stems = verb_entry.get('stems') or {}
        roots = verb_entry.get('roots') or {}
        
        # Parse JSON if needed
        if isinstance(stems, str):
            stems = json.loads(stems)
        if isinstance(roots, str):
            roots = json.loads(roots)
        
        print(f'   ✅ Found in {verb_data["table"]}')
        print(f'      Imperfective stem: {stems.get("imperfective", "N/A")}')
        print(f'      Perfective stem: {stems.get("perfective", "N/A")}')
        print(f'      Imperfective root: {roots.get("imperfective", "N/A")}')
        print(f'      Perfective root: {roots.get("perfective", "N/A")}')
        print(f'      Past participle: {verb_entry.get("past_participle", "N/A")}')
    else:
        print(f'   ⚠️  Verb not found in lexicon, using grammar rules to infer...')
        stems = {
            'imperfective': 'نومېږ',  # inferred from نومېدل
            'perfective': 'ونومېږ',   # with و prefix
        }
        roots = {
            'imperfective': 'نومېدل',
            'perfective': 'ونومېدل',
        }
        verb_entry = {'past_participle': 'نومېدلی'}
    
    # Step 3: Generate possible conjugations
    print(f'\n📝 Step 3: Generating possible conjugations...')
    
    imperfective_stem = stems.get('imperfective', 'نومېږ')
    perfective_stem = stems.get('perfective', 'ونومېږ')
    imperfective_root = roots.get('imperfective', 'نومېدل')
    perfective_root = roots.get('perfective', 'ونومېدل')
    past_participle = verb_entry.get('past_participle', 'نومېدلی')
    
    # Present tense forms (imperfective stem + endings)
    present_forms = [
        f'{imperfective_stem}م',   # I am called
        f'{imperfective_stem}ې',    # you (m.) are called
        f'{imperfective_stem}ي',    # he/it is called
        f'{imperfective_stem}و',    # we are called
        f'{imperfective_stem}ئ',    # you (pl.) are called
        f'{imperfective_stem}ي',    # they are called
    ]
    
    # Subjunctive forms (imperfective stem + endings)
    subjunctive_forms = [
        f'{imperfective_stem}م',   # that I be called
        f'{imperfective_stem}ې',    # that you be called
        f'{imperfective_stem}ي',    # that he/it be called
    ]
    
    # Past tense forms (perfective root, with و prefix)
    past_forms = [
        perfective_root,              # past root
        perfective_root.replace('و', ''),  # split head (without و)
    ]
    
    # Past participle forms
    past_participle_base = past_participle.replace('ی', '').replace('ې', '').replace('ي', '')
    past_participle_forms = [
        f'{past_participle_base}ی',   # masculine singular
        f'{past_participle_base}ې',   # feminine singular
        f'{past_participle_base}ي',   # masculine plural
        f'{past_participle_base}ې',   # feminine plural
    ]
    
    # Perfect forms (past participle + auxiliary)
    perfect_forms = []
    for pp in past_participle_forms:
        perfect_forms.extend([
            f'{pp} یم',    # I have been called
            f'{pp} یې',    # you have been called
            f'{pp} دی',    # he/it has been called
            f'{pp} ده',    # it has been called
            f'{pp} یو',    # we have been called
            f'{pp} یئ',    # you (pl.) have been called
            f'{pp} دي',    # they have been called
        ])
    
    # Negative forms
    negative_forms = [
        f'نه {imperfective_stem}م',   # I am not called
        f'نه {imperfective_stem}ي',    # he/it is not called
        f'نه {perfective_root}',       # negative perfective
    ]
    
    # Ability forms
    ability_forms = [
        f'{past_participle} شم',   # I can be called
        f'{past_participle} شي',    # he/it can be called
    ]
    
    # Imperative forms
    imperative_forms = [
        f'{imperfective_stem}ه',    # be called! (imperative)
    ]
    
    all_forms = {
        'present': present_forms,
        'subjunctive': subjunctive_forms,
        'past': past_forms,
        'past_participle': past_participle_forms,
        'perfect': perfect_forms,
        'negative': negative_forms,
        'ability': ability_forms,
        'imperative': imperative_forms,
    }
    
    total_forms = sum(len(v) for v in all_forms.values())
    print(f'   Generated {total_forms} possible forms')
    
    # Step 4: Search for forms in word_frequencies
    print(f'\n🔍 Step 4: Searching for forms in word_frequencies...')
    
    found_forms = {}
    
    for category, forms in all_forms.items():
        found_forms[category] = []
        for form in forms:
            # Clean form (remove spaces for search)
            clean_form = form.replace(' ', '').strip()
            results = query_word_frequencies(clean_form, exact=True)
            if results:
                for result in results:
                    found_forms[category].append({
                        'form': result.get('pashto_word'),
                        'frequency': result.get('frequency_total', 0),
                        'pos': result.get('pos', ''),
                        'romanization': result.get('romanization', ''),
                    })
    
    # Print results
    total_found = sum(len(v) for v in found_forms.values())
    print(f'\n   ✅ Found {total_found} related forms:')
    
    for category, forms in found_forms.items():
        if forms:
            print(f'\n   {category.upper()}:')
            for form in forms:
                print(f'      - {form["form"]}: freq={form["frequency"]}, pos={form.get("pos", "N/A")}')
    
    # Step 5: Generate SQL
    print(f'\n📝 Step 5: Generating SQL updates...')
    
    sql_updates = []
    
    if base_form:
        sql_updates.append(f'-- Base verb: {base_word}')
        sql_updates.append(f'-- Update with verb information')
        clean_base = base_word.replace("'", "''")
        sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb', pos = 'v. intrans.', has_issues = 0 WHERE pashto_word = '{clean_base}';")
        sql_updates.append('')
    
    # Mark related forms
    for category, forms in found_forms.items():
        if forms:
            sql_updates.append(f'-- {category.upper()} forms:')
            for form in forms:
                form_word = form['form']
                clean_form = form_word.replace("'", "''")
                sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', has_issues = 0 WHERE pashto_word = '{clean_form}';")
            sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/analyze-verb-noomedul.sql'
    sql_content = [
        '-- Analyze verb: نومېدل (noomedul) - to be called (a name)',
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
    json_path = 'cloudflare/verb-noomedul-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'base_form': base_form,
            'verb_lexicon_data': verb_data,
            'stems': stems,
            'roots': roots,
            'found_forms': found_forms,
            'total_forms_found': total_found,
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Analysis Summary:')
    print(f'   - Base form: {base_word}')
    print(f'   - Imperfective stem: {imperfective_stem}')
    print(f'   - Perfective stem: {perfective_stem}')
    print(f'   - Total related forms found: {total_found}\n')

if __name__ == '__main__':
    analyze_verb_noomedul()

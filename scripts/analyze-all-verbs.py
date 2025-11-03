#!/usr/bin/env python3
"""
Comprehensive Verb Analysis: Generate all verb forms for all verbs

Based on LingDocs Master Chart: https://grammar.lingdocs.com/verbs/master-chart/
And All Perfect Forms: https://grammar.lingdocs.com/verbs/all-perfect-verbs/

This script:
1. Loads verb data from dictionary JSON (stems/roots already there!)
2. Finds all verbs in word_frequencies
3. Generates all possible conjugations using dictionary stems/roots
4. Searches for forms in word_frequencies
5. Creates SQL to mark conjugations and link to base verbs

All 8 Perfect Forms:
- Present Perfect: Past Participle + Present Equative
- Habitual Perfect: Past Participle + Habitual Equative
- Subjunctive Perfect: Past Participle + Subjunctive Equative
- Future Perfect: Past Participle + Future Equative
- Past Perfect: Past Participle + Past Equative
- "Would be" Perfect: Past Participle + "Would be" Equative
- Past Subjunctive Perfect: Past Participle + Past Subjunctive Equative
- "Would have been" Perfect: Past Participle + "Would have been" Equative
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
        '../full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        path = Path(dict_path)
        if path.exists():
            try:
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
    
    print("   ⚠️  Dictionary not found")
    return []

def build_verb_index(dictionary_entries):
    """Build index of verbs with stems/roots from dictionary"""
    verb_index = {}
    
    for entry in dictionary_entries:
        if not isinstance(entry, dict):
            continue
        
        pashto = entry.get('pashto', '') or entry.get('p', '')
        pos = entry.get('pos', '') or entry.get('c', '') or ''
        
        # Check if it's a verb
        if not ('verb' in pos.lower() or 'v.' in pos.lower()):
            continue
        
        if not pashto:
            continue
        
        # Extract stems/roots from dictionary entry
        # Look for psp (present stem), ssp (subjunctive stem), prp (perfective root)
        psp = entry.get('psp') or entry.get('present_stem') or ''
        ssp = entry.get('ssp') or entry.get('subjunctive_stem') or ''
        prp = entry.get('prp') or entry.get('perfective_root') or ''
        
        # Get past participle
        past_part = entry.get('past_participle') or entry.get('pp') or ''
        
        # Infer if not provided
        if pashto.endswith('ل'):
            base = pashto[:-1]
            if not psp:
                psp = base
            if not ssp:
                ssp = 'و' + base if not base.startswith('و') else base
            if not prp:
                prp = 'و' + pashto if not pashto.startswith('و') else pashto
            if not past_part:
                past_part = base + 'لی'
        
        verb_index[pashto] = {
            'imperfective_stem': psp,
            'perfective_stem': ssp,
            'imperfective_root': pashto,
            'perfective_root': prp or ('و' + pashto if not pashto.startswith('و') else pashto),
            'past_participle': past_part,
            'pos': pos,
        }
    
    return verb_index

def generate_all_verb_forms(verb_root, stems_roots):
    """Generate all possible verb forms based on LingDocs master chart"""
    if not stems_roots:
        return []
    
    forms = []
    imp_stem = stems_roots['imperfective_stem']
    perf_stem = stems_roots['perfective_stem']
    imp_root = stems_roots['imperfective_root']
    perf_root = stems_roots['perfective_root']
    past_part = stems_roots['past_participle']
    
    # Present forms (imperfective stem + endings)
    present_endings = ['م', 'ې', 'ي', 'و', 'ئ']
    for ending in present_endings:
        forms.append(f'{imp_stem}{ending}')
    
    # Subjunctive forms (perfective stem + endings)
    for ending in present_endings:
        forms.append(f'{perf_stem}{ending}')
    
    # Past forms (perfective root)
    forms.append(perf_root)
    
    # All 8 Perfect Forms (Past Participle + Equative)
    # 1. Present Perfect: Past Participle + Present Equative
    present_equative = ['یم', 'یې', 'دی', 'ده', 'یو', 'یئ', 'دي']
    for eq in present_equative:
        forms.append(f'{past_part} {eq}')
        forms.append(f'{past_part}{eq}')  # no space
    
    # 2. Habitual Perfect: Past Participle + Habitual Equative
    habitual_equative = ['یم', 'یې', 'وي', 'یو', 'یئ', 'وي']
    for eq in habitual_equative:
        forms.append(f'{past_part} {eq}')
        forms.append(f'{past_part}{eq}')
    
    # 3. Subjunctive Perfect: Past Participle + Subjunctive Equative
    subjunctive_equative = ['وم', 'وې', 'وي', 'وو', 'وئ', 'وي']
    for eq in subjunctive_equative:
        forms.append(f'{past_part} {eq}')
        forms.append(f'{past_part}{eq}')
    
    # 4. Future Perfect: Past Participle + Future Equative (به + habitual)
    future_equative = ['یم', 'یې', 'وي', 'یو', 'یئ', 'وي']
    for eq in future_equative:
        forms.append(f'{past_part} به {eq}')
        forms.append(f'به {past_part} {eq}')
        forms.append(f'{past_part}به{eq}')
    
    # 5. Past Perfect: Past Participle + Past Equative
    past_equative = ['وم', 'وې', 'و', 'وه', 'وو', 'وئ', 'ول', 'وې']
    for eq in past_equative:
        forms.append(f'{past_part} {eq}')
        forms.append(f'{past_part}{eq}')
    
    # 6. "Would be" Perfect: Past Participle + "Would be" Equative (به + past)
    would_be_equative = ['وم', 'وې', 'و', 'وه', 'وو', 'وئ', 'ول', 'وې']
    for eq in would_be_equative:
        forms.append(f'{past_part} به {eq}')
        forms.append(f'به {past_part} {eq}')
        forms.append(f'{past_part}به{eq}')
    
    # 7. Past Subjunctive Perfect: Past Participle + Past Subjunctive Equative
    past_subjunctive_equative = ['وای']
    for eq in past_subjunctive_equative:
        forms.append(f'{past_part} {eq}')
        forms.append(f'{past_part}{eq}')
    
    # 8. "Would have been" Perfect: Past Participle + "Would have been" Equative (به + وای)
    would_have_been_equative = ['وای']
    for eq in would_have_been_equative:
        forms.append(f'{past_part} به {eq}')
        forms.append(f'به {past_part} {eq}')
        forms.append(f'{past_part}به{eq}')
    
    # Future forms (به + stem)
    for ending in present_endings:
        forms.append(f'به {imp_stem}{ending}')
        forms.append(f'به {perf_stem}{ending}')
    
    # Imperative forms
    forms.append(f'{imp_stem}ه')
    forms.append(f'{imp_stem}ئ')
    forms.append(f'{perf_stem}ه')
    forms.append(f'{perf_stem}ئ')
    
    # Ability forms
    ability_present = ['شم', 'شو', 'شې', 'شئ', 'شی']
    ability_past = ['شوم', 'شوو', 'شوې', 'شوئ', 'شو', 'شوه', 'شول']
    
    for ab in ability_present:
        forms.append(f'{past_part} {ab}')
        forms.append(f'{past_part}{ab}')
    
    for ab in ability_past:
        forms.append(f'{past_part} {ab}')
        forms.append(f'{past_part}{ab}')
    
    return forms

def main():
    print('🔍 Comprehensive Verb Analysis: All Verbs\n')
    print('Based on LingDocs Master Chart: https://grammar.lingdocs.com/verbs/master-chart/\n')
    
    # Step 1: Load dictionary
    print('📚 Step 1: Loading dictionary...')
    dictionary_entries = load_dictionary()
    verb_index = build_verb_index(dictionary_entries)
    print(f'   Found {len(verb_index)} verbs in dictionary')
    
    # Step 2: Find verbs in word_frequencies
    print(f'\n📊 Step 2: Finding verbs in word_frequencies...')
    sql = """
    SELECT pashto_word, frequency_total, pos 
    FROM word_frequencies 
    WHERE pashto_word IN (
        SELECT DISTINCT pashto_word 
        FROM word_frequencies 
        WHERE (
            (pos LIKE '%verb%' OR pos LIKE '%v.%') 
            AND pashto_word LIKE '%ل'
        )
        OR pashto_word LIKE '%ېدل'
        OR pashto_word LIKE '%کېدل'
        OR pashto_word LIKE '%کول'
        OR pashto_word LIKE '% وهل'
        OR pashto_word LIKE '%ول'
        ORDER BY frequency_total DESC
        LIMIT 500
    )
    ORDER BY frequency_total DESC
    """
    
    verbs = query_d1(sql)
    print(f'   Found {len(verbs)} verbs in word_frequencies')
    
    # Step 3: Match verbs with dictionary data
    print(f'\n🔗 Step 3: Matching verbs with dictionary data...')
    
    verb_analysis = []
    matched_count = 0
    
    for verb in verbs:
        verb_root = verb.get('pashto_word', '')
        frequency = verb.get('frequency_total', 0)
        pos = verb.get('pos', '')
        
        # Get stems/roots from dictionary
        stems_roots = verb_index.get(verb_root)
        
        if not stems_roots:
            # Try to infer basic pattern if not in dictionary
            if verb_root.endswith('ل') and len(verb_root) > 1:
                base = verb_root[:-1]
                stems_roots = {
                    'imperfective_stem': base,
                    'perfective_stem': 'و' + base if not base.startswith('و') else base,
                    'imperfective_root': verb_root,
                    'perfective_root': 'و' + verb_root if not verb_root.startswith('و') else verb_root,
                    'past_participle': base + 'لی',
                    'pos': pos,
                }
            else:
                continue
        
        matched_count += 1
        
        # Generate forms
        forms = generate_all_verb_forms(verb_root, stems_roots)
        
        verb_analysis.append({
            'verb_root': verb_root,
            'frequency': frequency,
            'pos': pos,
            'stems_roots': stems_roots,
            'forms_count': len(forms),
            'forms': forms[:30],  # Store first 30 forms for reference
        })
        
        if len(verb_analysis) % 20 == 0:
            print(f'   Processed {len(verb_analysis)} verbs ({matched_count} matched with dictionary)...')
    
    print(f'\n   ✅ Processed {len(verb_analysis)} verbs')
    print(f'   ✅ {matched_count} matched with dictionary stems/roots')
    
    total_forms_generated = sum(v['forms_count'] for v in verb_analysis)
    print(f'   ✅ Generated {total_forms_generated} total forms')
    
    # Step 4: Search for forms in batches
    print(f'\n🔍 Step 4: Searching for forms in word_frequencies...')
    
    found_forms = defaultdict(list)
    batch_size = 100
    
    for i in range(0, len(verb_analysis), batch_size):
        batch = verb_analysis[i:i+batch_size]
        print(f'   Processing batch {i//batch_size + 1}...')
        
        for verb_data in batch:
            verb_root = verb_data['verb_root']
            forms = verb_data['forms']
            
            # Build IN clause for batch search
            forms_for_search = [f.replace("'", "''") for f in forms]
            if not forms_for_search:
                continue
            
            # Search in chunks of 50 (SQL IN limit)
            for chunk_start in range(0, len(forms_for_search), 50):
                chunk = forms_for_search[chunk_start:chunk_start+50]
                forms_list = "', '".join(chunk)
                sql = f"SELECT pashto_word, frequency_total FROM word_frequencies WHERE pashto_word IN ('{forms_list}')"
                results = query_d1(sql)
                
                if results:
                    for result in results:
                        form = result.get('pashto_word', '')
                        found_forms[verb_root].append({
                            'form': form,
                            'frequency': result.get('frequency_total', 0),
                        })
    
    total_found = sum(len(v) for v in found_forms.values())
    print(f'   ✅ Found {total_found} conjugations')
    
    # Step 5: Generate SQL
    print(f'\n📝 Step 5: Generating SQL updates...')
    
    sql_updates = []
    
    # Add columns if missing
    sql_updates.append('-- Add columns if missing')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN base_verb TEXT;')
    sql_updates.append('ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;')
    sql_updates.append('')
    
    # Mark base verbs
    sql_updates.append('-- Mark base verbs')
    for verb_data in verb_analysis:
        verb_root = verb_data['verb_root']
        clean_verb = verb_root.replace("'", "''")
        sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb', base_verb = '{clean_verb}' WHERE pashto_word = '{clean_verb}';")
    sql_updates.append('')
    
    # Mark conjugations
    sql_updates.append('-- Mark verb conjugations')
    for verb_root, forms in found_forms.items():
        if forms:
            clean_verb = verb_root.replace("'", "''")
            sql_updates.append(f'-- Conjugations of {verb_root}:')
            for form_data in forms:
                clean_form = form_data['form'].replace("'", "''")
                sql_updates.append(f"UPDATE word_frequencies SET word_type = 'verb_conjugation', base_verb = '{clean_verb}', has_issues = 0 WHERE pashto_word = '{clean_form}';")
            sql_updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/mark-all-verb-forms.sql'
    sql_content = [
        '-- Mark All Verb Forms Based on LingDocs Master Chart',
        '-- Reference: https://grammar.lingdocs.com/verbs/master-chart/',
        '-- Reference: https://grammar.lingdocs.com/verbs/all-perfect-verbs/',
        '-- Uses dictionary stems/roots data (no inference needed)',
        '',
    ] + sql_updates + [
        '',
        '-- Create indexes',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_base_verb ON word_frequencies (base_verb);',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
    ]
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_content))
    
    # Write analysis results
    json_path = 'cloudflare/all-verbs-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            'total_verbs_processed': len(verb_analysis),
            'total_forms_generated': total_forms_generated,
            'total_forms_found': total_found,
            'verbs': verb_analysis[:50],  # Limit size
            'found_forms_summary': {k: len(v) for k, v in list(found_forms.items())[:50]},
        }, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Summary:')
    print(f'   - Dictionary verbs: {len(verb_index)}')
    print(f'   - Verbs processed: {len(verb_analysis)}')
    print(f'   - Matched with dictionary: {matched_count}')
    print(f'   - Forms generated: {total_forms_generated}')
    print(f'   - Forms found: {total_found}')
    print(f'   - Coverage: {(total_found/total_forms_generated*100):.1f}%' if total_forms_generated > 0 else '   - Coverage: N/A')
    print(f'\n📋 Next steps:')
    print(f'   1. Review all-verbs-analysis.json')
    print(f'   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/mark-all-verb-forms.sql')
    print(f'   3. This will mark all verb conjugations and link them to base verbs\n')

if __name__ == '__main__':
    main()

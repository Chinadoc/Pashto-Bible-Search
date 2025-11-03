#!/usr/bin/env python3
"""
Batch Process Verb Forms with Classification

This script:
1. Processes verbs in batches of 100
2. Classifies each verb form as: present, past, perfect, imperative, etc.
3. Detects perfect forms and links equatives to their verbs
4. Updates word_frequencies with form_type information

Goal: Complete verb form classification for rapid searching
"""

import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple, Optional

sys.path.insert(0, str(Path(__file__).parent.parent))

from functions.verb_inflector import conjugate_verb

def query_d1(sql_query: str) -> List[Dict[str, Any]]:
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=60)
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

def classify_form_type(form: str, conjugation: Dict[str, Any], base_verb: str) -> Optional[str]:
    """
    Classify a verb form as present, past, perfect, imperative, etc.
    
    Returns: form_type string or None
    """
    if not form or not conjugation:
        return None
    
    # Check each conjugation table
    # Present forms
    present = conjugation.get('present', {})
    for ps, _ in present.values():
        if ps == form:
            return 'present'
    
    # Past forms
    cont_past = conjugation.get('continuous_past', {})
    simple_past = conjugation.get('simple_past', {})
    for table in [cont_past, simple_past]:
        for ps, _ in table.values():
            if ps == form:
                return 'past'
    
    # Perfect forms (past participle + equative)
    perfect_present = conjugation.get('perfect_present', {})
    perfect_past = conjugation.get('perfect_past', {})
    perfect_subjunctive = conjugation.get('perfect_subjunctive', {})
    perfect_future = conjugation.get('perfect_future', {})
    
    for table in [perfect_present, perfect_past, perfect_subjunctive, perfect_future]:
        for ps, _ in table.values():
            if ps == form:
                return 'perfect'
    
    # Imperative forms
    impf_imperative = conjugation.get('imperfective_imperative', {})
    perf_imperative = conjugation.get('perfective_imperative', {})
    for table in [impf_imperative, perf_imperative]:
        for ps, _ in table.values():
            if ps == form:
                return 'imperative'
    
    # Future forms
    impf_future = conjugation.get('imperfective_future', {})
    perf_future = conjugation.get('perfective_future', {})
    for table in [impf_future, perf_future]:
        for ps, _ in table.values():
            if ps == form:
                return 'future'
    
    # Subjunctive forms
    subjunctive = conjugation.get('subjunctive', {})
    for ps, _ in subjunctive.values():
        if ps == form:
            return 'subjunctive'
    
    # Ability forms
    ability_present = conjugation.get('ability_present', {})
    ability_past = conjugation.get('ability_simple_past', {})
    for table in [ability_present, ability_past]:
        for ps, _ in table.values():
            if ps == form:
                return 'ability'
    
    # Check roots and participle
    meta = conjugation.get('meta', {})
    for key in ['imperfective_root', 'perfective_root']:
        if meta.get(key) == form:
            return 'root'
    
    if meta.get('past_participle') == form:
        return 'past_participle'
    
    return None

def detect_perfect_forms(base_verb: str, conjugation: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Detect perfect forms and return list of perfect form entries
    
    Returns: List of dicts with past_participle, equative, and full_form
    """
    perfect_forms = []
    
    if not conjugation:
        return perfect_forms
    
    meta = conjugation.get('meta', {})
    past_participle = meta.get('past_participle', '')
    
    if not past_participle:
        return perfect_forms
    
    # Equative endings for perfect forms
    equative_forms = [
        'یم', 'یو', 'یې', 'یاست', 'دی', 'ده', 'دي',  # Present
        'وم', 'وو', 'وې', 'وئ', 'و', 'وه',  # Past
        'وي',  # Habitual/Subjunctive
        'وای',  # Past subjunctive/Would have been
    ]
    
    # Check perfect tables
    perfect_tables = {
        'perfect_present': ('perfect', 'present'),
        'perfect_past': ('perfect', 'past'),
        'perfect_subjunctive': ('perfect', 'subjunctive'),
        'perfect_future': ('perfect', 'future'),
    }
    
    for table_name, (form_type, tense) in perfect_tables.items():
        table = conjugation.get(table_name, {})
        if isinstance(table, dict):
            for person, form_data in table.items():
                if isinstance(form_data, tuple):
                    ps_form = form_data[0]
                    if ps_form and isinstance(ps_form, str):
                        # Extract equative part
                        for eq in equative_forms:
                            if ps_form.endswith(' ' + eq) or ps_form.endswith(eq):
                                # Found a perfect form
                                perfect_forms.append({
                                    'past_participle': past_participle,
                                    'equative': eq,
                                    'full_form': ps_form,
                                    'form_type': form_type,
                                    'tense': tense,
                                    'person': person
                                })
                                break
    
    return perfect_forms

def find_nearby_equatives(past_participle_form: str) -> List[Dict[str, Any]]:
    """
    Look for equatives that might be separate entries near past participles
    
    Returns: List of equative entries that should be linked
    """
    equatives = []
    
    # Common equative forms
    equative_forms = [
        'یم', 'یو', 'یې', 'یاست', 'دی', 'ده', 'دي',  # Present
        'وم', 'وو', 'وې', 'وئ', 'و', 'وه',  # Past
        'وي',  # Habitual/Subjunctive
        'وای',  # Past subjunctive/Would have been
    ]
    
    # Query for equatives that might be separate entries
    # Look for entries that are just equatives
    eq_list = "', '".join([eq.replace("'", "''") for eq in equative_forms])
    
    sql = f"""
    SELECT id, pashto_word, pos, frequency_total
    FROM word_frequencies
    WHERE pashto_word IN ('{eq_list}')
    AND (pos IS NULL OR pos LIKE '%equative%' OR pos LIKE '%be%')
    LIMIT 50
    """
    
    equative_entries = query_d1(sql)
    
    return equative_entries

def process_batch(batch_num: int, batch_size: int = 100) -> Tuple[int, int]:
    """
    Process one batch of verbs
    
    Returns: (forms_classified, perfect_forms_found)
    """
    print(f"\n{'='*60}")
    print(f"📦 Processing Batch {batch_num} (verbs {batch_num * batch_size} to {(batch_num + 1) * batch_size - 1})")
    print(f"{'='*60}\n")
    
    # Get batch of base verbs
    offset = batch_num * batch_size
    sql = f"""
    SELECT DISTINCT base_verb, verb_type, transitivity
    FROM word_frequencies
    WHERE base_verb IS NOT NULL 
    AND word_type = 'verb'
    AND base_verb = pashto_word
    LIMIT {batch_size} OFFSET {offset}
    """
    
    base_verbs = query_d1(sql)
    
    if not base_verbs:
        print(f"   ⚠️  No more verbs found")
        return 0, 0
    
    print(f"   ✅ Found {len(base_verbs)} base verbs in batch")
    
    # Process each verb
    classifications = []
    perfect_detections = []
    
    for i, entry in enumerate(base_verbs, 1):
        if i % 10 == 0:
            print(f"   Processing verb {i}/{len(base_verbs)}...")
        
        base_verb = entry.get('base_verb', '').strip()
        
        if not base_verb:
            continue
        
        # Generate conjugation
        try:
            conjugation = conjugate_verb(base_verb)
            if not conjugation:
                continue
            
            # Get all forms for this verb
            all_forms = get_all_forms_from_conjugation(conjugation)
            
            # For each form, check if it exists in word_frequencies and classify
            valid_forms = [f for f in all_forms if '...' not in f and len(f) >= 2]
            
            if not valid_forms:
                continue
            
            # Batch query forms
            form_list = "', '".join([f.replace("'", "''") for f in valid_forms])
            base_verb_escaped = base_verb.replace("'", "''")
            
            check_sql = f"""
            SELECT id, pashto_word, base_verb, form_type
            FROM word_frequencies
            WHERE pashto_word IN ('{form_list}')
            AND (base_verb IS NULL OR base_verb = '{base_verb_escaped}')
            """
            
            existing_forms = query_d1(check_sql)
            
            # Classify each form
            for form_entry in existing_forms:
                form_word = form_entry.get('pashto_word')
                form_type = classify_form_type(form_word, conjugation, base_verb)
                
                if form_type:
                    classifications.append({
                        'id': form_entry.get('id'),
                        'form': form_word,
                        'form_type': form_type,
                        'base_verb': base_verb
                    })
            
            # Detect perfect forms
            perfect_forms_list = detect_perfect_forms(base_verb, conjugation)
            for pf in perfect_forms_list:
                perfect_detections.append({
                    'base_verb': base_verb,
                    'past_participle': pf['past_participle'],
                    'equative': pf['equative'],
                    'full_form': pf['full_form'],
                    'form_type': pf['form_type'],
                    'tense': pf['tense']
                })
                
                # Also check for nearby equatives that might be separate entries
                nearby_eqs = find_nearby_equatives(pf['past_participle'])
                for eq_entry in nearby_eqs:
                    eq_word = eq_entry.get('pashto_word')
                    if eq_word == pf['equative']:
                        # Found a matching equative entry - should be linked
                        perfect_detections.append({
                            'base_verb': base_verb,
                            'past_participle': pf['past_participle'],
                            'equative': eq_word,
                            'equative_id': eq_entry.get('id'),
                            'full_form': pf['past_participle'] + ' ' + eq_word,
                            'form_type': pf['form_type'],
                            'tense': pf['tense']
                        })
        
        except Exception as e:
            print(f"   ⚠️  Error processing {base_verb}: {e}")
            continue
    
    print(f"   ✅ Classified {len(classifications)} forms")
    print(f"   ✅ Detected {len(perfect_detections)} perfect form patterns")
    
    # Generate SQL for this batch
    sql_statements = []
    
    for cls in classifications:
        form_escaped = "'" + cls['form'].replace("'", "''") + "'"
        form_type_escaped = "'" + cls['form_type'].replace("'", "''") + "'"
        base_escaped = "'" + cls['base_verb'].replace("'", "''") + "'"
        
        sql = f"""UPDATE word_frequencies 
SET form_type = {form_type_escaped}, base_verb = COALESCE(base_verb, {base_escaped})
WHERE id = {cls['id']};"""
        sql_statements.append(sql)
    
    # Write batch SQL file
    output_path = Path(f'cloudflare/batch-{batch_num:03d}-classify-forms.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"-- Batch {batch_num}: Classify Verb Forms\n")
        f.write(f"-- Forms classified: {len(classifications)}\n")
        f.write(f"-- Perfect forms detected: {len(perfect_detections)}\n\n")
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    
    return len(classifications), len(perfect_detections)

def get_all_forms_from_conjugation(conjugation: Dict[str, Any]) -> Set[str]:
    """Extract all Pashto forms from a conjugation table"""
    forms = set()
    
    if not conjugation:
        return forms
    
    tables = [
        'present', 'subjunctive', 'continuous_past', 'simple_past',
        'imperfective_future', 'perfective_future',
        'imperfective_imperative', 'perfective_imperative',
        'habitual_continuous_past', 'habitual_simple_past',
        'ability_present', 'ability_subjunctive', 'ability_continuous_past', 'ability_simple_past',
        'ability_imperfective_future', 'ability_perfective_future',
        'perfect_present', 'perfect_past', 'perfect_subjunctive', 'perfect_future', 'perfect_habitual'
    ]
    
    for table_name in tables:
        table = conjugation.get(table_name, {})
        if isinstance(table, dict):
            for person, form_data in table.items():
                if isinstance(form_data, tuple):
                    ps_form = form_data[0]
                    if ps_form and isinstance(ps_form, str):
                        if '...' not in ps_form:
                            forms.add(ps_form)
                elif isinstance(form_data, str):
                    if '...' not in form_data:
                        forms.add(form_data)
    
    meta = conjugation.get('meta', {})
    for key in ['imperfective_root', 'perfective_root', 'past_participle']:
        value = meta.get(key)
        if value and isinstance(value, str):
            forms.add(value)
    
    return forms

def main():
    print("="*60)
    print("🚀 BATCH PROCESSING: Classify All Verb Forms")
    print("="*60)
    print("\nThis will process verbs in batches of 100, classifying each form")
    print("(present, past, perfect, imperative, etc.) and detecting perfect forms.\n")
    
    # Process batches sequentially (up to 100 batches)
    total_classified = 0
    total_perfect = 0
    batch_num = 0
    max_batches = 100
    
    print(f"📋 Processing up to {max_batches} batches sequentially...\n")
    
    while batch_num < max_batches:
        try:
            print(f"\n🔄 Starting batch {batch_num}...")
            classified, perfect = process_batch(batch_num)
            
            if classified == 0:
                print(f"\n✅ No more verbs to process. Completed at batch {batch_num}!")
                break
            
            total_classified += classified
            total_perfect += perfect
            
            print(f"   ✅ Batch {batch_num}: {classified} forms classified, {perfect} perfect forms detected")
            
            # Execute batch SQL immediately
            sql_file = f'cloudflare/batch-{batch_num:03d}-classify-forms.sql'
            if Path(sql_file).exists():
                print(f"   📝 Executing SQL for batch {batch_num}...")
                cmd = f"wrangler d1 execute pashto-bible-db --remote --file {sql_file}"
                
                try:
                    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)
                    if result.returncode == 0:
                        print(f"   ✅ Batch {batch_num} SQL executed successfully")
                    else:
                        print(f"   ⚠️  Batch {batch_num} SQL had errors:")
                        print(f"      {result.stderr[:200]}")
                except Exception as e:
                    print(f"   ⚠️  Error executing batch {batch_num} SQL: {e}")
            
            batch_num += 1
            
            # Small delay between batches
            if batch_num < max_batches:
                time.sleep(2)  # 2 second delay between batches
        
        except KeyboardInterrupt:
            print(f"\n\n⚠️  Interrupted at batch {batch_num}")
            print(f"   Progress: {total_classified} forms classified, {total_perfect} perfect forms detected")
            break
        except Exception as e:
            print(f"\n   ❌ Error in batch {batch_num}: {e}")
            print(f"   Continuing with next batch...")
            batch_num += 1
            time.sleep(1)
            continue
    
    print(f"\n{'='*60}")
    print(f"📊 FINAL SUMMARY")
    print(f"{'='*60}")
    print(f"   ✅ Processed {batch_num} batches")
    print(f"   ✅ Classified {total_classified} forms total")
    print(f"   ✅ Detected {total_perfect} perfect form patterns")
    print(f"\n💡 Query examples:")
    print(f"   SELECT * FROM word_frequencies WHERE base_verb = 'کارول' AND form_type = 'present';")
    print(f"   SELECT * FROM word_frequencies WHERE base_verb = 'کارول' AND form_type = 'past';")
    print(f"   SELECT * FROM word_frequencies WHERE base_verb = 'کارول' AND form_type = 'perfect';")

if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Generate and Link All Verb Forms

This script:
1. For each base verb in word_frequencies, generates all possible conjugations
2. Searches for these forms in word_frequencies
3. Links found forms to their base_verb

Goal: Enable seeing all related forms (present, past, 3rd person, etc.) for each verb
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List, Set

sys.path.insert(0, str(Path(__file__).parent.parent))

from functions.verb_inflector import conjugate_verb

def query_d1(sql_query: str) -> List[Dict[str, Any]]:
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
        print(f"   ⚠️  Error querying D1: {e}")
        return []

def get_all_forms_from_conjugation(conjugation: Dict[str, Any]) -> Set[str]:
    """Extract all Pashto forms from a conjugation table"""
    forms = set()
    
    if not conjugation:
        return forms
    
    # Extract from all conjugation tables
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
                    ps_form = form_data[0]  # Pashto form
                    if ps_form and isinstance(ps_form, str):
                        # Remove placeholder text like "... به ..."
                        if '...' not in ps_form:
                            forms.add(ps_form)
                elif isinstance(form_data, str):
                    if '...' not in form_data:
                        forms.add(form_data)
    
    # Also get roots and participle
    meta = conjugation.get('meta', {})
    for key in ['imperfective_root', 'perfective_root', 'past_participle']:
        value = meta.get(key)
        if value and isinstance(value, str):
            forms.add(value)
    
    return forms

def main():
    print("🔗 Generating and Linking All Verb Forms\n")
    
    # Step 1: Get all base verbs
    print("📊 Querying base verbs...")
    sql = """
    SELECT DISTINCT base_verb, verb_type, transitivity
    FROM word_frequencies
    WHERE base_verb IS NOT NULL 
    AND word_type = 'verb'
    AND base_verb = pashto_word
    LIMIT 100
    """
    
    base_verbs = query_d1(sql)
    print(f"   ✅ Found {len(base_verbs)} base verbs")
    
    if not base_verbs:
        print("   ⚠️  No base verbs found")
        return
    
    # Step 2: Generate forms and link them
    print("\n🔬 Generating forms and linking...")
    links = []
    
    for i, entry in enumerate(base_verbs, 1):
        if i % 10 == 0:
            print(f"   Processing {i}/{len(base_verbs)}...")
        
        base_verb = entry.get('base_verb', '').strip()
        
        if not base_verb:
            continue
        
        # Generate conjugation
        try:
            conjugation = conjugate_verb(base_verb)
            if not conjugation:
                continue
            
            # Extract all forms
            generated_forms = get_all_forms_from_conjugation(conjugation)
            
            # Collect all forms for batch query
            valid_forms = [f for f in generated_forms if '...' not in f and len(f) >= 2]
            
            if not valid_forms:
                continue
            
            # Batch query: check all forms at once
            form_list = "', '".join([f.replace("'", "''") for f in valid_forms])
            base_verb_escaped = base_verb.replace("'", "''")
            
            check_sql = f"""
            SELECT id, pashto_word, base_verb
            FROM word_frequencies
            WHERE pashto_word IN ('{form_list}')
            AND (base_verb IS NULL OR base_verb != '{base_verb_escaped}')
            """
            
            existing_forms = query_d1(check_sql)
            
            # Create lookup for quick access
            forms_lookup = {f: base_verb for f in valid_forms}
            
            for form_entry in existing_forms:
                form_word = form_entry.get('pashto_word')
                if form_word in forms_lookup:
                    links.append({
                        'id': form_entry.get('id'),
                        'form': form_word,
                        'base_verb': base_verb
                    })
        
        except Exception as e:
            print(f"   ⚠️  Error processing {base_verb}: {e}")
            continue
    
    print(f"   ✅ Found {len(links)} forms to link")
    
    if not links:
        print("\n   ✅ All forms already linked!")
        return
    
    # Step 3: Generate SQL
    print("\n📝 Generating SQL updates...")
    sql_statements = []
    sql_statements.append("-- Link Generated Verb Forms to Base Verbs")
    sql_statements.append("-- This links conjugated forms (present, past, etc.) found in text to their base verbs")
    sql_statements.append("")
    
    for link in links:
        form_escaped = "'" + link['form'].replace("'", "''") + "'"
        base_escaped = "'" + link['base_verb'].replace("'", "''") + "'"
        
        sql = f"UPDATE word_frequencies SET base_verb = {base_escaped} WHERE id = {link['id']};"
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/link-generated-verb-forms.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(links)} UPDATE statements")
    
    # Show sample
    print("\n📋 Sample of links:")
    for link in links[:10]:
        print(f"   '{link['form']}' → base_verb: '{link['base_verb']}'")
    
    if len(links) > 10:
        print(f"   ... and {len(links) - 10} more")
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/link-generated-verb-forms.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/link-generated-verb-forms.sql")
    print(f"   3. Query: SELECT * FROM word_frequencies WHERE base_verb = 'کارول'")

if __name__ == '__main__':
    main()


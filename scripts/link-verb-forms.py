#!/usr/bin/env python3
"""
Link Verb Forms to Base Verbs

This script identifies all conjugated forms (present, past, etc.) in word_frequencies
and links them to their base verbs via the base_verb column.

Goal: Enable rapid searching for all forms of a verb (present, past, 3rd person, etc.)
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List, Set

sys.path.insert(0, str(Path(__file__).parent.parent))

from functions.verb_inflector import conjugate_verb, infer_root_from_form

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

def get_base_verb_for_form(form: str, known_base_verbs: Set[str]) -> str:
    """
    Try to infer base verb for a given form
    
    Args:
        form: The conjugated form to identify
        known_base_verbs: Set of known base verbs from database
    
    Returns:
        Base verb if found, empty string otherwise
    """
    if not form or not form.endswith('ل'):
        return ''
    
    # Try inferring root
    inferred_root = infer_root_from_form(form)
    
    if inferred_root and inferred_root in known_base_verbs:
        return inferred_root
    
    # Try direct lookup
    if form in known_base_verbs:
        return form
    
    # Try conjugating known verbs to see if form matches
    for base_verb in known_base_verbs:
        try:
            conjugation = conjugate_verb(base_verb)
            if not conjugation:
                continue
            
            # Check all tables for the form
            for table_name in ['present', 'subjunctive', 'continuous_past', 'simple_past']:
                table = conjugation.get(table_name, {})
                for ps, _rom in table.values():
                    if ps == form:
                        return base_verb
        except Exception:
            continue
    
    return ''

def main():
    print("🔗 Linking Verb Forms to Base Verbs\n")
    
    # Step 1: Get all known base verbs
    print("📊 Querying base verbs from word_frequencies...")
    sql = """
    SELECT DISTINCT pashto_word, base_verb
    FROM word_frequencies
    WHERE word_type = 'verb' AND base_verb IS NOT NULL
    """
    
    base_verb_entries = query_d1(sql)
    known_base_verbs = set()
    
    for entry in base_verb_entries:
        base = entry.get('base_verb') or entry.get('pashto_word')
        if base:
            known_base_verbs.add(base)
    
    print(f"   ✅ Found {len(known_base_verbs)} known base verbs")
    
    # Step 2: Get all verb-like entries without base_verb
    print("\n📊 Querying verb forms without base_verb...")
    sql = """
    SELECT id, pashto_word, word_type, pos
    FROM word_frequencies
    WHERE (
        (word_type = 'verb' AND base_verb IS NULL) OR
        (pashto_word LIKE '%ل' AND pos LIKE '%verb%' AND base_verb IS NULL) OR
        (pashto_word LIKE '%ل' AND pos LIKE '%v.%' AND base_verb IS NULL)
    )
    AND pashto_word IS NOT NULL
    LIMIT 5000
    """
    
    forms_to_link = query_d1(sql)
    print(f"   ✅ Found {len(forms_to_link)} forms to link")
    
    if not forms_to_link:
        print("   ✅ All forms already linked!")
        return
    
    # Step 3: Link forms to base verbs
    print("\n🔬 Linking forms to base verbs...")
    links = []
    
    for i, entry in enumerate(forms_to_link, 1):
        if i % 100 == 0:
            print(f"   Processing {i}/{len(forms_to_link)}...")
        
        form = entry.get('pashto_word', '').strip()
        entry_id = entry.get('id')
        
        if not form:
            continue
        
        base_verb = get_base_verb_for_form(form, known_base_verbs)
        
        if base_verb:
            links.append({
                'id': entry_id,
                'form': form,
                'base_verb': base_verb
            })
    
    print(f"   ✅ Linked {len(links)} forms to base verbs")
    
    if not links:
        print("\n   ⚠️  No forms could be linked. They may not be verb forms or base verbs need to be identified first.")
        return
    
    # Step 4: Generate SQL
    print("\n📝 Generating SQL updates...")
    sql_statements = []
    sql_statements.append("-- Link Verb Forms to Base Verbs")
    sql_statements.append("-- This links conjugated forms (present, past, etc.) to their base verbs")
    sql_statements.append("")
    
    for link in links:
        form_escaped = "'" + link['form'].replace("'", "''") + "'"
        base_escaped = "'" + link['base_verb'].replace("'", "''") + "'"
        
        sql = f"UPDATE word_frequencies SET base_verb = {base_escaped} WHERE id = {link['id']};"
        sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path('cloudflare/link-verb-forms.sql')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(links)} UPDATE statements")
    
    # Show sample of links
    print("\n📋 Sample of links:")
    for link in links[:10]:
        print(f"   '{link['form']}' → base_verb: '{link['base_verb']}'")
    
    if len(links) > 10:
        print(f"   ... and {len(links) - 10} more")
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/link-verb-forms.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/link-verb-forms.sql")
    print(f"   3. Query related forms: SELECT * FROM word_frequencies WHERE base_verb = 'کارول'")

if __name__ == '__main__':
    main()


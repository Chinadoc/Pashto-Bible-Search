#!/usr/bin/env python3
"""
Query Related Verb Forms

This script queries and displays all related forms (present, past, 3rd person, etc.)
for a given base verb.

Usage: python3 scripts/query-verb-forms.py کارول
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List

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

def query_verb_forms(base_verb: str):
    """Query all forms related to a base verb"""
    
    base_verb_escaped = base_verb.replace("'", "''")
    
    sql = f"""
    SELECT 
        pashto_word,
        romanization,
        pos,
        verb_type,
        transitivity,
        imperfective_stem,
        perfective_stem,
        perfective_root,
        past_participle,
        frequency_total as frequency_t
    FROM word_frequencies
    WHERE base_verb = '{base_verb_escaped}'
    ORDER BY frequency_total DESC, pashto_word
    """
    
    forms = query_d1(sql)
    
    if not forms:
        print(f"\n⚠️  No forms found for base verb: {base_verb}")
        print(f"\nTrying to find base verb entry...")
        
        # Try to find the base verb itself
        sql2 = f"""
        SELECT 
            pashto_word,
            romanization,
            pos,
            verb_type,
            transitivity,
            imperfective_stem,
            perfective_stem,
            perfective_root,
            past_participle,
            base_verb,
            frequency_t
        FROM word_frequencies
        WHERE pashto_word = '{base_verb_escaped}'
        LIMIT 1
        """
        
        base_entry = query_d1(sql2)
        if base_entry:
            print(f"\n✅ Found base verb entry:")
            entry = base_entry[0]
            print(f"   Word: {entry.get('pashto_word')}")
            print(f"   Romanization: {entry.get('romanization')}")
            print(f"   POS: {entry.get('pos')}")
            print(f"   Verb Type: {entry.get('verb_type')}")
            print(f"   Transitivity: {entry.get('transitivity')}")
            print(f"   Imperfective Stem: {entry.get('imperfective_stem')}")
            print(f"   Perfective Stem: {entry.get('perfective_stem')}")
            print(f"   Perfective Root: {entry.get('perfective_root')}")
            print(f"   Past Participle: {entry.get('past_participle')}")
            print(f"   Base Verb: {entry.get('base_verb')}")
            print(f"   Total Frequency: {entry.get('frequency_total')}")
            
            if entry.get('base_verb'):
                print(f"\n🔍 Querying all forms linked to base_verb: {entry.get('base_verb')}")
                return query_verb_forms(entry.get('base_verb'))
        else:
            print(f"   ❌ Base verb '{base_verb}' not found in database")
        
        return []
    
    return forms

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/query-verb-forms.py <base_verb>")
        print("\nExample:")
        print("  python3 scripts/query-verb-forms.py کارول")
        print("  python3 scripts/query-verb-forms.py لوستل")
        sys.exit(1)
    
    base_verb = sys.argv[1].strip()
    
    print(f"🔍 Querying all forms for base verb: {base_verb}\n")
    
    forms = query_verb_forms(base_verb)
    
    if not forms:
        return
    
    print(f"✅ Found {len(forms)} related forms:\n")
    print("=" * 100)
    print(f"{'Pashto Word':<25} {'Romanization':<25} {'POS':<20} {'Frequency':<15}")
    print("=" * 100)
    
    for form in forms:
        pashto = form.get('pashto_word', '')
        roman = form.get('romanization', '') or 'NULL'
        pos = form.get('pos', '') or 'NULL'
        freq = form.get('frequency_t', 0)
        
        print(f"{pashto:<25} {roman:<25} {pos:<20} {freq:<15}")
    
    print("=" * 100)
    
    # Show verb classification info from first form
    if forms:
        first_form = forms[0]
        print(f"\n📋 Verb Classification:")
        print(f"   Verb Type: {first_form.get('verb_type')}")
        print(f"   Transitivity: {first_form.get('transitivity')}")
        print(f"   Imperfective Stem: {first_form.get('imperfective_stem') or 'NULL'}")
        print(f"   Perfective Stem: {first_form.get('perfective_stem') or 'NULL'}")
        print(f"   Perfective Root: {first_form.get('perfective_root') or 'NULL'}")
        print(f"   Past Participle: {first_form.get('past_participle') or 'NULL'}")
    
    print(f"\n💡 SQL Query to run in Cloudflare D1 Studio:")
    base_verb_escaped = base_verb.replace("'", "''")
    print(f"   SELECT * FROM word_frequencies WHERE base_verb = '{base_verb_escaped}' ORDER BY frequency_t DESC;")

if __name__ == '__main__':
    main()


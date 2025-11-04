#!/usr/bin/env python3
"""
Extract and convert LingDocs irregular conjugations to our format

This script downloads the LingDocs irregular-conjugations.ts file and converts
it to a JSON format that can be used by our search/variant generation system.

The LingDocs file contains comprehensive VerbConjugation objects with:
- Present tense (indicative, subjunctive)
- Perfective tense
- Perfect tense
- Past tense
- Modal forms (ability, hypothetical)
- Imperative forms
- All person/gender/number combinations

Usage:
    python3 scripts/extract-lingdocs-irregular-conjugations.py
"""

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List

APP_ROOT = Path(__file__).parent.parent
OUTPUT_JSON = APP_ROOT / 'lingdocs_irregular_conjugations.json'
IRREGULAR_CONJUGATIONS_URL = 'https://raw.githubusercontent.com/lingdocs/pashto-inflector/main/src/lib/src/irregular-conjugations.ts'

def extract_verb_forms_from_ts(ts_content: str, verb_name: str) -> Dict[str, Any]:
    """
    Extract verb conjugation forms from TypeScript content.
    
    Looks for patterns like:
    export const kedulStat: T.VerbConjugation = {
      stem: { imperfective: {...}, perfective: {...} },
      root: { imperfective: {...}, perfective: {...} },
      perfect: { ... },
      ...
    }
    """
    forms = {}
    
    # Find the verb definition
    pattern = rf'export const {verb_name}:.*?=.*?\{{(.*?)\}};'
    match = re.search(pattern, ts_content, re.DOTALL)
    if not match:
        return forms
    
    verb_content = match.group(1)
    
    # Extract all form arrays - look for patterns like:
    # { p: "کېدلی شم", f: "kedúlay shum" }
    form_pattern = r'\{ p: "([^"]+)", f: "([^"]+)" \}'
    all_forms = re.findall(form_pattern, verb_content)
    
    # Group forms by context (we'll need to parse the structure better)
    # For now, just collect all unique forms
    unique_forms = {}
    for pashto, romanization in all_forms:
        if pashto not in unique_forms:
            unique_forms[pashto] = romanization
    
    forms['all_forms'] = unique_forms
    
    return forms

def fetch_irregular_conjugations() -> str:
    """Fetch the irregular conjugations TypeScript file"""
    print(f"📥 Fetching {IRREGULAR_CONJUGATIONS_URL}...")
    
    try:
        result = subprocess.run(
            ['curl', '-s', IRREGULAR_CONJUGATIONS_URL],
            capture_output=True,
            text=True,
            encoding='utf-8',
            timeout=30
        )
        if result.returncode == 0:
            return result.stdout
        else:
            print(f"   ❌ Error fetching file: {result.stderr}")
            return ''
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return ''

def extract_all_verbs(ts_content: str) -> Dict[str, Dict[str, Any]]:
    """
    Extract all verb conjugations from the TypeScript file.
    
    Identifies verbs like: kedulStat, kawulDyn, kawulStat, kedulDyn, 
    tlul, warkawul, darkawul, raakawul
    """
    verbs = {}
    
    # List of known irregular verbs from the file
    verb_names = [
        'kedulStat', 'kedulDyn', 'kawulStat', 'kawulDyn',
        'tlul', 'warkawul', 'darkawul', 'raakawul'
    ]
    
    # Map verb names to Pashto equivalents
    verb_map = {
        'kedulStat': 'کېدل',
        'kedulDyn': 'کېدل',
        'kawulStat': 'کول',
        'kawulDyn': 'کول',
        'tlul': 'تلل',
        'warkawul': 'ورکول',
        'darkawul': 'درکول',
        'raakawul': 'راکول'
    }
    
    print(f"🔍 Extracting {len(verb_names)} irregular verbs...")
    
    for verb_name in verb_names:
        print(f"   Processing {verb_name}...")
        
        # Extract all forms for this verb
        forms = extract_verb_forms_from_ts(ts_content, verb_name)
        
        if forms:
            pashto_name = verb_map.get(verb_name, verb_name)
            verbs[pashto_name] = {
                'verb_name': verb_name,
                'forms': forms.get('all_forms', {}),
                'form_count': len(forms.get('all_forms', {}))
            }
            print(f"      ✅ Found {verbs[pashto_name]['form_count']} forms")
        else:
            print(f"      ⚠️  No forms found")
    
    return verbs

def flatten_verb_forms(verbs: Dict[str, Dict[str, Any]]) -> Dict[str, List[str]]:
    """
    Flatten verb forms into a simple list of all morphological variants.
    This makes it easy to search for any form.
    """
    flattened = {}
    
    for pashto_verb, data in verbs.items():
        forms = data.get('forms', {})
        form_list = list(forms.keys())
        flattened[pashto_verb] = form_list
    
    return flattened

def main():
    print("🎯 Extracting LingDocs Irregular Conjugations\n")
    
    # Fetch the TypeScript file
    ts_content = fetch_irregular_conjugations()
    
    if not ts_content:
        print("   ❌ Failed to fetch irregular conjugations file")
        return 1
    
    print(f"   ✅ Fetched {len(ts_content):,} characters\n")
    
    # Extract verb conjugations
    verbs = extract_all_verbs(ts_content)
    
    if not verbs:
        print("   ⚠️  No verbs extracted. Trying alternative extraction method...")
        # Fallback: just extract all Pashto forms from the file
        form_pattern = r'\{ p: "([^"]+)", f: "([^"]+)" \}'
        all_forms = re.findall(form_pattern, ts_content)
        
        # Group by verb (heuristic: forms containing common verb parts)
        grouped = {}
        for pashto, rom in all_forms:
            # Try to identify which verb this belongs to
            if 'کېدل' in pashto or 'ked' in rom.lower():
                if 'کېدل' not in grouped:
                    grouped['کېدل'] = []
                grouped['کېدل'].append(pashto)
            elif 'کول' in pashto or 'kol' in rom.lower() or 'kaw' in rom.lower():
                if 'کول' not in grouped:
                    grouped['کول'] = []
                grouped['کول'].append(pashto)
            elif 'تلل' in pashto or 'tl' in rom.lower():
                if 'تلل' not in grouped:
                    grouped['تلل'] = []
                grouped['تلل'].append(pashto)
            elif 'ورکول' in pashto or 'wark' in rom.lower():
                if 'ورکول' not in grouped:
                    grouped['ورکول'] = []
                grouped['ورکول'].append(pashto)
        
        verbs = {}
        for pashto_verb, form_list in grouped.items():
            verbs[pashto_verb] = {
                'verb_name': pashto_verb,
                'forms': {f: f for f in form_list},
                'form_count': len(form_list)
            }
        
        print(f"   ✅ Extracted {len(verbs)} verbs using fallback method")
    
    # Flatten forms for easy searching
    flattened = flatten_verb_forms(verbs)
    
    # Create output structure
    output = {
        'metadata': {
            'source': IRREGULAR_CONJUGATIONS_URL,
            'extracted_at': subprocess.run(['date', '+%s'], capture_output=True, text=True).stdout.strip(),
            'verb_count': len(verbs),
            'total_forms': sum(len(forms) for forms in flattened.values())
        },
        'verbs': verbs,
        'flattened_forms': flattened  # Easy lookup: verb -> [all forms]
    }
    
    # Save to JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Saved to {OUTPUT_JSON}")
    print(f"\n📊 Summary:")
    print(f"   - Verbs extracted: {len(verbs)}")
    print(f"   - Total forms: {sum(len(forms) for forms in flattened.values())}")
    for verb, data in verbs.items():
        print(f"   - {verb}: {data['form_count']} forms")
    
    print(f"\n📋 Next steps:")
    print(f"   1. Review the extracted data: {OUTPUT_JSON}")
    print(f"   2. Integrate into search variant generation")
    print(f"   3. Use flattened_forms for quick lookups during search")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())


#!/usr/bin/env python3
"""
Populate Word Frequencies with Comprehensive Verb Classification

This script:
1. Loads all verbs from word_frequencies database
2. Uses verb_classifier to get comprehensive verb info
3. Generates SQL to update database with all classification metadata
4. Ensures rapid searchability by pre-categorizing everything

Goal: Fill word_frequencies with robust, categorized data for fast searching
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from functions.verb_classifier import get_verb_info, get_transitivity, get_verb_type
from functions.verb_inflector import VERBS as VERB_LEXICON

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

def load_dictionary() -> List[Dict[str, Any]]:
    """Load dictionary JSON"""
    dict_paths = [
        'docs/lexicon/full_dictionary_enriched.json',
        'full_dictionary_enriched.json',
        'public/full_dictionary_enriched.json',
        'app/data/full_dictionary_enriched.json',
    ]
    
    for dict_path in dict_paths:
        path = Path(dict_path)
        if path.exists():
            try:
                print(f'   Loading dictionary from: {path}')
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
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

def create_dictionary_lookup(dictionary_entries: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Create fast lookup dictionary by Pashto word"""
    lookup = {}
    
    for entry in dictionary_entries:
        pashto = entry.get('pashto', '') or entry.get('p', '')
        if pashto:
            # Normalize variants
            normalized = pashto.replace('ي', 'ی').replace('ى', 'ی')
            lookup[pashto] = entry
            if normalized != pashto:
                lookup[normalized] = entry
    
    return lookup

def escape_sql_string(text: str) -> str:
    """Escape SQL string"""
    if not text:
        return 'NULL'
    return "'" + str(text).replace("'", "''") + "'"

def classify_verb_from_word_frequencies(
    word_entry: Dict[str, Any],
    dictionary_lookup: Dict[str, Dict[str, Any]],
    verb_lexicon: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Classify a verb from word_frequencies entry
    
    Returns classification info to update database
    """
    pashto_word = word_entry.get('pashto_word', '').strip()
    
    if not pashto_word:
        return {}
    
    # Try to find in dictionary
    dict_entry = dictionary_lookup.get(pashto_word)
    
    # If not found, try normalized variants
    if not dict_entry:
        normalized = pashto_word.replace('ي', 'ی').replace('ى', 'ی')
        dict_entry = dictionary_lookup.get(normalized)
    
    # If still not found, check verb lexicon
    if not dict_entry:
        if pashto_word in verb_lexicon:
            # Create a mock entry from verb lexicon
            verb_spec = verb_lexicon[pashto_word]
            dict_entry = {
                'pashto': pashto_word,
                'p': pashto_word,
                'pos': 'v.',
                'c': 'v.',
                'psp': verb_spec.get('stems', {}).get('imperfective', ''),
                'ssp': verb_spec.get('stems', {}).get('perfective', ''),
                'prp': verb_spec.get('roots', {}).get('perfective', ''),
                'pp': verb_spec.get('past_participle', ''),
                'f': verb_spec.get('romanization', {}).get('imperfective_root', ''),
            }
    
    # If no dictionary entry found, try to infer
    if not dict_entry:
        # Check if it looks like a verb (ends in ل)
        if pashto_word.endswith('ل'):
            dict_entry = {
                'pashto': pashto_word,
                'p': pashto_word,
                'pos': 'v.',
                'c': 'v.',
            }
        else:
            return {}  # Not a verb
    
    # Get verb info using classifier
    verb_info = get_verb_info(dict_entry)
    
    if not verb_info:
        return {}
    
    # Build update dictionary
    update_info = {
        'pashto_word': pashto_word,
        'verb_type': verb_info.get('type', 'simple'),
        'transitivity': verb_info.get('transitivity', 'transitive'),
        'yul_ending': 1 if verb_info.get('yul_ending') else 0,
        'imperfective_stem': verb_info.get('imperfective_stem', ''),
        'perfective_stem': verb_info.get('perfective_stem', ''),
        'perfective_root': verb_info.get('perfective_root', ''),
        'past_participle': verb_info.get('past_participle', ''),
        'complement_text': verb_info.get('complement_text', ''),
        'aux_verb': verb_info.get('aux_verb', ''),
        'base_verb': pashto_word,  # Base verb is itself if not found elsewhere
        'word_type': 'verb',
    }
    
    # Handle idiosyncratic form
    if 'idiosyncratic_3sg_masc' in verb_info:
        idio = verb_info['idiosyncratic_3sg_masc']
        if isinstance(idio, dict):
            update_info['idiosyncratic_3sg_masc'] = idio.get('pashto', '')
        else:
            update_info['idiosyncratic_3sg_masc'] = str(idio)
    
    # Update romanization if missing
    if not word_entry.get('romanization') and verb_info.get('romanization'):
        update_info['romanization'] = verb_info['romanization']
    
    # Update POS if missing
    if not word_entry.get('pos') and verb_info.get('pos'):
        update_info['pos'] = verb_info['pos']
    
    return update_info

def generate_sql_updates(
    classifications: List[Dict[str, Any]],
    output_file: str = 'cloudflare/populate-verb-classifications.sql'
) -> None:
    """Generate SQL file to update word_frequencies with classifications"""
    
    sql_statements = []
    sql_statements.append("-- Populate Word Frequencies with Comprehensive Verb Classification")
    sql_statements.append("-- This script fills in missing verb classification data for rapid searching")
    sql_statements.append("")
    
    for info in classifications:
        pashto_word = escape_sql_string(info['pashto_word'])
        
        # Build UPDATE statement
        updates = []
        
        if 'verb_type' in info:
            updates.append(f"verb_type = {escape_sql_string(info['verb_type'])}")
        
        if 'transitivity' in info:
            updates.append(f"transitivity = {escape_sql_string(info['transitivity'])}")
        
        if 'yul_ending' in info:
            updates.append(f"yul_ending = {info['yul_ending']}")
        
        if 'base_verb' in info and info['base_verb']:
            updates.append(f"base_verb = {escape_sql_string(info['base_verb'])}")
        
        if 'imperfective_stem' in info and info['imperfective_stem']:
            updates.append(f"imperfective_stem = {escape_sql_string(info['imperfective_stem'])}")
        
        if 'perfective_stem' in info and info['perfective_stem']:
            updates.append(f"perfective_stem = {escape_sql_string(info['perfective_stem'])}")
        
        if 'perfective_root' in info and info['perfective_root']:
            updates.append(f"perfective_root = {escape_sql_string(info['perfective_root'])}")
        
        if 'past_participle' in info and info['past_participle']:
            updates.append(f"past_participle = {escape_sql_string(info['past_participle'])}")
        
        if 'complement_text' in info and info['complement_text']:
            updates.append(f"complement_text = {escape_sql_string(info['complement_text'])}")
        
        if 'aux_verb' in info and info['aux_verb']:
            updates.append(f"aux_verb = {escape_sql_string(info['aux_verb'])}")
        
        if 'idiosyncratic_3sg_masc' in info and info['idiosyncratic_3sg_masc']:
            updates.append(f"idiosyncratic_3sg_masc = {escape_sql_string(info['idiosyncratic_3sg_masc'])}")
        
        if 'word_type' in info:
            updates.append(f"word_type = {escape_sql_string(info['word_type'])}")
        
        # Only update romanization/pos if they're missing
        if 'romanization' in info and info['romanization']:
            updates.append(f"romanization = COALESCE(romanization, {escape_sql_string(info['romanization'])})")
        
        if 'pos' in info and info['pos']:
            updates.append(f"pos = COALESCE(pos, {escape_sql_string(info['pos'])})")
        
        if updates:
            sql = f"UPDATE word_frequencies SET {', '.join(updates)} WHERE pashto_word = {pashto_word};"
            sql_statements.append(sql)
    
    # Write SQL file
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"   ✅ Generated {output_path}")
    print(f"   ✅ {len(sql_statements) - 3} UPDATE statements")  # Subtract header lines

def main():
    print("🔍 Populating Word Frequencies with Comprehensive Verb Classification\n")
    
    # Step 1: Load dictionary
    print("📚 Loading dictionary...")
    dictionary_entries = load_dictionary()
    if not dictionary_entries:
        print("   ❌ Could not load dictionary")
        return
    print(f"   ✅ Loaded {len(dictionary_entries)} dictionary entries")
    
    # Create lookup dictionary
    dictionary_lookup = create_dictionary_lookup(dictionary_entries)
    print(f"   ✅ Created lookup dictionary ({len(dictionary_lookup)} entries)")
    
    # Step 2: Query all verbs from word_frequencies
    print("\n📊 Querying verbs from word_frequencies...")
    sql = """
    SELECT DISTINCT pashto_word, romanization, pos, word_type, base_verb
    FROM word_frequencies
    WHERE pashto_word LIKE '%ل' OR word_type = 'verb' OR pos LIKE '%verb%' OR pos LIKE '%v.%'
    ORDER BY pashto_word
    """
    
    verb_entries = query_d1(sql)
    print(f"   ✅ Found {len(verb_entries)} potential verb entries")
    
    if not verb_entries:
        print("   ⚠️  No verbs found. Checking all entries ending in 'ل'...")
        sql = "SELECT DISTINCT pashto_word, romanization, pos FROM word_frequencies WHERE pashto_word LIKE '%ل' LIMIT 100"
        verb_entries = query_d1(sql)
        print(f"   ✅ Found {len(verb_entries)} entries ending in 'ل'")
    
    # Step 3: Classify each verb
    print("\n🔬 Classifying verbs...")
    classifications = []
    
    for i, entry in enumerate(verb_entries, 1):
        if i % 100 == 0:
            print(f"   Processing {i}/{len(verb_entries)}...")
        
        classification = classify_verb_from_word_frequencies(
            entry,
            dictionary_lookup,
            VERB_LEXICON
        )
        
        if classification:
            classifications.append(classification)
    
    print(f"   ✅ Classified {len(classifications)} verbs")
    
    # Step 4: Generate SQL
    print("\n📝 Generating SQL updates...")
    generate_sql_updates(classifications)
    
    print("\n✅ Done!")
    print(f"\n📋 Next steps:")
    print(f"   1. Review cloudflare/populate-verb-classifications.sql")
    print(f"   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/populate-verb-classifications.sql")
    print(f"   3. Verify updates in Cloudflare D1 Studio")

if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Script to refresh LingDocs POS map from pashto-dictionary

This script:
1. Reads LingDocs dictionary data (from full_dictionary_enriched.json or fetches from storage)
2. Extracts POS mappings for each lemma
3. Merges with D1 metadata (future: query D1 for additional POS info)
4. Writes to app/data/lingdocs_pos_map.json

Usage: python3 scripts/refresh_lingdocs_pos.py
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Set
from collections import defaultdict

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# POS mapping from LingDocs format to our enum
POS_MAPPING = {
    'v': 'verb',
    'v.': 'verb',
    'verb': 'verb',
    'n': 'noun',
    'n.': 'noun',
    'noun': 'noun',
    'adj': 'adjective',
    'adj.': 'adjective',
    'adjective': 'adjective',
    'adv': 'adverb',
    'adv.': 'adverb',
    'adverb': 'adverb',
    'prep': 'preposition',
    'prep.': 'preposition',
    'preposition': 'preposition',
    'pron': 'pronoun',
    'pron.': 'pronoun',
    'pronoun': 'pronoun',
    'phrase': 'phrase',
    'phr': 'phrase',
    'phr.': 'phrase',
}

def normalize_pos(pos_label: Optional[str]) -> List[str]:
    """Normalize LingDocs POS label to our POS enum."""
    if not pos_label:
        return ['other']
    
    pos_label = pos_label.lower().strip()
    
    # Handle compound POS like "v. trans." or "n. m.f"
    if '.' in pos_label:
        parts = pos_label.split('.')
        pos_label = parts[0].strip()
    
    # Map to our enum
    if pos_label in POS_MAPPING:
        return [POS_MAPPING[pos_label]]
    
    # Try partial matches
    for key, value in POS_MAPPING.items():
        if pos_label.startswith(key):
            return [value]
    
    return ['other']

def extract_transitivity(pos_label: Optional[str]) -> Optional[str]:
    """Extract transitivity from POS label."""
    if not pos_label:
        return None
    
    pos_label = pos_label.lower()
    if 'trans' in pos_label or 'trans.' in pos_label:
        return 'transitive'
    elif 'intrans' in pos_label or 'intrans.' in pos_label:
        return 'intransitive'
    return None

def extract_verb_type(pos_label: Optional[str], entry: Dict) -> Optional[str]:
    """Extract verb type (stative/dynamic/compound) from entry."""
    if not pos_label or 'v' not in pos_label.lower():
        return None
    
    pos_label = pos_label.lower()
    if 'stat' in pos_label or 'stative' in pos_label:
        return 'stative'
    elif 'dyn' in pos_label or 'dynamic' in pos_label:
        return 'dynamic'
    elif 'comp' in pos_label or 'compound' in pos_label:
        return 'compound'
    
    # Check for compound verbs (has psp/ssp stems)
    if entry.get('psp') or entry.get('ssp'):
        return 'compound'
    
    return None

def extract_gender(pos_label: Optional[str], entry: Dict) -> Optional[str]:
    """Extract gender from POS label or entry."""
    if not pos_label:
        return None
    
    pos_label = pos_label.lower()
    
    # Check POS label
    if 'm.f' in pos_label or 'mf' in pos_label:
        return 'both'
    elif 'm.' in pos_label or 'm ' in pos_label:
        return 'masculine'
    elif 'f.' in pos_label or 'f ' in pos_label:
        return 'feminine'
    
    # Check entry gender field
    gender = entry.get('gender')
    if gender:
        return gender.lower() if isinstance(gender, str) else None
    
    return None

def load_dictionary() -> List[Dict]:
    """Load dictionary entries from file."""
    possible_paths = [
        PROJECT_ROOT / 'full_dictionary_enriched.json',
        PROJECT_ROOT / 'full_dictionary.json',
        PROJECT_ROOT / 'public' / 'full_dictionary_enriched.json',
    ]
    
    for path in possible_paths:
        if path.exists():
            print(f"📚 Found dictionary at: {path}")
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, dict):
                return data.get('entries', [])
            elif isinstance(data, list):
                return data
    
    print("⚠️  Dictionary file not found. Attempting to fetch from storage...")
    # TODO: Add fetch logic if needed
    return []

def build_pos_map(entries: List[Dict]) -> Dict:
    """Build POS map from dictionary entries."""
    pos_map: Dict[str, Dict] = {}
    
    for entry in entries:
        pashto = entry.get('p', '').strip()
        if not pashto:
            continue
        
        pos_label = entry.get('c') or entry.get('c_norm') or entry.get('pos')
        pos_array = normalize_pos(pos_label)
        
        # Build metadata
        metadata = {
            'pos': pos_array,
            'source': 'lingdocs',
        }
        
        # Add transitivity
        transitivity = extract_transitivity(pos_label)
        if transitivity:
            metadata['transitivity'] = transitivity
        
        # Add verb type
        verb_type = extract_verb_type(pos_label, entry)
        if verb_type:
            metadata['verbType'] = verb_type
        
        # Add gender
        gender = extract_gender(pos_label, entry)
        if gender:
            metadata['gender'] = gender
        
        # Add LingDocs ID (romanized form)
        if entry.get('f'):
            metadata['lingdocsId'] = entry.get('f').split(',')[0].strip() if isinstance(entry.get('f'), str) else None
        
        # Merge with existing entry if lemma already exists
        if pashto in pos_map:
            existing = pos_map[pashto]
            # Merge POS arrays
            merged_pos = list(set(existing['pos'] + pos_array))
            pos_map[pashto] = {
                **existing,
                **metadata,
                'pos': merged_pos,
            }
        else:
            pos_map[pashto] = metadata
    
    return pos_map

def main():
    print("🔄 Refreshing LingDocs POS map...")
    
    try:
        # Load dictionary entries
        entries = load_dictionary()
        if not entries:
            print("❌ No dictionary entries found")
            sys.exit(1)
        
        print(f"✅ Loaded {len(entries)} dictionary entries")
        
        # Build POS map
        pos_map = build_pos_map(entries)
        print(f"✅ Built POS map with {len(pos_map)} lemmas")
        
        # Ensure data directory exists
        data_dir = PROJECT_ROOT / 'app' / 'data'
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Write to file
        output_path = data_dir / 'lingdocs_pos_map.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(pos_map, f, indent=2, ensure_ascii=False)
        print(f"✅ Written POS map to: {output_path}")
        
        # Print summary
        pos_counts = defaultdict(int)
        for entry in pos_map.values():
            for pos in entry['pos']:
                pos_counts[pos] += 1
        
        print('\n📊 POS Summary:')
        for pos, count in sorted(pos_counts.items()):
            print(f"  {pos}: {count}")
        
        print(f"\n✅ POS map refresh complete!")
        
    except Exception as error:
        print(f"❌ Error refreshing POS map: {error}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()


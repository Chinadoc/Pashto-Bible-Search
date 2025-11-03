#!/usr/bin/env python3
"""
Enhanced Verb Classifier (LingDocs-inspired)
Ports the getVerbInfo logic from LingDocs pashto-inflector to Python

This module provides comprehensive verb classification:
- Irregular verb detection
- Verb type classification (simple, stative compound, dynamic compound)
- Transitivity detection
- Stem/root extraction with intelligent fallbacks
- Complement handling for compounds
"""

import json
import os
from typing import Dict, Any, Optional, List, Tuple
from pathlib import Path

# Load irregular verbs and dictionary
APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IRREGULAR_VERBS_PATH = os.path.join(APP_ROOT, 'irregular_verbs.json')

def load_irregular_verbs() -> Dict[str, Any]:
    """Load irregular verbs from JSON"""
    try:
        if os.path.exists(IRREGULAR_VERBS_PATH):
            with open(IRREGULAR_VERBS_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception:
        pass
    return {}

IRREGULAR_VERBS = load_irregular_verbs()

def get_transitivity(entry: Dict[str, Any]) -> str:
    """Get transitivity from dictionary entry POS tag"""
    pos = entry.get('pos', '') or entry.get('c', '') or ''
    
    if not pos:
        return 'transitive'  # Default
    
    pos_lower = pos.lower()
    
    if 'gramm. trans.' in pos_lower or 'grammatically transitive' in pos_lower:
        return 'grammatically_transitive'
    if 'intrans.' in pos_lower or 'intransitive' in pos_lower:
        return 'intransitive'
    
    return 'transitive'

def get_verb_type(entry: Dict[str, Any]) -> str:
    """Get verb type from dictionary entry POS tag"""
    pos = entry.get('pos', '') or entry.get('c', '') or ''
    
    if not pos:
        return 'simple'
    
    pos_lower = pos.lower()
    
    # Check for compound types
    if 'gen. stat. comp.' in pos_lower or 'generative stative compound' in pos_lower:
        return 'generative_stative_compound'
    if 'stat. comp.' in pos_lower or 'stative compound' in pos_lower:
        return 'stative_compound'
    if 'dyn. comp.' in pos_lower or 'dynamic compound' in pos_lower:
        return 'dynamic_compound'
    if 'dyn./stat. comp.' in pos_lower or 'dynamic or stative compound' in pos_lower:
        return 'dynamic_or_stative_compound'
    if 'gen. stat./dyn. comp.' in pos_lower:
        return 'dynamic_or_generative_stative_compound'
    if 'trans./gramm. trans.' in pos_lower:
        return 'transitive_or_grammatically_transitive_simple'
    
    return 'simple'

def check_irregular_verb(pashto_word: str) -> Optional[Dict[str, Any]]:
    """Check if verb is irregular"""
    if pashto_word in IRREGULAR_VERBS:
        return IRREGULAR_VERBS[pashto_word]
    
    # Also check normalized variants
    normalized = pashto_word.replace('ي', 'ی').replace('ى', 'ی')
    if normalized in IRREGULAR_VERBS:
        return IRREGULAR_VERBS[normalized]
    
    return None

def has_yul_ending(pashto_word: str) -> bool:
    """Check if verb ends with ی (yul ending)"""
    return pashto_word.endswith('ی') or pashto_word.endswith('ي')

def extract_complement_and_aux(entry: Dict[str, Any]) -> Tuple[Optional[str], Optional[str]]:
    """Extract complement and auxiliary verb for compound verbs"""
    pashto = entry.get('pashto', '') or entry.get('p', '')
    pos = entry.get('pos', '') or entry.get('c', '') or ''
    
    if not pashto or 'comp.' not in pos.lower():
        return None, None
    
    # Check for stative compounds (complement + کول/کېدل)
    if ' کول' in pashto:
        parts = pashto.split(' کول', 1)
        if len(parts) == 2:
            return parts[0].strip(), 'کول'
    
    if ' کېدل' in pashto:
        parts = pashto.split(' کېدل', 1)
        if len(parts) == 2:
            return parts[0].strip(), 'کېدل'
    
    # Check for squished stative compounds (complement + ول)
    if pashto.endswith('ول') and ' ' not in pashto:
        comp = pashto[:-2]
        return comp, 'کول'  # Squished form of complement + کول
    
    # Check for dynamic compounds (complement + وهل, etc.)
    dynamic_auxiliaries = ['وهل', 'کول', 'کېدل', 'اخستل', 'اېستل', 'ورکول']
    for aux in dynamic_auxiliaries:
        if f' {aux}' in pashto:
            parts = pashto.split(f' {aux}', 1)
            if len(parts) == 2:
                return parts[0].strip(), aux
    
    return None, None

def get_verb_info(entry: Dict[str, Any], complement_entry: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Get comprehensive verb information (Python port of LingDocs getVerbInfo)
    
    Args:
        entry: Dictionary entry for the verb
        complement_entry: Dictionary entry for complement (if compound verb)
    
    Returns:
        VerbInfo dictionary with all classification metadata
    """
    pashto = entry.get('pashto', '') or entry.get('p', '')
    
    if not pashto:
        return {}
    
    # Check for irregular verb first
    irregular = check_irregular_verb(pashto)
    if irregular:
        return {
            'pashto': pashto,
            'type': 'irregular',
            'irregular_spec': irregular,
            'transitivity': get_transitivity(entry),
            'yul_ending': has_yul_ending(pashto),
        }
    
    # Get verb type and transitivity
    verb_type = get_verb_type(entry)
    transitivity = get_transitivity(entry)
    
    # Extract stems/roots from dictionary
    psp = entry.get('psp') or entry.get('present_stem') or ''  # Imperfective stem
    ssp = entry.get('ssp') or entry.get('subjunctive_stem') or ''  # Perfective stem
    prp = entry.get('prp') or entry.get('perfective_root') or ''  # Perfective root
    pp = entry.get('pp') or entry.get('past_participle') or entry.get('tppp') or ''
    
    # Extract idiosyncratic 3rd person masculine singular
    tppp = entry.get('tppp') or ''  # Third person past participle Pashto
    tppf = entry.get('tppf') or ''  # Third person past participle phonetic
    
    # Extract complement and auxiliary for compounds
    complement_text, aux_verb = extract_complement_and_aux(entry)
    
    # Build verb info
    verb_info = {
        'pashto': pashto,
        'type': verb_type,
        'transitivity': transitivity,
        'yul_ending': has_yul_ending(pashto),
        'imperfective_stem': psp,
        'perfective_stem': ssp,
        'perfective_root': prp,
        'past_participle': pp,
        'romanization': entry.get('romanization') or entry.get('f', ''),
        'english': entry.get('english') or entry.get('e', ''),
        'pos': entry.get('pos') or entry.get('c', ''),
    }
    
    # Add idiosyncratic form if present
    if tppp and tppf:
        verb_info['idiosyncratic_3sg_masc'] = {
            'pashto': tppp,
            'phonetic': tppf,
        }
    
    # Add complement info for compounds
    if complement_text:
        verb_info['complement_text'] = complement_text
        verb_info['aux_verb'] = aux_verb
    
    return verb_info

def get_verb_info_from_word_frequencies(pashto_word: str, dictionary_entries: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Get verb info by searching dictionary entries for a word
    
    Args:
        pashto_word: The Pashto word to look up
        dictionary_entries: List of dictionary entries to search
    
    Returns:
        VerbInfo dictionary if found, None otherwise
    """
    # Normalize variants
    normalized = pashto_word.replace('ي', 'ی').replace('ى', 'ی')
    
    # Search for exact match
    for entry in dictionary_entries:
        entry_pashto = entry.get('pashto', '') or entry.get('p', '')
        if entry_pashto == pashto_word or entry_pashto == normalized:
            pos = entry.get('pos', '') or entry.get('c', '') or ''
            if 'verb' in pos.lower() or 'v.' in pos.lower():
                return get_verb_info(entry)
    
    return None

if __name__ == '__main__':
    # Test the classifier
    test_entry = {
        'pashto': 'نومېدل',
        'pos': 'v. intrans.',
        'psp': 'نومېږ',
        'ssp': 'ونوم',
        'prp': 'ونومېدل',
        'pp': 'نومېدلی',
        'f': 'noomedul',
        'e': 'to be called (a name)',
    }
    
    info = get_verb_info(test_entry)
    print(json.dumps(info, indent=2, ensure_ascii=False))


#!/usr/bin/env python3
"""
Analyze pronouns, minipronouns, directional pronouns, and split-head verbs

This script identifies:
1. Minipronouns (مې, دې, مو, یې) that can be inserted into split heads
2. Directional pronouns (را, در, ور) that attach to verbs
3. Split-head verb patterns (perfective verbs with split heads)
4. Phrases that should NOT be split because they're actually verb+pronoun combinations

Based on LingDocs grammar:
- https://grammar.lingdocs.com/pronouns/pronouns-mini/
- https://grammar.lingdocs.com/pronouns/pronouns-directional/
- https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads)
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional

APP_ROOT = Path(__file__).resolve().parent.parent

# Minipronouns (from LingDocs pronouns-mini.mdx)
MINIPRONOUNS = {
    'مې': ('me', '1st pers sing'),
    'دې': ('de', '2nd pers sing'),
    'مو': ('mU', '1st/2nd pers plur'),
    'یې': ('ye', '3rd pers'),
}

# Directional pronouns (from LingDocs pronouns-directional.mdx)
DIRECTIONAL_PRONOUNS = {
    'را': ('raa', '1st person - to me/us'),
    'در': ('dăr', '2nd person - to you'),
    'ور': ('wăr', '3rd person - to him/her/it/them'),
}

# Directional + postposition combinations (should stay together)
DIRECTIONAL_PHRASES = {
    'راته': ('raa-ta', 'to me/us'),
    'درته': ('dăr-ta', 'to you'),
    'ورته': ('wăr-ta', 'to him/her/them/it'),
    'راپسې': ('raa-pase', 'after me/us'),
}

# Regular pronouns that might appear before directional pronouns
REGULAR_PRONOUNS = {
    'ما': ('maa', 'me/I'),
    'تا': ('taa', 'you'),
    'ستا': ('staa', 'your'),
    'زما': ('zmaa', 'my'),
    'هغه': ('haghá', 'he/she/it'),
    'هغۀ': ('haghá', 'he/she/it'),
    'هغې': ('haghé', 'she/it'),
    'هغوی': ('haghwée', 'they'),
    'زۀ': ('zu', 'I'),
    'زه': ('zu', 'I'),
    'ته': ('tu', 'you'),
    'تاسو': ('taaso', 'you pl.'),
    'مونږ': ('moonG', 'we'),
    'موږ': ('mooG', 'we'),
}

# Postpositions (can attach to directional pronouns or regular words)
POSTPOSITIONS = ['ته', 'کې', 'دپاره', 'باندې', 'سره', 'سربېره']

# Prepositions
PREPOSITIONS = ['د', 'په', 'پر', 'له']

# Particles
PARTICLES = ['به', 'نه', 'هم']


def is_minipronoun(word: str) -> bool:
    """Check if word is a minipronoun"""
    return word in MINIPRONOUNS


def is_directional_pronoun(word: str) -> bool:
    """Check if word is a directional pronoun"""
    return word in DIRECTIONAL_PRONOUNS


def is_directional_phrase(phrase: str) -> bool:
    """Check if phrase is a directional pronoun + postposition"""
    return phrase in DIRECTIONAL_PHRASES


def is_regular_pronoun(word: str) -> bool:
    """Check if word is a regular pronoun"""
    return word in REGULAR_PRONOUNS


def detect_split_head_verb(phrase: str, verbs_lexicon: Dict) -> Optional[str]:
    """
    Detect if phrase is a verb with split head (perfective) + minipronoun/particle
    
    IMPORTANT: Split heads ONLY occur in the perfective aspect!
    - Perfective forms start with و (or وا for verbs starting with ا)
    - Imperfective forms do NOT have split heads
    
    Examples:
    - "مې ورکړ" = "مې" (minipronoun) + "ورکړ" (perfective verb "ورکول")
    - "نه وویل" = "نه" (negative) + "وویل" (perfective verb "ویل")
    - "یې وویل" = "یې" (minipronoun) + "وویل" (perfective verb "ویل")
    
    Based on: https://grammar.lingdocs.com/verbs/roots-and-stems/ (split heads only on perfective side)
    """
    words = phrase.split()
    
    if len(words) != 2:
        return None
    
    # Check if first word is minipronoun or particle
    first = words[0]
    second = words[1]
    
    if first in MINIPRONOUNS or first in ['نه', 'هم']:
        # CRITICAL: Only perfective verbs have split heads!
        # Perfective verbs start with و (or وا for verbs starting with ا)
        # Imperfective verbs do NOT start with و and do NOT have split heads
        
        # Check if second word is a perfective verb (starts with و or وا)
        if second.startswith('و') and len(second) > 1:
            # For verbs starting with ا, perfective head is وا
            # For other verbs, perfective head is و
            base_verb = second[1:]  # Remove و
            
            # Check if this base verb exists in verbs_lexicon
            if second in verbs_lexicon or base_verb in verbs_lexicon:
                return second  # Return the verb part
            
            # Also check common perfective verb endings
            # Perfective forms: past perfective, subjunctive, future perfective
            perfective_endings = ['ل', 'ړ', 'ړه', 'له', 'لې', 'ولي', 'ول', 'ولی', 'وړ', 'وړه', 'شو', 'شوه', 'شول']
            if any(second.endswith(ending) for ending in perfective_endings):
                return second
        
        # Also check for directional verbs with perfective forms
        # Directional verbs (را, در, ور) can have split heads in perfective aspect
        # Example from grammar: "را"نه "شي" (perfective subjunctive)
        # But they don't start with و - the directional prefix replaces it
        if second.startswith(('را', 'در', 'ور')):
            base_part = second[2:]  # Remove را/در/ور
            # Perfective directional verbs often end in specific ways
            # But be conservative - only mark if we're confident it's perfective
            perfective_directional_endings = ['ړ', 'ړه', 'کړ', 'کړه', 'شو', 'شوه', 'شي']
            if any(base_part.endswith(ending) for ending in perfective_directional_endings):
                # Additional check: does the full form exist in lexicon?
                if second in verbs_lexicon:
                    return second
    
    return None


def analyze_phrase(phrase: str, verbs_lexicon: Dict) -> Dict:
    """
    Analyze a phrase to determine:
    1. Is it a directional phrase? (keep together)
    2. Is it a split-head verb? (keep together)
    3. Is it pronoun + directional? (keep together or special handling)
    4. Should it be split?
    """
    words = phrase.split()
    
    if len(words) < 2:
        # Single word - check if it's a directional phrase
        if phrase in DIRECTIONAL_PHRASES:
            return {
                'type': 'directional_phrase',
                'action': 'keep',
                'description': 'Directional pronoun + postposition (single word)'
            }
        return {'type': 'single_word', 'action': 'keep'}
    
    # Check for split-head verb pattern FIRST (before other checks)
    split_head_verb = detect_split_head_verb(phrase, verbs_lexicon)
    if split_head_verb:
        return {
            'type': 'split_head_verb',
            'action': 'keep',
            'verb': split_head_verb,
            'description': f'Verb with split head: {phrase}'
        }
    
    # Check for directional phrases (راته, ورته, etc.) - single word versions
    if phrase in DIRECTIONAL_PHRASES:
        return {
            'type': 'directional_phrase',
            'action': 'keep',
            'description': 'Directional pronoun + postposition'
        }
    
    # Check for regular pronoun + directional pronoun (keep together)
    if len(words) == 2:
        word1, word2 = words
        if is_regular_pronoun(word1) and is_directional_pronoun(word2):
            return {
                'type': 'pronoun_directional',
                'action': 'keep',
                'description': f'Pronoun + directional: {word1} + {word2}'
            }
        
        # Check for directional + postposition (not in our DIRECTIONAL_PHRASES list)
        if is_directional_pronoun(word1) and word2 in POSTPOSITIONS:
            return {
                'type': 'directional_postposition',
                'action': 'keep',
                'description': f'Directional + postposition: {word1} + {word2}'
            }
        
        # Check for regular pronoun + postposition (should SPLIT)
        if is_regular_pronoun(word1) and word2 in POSTPOSITIONS:
            return {
                'type': 'pronoun_postposition',
                'action': 'split',
                'description': f'Pronoun + postposition: {word1} + {word2} (should split)'
            }
        
        # Check for preposition + pronoun/noun (should SPLIT)
        if word1 in PREPOSITIONS:
            return {
                'type': 'preposition_phrase',
                'action': 'split',
                'description': f'Preposition + word: {word1} + {word2} (should split)'
            }
        
        # Check for pronoun + particle (should SPLIT, e.g., "هغه به")
        if is_regular_pronoun(word1) and word2 in PARTICLES:
            return {
                'type': 'pronoun_particle',
                'action': 'split',
                'description': f'Pronoun + particle: {word1} + {word2} (should split)'
            }
    
    # Check for particle in phrase (should SPLIT)
    for particle in PARTICLES:
        if particle in words:
            idx = words.index(particle)
            if idx > 0:
                return {
                    'type': 'particle_phrase',
                    'action': 'split',
                    'description': f'Word + particle: {" ".join(words[:idx])} + {particle} (should split)'
                }
    
    # Default: check if should be split
    return {'type': 'unknown', 'action': 'analyze_further'}


def query_verbs_lexicon() -> Dict[str, bool]:
    """Load verbs_lexicon to check for verb forms"""
    query_sql = "SELECT verb_root FROM verbs_lexicon"
    cmd = ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query_sql, '--json']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                results = data[0].get('results', [])
                return {row['verb_root']: True for row in results}
    except:
        pass
    return {}


def main():
    print("🔍 Analyzing phrases for pronouns and split-head verbs...\n")
    
    # Load verbs lexicon
    print("📚 Loading verbs lexicon...")
    verbs_lexicon = query_verbs_lexicon()
    print(f"   ✅ Loaded {len(verbs_lexicon)} verbs")
    
    # Test phrases
    test_phrases = [
        'ما ته',          # Regular pronoun + postposition (should split? NO - directional)
        'ورته',           # Directional + postposition (keep together)
        'مې ورکړ',        # Minipronoun + verb (split-head, keep together)
        'نه وویل',        # Negative + verb (split-head, keep together)
        'د دې',           # Preposition + pronoun (should split)
        'هغه به',         # Pronoun + particle (should split)
        'راته',           # Directional phrase (keep together)
        'یې وویل',        # Minipronoun + verb (split-head, keep together)
    ]
    
    print("\n📊 Analyzing test phrases:\n")
    for phrase in test_phrases:
        analysis = analyze_phrase(phrase, verbs_lexicon)
        print(f"   '{phrase}'")
        print(f"      Type: {analysis['type']}")
        print(f"      Action: {analysis['action']}")
        if 'description' in analysis:
            print(f"      {analysis['description']}")
        print()
    
    print("📝 Generating updated splitting logic...")
    print("\n✅ Analysis complete!")


if __name__ == '__main__':
    main()


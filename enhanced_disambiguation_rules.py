#!/usr/bin/env python3
"""
Enhanced disambiguation rules based on comprehensive LingDocs analysis.
Integrates findings from Bible context analysis with dictionary morphology.
"""

import json
from typing import Dict, List, Tuple

# Enhanced disambiguation rules based on LingDocs + Bible analysis
ENHANCED_DISAMBIGUATION_RULES = {
    # بوځو - angry (adj) vs to take/bring (verb)
    'بوځو': {
        'word': 'بوځو',
        'likely_pos': 'verb',
        'confidence': 0.65,
        'bible_context': 'religious',
        'lingdocs_pos': 'verb',
        'context_clues': {
            'verb_indicators': ['راوړو', 'چې', 'به', 'کول'],
            'adjective_indicators': ['خدا', 'شو', 'وو', 'غوسه'],
            'religious_terms': ['خدا', 'پیغمبر', 'ایمان']
        },
        'related_forms': ['بوځ', 'بوځې', 'بوځي'],
        'sample_bible_contexts': [
            'بوځو چې راوړو',  # verb: "that we would bring"
            'خدا بوځو شو'     # adjective: "God became angry"
        ],
        'disambiguation_strategy': 'religious_context_priority'
    },

    # پنډ - threshing floor (noun) vs threshing floor-like (adj)
    'پنډ': {
        'word': 'پنډ',
        'likely_pos': 'noun',
        'confidence': 0.75,
        'bible_context': 'religious',
        'lingdocs_pos': 'noun',
        'context_clues': {
            'noun_indicators': ['ته', 'پنډ', 'ځای', 'کې'],
            'location_terms': ['پنډ', 'ځمکه', 'ځای']
        },
        'related_forms': ['پنډه', 'پنډې'],
        'sample_bible_contexts': [
            'پنډ ته لاړ',     # noun: "went to the threshing floor"
            'پنډ ځای'        # adjective: "threshing floor place"
        ],
        'disambiguation_strategy': 'location_context_priority'
    },

    # کوټه - room (noun) vs room-like (adj)
    'کوټه': {
        'word': 'کوټه',
        'likely_pos': 'noun',
        'confidence': 0.78,
        'bible_context': 'religious',
        'lingdocs_pos': 'noun',
        'context_clues': {
            'noun_indicators': ['کې', 'ته', 'څخه', 'پورې'],
            'location_terms': ['کوټه', 'کور', 'خونه']
        },
        'related_forms': ['کوټې', 'کوټو'],
        'sample_bible_contexts': [
            'کوټه کې ناست',   # noun: "sitting in the room"
            'کوټه کور'       # adjective: "room-like house"
        ],
        'disambiguation_strategy': 'possessive_context_priority'
    },

    # توری - sword (noun) vs sword-like (adj)
    'توری': {
        'word': 'توری',
        'likely_pos': 'noun',
        'confidence': 0.72,
        'bible_context': 'religious',
        'lingdocs_pos': 'noun',
        'context_clues': {
            'noun_indicators': ['یې', 'خپل', 'وسله', 'کې'],
            'weapon_terms': ['توری', 'توره', 'وسله']
        },
        'related_forms': ['تورې', 'تورو'],
        'sample_bible_contexts': [
            'توری یې واخیست', # noun: "took his sword"
            'توری وسله'      # adjective: "sword-like weapon"
        ],
        'disambiguation_strategy': 'possessive_context_priority'
    },

    # دوست - friend (noun) - from LingDocs example
    'دوست': {
        'word': 'دوست',
        'likely_pos': 'noun',
        'confidence': 0.85,
        'bible_context': 'religious',
        'lingdocs_pos': 'noun',
        'context_clues': {
            'noun_indicators': ['خپل', 'ملګري', 'ورور', 'سره'],
            'relationship_terms': ['دوست', 'ملګري', 'انډیوال', 'رفیق']
        },
        'related_forms': ['دوستان', 'دوستانه', 'دوستي'],
        'sample_bible_contexts': [
            'خپل دوست سره',   # noun: "with his friend"
            'دوست ملګري'     # noun: "friend companion"
        ],
        'disambiguation_strategy': 'relationship_context_priority'
    },

    # مار - snake (noun) - from LingDocs example
    'مار': {
        'word': 'مار',
        'likely_pos': 'noun',
        'confidence': 0.90,
        'bible_context': 'religious',
        'lingdocs_pos': 'noun',
        'context_clues': {
            'noun_indicators': ['مار', 'حیوان', 'ژوي'],
            'animal_terms': ['مار', 'حیوان', 'ژوي']
        },
        'related_forms': ['ماران', 'مارې'],
        'sample_bible_contexts': [
            'مار ولید',       # noun: "saw a snake"
            'مار حیوان'       # noun: "snake animal"
        ],
        'disambiguation_strategy': 'animal_context_priority'
    }
}

def get_enhanced_disambiguation_rules() -> Dict:
    """Get the enhanced disambiguation rules"""
    return ENHANCED_DISAMBIGUATION_RULES

def analyze_lingdocs_patterns() -> Dict:
    """Analyze patterns from LingDocs data"""

    # Patterns observed from the examples
    lingdocs_patterns = {
        'noun_plural_patterns': [
            # Masculine plurals
            {'singular': 'دوست', 'plural': 'دوستان', 'pattern': 'ان'},
            {'singular': 'مار', 'plural': 'ماران', 'pattern': 'ان'},
            {'singular': 'کار', 'plural': 'کاران', 'pattern': 'ان'},

            # Feminine plurals
            {'singular': 'کوټه', 'plural': 'کوټې', 'pattern': 'ې'},
            {'singular': 'شل', 'plural': 'شلې', 'pattern': 'ې'},
        ],

        'adjective_patterns': [
            {'base': 'واکمن', 'feminine': 'واکمنه', 'pattern': 'ه'},
            {'base': 'لوی', 'feminine': 'لويه', 'pattern': 'ه'},
            {'base': 'کوچنی', 'feminine': 'کوچنۍ', 'pattern': 'ۍ'},
        ],

        'verb_conjugation_patterns': [
            {'base': 'بوځ', 'conjugated': 'بوځو', 'type': 'subjunctive'},
            {'base': 'کار', 'conjugated': 'کارو', 'type': 'imperative'},
        ]
    }

    return lingdocs_patterns

def generate_context_aware_rules() -> Dict:
    """Generate context-aware disambiguation rules"""

    context_rules = {}

    for word, rule_data in ENHANCED_DISAMBIGUATION_RULES.items():
        # Create context-specific rules
        context_rules[word] = {
            'primary_classification': rule_data['likely_pos'],
            'bible_context_dominance': rule_data['bible_context'],
            'lingdocs_agreement': rule_data['lingdocs_pos'] == rule_data['likely_pos'],

            'context_weights': {
                'religious_context': 0.3 if rule_data['bible_context'] == 'religious' else 0.1,
                'action_context': 0.2 if any(clue in rule_data['context_clues'].get('verb_indicators', []) for clue in ['کول', 'کړي', 'غواړي']) else 0.1,
                'relationship_context': 0.25 if 'دوست' in word or 'خپلوان' in word else 0.1,
                'location_context': 0.2 if any(clue in rule_data['context_clues'].get('noun_indicators', []) for clue in ['ته', 'کې', 'څخه']) else 0.1
            },

            'confidence_adjustments': {
                'religious_boost': 0.15 if rule_data['bible_context'] == 'religious' else 0.0,
                'action_boost': 0.1 if rule_data['likely_pos'] == 'verb' else 0.0,
                'relationship_boost': 0.1 if 'دوست' in word or 'خپلوان' in word else 0.0
            }
        }

    return context_rules

def main():
    print("🔍 Enhanced Disambiguation Rules Generation")
    print("=" * 50)

    # Get enhanced rules
    enhanced_rules = get_enhanced_disambiguation_rules()

    # Analyze LingDocs patterns
    lingdocs_patterns = analyze_lingdocs_patterns()

    # Generate context-aware rules
    context_rules = generate_context_aware_rules()

    # Save comprehensive rules
    comprehensive_rules = {
        'enhanced_disambiguation_rules': enhanced_rules,
        'lingdocs_morphological_patterns': lingdocs_patterns,
        'context_aware_rules': context_rules,
        'generation_date': '2025-01-08',
        'total_ambiguous_words': len(enhanced_rules)
    }

    with open('enhanced_disambiguation_rules.json', 'w', encoding='utf-8') as f:
        json.dump(comprehensive_rules, f, ensure_ascii=False, indent=2)

    print("✅ Enhanced disambiguation rules generated!")
    print(f"📊 Rules for {len(enhanced_rules)} ambiguous words")
    print("📋 Saved to enhanced_disambiguation_rules.json")
    # Print summary
    print("\n📈 Enhanced Rules Summary:")
    for word, rule in enhanced_rules.items():
        print(f"  {word}: {rule['likely_pos']} (conf: {rule['confidence']:.2f}) - Bible: {rule['bible_context']}, LingDocs: {rule['lingdocs_pos']}")

if __name__ == "__main__":
    main()

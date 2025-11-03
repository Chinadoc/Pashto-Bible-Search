#!/usr/bin/env python3
"""
Analyze and fill missing romanization/pos data in word_frequencies

This script:
1. Finds entries missing romanization or pos
2. Attempts to match them with dictionary entries (exact match, variants, normalization)
3. For verb forms, uses verb_forms + verbs_lexicon to fill metadata
4. For nouns, uses nouns_lexicon
5. Identifies patterns in what's missing and why
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

APP_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP_ROOT))

DICTIONARY_PATHS = [
    APP_ROOT / 'docs/lexicon/full_dictionary_enriched.json',
    APP_ROOT / 'full_dictionary_enriched.json',
]


def _load_dictionary() -> List[Dict[str, Any]]:
    for path in DICTIONARY_PATHS:
        if path.exists():
            try:
                data = json.loads(path.read_text(encoding='utf-8'))
                if isinstance(data, dict) and 'entries' in data:
                    return data['entries']  # type: ignore
                if isinstance(data, list):
                    return data  # type: ignore
            except Exception as exc:
                print(f"   ⚠️  Failed to read {path}: {exc}")
    return []


def _normalize_pashto(text: str) -> str:
    """Normalize Pashto text for matching"""
    if not text:
        return ''
    # Remove diacritics/zabar/zer/peysh for matching
    # Keep basic structure
    return text.strip()


def _build_dictionary_index(entries: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Build a lookup index from dictionary"""
    index: Dict[str, Dict[str, Any]] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        pashto = entry.get('pashto') or entry.get('p') or ''
        if not pashto:
            continue
        # Store exact match
        if pashto not in index:
            index[pashto] = entry
        # Also store normalized version
        normalized = _normalize_pashto(pashto)
        if normalized and normalized != pashto:
            if normalized not in index:
                index[normalized] = entry
    
    return index


def _check_verb_forms(word: str) -> Optional[Dict[str, str]]:
    """Check if word exists in verb_forms and get base verb metadata"""
    # This would require a D1 query, but for now return None
    # In practice, we'll generate SQL that does the lookup
    return None


def analyze_missing_patterns() -> None:
    """Analyze what's missing and why"""
    print("📊 Analyzing missing data patterns\n")
    
    # Load dictionary
    print("📚 Loading dictionary...")
    entries = _load_dictionary()
    if not entries:
        print("   ❌ Could not load dictionary")
        return
    
    print(f"   ✅ Loaded {len(entries)} entries")
    
    # Build index
    print("\n🔍 Building dictionary index...")
    dict_index = _build_dictionary_index(entries)
    print(f"   ✅ Indexed {len(dict_index)} entries")
    
    # Query missing entries (sample)
    print("\n📋 Analyzing missing entries...")
    print("   (This would query D1 - showing sample patterns instead)\n")
    
    # Sample words from our earlier query
    sample_words = [
        "خُدای", "کړی", "وی", "هغۀ", "نی", "مالِک", "زۀ", 
        "بان", "وُو", "شوی", "وکړی", "څۀ", "چې په", "هغې",
        "او په", "ؤ", "کړې", "خپلو", "وفرمایيل", "وویيل"
    ]
    
    patterns = {
        'found_in_dict': [],
        'inflected_form': [],
        'multi_word': [],
        'pronoun_demonstrative': [],
        'has_base_verb': [],
        'not_found': []
    }
    
    for word in sample_words:
        exact_match = dict_index.get(word)
        normalized_match = dict_index.get(_normalize_pashto(word))
        
        if exact_match or normalized_match:
            patterns['found_in_dict'].append(word)
        elif ' ' in word:
            patterns['multi_word'].append(word)
        elif word in ['وی', 'هغۀ', 'نی', 'زۀ', 'هغې', 'څۀ', 'ؤ', 'وُو']:
            patterns['pronoun_demonstrative'].append(word)
        elif word.endswith('ی') or word.endswith('ې') or word.endswith('و'):
            patterns['inflected_form'].append(word)
        else:
            patterns['not_found'].append(word)
    
    print("Pattern Analysis:")
    print(f"  ✅ Found in dictionary: {len(patterns['found_in_dict'])}")
    for w in patterns['found_in_dict'][:5]:
        print(f"     - {w}")
    
    print(f"\n  📝 Inflected forms (need base lookup): {len(patterns['inflected_form'])}")
    for w in patterns['inflected_form'][:5]:
        print(f"     - {w}")
    
    print(f"\n  🔗 Multi-word phrases: {len(patterns['multi_word'])}")
    for w in patterns['multi_word']:
        print(f"     - {w}")
    
    print(f"\n  👤 Pronouns/demonstratives: {len(patterns['pronoun_demonstrative'])}")
    for w in patterns['pronoun_demonstrative'][:5]:
        print(f"     - {w}")
    
    print(f"\n  ❓ Not found: {len(patterns['not_found'])}")
    for w in patterns['not_found']:
        print(f"     - {w}")


def generate_fill_sql() -> None:
    """Generate SQL to fill missing data from various sources"""
    print("\n📝 Generating SQL to fill missing data...\n")
    
    sql_statements = []
    sql_statements.append('-- Fill missing romanization and pos from multiple sources')
    sql_statements.append('-- Priority: verb_forms+verbs_lexicon > nouns_lexicon > dictionary lookup')
    
    # 1. Fill from verbs_lexicon (via verb_forms for inflected forms)
    sql_statements.append('\n-- Fill verb forms via verb_forms -> verbs_lexicon')
    sql_statements.append("""
UPDATE word_frequencies
SET 
  romanization = (
    SELECT vl.romanization 
    FROM verb_forms vf
    JOIN verbs_lexicon vl ON vf.base_verb = vl.verb_root
    WHERE vf.form = word_frequencies.pashto_word
    LIMIT 1
  ),
  pos = 'verb'
WHERE (romanization IS NULL OR romanization = '')
  AND pashto_word IN (SELECT form FROM verb_forms);
""")
    
    # 2. Fill from nouns_lexicon
    sql_statements.append('\n-- Fill from nouns_lexicon')
    sql_statements.append("""
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, nl.romanized),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
FROM nouns_lexicon nl
WHERE word_frequencies.pashto_word = nl.pashto_word
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '');
""")
    
    # 3. Fill base verbs directly from verbs_lexicon
    sql_statements.append('\n-- Fill base verbs from verbs_lexicon')
    sql_statements.append("""
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, vl.romanization),
  pos = COALESCE(NULLIF(pos, ''), vl.pos)
FROM verbs_lexicon vl
WHERE word_frequencies.pashto_word = vl.verb_root
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '');
""")
    
    # 4. Fill inflected forms using base_verb (if already set)
    sql_statements.append('\n-- Fill inflected forms using existing base_verb')
    sql_statements.append("""
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, vl.romanization),
  pos = COALESCE(NULLIF(pos, ''), vl.pos)
FROM verbs_lexicon vl
WHERE word_frequencies.base_verb = vl.verb_root
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '');
""")
    
    # 5. Handle diacritic variants (match "خُدای" to "خدای" etc.)
    sql_statements.append('\n-- Fill diacritic variants (match common variants)')
    sql_statements.append("""
-- خُدای -> خدای
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, nl.romanized),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
FROM nouns_lexicon nl
WHERE nl.pashto_word = 'خدای'
  AND word_frequencies.pashto_word IN ('خُدای', 'خدای')
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '');

-- مالِک -> مالک
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, nl.romanized),
  pos = COALESCE(NULLIF(pos, ''), 'noun')
FROM nouns_lexicon nl
WHERE nl.pashto_word = 'مالک'
  AND word_frequencies.pashto_word IN ('مالِک', 'مالک')
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '');
""")
    
    # 6. Handle common pronouns/demonstratives manually
    sql_statements.append('\n-- Fill common pronouns/demonstratives')
    pronoun_mappings = [
        ("وی", "wee", "pronoun"),
        ("هغۀ", "haghá", "pronoun"),
        ("هغې", "haghé", "pronoun"),
        ("نی", "nee", "pronoun"),
        ("زۀ", "zu", "pronoun"),
        ("څۀ", "tsú", "pronoun"),
        ("ؤ", "oo", "pronoun"),
        ("وُو", "woo", "pronoun"),
        ("بان", "baan", "noun"),  # Common noun, might need dictionary check
    ]
    
    for pashto, rom, pos_type in pronoun_mappings:
        sql_statements.append(
            f"UPDATE word_frequencies SET romanization = '{rom}', pos = '{pos_type}' "
            f"WHERE pashto_word = '{pashto}' AND (romanization IS NULL OR romanization = '');"
        )
    
    # 7. Handle past tense verbs with و prefix (like وویيل, وفرمایيل)
    sql_statements.append('\n-- Fill past tense verbs (و prefix)')
    sql_statements.append("""
UPDATE word_frequencies
SET 
  romanization = COALESCE(romanization, vl.romanization),
  pos = COALESCE(NULLIF(pos, ''), vl.pos)
FROM verbs_lexicon vl
WHERE word_frequencies.pashto_word LIKE 'و' || vl.verb_root || '%'
  AND (word_frequencies.romanization IS NULL OR word_frequencies.romanization = '')
  AND word_frequencies.word_type = 'verb';
""")
    
    # Write SQL file
    output_path = APP_ROOT / 'cloudflare' / 'fill-missing-data.sql'
    output_path.write_text('\n'.join(sql_statements), encoding='utf-8')
    print(f"   ✅ Generated {output_path}")
    print(f"   📋 Next step: wrangler d1 execute pashto-bible-db --remote --file {output_path.relative_to(APP_ROOT)}")


def main():
    analyze_missing_patterns()
    generate_fill_sql()


if __name__ == '__main__':
    main()


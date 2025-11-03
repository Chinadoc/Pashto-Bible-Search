#!/usr/bin/env python3
"""
Analyze words with no_dictionary_match to identify compound biblical names

For words like "اب" and "ايل" that have no dictionary match:
1. Find verses containing these words
2. Check surrounding context
3. Determine if they're part of compound names (like اخى‌اب, حنن‌ايل)
4. Update database accordingly
"""

import json
import subprocess
import re
import sys

# Words to analyze (short words that might be part of compounds)
WORDS_TO_ANALYZE = [
    'اب', 'ايل', 'اخى', 'اِلى', 'اېل', 'عزر'
]

# Known compound patterns
COMPOUND_PATTERNS = {
    'اخى': ['اخى‌اب'],  # اخى + اب = Ahab
    'اب': ['اخى‌اب'],  # Part of Ahab
    'ايل': ['حنن‌ايل'],  # حنن + ايل = Hananeel
    'حنن': ['حنن‌ايل'],  # Part of Hananeel
    'اِلى': ['اِلى‌عالى'],  # اِلى + عالى = Elealeh
    'عالى': ['اِلى‌عالى'],  # Part of Elealeh
    'اېل': ['شلتى‌اېل'],  # شلتى + اېل = Shealtiel
    'شلتى': ['شلتى‌اېل'],  # Part of Shealtiel
}

def query_verses(pashto_word, limit=10):
    """Query D1 for verses containing a Pashto word"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, book, chapter, verse, text FROM verses_afghan2023 WHERE text LIKE '%{pashto_word}%' LIMIT {limit};" --json"""
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            data = json.loads(result.stdout)
            # Handle wrangler format: [{"results": [...], "success": true, ...}]
            if isinstance(data, list) and len(data) > 0:
                first_item = data[0]
                if isinstance(first_item, dict) and 'results' in first_item:
                    return first_item['results']
                elif isinstance(first_item, dict):
                    return [first_item]
            elif isinstance(data, dict):
                return data.get('results', [])
            return []
        else:
            print(f"   ⚠️  Error: {result.stderr[:200]}")
            return []
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
        return []

def find_compound_in_context(word, verse_text):
    """Check if word appears as part of a compound in the verse context"""
    # Look for zero-width non-joiner (U+200C) or zero-width joiner (U+200D)
    # These are used in Pashto to join words in compounds
    
    # Known compound patterns (exact matches)
    known_compounds = [
        'اخى‌اب',  # Ahab
        'حنن‌ايل',  # Hananeel
        'حنم‌ايل',  # Hananeel (variant)
        'اِلى‌عالى',  # Elealeh
        'شلتى‌اېل',  # Shealtiel
        'بيت‌ايل',  # Bethel
    ]
    
    compounds_found = []
    
    # First, check for exact known compound matches
    for compound in known_compounds:
        if compound in verse_text:
            if word in compound:
                compounds_found.append(compound)
    
    # Also check for patterns with zero-width joiners
    # Pattern: word + [non-joiner/joiner] + another word (but not common prepositions/verbs)
    common_prepositions = ['د', 'په', 'له', 'تر', 'پر', 'سره', 'باندې', 'کې', 'نه', 'ته', 'دپاره', 'لپاره']
    common_verbs = ['ورکړ', 'کړ', 'شو', 'دي', 'وو']
    
    patterns = [
        rf'{re.escape(word)}[\u200c\u200d\u00ad]+[^\s]+',  # word + joiner + other
        rf'[^\s]+[\u200c\u200d\u00ad]+{re.escape(word)}',  # other + joiner + word
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, verse_text)
        for match in matches:
            # Clean up the match
            cleaned = match.strip()
            if cleaned and cleaned != word:
                # Check if it's not just a prepositional phrase
                parts = re.split(r'[\u200c\u200d\u00ad\s]+', cleaned)
                if len(parts) >= 2:
                    # If second part is a common preposition or verb, skip it
                    if parts[1] not in common_prepositions and parts[1] not in common_verbs:
                        compounds_found.append(cleaned)
    
    return list(set(compounds_found))  # Remove duplicates

def analyze_word(word):
    """Analyze a word to see if it's part of compound names"""
    print(f'\n🔍 Analyzing: {word}')
    
    verses = query_verses(word, limit=15)
    
    if not verses:
        print(f'   ⚠️  No verses found')
        return None
    
    print(f'   Found {len(verses)} verses')
    
    # Check each verse for compound patterns
    compound_candidates = set()
    standalone_count = 0
    
    for verse in verses[:10]:  # Check first 10 verses
        text = verse.get('text', '')
        ref = verse.get('ref', '')
        
        # Find compounds in context
        compounds = find_compound_in_context(word, text)
        
        if compounds:
            for compound in compounds:
                compound_candidates.add(compound)
            print(f'   {ref}: Found compound patterns: {compounds[:3]}')
        else:
            # Check if word appears standalone (not part of compound)
            # Look for word boundaries (space, punctuation, or end of string)
            word_pattern = rf'\b{re.escape(word)}\b'
            if re.search(word_pattern, text):
                standalone_count += 1
                # Show context
                word_pos = text.find(word)
                if word_pos >= 0:
                    context_start = max(0, word_pos - 30)
                    context_end = min(len(text), word_pos + len(word) + 30)
                    context = text[context_start:context_end]
                    print(f'   {ref}: Standalone? ...{context}...')
    
    # Analyze results
    # Filter out false positives (prepositional phrases, verb phrases)
    real_compounds = []
    false_positives = []
    
    for compound in compound_candidates:
        # Check if it contains zero-width joiners (real compound indicator)
        has_joiner = '\u200c' in compound or '\u200d' in compound
        
        # Check if it's a known compound
        is_known = any(known in compound for known in [
            'اخى‌اب', 'حنن‌ايل', 'حنم‌ايل', 'اِلى‌عالى', 'شلتى‌اېل', 'بيت‌ايل'
        ])
        
        # Check if it's likely a prepositional phrase (word + common preposition)
        parts = re.split(r'[\u200c\u200d\u00ad\s]+', compound)
        if len(parts) >= 2:
            if parts[1] in ['د', 'په', 'له', 'تر', 'پر', 'سره', 'باندې', 'کې', 'نه', 'ته']:
                false_positives.append(compound)
                continue
        
        # Check if it's likely a verb phrase
        if 'ورکړ' in compound or 'کړ' in compound:
            false_positives.append(compound)
            continue
        
        if has_joiner or is_known:
            real_compounds.append(compound)
    
    if real_compounds:
        print(f'\n   ✅ Found {len(real_compounds)} real compound candidates:')
        for compound in sorted(real_compounds):
            print(f'      - {compound}')
        
        if false_positives:
            print(f'   ⚠️  Filtered out {len(false_positives)} false positives (prepositions/verbs)')
        
        # Check if this matches known compound patterns
        if word in COMPOUND_PATTERNS:
            known_compounds = COMPOUND_PATTERNS[word]
            for known in known_compounds:
                if any(known in c for c in real_compounds):
                    print(f'   ✅ Matches known compound: {known}')
                    return {
                        'word': word,
                        'is_part_of_compound': True,
                        'compound_forms': real_compounds,
                        'known_compound': known,
                        'standalone_count': standalone_count,
                        'false_positives': false_positives,
                    }
        
        return {
            'word': word,
            'is_part_of_compound': True,
            'compound_forms': real_compounds,
            'known_compound': None,
            'standalone_count': standalone_count,
            'false_positives': false_positives,
        }
    elif standalone_count > 0:
        print(f'\n   ⚠️  Appears standalone in {standalone_count} verses')
        return {
            'word': word,
            'is_part_of_compound': False,
            'compound_forms': [],
            'known_compound': None,
            'standalone_count': standalone_count,
        }
    else:
        print(f'\n   ❓ Uncertain - need more analysis')
        return None

def main():
    print('🔍 Analyzing words with no_dictionary_match for compound name patterns...\n')
    
    results = {}
    
    for word in WORDS_TO_ANALYZE:
        result = analyze_word(word)
        if result:
            results[word] = result
    
    print(f'\n\n📊 Summary:')
    print(f'   Analyzed {len(WORDS_TO_ANALYZE)} words')
    print(f'   Found {sum(1 for r in results.values() if r.get("is_part_of_compound"))} words that are part of compounds')
    
    # Generate SQL updates
    updates = []
    
    for word, result in results.items():
        if result.get('is_part_of_compound'):
            compound_forms = result.get('compound_forms', [])
            known_compound = result.get('known_compound')
            
            if known_compound:
                updates.append(f"-- {word} is part of compound: {known_compound}")
                updates.append(f"-- Update word_frequencies to mark as part of compound")
                updates.append(f"-- Note: May need to merge frequencies with compound form")
                # Clean compound name for SQL
                clean_compound = known_compound.replace(chr(0x200c), '').replace(chr(0x200d), '').replace("'", "''")
                clean_word = word.replace("'", "''")
                updates.append(f"UPDATE word_frequencies SET word_type = 'compound_part', base_word = '{clean_compound}', has_issues = 1, issue_flags = '[\"part_of_compound_name\"]' WHERE pashto_word = '{clean_word}';")
                updates.append('')
            elif compound_forms:
                # Use the most common compound form
                most_common = compound_forms[0] if compound_forms else None
                if most_common:
                    updates.append(f"-- {word} appears in compound forms: {', '.join(compound_forms[:3])}")
                    updates.append(f"-- Marking as compound part")
                    clean_word = word.replace("'", "''")
                    updates.append(f"UPDATE word_frequencies SET word_type = 'compound_part', has_issues = 1, issue_flags = '[\"part_of_compound_name\"]' WHERE pashto_word = '{clean_word}';")
                    updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/mark-compound-name-parts.sql'
    sql_content = [
        '-- Mark words that are parts of compound biblical names',
        '-- Generated by analyzing verse context',
        '',
        '-- Add word_type column if missing',
        "ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;",
        '',
        '-- Mark compound parts',
    ] + updates + [
        '',
        '-- Create index',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
    ]
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_content))
    
    # Write analysis results to JSON
    json_path = 'cloudflare/compound-name-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f'\n✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {json_path}\n')
    
    print('📋 Next steps:')
    print('   1. Review compound-name-analysis.json for detailed analysis')
    print('   2. Review and run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/mark-compound-name-parts.sql')
    print('   3. This will mark words as compound parts so they can be filtered/merged appropriately\n')

if __name__ == '__main__':
    main()


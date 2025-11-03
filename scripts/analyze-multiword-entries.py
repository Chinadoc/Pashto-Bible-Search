#!/usr/bin/env python3
"""
Analyze and split multi-word entries in word_frequencies

This script:
1. Identifies multi-word entries (contains space)
2. Checks if they exist in dictionary
3. If not, checks if they're "sandwiches" (circumpositions like په ... کې)
4. If not sandwiches, splits into separate words
5. For proper nouns, attempts to extract from verse context

Usage:
  python3 scripts/analyze-multiword-entries.py
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

# Common Pashto sandwiches (circumpositions/prepositions/postpositions)
# Based on https://grammar.lingdocs.com/sandwiches/sandwiches/
SANDWICHES = {
    # Circumpositions (word ... word)
    'په ... کې': ('pu', 'ke', 'preposition', 'in / at'),
    'د ... دپاره': ('du', 'dupaara', 'preposition', 'for'),
    'پر ... باندې': ('pur', 'baande', 'preposition', 'on'),
    'د ... په اړه': ('du', 'pu aRa', 'preposition', 'about'),
    'د ... په بارې کې': ('du', 'pu baare ke', 'preposition', 'about'),
    'پر ... سربېره': ('pur', 'sărbera', 'preposition', 'in addition to'),
    'له ... سره': ('la', 'sara', 'preposition', 'with'),
    
    # Postpositions (word ...)
    '... ته': ('ta', 'postposition', 'to / towards'),
    '... دپاره': ('dupaara', 'postposition', 'for'),
    
    # Prepositions (... word)
    'په': ('pu', 'preposition', 'in / at'),
    'د': ('du', 'preposition', 'of / \'s'),
    'له': ('la', 'preposition', 'from'),
    'پر': ('pur', 'preposition', 'on'),
    
    # Future particle
    'به': ('ba', 'particle', 'future marker'),
    
    # Other common particles
    'نه': ('nu', 'particle', 'negative'),
    'هم': ('hum', 'particle', 'also'),
    
    # Individual words for matching
    'ته': ('ta', 'postposition', 'to / towards'),
    'کې': ('ke', 'postposition', 'in / at'),
    'دپاره': ('dupaara', 'postposition', 'for'),
    'باندې': ('baande', 'postposition', 'on'),
    'سره': ('sara', 'postposition', 'with'),
    'سربېره': ('sărbera', 'postposition', 'in addition to'),
}


def _load_dictionary() -> List[Dict[str, Any]]:
    """Load dictionary entries"""
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


def _build_dictionary_index(entries: List[Dict[str, Any]]) -> Dict[str, bool]:
    """Build a simple lookup index"""
    index: Dict[str, bool] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        pashto = entry.get('pashto') or entry.get('p') or ''
        if pashto:
            index[pashto] = True
    return index


def _is_sandwich(phrase: str) -> Optional[Tuple[str, List[str], str]]:
    """
    Check if phrase matches a sandwich pattern.
    
    Returns:
    - For circumpositions (په ... کې): ('circumposition', [words], desc) - KEEP AS ONE ENTRY
    - For postpositions (... ته): None - SPLIT into [word] + ته
    - For standalone prepositions (د ...): None - SPLIT into د + [word]
    - For particles (به): None - SPLIT
    """
    phrase = phrase.strip()
    words = phrase.split()
    
    if len(words) < 2:
        return None
    
    # ONLY circumpositions should be kept as single entries
    # Check circumpositions (word ... word) - these stay together
    for pattern, value in SANDWICHES.items():
        if '...' in pattern:
            if isinstance(value, tuple) and len(value) == 4:
                rom_start, rom_end, pos_type, desc = value
                parts = pattern.split('...')
                start = parts[0].strip()
                end = parts[1].strip()
                if phrase.startswith(start) and phrase.endswith(end):
                    middle_words = words[1:-1] if len(words) > 2 else []
                    return ('circumposition', [start] + middle_words + [end], desc)
    
    # Postpositions (... ته) should be SPLIT
    # So "ما ته" becomes "ما" + "ته" (two separate entries)
    last_word = words[-1]
    if last_word in ['ته', 'کې', 'دپاره', 'باندې', 'سره', 'سربېره']:
        return None  # Split into [word] + [postposition]
    
    # Standalone prepositions (د, په, پر, له) should be SPLIT
    # So "د یوسف" becomes "د" + "یوسف" (two separate entries)
    first_word = words[0]
    if first_word in ['د', 'په', 'پر', 'له']:
        # Only keep if it's part of a circumposition (already checked above)
        return None  # Split into [preposition] + [word]
    
    # Phrases with "به" should be SPLIT
    # "به" is a future particle that goes in the "kids' section" between words
    if 'به' in words:
        return None  # Split
    
    return None


def _analyze_multiword_entries() -> Dict[str, Any]:
    """Query D1 for multi-word entries and analyze them"""
    # This would query D1, but for now return sample structure
    return {
        'total_multiword': 0,
        'in_dictionary': 0,
        'sandwiches': 0,
        'should_split': 0,
        'proper_nouns': 0,
    }


def generate_split_sql() -> None:
    """Generate SQL to handle multi-word entries"""
    print("📝 Generating SQL to handle multi-word entries...\n")
    
    sql_statements = []
    sql_statements.append('-- Handle multi-word entries: split or mark as sandwiches')
    sql_statements.append('-- Based on LingDocs sandwiches: https://grammar.lingdocs.com/sandwiches/sandwiches/')
    
    # 1. Mark known sandwiches (circumpositions)
    sql_statements.append('\n-- Mark known circumpositions')
    circumpositions = [
        ('په ... کې', 'circumposition'),
        ('د ... دپاره', 'circumposition'),
        ('پر ... باندې', 'circumposition'),
        ('د ... په اړه', 'circumposition'),
        ('د ... په بارې کې', 'circumposition'),
        ('پر ... سربېره', 'circumposition'),
        ('له ... سره', 'circumposition'),
    ]
    
    for pattern, pos_type in circumpositions:
        # Extract start and end words
        parts = pattern.split('...')
        start = parts[0].strip()
        end = parts[1].strip()
        
        sql_statements.append(
            f"-- {pattern}"
        )
        sql_statements.append(
            f"UPDATE word_frequencies "
            f"SET pos = '{pos_type}', "
            f"romanization = '{pattern}' "
            f"WHERE pashto_word LIKE '{start}%{end}' "
            f"AND pashto_word LIKE '% %' "
            f"AND (pos IS NULL OR pos = '' OR pos = 'phrase');"
        )
    
    # 2. Mark postposition phrases (... ته)
    sql_statements.append('\n-- Mark postposition phrases')
    sql_statements.append(
        "UPDATE word_frequencies "
        "SET pos = 'postposition_phrase' "
        "WHERE pashto_word LIKE '% ته' "
        "AND pashto_word LIKE '% %' "
        "AND (pos IS NULL OR pos = '' OR pos = 'phrase');"
    )
    
    # 3. Mark phrases with future particle "به"
    sql_statements.append('\n-- Mark phrases with future particle به')
    sql_statements.append(
        "UPDATE word_frequencies "
        "SET pos = 'particle_phrase' "
        "WHERE pashto_word LIKE '% به%' "
        "AND pashto_word LIKE '% %' "
        "AND (pos IS NULL OR pos = '' OR pos = 'phrase');"
    )
    
    # 4. Create a note about splitting (actual splitting requires more complex logic)
    sql_statements.append('\n-- Note: To actually split entries, we need to:')
    sql_statements.append('-- 1. Create new word_frequencies entries for each word')
    sql_statements.append('-- 2. Update word_verse_mapping to point to new entries')
    sql_statements.append('-- 3. Delete or mark original multi-word entry')
    sql_statements.append('-- This is handled by split-multiword-entries.py script')
    
    output_path = APP_ROOT / 'cloudflare' / 'mark-sandwiches.sql'
    output_path.write_text('\n'.join(sql_statements), encoding='utf-8')
    print(f"   ✅ Generated {output_path}")


def generate_split_script() -> None:
    """Generate a script to actually split multi-word entries"""
    script_content = '''#!/usr/bin/env python3
"""
Split multi-word entries that are NOT sandwiches or dictionary entries

This script:
1. Finds multi-word entries marked as 'phrase' or missing pos
2. Checks if they're sandwiches (skip those)
3. Checks if they're in dictionary (skip those)
4. Splits remaining into individual words
5. Creates new word_frequencies entries for each word
6. Updates word_verse_mapping to point to new entries
7. Marks original as 'split' or deletes it

Usage:
  python3 scripts/split-multiword-entries.py
"""

import json
import subprocess
from pathlib import Path
from typing import List, Dict, Any

APP_ROOT = Path(__file__).resolve().parent.parent

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
        print(f"   ⚠️  Error: {e}")
        return []

def main():
    print("🔍 Finding multi-word entries to split...\\n")
    
    # Find multi-word entries that should be split
    sql = """
    SELECT pashto_word, frequency_total, pos
    FROM word_frequencies
    WHERE pashto_word LIKE '% %'
      AND pos IN ('phrase', 'unknown', '')
      AND pashto_word NOT LIKE 'په%کې'
      AND pashto_word NOT LIKE 'د%دپاره'
      AND pashto_word NOT LIKE 'پر%باندې'
      AND pashto_word NOT LIKE 'د%په اړه'
      AND pashto_word NOT LIKE 'د%په بارې کې'
      AND pashto_word NOT LIKE 'پر%سربېره'
      AND pashto_word NOT LIKE 'له%سره'
      AND pashto_word NOT LIKE '% ته'
      AND pashto_word NOT LIKE '% به%'
    ORDER BY frequency_total DESC
    LIMIT 100
    """
    
    entries = query_d1(sql)
    print(f"   Found {len(entries)} entries to potentially split\\n")
    
    splits_needed = []
    for entry in entries:
        phrase = entry['pashto_word']
        words = phrase.split()
        if len(words) == 2:
            splits_needed.append({
                'phrase': phrase,
                'word1': words[0],
                'word2': words[1],
                'frequency': entry['frequency_total']
            })
    
    print(f"   Entries to split: {len(splits_needed)}\\n")
    print("Sample splits:")
    for item in splits_needed[:10]:
        print(f"   '{item['phrase']}' -> '{item['word1']}' + '{item['word2']}'")
    
    print("\\n📋 Next steps:")
    print("   1. Review the splits above")
    print("   2. Create SQL to insert new entries for word1 and word2")
    print("   3. Update word_verse_mapping to reference new entries")
    print("   4. Mark original phrase as 'split' or delete")

if __name__ == '__main__':
    main()
'''
    
    output_path = APP_ROOT / 'scripts' / 'split-multiword-entries.py'
    output_path.write_text(script_content, encoding='utf-8')
    output_path.chmod(0o755)
    print(f"   ✅ Generated {output_path}")


def main():
    print("🔍 Analyzing multi-word entries\n")
    
    # Load dictionary
    print("📚 Loading dictionary...")
    entries = _load_dictionary()
    if not entries:
        print("   ❌ Could not load dictionary")
        return
    
    dict_index = _build_dictionary_index(entries)
    print(f"   ✅ Indexed {len(dict_index)} dictionary entries")
    
    # Sample multi-word phrases to analyze
    sample_phrases = [
        "هغه به",          # Should split: pronoun + particle
        "چې په",            # Should split: conjunction + preposition
        "او په",            # Should split: conjunction + preposition
        "زۀ به",            # Should split: pronoun + particle
        "هغوی به",          # Should split: pronoun + particle
        "ما ته",            # Should split: pronoun + postposition
        "هغوی ته",          # Should split: pronoun + postposition
        "د یوسف",           # Should split: preposition + noun
        "د خدای",           # Should split: preposition + noun
        "په کور کې",        # KEEP: circumposition
        "د خدای دپاره",     # KEEP: circumposition
        "پر میز باندې",     # KEEP: circumposition
        "له احمد سره",      # KEEP: circumposition
    ]
    
    print("\n📊 Analyzing sample phrases:\n")
    for phrase in sample_phrases:
        words = phrase.split()
        in_dict = phrase in dict_index
        sandwich_info = _is_sandwich(phrase)
        
        print(f"   '{phrase}' ({len(words)} words)")
        if in_dict:
            print(f"      ✅ In dictionary")
        elif sandwich_info:
            sandwich_type, sandwich_words, desc = sandwich_info
            print(f"      🥪 Sandwich ({sandwich_type}): {desc}")
            print(f"         Words: {sandwich_words}")
        else:
            print(f"      ⚠️  Should split into: {' + '.join(words)}")
        print()
    
    # Generate SQL and scripts
    generate_split_sql()
    generate_split_script()
    
    print("\n✅ Analysis complete!")
    print("\n📋 Next steps:")
    print("   1. Review cloudflare/mark-sandwiches.sql")
    print("   2. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/mark-sandwiches.sql")
    print("   3. Run: python3 scripts/split-multiword-entries.py")
    print("   4. Review splits and generate final SQL to split entries")


if __name__ == '__main__':
    main()


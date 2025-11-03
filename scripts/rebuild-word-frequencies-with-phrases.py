#!/usr/bin/env python3
"""
Rebuild word_frequencies from verse text with phrase awareness

This script:
1. Loads verses directly from the database
2. Identifies adpositional phrases (circumpositions) in context
3. Cleans punctuation from forms
4. Builds word_frequencies with proper phrase detection
5. Generates SQL to update the database

Usage:
  python3 scripts/rebuild-word-frequencies-with-phrases.py
"""

import json
import subprocess
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import defaultdict

APP_ROOT = Path(__file__).resolve().parent.parent

# Circumposition patterns (keep as single entries)
CIRCUMPOSITIONS = [
    (r'په\s+(\S+)\s+کې', 'په ... کې'),
    (r'د\s+(\S+)\s+دپاره', 'د ... دپاره'),
    (r'پر\s+(\S+)\s+باندې', 'پر ... باندې'),
    (r'د\s+(\S+)\s+په\s+اړه', 'د ... په اړه'),
    (r'د\s+(\S+)\s+په\s+بارې\s+کې', 'د ... په بارې کې'),
    (r'پر\s+(\S+)\s+سربېره', 'پر ... سربېره'),
    (r'له\s+(\S+)\s+سره', 'له ... سره'),
]

# Postpositions and prepositions (split)
POSTPOSITIONS = ['ته', 'کې', 'دپاره', 'باندې', 'سره', 'سربېره']
PREPOSITIONS = ['د', 'په', 'پر', 'له']
PARTICLES = ['به', 'نه', 'هم']


def query_d1(sql_query: str) -> List[Dict]:
    """Query D1 database"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="{sql_query}" --json"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', timeout=60)
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


def clean_punctuation(text: str) -> str:
    """Remove punctuation from Pashto text"""
    if not text:
        return text
    # Remove common punctuation marks
    punctuation = '.,;:!?()[]{}،۔'
    for p in punctuation:
        text = text.replace(p, '')
    # Remove leading/trailing whitespace
    return text.strip()


def find_circumpositions(text: str) -> List[Tuple[str, str]]:
    """Find all circumpositions in text"""
    found = []
    for pattern, name in CIRCUMPOSITIONS:
        matches = re.finditer(pattern, text)
        for match in matches:
            found.append((match.group(0), name))
    return found


def split_postposition_phrase(phrase: str) -> Tuple[str, str]:
    """Split postposition phrase like 'ما ته' into 'ما' + 'ته'"""
    words = phrase.split()
    if len(words) >= 2 and words[-1] in POSTPOSITIONS:
        return (' '.join(words[:-1]), words[-1])
    return (phrase, None)


def split_preposition_phrase(phrase: str) -> Tuple[str, str]:
    """Split preposition phrase like 'د یوسف' into 'د' + 'یوسف'"""
    words = phrase.split()
    if len(words) >= 2 and words[0] in PREPOSITIONS:
        return (words[0], ' '.join(words[1:]))
    return (phrase, None)


def split_particle_phrase(phrase: str) -> Tuple[str, str]:
    """Split particle phrase like 'هغه به' into 'هغه' + 'به'"""
    words = phrase.split()
    if 'به' in words:
        idx = words.index('به')
        if idx > 0:
            return (' '.join(words[:idx]), 'به')
        elif idx < len(words) - 1:
            return ('به', ' '.join(words[idx+1:]))
    return (phrase, None)


def process_verse_text(text: str) -> Dict[str, int]:
    """
    Process verse text and return word frequencies with phrase awareness.
    
    Returns:
        Dict mapping word/phrase -> frequency
    """
    word_counts: Dict[str, int] = defaultdict(int)
    
    if not text:
        return word_counts
    
    # Clean punctuation
    text = clean_punctuation(text)
    
    # Step 1: Find and mark circumpositions (keep as single entries)
    circumpositions = find_circumpositions(text)
    marked_spans = set()
    
    for match_text, name in circumpositions:
        # Find all occurrences of this circumposition
        for m in re.finditer(re.escape(match_text), text):
            span = (m.start(), m.end())
            marked_spans.add(span)
            # Add as single entry
            word_counts[match_text] += 1
    
    # Step 2: Split text, preserving circumpositions
    # We'll process word by word, but group circumpositions
    words = text.split()
    i = 0
    
    while i < len(words):
        # Check if we're at the start of a circumposition
        found_circumposition = False
        for pattern, name in CIRCUMPOSITIONS:
            # Try to match from current position
            remaining_text = ' '.join(words[i:])
            match = re.match(pattern, remaining_text)
            if match:
                circum_text = match.group(0)
                word_counts[circum_text] += 1
                # Skip over the words in this circumposition
                num_words = len(circum_text.split())
                i += num_words
                found_circumposition = True
                break
        
        if not found_circumposition:
            # Check for postposition phrase
            if i < len(words) - 1 and words[i+1] in POSTPOSITIONS:
                phrase = f"{words[i]} {words[i+1]}"
                base, post = split_postposition_phrase(phrase)
                if base:
                    word_counts[base] += 1
                if post:
                    word_counts[post] += 1
                i += 2
            # Check for preposition phrase
            elif words[i] in PREPOSITIONS and i < len(words) - 1:
                phrase = f"{words[i]} {words[i+1]}"
                prep, base = split_preposition_phrase(phrase)
                if prep:
                    word_counts[prep] += 1
                if base:
                    word_counts[base] += 1
                i += 2
            # Check for particle phrase
            elif 'به' in words[i:i+2]:
                if words[i] == 'به' and i < len(words) - 1:
                    word_counts['به'] += 1
                    word_counts[words[i+1]] += 1
                    i += 2
                elif i < len(words) - 1 and words[i+1] == 'به':
                    word_counts[words[i]] += 1
                    word_counts['به'] += 1
                    i += 2
                else:
                    word_counts[words[i]] += 1
                    i += 1
            else:
                # Single word
                word_counts[words[i]] += 1
                i += 1
    
    return word_counts


def main():
    print("🔄 Rebuilding word_frequencies with phrase awareness\n")
    
    # Query verses
    print("📚 Loading verses from database...")
    sql = """
    SELECT text, book, chapter, verse
    FROM verses_yousafzai
    WHERE text IS NOT NULL AND text != ''
    LIMIT 1000
    """
    
    verses = query_d1(sql)
    print(f"   ✅ Loaded {len(verses)} verses")
    
    if not verses:
        print("   ❌ No verses found")
        return
    
    # Process verses
    print("\n🔍 Processing verses...")
    all_word_counts: Dict[str, int] = defaultdict(int)
    
    for verse in verses:
        text = verse.get('text', '')
        word_counts = process_verse_text(text)
        for word, count in word_counts.items():
            all_word_counts[word] += count
    
    print(f"   ✅ Processed {len(all_word_counts)} unique words/phrases")
    
    # Generate SQL
    print("\n📝 Generating SQL...")
    sql_statements = []
    sql_statements.append('-- Rebuild word_frequencies with phrase awareness')
    sql_statements.append('-- This preserves circumpositions as single entries')
    sql_statements.append('-- and splits postpositions/prepositions/particles')
    sql_statements.append('')
    sql_statements.append('-- Clean punctuation from form_occurrences first')
    sql_statements.append("""
UPDATE form_occurrences
SET pashto_form = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(pashto_form, ',', ''), '.', ''), ':', ''), ';', ''), '!', ''), '?', ''), '(', ''), ')', ''))
WHERE pashto_form LIKE '%,%' OR pashto_form LIKE '%.%' OR pashto_form LIKE '%:%';
""")
    
    sql_statements.append('')
    sql_statements.append('-- Sample INSERT statements (limited to top 100 for testing)')
    sql_statements.append('-- Full rebuild would process all verses')
    
    # Generate INSERT statements for top entries
    sorted_words = sorted(all_word_counts.items(), key=lambda x: x[1], reverse=True)[:100]
    
    for word, count in sorted_words:
        clean_word = word.replace("'", "''")
        sql_statements.append(
            f"INSERT OR REPLACE INTO word_frequencies (pashto_word, frequency_total) "
            f"VALUES ('{clean_word}', {count}) "
            f"ON CONFLICT(pashto_word) DO UPDATE SET frequency_total = frequency_total + {count};"
        )
    
    output_path = APP_ROOT / 'cloudflare' / 'rebuild-word-frequencies-phrases.sql'
    output_path.write_text('\n'.join(sql_statements), encoding='utf-8')
    
    print(f"   ✅ Generated {output_path}")
    print(f"   📊 Top 10 words/phrases:")
    for word, count in sorted_words[:10]:
        print(f"      {word}: {count}")
    
    print("\n📋 Next steps:")
    print("   1. Review the generated SQL")
    print("   2. Process ALL verses (not just 1000)")
    print("   3. Run full rebuild: wrangler d1 execute pashto-bible-db --remote --file cloudflare/rebuild-word-frequencies-phrases.sql")


if __name__ == '__main__':
    main()


#!/usr/bin/env python3
"""
Extract biblical proper noun names from English Bible translations

For each word flagged as a potential biblical name:
1. Find verses containing that word in Pashto from verses_afghan2023
2. Get the verse references (book, chapter, verse)
3. Look up English translations for those verses using Bible API
4. Extract the English name from the verse context
5. Use that as the romanization/translation
"""

import json
import subprocess
import sys
import urllib.request
import urllib.parse
import time

# Words to look up
WORDS_TO_LOOKUP = [
    'لابان', 'اخى', 'اب', 'ايل', 'اِلى', 'اېل', 'عزر',
    'موسی', 'داود', 'یعقوب', 'یوسف', 'هارون', 'سلیمان',
    'یوحنا', 'مریم', 'پترس', 'پولس'
]

def query_verses(pashto_word):
    """Query D1 for verses containing a Pashto word"""
    cmd = f"""wrangler d1 execute pashto-bible-db --remote --command="SELECT ref, book, chapter, verse, text FROM verses_afghan2023 WHERE text LIKE '%{pashto_word}%' LIMIT 3;" --json"""
    
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
                    # Single dict result
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

def get_english_verse(ref):
    """Get English translation for a verse using Bible API"""
    # Parse ref (e.g., "Genesis 29:1")
    parts = ref.split()
    if len(parts) < 2:
        return None
    
    book = parts[0]
    chapter_verse = parts[-1] if ':' in parts[-1] else parts[-2] + ':' + parts[-1]
    
    # Normalize book name for API
    book_map = {
        'Genesis': 'genesis',
        'Exodus': 'exodus',
        'Leviticus': 'leviticus',
        'Numbers': 'numbers',
        'Deuteronomy': 'deuteronomy',
        'Joshua': 'joshua',
        'Judges': 'judges',
        'Ruth': 'ruth',
        '1 Samuel': '1 samuel',
        '2 Samuel': '2 samuel',
        '1 Kings': '1 kings',
        '2 Kings': '2 kings',
        '1 Chronicles': '1 chronicles',
        '2 Chronicles': '2 chronicles',
        'Ezra': 'ezra',
        'Nehemiah': 'nehemiah',
        'Esther': 'esther',
        'Job': 'job',
        'Psalms': 'psalms',
        'Proverbs': 'proverbs',
        'Ecclesiastes': 'ecclesiastes',
        'Song of Solomon': 'song of solomon',
        'Isaiah': 'isaiah',
        'Jeremiah': 'jeremiah',
        'Lamentations': 'lamentations',
        'Ezekiel': 'ezekiel',
        'Daniel': 'daniel',
        'Hosea': 'hosea',
        'Joel': 'joel',
        'Amos': 'amos',
        'Obadiah': 'obadiah',
        'Jonah': 'jonah',
        'Micah': 'micah',
        'Nahum': 'nahum',
        'Habakkuk': 'habakkuk',
        'Zephaniah': 'zephaniah',
        'Haggai': 'haggai',
        'Zechariah': 'zechariah',
        'Malachi': 'malachi',
        'Matthew': 'matthew',
        'Mark': 'mark',
        'Luke': 'luke',
        'John': 'john',
        'Acts': 'acts',
        'Romans': 'romans',
        '1 Corinthians': '1 corinthians',
        '2 Corinthians': '2 corinthians',
        'Galatians': 'galatians',
        'Ephesians': 'ephesians',
        'Philippians': 'philippians',
        'Colossians': 'colossians',
        '1 Thessalonians': '1 thessalonians',
        '2 Thessalonians': '2 thessalonians',
        '1 Timothy': '1 timothy',
        '2 Timothy': '2 timothy',
        'Titus': 'titus',
        'Philemon': 'philemon',
        'Hebrews': 'hebrews',
        'James': 'james',
        '1 Peter': '1 peter',
        '2 Peter': '2 peter',
        '1 John': '1 john',
        '2 John': '2 john',
        '3 John': '3 john',
        'Jude': 'jude',
        'Revelation': 'revelation',
    }
    
    book_normalized = book_map.get(book, book.lower())
    passage = f"{book_normalized}+{chapter_verse}"
    
    # Use bible-api.com
    url = f"https://bible-api.com/{urllib.parse.quote(passage)}?translation=kjv"
    
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            return data.get('text', '')
    except Exception as e:
        print(f"      ⚠️  API error: {e}")
        return None

def extract_name_from_english(english_text, pashto_word):
    """Extract name from English verse context"""
    if not english_text:
        return None
    
    # Mapping of Pashto words to English names (based on known patterns)
    pashto_to_english = {
        'لابان': 'Laban',
        'اخى': 'Ahab',  # اخى‌اب in Pashto = Ahab
        'اب': None,  # Too ambiguous - could be "Ab" or part of other words
        'ايل': 'Hananeel',  # حنن‌ايل = Hananeel
        'اِلى': 'Elealeh',  # اِلى‌عالى = Elealeh
        'اېل': 'Shealtiel',  # شلتى‌اېل = Shealtiel
        'عزر': 'Azariah',  # عزریا = Azariah
        'موسی': 'Moses',
        'داود': 'David',
        'یعقوب': 'James',
        'یوسف': 'Joseph',
        'هارون': 'Aaron',
        'سلیمان': 'Solomon',
        'یوحنا': 'John',
        'مریم': 'Mary',
        'پترس': 'Peter',
        'پولس': 'Paul',
    }
    
    # First check if we have a direct mapping
    if pashto_word in pashto_to_english:
        mapped_name = pashto_to_english[pashto_word]
        if mapped_name and mapped_name in english_text:
            return mapped_name
    
    # Common biblical names to look for
    common_names = [
        'Laban', 'El', 'Ab', 'Ahab', 'Ali', 'Azar', 'Azur', 'Uzar',
        'Moses', 'David', 'Jacob', 'James', 'Joseph', 'Aaron', 'Solomon',
        'John', 'Mary', 'Peter', 'Paul', 'Thomas', 'Andrew', 'Philip',
        'Bartholomew', 'Matthew', 'Thaddeus', 'Simon', 'Judas',
        'Noah', 'Ishmael', 'Isaac', 'Esau', 'Rachel', 'Leah', 'Benjamin',
        'Joshua', 'Samson', 'Ruth', 'Samuel', 'Saul', 'Jonathan', 'Daniel',
        'Job', 'Ezekiel', 'Isaiah', 'Jeremiah', 'Hosea', 'Jonah', 'Micah',
        'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
        'Ezra', 'Nehemiah', 'Esther', 'Abraham', 'Jesus', 'Isa',
        'Hananeel', 'Elealeh', 'Shealtiel', 'Azariah'
    ]
    
    # Look for names in the text
    for name in common_names:
        if name in english_text:
            return name
    
    return None

def main():
    print('🔍 Finding verses and English translations for biblical names...\n')
    
    name_mapping = {}
    verse_examples = {}
    
    for pashto_word in WORDS_TO_LOOKUP:
        print(f'📖 Processing: {pashto_word}')
        
        verses = query_verses(pashto_word)
        
        if not verses:
            print(f'   ⚠️  No verses found\n')
            continue
        
        print(f'   Found {len(verses)} verses')
        
        # Try to get English translation for first verse
        first_verse = verses[0]
        # Build ref from book, chapter, verse if ref is missing
        ref = first_verse.get('ref', '')
        if not ref:
            book = first_verse.get('book', '')
            chapter = first_verse.get('chapter', '')
            verse = first_verse.get('verse', '')
            if book and chapter and verse:
                ref = f"{book} {chapter}:{verse}"
        
        pashto_text = first_verse.get('text', '')[:150]
        
        print(f'   Pashto verse ({ref}): {pashto_text}...')
        
        english_text = get_english_verse(ref)
        
        if english_text:
            print(f'   English verse: {english_text[:150]}...')
            
            english_name = extract_name_from_english(english_text, pashto_word)
            
            if english_name:
                name_mapping[pashto_word] = english_name
                print(f'   ✅ Extracted name: {english_name}\n')
            else:
                print(f'   ⚠️  Could not extract name from English verse\n')
        else:
            print(f'   ⚠️  Could not fetch English translation\n')
        
        # Store examples
        verse_examples[pashto_word] = {
            'pashto_verses': [
                {
                    'ref': v.get('ref', ''),
                    'text': v.get('text', '')[:200]
                }
                for v in verses[:2]
            ],
            'english_text': english_text[:200] if english_text else None
        }
        
        # Delay to avoid rate limiting
        time.sleep(0.5)
    
    print(f'\n✅ Found {len(name_mapping)} names\n')
    
    # Generate SQL
    updates = []
    for pashto_word, english_name in sorted(name_mapping.items()):
        updates.append(f"-- Biblical name: {pashto_word} ({english_name})")
        escaped_english = english_name.replace("'", "''")
        escaped_pashto = pashto_word.replace("'", "''")
        updates.append(f"UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '{escaped_english}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '{escaped_pashto}';")
        updates.append('')
    
    # Write SQL file
    sql_path = 'cloudflare/identify-biblical-names-from-verses.sql'
    sql_content = [
        '-- Identify biblical proper nouns from verse context',
        '-- Generated by analyzing verses containing these words and matching to English translations',
        '',
        '-- Add word_type column if missing',
        "ALTER TABLE word_frequencies ADD COLUMN word_type TEXT;",
        '',
        '-- Update biblical names',
    ] + updates + [
        '',
        '-- Create index',
        'CREATE INDEX IF NOT EXISTS idx_word_frequencies_word_type ON word_frequencies (word_type);',
    ]
    
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_content))
    
    # Write verse examples to JSON
    examples_path = 'cloudflare/biblical-name-verse-examples.json'
    with open(examples_path, 'w', encoding='utf-8') as f:
        json.dump(verse_examples, f, indent=2, ensure_ascii=False)
    
    print(f'✅ Generated:')
    print(f'   - {sql_path}')
    print(f'   - {examples_path}\n')
    
    print('📋 Next steps:')
    print('   1. Review the verse examples in biblical-name-verse-examples.json')
    print('   2. Verify English names match the Pashto context')
    print('   3. Run: wrangler d1 execute pashto-bible-db --remote --file cloudflare/identify-biblical-names-from-verses.sql\n')

if __name__ == '__main__':
    main()


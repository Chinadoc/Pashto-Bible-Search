#!/usr/bin/env python3
"""
Analyze verses with multiple biblical names and extract any missing names.
Compares names found in verses to the word_frequencies table.
"""

import json
import re
import subprocess
from collections import defaultdict

# Known biblical names from our dictionary
KNOWN_BIBLICAL_NAMES = {
    'ابراهیم': 'Abraham',
    'اسحاق': 'Isaac',
    'یعقوب': 'Jacob',
    'یوسف': 'Joseph',
    'داود': 'David',
    'سلیمان': 'Solomon',
    'موسی': 'Moses',
    'هارون': 'Aaron',
    'یوحنا': 'John',
    'یحیی': 'John',
    'یحى': 'John',
    'یوشع': 'Joshua',
    'عیسی': 'Jesus',
    'مریم': 'Mary',
    'یوناتان': 'Jonathan',
    'یرمیا': 'Jeremiah',
    'حزقیال': 'Ezekiel',
    'اشعیا': 'Isaiah',
    'زکریا': 'Zechariah',
    'یونس': 'Jonah',
    'نوح': 'Noah',
    'اسماعیل': 'Ishmael',
    'عیسو': 'Esau',
    'راحیل': 'Rachel',
    'لیا': 'Leah',
    'بنیامین': 'Benjamin',
    'سموئیل': 'Samuel',
    'ساول': 'Saul',
    'دانیال': 'Daniel',
    'ایوب': 'Job',
    'حزقیاه': 'Hezekiah',
    'یعبیز': 'Jabez',
    'کننیا': 'Conaniah',
    'یزهار': 'Izhar',
    'یعزیا': 'Jehaziah',
    'نتنی': 'Nethanel',
    'يعى': 'Jai',
    'متتیا': 'Mattithiah',
    'شافاط': 'Shaphat',
    'یشعي': 'Jeshua',
    'مشلمیا': 'Meshullam',
    'یقمعام': 'Jekameam',
    'فقحیا': 'Pekahiah',
    'يعريم': 'Jerim',
    'شلتى': 'Shealtiel',
    'صِدق': 'Zadok',
    'هدد': 'Hadad',
    'عمى': 'Ammi',
    'عنياه': 'Ananiah',
    'صقلغ': 'Ziklag',
    'عصيون': 'Azion',
    'پليتوى': 'Pilate',
    'ییزو': 'Jezu',
    'عېبه': 'Ebed',
    'عیبر': 'Eber',
    'یحت': 'Jehath',
    'محیر': 'Mahir',
    'معونوتای': 'Maonothai',
    'مشماع': 'Meshsham',
    'یریا': 'Jeriah',
    'عیدر': 'Eder',
    'يحزى': 'Jehaz',
    'عیفر': 'Ephah',
    'صوحر': 'Zohar',
    'یامین': 'Yamin',
    'شوعال': 'Shual',
    'عماسای': 'Amasai',
    'عیون': 'Eyon',
    'يحلى': 'Jehallelel',
    'یربعام': 'Jeroboam',
    'بلعام': 'Balaam',
    'میکایا': 'Micah',
    'یدوتون': 'Jeduthun',
    'یشیه': 'Jeshiah',
    'مناحیم': 'Menahem',
    'لابان': 'Laban',
    'یوهوده': 'Jude',
    'تارح': 'Terah',
    'ناحور': 'Nahor',
    'اوریا': 'Uriah',
    'زبدي': 'Zebedee',
    'پیلاتوس': 'Pilate',
    'مجدلیه': 'Magdalene',
}

def extract_words_from_text(text):
    """Extract individual words from Pashto text"""
    # Remove punctuation and split by spaces
    cleaned = re.sub(r'[،«»()\[\]۰-۹0-9]', ' ', text)
    words = cleaned.split()
    return [w.strip() for w in words if len(w.strip()) > 1]

def find_verse_with_multiple_names():
    """Find verses that contain multiple biblical names"""
    print("🔍 Finding verses with multiple biblical names...\n")
    
    # Query for verses with multiple known names - use more comprehensive query
    # Find verses that contain at least 2 biblical names
    query = """
    SELECT book, chapter, verse, text 
    FROM verses_afghan2023 
    WHERE (
        (text LIKE '%ابراهیم%' AND text LIKE '%اسحاق%') OR
        (text LIKE '%ابراهیم%' AND text LIKE '%یعقوب%') OR
        (text LIKE '%اسحاق%' AND text LIKE '%یعقوب%') OR
        (text LIKE '%داود%' AND text LIKE '%سلیمان%') OR
        (text LIKE '%موسی%' AND text LIKE '%هارون%') OR
        (text LIKE '%یوسف%' AND text LIKE '%یعقوب%') OR
        (text LIKE '%یعقوب%' AND text LIKE '%یوحنا%') OR
        (text LIKE '%مریم%' AND text LIKE '%عیسی%')
    )
    ORDER BY book, chapter, verse
    LIMIT 100
    """
    
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error querying database: {result.stderr}")
        return []
    
    # Parse output
    try:
        lines = result.stdout.strip().split('\n')
        json_start = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('['):
                json_start = i
                break
        
        if json_start == -1:
            print("Could not find JSON in output")
            return []
        
        json_str = '\n'.join(lines[json_start:])
        output = json.loads(json_str)
        
        if not output or len(output) == 0 or 'results' not in output[0]:
            return []
        
        return output[0]['results']
    except Exception as e:
        print(f"Error parsing output: {e}")
        return []

def analyze_verse_for_names(verse_text):
    """Analyze a verse text to find potential biblical names"""
    words = extract_words_from_text(verse_text)
    found_names = []
    
    for word in words:
        if word in KNOWN_BIBLICAL_NAMES:
            found_names.append((word, KNOWN_BIBLICAL_NAMES[word]))
    
    return found_names

def check_word_in_frequencies(word):
    """Check if word exists in word_frequencies and what its status is"""
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command',
         f"SELECT pashto_word, word_type, pos, romanization FROM word_frequencies WHERE pashto_word = '{word}' LIMIT 1"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        return None
    
    try:
        lines = result.stdout.strip().split('\n')
        json_start = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('['):
                json_start = i
                break
        
        if json_start == -1:
            return None
        
        json_str = '\n'.join(lines[json_start:])
        output = json.loads(json_str)
        
        if output and len(output) > 0 and 'results' in output[0] and len(output[0]['results']) > 0:
            return output[0]['results'][0]
        return None
    except:
        return None

def main():
    print("🔍 Analyzing verses with multiple biblical names...\n")
    
    # Find verses with multiple names
    verses = find_verse_with_multiple_names()
    
    if not verses:
        print("No verses found with multiple names")
        return
    
    print(f"Found {len(verses)} verses to analyze\n")
    
    # Analyze each verse
    missing_names = []
    name_occurrences = defaultdict(list)
    
    for verse in verses:  # Analyze all verses
        text = verse.get('text', '')
        ref = f"{verse.get('book', '')} {verse.get('chapter', '')}:{verse.get('verse', '')}"
        
        # Find names in verse
        names_in_verse = analyze_verse_for_names(text)
        
        if len(names_in_verse) >= 2:  # Only analyze verses with 2+ names
            print(f"\n📖 {ref}")
            print(f"   Text: {text[:100]}...")
            print(f"   Names found: {', '.join([f'{n[0]} ({n[1]})' for n in names_in_verse])}")
            
            # Check each name in word_frequencies
            for word, romanization in names_in_verse:
                word_info = check_word_in_frequencies(word)
                if word_info:
                    word_type = word_info.get('word_type', '')
                    pos = word_info.get('pos', '')
                    if word_type != 'proper_noun' or pos != 'n. prop.':
                        print(f"   ⚠️  {word}: word_type={word_type}, pos={pos} (should be proper_noun, n. prop.)")
                        missing_names.append({
                            'word': word,
                            'romanization': romanization,
                            'ref': ref,
                            'current_type': word_type,
                            'current_pos': pos
                        })
                else:
                    print(f"   ❌ {word} ({romanization}): NOT FOUND in word_frequencies")
                    missing_names.append({
                        'word': word,
                        'romanization': romanization,
                        'ref': ref,
                        'current_type': None,
                        'current_pos': None
                    })
                
                name_occurrences[word].append(ref)
    
    # Generate SQL for missing or incorrectly labeled names
    if missing_names:
        print(f"\n{'='*60}")
        print(f"Found {len(missing_names)} names that need updating")
        print(f"{'='*60}\n")
        
        sql_lines = [
            "-- Update biblical names found in verses with multiple names",
            "-- Generated by analyze-verses-with-names.py",
            "",
        ]
        
        # Group by word to avoid duplicates
        seen_words = set()
        for item in missing_names:
            word = item['word']
            if word not in seen_words:
                seen_words.add(word)
                romanization = item['romanization']
                
                if item['current_type'] is None:
                    # Insert new entry
                    sql_lines.append(f"-- {word} ({romanization}) - Found in verses: {', '.join(name_occurrences[word][:3])}")
                    sql_lines.append(f"INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags) VALUES ('{word}', 'proper_noun', 'n. prop.', '{romanization}', 0, '[]');")
                else:
                    # Update existing entry
                    sql_lines.append(f"-- {word} ({romanization}) - Update from {item['current_type']} to proper_noun")
                    sql_lines.append(f"UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '{romanization}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '{word}';")
                sql_lines.append("")
        
        # Write SQL file
        sql_path = 'cloudflare/update-names-from-verses.sql'
        with open(sql_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql_lines))
        
        print(f"✅ Generated SQL file: {sql_path}")
    else:
        print("\n✅ All names found in verses are properly labeled in word_frequencies")

if __name__ == '__main__':
    main()


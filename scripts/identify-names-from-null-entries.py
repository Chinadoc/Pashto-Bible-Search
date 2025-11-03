#!/usr/bin/env python3
"""
Identify biblical names from entries with null characterizations.
Uses pattern matching and known biblical names dictionary.
"""

import json
import re
import subprocess

# Known biblical names mapping (Pashto -> English)
# Only actual biblical names - excludes common nouns, verbs, etc.
KNOWN_BIBLICAL_NAMES = {
    'میکایا': 'Micah',
    'یدوتون': 'Jeduthun',
    'یشیه': 'Jeshiah',
    'مناحیم': 'Menahem',
    'یعبیز': 'Jabez',
    'یحى': 'John',
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
    'شلتى': 'Shealtiel',  # Part of compound name شلتى‌اېل
    'صِدق': 'Zadok',
    'هدد': 'Hadad',
    'عمى': 'Ammi',
    'عنياه': 'Ananiah',
    'صقلغ': 'Ziklag',
    'عصيون': 'Azion',
    'پليتوى': 'Pilate',
    'ییزو': 'Jezu',
    # Additional names found in expanded search
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
    'يحیی': 'John',
    'حزقیاه': 'Hezekiah',
    'محزیوت': 'Mahaziot',
    'یوشع': 'Joshua',
    'یعقوب': 'Jacob',
    'یوحنا': 'John',
    'یربعام': 'Jeroboam',
    'بلعام': 'Balaam',
}

# Common nouns and other non-name words to exclude
COMMON_NOUNS = {
    'مردم': 'people',
    'معنې': 'meaning',
    'نبي': 'prophet',
    'کسیزو': 'scissors',
    'چونګښې': 'mosquitoes',
    'هوشه': 'awareness',
    'ښکارينه': 'appearance',
    'نیر': 'force',
    'ټاکنې': 'selection',
    'مددګاره': 'helper',
    'مقصده': 'purpose',
    'شانه': 'shoulder',
    'مرستیالان': 'assistants',
    'قدو': 'height',
    'مثاله': 'example',
    'شتر': 'camel',
    'څملاست': 'gathering',
    'قوري': 'rabbit',
    'فرقو': 'difference',
    'صاحِبه': 'lady',
    'مرم': 'people',
    'چته': 'where',
    'علمت': 'knowledge',
    'قراره': 'decision',
    'علمه': 'knowledge',
}

# Verb prefixes/patterns to exclude
VERB_PATTERNS = [
    r'^و',  # Past tense prefix
    r'^کېږ',  # Present tense
    r'^وځ',  # Past tense
    r'^وش',  # Past tense
    r'^ومن',  # Past tense
    r'^واور',  # Past tense
    r'^وګ',  # Past tense
    r'^ورو',  # Past tense
    r'^وس',  # Past tense
    r'^پټ',  # Hidden (verb form)
    r'^وژن',  # Kill (verb)
    r'^وسپار',  # Hand over (verb)
    r'^وسوز',  # Burn (verb)
    r'^وګرځ',  # Return (verb)
    r'^وغوښت',  # Request (verb)
    r'^نامو',  # Take (verb)
    r'^ونت',  # Verb form
    r'^ونيسم',  # Verb form
    r'^وقوف',  # Stand (verb)
    r'^علم',  # Verb form
    r'^څښ',  # Drink (verb)
    r'^وشل',  # Verb form
    r'^وشړ',  # Verb form
    r'^ورموم',  # Verb form
    r'^وشیند',  # Verb form
    r'^وځل',  # Verb form
    r'^وموم',  # Verb form
    r'^کېږ',  # Present tense
    r'^کړ',  # Do (verb)
    r'^ورسېد',  # Arrive (verb)
    r'^وګټ',  # Win (verb)
    r'^وسوز',  # Burn (verb)
    r'^ووژ',  # Kill (verb)
    r'^وګنډ',  # Verb form
]

def is_likely_verb(word):
    """Check if word is likely a verb"""
    for pattern in VERB_PATTERNS:
        if re.search(pattern, word):
            return True
    return False

def is_biblical_name(word):
    """Check if word is a known biblical name"""
    # Exclude common nouns
    if word in COMMON_NOUNS:
        return False
    
    # Exclude verbs
    if is_likely_verb(word):
        return False
    
    # Check if it's in the known biblical names list
    return word in KNOWN_BIBLICAL_NAMES

def process_batch(offset, limit):
    """Process a batch of entries"""
    print(f"\n📦 Processing batch: entries {offset} to {offset + limit}...\n")
    
    # Get entries with null characterizations
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command',
         f"SELECT pashto_word, id FROM word_frequencies WHERE (word_type IS NULL OR word_type = 'unknown' OR word_type = '') AND (pos IS NULL OR pos = '') AND (romanization IS NULL OR romanization = '') AND pashto_word NOT LIKE '% %' AND pashto_word NOT LIKE '%،%' AND pashto_word NOT LIKE '%«%' AND pashto_word NOT LIKE '%»%' AND LENGTH(pashto_word) > 2 ORDER BY id LIMIT {limit} OFFSET {offset}"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error querying database: {result.stderr}")
        return
    
    if result.returncode != 0:
        print(f"Error querying database: {result.stderr}")
        return []
    
    # Parse output - wrangler returns JSON array
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
        
        words = output[0]['results']
        
        # Identify biblical names
        biblical_names = []
        for word_obj in words:
            word = word_obj.get('pashto_word', '')
            word_id = word_obj.get('id', '')
            
            # Skip if it's likely a verb
            if is_likely_verb(word):
                continue
            
            # Check if it's a known biblical name
            if is_biblical_name(word):
                romanization = KNOWN_BIBLICAL_NAMES[word]
                biblical_names.append((word, word_id, romanization))
                print(f"✅ {word} (ID: {word_id}) -> {romanization}")
        
        return biblical_names
        
    except Exception as e:
        print(f"Error parsing batch: {e}")
        return []

def main():
    print("🔍 Identifying biblical names from null-characterized entries...\n")
    print("Processing all remaining batches to find all biblical names...\n")
    
    all_biblical_names = []
    batch_size = 200
    # Calculate number of batches needed: 14,018 entries / 200 per batch = ~71 batches
    # Process 75 batches to be safe
    num_batches = 75
    
    for batch_num in range(num_batches):
        offset = batch_num * batch_size
        batch_names = process_batch(offset, batch_size)
        
        if batch_names:
            all_biblical_names.extend(batch_names)
            print(f"   Found {len(batch_names)} names in this batch")
        elif batch_num % 10 == 0:  # Print progress every 10 batches
            print(f"   Processed batch {batch_num + 1}/{num_batches}...")
    
    # Remove duplicates (in case a name appears in multiple batches)
    seen = set()
    unique_names = []
    for word, word_id, romanization in all_biblical_names:
        if word not in seen:
            seen.add(word)
            unique_names.append((word, word_id, romanization))
    
    print(f"\n{'='*60}")
    print(f"✅ Found {len(unique_names)} unique biblical names across {num_batches} batches")
    print(f"{'='*60}\n")
    
    # Generate SQL updates
    sql_lines = [
        "-- Identify and label biblical names from null-characterized entries",
        "-- Generated by identify-names-from-null-entries.py",
        "-- These entries have null characterizations and are confirmed biblical names",
        f"-- Processed {num_batches} batches of {batch_size} entries each",
        "",
    ]
    
    for word, word_id, romanization in sorted(unique_names, key=lambda x: x[1]):  # Sort by ID
        sql_lines.append(f"-- {word} (ID: {word_id}) - Biblical name: {romanization}")
        sql_lines.append(f"UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '{romanization}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '{word}';")
        sql_lines.append("")
    
    # Write SQL file
    sql_path = 'cloudflare/identify-names-from-null-entries.sql'
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ Generated SQL file: {sql_path}")
    print(f"\nSummary:")
    print(f"  - Processed {num_batches} batches ({num_batches * batch_size} total entries checked)")
    print(f"  - Found {len(unique_names)} unique biblical names")
    print(f"\nNext steps:")
    print(f"  1. Review {sql_path}")
    print(f"  2. Run: wrangler d1 execute pashto-bible-db --remote --file {sql_path}")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Comprehensive search for biblical names in the database.
Uses multiple strategies to find names we might have missed.
"""

import json
import re
import subprocess
from collections import defaultdict

# Expanded list of biblical names - includes many more names
KNOWN_BIBLICAL_NAMES = {
    # Patriarchs
    'ابراهیم': 'Abraham',
    'اسحاق': 'Isaac',
    'یعقوب': 'Jacob',
    'یوسف': 'Joseph',
    'تارح': 'Terah',
    'ناحور': 'Nahor',
    'عیسو': 'Esau',
    'راحیل': 'Rachel',
    'لیا': 'Leah',
    'بنیامین': 'Benjamin',
    'روبن': 'Reuben',
    'سیمون': 'Simeon',
    'لاوی': 'Levi',
    'یهودا': 'Judah',
    'دانیال': 'Dan',
    'نفتالی': 'Naphtali',
    'جاد': 'Gad',
    'آشر': 'Asher',
    'یساکار': 'Issachar',
    'زبولون': 'Zebulun',
    'دینا': 'Dinah',
    
    # Judges and early leaders
    'موسی': 'Moses',
    'هارون': 'Aaron',
    'یوشع': 'Joshua',
    'کیلب': 'Caleb',
    'اُتنیل': 'Othniel',
    'ایهود': 'Ehud',
    'شمجره': 'Shamgar',
    'دبوره': 'Deborah',
    'باریک': 'Barak',
    'جدعون': 'Gideon',
    'ابیملیک': 'Abimelech',
    'طولا': 'Tola',
    'یائیر': 'Jair',
    'یفتاح': 'Jephthah',
    'ابسان': 'Ibzan',
    'ایلون': 'Elon',
    'عبدون': 'Abdon',
    'شمشون': 'Samson',
    'علی': 'Eli',
    'سموئیل': 'Samuel',
    'حنا': 'Hannah',
    
    # Kings
    'ساول': 'Saul',
    'داود': 'David',
    'سلیمان': 'Solomon',
    'رحبعام': 'Rehoboam',
    'یربعام': 'Jeroboam',
    'ابیا': 'Abijah',
    'آسا': 'Asa',
    'یهوشافاط': 'Jehoshaphat',
    'یورام': 'Jehoram',
    'اخزیا': 'Ahaziah',
    'یوآش': 'Joash',
    'آمصیا': 'Amaziah',
    'عزریا': 'Uzziah',
    'یوتام': 'Jotham',
    'احاز': 'Ahaz',
    'حزقیاه': 'Hezekiah',
    'منسی': 'Manasseh',
    'آمون': 'Amon',
    'یوشیا': 'Josiah',
    'یہوآحاز': 'Jehoahaz',
    'یهویاقیم': 'Jehoiakim',
    'یهویاکین': 'Jehoiachin',
    'صدقیا': 'Zedekiah',
    
    # Prophets
    'اشعیا': 'Isaiah',
    'یرمیا': 'Jeremiah',
    'حزقیال': 'Ezekiel',
    'دانیال': 'Daniel',
    'هوشع': 'Hosea',
    'یوئیل': 'Joel',
    'عاموس': 'Amos',
    'عوبدیا': 'Obadiah',
    'یونس': 'Jonah',
    'میکا': 'Micah',
    'ناحوم': 'Nahum',
    'حبقوق': 'Habakkuk',
    'صفنیا': 'Zephaniah',
    'حجی': 'Haggai',
    'زکریا': 'Zechariah',
    'ملاکی': 'Malachi',
    'ایلایا': 'Elijah',
    'الیشع': 'Elisha',
    
    # NT Names
    'عیسی': 'Jesus',
    'مریم': 'Mary',
    'یوحنا': 'John',
    'یحیی': 'John',
    'یحى': 'John',
    'یعقوب': 'James',
    'یوسف': 'Joseph',
    'مجدلیه': 'Magdalene',
    'زبدي': 'Zebedee',
    'پیلاتوس': 'Pilate',
    'پلوس': 'Paul',
    'پطرس': 'Peter',
    'اندریاس': 'Andrew',
    'فیلیپ': 'Philip',
    'برتولما': 'Bartholomew',
    'توما': 'Thomas',
    'متی': 'Matthew',
    'یعقوب': 'James',
    'تداوس': 'Thaddeus',
    'سیمون': 'Simon',
    'یوناس': 'Jonas',
    'مرتا': 'Martha',
    'لعازر': 'Lazarus',
    'نیکودیموس': 'Nicodemus',
    'یوسف': 'Joseph of Arimathea',
    'استفان': 'Stephen',
    'بارنابا': 'Barnabas',
    'یوحنا': 'John the Baptist',
    'زکریا': 'Zechariah',
    'الیزابت': 'Elizabeth',
    'آنا': 'Anna',
    'سیمون': 'Simeon',
    
    # Other important names
    'نوح': 'Noah',
    'آدم': 'Adam',
    'حوا': 'Eve',
    'قابیل': 'Cain',
    'هابیل': 'Abel',
    'متوشالح': 'Methuselah',
    'نوح': 'Noah',
    'سام': 'Shem',
    'حام': 'Ham',
    'یافث': 'Japheth',
    'نمرود': 'Nimrod',
    'ابرام': 'Abram',
    'لوط': 'Lot',
    'اسماعیل': 'Ishmael',
    'اسحاق': 'Isaac',
    'ربکا': 'Rebekah',
    'لابان': 'Laban',
    'یعقوب': 'Jacob',
    'عیسو': 'Esau',
    'راحیل': 'Rachel',
    'لیا': 'Leah',
    'دینا': 'Dinah',
    'یوسف': 'Joseph',
    'بنیامین': 'Benjamin',
    'یوناتان': 'Jonathan',
    'میکال': 'Michal',
    'اباتشالوم': 'Absalom',
    'سلیمان': 'Solomon',
    'بتشبع': 'Bathsheba',
    'اوریا': 'Uriah',
    'ناتان': 'Nathan',
    'ادونیا': 'Adonijah',
    'یربعام': 'Jeroboam',
    'ناداب': 'Nadab',
    'بعشا': 'Baasha',
    'ایلایا': 'Elah',
    'زمری': 'Zimri',
    'عمری': 'Omri',
    'اخاب': 'Ahab',
    'ایزابل': 'Jezebel',
    'یہورام': 'Jehoram',
    'یہوآحاز': 'Jehoahaz',
    'یہوآش': 'Joash',
    'یربعام': 'Jeroboam II',
    'زکریا': 'Zechariah',
    'شلوم': 'Shallum',
    'مناحیم': 'Menahem',
    'فقحیا': 'Pekahiah',
    'فقح': 'Pekah',
    'هوشع': 'Hoshea',
    'یهوآحاز': 'Jehoahaz',
    'یهویاقیم': 'Jehoiakim',
    'یهویاکین': 'Jehoiachin',
    'صدقیا': 'Zedekiah',
    'دانیال': 'Daniel',
    'حنا': 'Hannah',
    'سموئیل': 'Samuel',
    'ایلایا': 'Elijah',
    'الیشع': 'Elisha',
    'یونس': 'Jonah',
    'میکا': 'Micah',
    'اشعیا': 'Isaiah',
    'یرمیا': 'Jeremiah',
    'حزقیال': 'Ezekiel',
    'دانیال': 'Daniel',
    'عزرا': 'Ezra',
    'نحمیا': 'Nehemiah',
    'زروبابل': 'Zerubbabel',
    'یوشع': 'Joshua',
    'یعقوب': 'Jacob',
    'یوحنا': 'John',
    'یحیی': 'John',
    'عیسی': 'Jesus',
    'مریم': 'Mary',
    'یوسف': 'Joseph',
    'زکریا': 'Zechariah',
    'الیزابت': 'Elizabeth',
    'سیمون': 'Simeon',
    'آنا': 'Anna',
    'یوحنا': 'John the Baptist',
    'پطرس': 'Peter',
    'اندریاس': 'Andrew',
    'یعقوب': 'James',
    'یوحنا': 'John',
    'فیلیپ': 'Philip',
    'برتولما': 'Bartholomew',
    'توما': 'Thomas',
    'متی': 'Matthew',
    'یعقوب': 'James',
    'تداوس': 'Thaddeus',
    'سیمون': 'Simon',
    'یوناس': 'Jonas',
    'پلوس': 'Paul',
    'بارنابا': 'Barnabas',
    'استفان': 'Stephen',
    'فیلیپ': 'Philip',
    'یوناس': 'Jonas',
    'مرتا': 'Martha',
    'لعازر': 'Lazarus',
    'نیکودیموس': 'Nicodemus',
    'یوسف': 'Joseph of Arimathea',
    'پیلاتوس': 'Pilate',
    'هرودیس': 'Herod',
    'سیلاس': 'Silas',
    'تیموتاوس': 'Timothy',
    'تیتوس': 'Titus',
    'فیلیمون': 'Philemon',
    'اپولس': 'Apollos',
    'آکوایلہ': 'Aquila',
    'پرسکیلہ': 'Priscilla',
    'لیڈیا': 'Lydia',
    'دورتاس': 'Dorcas',
    'کرنلیوس': 'Cornelius',
    'یوناس': 'Jonas',
    'بطرس': 'Peter',
    'یعقوب': 'James',
    'یوحنا': 'John',
    'یہودا': 'Jude',
    'روبی': 'Rufus',
    'الکساندر': 'Alexander',
    'دیمتریوس': 'Demetrius',
    'یوناس': 'Jonas',
    'بطرس': 'Peter',
    'یعقوب': 'James',
    'یوحنا': 'John',
    'یہودا': 'Jude',
    'روبی': 'Rufus',
    'الکساندر': 'Alexander',
    'دیمتریوس': 'Demetrius',
}

# Additional name patterns to search for
BIBLICAL_NAME_PATTERNS = [
    r'^ی[ا-ی]+',  # Names starting with ی
    r'^ع[ا-ی]+',  # Names starting with ع
    r'^ا[ا-ی]+',  # Names starting with ا
    r'[ا-ی]+ح[ا-ی]+',  # Names with ح
    r'[ا-ی]+ع[ا-ی]+',  # Names with ع
]

def extract_words_from_text(text):
    """Extract individual words from Pashto text"""
    cleaned = re.sub(r'[،«»()\[\]۰-۹0-9]', ' ', text)
    words = cleaned.split()
    return [w.strip() for w in words if len(w.strip()) > 1]

def query_database(query):
    """Execute SQL query and return results"""
    result = subprocess.run(
        ['wrangler', 'd1', 'execute', 'pashto-bible-db', '--remote', '--command', query],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return []
    
    try:
        lines = result.stdout.strip().split('\n')
        json_start = -1
        for i, line in enumerate(lines):
            if line.strip().startswith('['):
                json_start = i
                break
        
        if json_start == -1:
            return []
        
        json_str = '\n'.join(lines[json_start:])
        output = json.loads(json_str)
        
        if output and len(output) > 0 and 'results' in output[0]:
            return output[0]['results']
        return []
    except Exception as e:
        print(f"Error parsing output: {e}")
        return []

def find_null_characterized_names():
    """Find names from null-characterized entries"""
    print("🔍 Searching null-characterized entries...\n")
    
    query = """
    SELECT pashto_word, id, frequency_total as frequency
    FROM word_frequencies 
    WHERE (word_type IS NULL OR word_type = 'unknown' OR word_type = '') 
    AND (pos IS NULL OR pos = '') 
    AND (romanization IS NULL OR romanization = '')
    AND pashto_word NOT LIKE '% %' 
    AND pashto_word NOT LIKE '%،%'
    AND pashto_word NOT LIKE '%«%'
    AND pashto_word NOT LIKE '%»%'
    AND pashto_word NOT LIKE '%(%'
    AND pashto_word NOT LIKE '%)%'
    AND LENGTH(pashto_word) BETWEEN 3 AND 12
    AND frequency_total > 3
    ORDER BY frequency_total DESC
    LIMIT 1000
    """
    
    entries = query_database(query)
    print(f"Found {len(entries)} null-characterized entries with frequency > 5\n")
    
    potential_names = []
    
    for entry in entries:
        word = entry.get('pashto_word', '')
        word_id = entry.get('id')
        frequency = entry.get('frequency', 0)
        
        # Check if it matches known names
        if word in KNOWN_BIBLICAL_NAMES:
            potential_names.append((word, word_id, KNOWN_BIBLICAL_NAMES[word], frequency))
            continue
        
        # Check if it matches name patterns
        for pattern in BIBLICAL_NAME_PATTERNS:
            if re.match(pattern, word):
                # Check if it appears in verses with other names
                verse_query = f"""
                SELECT COUNT(*) as count
                FROM verses_afghan2023
                WHERE text LIKE '%{word}%'
                AND (
                    text LIKE '%ابراهیم%' OR text LIKE '%یعقوب%' OR 
                    text LIKE '%داود%' OR text LIKE '%موسی%' OR
                    text LIKE '%عیسی%' OR text LIKE '%یوحنا%'
                )
                LIMIT 1
                """
                verse_results = query_database(verse_query)
                if verse_results and verse_results[0].get('count', 0) > 0:
                    potential_names.append((word, word_id, None, frequency))
                    break
    
    return potential_names

def find_names_in_verses():
    """Find names by analyzing verses with multiple names"""
    print("🔍 Searching verses for names...\n")
    
    # Query for verses with various name combinations
    query = """
    SELECT DISTINCT book, chapter, verse, text
    FROM verses_afghan2023
    WHERE (
        text LIKE '%ابراهیم%' OR text LIKE '%اسحاق%' OR text LIKE '%یعقوب%' OR
        text LIKE '%داود%' OR text LIKE '%سلیمان%' OR text LIKE '%موسی%' OR
        text LIKE '%هارون%' OR text LIKE '%یوسف%' OR text LIKE '%یوحنا%' OR
        text LIKE '%عیسی%' OR text LIKE '%مریم%' OR text LIKE '%یونس%' OR
        text LIKE '%دانیال%' OR text LIKE '%یرمیا%' OR text LIKE '%اشعیا%'
    )
    ORDER BY book, chapter, verse
    LIMIT 500
    """
    
    verses = query_database(query)
    print(f"Found {len(verses)} verses to analyze\n")
    
    found_names = defaultdict(list)
    
    for verse in verses:
        text = verse.get('text', '')
        ref = f"{verse.get('book', '')} {verse.get('chapter', '')}:{verse.get('verse', '')}"
        
        words = extract_words_from_text(text)
        
        for word in words:
            if word in KNOWN_BIBLICAL_NAMES:
                found_names[word].append(ref)
    
    return found_names

def check_word_status(word):
    """Check if word exists in word_frequencies and its status"""
    query = f"""
    SELECT pashto_word, word_type, pos, romanization, id
    FROM word_frequencies
    WHERE pashto_word = '{word}'
    LIMIT 1
    """
    
    results = query_database(query)
    if results:
        return results[0]
    return None

def main():
    print("🔍 Comprehensive search for biblical names...\n")
    print("="*60)
    
    all_names_to_update = []
    
    # Strategy 1: Check null-characterized entries
    print("\n1. Checking null-characterized entries...")
    null_names = find_null_characterized_names()
    print(f"   Found {len(null_names)} potential names")
    
    for word, word_id, romanization, frequency in null_names:
        status = check_word_status(word)
        if status:
            word_type = status.get('word_type', '')
            pos = status.get('pos', '')
            if word_type != 'proper_noun' or pos != 'n. prop.':
                if romanization:
                    all_names_to_update.append((word, word_id, romanization, word_type, pos))
    
    # Strategy 2: Analyze verses with names
    print("\n2. Analyzing verses with names...")
    verse_names = find_names_in_verses()
    print(f"   Found {len(verse_names)} names in verses")
    
    for word, refs in verse_names.items():
        if word not in [n[0] for n in all_names_to_update]:
            status = check_word_status(word)
            if status:
                word_type = status.get('word_type', '')
                pos = status.get('pos', '')
                if word_type != 'proper_noun' or pos != 'n. prop.':
                    romanization = KNOWN_BIBLICAL_NAMES.get(word, 'Unknown')
                    word_id = status.get('id')
                    all_names_to_update.append((word, word_id, romanization, word_type, pos))
    
    # Strategy 3: Search for specific name patterns
    print("\n3. Searching for specific name patterns...")
    
    # Search for names with common biblical name endings
    name_endings = ['ح', 'ع', 'ی', 'ا', 'ل', 'م', 'ن']
    for ending in name_endings:
        query = f"""
        SELECT pashto_word, id, frequency_total as frequency
        FROM word_frequencies
        WHERE (word_type IS NULL OR word_type = 'unknown' OR word_type = '')
        AND pashto_word LIKE '%{ending}'
        AND pashto_word NOT LIKE '%«%'
        AND pashto_word NOT LIKE '%»%'
        AND pashto_word NOT LIKE '%(%'
        AND LENGTH(pashto_word) BETWEEN 3 AND 10
        AND frequency_total > 2
        ORDER BY frequency_total DESC
        LIMIT 100
        """
        
        pattern_names = query_database(query)
        for entry in pattern_names:
            word = entry.get('pashto_word', '')
            word_id = entry.get('id')
            
            # Check if it appears with known names
            verse_check = f"""
            SELECT COUNT(*) as count
            FROM verses_afghan2023
            WHERE text LIKE '%{word}%'
            AND (
                text LIKE '%ابراهیم%' OR text LIKE '%یعقوب%' OR 
                text LIKE '%داود%' OR text LIKE '%موسی%' OR
                text LIKE '%عیسی%' OR text LIKE '%یوحنا%'
            )
            LIMIT 1
            """
            
            verse_results = query_database(verse_check)
            if verse_results and verse_results[0].get('count', 0) > 0:
                if word not in [n[0] for n in all_names_to_update]:
                    romanization = KNOWN_BIBLICAL_NAMES.get(word, None)
                    if romanization:
                        all_names_to_update.append((word, word_id, romanization, 'unknown', None))
    
    # Remove duplicates
    seen = set()
    unique_names = []
    for word, word_id, romanization, current_type, current_pos in all_names_to_update:
        if word not in seen:
            seen.add(word)
            unique_names.append((word, word_id, romanization, current_type, current_pos))
    
    print(f"\n{'='*60}")
    print(f"✅ Found {len(unique_names)} unique names that need updating")
    print(f"{'='*60}\n")
    
    # Generate SQL
    sql_lines = [
        "-- Comprehensive update of biblical names",
        "-- Generated by comprehensive-name-search.py",
        f"-- Found {len(unique_names)} names that need updating",
        "",
    ]
    
    for word, word_id, romanization, current_type, current_pos in unique_names:
        if current_type is None:
            sql_lines.append(f"-- {word} (ID: {word_id}) - Insert: {romanization}")
            sql_lines.append(f"INSERT OR IGNORE INTO word_frequencies (pashto_word, word_type, pos, romanization, has_issues, issue_flags) VALUES ('{word}', 'proper_noun', 'n. prop.', '{romanization}', 0, '[]');")
        else:
            sql_lines.append(f"-- {word} (ID: {word_id}) - Update from {current_type}/{current_pos} to proper_noun: {romanization}")
            sql_lines.append(f"UPDATE word_frequencies SET word_type = 'proper_noun', pos = 'n. prop.', romanization = '{romanization}', has_issues = 0, issue_flags = '[]' WHERE pashto_word = '{word}';")
        sql_lines.append("")
    
    # Write SQL file
    sql_path = 'cloudflare/comprehensive-name-updates.sql'
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print(f"✅ Generated SQL file: {sql_path}")
    print(f"\nSummary:")
    print(f"  - Found {len(unique_names)} unique names")
    print(f"  - SQL file ready: {sql_path}")
    print(f"\nNext steps:")
    print(f"  1. Review {sql_path}")
    print(f"  2. Run: wrangler d1 execute pashto-bible-db --remote --file {sql_path}")

if __name__ == '__main__':
    main()


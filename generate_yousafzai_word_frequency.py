#!/usr/bin/env python3
"""Generate word frequency list for Yousafzai 2019 translation from Supabase verses_yousafzai table.

This script fetches all Yousafzai text from the Supabase database and generates a word frequency map
similar to the existing word_frequency_list.json but specifically for the Yousafzai translation.

Output schema (list of dicts):
  - pashto: str
  - frequency: int
  - romanization: str (from full_dictionary.json when available; otherwise empty)
  - pos: str (from dictionary lookup; otherwise 'unknown')
"""

import json
import os
import re
import requests
from collections import Counter
from typing import Dict, Any, List, Optional

# Configuration
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DICT_FILE = os.path.join(APP_ROOT, 'app', 'data', 'full_dictionary_enriched.json')
OUT_FILE = os.path.join(APP_ROOT, 'yousafzai_word_frequency_list.json')

# Supabase configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

def load_dictionary() -> Dict[str, Dict[str, Any]]:
    """Load the full dictionary and create a lookup map."""
    if not os.path.exists(DICT_FILE):
        print(f"Warning: Dictionary file not found at {DICT_FILE}")
        return {}
    
    try:
        with open(DICT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle LingDocs dictionary format
        if isinstance(data, dict) and 'entries' in data:
            entries = data['entries']
        elif isinstance(data, list):
            entries = data
        else:
            print("Warning: Unexpected dictionary format")
            return {}
        
        # Create lookup map
        dict_map = {}
        for entry in entries:
            pashto = entry.get('p', '')
            if pashto:
                dict_map[pashto] = {
                    'romanization': entry.get('g', ''),
                    'pos': entry.get('t', 'unknown')
                }
        
        print(f"Loaded {len(dict_map)} dictionary entries")
        return dict_map
        
    except Exception as e:
        print(f"Error loading dictionary: {e}")
        return {}

def fetch_yousafzai_text() -> str:
    """Fetch all Yousafzai text from Supabase verses_yousafzai table."""
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("Error: Missing Supabase credentials")
        print("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
        return ""
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json"
    }
    
    all_text = []
    page_size = 1000
    offset = 0
    
    print("Fetching Yousafzai text from Supabase...")
    
    while True:
        url = f"{SUPABASE_URL}/rest/v1/verses_yousafzai"
        params = {
            "select": "text",
            "limit": page_size,
            "offset": offset
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            verses = response.json()
            if not verses:
                break
            
            # Extract text from verses
            for verse in verses:
                text = verse.get('text', '')
                if text:
                    all_text.append(text)
            
            offset += len(verses)
            print(f"  Fetched {offset} verses...")
            
            if len(verses) < page_size:
                break
                
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            break
    
    combined_text = " ".join(all_text)
    print(f"Total text length: {len(combined_text)} characters")
    return combined_text

def tokenize_pashto_text(text: str) -> List[str]:
    """Tokenize Pashto text into words."""
    # Extract Pashto words using Unicode range for Arabic/Pashto script
    words = re.findall(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+', text)
    return words

def build_frequency_list(text: str, dict_map: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Build word frequency list from text."""
    print("Tokenizing text...")
    words = tokenize_pashto_text(text)
    
    print("Counting word frequencies...")
    word_counts = Counter(words)
    
    print("Building frequency list...")
    frequency_list = []
    
    for word, count in word_counts.items():
        dict_entry = dict_map.get(word, {})
        
        frequency_list.append({
            'pashto': word,
            'frequency': count,
            'romanization': dict_entry.get('romanization', ''),
            'pos': dict_entry.get('pos', 'unknown')
        })
    
    # Sort by frequency (descending)
    frequency_list.sort(key=lambda x: x['frequency'], reverse=True)
    
    return frequency_list

def main() -> int:
    """Main function to generate Yousafzai word frequency list."""
    print("Generating Yousafzai word frequency list...")
    
    # Load dictionary
    dict_map = load_dictionary()
    
    # Fetch Yousafzai text
    text = fetch_yousafzai_text()
    if not text:
        print("Error: No text retrieved")
        return 1
    
    # Build frequency list
    frequency_list = build_frequency_list(text, dict_map)
    
    # Save to file
    try:
        with open(OUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(frequency_list, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully wrote {len(frequency_list)} entries to {OUT_FILE}")
        
        # Print some statistics
        total_words = sum(entry['frequency'] for entry in frequency_list)
        unique_words = len(frequency_list)
        words_with_romanization = sum(1 for entry in frequency_list if entry['romanization'])
        words_with_pos = sum(1 for entry in frequency_list if entry['pos'] != 'unknown')
        
        print(f"\nStatistics:")
        print(f"  Total word occurrences: {total_words:,}")
        print(f"  Unique words: {unique_words:,}")
        print(f"  Words with romanization: {words_with_romanization:,}")
        print(f"  Words with POS tags: {words_with_pos:,}")
        
        # Show top 10 most frequent words
        print(f"\nTop 10 most frequent words:")
        for i, entry in enumerate(frequency_list[:10], 1):
            print(f"  {i:2d}. {entry['pashto']} ({entry['frequency']:,}) - {entry['romanization']} [{entry['pos']}]")
        
        return 0
        
    except Exception as e:
        print(f"Error writing output file: {e}")
        return 1

if __name__ == '__main__':
    exit(main())

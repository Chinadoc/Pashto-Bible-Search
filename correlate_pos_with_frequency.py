#!/usr/bin/env python3
"""
POS Correlation Script

This script correlates the word frequency list with the dictionary to determine
parts of speech, and infers POS for words not found in the dictionary.

Usage: python correlate_pos_with_frequency.py
"""

import json
import re
from collections import defaultdict
from typing import Dict, Any, List, Tuple

class POSCorrelator:
    def __init__(self):
        self.dictionary = {}
        self.frequency_data = []
        self.correlated_data = {}

    def load_dictionary(self):
        """Load the enriched dictionary"""
        print("📖 Loading dictionary...")

        try:
            with open('full_dictionary_enriched.json', 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Create lookup by Pashto word
            for entry in data['entries']:
                pashto = entry.get('p', '').strip()
                if pashto:
                    self.dictionary[pashto] = {
                        'english': entry.get('e', ''),
                        'pos': self._extract_pos(entry),
                        'romanization': entry.get('g', ''),
                        'gender': entry.get('gender', ''),
                        'pos_family': entry.get('pos_family', ''),
                        'f_primary': entry.get('f_primary', ''),
                    }

            print(f"✅ Loaded {len(self.dictionary)} dictionary entries")

        except Exception as e:
            print(f"❌ Error loading dictionary: {e}")
            self.dictionary = {}

    def _extract_pos(self, entry: Dict[str, Any]) -> str:
        """Extract part of speech from dictionary entry"""
        # Check various POS fields
        pos_fields = ['pos_family', 'f_primary']

        for field in pos_fields:
            pos = entry.get(field, '')
            if pos and pos != 'N/A':
                return pos

        # Try to infer from English definition
        english = entry.get('e', '').lower()
        if any(word in english for word in ['verb', 'to ', 'do ', 'make ', 'go ', 'come ', 'see ', 'hear ']):
            return 'Verb'
        elif any(word in english for word in ['noun', 'person', 'place', 'thing', 'animal', 'object']):
            return 'Noun'
        elif any(word in english for word in ['adjective', 'adj', 'descriptive', 'color', 'size', 'quality']):
            return 'Adjective'

        return 'Unknown'

    def load_frequency_data(self):
        """Load the word frequency list"""
        print("📊 Loading frequency data...")

        try:
            with open('word_frequency_list.json', 'r', encoding='utf-8') as f:
                self.frequency_data = json.load(f)

            print(f"✅ Loaded {len(self.frequency_data)} frequency entries")

        except Exception as e:
            print(f"❌ Error loading frequency data: {e}")
            self.frequency_data = []

    def infer_pos_for_unknown_words(self, word: str, frequency: int) -> str:
        """Infer part of speech for words not in dictionary"""
        # Pashto verb conjugation patterns
        verb_endings = [
            'م', 'ې', 'و', 'ي', 'و', 'ي',  # Present tense endings
            'لم', 'لو', 'لې', 'لې', 'ل', 'له',  # Past tense endings
            'وم', 'وو', 'وې', 'وې', 'و', 'وه',  # Perfect endings
        ]

        # Common verb stems and patterns
        if any(word.endswith(ending) for ending in verb_endings):
            return 'Verb'

        # Pashto noun/adjective patterns
        # Plural forms often end with انه، ونه، یان، etc.
        if any(word.endswith(pattern) for pattern in ['انه', 'ونه', 'یان', 'ګان', 'ګانو']):
            return 'Noun_Plural'

        # Feminine forms often end with ه، ې
        if word.endswith('ه') or word.endswith('ې'):
            return 'Noun_Feminine'

        # Adjective patterns (often end with ی، و، etc.)
        if word.endswith('ی') and len(word) > 2:
            return 'Adjective'

        # Common function words (particles, conjunctions, etc.)
        function_words = {
            'د', 'او', 'چې', 'کې', 'نه', 'هم', 'یا', 'خو', 'ځکه', 'نو',
            'بيا', 'تر', 'پورې', 'پر', 'له', 'سره', 'په', 'ته', 'څخه', 'پورې'
        }

        if word in function_words:
            return 'Particle'

        # Numbers and quantifiers
        if any(char.isdigit() for char in word) or word in ['یو', 'دو', 'درې', 'څلور', 'پنځه', 'شپږ', 'اووه', 'اته', 'نهه', 'لس']:
            return 'Numeral'

        # Pronouns
        pronouns = {
            'زه', 'ته', 'هغه', 'موږ', 'تاسو', 'هغوی', 'ما', 'تا', 'هغه',
            'موږ', 'تاسو', 'هغوی', 'خپل', 'بل', 'هر', 'ټول', 'ځینې'
        }

        if word in pronouns:
            return 'Pronoun'

        # Default assumption: likely a noun if not clearly something else
        # This is based on the fact that Pashto has many more nouns than other POS
        return 'Noun'

    def correlate_data(self):
        """Correlate frequency data with dictionary and infer POS"""
        print("🔗 Correlating frequency data with dictionary...")

        correlated = {}
        found_in_dict = 0
        inferred_pos = 0

        for freq_entry in self.frequency_data:
            word = freq_entry['pashto']

            # Try to find in dictionary
            if word in self.dictionary:
                dict_entry = self.dictionary[word]
                correlated[word] = {
                    'pashto': word,
                    'frequency': freq_entry['frequency'],
                    'romanization': dict_entry['romanization'] or freq_entry.get('romanization', ''),
                    'pos': dict_entry['pos'],
                    'english': dict_entry['english'],
                    'gender': dict_entry['gender'],
                    'pos_family': dict_entry['pos_family'],
                    'source': 'dictionary',
                    'confidence': 'high'
                }
                found_in_dict += 1

            else:
                # Infer POS for unknown words
                inferred_pos += 1
                pos = self.infer_pos_for_unknown_words(word, freq_entry['frequency'])

                correlated[word] = {
                    'pashto': word,
                    'frequency': freq_entry['frequency'],
                    'romanization': freq_entry.get('romanization', ''),
                    'pos': pos,
                    'english': f'Inferred {pos.lower()}',
                    'source': 'inference',
                    'confidence': 'medium'
                }

        self.correlated_data = correlated

        print(f"✅ Correlation complete:")
        print(f"  - Found in dictionary: {found_in_dict}")
        print(f"  - Inferred POS: {inferred_pos}")
        print(f"  - Total correlated: {len(correlated)}")

    def analyze_pos_distribution(self):
        """Analyze the distribution of parts of speech"""
        print("\n📊 POS Distribution Analysis:")

        pos_counts = defaultdict(int)
        for entry in self.correlated_data.values():
            pos_counts[entry['pos']] += 1

        # Sort by frequency
        sorted_pos = sorted(pos_counts.items(), key=lambda x: x[1], reverse=True)

        for pos, count in sorted_pos:
            percentage = (count / len(self.correlated_data)) * 100
            print(f"  {pos}: {count} words ({percentage:.1f}%)")

    def save_enhanced_frequency_data(self):
        """Save the enhanced frequency data with POS information"""
        print("💾 Saving enhanced frequency data...")

        # Convert to the format expected by the migration
        enhanced_data = []
        for entry in self.correlated_data.values():
            enhanced_data.append({
                'pashto_word': entry['pashto'],
                'total_frequency': entry['frequency'],
                'ot_frequency': 0,  # Will be filled by migration
                'nt_frequency': 0,  # Will be filled by migration
                'romanization': entry['romanization'],
                'pos': entry['pos'],
                'english_translation': entry['english'],
                'metadata': {
                    'source': entry['source'],
                    'confidence': entry['confidence'],
                    'gender': entry.get('gender', ''),
                    'pos_family': entry.get('pos_family', '')
                }
            })

        # Sort by frequency (descending)
        enhanced_data.sort(key=lambda x: x['total_frequency'], reverse=True)

        output_file = 'word_frequencies_enhanced.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(enhanced_data, f, ensure_ascii=False, indent=2)

        print(f"✅ Saved enhanced data to {output_file}")

    def run(self):
        """Run the complete correlation process"""
        print("🚀 Starting POS correlation process...")

        self.load_dictionary()
        self.load_frequency_data()
        self.correlate_data()
        self.analyze_pos_distribution()
        self.save_enhanced_frequency_data()

        print("\n✅ POS correlation complete!")
        print("\n📋 Next steps:")
        print("1. Review the enhanced frequency data")
        print("2. Use this data in your migration")
        print("3. The system now has proper POS classification!")

if __name__ == "__main__":
    correlator = POSCorrelator()
    correlator.run()

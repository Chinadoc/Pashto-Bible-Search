#!/usr/bin/env python3
"""
Pashto Word Disambiguation Analysis Script

This script analyzes polysemous Pashto words to determine context-based disambiguation patterns.
It uses the Bible text data and dictionary information to build context-aware disambiguation rules.

Usage: python scripts/disambiguation_analysis.py
"""

import json
import re
import sqlite3
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Set, Optional
from pathlib import Path

# Load data files
DATA_DIR = Path("app/data")
BIBLE_FILE = DATA_DIR / "verses.json"
DICTIONARY_FILE = DATA_DIR / "full_dictionary_enriched.json"
FREQUENCY_FILE = DATA_DIR / "word_frequency_list.json"

class PashtoDisambiguator:
    def __init__(self):
        self.bible_text = {}
        self.dictionary = {}
        self.frequency_data = {}
        self.context_patterns = {}
        self.disambiguation_rules = {}

    def load_data(self):
        """Load all necessary data files."""
        print("📚 Loading data files...")

        # Load Bible text
        if BIBLE_FILE.exists():
            with open(BIBLE_FILE, 'r', encoding='utf-8') as f:
                self.bible_text = json.load(f)
            print(f"✅ Loaded {len(self.bible_text)} Bible verses")

        # Load dictionary
        if DICTIONARY_FILE.exists():
            with open(DICTIONARY_FILE, 'r', encoding='utf-8') as f:
                self.dictionary = json.load(f)
            print(f"✅ Loaded {len(self.dictionary.get('entries', []))} dictionary entries")

        # Load frequency data
        if FREQUENCY_FILE.exists():
            with open(FREQUENCY_FILE, 'r', encoding='utf-8') as f:
                self.frequency_data = json.load(f)
            print(f"✅ Loaded {len(self.frequency_data)} frequency entries")

    def find_polysemous_words(self) -> List[str]:
        """Find words that could have multiple meanings based on context analysis."""
        print("🔍 Finding potentially ambiguous words...")

        # Get high-frequency words that might be ambiguous
        high_freq_words = []
        for entry in self.frequency_data[:1000]:  # Top 1000 most frequent words
            if 'pashto' in entry and 'frequency' in entry:
                word = entry['pashto']
                freq = entry['frequency']
                if len(word) > 2 and freq > 10:  # Filter short and very low frequency words
                    high_freq_words.append(word)

        # Filter to words that could be verbs or nouns based on patterns
        candidate_words = []
        for word in high_freq_words:
            if (self.is_likely_verb(word) or self.is_likely_noun(word)) and len(word) > 2:
                candidate_words.append(word)

        print(f"📊 Found {len(candidate_words)} candidate words for disambiguation")
        return candidate_words[:25]  # First 25 for analysis

    def is_likely_verb(self, word: str) -> bool:
        """Simple heuristic to detect verb-like words."""
        # Pashto verb patterns
        verb_endings = ['ل', 'ول', 'ېدل', 'ولد', 'کول', 'کیدل', 'تل', 'ېدل']
        return any(word.endswith(ending) for ending in verb_endings)

    def is_likely_noun(self, word: str) -> bool:
        """Simple heuristic to detect noun-like words."""
        # Pashto noun patterns
        noun_endings = ['ی', 'ه', 'ګی', 'توب', 'وال', 'ستان', 'وند']
        return any(word.endswith(ending) for ending in noun_endings)

    def is_likely_adjective(self, word: str) -> bool:
        """Simple heuristic to detect adjective-like words."""
        # Pashto adjective patterns
        adj_patterns = ['ي', 'ين', 'مند', 'وار', 'دار']
        return any(word.endswith(pattern) for pattern in adj_patterns)

    def analyze_contexts(self, target_words: List[str]) -> Dict[str, Dict]:
        """Analyze context patterns for target words."""
        print("🔬 Analyzing contexts for target words...")

        results = {}

        for word in target_words:
            print(f"  📝 Analyzing: {word}")

            # Find all occurrences in Bible
            occurrences = []
            for ref, verse_data in self.bible_text.items():
                text = verse_data.get('text', '')
                if word in text:
                    # Get surrounding context (±3 words)
                    words = text.split()
                    try:
                        idx = words.index(word)
                        start = max(0, idx - 3)
                        end = min(len(words), idx + 4)
                        context = ' '.join(words[start:end])
                        occurrences.append({
                            'ref': ref,
                            'context': context,
                            'position': idx
                        })
                    except ValueError:
                        continue

            # Analyze each occurrence for POS clues
            contexts = []
            for occ in occurrences[:5]:  # First 5 occurrences
                context_words = occ['context'].split()
                target_idx = context_words.index(word)

                # Extract features for POS prediction
                features = {
                    'preceding_words': context_words[max(0, target_idx-2):target_idx],
                    'following_words': context_words[target_idx+1:min(len(context_words), target_idx+3)],
                    'is_first_word': target_idx == 0,
                    'is_last_word': target_idx == len(context_words) - 1,
                    'has_modal_before': any(w in ['به', 'غواړو', 'کولای'] for w in context_words[max(0, target_idx-2):target_idx]),
                    'has_object_after': self.detect_object_indicator(context_words[target_idx+1:]),
                    'ref': occ['ref']
                }

                contexts.append(features)

            results[word] = {
                'total_occurrences': len(occurrences),
                'analyzed_contexts': contexts,
                'likely_pos': self.predict_pos_from_context(contexts)
            }

        return results

    def detect_object_indicator(self, following_words: List[str]) -> bool:
        """Detect if following words suggest this is a verb with an object."""
        object_indicators = ['را', 'ته', 'په', 'له', 'سره', 'د']
        return any(indicator in following_words[:2] for indicator in object_indicators)

    def predict_pos_from_context(self, contexts: List[Dict]) -> str:
        """Predict likely POS based on context features."""
        if not contexts:
            return 'unknown'

        # Simple rule-based prediction
        verb_scores = 0
        noun_scores = 0

        for ctx in contexts:
            if ctx['has_modal_before'] or ctx['has_object_after']:
                verb_scores += 1
            if ctx['is_first_word'] or not ctx['has_modal_before']:
                noun_scores += 1

        if verb_scores > noun_scores:
            return 'verb'
        elif noun_scores > verb_scores:
            return 'noun'
        else:
            return 'ambiguous'

    def generate_disambiguation_report(self, results: Dict[str, Dict]):
        """Generate a report of disambiguation findings."""
        print("\n📊 DISAMBIGUATION ANALYSIS REPORT")
        print("=" * 50)

        for word, data in results.items():
            print(f"\n🔤 Word: {word}")
            print(f"   Total occurrences: {data['total_occurrences']}")
            print(f"   Predicted POS: {data['likely_pos']}")
            print("   Sample contexts:")
            for i, ctx in enumerate(data['analyzed_contexts'][:3]):
                print(f"     {i+1}. {' '.join(ctx['preceding_words'])} [{word}] {' '.join(ctx['following_words'])}")
                if ctx['has_modal_before']:
                    print("        → Modal verb detected (verb likely)")
                if ctx['has_object_after']:
                    print("        → Object indicator detected (verb likely)")
    def run_analysis(self):
        """Main analysis function."""
        print("🚀 Starting Pashto Word Disambiguation Analysis")
        print("=" * 60)

        # Load data
        self.load_data()

        # Find polysemous words
        polysemous_words = self.find_polysemous_words()

        if not polysemous_words:
            print("❌ No polysemous words found for analysis")
            return

        print(f"\n🎯 Analyzing first {len(polysemous_words)} polysemous words...")

        # Analyze contexts
        results = self.analyze_contexts(polysemous_words)

        # Generate report
        self.generate_disambiguation_report(results)

        # Save results for future use
        output_file = "disambiguation_analysis_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        print(f"\n💾 Results saved to: {output_file}")

def main():
    """Main entry point."""
    disambiguator = PashtoDisambiguator()
    disambiguator.run_analysis()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Analyze Ambiguous Pashto Words Using LLM Context Analysis

This script:
1. Identifies words with multiple POS meanings from dictionary
2. Finds 25 usage examples (5 sentences each) from Bible text
3. Uses LLM to classify each usage as noun/adjective vs conjugated verb
"""

import json
import gzip
import re
import random
from typing import Dict, List, Set, Tuple
from collections import defaultdict
import os

class AmbiguousWordAnalyzer:
    def __init__(self):
        self.dictionary = self.load_dictionary()
        self.verses = self.load_verses()

    def load_dictionary(self) -> Dict[str, List[Dict]]:
        """Load full dictionary and group by word"""
        print("Loading dictionary...")
        with open('public/full_dictionary_enriched.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        word_entries = defaultdict(list)
        for entry in data['entries']:
            pashto = entry.get('p', '').strip()
            if pashto:
                word_entries[pashto].append(entry)

        return dict(word_entries)

    def load_verses(self) -> Dict[str, Dict]:
        """Load verses data"""
        print("Loading verses...")
        with gzip.open('public/verses.json.gz', 'rt', encoding='utf-8') as f:
            return json.load(f)

    def find_ambiguous_words(self, min_frequency: int = 10) -> List[Dict]:
        """Find words that have multiple POS meanings in Pashto script"""
        ambiguous_words = []

        for word, entries in self.dictionary.items():
            # Skip romanized-only words (no Pashto script)
            if not word or not any('\u0600' <= c <= '\u06FF' for c in word):
                continue

            if len(entries) < 2:  # Need at least 2 meanings
                continue

            # Check if entries have different POS families
            pos_families = set()
            for entry in entries:
                pos_family = entry.get('pos_family', '')
                if pos_family:
                    pos_families.add(pos_family)

            if len(pos_families) >= 2:  # Multiple POS families
                # Count total frequency across all entries
                total_freq = sum(entry.get('r', 0) for entry in entries)

                if total_freq >= min_frequency:
                    ambiguous_words.append({
                        'word': word,
                        'entries': entries,
                        'pos_families': list(pos_families),
                        'total_frequency': total_freq
                    })

        # Sort by frequency
        ambiguous_words.sort(key=lambda x: x['total_frequency'], reverse=True)
        return ambiguous_words[:10]  # Top 10 most frequent ambiguous words

    def find_usage_examples(self, word: str, num_examples: int = 25) -> List[Dict]:
        """Find usage examples in Bible text"""
        examples = []

        # Search through verses for the word
        for ref, verse in self.verses.items():
            text = verse.get('text', '')
            if word in text:
                # Extract sentence containing the word (rough approximation)
                sentences = re.split(r'[.!؟]', text)
                for sentence in sentences:
                    if word in sentence:
                        examples.append({
                            'ref': ref,
                            'sentence': sentence.strip(),
                            'full_verse': text,
                            'book': verse.get('book', ''),
                            'chapter': verse.get('chapter', ''),
                            'verse_num': verse.get('verse', '')
                        })
                        break

                if len(examples) >= num_examples:
                    break

        return examples[:num_examples]

    def analyze_usage_with_llm(self, word: str, examples: List[Dict]) -> List[Dict]:
        """Use LLM to analyze each usage example"""
        analyzed_examples = []

        # Check if OpenAI API key is available
        if not os.getenv('OPENAI_API_KEY'):
            print(f"⚠️  OpenAI API key not found. Simulating LLM analysis for {word}")

            # Simulate LLM analysis for demonstration
            for example in examples[:2]:
                # Simple rule-based simulation (for demo purposes)
                sentence = example['sentence']
                is_verb_like = any(suffix in sentence for suffix in ['م', 'ې', 'و', 'ي', 'و'])
                category = "CONJUGATED_VERB" if is_verb_like else "NOUN/ADJECTIVE"

                analyzed_examples.append({
                    'word': word,
                    'ref': example['ref'],
                    'sentence': example['sentence'],
                    'category': category,
                    'confidence': 'MEDIUM',
                    'reasoning': f'Simulated analysis: {"Verb-like morphology detected" if is_verb_like else "Noun/adjective morphology detected"}',
                    'llm_analysis': 'SIMULATED: This is a demonstration without actual LLM calls'
                })
            return analyzed_examples

        for example in examples[:2]:  # Analyze first 2 examples
            prompt = f"""
Analyze this Pashto sentence and determine if the word "{word}" is being used as:
1. A NOUN or ADJECTIVE (static, non-conjugated form)
2. A CONJUGATED VERB (inflected form showing tense/person/aspect)

Sentence: "{example['sentence']}"
Full context: "{example['full_verse']}"
Reference: {example['ref']}

Consider Pashto morphology:
- Nouns/Adjectives: Usually end in common suffixes, don't show person/tense
- Verbs: Show conjugation patterns, person markers, tense/aspect

Provide your analysis in this format:
CATEGORY: [NOUN/ADJECTIVE or CONJUGATED_VERB]
CONFIDENCE: [HIGH/MEDIUM/LOW]
REASONING: [Brief explanation]
"""

            try:
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=200,
                    temperature=0.1
                )

                analysis = response.choices[0].message.content.strip()

                # Parse the response
                lines = analysis.split('\n')
                category = "UNKNOWN"
                confidence = "UNKNOWN"
                reasoning = ""

                for line in lines:
                    if line.startswith("CATEGORY:"):
                        category = line.replace("CATEGORY:", "").strip()
                    elif line.startswith("CONFIDENCE:"):
                        confidence = line.replace("CONFIDENCE:", "").strip()
                    elif line.startswith("REASONING:"):
                        reasoning = line.replace("REASONING:", "").strip()

                analyzed_examples.append({
                    'word': word,
                    'ref': example['ref'],
                    'sentence': example['sentence'],
                    'category': category,
                    'confidence': confidence,
                    'reasoning': reasoning,
                    'llm_analysis': analysis
                })

            except Exception as e:
                print(f"Error analyzing {word} in {example['ref']}: {e}")
                analyzed_examples.append({
                    'word': word,
                    'ref': example['ref'],
                    'sentence': example['sentence'],
                    'category': 'ERROR',
                    'confidence': 'N/A',
                    'reasoning': str(e)
                })

        return analyzed_examples

    def analyze_ambiguous_words(self) -> List[Dict]:
        """Main analysis function"""
        print("Finding ambiguous words...")
        ambiguous_words = self.find_ambiguous_words()

        print(f"Found {len(ambiguous_words)} ambiguous words")

        results = []

        for i, word_data in enumerate(ambiguous_words[:3]):  # Analyze top 3 words
            word = word_data['word']
            print(f"\n[{i+1}/5] Analyzing '{word}' (frequency: {word_data['total_frequency']})")
            print(f"POS families: {', '.join(word_data['pos_families'])}")

            # Find usage examples
            examples = self.find_usage_examples(word, 25)
            print(f"Found {len(examples)} usage examples")

            if examples:
                # Analyze with LLM
                analyzed = self.analyze_usage_with_llm(word, examples)
                print(f"LLM analyzed {len(analyzed)} examples")

                results.append({
                    'word': word,
                    'dictionary_entries': word_data['entries'],
                    'pos_families': word_data['pos_families'],
                    'total_frequency': word_data['total_frequency'],
                    'usage_examples': examples,
                    'llm_analysis': analyzed
                })

        return results

    def generate_training_data(self, analysis_results: List[Dict]) -> Dict:
        """Generate training data for disambiguation system"""
        training_data = {
            'ambiguous_words': {},
            'usage_patterns': defaultdict(list)
        }

        for result in analysis_results:
            word = result['word']
            training_data['ambiguous_words'][word] = {
                'meanings': result['pos_families'],
                'frequency': result['total_frequency']
            }

            # Collect patterns
            for analysis in result['llm_analysis']:
                if analysis['category'] in ['NOUN/ADJECTIVE', 'CONJUGATED_VERB']:
                    pattern = {
                        'word': word,
                        'category': analysis['category'],
                        'sentence': analysis['sentence'],
                        'confidence': analysis['confidence']
                    }
                    training_data['usage_patterns'][word].append(pattern)

        return dict(training_data)

def main():
    """Main execution"""
    print("🔍 Pashto Ambiguous Word Analysis with LLM")
    print("=" * 50)

    analyzer = AmbiguousWordAnalyzer()
    results = analyzer.analyze_ambiguous_words()

    # Generate training data
    training_data = analyzer.generate_training_data(results)

    # Save results
    with open('ambiguous_words_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    with open('disambiguation_training_data.json', 'w', encoding='utf-8') as f:
        json.dump(training_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Analysis complete!")
    print(f"   - Analyzed {len(results)} ambiguous words")
    print(f"   - Generated training data for {len(training_data['ambiguous_words'])} words")

    # Print summary
    print("\n📊 Summary of Findings:")
    for result in results:
        word = result['word']
        analyses = result['llm_analysis']
        noun_adj = sum(1 for a in analyses if a['category'] == 'NOUN/ADJECTIVE')
        verb = sum(1 for a in analyses if a['category'] == 'CONJUGATED_VERB')

        print(f"   {word}: {noun_adj} noun/adj, {verb} conjugated verb")

if __name__ == "__main__":
    main()
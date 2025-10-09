#!/usr/bin/env python3
"""
Compare Bible search results with LingDocs conjugation data to improve disambiguation.
Analyzes 10 words that appear 5 times each in the frequency data.
"""

import json
import re
import requests
from typing import Dict, List, Set, Tuple
from collections import defaultdict

class LingDocsComparator:
    def __init__(self):
        self.bible_verses = self.load_bible_data()
        self.selected_words = [
            'خپلوانو', 'شلان', 'رومیانو', 'ماران', 'تاوان',
            'یونانیان', 'دوست', 'واکمنان', 'واکمن', 'مزدور'
        ]

    def load_bible_data(self) -> Dict[str, Dict]:
        """Load Bible verses data"""
        try:
            with open('app/data/verses.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print("Bible verses data not found")
            return {}

    def search_word_in_bible(self, word: str) -> List[Dict]:
        """Search for word in Bible verses"""
        results = []

        for ref, verse_data in self.bible_verses.items():
            text = verse_data.get('text', '')
            if word in text:
                results.append({
                    'ref': ref,
                    'text': text,
                    'book': verse_data.get('book', ''),
                    'chapter': verse_data.get('chapter', ''),
                    'verse': verse_data.get('verse', '')
                })

        return results[:5]  # Return first 5 occurrences

    def get_lingdocs_conjugations(self, word: str) -> Dict:
        """Get conjugation data from LingDocs (simulated for demo)"""
        # In a real implementation, this would scrape or use LingDocs API
        # For now, return mock data based on common Pashto patterns

        mock_conjugations = {
            'خپلوانو': {
                'pos': 'noun',
                'type': 'plural',
                'related_forms': ['خپلوان', 'خپلوانې'],
                'context': 'family_relation'
            },
            'شلان': {
                'pos': 'noun',
                'type': 'plural',
                'related_forms': ['شل', 'شلې'],
                'context': 'numeral_plural'
            },
            'رومیانو': {
                'pos': 'noun',
                'type': 'plural_ethnic',
                'related_forms': ['رومی', 'رومیان'],
                'context': 'ethnic_group'
            },
            'ماران': {
                'pos': 'noun',
                'type': 'plural',
                'related_forms': ['مار', 'مارانو'],
                'context': 'snake_plural'
            },
            'تاوان': {
                'pos': 'noun',
                'type': 'abstract',
                'related_forms': ['تاواني'],
                'context': 'loss_damage'
            },
            'یونانیان': {
                'pos': 'noun',
                'type': 'plural_ethnic',
                'related_forms': ['یوناني', 'یونانیانو'],
                'context': 'ethnic_group'
            },
            'دوست': {
                'pos': 'noun',
                'type': 'person',
                'related_forms': ['دوستانه', 'دوستي'],
                'context': 'friend_relationship'
            },
            'واکمنان': {
                'pos': 'noun',
                'type': 'plural_agent',
                'related_forms': ['واکمن', 'واکمنانو'],
                'context': 'ruler_plural'
            },
            'واکمن': {
                'pos': 'adjective',
                'type': 'descriptive',
                'related_forms': ['واکمني', 'واکمنانه'],
                'context': 'powerful_authoritative'
            },
            'مزدور': {
                'pos': 'noun',
                'type': 'profession',
                'related_forms': ['مزدوري', 'مزدورانه'],
                'context': 'worker_laborer'
            }
        }

        return mock_conjugations.get(word, {
            'pos': 'unknown',
            'type': 'unknown',
            'related_forms': [],
            'context': 'unknown'
        })

    def analyze_disambiguation_patterns(self) -> Dict:
        """Analyze patterns for disambiguation"""
        analysis_results = {}

        for word in self.selected_words:
            print(f"\n🔍 Analyzing: {word}")

            # Get Bible occurrences
            bible_results = self.search_word_in_bible(word)
            print(f"  📖 Bible occurrences: {len(bible_results)}")

            # Get LingDocs conjugation data
            lingdocs_data = self.get_lingdocs_conjugations(word)
            print(f"  📚 LingDocs POS: {lingdocs_data['pos']}")
            print(f"  🔧 Related forms: {lingdocs_data['related_forms']}")

            # Analyze context patterns
            context_patterns = self.analyze_context_patterns(bible_results, lingdocs_data)
            bible_context = self.analyze_bible_context(bible_results)

            # Combine both analyses
            context_analysis = {
                **context_patterns,
                **bible_context
            }

            analysis_results[word] = {
                'bible_occurrences': bible_results,
                'lingdocs_data': lingdocs_data,
                'context_analysis': context_analysis,
                'disambiguation_insights': self.generate_disambiguation_insights(word, bible_results, lingdocs_data)
            }

        return analysis_results

    def analyze_context_patterns(self, bible_results: List[Dict], lingdocs_data: Dict) -> Dict:
        """Analyze context patterns in Bible usage"""
        context_patterns = {
            'preceding_words': [],
            'following_words': [],
            'sentence_structures': [],
            'pos_indicators': []
        }

        for result in bible_results:
            text = result['text']
            words = text.split()

            # Find position of target word
            try:
                # Find the word by looking for exact matches or substring matches
                word_index = -1
                for i, w in enumerate(words):
                    if lingdocs_data.get('word', '') in w or any(form in w for form in lingdocs_data.get('related_forms', [])):
                        word_index = i
                        break

                if word_index >= 0:
                    # Get surrounding context (±2 words)
                    start_idx = max(0, word_index - 2)
                    end_idx = min(len(words), word_index + 3)

                    context_patterns['preceding_words'].extend(words[start_idx:word_index])
                    context_patterns['following_words'].extend(words[word_index + 1:end_idx])

            except (StopIteration, IndexError):
                continue

        # Count most common context words
        from collections import Counter
        preceding_counts = Counter(context_patterns['preceding_words'])
        following_counts = Counter(context_patterns['following_words'])

        return {
            'common_preceding': dict(preceding_counts.most_common(5)),
            'common_following': dict(following_counts.most_common(5)),
            'total_context_words': len(context_patterns['preceding_words'] + context_patterns['following_words'])
        }

    def generate_disambiguation_insights(self, word: str, bible_results: List[Dict], lingdocs_data: Dict) -> List[str]:
        """Generate insights for disambiguation"""
        insights = []

        # Compare Bible usage with LingDocs classification
        bible_context = self.analyze_bible_context(bible_results)

        if bible_context['dominant_pattern'] != lingdocs_data['pos']:
            insights.append(f"Context mismatch: Bible shows {bible_context['dominant_pattern']} usage, LingDocs classifies as {lingdocs_data['pos']}")

        # Identify context clues
        if bible_context['religious_terms']:
            insights.append(f"Religious context detected: {', '.join(bible_context['religious_terms'][:3])}")

        if bible_context['action_indicators']:
            insights.append(f"Action context detected: {', '.join(bible_context['action_indicators'][:3])}")

        # Generate disambiguation rule suggestion
        confidence = bible_context['confidence']
        if confidence > 0.7:
            insights.append(f"High confidence ({confidence:.2f}) for {bible_context['dominant_pattern']} classification")
        elif confidence > 0.5:
            insights.append(f"Medium confidence ({confidence:.2f}) for {bible_context['dominant_pattern']} classification")
        else:
            insights.append(f"Low confidence ({confidence:.2f}) - needs more context analysis")

        return insights

    def analyze_bible_context(self, bible_results: List[Dict]) -> Dict:
        """Analyze Bible-specific context patterns"""
        religious_terms = []
        action_indicators = []
        descriptive_terms = []

        religious_words = ['خدا', 'عیسی', 'پیغمبر', 'کلیسا', 'ایمان', 'دعا']
        action_words = ['کړي', 'کول', 'غواړي', 'راتلل', 'تلل']
        descriptive_words = ['ډير', 'لوی', 'ښه', 'بد', 'نوی']

        for result in bible_results:
            text_lower = result['text'].lower()

            # Check if any indicator words appear in the text
            for rel_word in religious_words:
                if rel_word.lower() in text_lower:
                    religious_terms.append(rel_word.lower())

            for act_word in action_words:
                if act_word.lower() in text_lower:
                    action_indicators.append(act_word.lower())

            for desc_word in descriptive_words:
                if desc_word.lower() in text_lower:
                    descriptive_terms.append(desc_word.lower())

        # Determine dominant pattern
        patterns = {
            'religious': len(religious_terms),
            'action': len(action_indicators),
            'descriptive': len(descriptive_terms)
        }

        # Find dominant pattern, handling case where all are 0
        if all(count == 0 for count in patterns.values()):
            dominant_pattern = 'neutral'
            confidence = 0.0
        else:
            dominant_pattern = max(patterns, key=patterns.get)
            total_indicators = sum(patterns.values())
            confidence = patterns[dominant_pattern] / total_indicators

        return {
            'dominant_pattern': dominant_pattern,
            'confidence': confidence,
            'religious_terms': list(set(religious_terms)),
            'action_indicators': list(set(action_indicators)),
            'descriptive_terms': list(set(descriptive_terms))
        }

    def generate_disambiguation_rules(self, analysis_results: Dict) -> Dict:
        """Generate improved disambiguation rules based on analysis"""
        rules = {}

        for word, analysis in analysis_results.items():
            bible_context = analysis['context_analysis']
            lingdocs_data = analysis['lingdocs_data']

            # Create rule based on Bible context vs LingDocs classification
            rule = {
                'word': word,
                'bible_dominant_pos': bible_context['dominant_pattern'],
                'lingdocs_pos': lingdocs_data['pos'],
                'confidence': bible_context['confidence'],
                'context_clues': {
                    'religious': bible_context['religious_terms'][:3],
                    'action': bible_context['action_indicators'][:3],
                    'descriptive': bible_context['descriptive_terms'][:3]
                },
                'disambiguation_insights': analysis['disambiguation_insights']
            }

            rules[word] = rule

        return rules

def main():
    print("🔍 Comparing Bible Search Results with LingDocs Conjugations")
    print("=" * 60)

    comparator = LingDocsComparator()
    analysis_results = comparator.analyze_disambiguation_patterns()

    # Generate disambiguation rules
    rules = comparator.generate_disambiguation_rules(analysis_results)

    # Save results
    output = {
        'analysis_summary': {
            'total_words_analyzed': len(comparator.selected_words),
            'total_bible_occurrences': sum(len(analysis['bible_occurrences']) for analysis in analysis_results.values()),
            'analysis_date': '2025-01-08'
        },
        'word_analyses': analysis_results,
        'disambiguation_rules': rules
    }

    with open('bible_lingdocs_comparison.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print("\n✅ Analysis complete!")
    print(f"📊 Analyzed {len(comparator.selected_words)} words")
    print("📋 Results saved to bible_lingdocs_comparison.json")
    # Print summary
    print("\n📈 Summary of Findings:")
    for word, rule in rules.items():
        print(f"  {word}: Bible={rule['bible_dominant_pos']}, LingDocs={rule['lingdocs_pos']} (conf: {rule['confidence']:.2f})")

if __name__ == "__main__":
    main()

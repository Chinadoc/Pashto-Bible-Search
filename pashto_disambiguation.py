#!/usr/bin/env python3
"""
Pashto Word Sense Disambiguation System
Analyzes context to determine correct meaning of ambiguous words
"""

import re
from typing import Dict, List, Set, Tuple
from collections import defaultdict

class PashtoDisambiguator:
    def __init__(self):
        # Define ambiguous word forms and their possible meanings
        self.ambiguous_words = {
            'بوځ': [
                {'meaning': 'angry, infuriated', 'pos': 'adjective', 'context': ['خشم', 'غضب', 'برائت']},
                {'meaning': 'sticking out, pricked up', 'pos': 'adjective', 'context': ['ګوګوشتکې', 'سترګې', 'موئے']},
                {'meaning': 'to take/bring (imperative)', 'pos': 'verb', 'context': ['بیا', 'راځه', 'وباسه']}
            ],
            'دين': [
                {'meaning': 'religion, faith', 'pos': 'noun', 'context': ['اسلام', 'ايمان', 'عبادت', 'الله']},
                {'meaning': 'beautiful (inflected form)', 'pos': 'adjective', 'context': ['ښکلې', 'نازنينه', 'خوشحاله']}
            ],
            'راځه': [
                {'meaning': 'come (imperative)', 'pos': 'verb', 'context': ['بیا', 'راشه', 'خوشامدید']},
                {'meaning': 'bring (causative)', 'pos': 'verb', 'context': ['بیا', 'وباسه', 'راوله']}
            ]
        }

        # Context windows for analysis
        self.context_window = 3  # words before and after

    def tokenize_pashto(self, text: str) -> List[str]:
        """Tokenize Pashto text into words"""
        # Simple tokenization - split on whitespace and punctuation
        words = re.findall(r'[\u0600-\u06FF]+', text)
        return words

    def get_context_window(self, words: List[str], target_index: int) -> List[str]:
        """Get words within context window around target word"""
        start = max(0, target_index - self.context_window)
        end = min(len(words), target_index + self.context_window + 1)
        return words[start:end]

    def score_meaning(self, meaning: Dict, context_words: List[str]) -> float:
        """Score how well a meaning fits the context"""
        score = 0.0
        context_terms = set(meaning.get('context', []))

        # Count context matches
        matches = sum(1 for word in context_words if word in context_terms)
        score += matches * 2.0  # Weight context matches heavily

        # POS compatibility (if we had POS tagging)
        # This would add more scoring logic

        return score

    def disambiguate_word(self, word: str, sentence: str) -> Dict:
        """Disambiguate a word based on sentence context"""
        if word not in self.ambiguous_words:
            return {'word': word, 'disambiguation': 'not_ambiguous'}

        words = self.tokenize_pashto(sentence)
        target_index = -1

        # Find the target word in the sentence
        for i, w in enumerate(words):
            if w == word:
                target_index = i
                break

        if target_index == -1:
            return {'word': word, 'disambiguation': 'word_not_found'}

        # Get context window
        context_words = self.get_context_window(words, target_index)

        # Score each possible meaning
        scored_meanings = []
        for meaning in self.ambiguous_words[word]:
            score = self.score_meaning(meaning, context_words)
            scored_meanings.append({
                'meaning': meaning['meaning'],
                'pos': meaning['pos'],
                'score': score,
                'context_words': context_words
            })

        # Sort by score (highest first)
        scored_meanings.sort(key=lambda x: x['score'], reverse=True)

        return {
            'word': word,
            'sentence': sentence,
            'context_window': context_words,
            'possible_meanings': scored_meanings,
            'best_guess': scored_meanings[0] if scored_meanings else None,
            'confidence': scored_meanings[0]['score'] if scored_meanings else 0
        }

    def analyze_sentence(self, sentence: str) -> List[Dict]:
        """Analyze all potentially ambiguous words in a sentence"""
        words = self.tokenize_pashto(sentence)
        results = []

        for word in words:
            if word in self.ambiguous_words:
                result = self.disambiguate_word(word, sentence)
                results.append(result)

        return results

# Example usage
if __name__ == "__main__":
    disambiguator = PashtoDisambiguator()

    # Test sentences with ambiguous words
    test_sentences = [
        "د الله پاک زوی بوځ دی",  # بوځ as angry (divine wrath)
        "هغې د نقاب نه شاته ستا سترګې بوځ ګوګوشتکې دينه",  # بوځ as pricked up, دين as beautiful
        "راځه دلته او کتاب راوله",  # راځه as come
        "راځه او خپل ملګري هم بیا",  # راځه as bring (causative)
        "دين او ايمان زموږ ژوند دی"  # دين as religion
    ]

    for sentence in test_sentences:
        print(f"\nAnalyzing: {sentence}")
        print("-" * 50)

        results = disambiguator.analyze_sentence(sentence)

        if not results:
            print("No ambiguous words found")
            continue

        for result in results:
            print(f"Word: {result['word']}")
            print(f"Best meaning: {result['best_guess']['meaning'] if result['best_guess'] else 'Unknown'}")
            print(f"Confidence score: {result.get('confidence', 0)}")
            print(f"Context: {' '.join(result.get('context_window', []))}")
            print()


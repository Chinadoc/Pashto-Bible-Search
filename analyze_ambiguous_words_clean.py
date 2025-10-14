#!/usr/bin/env python3
"""
Analyze word frequency data to identify ambiguous words and extract context samples
for building a disambiguation system.
"""

import json
import re
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Set

def load_word_frequencies() -> Dict[str, int]:
    """Load word frequency data"""
    try:
        with open('word_frequency_list.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return {item['pashto']: item['frequency'] for item in data if item.get('pashto')}
    except FileNotFoundError:
        print("word_frequency_list.json not found")
        return {}

def load_bible_verses() -> Dict[str, Dict]:
    """Load Bible verses for context analysis"""
    try:
        with open('app/data/verses.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("verses.json not found")
        return {}

def find_ambiguous_words(word_freq: Dict[str, int], min_frequency: int = 10) -> List[Tuple[str, int]]:
    """
    Find words that appear frequently enough to warrant disambiguation analysis.
    For now, we'll manually identify known ambiguous words since frequency alone
    doesn't tell us about ambiguity.
    """
    # Known ambiguous words in Pashto that can be both nouns and verbs
    known_ambiguous = [
        'بوځو',  # angry (adj) vs to take/bring (verb)
        'کار',   # work (noun) vs to do/work (verb)
        'ماشوم', # child (noun) vs childish (adj)
        'ښه',    # good (adj) vs well (adv)
        'بد',    # bad (adj) vs badly (adv)
        'لوی',   # big (adj) vs greatly (adv)
        'کوچنی', # small (adj) vs little (adv)
    ]

    frequent_ambiguous = []
    for word in known_ambiguous:
        if word in word_freq and word_freq[word] >= min_frequency:
            frequent_ambiguous.append((word, word_freq[word]))

    return sorted(frequent_ambiguous, key=lambda x: x[1], reverse=True)

def extract_sentences_with_word(verses: Dict[str, Dict], target_word: str, max_sentences: int = 5) -> List[str]:
    """Extract sentences containing the target word"""
    sentences = []

    for ref, verse_data in verses.items():
        text = verse_data.get('text', '')
        if not text:
            continue

        # Split into sentences (basic sentence splitting)
        sentence_candidates = re.split(r'[.!؟]', text)

        for sentence in sentence_candidates:
            if target_word in sentence.strip():
                # Clean up the sentence
                clean_sentence = sentence.strip()
                if len(clean_sentence) > 10:  # Reasonable sentence length
                    sentences.append(clean_sentence)
                    if len(sentences) >= max_sentences:
                        return sentences

    return sentences

def analyze_word_context(word: str, sentences: List[str]) -> Dict:
    """Analyze context to determine likely part of speech"""
    context_indicators = {
        'noun': [
            'ډير', 'خوب', 'هر', 'دا', 'هغه',  # quantifiers, demonstratives
            'ته', 'له', 'سره',  # case markers (for nouns)
        ],
        'verb': [
            'به', 'غواړي', 'کولای', 'کړي',  # modal verbs
            'و', 'ې',  # verb endings
        ],
        'adjective': [
            'دی', 'ده', 'یم', 'یو',  # copulas
            'تر', 'څخه',  # comparative markers
        ]
    }

    analysis = {
        'word': word,
        'total_sentences': len(sentences),
        'context_scores': {},
        'sample_sentences': sentences[:3],  # First 3 sentences as examples
        'likely_pos': None,
        'confidence': 0.0
    }

    # Count context indicators
    for pos, indicators in context_indicators.items():
        score = 0
        for sentence in sentences:
            for indicator in indicators:
                if indicator in sentence:
                    score += 1
        analysis['context_scores'][pos] = score

    # Determine most likely POS
    if analysis['context_scores']:
        likely_pos = max(analysis['context_scores'], key=analysis['context_scores'].get)
        total_indicators = sum(analysis['context_scores'].values())
        if total_indicators > 0:
            confidence = analysis['context_scores'][likely_pos] / total_indicators
            analysis['likely_pos'] = likely_pos
            analysis['confidence'] = confidence

    return analysis

def main():
    print("🔍 Analyzing Pashto word frequency data for disambiguation...")

    # Load data
    word_freq = load_word_frequencies()
    verses = load_bible_verses()

    print(f"📊 Loaded {len(word_freq)} word frequencies and {len(verses)} verses")

    # Find frequent ambiguous words
    ambiguous_words = find_ambiguous_words(word_freq)
    print(f"🎯 Found {len(ambiguous_words)} frequent ambiguous words")

    # Analyze each word
    results = []
    for word, frequency in ambiguous_words[:25]:  # First 25 as requested
        print(f"\n🔍 Analyzing: {word} (frequency: {frequency})")

        sentences = extract_sentences_with_word(verses, word, max_sentences=5)
        if sentences:
            analysis = analyze_word_context(word, sentences)
            results.append(analysis)
            print(f"  📝 Found {len(sentences)} sentences")
            print(f"  🎯 Likely POS: {analysis['likely_pos']} (confidence: {analysis['confidence']:.2f})")
            print(f"  📖 Sample: {sentences[0][:60]}...")
        else:
            print(f"  ⚠️  No sentences found for {word}")

    # Save results
    output = {
        'total_words_analyzed': len(results),
        'analysis_date': '2025-01-08',
        'results': results
    }

    with open('ambiguous_word_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Analysis complete! Results saved to ambiguous_word_analysis.json")
    print(f"📊 Analyzed {len(results)} words with context data")

if __name__ == "__main__":
    main()

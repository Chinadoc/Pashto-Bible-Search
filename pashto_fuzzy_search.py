#!/usr/bin/env python3
"""
Enhanced Fuzzy Search for Pashto Bible Text
============================================
Arabic-script-aware fuzzy matching optimized for Pashto biblical text, handling
common variations, input errors, and diacritics.
"""

import re
from typing import List, Dict, Tuple, Optional, Set
from dataclasses import dataclass
from enum import Enum


class MatchType(Enum):
    EXACT = 1
    NORMALIZED = 2
    DIACRITIC_INSENSITIVE = 3
    CONSONANT_SKELETON = 4
    FUZZY_CLOSE = 5
    FUZZY_DISTANT = 6


@dataclass
class SearchResult:
    text: str
    reference: str  # e.g., "John 3:16"
    match_type: MatchType
    score: float
    highlighted_text: Optional[str] = None
    match_positions: Optional[List[Tuple[int, int]]] = None


from search_utils import normalize_basic_ps, normalize_aggressive_ps


class PashtoFuzzySearch:
    """Fuzzy search engine optimized for Pashto biblical text."""

    # Normalization tables are centralized in search_utils

    def __init__(self, bible_text: Dict[str, str], enable_caching: bool = True):
        self.bible_text = bible_text
        self.enable_caching = enable_caching
        self.cache: Optional[Dict[str, Dict[str, object]]] = {} if enable_caching else None
        if enable_caching:
            self._build_cache()

    def _build_cache(self):
        for ref, text in self.bible_text.items():
            assert self.cache is not None
            self.cache[ref] = {
                'normalized': self._normalize_aggressive(text),
                'skeleton': self._consonant_skeleton(text),
                'words': set(self._tokenize(text)),
            }

    def _normalize_basic(self, text: str) -> str:
        return normalize_basic_ps(text)

    def _remove_diacritics(self, text: str) -> str:
        # use aggressive - diacritics removal is embedded there; but keep whitespace
        # For precise behavior, reuse normalize_basic + manual strip of diacritics via aggressive then revert spacing
        return normalize_aggressive_ps(text)

    def _normalize_aggressive(self, text: str) -> str:
        return normalize_aggressive_ps(text)

    def _consonant_skeleton(self, text: str) -> str:
        text = self._remove_diacritics(text)
        vowels = ['ا', 'و', 'ي', 'ی', 'ې', 'ۍ']
        for vowel in vowels:
            text = text.replace(vowel, '')
        return text

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'[\u0600-\u06FF]+', text)

    def _are_similar_chars(self, c1: str, c2: str) -> bool:
        similar_groups = [
            {'ت', 'ټ', 'ث'},
            {'د', 'ډ', 'ذ'},
            {'ر', 'ړ', 'ز', 'ږ'},
            {'س', 'ش', 'ښ', 'ص'},
            {'ج', 'ځ', 'چ', 'څ'},
        ]
        return any(c1 in g and c2 in g for g in similar_groups)

    def _levenshtein_distance(self, s1: str, s2: str, max_dist: int = 3) -> float:
        if abs(len(s1) - len(s2)) > max_dist:
            return max_dist + 1
        rows, cols = len(s1) + 1, len(s2) + 1
        dist = [[0] * cols for _ in range(rows)]
        for i in range(1, rows):
            dist[i][0] = i
        for j in range(1, cols):
            dist[0][j] = j
        for i in range(1, rows):
            for j in range(1, cols):
                if s1[i - 1] == s2[j - 1]:
                    cost = 0
                else:
                    cost = 0.5 if self._are_similar_chars(s1[i - 1], s2[j - 1]) else 1
                dist[i][j] = min(
                    dist[i - 1][j] + 1,
                    dist[i][j - 1] + 1,
                    dist[i - 1][j - 1] + cost,
                )
        return dist[-1][-1]

    def _calculate_match_score(self, query: str, text: str, match_type: MatchType) -> float:
        base = {
            MatchType.EXACT: 1.0,
            MatchType.NORMALIZED: 0.9,
            MatchType.DIACRITIC_INSENSITIVE: 0.8,
            MatchType.CONSONANT_SKELETON: 0.6,
            MatchType.FUZZY_CLOSE: 0.5,
            MatchType.FUZZY_DISTANT: 0.3,
        }[match_type]
        pos = text.find(query)
        if pos == 0:
            base += 0.05
        elif pos > 0:
            base -= min(0.05, pos / 1000)
        if text:
            if len(query) / len(text) > 0.8:
                base += 0.05
        return max(0.0, min(1.0, base))

    def search(self, query: str, max_results: int = 10, min_score: float = 0.3) -> List[SearchResult]:
        results: List[SearchResult] = []
        q_norm = self._normalize_basic(query)
        q_aggr = self._normalize_aggressive(query)
        q_skel = self._consonant_skeleton(query)
        q_words = set(self._tokenize(query))

        for ref, text in self.bible_text.items():
            match_type: Optional[MatchType] = None
            score: float = 0.0

            if query in text:
                match_type = MatchType.EXACT
                score = self._calculate_match_score(query, text, match_type)
            elif q_norm in self._normalize_basic(text):
                match_type = MatchType.NORMALIZED
                score = self._calculate_match_score(q_norm, text, match_type)
            elif q_aggr in self._normalize_aggressive(text):
                match_type = MatchType.DIACRITIC_INSENSITIVE
                score = self._calculate_match_score(q_aggr, text, match_type)
            elif q_skel and q_skel in self._consonant_skeleton(text):
                match_type = MatchType.CONSONANT_SKELETON
                score = self._calculate_match_score(q_skel, text, match_type)
            else:
                text_words = set(self._tokenize(text))
                word_matches = 0
                for qw in q_words:
                    qwN = self._normalize_aggressive(qw)
                    for tw in text_words:
                        twN = self._normalize_aggressive(tw)
                        if self._levenshtein_distance(qwN, twN, max_dist=2) <= 1:
                            word_matches += 1
                            break
                if word_matches > 0:
                    ratio = word_matches / max(1, len(q_words))
                    match_type = MatchType.FUZZY_CLOSE if ratio >= 0.7 else MatchType.FUZZY_DISTANT
                    score = self._calculate_match_score(query, text, match_type) * ratio

            if match_type and score >= min_score:
                results.append(SearchResult(text=text, reference=ref, match_type=match_type, score=score))

        results.sort(key=lambda r: r.score, reverse=True)
        return results[:max_results]



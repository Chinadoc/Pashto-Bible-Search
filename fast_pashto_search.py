#!/usr/bin/env python3
"""
High-Performance Index Builder and Search for Pashto Bible
==========================================================
Build once, load instantly. Indices are compressed, integrity-checked, and
support exact, stem, fuzzy (n-gram) and phrase search.

Usage:
  python fast_pashto_search.py build

This scans `all_txt_copies/` and `ot_txt_copies/` and writes indices to `./cache`.
"""

from __future__ import annotations

import gzip
import hashlib
import json
import os
import pickle
import re
import time
from collections import defaultdict
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Set, Tuple


# Canonical 66-book order (used to assign compact numeric ids)
BIBLE_BOOK_ORDER: List[str] = [
    'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
    '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther',
    'Job','Psalms','Proverbs','Ecclesiastes','Song of Songs','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel',
    'Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi',
    'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians',
    'Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon',
    'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
]


@dataclass
class IndexedVerse:
    ref: str               # e.g., "John 3:16"
    book_id: int           # 1..66 (0 if unknown)
    chapter: int
    verse: int
    text: str
    text_normalized: str
    word_positions: List[Tuple[str, int, int]]  # (word, start, end)


class PashtoBibleIndexBuilder:
    """Builds comprehensive indices for instant search performance."""

    def __init__(
        self,
        bible_json_path: str | None = None,
        dictionary_path: str | None = None,
        nt_dir: str = 'all_txt_copies',
        ot_dir: str = 'ot_txt_copies',
    ) -> None:
        self.bible_json_path = bible_json_path
        self.dictionary_path = dictionary_path
        self.nt_dir = nt_dir
        self.ot_dir = ot_dir

        # Indices
        self.verses: Dict[str, IndexedVerse] = {}
        self.inverted_index: Dict[str, Set[str]] = defaultdict(set)
        self.ngram_index: Dict[str, Set[str]] = defaultdict(set)
        self.consonant_index: Dict[str, Set[str]] = defaultdict(set)
        self.stem_index: Dict[str, Set[str]] = defaultdict(set)
        self.book_index: Dict[int, List[str]] = defaultdict(list)

        # Caches
        self._normalize_cache: Dict[str, str] = {}
        self._stem_cache: Dict[str, str] = {}

        self.stats: Dict[str, Any] = {
            'total_verses': 0,
            'total_words': 0,
            'unique_words': 0,
            'index_size_bytes': 0,
            'build_time_seconds': 0,
        }

        self._book_to_id_map: Dict[str, int] = {name: i + 1 for i, name in enumerate(BIBLE_BOOK_ORDER)}

    # ---------- Text loading ----------
    @staticmethod
    def _parse_mixed_digits_to_int(s: str) -> int | None:
        """Parse western, Arabic-Indic (0660-0669) or Eastern Arabic-Indic (06F0-06F9) digits."""
        if not s:
            return None
        digits_map = {ord('۰'): '0', ord('۱'): '1', ord('۲'): '2', ord('۳'): '3', ord('۴'): '4',
                      ord('۵'): '5', ord('۶'): '6', ord('۷'): '7', ord('۸'): '8', ord('۹'): '9',
                      ord('\u0660'): '0', ord('\u0661'): '1', ord('\u0662'): '2', ord('\u0663'): '3', ord('\u0664'): '4',
                      ord('\u0665'): '5', ord('\u0666'): '6', ord('\u0667'): '7', ord('\u0668'): '8', ord('\u0669'): '9'}
        try:
            normalized = s.translate(digits_map)
            return int(normalized)
        except Exception:
            return None

    def _load_text_from_dir(self, dir_path: str) -> Dict[str, str]:
        bible: Dict[str, str] = {}
        if not os.path.isdir(dir_path):
            return bible

        # Heuristic map for directory book prefixes (aligns with current dataset)
        book_map = {
            'acts': 'Acts', 'colossians': 'Colossians', 'ephesians': 'Ephesians', 'galatians': 'Galatians',
            'hebrews': 'Hebrews', 'james': 'James', 'john': 'John', 'jude': 'Jude', 'luke': 'Luke',
            'mark': 'Mark', 'matthew': 'Matthew', 'philemon': 'Philemon', 'philippians': 'Philippians',
            'revelation': 'Revelation', 'romans': 'Romans', 'titus': 'Titus',
            # OT book prefixes will be handled from filenames in ot_txt_copies
        }

        for filename in os.listdir(dir_path):
            if not filename.endswith('_pashto.txt'):
                continue
            base = filename.replace('_pashto.txt', '')
            m = re.match(r'([a-z]+)(\d+)', base)
            if not m:
                continue
            book_prefix, chapter_str = m.groups()
            chapter = int(chapter_str)
            book = book_map.get(book_prefix, book_prefix.capitalize())
            filepath = os.path.join(dir_path, filename)

            # Read file and accumulate verse lines between verse-number markers
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            current_verse: int | None = None
            verse_text_lines: List[str] = []
            for raw in lines:
                stripped = raw.rstrip()
                m2 = re.match(r'^([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*(.*)$', stripped)
                vnum = self._parse_mixed_digits_to_int(m2.group(1)) if m2 else None
                if vnum is not None:
                    if current_verse is not None:
                        bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
                    current_verse = vnum
                    verse_text_lines = []
                    remainder = (m2.group(2) or '').strip() if m2 else ''
                    if remainder:
                        verse_text_lines.append(remainder)
                elif current_verse is not None:
                    verse_text_lines.append(stripped)
            if current_verse is not None:
                bible[f"{book} {chapter}:{current_verse}"] = ' '.join(verse_text_lines).strip()
        return bible

    def _load_bible_map(self) -> Dict[str, str]:
        if self.bible_json_path and os.path.exists(self.bible_json_path):
            with open(self.bible_json_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        # Merge NT and OT text maps
        bible = {}
        bible.update(self._load_text_from_dir(self.nt_dir))
        bible.update(self._load_text_from_dir(self.ot_dir))
        return bible

    # ---------- Normalization and tokenization ----------
    def _normalize_text(self, text: str) -> str:
        cached = self._normalize_cache.get(text)
        if cached is not None:
            return cached
        normalized = text
        # Remove common diacritics
        for d in ['\u064B','\u064C','\u064D','\u064E','\u064F','\u0650','\u0651','\u0652','\u0653','\u0654','\u0655','\u0670']:
            normalized = normalized.replace(d, '')
        # Keyboard/character variants
        replacements = {
            'ټ': 'ت','ډ': 'د','ړ': 'ر','ږ': 'ز','ښ': 'ش','څ': 'چ','ځ': 'ج','ڼ': 'ن',
            'ۍ': 'ی','ئ': 'ی','ؤ': 'و','أ': 'ا','إ': 'ا','آ': 'ا','ة': 'ه','ى': 'ی',
            'ك': 'ک','ي': 'ی','ە': 'ه',
        }
        for old, new in replacements.items():
            normalized = normalized.replace(old, new)
        self._normalize_cache[text] = normalized
        return normalized

    def _extract_consonants(self, text: str) -> str:
        consonants = text
        for v in ['ا','و','ي','ی','ې','ۍ','ه']:
            consonants = consonants.replace(v, '')
        return consonants

    @staticmethod
    def _generate_ngrams(text: str, n: int = 3) -> List[str]:
        if len(text) < n:
            return [text]
        return [text[i:i+n] for i in range(len(text) - n + 1)]

    def _simple_stem(self, word: str) -> str:
        cached = self._stem_cache.get(word)
        if cached is not None:
            return cached
        stem = word
        suffixes = ['ونه','انو','ونو','ګان','انه','ول','ېدل','ای','لی']
        for suf in suffixes:
            if stem.endswith(suf) and len(stem) > len(suf) + 2:
                stem = stem[:-len(suf)]
                break
        self._stem_cache[word] = stem
        return stem

    @staticmethod
    def _tokenize(text: str) -> List[Tuple[str, int, int]]:
        return [(m.group(), m.start(), m.end()) for m in re.finditer(r'[\u0600-\u06FF]+', text)]

    # ---------- Build indices ----------
    def build_indices(self, verbose: bool = True) -> Dict[str, Any]:
        start = time.time()
        bible_map = self._load_bible_map()
        if verbose:
            print(f"Processing {len(bible_map)} verses...")

        for ref, verse_text in bible_map.items():
            book_id, chapter, verse_num = self._parse_reference(ref)
            tokens = self._tokenize(verse_text)

            verse_obj = IndexedVerse(
                ref=ref,
                book_id=book_id,
                chapter=chapter,
                verse=verse_num,
                text=verse_text,
                text_normalized=self._normalize_text(verse_text),
                word_positions=tokens,
            )
            self.verses[ref] = verse_obj
            if book_id:
                self.book_index[book_id].append(ref)

            for word, _s, _e in tokens:
                self.inverted_index[word].add(ref)
                norm = self._normalize_text(word)
                if norm != word:
                    self.inverted_index[norm].add(ref)
                stem = self._simple_stem(norm)
                if stem:
                    self.stem_index[stem].add(ref)
                cons = self._extract_consonants(norm)
                if cons:
                    self.consonant_index[cons].add(ref)
                for ng in self._generate_ngrams(norm, 3):
                    self.ngram_index[ng].add(ref)

            self.stats['total_verses'] += 1
            self.stats['total_words'] += len(tokens)

        self.stats['unique_words'] = len(self.inverted_index)
        self.stats['build_time_seconds'] = time.time() - start
        if verbose:
            print(f"\u2713 Built indices in {self.stats['build_time_seconds']:.2f}s")
            print(f"  - {self.stats['total_verses']} verses")
            print(f"  - {self.stats['unique_words']} unique keys")
            print(f"  - {len(self.ngram_index)} n-grams")
        return self.stats

    def _parse_reference(self, ref: str) -> Tuple[int, int, int]:
        m = re.match(r'^([A-Za-z\s]+)\s(\d+):(\d+)$', ref.strip())
        if not m:
            return (0, 0, 0)
        book = m.group(1).strip()
        chapter = int(m.group(2))
        verse = int(m.group(3))
        return (self._book_to_id_map.get(book, 0), chapter, verse)

    # ---------- Save indices ----------
    def save_indices(self, output_dir: str = './cache') -> None:
        os.makedirs(output_dir, exist_ok=True)
        print('Saving indices...')

        verses_dict = {ref: asdict(v) for ref, v in self.verses.items()}
        with gzip.open(os.path.join(output_dir, 'verses.json.gz'), 'wt', encoding='utf-8') as f:
            json.dump(verses_dict, f, ensure_ascii=False, separators=(',', ':'))

        with gzip.open(os.path.join(output_dir, 'inverted_index.pkl.gz'), 'wb') as f:
            pickle.dump(dict(self.inverted_index), f, protocol=pickle.HIGHEST_PROTOCOL)

        with gzip.open(os.path.join(output_dir, 'ngram_index.pkl.gz'), 'wb', compresslevel=9) as f:
            pickle.dump(dict(self.ngram_index), f, protocol=pickle.HIGHEST_PROTOCOL)

        aux = {
            'consonant_index': dict(self.consonant_index),
            'stem_index': dict(self.stem_index),
            'book_index': dict(self.book_index),
            'stats': self.stats,
        }
        with gzip.open(os.path.join(output_dir, 'auxiliary_indices.pkl.gz'), 'wb') as f:
            pickle.dump(aux, f, protocol=pickle.HIGHEST_PROTOCOL)

        # Manifest with checksums
        manifest = {
            'version': '1.0',
            'created': time.time(),
            'stats': self.stats,
            'files': {},
        }
        for filename in os.listdir(output_dir):
            if filename == 'manifest.json':
                continue
            fp = os.path.join(output_dir, filename)
            try:
                with open(fp, 'rb') as fh:
                    data = fh.read()
                manifest['files'][filename] = {
                    'size': os.path.getsize(fp),
                    'checksum': hashlib.md5(data).hexdigest(),
                }
            except Exception:
                pass
        with open(os.path.join(output_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        total_mb = sum(v.get('size', 0) for v in manifest['files'].values()) / 1024 / 1024
        print(f"\u2713 Indices saved to {output_dir} ({total_mb:.2f} MB)")


class FastPashtoSearch:
    """Lightning-fast search using pre-built indices."""

    def __init__(self, cache_dir: str = './cache') -> None:
        self.cache_dir = cache_dir
        self.verses: Dict[str, IndexedVerse] = {}
        self.inverted_index: Dict[str, Set[str]] = {}
        self.ngram_index: Dict[str, Set[str]] = {}
        self.consonant_index: Dict[str, Set[str]] = {}
        self.stem_index: Dict[str, Set[str]] = {}
        self.book_index: Dict[int, List[str]] = {}
        self.stats: Dict[str, Any] = {}
        self._load_indices()

    def _load_indices(self) -> None:
        # Validate manifest (optional; currently just load it)
        with open(os.path.join(self.cache_dir, 'manifest.json'), 'r', encoding='utf-8') as f:
            _manifest = json.load(f)

        with gzip.open(os.path.join(self.cache_dir, 'verses.json.gz'), 'rt', encoding='utf-8') as f:
            verses_dict = json.load(f)
            self.verses = {ref: IndexedVerse(**data) for ref, data in verses_dict.items()}

        with gzip.open(os.path.join(self.cache_dir, 'inverted_index.pkl.gz'), 'rb') as f:
            self.inverted_index = pickle.load(f)

        with gzip.open(os.path.join(self.cache_dir, 'ngram_index.pkl.gz'), 'rb') as f:
            self.ngram_index = pickle.load(f)

        with gzip.open(os.path.join(self.cache_dir, 'auxiliary_indices.pkl.gz'), 'rb') as f:
            aux = pickle.load(f)
            self.consonant_index = aux.get('consonant_index', {})
            self.stem_index = aux.get('stem_index', {})
            self.book_index = aux.get('book_index', {})
            self.stats = aux.get('stats', {})

    # ----- Public API -----
    def search(self, query: str, mode: str = 'smart', max_results: int = 20) -> List[Dict[str, Any]]:
        results: Set[str] = set()
        qn = self._normalize_quick(query)

        # Exact
        if query in self.inverted_index:
            results.update(self.inverted_index[query])
        if qn in self.inverted_index:
            results.update(self.inverted_index[qn])

        # Stem
        if mode in ('stem', 'smart') and len(results) < max_results:
            stem = self._simple_stem(qn)
            if stem in self.stem_index:
                results.update(self.stem_index[stem])

        # Fuzzy n-gram
        if mode in ('fuzzy', 'smart') and len(results) < max_results:
            q_ngrams = self._generate_ngrams(qn, 3)
            counts: Dict[str, int] = defaultdict(int)
            for ng in q_ngrams:
                for ref in self.ngram_index.get(ng, ()):  # type: ignore[arg-type]
                    counts[ref] += 1
            threshold = max(1, int(len(q_ngrams) * 0.5))
            for ref, cnt in counts.items():
                if cnt >= threshold:
                    results.add(ref)

        out: List[Dict[str, Any]] = []
        for ref in results:
            v = self.verses.get(ref)
            if not v:
                continue
            out.append({
                'reference': ref,
                'text': v.text,
                'score': self._calculate_relevance(qn, v),
                'book_id': v.book_id,
                'chapter': v.chapter,
                'verse': v.verse,
            })
        out.sort(key=lambda x: x['score'], reverse=True)
        return out[:max_results]

    def search_phrase(self, phrase: str, max_results: int = 50) -> List[Dict[str, Any]]:
        words = [w for w in phrase.split() if w]
        if not words:
            return []
        # Candidate verses: intersect postings for each word
        postings: List[Set[str]] = []
        for w in words:
            norm = self._normalize_quick(w)
            refs = set(self.inverted_index.get(w, set())) | set(self.inverted_index.get(norm, set()))
            postings.append(refs)
        if not postings:
            return []
        candidate_refs = set.intersection(*postings) if postings else set()
        out: List[Dict[str, Any]] = []
        for ref in candidate_refs:
            v = self.verses.get(ref)
            if not v:
                continue
            if self._has_phrase_sequence(v, words):
                out.append({
                    'reference': ref,
                    'text': v.text,
                    'score': 1.0,
                    'book_id': v.book_id,
                    'chapter': v.chapter,
                    'verse': v.verse,
                })
        return out[:max_results]

    # ----- Internals -----
    @staticmethod
    def _generate_ngrams(text: str, n: int = 3) -> List[str]:
        if len(text) < n:
            return [text]
        return [text[i:i+n] for i in range(len(text) - n + 1)]

    @staticmethod
    def _normalize_quick(text: str) -> str:
        normalized = text
        replacements = [('ټ','ت'),('ډ','د'),('ړ','ر'),('ږ','ز'),('ښ','ش'),('څ','چ'),('ځ','ج'),('ڼ','ن'),('ۍ','ی'),('ئ','ی'),('ؤ','و'),('أ','ا'),('إ','ا'),('آ','ا'),('ة','ه'),('ى','ی'),('ك','ک'),('ي','ی'),('ە','ه')]
        for old, new in replacements:
            normalized = normalized.replace(old, new)
        for d in ['\u064B','\u064C','\u064D','\u064E','\u064F','\u0650','\u0651','\u0652','\u0670']:
            normalized = normalized.replace(d, '')
        return normalized

    @staticmethod
    def _simple_stem(word: str) -> str:
        for suf in ['ونه','انو','ونو','ول','ېدل']:
            if word.endswith(suf) and len(word) > len(suf) + 2:
                return word[:-len(suf)]
        return word

    def _has_phrase_sequence(self, verse: IndexedVerse, words: List[str]) -> bool:
        positions = verse.word_positions
        if not positions:
            return False
        target = [self._normalize_quick(w) for w in words]
        tokens = [self._normalize_quick(w) for (w, _s, _e) in positions]
        # Sliding window exact match of normalized tokens
        m = len(target)
        for i in range(0, len(tokens) - m + 1):
            if tokens[i:i+m] == target:
                return True
        return False

    def _calculate_relevance(self, query_norm: str, verse: IndexedVerse) -> float:
        score = 0.0
        text_norm = verse.text_normalized
        if query_norm in text_norm:
            score += 1.0
        pos = text_norm.find(query_norm)
        if pos >= 0 and len(text_norm) > 0:
            score += (1.0 - pos / max(1, len(text_norm))) * 0.5
        freq = text_norm.count(query_norm)
        score += min(freq * 0.1, 0.5)
        return score


if __name__ == '__main__':
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'build':
        print('=== Building Pashto Bible Indices ===')
        builder = PashtoBibleIndexBuilder(nt_dir='all_txt_copies', ot_dir='ot_txt_copies')
        stats = builder.build_indices(verbose=True)
        builder.save_indices('./cache')
        print('\n\u2713 Index building complete!')
        print('  Saved to ./cache')
        print(f"  Verses: {stats.get('total_verses')}  Unique keys: {stats.get('unique_words')}")
    else:
        # Lightweight demo: load indices and run a couple of queries
        try:
            t0 = time.time()
            engine = FastPashtoSearch('./cache')
            dt = (time.time() - t0) * 1000
            print(f'Loaded indices in {dt:.1f} ms')
            for q in ['خدای', 'محبت', 'نور']:
                t1 = time.time()
                res = engine.search(q, mode='smart', max_results=5)
                print(f"Query '{q}' → {len(res)} hits in {(time.time()-t1)*1000:.1f} ms")
        except FileNotFoundError:
            print('Cache not found. Run: python fast_pashto_search.py build')



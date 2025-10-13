import os
import json
import reflex as rx
from typing import Iterable
import time
from urllib.parse import quote
import httpx
import re


class AppState(rx.State):
    """Global app state for the Reflex simple search.

    This implements an exact substring search over assets/pashto_bible.json
    and an in-page book filter using state only (no navigation).
    """

    # Inputs
    query: str = ""
    scope: str = "nt"  # nt | ot | all (placeholder for now)
    book_filter: str = ""  # e.g., "John"
    active_tab: str = "search"  # search | lexicon
    query_type: str = "none"  # none | verse | phrase | word

    # Data and results
    bible: list[dict] = []  # [{"ref": "John 3:16", "text": "..."}, ...]
    results: list[dict] = []
    search_ms: int = 0
    # Backend
    API_BASE: str = os.environ.get("API_BASE_URL", "http://localhost:8080")
    use_backend: bool = True
    # Audio
    audio_map: dict = {}
    playing_ref: str = ""

    # Branch-specific data
    verse_ref: str = ""
    verse_text: str = ""
    grammar_occurrences: list[dict] = []
    grammar_ms: int = 0

    # Canonical book lists (English names as used in refs)
    NT_BOOKS: set[str] = {
        "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians",
        "Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians",
        "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
        "1 John","2 John","3 John","Jude","Revelation"
    }
    OT_BOOKS: set[str] = {
        "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
        "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah",
        "Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
        "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah",
        "Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
    }

    # Load Bible data once
    def load_bible(self):
        if self.bible:
            return
        # Hydrate persisted UI state if present
        try:
            qs = self.get_query_params() or {}
            self.query = qs.get("q", [self.query])[0]
            s = qs.get("s", [self.scope])[0]
            if s in ("nt","ot","all"):
                self.scope = s
            self.book_filter = qs.get("b", [self.book_filter])[0]
        except Exception:
            pass
        path = os.path.join("assets", "pashto_bible.json")
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            # Normalize shape
            self.bible = [
                {"ref": it.get("ref", ""), "text": it.get("text", "")}
                for it in (data or [])
                if isinstance(it, dict)
            ]
        except Exception:
            self.bible = []
        # Try to load audio map if present
        try:
            amap_path = os.path.join("assets", "audio_file_map.json")
            if os.path.exists(amap_path):
                with open(amap_path, "r", encoding="utf-8") as f:
                    self.audio_map = json.load(f) or {}
        except Exception:
            self.audio_map = {}

    # Actions
    def set_query(self, v: str):
        self.query = v
        self._persist()

    def set_scope(self, v: str):
        self.scope = v
        self._persist()

    def set_scope_label(self, v: str):
        v = (v or "").strip()
        if v == "NT":
            self.scope = "nt"
        elif v == "OT":
            self.scope = "ot"
        else:
            self.scope = "all"
        self._persist()

    def set_book(self, b: str):
        # Toggle same book to clear; separate clear button also exists
        self.book_filter = "" if (self.book_filter == b) else (b or "")
        # Re-run search to apply filter immediately (if results already present)
        self.search()
        self._persist()

    def clear_filter(self):
        self.book_filter = ""
        self.search()
        self._persist()

    def set_tab(self, tab: str):
        if tab in ("search", "lexicon"):
            self.active_tab = tab
            self._persist()

    # --- Query classification ---
    def _is_verse_reference(self, q: str) -> bool:
        try:
            return bool(re.match(r"^([A-Za-z\s]+)\s\d+:\d+$", q.strip()))
        except Exception:
            return False

    def _is_single_word(self, q: str) -> bool:
        try:
            return len([t for t in q.split() if t.strip()]) == 1
        except Exception:
            return False

    def search(self):
        self.load_bible()
        q = (self.query or "").strip()
        if not q:
            self.results = []
            self.search_ms = 0
            self.verse_ref = ""
            self.verse_text = ""
            self.grammar_occurrences = []
            self.grammar_ms = 0
            self.query_type = "none"
            return
        # Branch selection
        if self._is_verse_reference(q):
            self.query_type = "verse"
            self._search_verse(q)
            return
        if self._is_single_word(q):
            self.query_type = "word"
            self._search_grammar(q)
            return
        self.query_type = "phrase"
        # Try backend first for phrase
        if self.use_backend and self.API_BASE:
            try:
                with httpx.Client(timeout=10.0) as client:
                    payload = {"query": q, "scope": (self.scope or "all"), "limit": 500}
                    r = client.post(f"{self.API_BASE}/search/phrase", json=payload)
                    if r.status_code == 200:
                        data = r.json()
                        items = data.get("results", []) or []
                        # Apply book_filter client-side (API is scope-aware; book filter is UI-driven)
                        if self.book_filter:
                            bf = self.book_filter
                            items = [v for v in items if self._book_from_ref(v.get("ref","")) == bf]
                        self.results = items
                        self.search_ms = int(data.get("ms", 0))
                        return
            except Exception:
                # Fall back to local search
                pass
        # Local fallback exact substring search; limit for responsiveness
        t0 = time.perf_counter()
        out: list[dict] = []
        limit = 500
        for it in self.bible:
            ref = it.get("ref", "")
            text = it.get("text", "")
            if self.scope != "all":
                book = self._book_from_ref(ref)
                if self.scope == "nt" and book not in self.NT_BOOKS:
                    continue
                if self.scope == "ot" and book not in self.OT_BOOKS:
                    continue
            if q in text:
                if self.book_filter:
                    book = self._book_from_ref(ref)
                    if book != self.book_filter:
                        continue
                out.append({"ref": ref, "text": text})
                if len(out) >= limit:
                    break
        self.results = out
        self.search_ms = int((time.perf_counter() - t0) * 1000)

    def _search_verse(self, q: str):
        self.verse_ref = q
        self.verse_text = ""
        for it in (self.bible or []):
            if it.get("ref") == q:
                self.verse_text = it.get("text", "")
                break
        # Clear other branches
        self.results = []
        self.search_ms = 0
        self.grammar_occurrences = []
        self.grammar_ms = 0

    def _search_grammar(self, q: str):
        self.grammar_occurrences = []
        self.grammar_ms = 0
        # Try backend
        if self.use_backend and self.API_BASE:
            try:
                with httpx.Client(timeout=10.0) as client:
                    payload = {"query": q, "scope": (self.scope or "all"), "limit": 200}
                    r = client.post(f"{self.API_BASE}/search/grammar", json=payload)
                    if r.status_code == 200:
                        data = r.json()
                        items = data.get("occurrences", []) or []
                        if self.book_filter:
                            bf = self.book_filter
                            items = [v for v in items if self._book_from_ref(v.get("ref", "")) == bf]
                        self.grammar_occurrences = items
                        self.grammar_ms = int(data.get("ms", 0))
                        # Clear phrase
                        self.results = []
                        self.search_ms = 0
                        return
            except Exception:
                pass
        # Fallback: scan
        t0 = time.perf_counter()
        out: list[dict] = []
        limit = 200
        for it in self.bible:
            ref = it.get("ref", "")
            text = it.get("text", "")
            if self.scope != "all":
                book = self._book_from_ref(ref)
                if self.scope == "nt" and book not in self.NT_BOOKS:
                    continue
                if self.scope == "ot" and book not in self.OT_BOOKS:
                    continue
            if q in text:
                if self.book_filter:
                    book = self._book_from_ref(ref)
                    if book != self.book_filter:
                        continue
                out.append({"ref": ref, "text": text})
                if len(out) >= limit:
                    break
        self.grammar_occurrences = out
        self.grammar_ms = int((time.perf_counter() - t0) * 1000)
        # Clear phrase
        self.results = []
        self.search_ms = 0

    # --- Audio helpers -----------------------------------------------------
    def _audio_filename(self, ref: str) -> str:
        # Expecting "BookName C:V"
        try:
            parts = ref.split()
            if len(parts) < 2:
                return ""
            book = " ".join(parts[:-1]).lower().replace(" ", "")
            ch_vs = parts[-1]
            ch, vs = ch_vs.split(":", 1)
            return f"{book}{int(ch)}_verse_{int(vs)}.mp3"
        except Exception:
            return ""

    def audio_url(self, ref: str) -> str:
        fn = self._audio_filename(ref)
        if not fn:
            return ""
        file_id = (self.audio_map or {}).get(fn)
        if not file_id:
            return ""
        # Google Drive direct prefix
        return f"https://drive.usercontent.google.com/download?id={file_id}&export=download"

    def toggle_play(self, ref: str):
        # Toggle single active audio ref
        self.playing_ref = "" if (self.playing_ref == ref) else ref

    # --- Helpers ------------------------------------------------------------
    def _book_from_ref(self, ref: str) -> str:
        # Supports multi-word book names like "1 Corinthians"
        try:
            # Split at last space before chapter:verse
            # e.g., "1 Corinthians 2:3" -> "1 Corinthians"
            parts = ref.rsplit(" ", 1)
            if len(parts) == 2 and ":" in parts[1]:
                return parts[0]
            return ref.split(" ")[0] if ref else ""
        except Exception:
            return ""

    # Persist query/scope/book to URL (query params)
    def _persist(self):
        try:
            q = self.query or ""
            s = self.scope or "all"
            b = self.book_filter or ""
            t = self.active_tab or "search"
            self.set_query_params({"q": q, "s": s, "b": b, "t": t})
        except Exception:
            pass

    # Computed values
    @rx.var
    def coverage(self) -> list[tuple[str, int]]:
        counts: dict[str, int] = {}
        branch = self.results if self.query_type != "word" else self.grammar_occurrences
        for r in branch:
            ref = r.get("ref", "")
            book = ref.split(" ")[0] if ref else ""
            if not book:
                continue
            counts[book] = counts.get(book, 0) + 1
        # Stable order: show books with counts first, keep alpha inside same count
        return sorted(counts.items(), key=lambda x: (-x[1], x[0]))

    @rx.var
    def share_path(self) -> str:
        try:
            q = quote(self.query or "")
            s = self.scope or "all"
            b = quote(self.book_filter or "")
            return f"/?q={q}&s={s}&b={b}"
        except Exception:
            return "/"

    @rx.var
    def scope_label(self) -> str:
        s = (self.scope or "all").lower()
        return "NT" if s == "nt" else ("OT" if s == "ot" else "All")



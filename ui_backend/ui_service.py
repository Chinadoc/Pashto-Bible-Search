from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import re
from typing import Dict, List, Tuple


@dataclass(frozen=True)
class Chip:
    label: str
    book: str
    count: int
    disabled: bool
    active: bool


@dataclass(frozen=True)
class BookCoverageView:
    chips: List[Chip]
    scope_label: str
    selected_book: str
    layout: Dict[str, str]


@lru_cache(maxsize=2048)
def _canon_ref_to_book(ref: str) -> str:
    m = re.match(r"^([A-Za-z\s]+)\s\d+:\d+$", ref)
    return m.group(1).strip() if m else ""


def build_book_counts(verses: Tuple[str, ...]) -> Dict[str, int]:
    counts: Dict[str, int] = {}
    for v in verses:
        b = _canon_ref_to_book(v)
        if not b:
            continue
        counts[b] = counts.get(b, 0) + 1
    return counts


def build_book_coverage_view(
    verses: List[str],
    text_map_keys: List[str],
    scope_label: str,
    selected_book: str = "",
    books_in_order: List[str] | None = None,
    rail_width: str = "25%",
) -> BookCoverageView:
    counts = build_book_counts(tuple(verses))
    present = {_canon_ref_to_book(k) for k in text_map_keys}
    # Determine order: keep canonical order if provided
    books = [b for b in (books_in_order or sorted(present)) if b in present]
    chips: List[Chip] = []
    for b in books:
        c = counts.get(b, 0)
        chips.append(
            Chip(
                label=f"{b}{' - '+str(c) if c else ''}",
                book=b,
                count=c,
                disabled=c == 0,
                active=(b == selected_book and c > 0),
            )
        )
    return BookCoverageView(
        chips=chips,
        scope_label=scope_label,
        selected_book=selected_book,
        layout={"rail_width": rail_width},
    )



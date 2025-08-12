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


def get_ui_css(mobile: bool = False) -> str:
    """Return global CSS for sticky search bar and right rail.

    Keep styles centralized so the Streamlit file stays thin.
    """
    return (
        """
        /* sticky search header */
        .search-header { position: sticky; top: 0; z-index: 1200; background: var(--background-color);
                         padding: 8px 4px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }
        /* sticky right rail */
        .right-rail   { position: sticky; top: 56px; max-height: calc(100vh - 64px); overflow: auto; }
        @media (max-width: 768px) { .right-rail { position: fixed; right: 8px; top: 56px; width: 28%;
                                                  max-height: 65vh; z-index: 1100; } }
        /* chip styling: compact, high-contrast */
        .chip-rail .stButton > button { background: #0284c7; color: #eef6ff; padding: 4px 8px; border-radius: 999px;
                                        border: none; font-size: .78rem; margin: 3px; }
        .chip-rail .stButton > button:hover { filter: brightness(1.08); }
        .chip-rail .stButton > button:disabled { background: #334155; color: #cbd5e1; opacity: .6; }
        .section-title { font-size: 11px; color: #b6c7d4; margin-bottom: 6px }
        """
    )




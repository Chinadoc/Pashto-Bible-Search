from __future__ import annotations

import time
from typing import Dict, Any

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .models import (
    PhraseRequest,
    GrammarRequest,
    PhraseResponse,
    GrammarResponse,
    AudioResponse,
)
from .services.bible_loader import (
    load_text_maps,
    get_text_maps,
    get_grammar_indices,
    get_audio_map,
)
from .services import engine_loader
from .services.search_phrase import phrase_search
from .services.search_grammar import grammar_search
from .services.audio import audio_url_for
from .services.search import simple_search, handle_grammatical_search, lookup_lexicon


app = FastAPI(title="Pashto Bible Search API", version="0.1.0")

# Allow local tools/UIs to call the API easily
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    # Load text maps and grammar indices into process memory
    load_text_maps()
    get_grammar_indices()  # ensure loaded
    get_audio_map()        # ensure loaded
    engine_loader.load_all()


@app.post("/search/phrase", response_model=PhraseResponse)
def ep_search_phrase(req: PhraseRequest) -> PhraseResponse:
    maps = get_text_maps()
    t0 = time.perf_counter()
    results = phrase_search(req, maps)
    ms = (time.perf_counter() - t0) * 1000.0
    return PhraseResponse(**results, ms=ms)


@app.post("/search/grammar", response_model=GrammarResponse)
def ep_search_grammar(req: GrammarRequest) -> GrammarResponse:
    indices = get_grammar_indices()
    t0 = time.perf_counter()
    results = handle_grammatical_search(req.query, indices.get("all", {}))
    ms = (time.perf_counter() - t0) * 1000.0
    return GrammarResponse(results=results, ms=ms)


@app.get("/search/grammatical")
def ep_search_grammatical(query: str = Query(..., min_length=1), scope: str = Query("ALL", min_length=2)):
    results = handle_grammatical_search(query, scope)
    return {"results": results}


@app.get("/lexicon/lookup")
def ep_lexicon_lookup(query: str = Query(..., min_length=1)):
    results = lookup_lexicon(query)
    return {"results": results}


@app.get("/search/simple")
def ep_search_simple(query: str = Query(..., min_length=1)):
    maps = get_text_maps()
    results = simple_search(query, maps.get("all", {}))
    return {"results": results}


@app.get("/audio/url", response_model=AudioResponse)
def ep_audio_url(ref: str = Query(..., description="Reference like 'John 3:16'")) -> AudioResponse:
    amap = get_audio_map()
    url = audio_url_for(ref, amap)
    return AudioResponse(url=url)

@app.get("/lexicon/frequency")
def ep_lexicon_frequency(
    scope: str = Query("all", pattern=r"^(nt|ot|all)$"),
    min_count: int = Query(1, ge=1, le=1000),
    cursor: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=5000),
):
    maps = get_text_maps()
    text_map = maps.get(scope) if scope in ("nt", "ot") else maps.get("all", {})
    # naive token frequency over whitespace; can be swapped with cached frequencies later
    freq: dict[str, int] = {}
    for text in text_map.values():
        for tok in (text or "").split():
            t = tok.strip()
            if not t:
                continue
            freq[t] = freq.get(t, 0) + 1
    items = [(f, c) for f, c in freq.items() if c >= min_count]
    items.sort(key=lambda x: (-x[1], x[0]))
    start = cursor or 0
    end = min(start + limit, len(items))
    page = items[start:end]
    next_cursor = end if end < len(items) else None
    return {"items": [{"form": f, "count": c} for f, c in page], "nextCursor": next_cursor}

@app.get("/dictionary/lookup")
def ep_dictionary_lookup(form: str = Query(..., min_length=1)):
    # Very light, best-effort lookup using available indices later; for now echo the form
    # Hook: can load dictionary_fast_index.json and romanized_dictionary.json when present
    f = (form or "").strip()
    return {"form": f}


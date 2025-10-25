from __future__ import annotations

import os
import tempfile
import time
from pathlib import Path
from typing import Dict, Any, List

from fastapi import FastAPI, Query, HTTPException
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
from .services.google_drive_client import (
    upload_file,
    download_file,
    encode_file_base64,
    GoogleDriveAuthError,
)
from .services.video_processing import (
    download_youtube_audio,
    analyze_audio_segments,
    extract_segments,
    VideoProcessingError,
)


app = FastAPI(title="Pashto Bible Search API", version="0.1.0")

# Allow local tools/UIs to call the API easily
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_DRIVE_AUDIO_FOLDER_ID = os.getenv("GOOGLE_DRIVE_AUDIO_FOLDER_ID")
GOOGLE_DRIVE_SEGMENTS_FOLDER_ID = os.getenv("GOOGLE_DRIVE_SEGMENTS_FOLDER_ID")


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
    results = handle_grammatical_search(req.query, req.scope)
    ms = (time.perf_counter() - t0) * 1000.0

    # Handle both old and new response formats
    if isinstance(results, dict) and 'verses' in results:
        # New format with related forms
        occurrences = [{"ref": verse, "text": ""} for verse in results['verses'][:req.limit]]
        # Include related forms in conjugations field
        conjugations = {
            'root': results.get('root', ''),
            'related_forms': results.get('related_forms', []),
            'total_verses': results.get('total_verses', 0)
        }
        coverage = []
    else:
        # Old format (list of verses)
        occurrences = [{"ref": verse, "text": ""} for verse in results[:req.limit]]
        conjugations = None
        coverage = []

    return GrammarResponse(occurrences=occurrences, conjugations=conjugations, coverage=coverage, ms=ms)


@app.get("/search/grammatical")
def ep_search_grammatical(query: str = Query(..., min_length=1), scope: str = Query("ALL", min_length=2)):
    results = handle_grammatical_search(query, scope)
    # Handle both old and new response formats
    if isinstance(results, dict) and 'verses' in results:
        # New format with related forms
        return {
            "results": results['verses'][:200],  # Limit results
            "related_forms": results['related_forms'],
            "root": results['root'],
            "total_verses": results['total_verses']
        }
    else:
        # Old format (list of verses)
        return {"results": results[:200]}


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


@app.post("/videos/analyze")
def ep_videos_analyze(payload: Dict[str, Any]) -> Dict[str, Any]:
    youtube_url = (payload or {}).get("youtube_url")
    if not youtube_url:
        raise HTTPException(status_code=400, detail="youtube_url is required")

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_dir = Path(tmpdir)
            video_id, audio_path = download_youtube_audio(youtube_url, temp_dir)
            audio_info, segments = analyze_audio_segments(audio_path)

            file_id, file_url = upload_file(
                audio_path,
                filename=f"{video_id}_full.wav",
                folder_id=GOOGLE_DRIVE_AUDIO_FOLDER_ID,
            )

        return {
            "success": True,
            "videoId": video_id,
            "youtubeUrl": youtube_url,
            "audioInfo": audio_info,
            "segments": segments,
            "driveFileId": file_id,
            "driveUrl": file_url,
        }

    except VideoProcessingError as exc:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {exc}") from exc
    except GoogleDriveAuthError as exc:
        raise HTTPException(status_code=500, detail=f"Google Drive authentication failed: {exc}") from exc
    except Exception as exc:  # pragma: no cover - safeguard
        raise HTTPException(status_code=500, detail=f"Unexpected error: {exc}") from exc


@app.post("/videos/segments")
def ep_videos_segments(payload: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Invalid request payload")

    drive_file_id = payload.get("driveFileId")
    youtube_url = payload.get("youtubeUrl")
    video_id = payload.get("videoId")
    segments_input = payload.get("selectedSegments") or payload.get("segments")

    if not segments_input or not isinstance(segments_input, list):
        raise HTTPException(status_code=400, detail="segments are required")

    if not drive_file_id and not youtube_url:
        raise HTTPException(
            status_code=400,
            detail="driveFileId or youtubeUrl must be provided",
        )

    segments_folder = GOOGLE_DRIVE_SEGMENTS_FOLDER_ID or GOOGLE_DRIVE_AUDIO_FOLDER_ID

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_dir = Path(tmpdir)

            source_video_id = video_id
            if drive_file_id:
                source_audio = download_file(drive_file_id, temp_dir / "source.wav")
                if not source_video_id:
                    source_video_id = source_audio.stem
            else:
                source_video_id, source_audio = download_youtube_audio(youtube_url, temp_dir)

            extracted = extract_segments(source_audio, segments_input, temp_dir / "clips")

            clip_results: List[Dict[str, Any]] = []
            for meta, file_path in extracted:
                clip_index = int(meta.get("segmentIndex", 0))
                clip_name = f"{(source_video_id or 'video')}_segment_{clip_index + 1:03d}.mp3"
                file_id, file_url = upload_file(
                    file_path,
                    filename=clip_name,
                    folder_id=segments_folder,
                )

                clip_results.append(
                    {
                        "segmentIndex": clip_index,
                        "start": meta.get("start"),
                        "end": meta.get("end"),
                        "duration": meta.get("duration"),
                        "driveFileId": file_id,
                        "driveUrl": file_url,
                        "size": file_path.stat().st_size,
                        "audioBase64": encode_file_base64(file_path),
                    }
                )

        return {
            "success": True,
            "videoId": video_id or source_video_id,
            "segments": clip_results,
            "totalSegments": len(clip_results),
        }

    except VideoProcessingError as exc:
        raise HTTPException(status_code=500, detail=f"Segment extraction failed: {exc}") from exc
    except GoogleDriveAuthError as exc:
        raise HTTPException(status_code=500, detail=f"Google Drive authentication failed: {exc}") from exc
    except Exception as exc:  # pragma: no cover - safeguard
        raise HTTPException(status_code=500, detail=f"Unexpected error: {exc}") from exc


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

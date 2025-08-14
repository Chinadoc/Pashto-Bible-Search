from __future__ import annotations

import json
import os
from typing import Dict, Tuple

try:
    import orjson as _json
    def _loads(b: bytes):
        return _json.loads(b)
except Exception:
    _json = None
    def _loads(b: bytes):
        return json.loads(b.decode('utf-8'))


APP_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

_TEXT_MAPS: Dict[str, Dict[str, str]] | None = None
_AUDIO_MAP: Dict[str, str] | None = None
_GRAMMAR: Tuple[dict, dict] | None = None  # (form_occurrence_index, form_to_root_map)


def _load_json(path: str):
    with open(path, 'rb') as f:
        data = f.read()
    try:
        return _loads(data)
    except Exception:
        with open(path, 'r', encoding='utf-8') as fr:
            return json.load(fr)


def load_text_maps() -> None:
    global _TEXT_MAPS
    if _TEXT_MAPS is not None:
        return
    # Prefer consolidated web JSON for NT if present (keeps parity with web tool)
    web_json = os.path.join(APP_ROOT, 'web', 'pashto_bible.json')
    if os.path.exists(web_json):
        arr = _load_json(web_json)
        all_map = {it['ref']: it['text'] for it in arr if isinstance(it, dict) and 'ref' in it}
        # Heuristic split: NT vs OT by book name
        nt_books = set([
            'Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians',
            'Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon',
            'Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
        ])
        nt_map = {r: t for r, t in all_map.items() if (r.split(' ')[0] in nt_books or r.split(':')[0].split(' ')[0] in nt_books)}
        ot_map = {r: t for r, t in all_map.items() if r not in nt_map}
        _TEXT_MAPS = { 'nt': nt_map, 'ot': ot_map, 'all': all_map }
        return
    # Fallback: load from text dirs through existing loader
    from bible_text_loader import load_bible_map
    all_map = load_bible_map(os.path.join(APP_ROOT, 'all_txt_copies'), os.path.join(APP_ROOT, 'ot_txt_copies'))
    _TEXT_MAPS = {
        'nt': {r: t for r, t in all_map.items() if r.startswith(('Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'))},
        'ot': {r: t for r, t in all_map.items() if not r.startswith(('Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'))},
        'all': all_map,
    }


def get_text_maps() -> Dict[str, Dict[str, str]]:
    if _TEXT_MAPS is None:
        load_text_maps()
    return _TEXT_MAPS or {'nt': {}, 'ot': {}, 'all': {}}


def get_audio_map() -> Dict[str, str]:
    global _AUDIO_MAP
    if _AUDIO_MAP is not None:
        return _AUDIO_MAP
    path = os.path.join(APP_ROOT, 'audio_file_map.json')
    if os.path.exists(path):
        try:
            _AUDIO_MAP = _load_json(path)
        except Exception:
            _AUDIO_MAP = {}
    else:
        _AUDIO_MAP = {}
    return _AUDIO_MAP


def get_grammar_indices() -> Tuple[dict, dict]:
    global _GRAMMAR
    if _GRAMMAR is not None:
        return _GRAMMAR
    foi = os.path.join(APP_ROOT, 'form_occurrence_index.json')
    ftr = os.path.join(APP_ROOT, 'form_to_root_map.json')
    try:
        form_occurrence_index = _load_json(foi) if os.path.exists(foi) else {}
    except Exception:
        form_occurrence_index = {}
    try:
        form_to_root_map = _load_json(ftr) if os.path.exists(ftr) else {}
    except Exception:
        form_to_root_map = {}
    _GRAMMAR = (form_occurrence_index, form_to_root_map)
    return _GRAMMAR



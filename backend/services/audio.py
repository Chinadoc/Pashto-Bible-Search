from __future__ import annotations

import re
from typing import Dict, Optional


def _key_for_ref(vref: str) -> Optional[str]:
    m = re.match(r'^([A-Za-z\s]+)\s(\d+):(\d+)$', vref.strip())
    if not m:
        return None
    book = m.group(1).strip().lower().replace(' ', '')
    chap = m.group(2)
    verse = m.group(3)
    return f"{book}{chap}_verse_{verse}.mp3"


def audio_url_for(vref: str, audio_map: Dict[str, str]) -> Optional[str]:
    key = _key_for_ref(vref)
    if not key:
        return None
    file_id = audio_map.get(key)
    if not file_id:
        return None
    # Direct GDrive download URL format; adjust if CDN available
    return f"https://drive.google.com/uc?export=download&id={file_id}"



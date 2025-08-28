from __future__ import annotations

from typing import List, Optional

try:
    from pydantic import BaseModel, Field
except ImportError:
    # Fallback if pydantic not available
    class BaseModel:
        pass
    def Field(*args, **kwargs):
        return None


class CoverageItem(BaseModel):
    book: str
    count: int


class VerseItem(BaseModel):
    ref: str
    text: str


class PhraseRequest(BaseModel):
    query: str = Field(..., min_length=1)
    scope: str = Field("all", pattern=r"^(nt|ot|all)$")
    limit: int = Field(200, ge=1, le=1000)


class PhraseResponse(BaseModel):
    results: List[VerseItem]
    coverage: List[CoverageItem]
    ms: float


class GrammarRequest(BaseModel):
    query: str = Field(..., min_length=1)
    scope: str = Field("all", pattern=r"^(nt|ot|all)$")
    limit: int = Field(100, ge=1, le=500)


class GrammarResponse(BaseModel):
    occurrences: List[VerseItem]
    conjugations: Optional[dict] = None
    coverage: List[CoverageItem]
    ms: float


class AudioResponse(BaseModel):
    url: Optional[str]



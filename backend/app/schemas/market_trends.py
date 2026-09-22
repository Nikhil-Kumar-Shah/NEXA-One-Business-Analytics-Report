"""Schemas for Q4 Market & Macro Trends research endpoint."""

from typing import List, Optional, Union
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class MarketEvidenceItem(BaseModel):
    source: str
    year: Optional[int] = None
    geography: str
    market_sector: str
    indicator: str
    period: Optional[str] = None
    reported_value: Optional[Union[float, int, str]] = None
    measure: Optional[str] = None
    evidence_type: str
    research_note: Optional[str] = None
    publisher: Optional[str] = None


class MarketTrendItem(BaseModel):
    trend_area: str
    observed_signal: str
    direction: str
    business_relevance: str
    evidence_strength_context: str


class QuantifiedSignalItem(BaseModel):
    indicator: str
    value: float


class MarketAnalysisItem(BaseModel):
    analytical_point: str
    evidence: str
    implication_for_nexa: str
    boundary_limitation: str


class MarketSourceItem(BaseModel):
    source: str
    publication_year: Optional[int] = None
    publisher: str
    source_link: Optional[str] = None
    what_it_contributes: str


class MarketTrendResponse(BaseModel):
    total_evidence_records: int
    filtered_evidence_records: Optional[int] = None
    market_evidence: List[MarketEvidenceItem]
    trend_synthesis: List[MarketTrendItem]
    quantified_signals: List[QuantifiedSignalItem]
    q4_analysis: List[MarketAnalysisItem]
    source_register: List[MarketSourceItem]
    sources: List[SourceMeta]

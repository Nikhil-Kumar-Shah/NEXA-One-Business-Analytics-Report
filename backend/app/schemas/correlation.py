"""Schemas for Correlation analysis endpoint."""

from typing import Dict, List, Optional
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class CorrelationPair(BaseModel):
    variable_x: str
    variable_y: str
    coefficient: float


class CorrelationResponse(BaseModel):
    variables: List[str]
    correlations: List[CorrelationPair]
    matrix: Dict[str, Dict[str, float]]
    reading_note: Optional[str] = None
    source: SourceMeta

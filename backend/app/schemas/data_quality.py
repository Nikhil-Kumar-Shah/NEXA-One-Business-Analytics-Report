"""Schemas for Data Quality audit endpoint."""

from typing import Any, List, Optional, Union
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class DataQualityCheckItem(BaseModel):
    check: str
    formula_result: Union[int, float, str]
    what_it_checks: str
    status: str


class DataQualityMetrics(BaseModel):
    row_count: int
    column_count: int
    missing_source_cells: int
    negative_values: int
    duplicate_market_ids: int
    unique_market_ids: int
    zero_social_spend: int
    outlier_counts: int
    rows_requiring_review: int


class DataQualityResponse(BaseModel):
    overall_status: str
    metrics: DataQualityMetrics
    checks: List[DataQualityCheckItem]
    source: SourceMeta

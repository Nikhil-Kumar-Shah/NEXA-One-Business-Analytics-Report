"""Schemas for the Executive Overview API endpoint."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from backend.app.schemas.common import SourceMeta


class DatasetOverview(BaseModel):
    market_count: int
    channels: List[str]
    total_sales: float
    mean_sales: float
    total_advertising_spend: float
    mean_advertising_spend: float


class ModelOverview(BaseModel):
    formula: str
    r_squared: float
    adjusted_r_squared: float
    f_statistic: float
    model_p_value: float
    standard_error: float


class CorrelationsOverview(BaseModel):
    tv_sales: float
    social_media_sales: float
    print_sales: float


class DataQualityOverview(BaseModel):
    status: str
    observations: int
    missing_cells: int
    duplicate_ids: int
    rows_requiring_review: int


class OverviewResponse(BaseModel):
    dataset: DatasetOverview
    model: ModelOverview
    correlations: CorrelationsOverview
    data_quality: DataQualityOverview
    sources: Dict[str, SourceMeta]

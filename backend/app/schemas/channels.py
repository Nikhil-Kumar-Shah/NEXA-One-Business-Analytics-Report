"""Schemas for Channel-level statistical evidence endpoint."""

from typing import Dict, List, Optional
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class ChannelEvidenceDetail(BaseModel):
    channel_name: str
    variable_name: str
    sales_correlation: float
    regression_coefficient: float
    standard_error: float
    t_statistic: float
    p_value: float
    ci_lower: float
    ci_upper: float
    spend_mean: float
    spend_median: float
    spend_std_dev: float
    spend_min: float
    spend_max: float
    mean_spend_share: float
    outlier_count: int


class ChannelResponse(BaseModel):
    channels: List[ChannelEvidenceDetail]
    sources: List[SourceMeta]

"""Schemas for Advertising dataset endpoint."""

from typing import List, Optional
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class AdvertisingObservationItem(BaseModel):
    market_number: int
    tv_ads: float
    social_media_ads: float
    print_ads: float
    sales: float
    total_advertising: float
    tv_spend_share: float
    social_media_spend_share: float
    print_spend_share: float
    sales_per_total_ad_spend: float
    tv_zscore: float
    social_media_zscore: float
    print_zscore: float
    sales_zscore: float
    total_ad_spend_zscore: Optional[float] = None
    tv_iqr_flag: str
    social_media_iqr_flag: str
    print_iqr_flag: str
    sales_iqr_flag: str
    row_review_status: str


class DescriptiveStatsItem(BaseModel):
    metric: str
    tv_ads: Optional[float] = None
    social_media_ads: Optional[float] = None
    print_ads: Optional[float] = None
    sales: Optional[float] = None
    total_ads: Optional[float] = None


class OutlierObservationItem(BaseModel):
    market_number: int
    tv_ads: float
    social_media_ads: float
    print_ads: float
    sales: float
    tv_flag: str
    social_media_flag: str
    print_flag: str
    sales_flag: Optional[str] = None
    review_status: str
    review_note: Optional[str] = None


class AdvertisingResponse(BaseModel):
    total_observations: int
    observations: List[AdvertisingObservationItem]
    descriptive_statistics: List[DescriptiveStatsItem]
    outliers: List[OutlierObservationItem]
    sources: List[SourceMeta]

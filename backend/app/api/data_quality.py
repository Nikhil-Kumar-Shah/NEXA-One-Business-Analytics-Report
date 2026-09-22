"""Data Quality router."""

from fastapi import APIRouter, status
from backend.app.schemas.data_quality import DataQualityResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Data Quality"])


@router.get(
    "/data-quality",
    response_model=DataQualityResponse,
    status_code=status.HTTP_200_OK,
    summary="Data Quality Audit",
    description="Exposes pre-analysis data quality checks, row and column audits, missing values, duplicates, and outlier review flags.",
)
def get_data_quality() -> DataQualityResponse:
    return analytics_service.get_data_quality()

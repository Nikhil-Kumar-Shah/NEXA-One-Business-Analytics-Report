"""Advertising dataset router."""

from fastapi import APIRouter, status
from backend.app.schemas.advertising import AdvertisingResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Advertising"])


@router.get(
    "/advertising",
    response_model=AdvertisingResponse,
    status_code=status.HTTP_200_OK,
    summary="Advertising Dataset & Derived Analytics",
    description="Exposes all 200 market-level observations with expenditures, calculated spend shares, z-scores, IQR flags, summary statistics, and outlier review items.",
)
def get_advertising() -> AdvertisingResponse:
    return analytics_service.get_advertising()

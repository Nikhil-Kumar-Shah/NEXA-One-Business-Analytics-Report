"""Executive overview router."""

from fastapi import APIRouter, status
from backend.app.schemas.overview import OverviewResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Overview"])


@router.get(
    "/overview",
    response_model=OverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Executive Overview Metrics",
    description="Provides high-level dataset metrics, model performance statistics, correlation highlights, and data quality summary directly from the validated data foundation.",
)
def get_overview() -> OverviewResponse:
    return analytics_service.get_overview()

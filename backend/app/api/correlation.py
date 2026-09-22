"""Correlation matrix router."""

from fastapi import APIRouter, status
from backend.app.schemas.correlation import CorrelationResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Correlation"])


@router.get(
    "/correlation",
    response_model=CorrelationResponse,
    status_code=status.HTTP_200_OK,
    summary="Pearson Correlation Matrix",
    description="Provides pairwise correlation coefficients across advertising channels and sales, retaining full source numerical precision.",
)
def get_correlation() -> CorrelationResponse:
    return analytics_service.get_correlation()

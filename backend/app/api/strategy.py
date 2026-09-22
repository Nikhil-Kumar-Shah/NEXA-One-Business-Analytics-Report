"""Strategy evidence router."""

from fastapi import APIRouter, status
from backend.app.schemas.strategy import StrategyResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Strategy"])


@router.get(
    "/strategy",
    response_model=StrategyResponse,
    status_code=status.HTTP_200_OK,
    summary="Cross-Domain Strategy Evidence Inputs",
    description="Provides unified cross-domain evidence across econometric models, channel attribution, customer purchase drivers, and macroeconomic signals for future strategic synthesis without subjective directives.",
)
def get_strategy() -> StrategyResponse:
    return analytics_service.get_strategy()

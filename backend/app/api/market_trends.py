"""Market and Macro Trends (Q4) router."""

from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.schemas.market_trends import MarketTrendResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Market & Macro Trends"])


@router.get(
    "/market-trends",
    response_model=MarketTrendResponse,
    status_code=status.HTTP_200_OK,
    summary="Q4 Market & Macro Research Evidence & Analysis",
    description="Exposes India and global wireless audio market trends, premiumization dynamics, OWS form-factor evolution, macro context, and external source citations from the authoritative Q4 dataset.",
)
def get_market_trends(
    theme: Optional[str] = Query(None, description="Filter market evidence by market sector or theme"),
    source: Optional[str] = Query(None, description="Filter market evidence by source or publisher"),
    year: Optional[int] = Query(None, description="Filter market evidence by year"),
    evidence_type: Optional[str] = Query(None, description="Filter market evidence by evidence type"),
) -> MarketTrendResponse:
    return analytics_service.get_market_trends(
        theme=theme,
        source=source,
        year=year,
        evidence_type=evidence_type,
    )

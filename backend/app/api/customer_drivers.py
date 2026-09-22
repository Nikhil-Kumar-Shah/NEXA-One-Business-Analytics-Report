"""Customer Drivers (Q3) router."""

from typing import Optional
from fastapi import APIRouter, Query, status
from backend.app.schemas.customer_drivers import CustomerDriverResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Customer Drivers"])


@router.get(
    "/customer-drivers",
    response_model=CustomerDriverResponse,
    status_code=status.HTTP_200_OK,
    summary="Q3 Customer Research Evidence & Synthesis",
    description="Exposes published quantitative and qualitative customer purchase drivers, factor synthesis, analytical readout patterns, methodology rules, and source citations from the authoritative Q3 dataset.",
)
def get_customer_drivers(
    factor: Optional[str] = Query(None, description="Filter research evidence by purchase factor"),
    geography: Optional[str] = Query(None, description="Filter research evidence by geography"),
    year: Optional[int] = Query(None, description="Filter research evidence by publication year"),
    source: Optional[str] = Query(None, description="Filter research evidence by source or publisher"),
) -> CustomerDriverResponse:
    return analytics_service.get_customer_drivers(
        factor=factor,
        geography=geography,
        year=year,
        source=source,
    )

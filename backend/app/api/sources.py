"""Unified Source Registry router."""

from fastapi import APIRouter, status
from backend.app.schemas.sources import SourceRegistryResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Sources"])


@router.get(
    "/sources",
    response_model=SourceRegistryResponse,
    status_code=status.HTTP_200_OK,
    summary="Unified Research Source Registry",
    description="Provides unified citations, publishers, references, and publication years across all research domains (Advertising, Q3 Customer, Q4 Market).",
)
def get_sources() -> SourceRegistryResponse:
    return analytics_service.get_sources()

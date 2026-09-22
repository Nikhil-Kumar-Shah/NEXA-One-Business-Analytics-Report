"""Channel-level statistical evidence router."""

from fastapi import APIRouter, status
from backend.app.schemas.channels import ChannelResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Channels"])


@router.get(
    "/channels",
    response_model=ChannelResponse,
    status_code=status.HTTP_200_OK,
    summary="Channel-level Statistical Evidence",
    description="Provides comparative statistical metrics for TV, Social Media, and Print channels including spend statistics, sales correlation, regression coefficients, confidence intervals, and outlier counts without subjective ranking.",
)
def get_channels() -> ChannelResponse:
    return analytics_service.get_channels()

"""Health check router."""

from fastapi import APIRouter, status
from backend.app.schemas.common import HealthResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="API Health Status",
    description="Confirms that the analytical API service is operational and the underlying data foundation is loaded.",
)
def get_health() -> HealthResponse:
    return analytics_service.get_health_status()

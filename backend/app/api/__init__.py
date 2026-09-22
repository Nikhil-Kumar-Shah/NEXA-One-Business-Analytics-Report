"""API routes registration."""

from fastapi import APIRouter

from backend.app.api.advertising import router as advertising_router
from backend.app.api.channels import router as channels_router
from backend.app.api.correlation import router as correlation_router
from backend.app.api.customer_drivers import router as customer_drivers_router
from backend.app.api.data_quality import router as data_quality_router
from backend.app.api.health import router as health_router
from backend.app.api.market_trends import router as market_trends_router
from backend.app.api.overview import router as overview_router
from backend.app.api.regression import router as regression_router
from backend.app.api.sources import router as sources_router
from backend.app.api.strategy import router as strategy_router

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router)
api_router.include_router(overview_router)
api_router.include_router(data_quality_router)
api_router.include_router(advertising_router)
api_router.include_router(correlation_router)
api_router.include_router(regression_router)
api_router.include_router(channels_router)
api_router.include_router(customer_drivers_router)
api_router.include_router(market_trends_router)
api_router.include_router(strategy_router)
api_router.include_router(sources_router)

__all__ = ["api_router"]

"""Regression model router."""

from fastapi import APIRouter, status
from backend.app.schemas.regression import RegressionResponse
from backend.app.services.analytics_service import analytics_service

router = APIRouter(tags=["Regression"])


@router.get(
    "/regression",
    response_model=RegressionResponse,
    status_code=status.HTTP_200_OK,
    summary="Multiple Linear Regression Model",
    description="Returns the multiple linear regression model (Sales ~ TV + Social Media + Print) with coefficients, standard errors, t-statistics, p-values, confidence intervals, R², adjusted R², and F-statistic.",
)
def get_regression() -> RegressionResponse:
    return analytics_service.get_regression()

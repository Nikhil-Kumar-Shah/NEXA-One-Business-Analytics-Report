"""Schemas for Multiple Linear Regression model endpoint."""

from typing import List, Optional
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class RegressionModelDetail(BaseModel):
    model_name: str
    formula: str
    dependent_variable: str
    independent_variables: List[str]
    sample_size: int
    predictors_k: int
    residual_df: int
    r_squared: float
    adjusted_r_squared: float
    f_statistic: float
    model_p_value: float
    standard_error: float


class RegressionCoefficientDetail(BaseModel):
    variable: str
    coefficient: float
    standard_error: float
    t_statistic: float
    p_value: float
    ci_lower: float
    ci_upper: float
    interpretation: Optional[str] = None


class RegressionResponse(BaseModel):
    model: RegressionModelDetail
    coefficients: List[RegressionCoefficientDetail]
    reading_note: Optional[str] = None
    source: SourceMeta

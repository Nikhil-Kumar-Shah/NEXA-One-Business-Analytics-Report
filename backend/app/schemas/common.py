"""Common schemas for API responses, errors, and source metadata."""

from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class SourceMeta(BaseModel):
    """Authoritative source workbook and sheet attribution."""
    workbook: str
    sheet: str


class ErrorDetail(BaseModel):
    """Structured error information."""
    code: str
    message: str


class ErrorResponse(BaseModel):
    """Standardized API error envelope."""
    error: ErrorDetail


class HealthResponse(BaseModel):
    """Health check response schema."""
    status: str = Field(..., description="Service status indicator")
    service: str = Field(default="nexa-one-analytics-api", description="Service identifier")
    data_foundation: str = Field(..., description="Status of the underlying data layer")

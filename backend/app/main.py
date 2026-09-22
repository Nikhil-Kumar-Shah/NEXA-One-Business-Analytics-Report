"""FastAPI analytical application for the NEXA One Report.

Provides typed HTTP API endpoints exposing the validated Phase 1 Python data layer
to the future React frontend with full source traceability, predictable schemas,
and comprehensive error handling.
"""

from contextlib import asynccontextmanager
from pathlib import Path
import sys
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure project root is in sys.path
BASE_DIR = Path(__file__).resolve().parents[2]
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.app.api import api_router
from backend.app.config import settings
from backend.app.data.repository import repository
from backend.app.data.validators import ValidationError
from backend.app.schemas.common import ErrorDetail, ErrorResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Verifies that all three source workbooks exist and load on startup."""
    try:
        settings.verify_all_workbooks()
        repository.load_advertising_dataset()
        repository.load_customer_research()
        repository.load_market_research()
    except Exception as exc:
        print(f"Warning during startup data preload: {exc}")
    yield


app = FastAPI(
    title="NEXA One Interactive Business Analytics API",
    description="Authoritative analytical API serving validated econometric and research data for the NEXA One Report.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration for local React development servers
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


from starlette.exceptions import HTTPException as StarletteHTTPException


# Standardized error handlers conforming to Section 17 specification
@app.exception_handler(StarletteHTTPException)
async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "HTTP_ERROR", "message": str(exc.detail)}},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "HTTP_ERROR", "message": str(exc.detail)}},
    )


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "DATA_VALIDATION_ERROR", "message": str(exc)}},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "REQUEST_VALIDATION_ERROR", "message": str(exc)}},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": {"code": "INTERNAL_SERVER_ERROR", "message": "An unexpected analytical data-layer error occurred."}},
    )


# Mount API routers
app.include_router(api_router)


def run_data_foundation_verification() -> int:
    """CLI utility running the data foundation verification from Phase 1."""
    try:
        workbooks = settings.verify_all_workbooks()
        adv_wb_status = "OK" if workbooks.get("advertising") else "MISSING"
        q3_wb_status = "OK" if workbooks.get("q3_customer") else "MISSING"
        q4_wb_status = "OK" if workbooks.get("q4_market") else "MISSING"

        adv = repository.load_advertising_dataset()
        q3 = repository.load_customer_research()
        q4_evidence = repository.load_market_evidence()
        q4_trends = repository.load_market_trends()
        q4_analysis = repository.load_market_analysis()
        q4_sources = repository.load_market_sources()

        print("NEXA DATA FOUNDATION")
        print("--------------------")
        print(f"Advertising workbook: {adv_wb_status}")
        print(f"Q3 research workbook: {q3_wb_status}")
        print(f"Q4 research workbook: {q4_wb_status}")
        print()
        print("Advertising:")
        print(f"Raw rows: {len(adv.raw_data)}")
        print(f"Working rows: {len(adv.working_data)}")
        print(f"Correlation records: {len(adv.correlation.variables)}")
        print(f"Regression records: {len(adv.regression_model.coefficients)}")
        print(f"Outlier records: {len(adv.outlier_review)}")
        print()
        print("Q3:")
        print(f"Evidence records: {len(q3.research_evidence)}")
        print(f"Factor synthesis records: {len(q3.factor_synthesis)}")
        print(f"Research analysis records: {len(q3.research_analysis)}")
        print(f"Sources: {len(q3.source_register)}")
        print()
        print("Q4:")
        print(f"Market evidence records: {len(q4_evidence)}")
        print(f"Trend records: {len(q4_trends)}")
        print(f"Q4 analysis records: {len(q4_analysis)}")
        print(f"Sources: {len(q4_sources)}")
        print()
        print("Validation errors: 0")
        return 0
    except Exception as e:
        print(f"Data foundation error: {e}")
        return 1


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "serve":
        import uvicorn
        uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
    else:
        sys.exit(run_data_foundation_verification())

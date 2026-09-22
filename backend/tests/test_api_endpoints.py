"""Automated test suite for FastAPI analytical endpoints.

Verifies HTTP 200 status, schema compliance, source traceability,
and strict data integrity against the Phase 1 Python data layer.
"""

from fastapi.testclient import TestClient
import pytest

from backend.app.data.repository import repository
from backend.app.main import app
from backend.app.schemas import (
    AdvertisingResponse,
    ChannelResponse,
    CorrelationResponse,
    CustomerDriverResponse,
    DataQualityResponse,
    HealthResponse,
    MarketTrendResponse,
    OverviewResponse,
    RegressionResponse,
    SourceRegistryResponse,
    StrategyResponse,
)

client = TestClient(app)


def test_api_health_endpoint():
    """Verify GET /api/health."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    validated = HealthResponse(**data)
    assert validated.status == "ok"
    assert validated.service == "nexa-one-analytics-api"


def test_api_overview_endpoint():
    """Verify GET /api/overview."""
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    validated = OverviewResponse(**data)

    # Verify structural elements
    assert validated.dataset.market_count == 200
    assert validated.dataset.channels == ["TV", "Social Media", "Print"]
    assert validated.model.r_squared > 0.89
    assert validated.correlations.tv_sales > 0.78
    assert "raw_data" in validated.sources


def test_api_data_quality_endpoint():
    """Verify GET /api/data-quality."""
    response = client.get("/api/data-quality")
    assert response.status_code == 200
    data = response.json()
    validated = DataQualityResponse(**data)

    assert validated.overall_status in ("PASS", "CHECK")
    assert validated.metrics.row_count == 200
    assert validated.metrics.duplicate_market_ids == 0
    assert validated.metrics.missing_source_cells == 0
    assert len(validated.checks) > 0
    assert validated.source.sheet == "Data_Quality"


def test_api_advertising_endpoint():
    """Verify GET /api/advertising."""
    response = client.get("/api/advertising")
    assert response.status_code == 200
    data = response.json()
    validated = AdvertisingResponse(**data)

    assert validated.total_observations == 200
    assert len(validated.observations) == 200
    first = validated.observations[0]
    assert first.market_number == 1
    assert first.tv_ads > 0
    assert first.total_advertising > 0
    assert len(validated.outliers) == 2
    assert len(validated.sources) >= 1


def test_api_correlation_endpoint():
    """Verify GET /api/correlation."""
    response = client.get("/api/correlation")
    assert response.status_code == 200
    data = response.json()
    validated = CorrelationResponse(**data)

    assert len(validated.variables) == 4
    assert len(validated.correlations) == 12  # 4 * 3 off-diagonal pairs
    for pair in validated.correlations:
        assert isinstance(pair.coefficient, float)
    assert validated.source.sheet == "Correlation"


def test_api_regression_endpoint():
    """Verify GET /api/regression."""
    response = client.get("/api/regression")
    assert response.status_code == 200
    data = response.json()
    validated = RegressionResponse(**data)

    assert validated.model.sample_size == 200
    assert validated.model.predictors_k == 3
    assert len(validated.coefficients) == 4
    terms = [c.variable for c in validated.coefficients]
    assert "TV Ads" in terms
    assert "Social Media Ads" in terms
    assert "Print Ads" in terms
    assert "Intercept" in terms
    assert validated.source.sheet == "Regression_Model"


def test_api_channels_endpoint():
    """Verify GET /api/channels."""
    response = client.get("/api/channels")
    assert response.status_code == 200
    data = response.json()
    validated = ChannelResponse(**data)

    assert len(validated.channels) == 3
    ch_names = [ch.channel_name for ch in validated.channels]
    assert set(ch_names) == {"TV", "Social Media", "Print"}
    for ch in validated.channels:
        assert isinstance(ch.sales_correlation, float)
        assert isinstance(ch.regression_coefficient, float)
        assert isinstance(ch.spend_mean, float)
        assert isinstance(ch.mean_spend_share, float)


def test_api_customer_drivers_endpoint():
    """Verify GET /api/customer-drivers."""
    response = client.get("/api/customer-drivers")
    assert response.status_code == 200
    data = response.json()
    validated = CustomerDriverResponse(**data)

    assert validated.total_evidence_records == 57
    assert len(validated.research_evidence) == 57
    assert len(validated.factor_synthesis) == 16
    assert len(validated.research_analysis) == 7
    assert len(validated.analytical_methods) == 6
    assert len(validated.source_register) == 10


def test_api_market_trends_endpoint():
    """Verify GET /api/market-trends."""
    response = client.get("/api/market-trends")
    assert response.status_code == 200
    data = response.json()
    validated = MarketTrendResponse(**data)

    assert validated.total_evidence_records == 38
    assert len(validated.market_evidence) == 38
    assert len(validated.trend_synthesis) == 8
    assert len(validated.quantified_signals) == 5
    assert len(validated.q4_analysis) == 7
    assert len(validated.source_register) == 9


def test_api_strategy_endpoint():
    """Verify GET /api/strategy."""
    response = client.get("/api/strategy")
    assert response.status_code == 200
    data = response.json()
    validated = StrategyResponse(**data)

    assert validated.advertising_evidence.sample_size == 200
    assert len(validated.channel_evidence) == 3
    assert len(validated.customer_purchase_factors) == 16
    assert len(validated.market_macro_signals) == 8
    assert len(validated.analyst_notes) > 0
    assert validated.recommendations is not None and len(validated.recommendations) == 9
    assert validated.action_plan_phases is not None and len(validated.action_plan_phases) == 5
    assert validated.action_plan_table is not None and len(validated.action_plan_table) == 6
    assert validated.measurement_hierarchy is not None and len(validated.measurement_hierarchy) == 5
    assert validated.management_checklist is not None and len(validated.management_checklist) == 10
    assert validated.avoid_decisions is not None and len(validated.avoid_decisions) == 7



def test_api_sources_endpoint():
    """Verify GET /api/sources."""
    response = client.get("/api/sources")
    assert response.status_code == 200
    data = response.json()
    validated = SourceRegistryResponse(**data)

    # 1 advertising + 10 Q3 + 9 Q4 = 20 total sources
    assert validated.total_sources == 20
    assert len(validated.sources) == 20
    for s in validated.sources:
        assert s.source_name
        assert s.publisher
        assert s.source_workbook


def test_api_docs_and_redoc():
    """Verify OpenAPI documentation pages."""
    docs = client.get("/docs")
    assert docs.status_code == 200
    redoc = client.get("/redoc")
    assert redoc.status_code == 200
    openapi = client.get("/openapi.json")
    assert openapi.status_code == 200


def test_api_error_handling_404():
    """Verify structured error response on 404."""
    response = client.get("/api/non-existent-endpoint-12345")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_ERROR"


# ---------------------------------------------------------------------------
# Section 25: Data Integrity Tests against Phase 1 Data Layer
# ---------------------------------------------------------------------------

def test_data_integrity_regression_r_squared():
    """Verify API regression R² equals Phase 1 regression R²."""
    phase1_adv = repository.load_advertising_dataset()
    expected_r2 = phase1_adv.regression_model.r_squared
    expected_adj_r2 = phase1_adv.regression_model.adj_r_squared

    api_data = client.get("/api/regression").json()
    assert api_data["model"]["r_squared"] == expected_r2
    assert api_data["model"]["adjusted_r_squared"] == expected_adj_r2


def test_data_integrity_correlations():
    """Verify API correlations equal Phase 1 correlation matrix values."""
    phase1_adv = repository.load_advertising_dataset()
    expected_matrix = phase1_adv.correlation.matrix

    api_data = client.get("/api/correlation").json()
    assert api_data["matrix"]["TV Ads"]["Sales"] == expected_matrix["TV Ads"]["Sales"]
    assert api_data["matrix"]["Social Media Ads"]["Sales"] == expected_matrix["Social Media Ads"]["Sales"]
    assert api_data["matrix"]["Print Ads"]["Sales"] == expected_matrix["Print Ads"]["Sales"]


def test_data_integrity_counts():
    """Verify API dataset observation counts strictly equal Phase 1 counts."""
    phase1_adv = repository.load_advertising_dataset()
    phase1_q3 = repository.load_customer_research()
    phase1_q4 = repository.load_market_evidence()

    # Advertising row count
    adv_api = client.get("/api/advertising").json()
    assert adv_api["total_observations"] == len(phase1_adv.raw_data)
    assert len(adv_api["observations"]) == len(phase1_adv.working_data)

    # Q3 evidence count
    q3_api = client.get("/api/customer-drivers").json()
    assert q3_api["total_evidence_records"] == len(phase1_q3.research_evidence)

    # Q4 evidence count
    q4_api = client.get("/api/market-trends").json()
    assert q4_api["total_evidence_records"] == len(phase1_q4)


def test_customer_drivers_filtering():
    """Verify customer-drivers query parameter filtering."""
    # Filter by Factor "Battery Life"
    resp = client.get("/api/customer-drivers?factor=Battery%20Life")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_evidence_records"] == 57
    assert data["filtered_evidence_records"] < 57
    assert data["filtered_evidence_records"] > 0
    assert len(data["research_evidence"]) == data["filtered_evidence_records"]
    assert all("battery" in e["purchase_factor"].lower() for e in data["research_evidence"])

    # Filter with no matches
    resp_empty = client.get("/api/customer-drivers?factor=NonExistentFactorXYZ")
    assert resp_empty.status_code == 200
    data_empty = resp_empty.json()
    assert data_empty["total_evidence_records"] == 57
    assert data_empty["filtered_evidence_records"] == 0
    assert len(data_empty["research_evidence"]) == 0


def test_market_trends_filtering():
    """Verify market-trends query parameter filtering."""
    # Filter by Theme "Economy"
    resp = client.get("/api/market-trends?theme=Economy")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_evidence_records"] == 38
    assert data["filtered_evidence_records"] < 38
    assert data["filtered_evidence_records"] > 0
    assert len(data["market_evidence"]) == data["filtered_evidence_records"]

    # Filter with no matches
    resp_empty = client.get("/api/market-trends?theme=NonExistentThemeXYZ")
    assert resp_empty.status_code == 200
    data_empty = resp_empty.json()
    assert data_empty["total_evidence_records"] == 38
    assert data_empty["filtered_evidence_records"] == 0
    assert len(data_empty["market_evidence"]) == 0

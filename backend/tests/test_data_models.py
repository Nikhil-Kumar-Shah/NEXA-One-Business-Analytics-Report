"""Tests for internal data model representation, regression, correlations, and traceability."""

import pytest

from backend.app.data.loader import (
    load_advertising_correlation,
    load_advertising_dataset,
    load_advertising_regression,
    load_customer_research_dataset,
    load_market_research_dataset,
)


def test_9_regression_results_loaded():
    """Test 9: Regression results are loaded with all model statistics."""
    reg = load_advertising_regression()
    assert reg.observations == 200
    assert reg.predictors_k == 3
    assert reg.residual_df == 197
    assert 0.89 < reg.r_squared < 0.90
    assert 0.89 < reg.adj_r_squared < 0.90
    assert reg.f_statistic > 500
    assert reg.model_p_value < 1e-50
    assert reg.std_error_estimate > 0

    assert len(reg.coefficients) == 4
    terms = [c.term for c in reg.coefficients]
    assert "TV Ads" in terms
    assert "Social Media Ads" in terms
    assert "Print Ads" in terms
    assert "Intercept" in terms

    # Verify TV Ads coefficient properties
    tv_coef = next(c for c in reg.coefficients if c.term == "TV Ads")
    assert tv_coef.coefficient > 0.04
    assert tv_coef.std_error > 0
    assert tv_coef.t_statistic > 30
    assert tv_coef.p_value < 1e-50


def test_10_correlation_results_loaded():
    """Test 10: Pearson correlation matrix is loaded with full numeric precision."""
    corr = load_advertising_correlation()
    assert len(corr.variables) == 4
    assert set(corr.variables) == {"TV Ads", "Social Media Ads", "Print Ads", "Sales"}

    # Diagonal must be 1.0
    for var in corr.variables:
        assert corr.matrix[var][var] == 1.0

    # Symmetric relationships
    assert corr.matrix["TV Ads"]["Sales"] == corr.matrix["Sales"]["TV Ads"]
    assert 0.78 < corr.matrix["TV Ads"]["Sales"] < 0.79
    assert 0.57 < corr.matrix["Social Media Ads"]["Sales"] < 0.58
    assert 0.22 < corr.matrix["Print Ads"]["Sales"] < 0.23


def test_15_internal_models_contain_expected_fields():
    """Test 15: Datasets map to typed internal models with expected structure."""
    adv = load_advertising_dataset()
    assert hasattr(adv, "raw_data")
    assert hasattr(adv, "working_data")
    assert hasattr(adv, "data_quality")
    assert hasattr(adv, "descriptive_stats")
    assert hasattr(adv, "correlation")
    assert hasattr(adv, "regression_model")
    assert hasattr(adv, "outlier_review")
    assert hasattr(adv, "analysis_summary")

    # Outlier review content
    assert len(adv.outlier_review) == 200
    flagged = [r for r in adv.outlier_review if r.review_status != "OK"]
    assert len(flagged) == 2
    flagged_ids = {r.market_number for r in flagged}
    assert flagged_ids == {17, 102}

    # Q3 models
    q3 = load_customer_research_dataset()
    assert hasattr(q3, "research_evidence")
    assert hasattr(q3, "factor_synthesis")
    assert hasattr(q3, "research_analysis")
    assert hasattr(q3, "analytical_methods")
    assert hasattr(q3, "source_register")

    # Q4 models
    q4 = load_market_research_dataset()
    assert hasattr(q4, "market_evidence")
    assert hasattr(q4, "trend_synthesis")
    assert hasattr(q4, "quantified_signals")
    assert hasattr(q4, "q4_analysis")
    assert hasattr(q4, "source_register")


def test_source_traceability_present():
    """Test that all loaded dataset containers retain source workbook and sheet traceability."""
    adv = load_advertising_dataset()
    assert "raw_data" in adv.traceability
    assert adv.traceability["raw_data"].source_sheet == "Raw_Data"
    assert "GTA_2_0_NEXA_Advertising_Analysis" in adv.traceability["raw_data"].source_workbook

    q3 = load_customer_research_dataset()
    assert "research_evidence" in q3.traceability
    assert q3.traceability["research_evidence"].source_sheet == "Research_Evidence"
    assert "GTA_2_0_NEXA_Q3_Customer_Research" in q3.traceability["research_evidence"].source_workbook

    q4 = load_market_research_dataset()
    assert "market_evidence" in q4.traceability
    assert q4.traceability["market_evidence"].source_sheet == "Market_Evidence"
    assert "GTA_2_0_NEXA_Q4_Market_Macro" in q4.traceability["market_evidence"].source_workbook

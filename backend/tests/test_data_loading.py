"""Tests for data discovery and loading across the three workbooks."""

from pathlib import Path
import pytest

from backend.app.config import settings
from backend.app.data.loader import (
    load_advertising_raw_data,
    load_advertising_working_data,
    load_customer_factor_synthesis,
    load_customer_research_analysis,
    load_customer_research_dataset,
    load_customer_research_evidence,
    load_market_analysis,
    load_market_evidence,
    load_market_research_dataset,
    load_market_trend_synthesis,
    load_source_register,
)
from backend.app.data.validators import (
    REQUIRED_SHEETS,
    validate_required_sheets_exist,
    validate_workbook_exists,
)


def test_1_all_three_workbooks_located():
    """Test 1: All three workbooks can be located via dynamic path resolution."""
    workbooks = settings.verify_all_workbooks()
    assert "advertising" in workbooks
    assert "q3_customer" in workbooks
    assert "q4_market" in workbooks
    assert workbooks["advertising"].is_file()
    assert workbooks["q3_customer"].is_file()
    assert workbooks["q4_market"].is_file()


def test_2_required_sheets_exist():
    """Test 2: Required sheets exist in all three workbooks."""
    adv_path = settings.get_advertising_workbook_path()
    q3_path = settings.get_q3_customer_workbook_path()
    q4_path = settings.get_q4_market_workbook_path()

    validate_required_sheets_exist(adv_path, "advertising")
    validate_required_sheets_exist(q3_path, "q3_customer")
    validate_required_sheets_exist(q4_path, "q4_market")


def test_3_advertising_raw_data_loads_successfully():
    """Test 3: Advertising Raw_Data loads successfully with all fields."""
    raw = load_advertising_raw_data()
    assert len(raw) == 200
    first = raw[0]
    assert first.market_number == 1
    assert isinstance(first.tv_ads, float)
    assert isinstance(first.social_media_ads, float)
    assert isinstance(first.print_ads, float)
    assert isinstance(first.sales, float)


def test_4_advertising_working_data_loads_successfully():
    """Test 4: Advertising Working_Data loads successfully with calculated fields."""
    working = load_advertising_working_data()
    assert len(working) == 200
    first = working[0]
    assert first.market_number == 1
    assert first.total_ads > 0
    assert first.tv_spend_share > 0
    assert first.social_media_spend_share > 0
    assert first.print_spend_share > 0
    assert first.sales_per_total_ad_spend > 0
    assert first.tv_iqr_flag in ("Within range", "Review")
    assert first.row_review_status in ("OK", "Review outlier")


def test_5_q3_research_data_loads_successfully():
    """Test 5: Q3 customer research data loads successfully."""
    q3_ds = load_customer_research_dataset()
    assert len(q3_ds.research_evidence) == 57
    assert len(q3_ds.factor_synthesis) == 16
    assert len(q3_ds.research_analysis) == 7
    assert len(q3_ds.analytical_methods) == 6


def test_6_q4_market_data_loads_successfully():
    """Test 6: Q4 market data loads successfully."""
    q4_ds = load_market_research_dataset()
    assert len(q4_ds.market_evidence) == 38
    assert len(q4_ds.trend_synthesis) == 8
    assert len(q4_ds.quantified_signals) == 5
    assert len(q4_ds.q4_analysis) == 7


def test_11_q3_sources_loaded():
    """Test 11: Q3 citation sources are loaded."""
    q3_path = settings.get_q3_customer_workbook_path()
    sources = load_source_register(q3_path, "Source_Register")
    assert len(sources) == 10
    for s in sources:
        assert s.source
        assert s.publisher


def test_12_q4_sources_loaded():
    """Test 12: Q4 citation sources are loaded."""
    q4_path = settings.get_q4_market_workbook_path()
    sources = load_source_register(q4_path, "Source_Register")
    assert len(sources) == 9
    for s in sources:
        assert s.source
        assert s.publisher

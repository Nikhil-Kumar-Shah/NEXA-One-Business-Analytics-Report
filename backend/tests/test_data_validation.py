"""Tests for data validation rules and explicit error conditions."""

from pathlib import Path
import pytest

from backend.app.config import settings, Settings
from backend.app.data.loader import load_advertising_raw_data, load_advertising_working_data
from backend.app.data.validators import (
    validate_advertising_row_count,
    validate_no_duplicate_market_ids,
    validate_raw_missing_values,
    validate_required_sheets_exist,
    validate_row_conservation,
    validate_workbook_exists,
    ValidationError,
)


def test_7_advertising_row_count_preserved():
    """Test 7: Advertising dataset row count is strictly preserved at 200."""
    raw = load_advertising_raw_data()
    working = load_advertising_working_data()
    assert len(raw) == 200
    assert len(working) == 200
    validate_advertising_row_count(len(raw), 200, "Raw_Data")
    validate_advertising_row_count(len(working), 200, "Working_Data")

    # Verify exception is raised if count doesn't match
    with pytest.raises(ValidationError, match="Row count mismatch"):
        validate_advertising_row_count(199, 200, "Mock_Sheet")


def test_8_no_duplicate_market_ids():
    """Test 8: Ensure no duplicate market IDs exist and sequence 1..200 is intact."""
    raw = load_advertising_raw_data()
    market_ids = [r.market_number for r in raw]
    assert len(market_ids) == len(set(market_ids))
    assert set(market_ids) == set(range(1, 201))

    # Verify validator detects duplicates
    with pytest.raises(ValidationError, match="Duplicate market IDs"):
        validate_no_duplicate_market_ids([1, 2, 2, 3], "Mock_Sheet")


def test_13_missing_required_sheet_produces_clear_error():
    """Test 13: Missing required sheet produces a clear, descriptive ValidationError."""
    # Q3 workbook does not contain the required sheets for advertising
    q3_path = settings.get_q3_customer_workbook_path()

    with pytest.raises(ValidationError, match="Required sheet.*not found in advertising workbook"):
        validate_required_sheets_exist(q3_path, "advertising")


def test_14_invalid_or_missing_source_file_produces_clear_error():
    """Test 14: Invalid/missing source file produces an explicit error."""
    fake_path = Path("/tmp/non_existent_workbook_12345.xlsx")
    with pytest.raises(ValidationError, match="Required workbook.*not found"):
        validate_workbook_exists(fake_path, "Test Workbook")

    # Also test config discovery failure
    fake_settings = Settings(base_dir=Path("/tmp/empty_dir_nexa"))
    with pytest.raises(FileNotFoundError, match="Required Advertising workbook not found"):
        fake_settings.get_advertising_workbook_path()


def test_missing_values_validation():
    """Test that missing or invalid values in raw data are caught explicitly."""
    # Valid record
    validate_raw_missing_values([
        {"market_number": 1, "tv_ads": 10.0, "social_media_ads": 5.0, "print_ads": 2.0, "sales": 15.0}
    ])

    # Missing field
    with pytest.raises(ValidationError, match="Missing value"):
        validate_raw_missing_values([
            {"market_number": 1, "tv_ads": None, "social_media_ads": 5.0, "print_ads": 2.0, "sales": 15.0}
        ])

    # Negative value
    with pytest.raises(ValidationError, match="Negative value"):
        validate_raw_missing_values([
            {"market_number": 1, "tv_ads": -10.0, "social_media_ads": 5.0, "print_ads": 2.0, "sales": 15.0}
        ])


def test_row_conservation_validation():
    """Test that row loss detection triggers a ValidationError."""
    validate_row_conservation(200, 200, "TestEntity")
    with pytest.raises(ValidationError, match="Row loss detected"):
        validate_row_conservation(200, 198, "TestEntity")

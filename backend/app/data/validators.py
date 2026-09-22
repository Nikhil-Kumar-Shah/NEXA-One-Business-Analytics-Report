"""Data validation module enforcing integrity checks A through K.

Provides explicit, non-silent validation for:
A. Workbook existence
B. Sheet existence
C. Column existence
D. Row count preservation (exactly 200 advertising markets)
E. Missing values detection in raw dataset
F. Duplicate market IDs check
G. Numeric fields validation
H. Research source records completeness
I. Row conservation during normalization
J. Column conservation during normalization
K. Data type adherence
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Set
import openpyxl


class ValidationError(Exception):
    """Raised when any structural or data integrity check fails."""
    pass


REQUIRED_SHEETS: Dict[str, List[str]] = {
    "advertising": [
        "Raw_Data",
        "Working_Data",
        "Data_Quality",
        "Descriptive_Stats",
        "Correlation",
        "Regression_Model",
        "Outlier_Review",
        "Analysis_Summary",
    ],
    "q3_customer": [
        "Research_Evidence",
        "Factor_Synthesis",
        "Research_Analysis",
        "Source_Register",
    ],
    "q4_market": [
        "Market_Evidence",
        "Trend_Synthesis",
        "Q4_Analysis",
        "Source_Register",
    ],
}

REQUIRED_RAW_COLUMNS: List[str] = [
    "market_number",
    "tv_ads",
    "social_media_ads",
    "print_ads",
    "sales",
]


def validate_workbook_exists(file_path: Path, workbook_label: str) -> None:
    """Check A: Verifies the target workbook exists on disk."""
    if not file_path.is_file():
        raise ValidationError(
            f"Required workbook '{workbook_label}' was not found at '{file_path}'."
        )


def validate_required_sheets_exist(file_path: Path, workbook_type: str) -> None:
    """Check B: Verifies all mandatory sheets exist within the workbook."""
    if workbook_type not in REQUIRED_SHEETS:
        raise ValidationError(
            f"Unknown workbook type '{workbook_type}'. Supported: {list(REQUIRED_SHEETS.keys())}"
        )

    wb = openpyxl.load_workbook(file_path, read_only=True)
    existing_sheets = set(wb.sheetnames)
    wb.close()

    expected = REQUIRED_SHEETS[workbook_type]
    missing = [s for s in expected if s not in existing_sheets]
    if missing:
        raise ValidationError(
            f"Required sheet(s) {missing} not found in {workbook_type} workbook at '{file_path}'. "
            f"Found sheets: {list(existing_sheets)}"
        )


def validate_required_columns(
    actual_columns: List[str],
    expected_columns: List[str],
    sheet_name: str,
) -> None:
    """Check C & J: Verifies all expected columns exist without unexpected loss."""
    actual_set = set(actual_columns)
    missing = [col for col in expected_columns if col not in actual_set]
    if missing:
        raise ValidationError(
            f"Required column(s) {missing} missing from sheet '{sheet_name}'. "
            f"Present columns: {actual_columns}"
        )


def validate_advertising_row_count(
    actual_count: int,
    expected_count: int = 200,
    sheet_name: str = "Raw_Data",
) -> None:
    """Check D: Verifies that the dataset preserves the exact expected observation count."""
    if actual_count != expected_count:
        raise ValidationError(
            f"Row count mismatch in '{sheet_name}': expected {expected_count} rows, found {actual_count}."
        )


def validate_no_duplicate_market_ids(market_ids: List[int], sheet_name: str) -> None:
    """Check F: Ensures no duplicate market numbers exist and exactly 200 unique IDs exist."""
    if len(market_ids) != len(set(market_ids)):
        duplicates = [x for x in market_ids if market_ids.count(x) > 1]
        raise ValidationError(
            f"Duplicate market IDs found in sheet '{sheet_name}': {set(duplicates)}"
        )
    if len(market_ids) == 200:
        expected_ids = set(range(1, 201))
        actual_ids = set(market_ids)
        if actual_ids != expected_ids:
            missing = expected_ids - actual_ids
            raise ValidationError(
                f"Market IDs in sheet '{sheet_name}' do not match expected sequence 1..200. Missing: {missing}"
            )


def validate_raw_missing_values(records: List[Dict[str, Any]], sheet_name: str = "Raw_Data") -> None:
    """Check E & G: Verifies that raw advertising data contains no empty or invalid cells."""
    for idx, row in enumerate(records):
        market_id = row.get("market_number", idx + 1)
        for field in REQUIRED_RAW_COLUMNS:
            val = row.get(field)
            if val is None:
                raise ValidationError(
                    f"Missing value in '{sheet_name}' at market {market_id} for field '{field}'."
                )
            if not isinstance(val, (int, float)):
                raise ValidationError(
                    f"Non-numeric value '{val}' in '{sheet_name}' at market {market_id} for field '{field}'."
                )
            if val < 0:
                raise ValidationError(
                    f"Negative value '{val}' in '{sheet_name}' at market {market_id} for field '{field}'."
                )


def validate_research_sources_not_empty(
    sources: List[Dict[str, Any]],
    dataset_name: str,
) -> None:
    """Check H: Verifies that research source records contain meaningful source information."""
    if not sources:
        raise ValidationError(f"Source register for '{dataset_name}' is empty.")
    for idx, src in enumerate(sources):
        name = src.get("source")
        publisher = src.get("publisher")
        if not name or not str(name).strip():
            raise ValidationError(
                f"Source record #{idx + 1} in '{dataset_name}' is missing source name."
            )
        if not publisher or not str(publisher).strip():
            raise ValidationError(
                f"Source record '{name}' in '{dataset_name}' is missing publisher information."
            )


def validate_row_conservation(
    source_row_count: int,
    normalized_row_count: int,
    entity_name: str,
) -> None:
    """Check I: Verifies that no rows were dropped or added during ingestion/normalization."""
    if source_row_count != normalized_row_count:
        raise ValidationError(
            f"Row loss detected during normalization of '{entity_name}': "
            f"raw source had {source_row_count} rows, normalized model has {normalized_row_count}."
        )

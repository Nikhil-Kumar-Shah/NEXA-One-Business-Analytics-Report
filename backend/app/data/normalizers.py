"""Data normalization utilities for column mappings and value conversions.

Provides bidirectional mapping between original workbook column headers and
internal model attribute names, while preserving display labels and enforcing
type-safe casting without loss of qualitative values or silent 0-coercion.
"""

import math
import re
from typing import Any, Dict, Optional, Union


# ---------------------------------------------------------------------------
# Header / Label Normalization Mappings
# ---------------------------------------------------------------------------

COLUMN_NAME_MAPPINGS: Dict[str, Dict[str, str]] = {
    "Advertising_Raw_Data": {
        "market_number": "market_number",
        "tv_ads": "tv_ads",
        "social_media_ads": "social_media_ads",
        "print_ads": "print_ads",
        "sales": "sales",
    },
    "Advertising_Working_Data": {
        "market_number": "market_number",
        "tv_ads": "tv_ads",
        "social_media_ads": "social_media_ads",
        "print_ads": "print_ads",
        "sales": "sales",
        "total_ads": "total_ads",
        "TV spend share": "tv_spend_share",
        "Social media spend share": "social_media_spend_share",
        "Print spend share": "print_spend_share",
        "Sales / total ad spend": "sales_per_total_ad_spend",
        "TV z-score": "tv_zscore",
        "Social media z-score": "social_media_zscore",
        "Print z-score": "print_zscore",
        "Sales z-score": "sales_zscore",
        "Total ad spend z-score": "total_ad_spend_zscore",
        "TV IQR flag": "tv_iqr_flag",
        "social_outlier_iqr": "social_media_iqr_flag",
        "Social media IQR flag": "social_media_iqr_flag",
        "Print IQR flag": "print_iqr_flag",
        "Sales IQR flag": "sales_iqr_flag",
        "Total ad spend IQR flag": "total_ad_spend_iqr_flag",
        "Row review status": "row_review_status",
    },
    "Customer_Research_Evidence": {
        "Source": "source",
        "Year": "year",
        "Geography": "geography",
        "Sample / research basis": "sample_basis",
        "Product category": "product_category",
        "Purchase factor": "purchase_factor",
        "Reported value": "reported_value",
        "Measure": "measure",
        "Evidence type": "evidence_type",
        "Research note": "research_note",
        "Publisher": "publisher",
        "Source link": "source_link",
    },
    "Customer_Factor_Synthesis": {
        "Factor": "factor",
        "Quantitative observations": "quantitative_observations",
        "Mean reported %": "mean_reported_pct",
        "Median reported %": "median_reported_pct",
        "Minimum %": "minimum_pct",
        "Maximum %": "maximum_pct",
        "Latest quantitative year": "latest_quantitative_year",
        "India-specific evidence": "india_specific_evidence",
        "Qualitative support": "qualitative_support",
        "Interpretation": "interpretation",
    },
    "Customer_Research_Analysis": {
        "Observed pattern": "observed_pattern",
        "Evidence from research": "evidence_from_research",
        "Business implication for NEXA One": "business_implication",
        "Limitation / context": "limitation_context",
    },
    "Source_Register": {
        "Source": "source",
        "Publication year": "publication_year",
        "Publisher": "publisher",
        "Source link": "source_link",
        "What it contributes": "what_it_contributes",
    },
    "Market_Evidence": {
        "Source": "source",
        "Year": "year",
        "Geography": "geography",
        "Market / sector": "market_sector",
        "Indicator": "indicator",
        "Period": "period",
        "Reported value": "reported_value",
        "Measure": "measure",
        "Evidence type": "evidence_type",
        "Research note": "research_note",
        "Publisher": "publisher",
    },
    "Market_Trend_Synthesis": {
        "Trend area": "trend_area",
        "Observed signal": "observed_signal",
        "Direction": "direction",
        "Business relevance to NEXA": "business_relevance",
        "Evidence strength / context": "evidence_strength_context",
    },
    "Market_Analysis": {
        "Analytical point": "analytical_point",
        "Evidence": "evidence",
        "Implication for NEXA planning": "implication_for_nexa",
        "Boundary / limitation": "boundary_limitation",
    },
}


def normalize_column_name(sheet_context: str, col_name: str) -> str:
    """Returns normalized internal snake_case field name, preserving original if not in mapping."""
    clean_col = str(col_name).strip()
    if sheet_context in COLUMN_NAME_MAPPINGS:
        if clean_col in COLUMN_NAME_MAPPINGS[sheet_context]:
            return COLUMN_NAME_MAPPINGS[sheet_context][clean_col]

    # Fallback to safe snake_case normalization
    s = re.sub(r"[^\w\s]", "", clean_col)
    s = re.sub(r"\s+", "_", s).lower()
    return s


def get_original_column_label(sheet_context: str, internal_name: str) -> Optional[str]:
    """Retrieves the original workbook column label from the internal name."""
    if sheet_context in COLUMN_NAME_MAPPINGS:
        for orig, internal in COLUMN_NAME_MAPPINGS[sheet_context].items():
            if internal == internal_name:
                return orig
    return None


# ---------------------------------------------------------------------------
# Safe Type Casting Functions
# ---------------------------------------------------------------------------

def safe_int(value: Any) -> Optional[int]:
    """Safely cast numeric value to int, returning None if empty or invalid."""
    if value is None or value == "" or (isinstance(value, float) and math.isnan(value)):
        return None
    try:
        return int(round(float(value)))
    except (ValueError, TypeError):
        return None


def safe_float(value: Any) -> Optional[float]:
    """Safely cast value to float, returning None for missing or unparseable text."""
    if value is None or value == "" or (isinstance(value, float) and math.isnan(value)):
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def safe_str(value: Any) -> Optional[str]:
    """Safely cast value to trimmed string, returning None for empty cells."""
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    s = str(value).strip()
    return s if s else None


def safe_numeric_or_str(value: Any) -> Optional[Union[float, int, str]]:
    """Converts genuinely numeric values to float/int, but preserves qualitative text intact."""
    if value is None or value == "" or (isinstance(value, float) and math.isnan(value)):
        return None
    if isinstance(value, (int, float)):
        return value
    # Try converting numeric strings
    str_val = str(value).strip()
    try:
        # Check if integer
        if str_val.isdigit() or (str_val.startswith("-") and str_val[1:].isdigit()):
            return int(str_val)
        val = float(str_val)
        return val
    except ValueError:
        return str_val

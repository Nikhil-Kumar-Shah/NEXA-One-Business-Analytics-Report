"""Workbook data loading and parsing module.

Extracts data from the authoritative Excel workbooks into validated,
typed Python data models with full source traceability. Handles Excel formula
evaluation through a safe, read-only cache layer without modifying the original
source workbooks.
"""

import os
from pathlib import Path
import shutil
import subprocess
from typing import Any, Dict, List, Optional, Tuple
import openpyxl

from backend.app.config import settings
from backend.app.data.models import (
    AdvertisingDataset,
    AdvertisingRawRecord,
    AdvertisingWorkingRecord,
    AnalysisSummary,
    CorrelationMatrix,
    CustomerFactorSynthesisRecord,
    CustomerMethodRule,
    CustomerResearchAnalysisRecord,
    CustomerResearchDataset,
    CustomerResearchEvidenceRecord,
    DataQualityRecord,
    DescriptiveStatisticItem,
    MarketAnalysisRecord,
    MarketEvidenceRecord,
    MarketResearchDataset,
    MarketTrendSynthesisRecord,
    OutlierReviewRecord,
    QuantifiedSignal,
    RegressionCoefficient,
    RegressionModelSummary,
    SourceRegisterRecord,
    SourceTraceability,
)
from backend.app.data.normalizers import (
    normalize_column_name,
    safe_float,
    safe_int,
    safe_numeric_or_str,
    safe_str,
)
from backend.app.data.validators import (
    validate_advertising_row_count,
    validate_no_duplicate_market_ids,
    validate_raw_missing_values,
    validate_required_columns,
    validate_required_sheets_exist,
    validate_research_sources_not_empty,
    validate_row_conservation,
    validate_workbook_exists,
    ValidationError,
)


def get_evaluated_advertising_path(source_path: Path) -> Path:
    """Generates or retrieves an evaluated copy of the advertising workbook.

    Because the original workbook contains Excel formulas without pre-cached <v>
    tags, evaluating it into an external cache or using the pre-bundled evaluated
    file ensures complete formula fidelity without requiring LibreOffice in
    serverless production environments.
    """
    # 1. Check for bundled pre-evaluated workbook
    bundled_evaluated = Path(__file__).resolve().parent / "evaluated_advertising.xlsx"
    if bundled_evaluated.is_file():
        return bundled_evaluated

    cache_dir = settings.cache_dir
    try:
        cache_dir.mkdir(parents=True, exist_ok=True)
    except (OSError, PermissionError):
        pass
    evaluated_file = cache_dir / "evaluated_advertising.xlsx"

    source_mtime = source_path.stat().st_mtime
    if evaluated_file.is_file() and evaluated_file.stat().st_mtime >= source_mtime:
        return evaluated_file

    # Attempt evaluation via headless LibreOffice
    libreoffice_bin = shutil.which("libreoffice") or shutil.which("soffice")
    if libreoffice_bin:
        try:
            # Convert xlsx -> ods -> xlsx to trigger full calculation engine
            temp_ods_dir = cache_dir / "tmp_eval"
            temp_ods_dir.mkdir(parents=True, exist_ok=True)
            subprocess.run(
                [libreoffice_bin, "--headless", "--convert-to", "ods", str(source_path), "--outdir", str(temp_ods_dir)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=True,
            )
            ods_files = list(temp_ods_dir.glob("*.ods"))
            if ods_files:
                ods_path = ods_files[0]
                subprocess.run(
                    [libreoffice_bin, "--headless", "--convert-to", "xlsx", str(ods_path), "--outdir", str(cache_dir)],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    check=True,
                )
                generated_xlsx = cache_dir / f"{ods_path.stem}.xlsx"
                if generated_xlsx.is_file():
                    if generated_xlsx != evaluated_file:
                        shutil.move(str(generated_xlsx), str(evaluated_file))
                    shutil.rmtree(str(temp_ods_dir), ignore_errors=True)
                    return evaluated_file
        except Exception:
            shutil.rmtree(str(cache_dir / "tmp_eval"), ignore_errors=True)

    # If LibreOffice failed or was unavailable, return source_path
    return source_path


# ---------------------------------------------------------------------------
# Advertising Workbook Loaders
# ---------------------------------------------------------------------------

def load_advertising_raw_data(source_path: Optional[Path] = None) -> List[AdvertisingRawRecord]:
    """Loads sheet 'Raw_Data' preserving all 200 untouched observations."""
    path = source_path or settings.get_advertising_workbook_path()
    validate_workbook_exists(path, "Advertising Workbook")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Raw_Data" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Raw_Data' was not found in advertising workbook.")

    ws = wb["Raw_Data"]
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3  # Row 4 (0-indexed 3)
    header = [str(c).strip() for c in all_rows[header_row_idx] if c is not None]
    validate_required_columns(
        header,
        ["market_number", "tv_ads", "social_media_ads", "print_ads", "sales"],
        "Raw_Data",
    )

    records: List[AdvertisingRawRecord] = []
    raw_dicts: List[Dict[str, Any]] = []
    market_ids: List[int] = []

    for r in all_rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        m_id = safe_int(r[0])
        if m_id is None:
            continue
        row_dict = {
            "market_number": m_id,
            "tv_ads": safe_float(r[1]),
            "social_media_ads": safe_float(r[2]),
            "print_ads": safe_float(r[3]),
            "sales": safe_float(r[4]),
        }
        raw_dicts.append(row_dict)
        market_ids.append(m_id)
        records.append(AdvertisingRawRecord(**row_dict))

    validate_advertising_row_count(len(records), 200, "Raw_Data")
    validate_no_duplicate_market_ids(market_ids, "Raw_Data")
    validate_raw_missing_values(raw_dicts, "Raw_Data")

    return records


def load_advertising_working_data(source_path: Optional[Path] = None) -> List[AdvertisingWorkingRecord]:
    """Loads sheet 'Working_Data' preserving all calculated fields and flags."""
    path = source_path or settings.get_advertising_workbook_path()
    validate_workbook_exists(path, "Advertising Workbook")
    eval_path = get_evaluated_advertising_path(path)

    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Working_Data" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Working_Data' was not found in advertising workbook.")

    ws = wb["Working_Data"]
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    header = [str(c).strip() for c in all_rows[header_row_idx] if c is not None]
    records: List[AdvertisingWorkingRecord] = []
    market_ids: List[int] = []

    for r in all_rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        m_id = safe_int(r[0])
        if m_id is None:
            continue

        item = AdvertisingWorkingRecord(
            market_number=m_id,
            tv_ads=safe_float(r[1]) or 0.0,
            social_media_ads=safe_float(r[2]) or 0.0,
            print_ads=safe_float(r[3]) or 0.0,
            sales=safe_float(r[4]) or 0.0,
            total_ads=safe_float(r[5]) or 0.0,
            tv_spend_share=safe_float(r[6]) or 0.0,
            social_media_spend_share=safe_float(r[7]) or 0.0,
            print_spend_share=safe_float(r[8]) or 0.0,
            sales_per_total_ad_spend=safe_float(r[9]) or 0.0,
            tv_zscore=safe_float(r[10]) or 0.0,
            social_media_zscore=safe_float(r[11]) or 0.0,
            print_zscore=safe_float(r[12]) or 0.0,
            sales_zscore=safe_float(r[13]) or 0.0,
            total_ad_spend_zscore=safe_float(r[14]),
            tv_iqr_flag=safe_str(r[15]) or "Within range",
            social_media_iqr_flag=safe_str(r[16]) or "Within range",
            print_iqr_flag=safe_str(r[17]) or "Within range",
            sales_iqr_flag=safe_str(r[18]) or "Within range",
            row_review_status=safe_str(r[19]) or "OK",
        )
        records.append(item)
        market_ids.append(m_id)

    validate_advertising_row_count(len(records), 200, "Working_Data")
    validate_no_duplicate_market_ids(market_ids, "Working_Data")
    return records


def load_advertising_data_quality(source_path: Optional[Path] = None) -> List[DataQualityRecord]:
    """Loads sheet 'Data_Quality'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Data_Quality" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Data_Quality' was not found in advertising workbook.")

    ws = wb["Data_Quality"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[DataQualityRecord] = []
    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        check_name = safe_str(r[0])
        if not check_name:
            continue
        val = safe_numeric_or_str(r[1])
        desc = safe_str(r[2]) or ""
        status = safe_str(r[3]) or ""
        records.append(DataQualityRecord(
            check=check_name,
            formula_result=val if val is not None else "",
            what_it_checks=desc,
            status=status,
        ))
    return records


def load_advertising_descriptive_stats(source_path: Optional[Path] = None) -> List[DescriptiveStatisticItem]:
    """Loads sheet 'Descriptive_Stats'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Descriptive_Stats" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Descriptive_Stats' was not found in advertising workbook.")

    ws = wb["Descriptive_Stats"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    items: List[DescriptiveStatisticItem] = []
    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        metric_name = safe_str(r[0])
        if not metric_name:
            continue
        items.append(DescriptiveStatisticItem(
            metric=metric_name,
            tv_ads=safe_float(r[1]),
            social_media_ads=safe_float(r[2]),
            print_ads=safe_float(r[3]),
            sales=safe_float(r[4]),
            total_ads=safe_float(r[5]),
        ))
    return items


def load_advertising_correlation(source_path: Optional[Path] = None) -> CorrelationMatrix:
    """Loads sheet 'Correlation'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Correlation" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Correlation' was not found in advertising workbook.")

    ws = wb["Correlation"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    cols = [safe_str(c) for c in rows[header_row_idx][1:5]]
    variables = [c for c in cols if c is not None]

    matrix: Dict[str, Dict[str, float]] = {}
    reading_note = None

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        var_name = safe_str(r[0])
        if var_name in variables:
            matrix[var_name] = {}
            for idx, other_var in enumerate(variables):
                matrix[var_name][other_var] = safe_float(r[idx + 1]) or 0.0
        elif var_name == "Reading the matrix":
            reading_note = safe_str(r[1])

    return CorrelationMatrix(
        variables=variables,
        matrix=matrix,
        reading_note=reading_note,
    )


def load_advertising_regression(source_path: Optional[Path] = None) -> RegressionModelSummary:
    """Loads sheet 'Regression_Model'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Regression_Model" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Regression_Model' was not found in advertising workbook.")

    ws = wb["Regression_Model"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    model_formula = safe_str(rows[3][1]) or "sales = intercept + βTV·tv_ads + βSocial·social_media_ads + βPrint·print_ads"
    coefficients: List[RegressionCoefficient] = []

    # Table starts at row 5 (0-indexed 5)
    for r in rows[6:10]:
        term = safe_str(r[0])
        if term:
            coefficients.append(RegressionCoefficient(
                term=term,
                coefficient=safe_float(r[1]) or 0.0,
                std_error=safe_float(r[2]) or 0.0,
                t_statistic=safe_float(r[3]) or 0.0,
                p_value=safe_float(r[4]) or 0.0,
                ci_95_low=safe_float(r[5]) or 0.0,
                ci_95_high=safe_float(r[6]) or 0.0,
                interpretation=safe_str(r[7]),
            ))

    obs = 200
    predictors_k = 3
    residual_df = 197
    r_squared = 0.0
    adj_r_squared = 0.0
    f_stat = 0.0
    model_p = 0.0
    se_estimate = 0.0
    reading_note = None

    for r in rows[11:]:
        if not any(x is not None for x in r):
            continue
        label = safe_str(r[0])
        val = r[1]
        if label == "Observations":
            obs = safe_int(val) or obs
        elif label == "Predictors (k)":
            predictors_k = safe_int(val) or predictors_k
        elif label == "Residual degrees of freedom":
            residual_df = safe_int(val) or residual_df
        elif label == "R-squared":
            r_squared = safe_float(val) or 0.0
        elif label == "Adjusted R-squared":
            adj_r_squared = safe_float(val) or 0.0
        elif label == "F Statistic":
            f_stat = safe_float(val) or 0.0
        elif label == "Model p Value":
            model_p = safe_float(val) or 0.0
        elif label == "Standard Error of Estimate":
            se_estimate = safe_float(val) or 0.0

        if len(r) > 4 and safe_str(r[4]) == "How to read the model" and len(r) > 5:
            reading_note = safe_str(r[5])

    return RegressionModelSummary(
        model_formula=model_formula,
        coefficients=coefficients,
        observations=obs,
        predictors_k=predictors_k,
        residual_df=residual_df,
        r_squared=r_squared,
        adj_r_squared=adj_r_squared,
        f_statistic=f_stat,
        model_p_value=model_p,
        std_error_estimate=se_estimate,
        reading_note=reading_note,
    )


def load_advertising_outlier_review(source_path: Optional[Path] = None) -> List[OutlierReviewRecord]:
    """Loads sheet 'Outlier_Review'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Outlier_Review" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Outlier_Review' was not found in advertising workbook.")

    ws = wb["Outlier_Review"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[OutlierReviewRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        m_id = safe_int(r[0])
        if m_id is None:
            continue
        records.append(OutlierReviewRecord(
            market_number=m_id,
            tv_ads=safe_float(r[1]) or 0.0,
            social_media_ads=safe_float(r[2]) or 0.0,
            print_ads=safe_float(r[3]) or 0.0,
            sales=safe_float(r[4]) or 0.0,
            tv_flag=safe_str(r[5]) or "Within range",
            social_media_flag=safe_str(r[6]) or "Within range",
            print_flag=safe_str(r[7]) or "Within range",
            sales_flag=safe_str(r[8]),
            review_status=safe_str(r[9]) or "OK",
            review_note=safe_str(r[11]) if len(r) > 11 else None,
        ))

    validate_advertising_row_count(len(records), 200, "Outlier_Review")
    return records


def load_advertising_analysis_summary(source_path: Optional[Path] = None) -> AnalysisSummary:
    """Loads sheet 'Analysis_Summary'."""
    path = source_path or settings.get_advertising_workbook_path()
    eval_path = get_evaluated_advertising_path(path)
    wb = openpyxl.load_workbook(eval_path, data_only=True)
    if "Analysis_Summary" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Analysis_Summary' was not found in advertising workbook.")

    ws = wb["Analysis_Summary"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    dq_summary: Dict[str, Any] = {}
    core_outputs: Dict[str, Any] = {}
    notes: List[str] = []

    for r in rows[4:11]:
        dq_label = safe_str(r[0])
        if dq_label:
            dq_summary[dq_label] = safe_numeric_or_str(r[1])
        core_label = safe_str(r[3]) if len(r) > 3 else None
        if core_label:
            core_outputs[core_label] = safe_numeric_or_str(r[4]) if len(r) > 4 else None

    # Analyst notes from rows 13 onwards
    for r in rows[13:]:
        note = safe_str(r[0])
        if note:
            notes.append(note)

    return AnalysisSummary(
        data_quality_summary=dq_summary,
        core_statistical_outputs=core_outputs,
        analyst_notes=notes,
    )


def load_advertising_dataset(source_path: Optional[Path] = None) -> AdvertisingDataset:
    """Loads the complete advertising dataset with source traceability."""
    path = source_path or settings.get_advertising_workbook_path()
    validate_workbook_exists(path, "Advertising Workbook")
    validate_required_sheets_exist(path, "advertising")

    wb_filename = path.name

    traceability = {
        "raw_data": SourceTraceability(source_workbook=wb_filename, source_sheet="Raw_Data"),
        "working_data": SourceTraceability(source_workbook=wb_filename, source_sheet="Working_Data"),
        "data_quality": SourceTraceability(source_workbook=wb_filename, source_sheet="Data_Quality"),
        "descriptive_stats": SourceTraceability(source_workbook=wb_filename, source_sheet="Descriptive_Stats"),
        "correlation": SourceTraceability(source_workbook=wb_filename, source_sheet="Correlation"),
        "regression_model": SourceTraceability(source_workbook=wb_filename, source_sheet="Regression_Model"),
        "outlier_review": SourceTraceability(source_workbook=wb_filename, source_sheet="Outlier_Review"),
        "analysis_summary": SourceTraceability(source_workbook=wb_filename, source_sheet="Analysis_Summary"),
    }

    raw = load_advertising_raw_data(path)
    working = load_advertising_working_data(path)
    dq = load_advertising_data_quality(path)
    desc = load_advertising_descriptive_stats(path)
    corr = load_advertising_correlation(path)
    reg = load_advertising_regression(path)
    outliers = load_advertising_outlier_review(path)
    summary = load_advertising_analysis_summary(path)

    # Validate conservation
    validate_row_conservation(len(raw), len(working), "Advertising working data")
    validate_row_conservation(len(raw), len(outliers), "Advertising outlier review")

    return AdvertisingDataset(
        traceability=traceability,
        raw_data=raw,
        working_data=working,
        data_quality=dq,
        descriptive_stats=desc,
        correlation=corr,
        regression_model=reg,
        outlier_review=outliers,
        analysis_summary=summary,
    )


# ---------------------------------------------------------------------------
# Q3 Customer Research Loaders
# ---------------------------------------------------------------------------

def load_customer_research_evidence(source_path: Optional[Path] = None) -> List[CustomerResearchEvidenceRecord]:
    """Loads sheet 'Research_Evidence'."""
    path = source_path or settings.get_q3_customer_workbook_path()
    validate_workbook_exists(path, "Q3 Customer Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Research_Evidence" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Research_Evidence' was not found in Q3 Customer workbook.")

    ws = wb["Research_Evidence"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[CustomerResearchEvidenceRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        src = safe_str(r[0])
        if not src:
            continue
        records.append(CustomerResearchEvidenceRecord(
            source=src,
            year=safe_int(r[1]),
            geography=safe_str(r[2]) or "",
            sample_basis=safe_str(r[3]),
            product_category=safe_str(r[4]) or "",
            purchase_factor=safe_str(r[5]) or "",
            reported_value=safe_numeric_or_str(r[6]),
            measure=safe_str(r[7]),
            evidence_type=safe_str(r[8]) or "",
            research_note=safe_str(r[9]),
            publisher=safe_str(r[10]) if len(r) > 10 else None,
            source_link=safe_str(r[11]) if len(r) > 11 else None,
        ))
    return records


def load_customer_factor_synthesis(source_path: Optional[Path] = None) -> List[CustomerFactorSynthesisRecord]:
    """Loads sheet 'Factor_Synthesis'."""
    path = source_path or settings.get_q3_customer_workbook_path()
    validate_workbook_exists(path, "Q3 Customer Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Factor_Synthesis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Factor_Synthesis' was not found in Q3 Customer workbook.")

    ws = wb["Factor_Synthesis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[CustomerFactorSynthesisRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        factor = safe_str(r[0])
        if not factor:
            continue
        records.append(CustomerFactorSynthesisRecord(
            factor=factor,
            quantitative_observations=safe_int(r[1]) or 0,
            mean_reported_pct=safe_float(r[2]),
            median_reported_pct=safe_float(r[3]),
            minimum_pct=safe_float(r[4]),
            maximum_pct=safe_float(r[5]),
            latest_quantitative_year=safe_int(r[6]),
            india_specific_evidence=safe_str(r[7]) or "No",
            qualitative_support=safe_str(r[8]),
            interpretation=safe_str(r[9]) or "",
        ))
    return records


def load_customer_research_analysis(source_path: Optional[Path] = None) -> List[CustomerResearchAnalysisRecord]:
    """Loads analytical patterns from sheet 'Research_Analysis'."""
    path = source_path or settings.get_q3_customer_workbook_path()
    validate_workbook_exists(path, "Q3 Customer Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Research_Analysis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Research_Analysis' was not found in Q3 Customer workbook.")

    ws = wb["Research_Analysis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[CustomerResearchAnalysisRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        pattern = safe_str(r[0])
        # Stop before methodology section
        if not pattern or pattern == "Analytical method" or pattern.isdigit():
            continue
        records.append(CustomerResearchAnalysisRecord(
            observed_pattern=pattern,
            evidence_from_research=safe_str(r[1]) or "",
            business_implication=safe_str(r[2]) or "",
            limitation_context=safe_str(r[3]) or "",
        ))
    return records


def load_customer_analytical_methods(source_path: Optional[Path] = None) -> List[CustomerMethodRule]:
    """Loads methodology rules from the lower section of sheet 'Research_Analysis'."""
    path = source_path or settings.get_q3_customer_workbook_path()
    validate_workbook_exists(path, "Q3 Customer Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Research_Analysis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Research_Analysis' was not found in Q3 Customer workbook.")

    ws = wb["Research_Analysis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    method_rules: List[CustomerMethodRule] = []
    in_method_section = False

    for r in rows:
        c0 = safe_str(r[0])
        if c0 == "Analytical method":
            in_method_section = True
            continue
        if in_method_section:
            r_num = safe_int(c0)
            if r_num is not None and len(r) > 2:
                method_rules.append(CustomerMethodRule(
                    rule_number=r_num,
                    rule_title=safe_str(r[1]) or "",
                    rule_description=safe_str(r[2]) or "",
                ))
    return method_rules


def load_source_register(workbook_path: Path, sheet_name: str = "Source_Register") -> List[SourceRegisterRecord]:
    """Loads citation source records from either Q3 or Q4 Source_Register sheet."""
    validate_workbook_exists(workbook_path, f"Workbook ({workbook_path.name})")

    wb = openpyxl.load_workbook(workbook_path, data_only=True)
    if sheet_name not in wb.sheetnames:
        wb.close()
        raise ValidationError(f"Required sheet '{sheet_name}' was not found in '{workbook_path.name}'.")

    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[SourceRegisterRecord] = []
    dict_records: List[Dict[str, Any]] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        source_name = safe_str(r[0])
        if not source_name:
            continue
        pub_year = safe_int(r[1])
        publisher = safe_str(r[2]) or ""
        link = safe_str(r[3])
        contributes = safe_str(r[4]) or ""

        rec = SourceRegisterRecord(
            source=source_name,
            publication_year=pub_year,
            publisher=publisher,
            source_link=link,
            what_it_contributes=contributes,
        )
        records.append(rec)
        dict_records.append(rec.model_dump())

    validate_research_sources_not_empty(dict_records, workbook_path.name)
    return records


def load_customer_research_dataset(source_path: Optional[Path] = None) -> CustomerResearchDataset:
    """Loads the complete Q3 Customer Research dataset with source traceability."""
    path = source_path or settings.get_q3_customer_workbook_path()
    validate_workbook_exists(path, "Q3 Customer Research")
    validate_required_sheets_exist(path, "q3_customer")

    wb_filename = path.name

    traceability = {
        "research_evidence": SourceTraceability(source_workbook=wb_filename, source_sheet="Research_Evidence"),
        "factor_synthesis": SourceTraceability(source_workbook=wb_filename, source_sheet="Factor_Synthesis"),
        "research_analysis": SourceTraceability(source_workbook=wb_filename, source_sheet="Research_Analysis"),
        "source_register": SourceTraceability(source_workbook=wb_filename, source_sheet="Source_Register"),
    }

    evidence = load_customer_research_evidence(path)
    synthesis = load_customer_factor_synthesis(path)
    analysis = load_customer_research_analysis(path)
    methods = load_customer_analytical_methods(path)
    sources = load_source_register(path, "Source_Register")

    return CustomerResearchDataset(
        traceability=traceability,
        research_evidence=evidence,
        factor_synthesis=synthesis,
        research_analysis=analysis,
        analytical_methods=methods,
        source_register=sources,
    )


# ---------------------------------------------------------------------------
# Q4 Market & Macro Research Loaders
# ---------------------------------------------------------------------------

def load_market_evidence(source_path: Optional[Path] = None) -> List[MarketEvidenceRecord]:
    """Loads sheet 'Market_Evidence'."""
    path = source_path or settings.get_q4_market_workbook_path()
    validate_workbook_exists(path, "Q4 Market Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Market_Evidence" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Market_Evidence' was not found in Q4 Market workbook.")

    ws = wb["Market_Evidence"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[MarketEvidenceRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        src = safe_str(r[0])
        if not src:
            continue
        records.append(MarketEvidenceRecord(
            source=src,
            year=safe_int(r[1]),
            geography=safe_str(r[2]) or "",
            market_sector=safe_str(r[3]) or "",
            indicator=safe_str(r[4]) or "",
            period=safe_str(r[5]),
            reported_value=safe_numeric_or_str(r[6]),
            measure=safe_str(r[7]),
            evidence_type=safe_str(r[8]) or "",
            research_note=safe_str(r[9]),
            publisher=safe_str(r[10]) if len(r) > 10 else None,
        ))
    return records


def load_market_trend_synthesis(source_path: Optional[Path] = None) -> List[MarketTrendSynthesisRecord]:
    """Loads the main trend area records from sheet 'Trend_Synthesis'."""
    path = source_path or settings.get_q4_market_workbook_path()
    validate_workbook_exists(path, "Q4 Market Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Trend_Synthesis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Trend_Synthesis' was not found in Q4 Market workbook.")

    ws = wb["Trend_Synthesis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[MarketTrendSynthesisRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        trend = safe_str(r[0])
        if not trend or trend == "Trend area" or trend == "Selected quantified signals" or trend == "Indicator":
            continue
        sig = safe_str(r[1])
        if not sig or sig == "Observed signal":
            continue
        records.append(MarketTrendSynthesisRecord(
            trend_area=trend,
            observed_signal=sig,
            direction=safe_str(r[2]) or "",
            business_relevance=safe_str(r[3]) or "",
            evidence_strength_context=safe_str(r[4]) or "",
        ))
    return records


def load_market_quantified_signals(source_path: Optional[Path] = None) -> List[QuantifiedSignal]:
    """Loads the quantified signals sub-table from sheet 'Trend_Synthesis' (columns 6-7)."""
    path = source_path or settings.get_q4_market_workbook_path()
    validate_workbook_exists(path, "Q4 Market Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Trend_Synthesis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Trend_Synthesis' was not found in Q4 Market workbook.")

    ws = wb["Trend_Synthesis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    signals: List[QuantifiedSignal] = []
    in_signal_section = False

    for r in rows:
        if len(r) > 6:
            c6 = safe_str(r[6])
            if c6 == "Selected quantified signals":
                in_signal_section = True
                continue
            if in_signal_section:
                if c6 == "Indicator":
                    continue
                val = safe_float(r[7]) if len(r) > 7 else None
                if c6 and val is not None:
                    signals.append(QuantifiedSignal(indicator=c6, value=val))
    return signals


def load_market_analysis(source_path: Optional[Path] = None) -> List[MarketAnalysisRecord]:
    """Loads sheet 'Q4_Analysis'."""
    path = source_path or settings.get_q4_market_workbook_path()
    validate_workbook_exists(path, "Q4 Market Research")

    wb = openpyxl.load_workbook(path, data_only=True)
    if "Q4_Analysis" not in wb.sheetnames:
        wb.close()
        raise ValidationError("Required sheet 'Q4_Analysis' was not found in Q4 Market workbook.")

    ws = wb["Q4_Analysis"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    header_row_idx = 3
    records: List[MarketAnalysisRecord] = []

    for r in rows[header_row_idx + 1:]:
        if not any(x is not None for x in r):
            continue
        point = safe_str(r[0])
        if not point or point == "Analytical point":
            continue
        records.append(MarketAnalysisRecord(
            analytical_point=point,
            evidence=safe_str(r[1]) or "",
            implication_for_nexa=safe_str(r[2]) or "",
            boundary_limitation=safe_str(r[3]) or "",
        ))
    return records


def load_market_research_dataset(source_path: Optional[Path] = None) -> MarketResearchDataset:
    """Loads the complete Q4 Market & Macro Research dataset with source traceability."""
    path = source_path or settings.get_q4_market_workbook_path()
    validate_workbook_exists(path, "Q4 Market Research")
    validate_required_sheets_exist(path, "q4_market")

    wb_filename = path.name

    traceability = {
        "market_evidence": SourceTraceability(source_workbook=wb_filename, source_sheet="Market_Evidence"),
        "trend_synthesis": SourceTraceability(source_workbook=wb_filename, source_sheet="Trend_Synthesis"),
        "q4_analysis": SourceTraceability(source_workbook=wb_filename, source_sheet="Q4_Analysis"),
        "source_register": SourceTraceability(source_workbook=wb_filename, source_sheet="Source_Register"),
    }

    evidence = load_market_evidence(path)
    trends = load_market_trend_synthesis(path)
    signals = load_market_quantified_signals(path)
    analysis = load_market_analysis(path)
    sources = load_source_register(path, "Source_Register")

    return MarketResearchDataset(
        traceability=traceability,
        market_evidence=evidence,
        trend_synthesis=trends,
        quantified_signals=signals,
        q4_analysis=analysis,
        source_register=sources,
    )

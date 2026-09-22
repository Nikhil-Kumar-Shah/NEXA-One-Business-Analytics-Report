"""Internal data models for the NEXA One report.

Typed structures representing Advertising, Q3 Customer Research, and Q4
Market & Macro Research domains, retaining full source traceability.
"""

from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Source Traceability
# ---------------------------------------------------------------------------

class SourceTraceability(BaseModel):
    """Retains workbook and sheet origin for auditability and citations."""
    source_workbook: str
    source_sheet: str


# ---------------------------------------------------------------------------
# Advertising Domain Models
# ---------------------------------------------------------------------------

class AdvertisingRawRecord(BaseModel):
    """Untouched raw source observation."""
    market_number: int
    tv_ads: float
    social_media_ads: float
    print_ads: float
    sales: float


class AdvertisingWorkingRecord(BaseModel):
    """Analysis-ready observation including calculated metrics and flags."""
    market_number: int
    tv_ads: float
    social_media_ads: float
    print_ads: float
    sales: float
    total_ads: float
    tv_spend_share: float
    social_media_spend_share: float
    print_spend_share: float
    sales_per_total_ad_spend: float
    tv_zscore: float
    social_media_zscore: float
    print_zscore: float
    sales_zscore: float
    total_ad_spend_zscore: Optional[float] = None
    tv_iqr_flag: str
    social_media_iqr_flag: str
    print_iqr_flag: str
    sales_iqr_flag: str
    total_ad_spend_iqr_flag: Optional[str] = None
    row_review_status: str


class DataQualityRecord(BaseModel):
    """Pre-analysis data quality validation check."""
    check: str
    formula_result: Union[int, float, str]
    what_it_checks: str
    status: str


class DescriptiveStatisticItem(BaseModel):
    """Summary descriptive statistic metric row."""
    metric: str
    tv_ads: Optional[float] = None
    social_media_ads: Optional[float] = None
    print_ads: Optional[float] = None
    sales: Optional[float] = None
    total_ads: Optional[float] = None


class CorrelationMatrix(BaseModel):
    """Pairwise Pearson correlation matrix."""
    variables: List[str]
    matrix: Dict[str, Dict[str, float]]
    reading_note: Optional[str] = None


class RegressionCoefficient(BaseModel):
    """Estimated coefficient and statistical properties for a predictor."""
    term: str
    coefficient: float
    std_error: float
    t_statistic: float
    p_value: float
    ci_95_low: float
    ci_95_high: float
    interpretation: Optional[str] = None


class RegressionModelSummary(BaseModel):
    """Complete multiple linear regression model outputs."""
    model_formula: str
    coefficients: List[RegressionCoefficient]
    observations: int
    predictors_k: int
    residual_df: int
    r_squared: float
    adj_r_squared: float
    f_statistic: float
    model_p_value: float
    std_error_estimate: float
    reading_note: Optional[str] = None


class OutlierReviewRecord(BaseModel):
    """Observation flagged for outlier review without automatic deletion."""
    market_number: int
    tv_ads: float
    social_media_ads: float
    print_ads: float
    sales: float
    tv_flag: str
    social_media_flag: str
    print_flag: str
    sales_flag: Optional[str] = None
    review_status: str
    review_note: Optional[str] = None


class AnalysisSummary(BaseModel):
    """Executive analytical snapshot and analyst notes."""
    data_quality_summary: Dict[str, Any]
    core_statistical_outputs: Dict[str, Any]
    analyst_notes: List[str]


class AdvertisingDataset(BaseModel):
    """Root container for all advertising domain sheets with traceability."""
    traceability: Dict[str, SourceTraceability]
    raw_data: List[AdvertisingRawRecord]
    working_data: List[AdvertisingWorkingRecord]
    data_quality: List[DataQualityRecord]
    descriptive_stats: List[DescriptiveStatisticItem]
    correlation: CorrelationMatrix
    regression_model: RegressionModelSummary
    outlier_review: List[OutlierReviewRecord]
    analysis_summary: AnalysisSummary


# ---------------------------------------------------------------------------
# Q3 Customer Research Domain Models
# ---------------------------------------------------------------------------

class CustomerResearchEvidenceRecord(BaseModel):
    """Source-level quantitative or qualitative research observation."""
    source: str
    year: Optional[int] = None
    geography: str
    sample_basis: Optional[str] = None
    product_category: str
    purchase_factor: str
    reported_value: Optional[Union[float, int, str]] = None
    measure: Optional[str] = None
    evidence_type: str
    research_note: Optional[str] = None
    publisher: Optional[str] = None
    source_link: Optional[str] = None


class CustomerFactorSynthesisRecord(BaseModel):
    """Factor-level synthesis across published quantitative observations."""
    factor: str
    quantitative_observations: int
    mean_reported_pct: Optional[float] = None
    median_reported_pct: Optional[float] = None
    minimum_pct: Optional[float] = None
    maximum_pct: Optional[float] = None
    latest_quantitative_year: Optional[int] = None
    india_specific_evidence: str
    qualitative_support: Optional[str] = None
    interpretation: str


class CustomerResearchAnalysisRecord(BaseModel):
    """Analytical readout of customer purchase drivers and business implications."""
    observed_pattern: str
    evidence_from_research: str
    business_implication: str
    limitation_context: str


class CustomerMethodRule(BaseModel):
    """Methodological rule and interpretation constraint for Q3 research."""
    rule_number: int
    rule_title: str
    rule_description: str


class SourceRegisterRecord(BaseModel):
    """Citation and reference information for external research sources."""
    source: str
    publication_year: Optional[int] = None
    publisher: str
    source_link: Optional[str] = None
    what_it_contributes: str


class CustomerResearchDataset(BaseModel):
    """Root container for Q3 Customer Research sheets with traceability."""
    traceability: Dict[str, SourceTraceability]
    research_evidence: List[CustomerResearchEvidenceRecord]
    factor_synthesis: List[CustomerFactorSynthesisRecord]
    research_analysis: List[CustomerResearchAnalysisRecord]
    analytical_methods: List[CustomerMethodRule] = []
    source_register: List[SourceRegisterRecord]


# ---------------------------------------------------------------------------
# Q4 Market & Macro Research Domain Models
# ---------------------------------------------------------------------------

class MarketEvidenceRecord(BaseModel):
    """External market and macroeconomic indicator observation."""
    source: str
    year: Optional[int] = None
    geography: str
    market_sector: str
    indicator: str
    period: Optional[str] = None
    reported_value: Optional[Union[float, int, str]] = None
    measure: Optional[str] = None
    evidence_type: str
    research_note: Optional[str] = None
    publisher: Optional[str] = None


class MarketTrendSynthesisRecord(BaseModel):
    """Summary of major external trends and business relevance."""
    trend_area: str
    observed_signal: str
    direction: str
    business_relevance: str
    evidence_strength_context: str


class QuantifiedSignal(BaseModel):
    """Selected quantified indicator from trend synthesis."""
    indicator: str
    value: float


class MarketAnalysisRecord(BaseModel):
    """Evidence-led readout of market conditions and strategic implications."""
    analytical_point: str
    evidence: str
    implication_for_nexa: str
    boundary_limitation: str


class MarketResearchDataset(BaseModel):
    """Root container for Q4 Market & Macro Research sheets with traceability."""
    traceability: Dict[str, SourceTraceability]
    market_evidence: List[MarketEvidenceRecord]
    trend_synthesis: List[MarketTrendSynthesisRecord]
    quantified_signals: List[QuantifiedSignal] = []
    q4_analysis: List[MarketAnalysisRecord]
    source_register: List[SourceRegisterRecord]


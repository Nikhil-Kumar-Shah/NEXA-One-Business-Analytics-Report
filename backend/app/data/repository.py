"""Data Access Repository layer for NEXA One Report.

Provides structured data access functions for future FastAPI routes and services,
backed by an in-process cache with explicit clear/reload capabilities.
"""

from typing import Any, Dict, List, Optional
from pathlib import Path

from backend.app.data.loader import (
    load_advertising_analysis_summary,
    load_advertising_correlation,
    load_advertising_data_quality,
    load_advertising_dataset as _load_advertising_dataset,
    load_advertising_descriptive_stats,
    load_advertising_outlier_review,
    load_advertising_raw_data as _load_advertising_raw_data,
    load_advertising_regression,
    load_advertising_working_data as _load_advertising_working_data,
    load_customer_factor_synthesis as _load_customer_factor_synthesis,
    load_customer_research_analysis as _load_customer_research_analysis,
    load_customer_research_dataset as _load_customer_research_dataset,
    load_customer_research_evidence,
    load_market_analysis as _load_market_analysis,
    load_market_evidence as _load_market_evidence,
    load_market_quantified_signals,
    load_market_research_dataset as _load_market_research_dataset,
    load_market_trend_synthesis as _load_market_trend_synthesis,
    load_source_register,
)
from backend.app.data.models import (
    AdvertisingDataset,
    AdvertisingRawRecord,
    AdvertisingWorkingRecord,
    AnalysisSummary,
    CorrelationMatrix,
    CustomerFactorSynthesisRecord,
    CustomerResearchAnalysisRecord,
    CustomerResearchDataset,
    DataQualityRecord,
    DescriptiveStatisticItem,
    MarketAnalysisRecord,
    MarketEvidenceRecord,
    MarketResearchDataset,
    MarketTrendSynthesisRecord,
    OutlierReviewRecord,
    RegressionModelSummary,
    SourceRegisterRecord,
)
from backend.app.config import settings


class DataRepository:
    """In-memory repository caching and serving structured NEXA datasets."""

    def __init__(self):
        self._cache: Dict[str, Any] = {}

    def clear_cache(self) -> None:
        """Clears all cached datasets."""
        self._cache.clear()

    def reload_all(self) -> Dict[str, bool]:
        """Reloads all datasets fresh from the source workbooks."""
        self.clear_cache()
        self.load_advertising_dataset()
        self.load_customer_research()
        self.load_market_evidence()
        return {"reloaded": True}

    # -----------------------------------------------------------------------
    # Advertising Access Methods
    # -----------------------------------------------------------------------

    def load_advertising_dataset(self) -> AdvertisingDataset:
        """Loads complete advertising dataset with all 8 sheets and traceability."""
        if "advertising_dataset" not in self._cache:
            self._cache["advertising_dataset"] = _load_advertising_dataset()
        return self._cache["advertising_dataset"]

    def load_advertising_raw_data(self) -> List[AdvertisingRawRecord]:
        """Loads untouched source observations (200 rows)."""
        ds = self.load_advertising_dataset()
        return ds.raw_data

    def load_working_data(self) -> List[AdvertisingWorkingRecord]:
        """Loads analytical working dataset with calculated fields (200 rows)."""
        ds = self.load_advertising_dataset()
        return ds.working_data

    def load_data_quality(self) -> List[DataQualityRecord]:
        """Loads data quality validation audit records."""
        ds = self.load_advertising_dataset()
        return ds.data_quality

    def load_descriptive_stats(self) -> List[DescriptiveStatisticItem]:
        """Loads summary statistics for all main metrics."""
        ds = self.load_advertising_dataset()
        return ds.descriptive_stats

    def load_correlations(self) -> CorrelationMatrix:
        """Loads Pearson correlation matrix."""
        ds = self.load_advertising_dataset()
        return ds.correlation

    def load_regression_results(self) -> RegressionModelSummary:
        """Loads multiple linear regression model outputs."""
        ds = self.load_advertising_dataset()
        return ds.regression_model

    def load_outlier_review(self) -> List[OutlierReviewRecord]:
        """Loads observations flagged for review without automatic deletion."""
        ds = self.load_advertising_dataset()
        return ds.outlier_review

    def load_analysis_summary(self) -> AnalysisSummary:
        """Loads executive snapshot and analyst notes."""
        ds = self.load_advertising_dataset()
        return ds.analysis_summary

    # -----------------------------------------------------------------------
    # Q3 Customer Research Access Methods
    # -----------------------------------------------------------------------

    def load_customer_research(self) -> CustomerResearchDataset:
        """Loads complete Q3 Customer Research dataset."""
        if "customer_research_dataset" not in self._cache:
            self._cache["customer_research_dataset"] = _load_customer_research_dataset()
        return self._cache["customer_research_dataset"]

    def load_customer_factor_synthesis(self) -> List[CustomerFactorSynthesisRecord]:
        """Loads factor-level synthesis across published quantitative findings."""
        ds = self.load_customer_research()
        return ds.factor_synthesis

    def load_customer_research_analysis(self) -> List[CustomerResearchAnalysisRecord]:
        """Loads analytical readout on customer purchase drivers."""
        ds = self.load_customer_research()
        return ds.research_analysis

    def load_customer_sources(self) -> List[SourceRegisterRecord]:
        """Loads Q3 reference sources and citations."""
        ds = self.load_customer_research()
        return ds.source_register

    # -----------------------------------------------------------------------
    # Q4 Market & Macro Research Access Methods
    # -----------------------------------------------------------------------

    def load_market_research(self) -> MarketResearchDataset:
        """Loads complete Q4 Market & Macro Research dataset."""
        if "market_research_dataset" not in self._cache:
            self._cache["market_research_dataset"] = _load_market_research_dataset()
        return self._cache["market_research_dataset"]

    def load_market_evidence(self) -> List[MarketEvidenceRecord]:
        """Loads external market and macroeconomic indicator observations."""
        ds = self.load_market_research()
        return ds.market_evidence

    def load_market_trends(self) -> List[MarketTrendSynthesisRecord]:
        """Loads business-facing summary of external trends."""
        ds = self.load_market_research()
        return ds.trend_synthesis

    def load_market_analysis(self) -> List[MarketAnalysisRecord]:
        """Loads business-facing market and macro analysis readout."""
        ds = self.load_market_research()
        return ds.q4_analysis

    def load_market_sources(self) -> List[SourceRegisterRecord]:
        """Loads Q4 reference sources and citations."""
        ds = self.load_market_research()
        return ds.source_register


# Global repository instance
repository = DataRepository()


# ---------------------------------------------------------------------------
# Standalone Module Functions matching Section 15 specification
# ---------------------------------------------------------------------------

def load_advertising_dataset() -> AdvertisingDataset:
    return repository.load_advertising_dataset()


def load_advertising_raw_data() -> List[AdvertisingRawRecord]:
    return repository.load_advertising_raw_data()


def load_working_data() -> List[AdvertisingWorkingRecord]:
    return repository.load_working_data()


def load_data_quality() -> List[DataQualityRecord]:
    return repository.load_data_quality()


def load_descriptive_stats() -> List[DescriptiveStatisticItem]:
    return repository.load_descriptive_stats()


def load_correlations() -> CorrelationMatrix:
    return repository.load_correlations()


def load_regression_results() -> RegressionModelSummary:
    return repository.load_regression_results()


def load_outlier_review() -> List[OutlierReviewRecord]:
    return repository.load_outlier_review()


def load_analysis_summary() -> AnalysisSummary:
    return repository.load_analysis_summary()


def load_customer_research() -> CustomerResearchDataset:
    return repository.load_customer_research()


def load_customer_factor_synthesis() -> List[CustomerFactorSynthesisRecord]:
    return repository.load_customer_factor_synthesis()


def load_customer_research_analysis() -> List[CustomerResearchAnalysisRecord]:
    return repository.load_customer_research_analysis()


def load_customer_sources() -> List[SourceRegisterRecord]:
    return repository.load_customer_sources()


def load_market_evidence() -> List[MarketEvidenceRecord]:
    return repository.load_market_evidence()


def load_market_trends() -> List[MarketTrendSynthesisRecord]:
    return repository.load_market_trends()


def load_market_analysis() -> List[MarketAnalysisRecord]:
    return repository.load_market_analysis()


def load_market_sources() -> List[SourceRegisterRecord]:
    return repository.load_market_sources()


def clear_cache() -> None:
    repository.clear_cache()

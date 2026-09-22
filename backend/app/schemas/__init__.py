"""Schemas package exports."""

from backend.app.schemas.common import ErrorDetail, ErrorResponse, HealthResponse, SourceMeta
from backend.app.schemas.overview import (
    CorrelationsOverview,
    DataQualityOverview,
    DatasetOverview,
    ModelOverview,
    OverviewResponse,
)
from backend.app.schemas.data_quality import (
    DataQualityCheckItem,
    DataQualityMetrics,
    DataQualityResponse,
)
from backend.app.schemas.advertising import (
    AdvertisingObservationItem,
    AdvertisingResponse,
    DescriptiveStatsItem,
    OutlierObservationItem,
)
from backend.app.schemas.correlation import CorrelationPair, CorrelationResponse
from backend.app.schemas.regression import (
    RegressionCoefficientDetail,
    RegressionModelDetail,
    RegressionResponse,
)
from backend.app.schemas.channels import ChannelEvidenceDetail, ChannelResponse
from backend.app.schemas.customer_drivers import (
    CustomerAnalysisPatternItem,
    CustomerDriverResponse,
    CustomerEvidenceItem,
    CustomerFactorSynthesisItem,
    CustomerMethodRuleItem,
    CustomerSourceItem,
)
from backend.app.schemas.market_trends import (
    MarketAnalysisItem,
    MarketEvidenceItem,
    MarketSourceItem,
    MarketTrendItem,
    MarketTrendResponse,
    QuantifiedSignalItem,
)
from backend.app.schemas.strategy import (
    StrategyAdvertisingEvidence,
    StrategyChannelItem,
    StrategyCustomerFactorItem,
    StrategyMarketSignalItem,
    StrategyResponse,
)
from backend.app.schemas.sources import SourceRegistryResponse, UnifiedSourceItem

__all__ = [
    "SourceMeta",
    "ErrorDetail",
    "ErrorResponse",
    "HealthResponse",
    "OverviewResponse",
    "DatasetOverview",
    "ModelOverview",
    "CorrelationsOverview",
    "DataQualityOverview",
    "DataQualityResponse",
    "DataQualityMetrics",
    "DataQualityCheckItem",
    "AdvertisingResponse",
    "AdvertisingObservationItem",
    "DescriptiveStatsItem",
    "OutlierObservationItem",
    "CorrelationResponse",
    "CorrelationPair",
    "RegressionResponse",
    "RegressionModelDetail",
    "RegressionCoefficientDetail",
    "ChannelResponse",
    "ChannelEvidenceDetail",
    "CustomerDriverResponse",
    "CustomerEvidenceItem",
    "CustomerFactorSynthesisItem",
    "CustomerAnalysisPatternItem",
    "CustomerMethodRuleItem",
    "CustomerSourceItem",
    "MarketTrendResponse",
    "MarketEvidenceItem",
    "MarketTrendItem",
    "QuantifiedSignalItem",
    "MarketAnalysisItem",
    "MarketSourceItem",
    "StrategyResponse",
    "StrategyAdvertisingEvidence",
    "StrategyChannelItem",
    "StrategyCustomerFactorItem",
    "StrategyMarketSignalItem",
    "SourceRegistryResponse",
    "UnifiedSourceItem",
]

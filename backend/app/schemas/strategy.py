"""Schemas for Strategy Evidence inputs endpoint."""

from typing import Dict, List, Optional
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class StrategyAdvertisingEvidence(BaseModel):
    sample_size: int
    r_squared: float
    adjusted_r_squared: float
    f_statistic: float
    model_p_value: float
    residual_standard_error: float


class StrategyChannelItem(BaseModel):
    channel: str
    variable: str
    sales_correlation: float
    coefficient: float
    p_value: float
    ci_lower: float
    ci_upper: float
    mean_spend: float
    mean_spend_share: float


class StrategyCustomerFactorItem(BaseModel):
    factor: str
    observations_count: int
    mean_pct: Optional[float] = None
    median_pct: Optional[float] = None
    india_specific: str
    interpretation: str


class StrategyMarketSignalItem(BaseModel):
    trend_area: str
    observed_signal: str
    direction: str
    business_relevance: str


class RecommendationItem(BaseModel):
    id: str
    title: str
    action: str
    why: str
    evidence: List[str]
    business_role: str
    business_role_desc: str
    risk: str
    implementation: str
    measurement: str
    priority: str
    validation: str
    source_layer: str


class ActionPlanPhase(BaseModel):
    phase: str
    title: str
    timing: str
    actions: List[str]


class ActionPlanTableItem(BaseModel):
    action: str
    timing: str
    evidence_trigger: str
    owner: str
    output: str
    decision_gate: str


class MeasurementLevelItem(BaseModel):
    level: str
    title: str
    description: str
    metrics: List[str]


class StrategyResponse(BaseModel):
    advertising_evidence: StrategyAdvertisingEvidence
    channel_evidence: List[StrategyChannelItem]
    customer_purchase_factors: List[StrategyCustomerFactorItem]
    market_macro_signals: List[StrategyMarketSignalItem]
    analyst_notes: List[str]
    sources: List[SourceMeta]
    recommendations: Optional[List[RecommendationItem]] = None
    action_plan_phases: Optional[List[ActionPlanPhase]] = None
    action_plan_table: Optional[List[ActionPlanTableItem]] = None
    measurement_hierarchy: Optional[List[MeasurementLevelItem]] = None
    management_checklist: Optional[List[str]] = None
    avoid_decisions: Optional[List[str]] = None


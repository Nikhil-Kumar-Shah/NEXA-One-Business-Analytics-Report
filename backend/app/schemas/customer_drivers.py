"""Schemas for Q3 Customer Drivers research endpoint."""

from typing import List, Optional, Union
from pydantic import BaseModel

from backend.app.schemas.common import SourceMeta


class CustomerEvidenceItem(BaseModel):
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


class CustomerFactorSynthesisItem(BaseModel):
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


class CustomerAnalysisPatternItem(BaseModel):
    observed_pattern: str
    evidence_from_research: str
    business_implication: str
    limitation_context: str


class CustomerMethodRuleItem(BaseModel):
    rule_number: int
    rule_title: str
    rule_description: str


class CustomerSourceItem(BaseModel):
    source: str
    publication_year: Optional[int] = None
    publisher: str
    source_link: Optional[str] = None
    what_it_contributes: str


class CustomerDriverResponse(BaseModel):
    total_evidence_records: int
    filtered_evidence_records: Optional[int] = None
    research_evidence: List[CustomerEvidenceItem]
    factor_synthesis: List[CustomerFactorSynthesisItem]
    research_analysis: List[CustomerAnalysisPatternItem]
    analytical_methods: List[CustomerMethodRuleItem]
    source_register: List[CustomerSourceItem]
    sources: List[SourceMeta]


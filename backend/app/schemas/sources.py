"""Schemas for Unified Source Registry endpoint."""

from typing import List, Optional
from pydantic import BaseModel


class UnifiedSourceItem(BaseModel):
    source_id: str
    source_name: str
    publisher: str
    publication_year: Optional[int] = None
    url_or_reference: Optional[str] = None
    geography: Optional[str] = None
    topic: str
    source_type: str
    dataset_domain: str
    source_workbook: str
    source_sheet: str
    what_it_contributes: Optional[str] = None


class SourceRegistryResponse(BaseModel):
    total_sources: int
    sources: List[UnifiedSourceItem]

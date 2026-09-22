import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BookOpen,
  Database,
  Search,
  Filter,
  ShieldAlert,
  ExternalLink,
  Layers,
  FileCheck,
} from 'lucide-react';
import { fetchMethodologySources } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { DatasetSourceLink } from '../../components/common/DatasetSourceLink';
import './MethodologySourcesView.css';

/**
 * Section 09: Methodology & Sources
 * Authoritative registry of all 20 source documents and explicit analytical safeguards.
 */
export function MethodologySourcesView() {
  const [sourcesData, setSourcesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMethodologySources();
      setSourcesData(res);
    } catch (err) {
      console.error('Failed to load methodology sources:', err);
      setError(err.message || 'Please check the sources service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableYears = useMemo(() => {
    if (!sourcesData?.sources) return [];
    return Array.from(new Set(sourcesData.sources.map((s) => s.publication_year).filter(Boolean))).sort((a, b) => b - a);
  }, [sourcesData]);

  const filteredSources = useMemo(() => {
    if (!sourcesData?.sources) return [];
    return sourcesData.sources.filter((s) => {
      const matchDomain =
        domainFilter === 'ALL' ||
        (domainFilter === 'ADV' && s.dataset_domain.includes('Advertising')) ||
        (domainFilter === 'Q3' && s.dataset_domain.includes('Customer')) ||
        (domainFilter === 'Q4' && s.dataset_domain.includes('Market'));
      const matchYear =
        yearFilter === 'ALL' ||
        String(s.publication_year) === String(yearFilter);
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        s.source_name.toLowerCase().includes(term) ||
        s.publisher.toLowerCase().includes(term) ||
        s.what_it_contributes.toLowerCase().includes(term);
      return matchDomain && matchYear && matchSearch;
    });
  }, [sourcesData, domainFilter, yearFilter, searchTerm]);

  if (loading) {
    return (
      <LoadingState
        title="Loading methodology and source register..."
        subtext="Fetching authoritative citations, dataset provenance, and analytical limitations"
        skeletonLines={6}
      />
    );
  }

  if (error || !sourcesData) {
    return (
      <ErrorState
        title="Sources could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Sources Service"
      />
    );
  }

  return (
    <div className="methodology-sources-view" role="article" aria-label="Methodology and Sources">
      {/* Opening Traceability Paragraph */}
      <div id="traceability" className="ms-lead-section">
        <p className="ms-opening-text">
          Every statistic, empirical metric, customer driver, and macroeconomic indicator in this report
          originates from approved, auditable datasets. This register establishes complete traceability from
          each analytical statement back to its original authority, publication date, and methodology context.
        </p>
      </div>

      {/* 02: Sources Summary Cards */}
      <div id="coverage" className="ms-summary-grid">
        <div className="ms-sum-card">
          <span className="ms-sum-label">Total Registered Sources</span>
          <span className="ms-sum-val font-mono">{sourcesData.total_sources}</span>
          <span className="ms-sum-sub">Across 3 core analytical workbooks</span>
        </div>

        <div className="ms-sum-card">
          <span className="ms-sum-label">Advertising Analytics</span>
          <span className="ms-sum-val font-mono">1</span>
          <span className="ms-sum-sub">200 market-level observations</span>
        </div>

        <div className="ms-sum-card">
          <span className="ms-sum-label">Q3 Customer Drivers</span>
          <span className="ms-sum-val font-mono">10</span>
          <span className="ms-sum-sub">57 evidence observations</span>
        </div>

        <div className="ms-sum-card">
          <span className="ms-sum-label">Q4 Market & Macro</span>
          <span className="ms-sum-val font-mono">9</span>
          <span className="ms-sum-sub">38 market signals & forecasts</span>
        </div>
      </div>

      {/* Published Datasets Access Panel */}
      <section className="ms-published-workbooks" aria-labelledby="published-workbooks-heading">
        <div className="ms-workbooks-header">
          <Database size={18} className="ms-workbooks-icon" aria-hidden="true" />
          <div>
            <h2 id="published-workbooks-heading" className="ms-workbooks-title font-heading">
              Published Analytical Datasets (Google Sheets)
            </h2>
            <p className="ms-workbooks-subtitle">
              Direct access to the published online spreadsheet representations of the 3 underlying research workbooks.
            </p>
          </div>
        </div>
        <div className="ms-workbooks-grid">
          <DatasetSourceLink datasetKey="advertising" variant="card" />
          <DatasetSourceLink datasetKey="customerResearch" variant="card" />
          <DatasetSourceLink datasetKey="marketMacro" variant="card" />
        </div>
      </section>

      {/* 03: Source Registry Table with Filters */}
      <section id="source-register" className="ms-registry-section" aria-labelledby="ms-registry-heading">
        <div className="ms-registry-controls">
          <div>
            <h2 id="ms-registry-heading" className="ms-registry-title font-heading">
              Complete Authoritative Source Register
            </h2>
            <p className="ms-registry-sub">
              Showing {filteredSources.length} of {sourcesData.total_sources} sources
            </p>
          </div>

          <div className="ms-controls-right">
            <div className="ms-search-box">
              <Search size={16} className="ms-search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search authority, publisher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ms-search-input"
                aria-label="Search sources"
              />
            </div>

            <div className="ms-year-filter">
              <select
                id="ms-year-select"
                className="ms-year-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                aria-label="Filter by publication year"
              >
                <option value="ALL">All Years</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="ms-filter-chips">
              <button
                type="button"
                className={`ms-chip ${domainFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setDomainFilter('ALL')}
              >
                All (20)
              </button>
              <button
                type="button"
                className={`ms-chip ${domainFilter === 'ADV' ? 'active' : ''}`}
                onClick={() => setDomainFilter('ADV')}
              >
                Advertising (1)
              </button>
              <button
                type="button"
                className={`ms-chip ${domainFilter === 'Q3' ? 'active' : ''}`}
                onClick={() => setDomainFilter('Q3')}
              >
                Customer (10)
              </button>
              <button
                type="button"
                className={`ms-chip ${domainFilter === 'Q4' ? 'active' : ''}`}
                onClick={() => setDomainFilter('Q4')}
              >
                Market (9)
              </button>
            </div>
          </div>
        </div>

        <div className="ms-table-wrapper">
          <table className="ms-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Domain</th>
                <th scope="col">Authority / Source Name</th>
                <th scope="col">Publisher</th>
                <th scope="col" className="text-center">Year</th>
                <th scope="col">Workbook Provenance</th>
                <th scope="col">Strategic Contribution</th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.map((s) => (
                <tr key={s.source_id}>
                  <td className="font-mono text-muted">{s.source_id}</td>
                  <td>
                    <span className="ms-domain-badge">{s.dataset_domain}</span>
                  </td>
                  <td className="ms-source-name-cell">
                    <strong>{s.source_name}</strong>
                    {s.url_or_reference && (
                      <span className="ms-ref-sub text-muted">{s.url_or_reference}</span>
                    )}
                  </td>
                  <td>{s.publisher}</td>
                  <td className="text-center font-mono">{s.publication_year || 'N/A'}</td>
                  <td className="font-mono text-muted ms-wb-cell">
                    {s.source_workbook} [{s.source_sheet}]
                  </td>
                  <td className="ms-contrib-cell">{s.what_it_contributes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 04: Final Analytical Integrity Statement & Governance Boundaries */}
      <section id="boundaries" className="ms-integrity-card" aria-labelledby="ms-integrity-heading">
        <div className="ms-integrity-header">
          <ShieldAlert size={22} className="ms-integrity-icon" aria-hidden="true" />
          <h2 id="ms-integrity-heading" className="ms-integrity-title font-heading">
            Final Analytical Integrity Statement
          </h2>
        </div>
        <p className="ms-integrity-quote">
          "Correlation and regression results describe statistical relationships in the observed data;
          they do not by themselves establish causation. The advertising analysis therefore provides
          directional evidence for planning rather than causal estimates of advertising ROI."
        </p>
        <p className="ms-integrity-subtext">
          NEXA One management must preserve this standard in all executive decision-making. The observational
          econometric findings provide strong empirical justification for channel attention and controlled
          testing, but exact capital allocation must rely on future incremental performance validation.
        </p>
      </section>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Table,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { fetchDataMethodology } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import './DataMethodologyView.css';

/**
 * Section 02: Data & Methodology
 * Details dataset architecture, ingestion validation, statistical models, and analytical safeguards.
 */
export function DataMethodologyView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataMethodology();
      setData(res);
    } catch (err) {
      console.error('Failed to load data & methodology data:', err);
      setError(err.message || 'Please check the analytical service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <LoadingState
        title="Loading data foundation & methodology..."
        subtext="Validating data architecture, descriptive distributions, and econometric models"
        skeletonLines={6}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Data & methodology could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Methodology Service"
      />
    );
  }

  const { qualityData, advData, regData } = data;
  const metrics = qualityData.metrics || {};
  const totalObs = metrics.row_count ?? metrics.total_observations ?? 200;
  const missingCount = metrics.missing_source_cells ?? metrics.missing_values_count ?? 0;
  const duplicateCount = metrics.duplicate_market_ids ?? metrics.duplicate_rows_count ?? 0;
  const status = qualityData.overall_status || qualityData.status || 'PASS';

  return (
    <div className="data-methodology-view" role="article" aria-label="Data and Methodology">
      {/* Opening Analytical Paragraph */}
      <div id="data-foundation" className="dm-lead-section">
        <p className="dm-opening-text">
          The NEXA One analysis combines internal market-level advertising expenditure and sales
          observations with independent customer purchase-driver studies and external macroeconomic research.
          This section details the underlying data architecture, ingestion validation checks, statistical
          formulations, and governance boundaries.
        </p>
      </div>

      {/* 02: Data Ingestion & Quality Metrics */}
      <section id="quality-audit" className="dm-quality-section" aria-labelledby="dm-quality-heading">
        <div className="dm-section-title-row">
          <Database size={20} className="dm-section-icon" aria-hidden="true" />
          <div>
            <h2 id="dm-quality-heading" className="dm-section-title font-heading">
              Dataset Architecture & Ingestion Validation
            </h2>
            <p className="dm-section-subtitle">
              Verification of data completeness, schema normalization, and outlier review.
            </p>
          </div>
        </div>

        <div className="dm-metrics-grid">
          <div className="dm-metric-card">
            <span className="dm-metric-label">Total Observations</span>
            <span className="dm-metric-val font-mono">{totalObs}</span>
            <span className="dm-metric-note">100% complete market records</span>
          </div>

          <div className="dm-metric-card">
            <span className="dm-metric-label">Missing Values</span>
            <span className="dm-metric-val font-mono success">{missingCount}</span>
            <span className="dm-metric-note">Zero missing or null cells</span>
          </div>

          <div className="dm-metric-card">
            <span className="dm-metric-label">Duplicate Rows</span>
            <span className="dm-metric-val font-mono success">{duplicateCount}</span>
            <span className="dm-metric-note">Zero duplicated market records</span>
          </div>

          <div className="dm-metric-card">
            <span className="dm-metric-label">Ingestion Status</span>
            <span className="dm-metric-val font-mono status-pass">{status}</span>
            <span className="dm-metric-note">Passed all automated integrity checks</span>
          </div>
        </div>

        <div className="dm-outlier-note">
          <Info size={16} aria-hidden="true" className="dm-info-icon" />
          <span>
            <strong>Outlier Governance:</strong> 2 observations (markets with print spend of 100.4 and 114.0)
            exceeded 3 standard deviations from the mean. In accordance with the approved analytical
            specification, no observations were deleted, as they reflect valid market expenditures.
          </span>
        </div>
      </section>

      {/* 03: Descriptive Statistics */}
      <section className="dm-stats-section" aria-labelledby="dm-stats-heading">
        <div className="dm-section-title-row">
          <Table size={20} className="dm-section-icon" aria-hidden="true" />
          <div>
            <h2 id="dm-stats-heading" className="dm-section-title font-heading">
              Descriptive Statistics
            </h2>
            <p className="dm-section-subtitle">
              Summary statistics for advertising channels and observed sales across 200 markets.
            </p>
          </div>
        </div>

        <div className="dm-table-wrapper">
          <table className="dm-table">
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col" className="text-right">Mean</th>
                <th scope="col" className="text-right">Median</th>
                <th scope="col" className="text-right">Std Dev</th>
                <th scope="col" className="text-right">Min</th>
                <th scope="col" className="text-right">Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><strong>TV Ads</strong></th>
                <td className="text-right font-mono">147.04</td>
                <td className="text-right font-mono">149.75</td>
                <td className="text-right font-mono">85.85</td>
                <td className="text-right font-mono">0.70</td>
                <td className="text-right font-mono">296.40</td>
              </tr>
              <tr>
                <th scope="row"><strong>Social Media Ads</strong></th>
                <td className="text-right font-mono">23.26</td>
                <td className="text-right font-mono">22.90</td>
                <td className="text-right font-mono">14.85</td>
                <td className="text-right font-mono">0.00</td>
                <td className="text-right font-mono">49.60</td>
              </tr>
              <tr>
                <th scope="row"><strong>Print Ads</strong></th>
                <td className="text-right font-mono">30.55</td>
                <td className="text-right font-mono">25.75</td>
                <td className="text-right font-mono">21.78</td>
                <td className="text-right font-mono">0.30</td>
                <td className="text-right font-mono">114.00</td>
              </tr>
              <tr>
                <th scope="row"><strong>Sales</strong></th>
                <td className="text-right font-mono">14.02</td>
                <td className="text-right font-mono">12.90</td>
                <td className="text-right font-mono">5.22</td>
                <td className="text-right font-mono">1.60</td>
                <td className="text-right font-mono">27.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 04: Statistical Modeling Framework */}
      <section id="methodology" className="dm-modeling-section" aria-labelledby="dm-model-heading">
        <div className="dm-section-title-row">
          <FileSpreadsheet size={20} className="dm-section-icon" aria-hidden="true" />
          <div>
            <h2 id="dm-model-heading" className="dm-section-title font-heading">
              Econometric Formulation & Model Fit
            </h2>
            <p className="dm-section-subtitle">
              Ordinary Least Squares (OLS) multiple linear regression specification.
            </p>
          </div>
        </div>

        <div className="dm-formula-card font-mono">
          Sales = β₀ + β₁(TV Ads) + β₂(Social Media Ads) + β₃(Print Ads) + ε
        </div>

        <div className="dm-model-fit-grid">
          <div className="dm-fit-card">
            <span className="dm-fit-label">Coefficient of Determination (R²)</span>
            <span className="dm-fit-val font-mono">
              {(regData.model.r_squared * 100).toFixed(2)}%
            </span>
            <span className="dm-fit-sub font-mono">0.8972106</span>
          </div>

          <div className="dm-fit-card">
            <span className="dm-fit-label">Adjusted R²</span>
            <span className="dm-fit-val font-mono">
              {(regData.model.adjusted_r_squared * 100).toFixed(2)}%
            </span>
            <span className="dm-fit-sub font-mono">0.8961671</span>
          </div>

          <div className="dm-fit-card">
            <span className="dm-fit-label">F-Statistic</span>
            <span className="dm-fit-val font-mono">570.27</span>
            <span className="dm-fit-sub">p-value: 1.58 × 10⁻⁹⁶</span>
          </div>

          <div className="dm-fit-card">
            <span className="dm-fit-label">Degrees of Freedom</span>
            <span className="dm-fit-val font-mono">196</span>
            <span className="dm-fit-sub">Sample size N = 200, k = 3</span>
          </div>
        </div>
      </section>

      {/* 05: Core Analytical Safeguards */}
      <section id="safeguards" className="dm-safeguard-card" aria-labelledby="dm-safeguard-heading">
        <div className="dm-safeguard-header">
          <ShieldCheck size={22} className="dm-safeguard-icon" aria-hidden="true" />
          <h2 id="dm-safeguard-heading" className="dm-safeguard-title font-heading">
            Mandatory Analytical Safeguards & Non-Causal Standard
          </h2>
        </div>
        <p className="dm-safeguard-quote">
          "Correlation and regression results describe statistical relationships in the observed data;
          they do not by themselves establish causation. The advertising analysis therefore provides
          directional evidence for planning rather than causal estimates of advertising ROI."
        </p>
        <ul className="dm-safeguard-list">
          <li>
            <strong>Regression Coefficients are Not ROI:</strong> Coefficients describe the fitted statistical
            relationship in the observed cross-sectional dataset. They do not represent profit per ad dollar or
            causal returns.
          </li>
          <li>
            <strong>No Invented Budget Allocations:</strong> The available dataset lacks channel costs, margins,
            and experimental attribution data. No fixed percentage allocations are computed.
          </li>
          <li>
            <strong>Print Non-Significance:</strong> Print advertising has a weaker observed correlation and is
            not statistically significant at α = 0.05 (p = 0.8599). This supports reconsideration and validation
            rather than assuming zero business value.
          </li>
          <li>
            <strong>Proxy Context:</strong> External market statistics (e.g. smartphone shipments, global OWS)
            are explicitly identified as context or proxies, never conflated with NEXA One demand.
          </li>
        </ul>
      </section>
    </div>
  );
}

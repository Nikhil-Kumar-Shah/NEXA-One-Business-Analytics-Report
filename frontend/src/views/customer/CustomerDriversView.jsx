import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Layers,
  Database,
  Globe,
  AlertTriangle,
  Info,
  ExternalLink,
  Filter,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { fetchCustomerDrivers } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { StatusBadge } from '../../components/badges/StatusBadge';
import { ResearchEvidenceCard } from './ResearchEvidenceCard';
import { CoverageMap } from './CoverageMap';
import { DatasetSourceLink } from '../../components/common/DatasetSourceLink';
import './CustomerDriversView.css';

/**
 * Section 05: Customer Purchase Drivers (Question 3)
 * Synthesizes 57 independent evidence observations across 10 approved research sources.
 * Preserves source context and forbids cross-study averaging or synthetic preference scores.
 */
export function CustomerDriversView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [factorFilter, setFactorFilter] = useState(searchParams.get('factor') || 'ALL');
  const [geoFilter, setGeoFilter] = useState(searchParams.get('geography') || 'ALL');
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'ALL');
  const [sourceFilter, setSourceFilter] = useState(searchParams.get('source') || 'ALL');
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCustomerDrivers();
      setData(res);
    } catch (err) {
      console.error('Failed to load customer research:', err);
      setError(err.message || 'Please check the research data service and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const research_evidence = data?.research_evidence || [];
  const total_evidence_records = data?.total_evidence_records || 57;
  const factor_synthesis = data?.factor_synthesis || [];
  const research_analysis = data?.research_analysis || [];
  const analytical_methods = data?.analytical_methods || {};
  const source_register = data?.source_register || [];

  // Derived filter options
  const availableFactors = useMemo(() => {
    if (!research_evidence || research_evidence.length === 0) return [];
    return Array.from(new Set(research_evidence.map((x) => x.purchase_factor))).sort();
  }, [research_evidence]);

  const availableGeos = useMemo(() => {
    if (!research_evidence || research_evidence.length === 0) return [];
    return Array.from(new Set(research_evidence.map((x) => x.geography).filter(Boolean))).sort();
  }, [research_evidence]);

  const availableYears = useMemo(() => {
    if (!research_evidence || research_evidence.length === 0) return [];
    return Array.from(new Set(research_evidence.map((x) => x.year).filter(Boolean))).sort((a, b) => b - a);
  }, [research_evidence]);

  const availableSources = useMemo(() => {
    if (!research_evidence || research_evidence.length === 0) return [];
    return Array.from(new Set(research_evidence.map((x) => x.source).filter(Boolean))).sort();
  }, [research_evidence]);

  // Synchronize URL search params
  const updateFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'ALL') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true }
    );
  };

  const handleFactorChange = (val) => {
    setFactorFilter(val);
    updateFilter('factor', val);
  };

  const handleGeoChange = (val) => {
    setGeoFilter(val);
    updateFilter('geography', val);
  };

  const handleYearChange = (val) => {
    setYearFilter(val);
    updateFilter('year', val);
  };

  const handleSourceChange = (val) => {
    setSourceFilter(val);
    updateFilter('source', val);
  };

  const handleResetFilters = () => {
    setFactorFilter('ALL');
    setGeoFilter('ALL');
    setYearFilter('ALL');
    setSourceFilter('ALL');
    setSelectedEvidenceItem(null);
    setSearchParams({}, { replace: true });
  };

  // Filtered evidence items
  const filteredEvidence = useMemo(() => {
    if (!research_evidence || research_evidence.length === 0) return [];
    return research_evidence.filter((item) => {
      const matchFactor = factorFilter === 'ALL' || item.purchase_factor.toLowerCase() === factorFilter.toLowerCase();
      const matchGeo = geoFilter === 'ALL' || item.geography.toLowerCase() === geoFilter.toLowerCase();
      const matchYear = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
      const matchSource = sourceFilter === 'ALL' || item.source.toLowerCase() === sourceFilter.toLowerCase();
      return matchFactor && matchGeo && matchYear && matchSource;
    });
  }, [research_evidence, factorFilter, geoFilter, yearFilter, sourceFilter]);

  const filteredSourceCount = useMemo(() => {
    return new Set(filteredEvidence.map((x) => x.source)).size;
  }, [filteredEvidence]);

  if (loading) {
    return (
      <LoadingState
        title="Loading customer research..."
        subtext="Retrieving independent research evidence observations and source registers"
        skeletonLines={5}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Customer research could not be loaded."
        message="Please check the research data service and try again."
        onRetry={loadData}
        retryLabel="Retry Research Service"
      />
    );
  }

  // Filter evidence by major factor category
  const soundEvidence = research_evidence.filter((x) =>
    ['Sound quality', 'Audio quality', 'Sound clarity', 'High-resolution audio'].includes(x.purchase_factor)
  );

  const batteryEvidence = research_evidence.filter((x) =>
    ['Battery life'].includes(x.purchase_factor)
  );

  const comfortEvidence = research_evidence.filter((x) =>
    ['Comfort', 'Ergonomics / comfort'].includes(x.purchase_factor)
  );

  const priceEvidence = research_evidence.filter((x) =>
    ['Price', 'Price sensitivity', 'Affordable pricing'].includes(x.purchase_factor)
  );

  const callEvidence = research_evidence.filter((x) =>
    ['Voice call quality', 'Voice quality'].includes(x.purchase_factor)
  );

  const ancEvidence = research_evidence.filter((x) =>
    ['Active noise cancellation', 'Noise cancellation'].includes(x.purchase_factor)
  );

  const otherEvidence = research_evidence.filter((x) =>
    [
      'Ease of use',
      'Easy setup / Bluetooth pairing',
      'Smartphone compatibility',
      'Design',
      'Design/look',
      'Brand',
      'Durability',
      'Weight',
      'Product reviews',
      'Online purchase preference',
    ].includes(x.purchase_factor)
  );

  // India-specific evidence items (10 items)
  const indiaEvidence = research_evidence.filter(
    (x) =>
      (x.geography || '').toLowerCase().includes('india') ||
      (x.research_note || '').toLowerCase().includes('india')
  );

  // Helper for analysis pattern matching
  const getPatternForFactor = (keyword) => {
    return research_analysis.find((p) =>
      p.observed_pattern.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <div className="customer-drivers-view" role="article" aria-label="Customer Purchase Drivers Analysis">
      {/* Q3 Business Question & Opening Statement */}
      <section className="cd-question-banner" id="research-scope" aria-label="Q3 Business Question">
        <h2 className="cd-question-title font-heading">
          Q3 — What factors matter to customers when evaluating wireless headphones?
        </h2>
        <div className="cd-opening-statement">
          <p>
            Independent research identifies several recurring considerations in wireless-audio purchase and
            product evaluation, including sound quality, battery life, comfort, price/value, call quality,
            active noise cancellation and ease of use. Because the reviewed studies differ in population,
            geography, methodology and question design, the evidence is presented as a set of source-specific
            findings and recurring themes rather than a single pooled customer preference score.
          </p>
        </div>
      </section>

      {/* 03: Research Approach */}
      <section className="cd-methodology-card" aria-labelledby="cd-approach-heading">
        <div className="cd-method-header">
          <Info size={18} className="cd-method-icon" aria-hidden="true" />
          <h2 id="cd-approach-heading" className="cd-method-title">
            How the customer research is synthesized
          </h2>
        </div>
        <div className="cd-method-content">
          <p>
            The Q3 evidence combines findings from multiple independent sources. Reported quantitative results
            are preserved in their original context, while qualitative findings are retained as qualitative
            evidence. The studies are not statistically pooled because they do not represent a single common
            sample, questionnaire or measurement framework.
          </p>
          <p>
            Where a source reports a percentage or other numeric measure, the report displays the value together
            with its source context rather than treating it as directly comparable to every other study.
          </p>
        </div>
      </section>

      {/* 04: Evidence Base Summary & Coverage Map */}
      <section className="cd-evidence-base-section" aria-labelledby="cd-base-heading">
        <div className="cd-base-overview">
          <div className="cd-base-stat">
            <span className="cd-base-number">{total_evidence_records}</span>
            <span className="cd-base-label">Evidence observations</span>
            <span className="cd-base-subtext">Source-specific records across reviewed studies</span>
          </div>
          <div className="cd-base-stat">
            <span className="cd-base-number">{source_register.length}</span>
            <span className="cd-base-label">Research sources</span>
            <span className="cd-base-subtext">Independent studies, consumer reports and market publications</span>
          </div>
          <div className="cd-base-stat">
            <span className="cd-base-number">{factor_synthesis.length}</span>
            <span className="cd-base-label">Purchase & Evaluation Factors</span>
            <span className="cd-base-subtext">Distinct considerations documented across studies</span>
          </div>
        </div>

        <CoverageMap factorSynthesis={factor_synthesis} totalRecords={total_evidence_records} />
      </section>

      {/* Interactive Research Explorer */}
      <section className="cd-research-explorer-section" aria-labelledby="research-explorer-heading">
        <div className="cd-explorer-header">
          <div className="cd-explorer-title-area">
            <span className="cd-explorer-kicker">Interactive Evidence Exploration</span>
            <h3 id="research-explorer-heading" className="cd-explorer-title">
              Research Explorer
            </h3>
            <p className="cd-explorer-subtitle">
              Filter and inspect individual customer research observations across independent authorities.
            </p>
            <div style={{ marginTop: '8px' }}>
              <DatasetSourceLink datasetKey="customerResearch" label="View customer research dataset" variant="badge" />
            </div>
          </div>

          <div className="cd-filter-controls-row">
            <div className="cd-filter-group">
              <label htmlFor="cd-filter-factor" className="cd-filter-label">Factor</label>
              <select
                id="cd-filter-factor"
                className="cd-select-control"
                value={factorFilter}
                onChange={(e) => handleFactorChange(e.target.value)}
              >
                <option value="ALL">All Factors ({availableFactors.length})</option>
                {availableFactors.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="cd-filter-group">
              <label htmlFor="cd-filter-geo" className="cd-filter-label">Geography</label>
              <select
                id="cd-filter-geo"
                className="cd-select-control"
                value={geoFilter}
                onChange={(e) => handleGeoChange(e.target.value)}
              >
                <option value="ALL">All Geographies ({availableGeos.length})</option>
                {availableGeos.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="cd-filter-group">
              <label htmlFor="cd-filter-year" className="cd-filter-label">Year</label>
              <select
                id="cd-filter-year"
                className="cd-select-control"
                value={yearFilter}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option value="ALL">All Years ({availableYears.length})</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="cd-filter-group">
              <label htmlFor="cd-filter-source" className="cd-filter-label">Source</label>
              <select
                id="cd-filter-source"
                className="cd-select-control"
                value={sourceFilter}
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                <option value="ALL">All Sources ({availableSources.length})</option>
                {availableSources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {(factorFilter !== 'ALL' || geoFilter !== 'ALL' || yearFilter !== 'ALL' || sourceFilter !== 'ALL') && (
              <button
                type="button"
                className="cd-filter-reset-btn"
                onClick={handleResetFilters}
                aria-label="Reset all filters"
              >
                <RotateCcw size={13} aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="cd-explorer-meta-strip">
          <span className="cd-meta-count">
            Showing <strong>{filteredEvidence.length}</strong> of <strong>{total_evidence_records}</strong> evidence observations across <strong>{filteredSourceCount}</strong> sources
          </span>
          <span className="cd-meta-method-hint">
            Preserving source-specific contexts; cross-study pooling is strictly prohibited.
          </span>
        </div>

        {/* Evidence Table or Empty State */}
        {filteredEvidence.length === 0 ? (
          <div className="cd-empty-filter-state">
            <Info size={24} className="cd-empty-icon" aria-hidden="true" />
            <h4 className="cd-empty-title">No evidence matches the selected filters</h4>
            <p className="cd-empty-text">
              Try adjusting your Factor, Geography, Year, or Source filters to explore other evidence observations.
            </p>
            <button type="button" className="cd-empty-reset-btn" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="cd-explorer-table-layout">
            <div className="cd-table-container">
              <table className="cd-evidence-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Source</th>
                    <th>Year</th>
                    <th>Geography</th>
                    <th>Sample / Population</th>
                    <th>Finding / Measurement</th>
                    <th>Evidence Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvidence.map((item, idx) => {
                    const isSelected = selectedEvidenceItem === item;
                    return (
                      <tr
                        key={`ev-${idx}`}
                        className={`cd-ev-row ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setSelectedEvidenceItem(isSelected ? null : item)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedEvidenceItem(isSelected ? null : item);
                          }
                        }}
                      >
                        <td className="cd-col-factor font-semibold">{item.purchase_factor}</td>
                        <td className="cd-col-source">{item.source}</td>
                        <td className="cd-col-year font-mono">{item.year || '—'}</td>
                        <td className="cd-col-geo">{item.geography}</td>
                        <td className="cd-col-sample">{item.sample_basis || '—'}</td>
                        <td className="cd-col-finding">
                          <span className="cd-finding-summary">{item.research_note}</span>
                          {item.reported_value !== null && item.reported_value !== undefined && (
                            <span className="cd-finding-val font-mono">
                              [{item.reported_value}{item.measure ? ` ${item.measure}` : ''}]
                            </span>
                          )}
                        </td>
                        <td className="cd-col-type">
                          <StatusBadge variant={item.reported_value ? 'info' : 'neutral'} size="small">
                            {item.evidence_type}
                          </StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Observation Card Panel */}
            {selectedEvidenceItem && (
              <div className="cd-selected-evidence-drawer" role="region" aria-label="Customer Evidence Card">
                <div className="cd-drawer-header">
                  <div>
                    <span className="cd-drawer-kicker">Selected Evidence Record</span>
                    <h4 className="cd-drawer-title">{selectedEvidenceItem.purchase_factor}</h4>
                  </div>
                  <button
                    type="button"
                    className="cd-drawer-close-btn"
                    onClick={() => setSelectedEvidenceItem(null)}
                    aria-label="Close detail panel"
                  >
                    × Close
                  </button>
                </div>

                <ResearchEvidenceCard item={selectedEvidenceItem} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* 05: Sound Quality */}
      <section className="cd-factor-section" id="sound-quality" aria-labelledby="heading-sound-quality">
        <div className="cd-factor-header">
          <h2 id="heading-sound-quality" className="cd-factor-title">
            Sound Quality
          </h2>
          <span className="cd-factor-evidence-count">{soundEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Sound quality appears repeatedly as a foundational driver across every reviewed wireless audio
            investigation. In consumer surveys, audio fidelity and clarity consistently emerge as primary
            reasons for selecting wireless headphones, establishing that audio performance remains a core
            customer expectation rather than a secondary feature.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {soundEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`sound-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Sound quality appears repeatedly across the reviewed research as a relevant product consideration,
            but the underlying studies measure this concept differently and should not be combined into a
            single universal importance estimate.
          </p>
        </div>
      </section>

      {/* 06: Battery Life */}
      <section className="cd-factor-section" id="battery-life" aria-labelledby="heading-battery-life">
        <div className="cd-factor-header">
          <h2 id="heading-battery-life" className="cd-factor-title">
            Battery Life
          </h2>
          <span className="cd-factor-evidence-count">{batteryEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Battery endurance and playback duration are critical usability factors for mobile audio devices.
            Studies document that battery life is a recurring consideration across mobile, commuting, work, and
            laptop listening contexts, where interruption caused by frequent recharging diminishes customer
            satisfaction.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {batteryEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`battery-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Battery life is a recurring consideration in the reviewed evidence, but the reported measures
            differ across studies. Values therefore remain source-specific rather than being pooled.
          </p>
        </div>
      </section>

      {/* 07: Comfort */}
      <section className="cd-factor-section" id="comfort" aria-labelledby="heading-comfort">
        <div className="cd-factor-header">
          <h2 id="heading-comfort" className="cd-factor-title">
            Comfort
          </h2>
          <span className="cd-factor-evidence-count">{comfortEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Comfort is represented in the research as a product-experience consideration. Reviewers and
            researchers distinguish comfort as a purchase evaluation criterion, an outcome of physical
            product testing, and qualitative feedback on long-session wearability. Ergonomic fit directly
            influences daily product adoption.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {comfortEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`comfort-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Comfort is represented in the research as a product-experience consideration. The evidence is
            retained by source rather than converted into a common numerical importance score.
          </p>
        </div>
      </section>

      {/* 08: Price / Value */}
      <section className="cd-factor-section" id="price-value" aria-labelledby="heading-price-value">
        <div className="cd-factor-header">
          <h2 id="heading-price-value" className="cd-factor-title">
            Price / Value
          </h2>
          <span className="cd-factor-evidence-count">{priceEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Customer purchase decisions evaluate product capabilities relative to cost. Across reviewed surveys,
            price sensitivity and perceived value structure customer willingness to buy. This section focuses
            strictly on customer research findings regarding pricing considerations and planned spending
            bands.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {priceEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`price-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Price/value appears in the reviewed customer evidence as a relevant consideration, but reported
            measures differ across studies.
          </p>
        </div>
      </section>

      {/* 09: Call Quality */}
      <section className="cd-factor-section" id="call-quality" aria-labelledby="heading-call-quality">
        <div className="cd-factor-header">
          <h2 id="heading-call-quality" className="cd-factor-title">
            Call Quality
          </h2>
          <span className="cd-factor-evidence-count">{callEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Voice transmission clarity has emerged as a distinct purchase driver as wireless headphones are
            increasingly utilized for two-way telecommunications, remote work, online learning, and mobile
            voice calls in noisy ambient environments.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {callEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`call-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Call and voice quality is represented in the reviewed research as a distinct product consideration,
            particularly where headphone use includes communication. The available evidence is retained by
            source and measurement rather than pooled.
          </p>
        </div>
      </section>

      {/* 10: Active Noise Cancellation (ANC) */}
      <section className="cd-factor-section" id="anc" aria-labelledby="heading-anc">
        <div className="cd-factor-header">
          <h2 id="heading-anc" className="cd-factor-title">
            Active Noise Cancellation (ANC)
          </h2>
          <span className="cd-factor-evidence-count">{ancEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Active noise cancellation is documented across independent studies as an increasingly desired
            premium feature. The research carefully differentiates between stated feature preference in surveys,
            measured acoustic isolation in technical lab testing, and passive physical isolation from ear-cushion seal.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {ancEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`anc-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Active noise cancellation appears as a relevant feature consideration in the reviewed evidence,
            but the studies differ in how they measure interest, preference or product performance.
          </p>
        </div>
      </section>

      {/* 11: Other Supporting Factors */}
      <section className="cd-factor-section" id="supporting-factors" aria-labelledby="heading-other">
        <div className="cd-factor-header">
          <h2 id="heading-other" className="cd-factor-title">
            Other Supporting Factors
          </h2>
          <span className="cd-factor-evidence-count">{otherEvidence.length} evidence records</span>
        </div>

        <div className="cd-factor-why">
          <h3 className="cd-why-title">Why it matters in the research</h3>
          <p>
            Beyond the primary product pillars, the research dataset documents several operational, aesthetic,
            and ecosystem factors that influence purchase decisions, including ease of pairing, smartphone
            compatibility, industrial design, brand familiarity, durability, weight, and online retail channels.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {otherEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`other-${idx}`} item={item} />
          ))}
        </div>

        <div className="cd-factor-synthesis-box">
          <h4 className="cd-synthesis-label">Analytical Synthesis</h4>
          <p className="cd-synthesis-text">
            Supporting factors such as pairing simplicity, ecosystem compatibility, and industrial design
            contribute to overall product evaluation but show varying presence across independent studies.
          </p>
        </div>
      </section>

      {/* 12: India-Specific Evidence */}
      <section className="cd-india-section" id="india-evidence" aria-labelledby="heading-india-evidence">
        <div className="cd-india-header">
          <div className="cd-india-badge-wrap">
            <StatusBadge variant="evidence-india" size="medium" dot>
              India Market Evidence
            </StatusBadge>
          </div>
          <h2 id="heading-india-evidence" className="cd-india-title">
            India-Specific Evidence
          </h2>
          <p className="cd-india-intro">
            India-specific evidence is particularly relevant for NEXA One's planning context. These findings
            are shown separately from global evidence so that geographic differences are not obscured.
          </p>
        </div>

        <div className="cd-evidence-grid">
          {indiaEvidence.map((item, idx) => (
            <ResearchEvidenceCard key={`india-${idx}`} item={item} />
          ))}
        </div>
      </section>

      {/* 13: Cross-Study Synthesis */}
      <section className="cd-cross-synthesis-section" aria-labelledby="heading-cross-synthesis">
        <h2 id="heading-cross-synthesis" className="cd-synthesis-title">
          Cross-Study Synthesis
        </h2>
        <div className="cd-synthesis-body">
          <p className="cd-synthesis-quote">
            Across the reviewed sources, several product considerations recur: sound quality, battery life,
            comfort, price/value, call quality, ANC and ease of use or compatibility. The recurrence of a factor
            across studies is useful as a qualitative signal, but the studies are not directly comparable enough
            to support a single universal numerical ranking.
          </p>
          <p className="cd-synthesis-quote">
            The evidence therefore supports identifying recurring customer considerations, not assigning one
            definitive percentage to each factor.
          </p>
        </div>
      </section>

      {/* 14: Research Limitations */}
      <section className="cd-limitations-section" id="limitations" aria-labelledby="heading-limitations">
        <div className="cd-limitations-header">
          <AlertTriangle size={20} className="cd-limitations-icon" aria-hidden="true" />
          <h2 id="heading-limitations" className="cd-limitations-title">
            Research Limitations
          </h2>
        </div>
        <p className="cd-limitations-intro">
          The following methodological boundaries must be observed when reviewing the customer research dataset:
        </p>

        <ol className="cd-limitations-list">
          <li className="cd-limitation-item">
            <strong>Different populations:</strong> The sources cover different populations and markets.
          </li>
          <li className="cd-limitation-item">
            <strong>Different methodologies:</strong> The studies use different survey, testing or research methods.
          </li>
          <li className="cd-limitation-item">
            <strong>Different measures:</strong> A percentage, rating, preference measure and product-test result are
            not automatically comparable.
          </li>
          <li className="cd-limitation-item">
            <strong>Different time periods:</strong> The evidence spans different years, so consumer behavior and
            product markets may have changed.
          </li>
          <li className="cd-limitation-item">
            <strong>Geographic differences:</strong> Global evidence should not automatically be interpreted as
            India-specific evidence.
          </li>
          <li className="cd-limitation-item">
            <strong>No pooled preference score:</strong> The studies are not statistically pooled into a universal
            customer preference index.
          </li>
          <li className="cd-limitation-item">
            <strong>Source-specific interpretation:</strong> Each reported result should be interpreted in the
            context of its original source.
          </li>
        </ol>
      </section>

      {/* 15: Business Relevance & Bridges */}
      <section className="cd-business-relevance-section" aria-labelledby="heading-business-relevance">
        <h2 id="heading-business-relevance" className="cd-relevance-title">
          What this means for NEXA One
        </h2>
        <div className="cd-relevance-text-block">
          <p>
            The customer research indicates that product experience and perceived value involve multiple
            dimensions rather than a single dominant feature. Sound quality, battery life, comfort, price/value,
            call quality, ANC and ease of use or compatibility should therefore be considered together when
            interpreting product and marketing decisions.
          </p>
          <p>
            This research provides customer context for the later strategy analysis; it does not by itself
            determine advertising allocation.
          </p>
        </div>

        <div className="cd-bridge-grid">
          {/* Methodology Box: Evidence vs Interpretation */}
          <div className="cd-bridge-card">
            <h3 className="cd-bridge-title">Evidence vs interpretation</h3>
            <p className="cd-bridge-body">
              The research evidence describes reported customer considerations and product evaluations. Any
              implication for NEXA One is an analytical interpretation of that evidence, not a direct measurement
              of NEXA One customer behavior.
            </p>
          </div>

          {/* Bridge: Connecting customer evidence to channel analysis */}
          <div className="cd-bridge-card">
            <h3 className="cd-bridge-title">Connecting customer evidence to channel analysis</h3>
            <p className="cd-bridge-body">
              The customer research adds a different layer of evidence from the advertising analysis. The
              advertising data describes relationships between channel expenditure and observed sales, while the
              customer research describes product and purchase considerations. These evidence streams are
              complementary and should not be treated as substitutes for one another.
            </p>
          </div>
        </div>
      </section>

      {/* 16: Source Register */}
      <section className="cd-source-register-section" aria-labelledby="heading-source-register">
        <div className="cd-sources-header">
          <Database size={20} className="cd-sources-icon" aria-hidden="true" />
          <div>
            <h2 id="heading-source-register" className="cd-sources-title">
              Approved Q3 Research Source Register
            </h2>
            <p className="cd-sources-subtitle">
              Complete inventory of the 10 approved publications providing evidence for Question 3.
            </p>
          </div>
        </div>

        <div className="cd-sources-table-wrapper">
          <table className="cd-sources-table">
            <thead>
              <tr>
                <th scope="col">Source Title</th>
                <th scope="col">Publisher</th>
                <th scope="col" className="text-center">Year</th>
                <th scope="col">What it Contributes</th>
                <th scope="col" className="text-center">Verification Link</th>
              </tr>
            </thead>
            <tbody>
              {source_register.map((s, idx) => (
                <tr key={`source-reg-${idx}`}>
                  <th scope="row" className="cd-source-title-cell">
                    {s.source}
                  </th>
                  <td>{s.publisher || 'Not specified'}</td>
                  <td className="text-center font-mono">{s.publication_year || 'N/A'}</td>
                  <td className="cd-source-contrib-cell">{s.what_it_contributes}</td>
                  <td className="text-center">
                    {s.source_link ? (
                      <a
                        href={s.source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cd-source-table-link"
                        aria-label={`External link for ${s.source}`}
                      >
                        <span>Document</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="cd-no-link">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

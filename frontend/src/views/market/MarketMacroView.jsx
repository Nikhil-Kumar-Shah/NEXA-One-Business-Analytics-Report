import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Globe,
  TrendingUp,
  Layers,
  DollarSign,
  Cpu,
  Truck,
  Building,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldAlert,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { fetchMarketTrends } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { StatusBadge } from '../../components/badges/StatusBadge';
import { MarketEvidenceCard } from './MarketEvidenceCard';
import { FormFactorChart } from './FormFactorChart';
import { MacroForecastComparison } from './MacroForecastComparison';
import { ManufacturingEcosystemBlock } from './ManufacturingEcosystemBlock';
import { MarketEvidenceTable } from './MarketEvidenceTable';
import { DatasetSourceLink } from '../../components/common/DatasetSourceLink';
import './MarketMacroView.css';

/**
 * Section 06: Market & Macro Environment (Question 4)
 * Synthesizes external evidence across India wireless-audio, premiumization, form factor shifts,
 * consumer affordability proxies, macroeconomic projections, and global trade dynamics.
 * Enforces strict distinction: Direct Evidence -> Category Proxy -> Business Implication.
 */
export function MarketMacroView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [themeFilter, setThemeFilter] = useState(searchParams.get('theme') || 'ALL');
  const [sourceFilter, setSourceFilter] = useState(searchParams.get('source') || 'ALL');
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'ALL');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'ALL');
  const [selectedMarketItem, setSelectedMarketItem] = useState(null);

  const marketThemes = [
    { id: 'ALL', label: 'All Themes' },
    { id: 'India Wireless-Audio Market', label: 'India Wireless-Audio Market' },
    { id: 'Premiumization', label: 'Premiumization' },
    { id: 'TWS vs OWS', label: 'TWS vs OWS' },
    { id: 'Consumer Affordability', label: 'Consumer Affordability' },
    { id: 'Indian Macro Environment', label: 'Indian Macro Environment' },
    { id: 'Global Trade', label: 'Global Trade' },
    { id: 'Supply-Chain Conditions', label: 'Supply-Chain Conditions' },
    { id: 'Electronics Manufacturing in India', label: 'Electronics Manufacturing in India' },
  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMarketTrends();
      setData(res);
    } catch (err) {
      console.error('Failed to load market & macro data:', err);
      setError(err.message || 'Please check the research data service and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const total_evidence_records = data?.total_evidence_records || 38;
  const market_evidence = data?.market_evidence || [];
  const trend_synthesis = data?.trend_synthesis || [];
  const source_register = data?.source_register || [];

  const availableSources = useMemo(() => {
    if (!market_evidence || market_evidence.length === 0) return [];
    return Array.from(new Set(market_evidence.map((x) => x.source).filter(Boolean))).sort();
  }, [market_evidence]);

  const availableYears = useMemo(() => {
    if (!market_evidence || market_evidence.length === 0) return [];
    return Array.from(new Set(market_evidence.map((x) => x.year).filter(Boolean))).sort((a, b) => b - a);
  }, [market_evidence]);

  const availableTypes = useMemo(() => {
    if (!market_evidence || market_evidence.length === 0) return [];
    return Array.from(new Set(market_evidence.map((x) => x.evidence_type).filter(Boolean))).sort();
  }, [market_evidence]);

  const matchesTheme = (item, themeId) => {
    if (themeId === 'ALL') return true;
    if (themeId === 'India Wireless-Audio Market') {
      return item.market_sector === 'TWS market' && !item.indicator.includes('Revenue');
    }
    if (themeId === 'Premiumization') {
      return item.indicator.includes('Revenue') || (item.research_note && item.research_note.toLowerCase().includes('premium'));
    }
    if (themeId === 'TWS vs OWS') {
      return item.market_sector === 'TWS / OWS' || item.market_sector === 'Open wireless stereo';
    }
    if (themeId === 'Consumer Affordability') {
      return item.market_sector === 'Smartphone market';
    }
    if (themeId === 'Indian Macro Environment') {
      return item.market_sector === 'Economy';
    }
    if (themeId === 'Global Trade') {
      return item.market_sector === 'Global trade' || item.market_sector === 'Semiconductors' || item.market_sector === 'Batteries';
    }
    if (themeId === 'Supply-Chain Conditions') {
      return item.market_sector === 'ICT products' || item.market_sector === 'ICT production';
    }
    if (themeId === 'Electronics Manufacturing in India') {
      return item.market_sector === 'Electronics manufacturing' || item.market_sector === 'Semiconductor manufacturing' || item.market_sector === 'Electronics components';
    }
    return true;
  };

  const updateMarketParam = (key, value) => {
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

  const handleThemeChange = (val) => {
    setThemeFilter(val);
    updateMarketParam('theme', val);
  };

  const handleSourceChange = (val) => {
    setSourceFilter(val);
    updateMarketParam('source', val);
  };

  const handleYearChange = (val) => {
    setYearFilter(val);
    updateMarketParam('year', val);
  };

  const handleTypeChange = (val) => {
    setTypeFilter(val);
    updateMarketParam('type', val);
  };

  const handleResetFilters = () => {
    setThemeFilter('ALL');
    setSourceFilter('ALL');
    setYearFilter('ALL');
    setTypeFilter('ALL');
    setSelectedMarketItem(null);
    setSearchParams({}, { replace: true });
  };

  const filteredMarketEvidence = useMemo(() => {
    if (!market_evidence || market_evidence.length === 0) return [];
    return market_evidence.filter((item) => {
      const matchTheme = matchesTheme(item, themeFilter);
      const matchSrc = sourceFilter === 'ALL' || item.source.toLowerCase() === sourceFilter.toLowerCase();
      const matchYr = yearFilter === 'ALL' || String(item.year) === String(yearFilter);
      const matchType = typeFilter === 'ALL' || item.evidence_type.toLowerCase() === typeFilter.toLowerCase();
      return matchTheme && matchSrc && matchYr && matchType;
    });
  }, [market_evidence, themeFilter, sourceFilter, yearFilter, typeFilter]);

  const filteredSourceCount = useMemo(() => {
    return new Set(filteredMarketEvidence.map((x) => x.source)).size;
  }, [filteredMarketEvidence]);

  if (loading) {
    return (
      <LoadingState
        title="Loading market and macro evidence..."
        subtext="Retrieving external category trackers, macroeconomic projections, and trade indicators"
        skeletonLines={5}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Market and macro evidence could not be loaded."
        message="Please check the research data service and try again."
        onRetry={loadData}
        retryLabel="Retry Market Research"
      />
    );
  }

  // Categorize evidence records into their specific themes
  const indiaAudioEvidence = market_evidence.filter(
    (e) =>
      e.market_sector === 'TWS market' &&
      (e.period.includes('2025') || e.indicator.includes('Market growth') || e.indicator.includes('Consumer demand'))
  );

  const premiumizationEvidence = market_evidence.filter(
    (e) => e.market_sector === 'TWS market' && e.indicator.includes('Revenue')
  );

  const formFactorEvidence = market_evidence.filter(
    (e) => e.market_sector === 'TWS / OWS' || e.market_sector === 'Open wireless stereo'
  );

  const affordabilityEvidence = market_evidence.filter(
    (e) => e.market_sector === 'Smartphone market'
  );

  const macroEvidence = market_evidence.filter(
    (e) => e.market_sector === 'Economy'
  );

  const tradeEvidence = market_evidence.filter(
    (e) =>
      e.market_sector === 'Global trade' ||
      e.market_sector === 'Semiconductors' ||
      e.market_sector === 'Batteries'
  );

  const supplyChainEvidence = market_evidence.filter(
    (e) => e.market_sector === 'ICT products' || e.market_sector === 'ICT production'
  );

  const manufacturingEvidence = market_evidence.filter(
    (e) =>
      e.market_sector === 'Electronics manufacturing' ||
      e.market_sector === 'Semiconductor manufacturing' ||
      e.market_sector === 'Electronics components'
  );

  return (
    <div className="market-macro-view" role="article" aria-label="Market and Macroeconomic Environment Analysis">
      {/* Q4 Business Question & Opening Statement */}
      <section className="mm-question-banner" aria-label="Q4 Business Question">
        <h2 className="mm-question-title font-heading">
          Q4 — What market and macroeconomic conditions should NEXA One consider?
        </h2>
        <div className="mm-opening-statement">
          <p>
            The external evidence points to a wireless-audio market that is broadly mature in some segments,
            alongside premiumization and emerging open-ear alternatives. At the same time, consumer affordability,
            macroeconomic conditions and global trade and supply-chain dynamics create additional considerations
            for the next planning period.
          </p>
          <p>
            The evidence varies in how directly it relates to NEXA One. Market statistics provide direct evidence
            about their reported category, broader indicators provide context about adjacent markets or the
            economy, and business implications are therefore presented separately from the underlying
            observations.
          </p>
        </div>
      </section>

      {/* 03: How to Read External Evidence */}
      <section className="mm-methodology-card" aria-labelledby="mm-evidence-logic-title">
        <div className="mm-method-header">
          <Info size={18} className="mm-method-icon" aria-hidden="true" />
          <h2 id="mm-evidence-logic-title" className="mm-method-title">
            Direct evidence vs category proxy
          </h2>
        </div>
        <div className="mm-method-content">
          <p>
            External evidence does not all measure the same thing. A direct market observation describes the
            category or geography reported by the source. A category proxy describes an adjacent market that may
            provide context. A business implication is an interpretation of what the evidence may mean for NEXA
            One and should not be mistaken for a directly measured NEXA outcome.
          </p>

          <div className="mm-three-step-framework">
            <div className="mm-step-card">
              <span className="mm-step-num">01</span>
              <span className="mm-step-name">Direct Evidence</span>
              <span className="mm-step-desc">Category/market statistics reported directly by the publishing source.</span>
            </div>
            <div className="mm-step-arrow">→</div>
            <div className="mm-step-card proxy">
              <span className="mm-step-num">02</span>
              <span className="mm-step-name">Category Proxy</span>
              <span className="mm-step-desc">Adjacent industry indicators providing contextual market pressure signals.</span>
            </div>
            <div className="mm-step-arrow">→</div>
            <div className="mm-step-card implication">
              <span className="mm-step-num">03</span>
              <span className="mm-step-name">Business Implication</span>
              <span className="mm-step-desc">Analytical inference for NEXA One planning; never confused with direct data.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 04: Market Evidence Overview */}
      <section className="mm-overview-section" aria-labelledby="mm-overview-heading">
        <div className="mm-overview-strip">
          <div className="mm-overview-pill">
            <span className="mm-pill-num font-mono">{total_evidence_records}</span>
            <span className="mm-pill-label">Evidence Observations</span>
            <span className="mm-pill-sub">Approved empirical & forecast records</span>
          </div>
          <div className="mm-overview-pill">
            <span className="mm-pill-num font-mono">{source_register.length}</span>
            <span className="mm-pill-label">Research Sources</span>
            <span className="mm-pill-sub">Independent economic & trade institutions</span>
          </div>
          <div className="mm-overview-pill">
            <span className="mm-pill-num font-mono">{trend_synthesis.length}</span>
            <span className="mm-pill-label">Synthesized Trend Areas</span>
            <span className="mm-pill-sub">Discrete market & supply-chain dimensions</span>
          </div>
        </div>

        <MarketEvidenceTable />

        {/* Interactive Market Evidence Explorer */}
        <div className="mm-market-explorer-panel" role="region" aria-label="Market Evidence Explorer">
          <div className="mm-explorer-header">
            <div>
              <span className="mm-exp-kicker">Interactive Evidence Exploration</span>
              <h3 className="mm-exp-title">Market Evidence Explorer</h3>
              <p className="mm-exp-subtitle">
                Filter and inspect the 38 external market signals, category proxies, and macroeconomic forecasts.
              </p>
              <div style={{ marginTop: '8px' }}>
                <DatasetSourceLink datasetKey="marketMacro" label="View market & macro research dataset" variant="badge" />
              </div>
            </div>

            <div className="mm-filter-controls-row">
              <div className="mm-filter-group">
                <label htmlFor="mm-filter-theme" className="mm-filter-label">Theme</label>
                <select
                  id="mm-filter-theme"
                  className="mm-select-control"
                  value={themeFilter}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  {marketThemes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="mm-filter-group">
                <label htmlFor="mm-filter-source" className="mm-filter-label">Source</label>
                <select
                  id="mm-filter-source"
                  className="mm-select-control"
                  value={sourceFilter}
                  onChange={(e) => handleSourceChange(e.target.value)}
                >
                  <option value="ALL">All Sources ({availableSources.length})</option>
                  {availableSources.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="mm-filter-group">
                <label htmlFor="mm-filter-year" className="mm-filter-label">Year</label>
                <select
                  id="mm-filter-year"
                  className="mm-select-control"
                  value={yearFilter}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="ALL">All Years ({availableYears.length})</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="mm-filter-group">
                <label htmlFor="mm-filter-type" className="mm-filter-label">Evidence Type</label>
                <select
                  id="mm-filter-type"
                  className="mm-select-control"
                  value={typeFilter}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option value="ALL">All Types ({availableTypes.length})</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {(themeFilter !== 'ALL' || sourceFilter !== 'ALL' || yearFilter !== 'ALL' || typeFilter !== 'ALL') && (
                <button
                  type="button"
                  className="mm-filter-reset-btn"
                  onClick={handleResetFilters}
                  aria-label="Reset market filters"
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="mm-explorer-meta-strip">
            <span className="mm-meta-count">
              Showing <strong>{filteredMarketEvidence.length}</strong> of <strong>{total_evidence_records}</strong> market observations across <strong>{filteredSourceCount}</strong> sources
            </span>
            <span className="mm-proxy-badge-legend">
              <span className="legend-tag direct">Direct Evidence</span>
              <span className="legend-tag proxy">Category Proxy</span>
              <span className="legend-tag macro">Macro Context</span>
            </span>
          </div>

          {filteredMarketEvidence.length === 0 ? (
            <div className="mm-empty-state">
              <Info size={22} className="mm-empty-icon" aria-hidden="true" />
              <h4 className="mm-empty-title">No market evidence matches the selected filters</h4>
              <p className="mm-empty-text">Try adjusting the Theme, Source, Year, or Evidence Type controls.</p>
              <button type="button" className="mm-empty-btn" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="mm-table-and-detail-layout">
              <div className="mm-table-scroll">
                <table className="mm-table">
                  <thead>
                    <tr>
                      <th>Indicator</th>
                      <th>Market Sector</th>
                      <th>Value / Measure</th>
                      <th>Period</th>
                      <th>Geography</th>
                      <th>Classification</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarketEvidence.map((item, idx) => {
                      const isSelected = selectedMarketItem === item;
                      const isProxy = item.evidence_type.toLowerCase().includes('proxy');
                      const isMacro = item.evidence_type.toLowerCase().includes('macro') || item.evidence_type.toLowerCase().includes('structural');
                      const badgeVariant = isProxy ? 'warning' : isMacro ? 'neutral' : 'info';

                      return (
                        <tr
                          key={`mkt-${idx}`}
                          className={`mm-row ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedMarketItem(isSelected ? null : item)}
                          tabIndex={0}
                          role="button"
                          aria-pressed={isSelected}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedMarketItem(isSelected ? null : item);
                            }
                          }}
                        >
                          <td className="mm-col-indicator font-semibold">{item.indicator}</td>
                          <td className="mm-col-sector">{item.market_sector}</td>
                          <td className="mm-col-val font-mono">
                            {item.reported_value !== null && item.reported_value !== undefined ? (
                              <span>{item.reported_value}{item.measure ? ` ${item.measure}` : ''}</span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="mm-col-period">{item.period || '—'}</td>
                          <td className="mm-col-geo">{item.geography}</td>
                          <td className="mm-col-class">
                            <StatusBadge variant={badgeVariant} size="small">
                              {item.evidence_type}
                            </StatusBadge>
                          </td>
                          <td className="mm-col-src">{item.source}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {selectedMarketItem && (
                <div className="mm-detail-drawer" role="region" aria-label="Selected Market Evidence Detail">
                  <div className="mm-drawer-header">
                    <div>
                      <span className="mm-drawer-kicker">Observation details</span>
                      <h4 className="mm-drawer-title">{selectedMarketItem.indicator}</h4>
                    </div>
                    <button
                      type="button"
                      className="mm-drawer-close"
                      onClick={() => setSelectedMarketItem(null)}
                      aria-label="Close details"
                    >
                      × Close
                    </button>
                  </div>

                  <div className="mm-drawer-body">
                    <div className="mm-drawer-meta-grid">
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Market Sector</span>
                        <span className="drawer-val">{selectedMarketItem.market_sector}</span>
                      </div>
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Reported Metric</span>
                        <span className="drawer-val font-mono">
                          {selectedMarketItem.reported_value ?? '—'} {selectedMarketItem.measure || ''}
                        </span>
                      </div>
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Period / Year</span>
                        <span className="drawer-val font-mono">{selectedMarketItem.period || selectedMarketItem.year}</span>
                      </div>
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Geography</span>
                        <span className="drawer-val">{selectedMarketItem.geography}</span>
                      </div>
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Evidence Source</span>
                        <span className="drawer-val">{selectedMarketItem.source} {selectedMarketItem.publisher ? `(${selectedMarketItem.publisher})` : ''}</span>
                      </div>
                      <div className="mm-drawer-meta-item">
                        <span className="drawer-lbl">Classification</span>
                        <span className="drawer-val">
                          <StatusBadge
                            variant={
                              selectedMarketItem.evidence_type.toLowerCase().includes('proxy')
                                ? 'warning'
                                : selectedMarketItem.evidence_type.toLowerCase().includes('macro')
                                ? 'neutral'
                                : 'info'
                            }
                            size="small"
                          >
                            {selectedMarketItem.evidence_type}
                          </StatusBadge>
                        </span>
                      </div>
                    </div>

                    <div className="mm-drawer-finding">
                      <span className="drawer-lbl">Observed Evidence Context</span>
                      <p className="drawer-finding-text">{selectedMarketItem.research_note}</p>
                    </div>

                    <div className="mm-drawer-proxy-warning">
                      <ShieldAlert size={16} className="mm-warning-icon" aria-hidden="true" />
                      <div>
                        <strong>Methodological Proxy Rule:</strong> Adjacent market indicators (such as smartphone shipments or GDP growth) provide context regarding consumer spending pressures and macroeconomic background. They must not be conflated with or represented as direct NEXA One headphone demand or revenue.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 05: India Wireless-Audio Market */}
      <section className="mm-theme-section" id="market" aria-labelledby="heading-india-audio">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-india-audio" className="mm-theme-title">
              India Wireless-Audio Market
            </h2>
            <StatusBadge variant="info" size="small">
              Direct category evidence
            </StatusBadge>
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            India's TWS market was broadly flat in 2025. Q4 2025 recorded 12% year-on-year growth.
            Premiumization drove India TWS revenue up 7% year-on-year in Q1 2026, while quarterly shipments
            declined.
          </p>
        </div>

        <div className="mm-cards-grid">
          {indiaAudioEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`india-audio-${idx}`}
              item={item}
              classification="Direct market evidence"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            The evidence suggests a mature wireless-audio category with pockets of growth and changing value
            capture. NEXA One therefore operates in a market where growth may depend on product value,
            differentiation and consumer willingness to pay rather than simply on broad category expansion.
          </p>
        </div>
      </section>

      {/* 06: Premiumization */}
      <section className="mm-theme-section" id="premiumization" aria-labelledby="heading-premiumization">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-premiumization" className="mm-theme-title">
              Premiumization
            </h2>
            <StatusBadge variant="info" size="small">
              Direct market evidence
            </StatusBadge>
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            The reported combination of higher revenue and lower quarterly shipments is consistent with a
            premiumization signal in the reported India TWS market.
          </p>
        </div>

        <div className="mm-cards-grid">
          {premiumizationEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`prem-${idx}`}
              item={item}
              classification="Direct market evidence"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            For NEXA One, premium features and product experience may matter more than a strategy based only on
            increasing unit volume, but the external evidence does not establish NEXA-specific willingness to
            pay.
          </p>
        </div>
      </section>

      {/* 07: TWS vs OWS */}
      <section className="mm-theme-section" id="tws-ows" aria-labelledby="heading-tws-ows">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-tws-ows" className="mm-theme-title">
              TWS vs OWS
            </h2>
            <StatusBadge variant="info" size="small">
              Direct category evidence
            </StatusBadge>
            <StatusBadge variant="evidence-global" size="small">
              Global
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            Global personal audio tracking by Omdia reveals structural divergence across form factors: conventional
            TWS shipments declined -0.7% YoY to 82.1 million units in Q2 2026, while Open Wireless Stereo (OWS)
            shipments surged +12% YoY to 11.1 million units, lifting OWS market share to 13.5% (up from 12% in Q2
            2025). OWS shipments are forecast to reach 90.5 million units by 2030 from a 43.9 million baseline in 2026.
          </p>
        </div>

        <FormFactorChart />

        <div className="mm-cards-grid">
          {formFactorEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`ff-${idx}`}
              item={item}
              classification="Direct category evidence"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            The contrast between broadly flat TWS shipments and faster OWS growth indicates increasing form-factor
            competition within wireless audio. For NEXA One, this suggests that product differentiation should be
            evaluated against changing listening formats rather than only against traditional TWS competitors.
          </p>
        </div>
      </section>

      {/* 08: Consumer Affordability */}
      <section className="mm-theme-section" id="affordability" aria-labelledby="heading-affordability">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-affordability" className="mm-theme-title">
              Consumer Affordability
            </h2>
            <StatusBadge variant="warning" size="small">
              Category proxy
            </StatusBadge>
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            In Q2 2026, India smartphone shipments dropped -13% YoY to 33.9 million units. Market trackers cite
            rising memory costs, vendor price increases, rupee depreciation, and broader inflationary pressures as
            key contributors to softer consumer demand.
          </p>
          <div className="mm-proxy-warning-banner">
            <Info size={16} aria-hidden="true" />
            <span>
              <strong>Methodological Boundary:</strong> Smartphone shipment data is used here as an adjacent
              consumer-electronics affordability and market-pressure proxy. It is not a direct measure of
              headphone demand.
            </span>
          </div>
        </div>

        <div className="mm-cards-grid">
          {affordabilityEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`afford-${idx}`}
              item={item}
              classification="Category proxy"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            Affordability pressure in adjacent consumer electronics suggests that price/value positioning may
            become more important for discretionary electronics purchases. The implication for NEXA One is
            contextual rather than a direct forecast of headphone demand.
          </p>
        </div>
      </section>

      {/* 09: Indian Macro Environment */}
      <section className="mm-theme-section" id="macro" aria-labelledby="heading-macro">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-macro" className="mm-theme-title">
              Indian Macro Environment
            </h2>
            <StatusBadge variant="neutral" size="small">
              Direct macro evidence
            </StatusBadge>
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            The macro evidence indicates continued economic growth alongside a moderation in the growth outlook
            across the cited forecasts.
          </p>
        </div>

        <MacroForecastComparison />

        <div className="mm-cards-grid">
          {macroEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`macro-${idx}`}
              item={item}
              classification="Macro context"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            A growing but moderating macro environment provides a supportive overall economic backdrop while
            leaving consumer affordability and discretionary-spending conditions relevant to electronics
            planning.
          </p>
        </div>
      </section>

      {/* 10: Global Trade */}
      <section className="mm-theme-section" id="trade" aria-labelledby="heading-trade">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-trade" className="mm-theme-title">
              Global Trade
            </h2>
            <StatusBadge variant="info" size="small">
              Direct trade evidence
            </StatusBadge>
            <StatusBadge variant="evidence-global" size="small">
              Global
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            The trade evidence indicates strong growth in several technology-related trade categories alongside
            higher trade-price pressure. For consumer electronics, this creates a context in which component
            availability, input costs and cross-border logistics can affect planning.
          </p>
        </div>

        <div className="mm-cards-grid">
          {tradeEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`trade-${idx}`}
              item={item}
              classification="Direct trade evidence"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            Global goods and electronics trade expansion highlights dynamic component movement, but rising trade
            inflation (3.6% in Q1 rising toward ~5% in Q2 2026) suggests that procurement costs and logistics
            remain active planning variables.
          </p>
        </div>
      </section>

      {/* 11: Supply-Chain Conditions */}
      <section className="mm-theme-section" id="supply-chain" aria-labelledby="heading-supply-chain">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-supply-chain" className="mm-theme-title">
              Supply-Chain Conditions
            </h2>
            <StatusBadge variant="neutral" size="small">
              Category / supply-chain context
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            Electronics supply chains remain highly connected to Asian production networks, while trade and
            component conditions can affect cost and availability. These are supply-chain planning considerations
            rather than direct evidence of NEXA-specific cost changes.
          </p>
        </div>

        <div className="mm-cards-grid">
          {supplyChainEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`sc-${idx}`}
              item={item}
              classification="Category / supply-chain context"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            Because ICT products account for over 12% of global exports and 80% of ICT production remains
            concentrated in Asia, lead times, tariff shifts, and cross-border component flows must be monitored
            closely for hardware scheduling.
          </p>
        </div>
      </section>

      {/* 12: Electronics Manufacturing in India */}
      <section className="mm-theme-section" id="manufacturing" aria-labelledby="heading-manufacturing">
        <div className="mm-theme-header">
          <div className="mm-theme-title-wrap">
            <h2 id="heading-manufacturing" className="mm-theme-title">
              Electronics Manufacturing in India
            </h2>
            <StatusBadge variant="positive" size="small">
              Direct India electronics-industry evidence
            </StatusBadge>
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          </div>
        </div>

        <div className="mm-theme-narrative">
          <p>
            India's electronics manufacturing ecosystem is expanding across semiconductor fabrication,
            assembly/testing and design. This may improve the broader domestic electronics ecosystem and
            supply-chain capability, but the evidence does not establish that NEXA One currently sources from or
            directly benefits from these specific programs.
          </p>
        </div>

        <ManufacturingEcosystemBlock />

        <div className="mm-cards-grid">
          {manufacturingEvidence.map((item, idx) => (
            <MarketEvidenceCard
              key={`mfg-${idx}`}
              item={item}
              classification="Direct India electronics-industry evidence"
            />
          ))}
        </div>

        <div className="mm-implication-callout">
          <h4 className="mm-imp-title">Business Implication</h4>
          <p className="mm-imp-text">
            Long-term domestic ecosystem development provides supportive structural tailwinds for local assembly
            and component sourcing, but near-term product execution depends on established vendor relationships.
          </p>
        </div>
      </section>

      {/* 13: Cross-Theme Synthesis */}
      <section className="mm-cross-synthesis-section" id="synthesis" aria-labelledby="heading-cross-synthesis">
        <h2 id="heading-cross-synthesis" className="mm-synthesis-title">
          Cross-Theme Synthesis
        </h2>
        <div className="mm-synthesis-card">
          <p className="mm-synthesis-quote">
            The Q4 evidence describes a market environment with several simultaneous forces: a broadly mature
            TWS market in India, stronger growth in selected periods and premium segments, emerging OWS
            competition, affordability pressure in adjacent consumer electronics, continued economic growth with
            moderating forecasts, and evolving global trade and electronics supply-chain conditions.
          </p>
          <p className="mm-synthesis-quote">
            These signals should be treated as context for NEXA One's planning, not as direct forecasts of NEXA
            sales.
          </p>
        </div>
      </section>

      {/* 14: Business Implications (Structured 4-part) */}
      <section className="mm-implications-section" aria-labelledby="heading-business-implications">
        <h2 id="heading-business-implications" className="mm-implications-title">
          What the external environment may mean for NEXA One
        </h2>
        <p className="mm-implications-lead">
          Synthesizing external indicators into strategic context across four core dimensions:
        </p>

        <div className="mm-implications-grid">
          <div className="mm-imp-card">
            <span className="mm-imp-card-num">01</span>
            <h3 className="mm-imp-card-title">Value and premium positioning</h3>
            <p className="mm-imp-card-body">
              Premiumization evidence suggests that consumers may continue to differentiate products by value and
              features rather than unit price alone, although NEXA-specific willingness to pay is not directly
              measured.
            </p>
          </div>

          <div className="mm-imp-card">
            <span className="mm-imp-card-num">02</span>
            <h3 className="mm-imp-card-title">Form-factor competition</h3>
            <p className="mm-imp-card-body">
              OWS growth provides evidence that the competitive wireless-audio landscape is expanding beyond
              conventional TWS products.
            </p>
          </div>

          <div className="mm-imp-card">
            <span className="mm-imp-card-num">03</span>
            <h3 className="mm-imp-card-title">Affordability sensitivity</h3>
            <p className="mm-imp-card-body">
              Adjacent consumer-electronics evidence indicates that affordability conditions should remain part
              of planning, particularly for discretionary electronics.
            </p>
          </div>

          <div className="mm-imp-card">
            <span className="mm-imp-card-num">04</span>
            <h3 className="mm-imp-card-title">Supply-chain awareness</h3>
            <p className="mm-imp-card-body">
              Trade, component and electronics-manufacturing conditions remain relevant to cost, availability and
              operational planning.
            </p>
          </div>
        </div>
      </section>

      {/* 15: What Q4 Does Not Establish */}
      <section className="mm-warning-box-section" aria-label="Analytical Boundaries">
        <div className="mm-warning-box">
          <div className="mm-warning-header">
            <ShieldAlert size={20} className="mm-warning-icon" aria-hidden="true" />
            <h3 className="mm-warning-title">What this external research does not establish</h3>
          </div>
          <p className="mm-warning-body">
            It does not establish NEXA One's market share, NEXA-specific demand, NEXA-specific price elasticity,
            NEXA-specific supply-chain costs or NEXA-specific customer spending behavior. Those variables are not
            directly measured in the reviewed evidence.
          </p>
        </div>
      </section>

      {/* 16: Research Limitations */}
      <section className="mm-limitations-section" id="limitations" aria-labelledby="heading-limitations">
        <div className="mm-limitations-header">
          <AlertTriangle size={20} className="mm-limitations-icon" aria-hidden="true" />
          <h2 id="heading-limitations" className="mm-limitations-title">
            Q4 Research Limitations
          </h2>
        </div>
        <p className="mm-limitations-intro">
          The following methodological boundaries must be respected when evaluating external market context:
        </p>

        <ol className="mm-limitations-list">
          <li className="mm-limitation-item">
            <strong>Different markets:</strong> The evidence covers India, global markets and adjacent categories.
          </li>
          <li className="mm-limitation-item">
            <strong>Different categories:</strong> TWS, OWS, smartphones, ICT products, batteries and broader
            electronics are not interchangeable markets.
          </li>
          <li className="mm-limitation-item">
            <strong>Proxy evidence:</strong> Some indicators provide contextual signals rather than direct
            evidence about wireless-headphone demand.
          </li>
          <li className="mm-limitation-item">
            <strong>Forecast uncertainty:</strong> Forecast values describe expectations reported by the cited
            source and are not observed outcomes.
          </li>
          <li className="mm-limitation-item">
            <strong>Different periods:</strong> The evidence covers different quarters and years.
          </li>
          <li className="mm-limitation-item">
            <strong>Source methodology:</strong> Each organization uses its own research methodology, definitions
            and market coverage.
          </li>
        </ol>
      </section>

      {/* 17: Source Register */}
      <section className="mm-sources-section" aria-labelledby="heading-source-register">
        <div className="mm-sources-header">
          <Globe size={20} className="mm-sources-icon" aria-hidden="true" />
          <div>
            <h2 id="heading-source-register" className="mm-sources-title">
              Approved Q4 Market & Macro Source Register
            </h2>
            <p className="mm-sources-subtitle">
              Inventory of the 9 authorized institutional sources establishing external market context.
            </p>
          </div>
        </div>

        <div className="mm-sources-table-wrapper">
          <table className="mm-sources-table">
            <thead>
              <tr>
                <th scope="col">Source Publication</th>
                <th scope="col">Publisher / Institution</th>
                <th scope="col" className="text-center">Year</th>
                <th scope="col">What it Contributes</th>
                <th scope="col" className="text-center">Verification Link</th>
              </tr>
            </thead>
            <tbody>
              {source_register.map((s, idx) => (
                <tr key={`src-reg-${idx}`}>
                  <th scope="row" className="mm-source-title-cell">
                    {s.source}
                  </th>
                  <td>{s.publisher || 'Not specified'}</td>
                  <td className="text-center font-mono">{s.publication_year || 'N/A'}</td>
                  <td className="mm-source-contrib-cell">{s.what_it_contributes}</td>
                  <td className="text-center">
                    {s.source_link ? (
                      <a
                        href={s.source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mm-source-link"
                        aria-label={`External document for ${s.source}`}
                      >
                        <span>Document</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="mm-no-link">—</span>
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

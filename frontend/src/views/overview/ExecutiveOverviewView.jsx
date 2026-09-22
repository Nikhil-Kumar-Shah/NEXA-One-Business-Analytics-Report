import React, { useState, useEffect, useCallback } from 'react';
import { fetchExecutiveOverview } from '../../services/api';
import { CorrelationBarChart } from './CorrelationBarChart';
import { KpiTile } from '../../components/cards/KpiTile';
import { AnalyticalDarkPanel } from '../../components/cards/AnalyticalDarkPanel';
import { EditorialButton } from '../../components/buttons/EditorialButton';
import { StatusPill } from '../../components/common/StatusPill';
import {
  ChartCard,
  SourceCitation,
  MethodologyBox,
  LoadingState,
  ErrorState,
} from '../../components';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import './ExecutiveOverviewView.css';

export function ExecutiveOverviewView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchExecutiveOverview();
      setData(result);
    } catch (err) {
      console.error('Failed to load analytical evidence:', err);
      setError(err.message || 'Please check the report data service and try again.');
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
        title="Loading analytical evidence..."
        subtext="Verifying data integrity and loading multi-channel model results"
        skeletonLines={4}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="This section is temporarily unavailable."
        message="The report data service did not return the required analytical content. Please refresh the report."
        onRetry={loadData}
        retryLabel="Refresh Report"
      />
    );
  }

  const { overview, regression } = data;

  // Formatted display values
  const observations = overview.dataset.market_count;
  const rSquaredDisplay = (overview.model.r_squared * 100).toFixed(2) + '%';
  const adjRSquaredDisplay = (overview.model.adjusted_r_squared * 100).toFixed(2) + '%';
  const rSquaredRaw = overview.model.r_squared.toFixed(4);
  const adjRSquaredRaw = overview.model.adjusted_r_squared.toFixed(4);

  const tvCorr = overview.correlations.tv_sales;
  const socialCorr = overview.correlations.social_media_sales;
  const printCorr = overview.correlations.print_sales;

  // Regression coefficients from API
  const tvCoeff = regression.coefficients.find((c) => c.variable === 'TV Ads')?.coefficient ?? 0.04576;
  const socialCoeff = regression.coefficients.find((c) => c.variable === 'Social Media Ads')?.coefficient ?? 0.18853;
  const printCoeff = regression.coefficients.find((c) => c.variable === 'Print Ads')?.coefficient ?? -0.00104;

  const tvCoeffDisplay = `+${tvCoeff.toFixed(4)}`;
  const socialCoeffDisplay = `+${socialCoeff.toFixed(4)}`;
  const printCoeffDisplay = printCoeff.toFixed(4);

  return (
    <div className="executive-overview-container">
      {/* 1. Executive Statement & Core Finding (Section 8 & 9) */}
      <section className="editorial-hero-grid" id="overview" aria-label="Executive Statement">
        <div className="hero-statement-col">
          <span className="editorial-meta-kicker font-mono">EXECUTIVE SYNTHESIS</span>
          <h2 className="editorial-display-heading font-heading">
            Understanding the evidence behind the{' '}
            <span className="editorial-highlight">next planning period</span>.
          </h2>
          <p className="hero-lead-paragraph">
            The analysis finds a strong positive relationship between advertising activity and sales,
            with the combined advertising model explaining about 89.7% of the variation in observed sales.
            TV has the strongest relationship with sales among the three channels, while social media also
            shows a meaningful positive relationship. Print advertising has a much weaker relationship
            with sales and is not statistically significant in the multivariate model.
          </p>
        </div>

        <div className="hero-evidence-col">
          <AnalyticalDarkPanel
            badge="THE CORE FINDING"
            title="The three-channel model explains 89.72% of observed sales variation."
            statement="Fitted against 200 market observations across TV, social media and print advertising investments."
            stats={[
              { label: 'Coefficient of Determination (R²)', value: rSquaredDisplay, highlight: true },
              { label: 'Adjusted R²', value: adjRSquaredDisplay },
              { label: 'TV Pearson correlation (r)', value: tvCorr.toFixed(3) },
              { label: 'Social Media correlation (r)', value: socialCorr.toFixed(3) },
            ]}
          />
        </div>
      </section>

      {/* 2. Metric Grid & Key Evidence (Section 9) */}
      <div id="key-findings" className="section-anchor-wrap">
        <section className="metric-grid-section" aria-label="Key Evidence Metrics">
          <div className="editorial-metric-grid">
            <KpiTile
              ticker="OBSERVATIONS"
              delta="N = 200"
              value={observations}
              sub="Market-level records analyzed across all channels"
              sparkHeights={[40, 50, 60, 75, 80, 90, 100]}
            />
            <KpiTile
              ticker="MODEL FIT"
              delta="R²"
              value={rSquaredDisplay}
              sub="Observed sales variation explained by model"
              sparkHeights={[30, 45, 65, 85, 95, 98, 100]}
            />
            <KpiTile
              ticker="TV–SALES"
              delta="r"
              value={tvCorr.toFixed(3)}
              sub="Strongest bivariate linear relationship with sales"
              sparkHeights={[20, 35, 55, 75, 85, 92, 98]}
            />
            <KpiTile
              ticker="SOCIAL–SALES"
              delta="r"
              value={socialCorr.toFixed(3)}
              sub="Moderate-to-strong positive association with sales"
              sparkHeights={[15, 28, 42, 60, 72, 80, 88]}
            />
          </div>
        </section>
      </div>

      {/* KEY EVIDENCE: Correlation Chart (DESIGN.md Section 19, 27) */}
      <section className="editorial-card key-evidence-card" aria-label="Key Evidence">
        <div className="editorial-card-header">
          <div>
            <span className="editorial-section-tag font-mono">KEY EVIDENCE</span>
            <h2 className="editorial-card-title font-heading">Advertising Channel Correlation with Sales</h2>
          </div>
          <StatusPill variant="accent">Direct evidence</StatusPill>
        </div>

        <p className="editorial-card-desc">
          Pearson correlation describes pairwise linear association in the observed dataset. Correlation
          does not establish causation or counterfactual advertising return.
        </p>

        <CorrelationBarChart
          tvCorr={tvCorr}
          socialCorr={socialCorr}
          printCorr={printCorr}
        />

        <div className="editorial-card-footer">
          <span className="editorial-source-text font-mono">
            Source: Internal advertising dataset · 200 market records
          </span>
          <span className="editorial-stat-subtext font-mono">
            α = 0.05 · Two-tailed significance
          </span>
        </div>
      </section>

      {/* 4 Major Analytical Findings Cards */}
      <section aria-labelledby="key-findings-title">
        <div className="overview-group-header">
          <h3 id="key-findings-title" className="overview-group-title font-heading">Analytical Evidence Layers</h3>
          <span className="overview-group-subtitle">
            Empirical findings across advertising, regression coefficients, customer drivers, and market macro trends
          </span>
        </div>

        <div className="key-findings-grid">
          {/* Finding 01 */}
          <article className="finding-card" aria-label="Finding 01: Advertising and Sales">
            <div className="finding-header">
              <span className="finding-label font-mono">01 — Advertising & Sales</span>
              <StatusPill variant="neutral">Multiple Regression</StatusPill>
            </div>
            <h4 className="finding-title font-heading">Advertising spend is strongly associated with sales.</h4>
            <p className="finding-body">
              The multiple regression model explains 89.72% of the variation in observed sales (R² = 0.8972;
              adjusted R² = 0.8962). This indicates that the three advertising variables together capture a
              substantial share of the variation in sales in this dataset.
            </p>
            <div className="finding-metrics-bar font-mono">
              <span className="finding-metric-item">
                <span className="finding-metric-label">Model Fit:</span> R² = {rSquaredDisplay}
              </span>
              <span className="finding-metric-item">
                <span className="finding-metric-label">Adjusted:</span> {adjRSquaredDisplay}
              </span>
            </div>
          </article>

          {/* Finding 02 */}
          <article className="finding-card" aria-label="Finding 02: Channel Relationship">
            <div className="finding-header">
              <span className="finding-label font-mono">02 — Channel Comparison</span>
              <StatusPill variant="neutral">Pearson r</StatusPill>
            </div>
            <h4 className="finding-title font-heading">TV shows the strongest relationship with sales.</h4>
            <p className="finding-body">
              TV advertising has the strongest Pearson correlation with sales among the three channels
              (r = 0.782), followed by social media advertising (r = 0.576). Print advertising shows a
              substantially weaker relationship (r = 0.228).
            </p>
            <div className="finding-metrics-bar font-mono">
              <span className="finding-metric-item">
                <span className="finding-metric-label">TV:</span> r = {tvCorr.toFixed(3)}
              </span>
              <span className="finding-metric-item">
                <span className="finding-metric-label">Social:</span> r = {socialCorr.toFixed(3)}
              </span>
              <span className="finding-metric-item">
                <span className="finding-metric-label">Print:</span> r = {printCorr.toFixed(3)}
              </span>
            </div>
          </article>

          {/* Finding 03 */}
          <article className="finding-card" aria-label="Finding 03: Multivariate Model">
            <div className="finding-header">
              <span className="finding-label font-mono">03 — Multivariate Model</span>
              <StatusPill variant="neutral">Coefficients</StatusPill>
            </div>
            <h4 className="finding-title font-heading">
              Social media has a positive coefficient; the print coefficient is not statistically significant.
            </h4>
            <p className="finding-body">
              In the multiple regression model, the estimated coefficient for social media advertising is
              positive (+0.1885), while the estimated coefficient for TV is also positive (+0.0458).
              The print coefficient is close to zero (-0.0010) and is not statistically significant (p = 0.860).
            </p>
            <div className="finding-metrics-bar font-mono">
              <span className="finding-metric-item">
                <span className="finding-metric-label">Social Coeff:</span> {socialCoeffDisplay}
              </span>
              <span className="finding-metric-item">
                <span className="finding-metric-label">TV Coeff:</span> {tvCoeffDisplay}
              </span>
              <span className="finding-metric-item">
                <span className="finding-metric-label">Print Coeff:</span> {printCoeffDisplay}
              </span>
            </div>
          </article>

          {/* Finding 04 */}
          <article className="finding-card" aria-label="Finding 04: Market Context">
            <div className="finding-header">
              <span className="finding-label font-mono">04 — Market Context</span>
              <StatusPill variant="neutral">Independent Research</StatusPill>
            </div>
            <h4 className="finding-title font-heading">Market context points to a more selective growth strategy.</h4>
            <p className="finding-body">
              External research indicates broadly flat volume in several observed TWS segments,
              alongside premiumization and emerging open-ear alternatives. At the same time,
              broader affordability, trade-cost and electronics supply-chain conditions create additional
              uncertainty for the next planning period.
            </p>
            <div className="finding-metrics-bar font-mono">
              <span className="finding-metric-item">
                <span className="finding-metric-label">Scope:</span> Q3 & Q4 Research Repositories
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* Model Multivariate Evidence Table (DESIGN.md Section 21 & 22) */}
      <section className="editorial-card" id="model-evidence" aria-label="Model Regression Parameters">
        <div className="editorial-card-header">
          <div>
            <span className="editorial-section-tag font-mono">MODEL EVIDENCE</span>
            <h3 className="editorial-card-title font-heading">Multiple Regression Parameter Estimates</h3>
          </div>
          <div className="model-formula-chip font-mono">
            <code>Sales = β₀ + β₁(TV) + β₂(Social) + β₃(Print) + ε</code>
          </div>
        </div>

        <div className="table-responsive">
          <table className="editorial-table" aria-label="Regression model statistics summary">
            <thead>
              <tr>
                <th>Parameter / Variable</th>
                <th className="text-right">Estimate</th>
                <th className="text-right">Standard Error</th>
                <th className="text-right">t-statistic</th>
                <th className="text-right">p-value</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Model Intercept (β₀)</strong></td>
                <td className="text-right font-mono">4.6251</td>
                <td className="text-right font-mono">0.3075</td>
                <td className="text-right font-mono">15.041</td>
                <td className="text-right font-mono">&lt; 0.001</td>
                <td className="text-right"><StatusPill variant="accent">Significant</StatusPill></td>
              </tr>
              <tr>
                <td><strong>TV Ads (β₁)</strong></td>
                <td className="text-right font-mono font-bold">+0.0458</td>
                <td className="text-right font-mono">0.0014</td>
                <td className="text-right font-mono">32.809</td>
                <td className="text-right font-mono">&lt; 0.001</td>
                <td className="text-right"><StatusPill variant="accent">Significant</StatusPill></td>
              </tr>
              <tr>
                <td><strong>Social Media Ads (β₂)</strong></td>
                <td className="text-right font-mono font-bold">+0.1885</td>
                <td className="text-right font-mono">0.0086</td>
                <td className="text-right font-mono">21.893</td>
                <td className="text-right font-mono">&lt; 0.001</td>
                <td className="text-right"><StatusPill variant="accent">Significant</StatusPill></td>
              </tr>
              <tr>
                <td><strong>Print Ads (β₃)</strong></td>
                <td className="text-right font-mono">-0.0010</td>
                <td className="text-right font-mono">0.0059</td>
                <td className="text-right font-mono">-0.177</td>
                <td className="text-right font-mono">0.860</td>
                <td className="text-right"><StatusPill variant="warning">Not Significant</StatusPill></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="model-evidence-note">
          These coefficients describe the fitted multivariate relationship in the observed dataset.
          They should not be interpreted as causal ROI estimates.
        </p>
      </section>

      {/* CUSTOMER CONTEXT (DESIGN.md Section 27 & 30) */}
      <section className="editorial-card customer-drivers-section" id="customer-context" aria-labelledby="customer-drivers-title">
        <div className="editorial-card-header">
          <div>
            <span className="editorial-section-tag font-mono">CUSTOMER CONTEXT</span>
            <h3 id="customer-drivers-title" className="editorial-card-title font-heading">
              Recurring Purchase & Evaluation Factors
            </h3>
          </div>
          <StatusPill variant="neutral">Independent research</StatusPill>
        </div>

        <p className="customer-intro-text">
          Independent research identifies recurring considerations in wireless-audio purchase and
          product evaluation. Sound quality, battery life, comfort, value, call quality and ANC are
          among the recurring considerations identified in the reviewed research. Evidence comes
          from disparate studies and populations; these factors represent recurring themes rather
          than an artificial leaderboard or pooled customer score.
        </p>

        <div className="customer-factors-grid">
          {[
            { label: 'Sound quality', note: 'Primary sonic fidelity and driver clarity' },
            { label: 'Battery life', note: 'Playback endurance and fast-charging performance' },
            { label: 'Comfort', note: 'Ergonomic fit, clamping force, long-session wearability' },
            { label: 'Price / value', note: 'Perceived value relative to competitive price tier' },
            { label: 'Call quality', note: 'Microphone isolation and beamforming voice clarity' },
            { label: 'Active Noise Cancellation', note: 'Low-frequency attenuation and transparency mode' },
            { label: 'Ease of use', note: 'Multipoint Bluetooth pairing and intuitive touch controls' },
            { label: 'Compatibility', note: 'Device and ecosystem compatibility' },
            { label: 'Industrial Design', note: 'Build, materials and product appearance' },
          ].map((item) => (
            <div key={item.label} className="customer-factor-card">
              <span className="customer-factor-title font-heading">{item.label}</span>
              <span className="customer-factor-desc">{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET CONTEXT (DESIGN.md Section 27 & 31) */}
      <section className="editorial-card market-context-section" id="market-context" aria-labelledby="market-context-title">
        <div className="editorial-card-header">
          <div>
            <span className="editorial-section-tag font-mono">MARKET CONTEXT</span>
            <h3 id="market-context-title" className="editorial-card-title font-heading">
              External Market & Macro Environment
            </h3>
          </div>
          <StatusPill variant="neutral">Macro signals</StatusPill>
        </div>

        <div className="market-signals-grid">
          <div className="market-signal-card">
            <div className="market-signal-head">
              <span className="market-signal-label font-mono">MARKET MATURITY</span>
              <StatusPill variant="neutral" size="sm">Category Proxy</StatusPill>
            </div>
            <h4 className="market-signal-title font-heading">India TWS remained broadly flat in 2025, while Q4 recorded 12% YoY growth.</h4>
            <p className="market-signal-desc">
              Unit volume stabilized overall in 2025, while Q4 demonstrated a late-year recovery rebound.
            </p>
          </div>

          <div className="market-signal-card">
            <div className="market-signal-head">
              <span className="market-signal-label font-mono">PREMIUMIZATION</span>
              <StatusPill variant="accent" size="sm">Observed</StatusPill>
            </div>
            <h4 className="market-signal-title font-heading">Revenue +7% YoY in Q1 2026</h4>
            <p className="market-signal-desc">
              Revenue increased despite a decline in quarterly shipments, consistent with premiumization and a higher-value market mix.
            </p>
          </div>

          <div className="market-signal-card">
            <div className="market-signal-head">
              <span className="market-signal-label font-mono">FORM FACTOR</span>
              <StatusPill variant="accent" size="sm">Observed</StatusPill>
            </div>
            <h4 className="market-signal-title font-heading">Global OWS +12% YoY in Q2 2026</h4>
            <p className="market-signal-desc">
              Open-ear and alternative form factors expanding rapidly as an active lifestyle alternative.
            </p>
          </div>

          <div className="market-signal-card">
            <div className="market-signal-head">
              <span className="market-signal-label font-mono">AFFORDABILITY</span>
              <StatusPill variant="warning" size="sm">Macro Proxy</StatusPill>
            </div>
            <h4 className="market-signal-title font-heading">Smartphone shipments -13% YoY</h4>
            <p className="market-signal-desc">
              Consumer discretionary spending headwinds across entry/mid electronics require careful pricing discipline.
            </p>
          </div>

          <div className="market-signal-card">
            <div className="market-signal-head">
              <span className="market-signal-label font-mono">SUPPLY CHAIN</span>
              <StatusPill variant="warning" size="sm">Macro Trend</StatusPill>
            </div>
            <h4 className="market-signal-title font-heading">Global trade inflation 3.6% → ~5%</h4>
            <p className="market-signal-desc">
              Semiconductor input costs and logistics friction warrant cautious margin assumptions.
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC DIRECTION: Dark Analytical Panel (DESIGN.md Section 27 & 28) */}
      <section id="strategic-direction" aria-label="Strategic Direction">
        <AnalyticalDarkPanel
          badge="THE STRATEGIC DIRECTION"
          title="Maintain strong attention on TV and social media, reassess print, and validate future allocation through incremental measurement."
          statement="The evidence supports a selective allocation approach: maintain attention on TV and social media, reassess the role of print, and use incremental testing to validate future budget changes."
          stats={[
            { label: 'TV + Social Media', value: 'Maintain Strong Attention', highlight: true },
            { label: 'Print Advertising', value: 'Reconsider & Validate' },
            {
              label: 'Customer Messaging',
              value: 'Communicate Recurring Product Value',
              supportingText: 'Sound quality, battery life, comfort, value, call quality and ANC are among the recurring considerations identified in the reviewed research.',
            },
            { label: 'Execution Prerequisite', value: 'Test incrementality before scaling budget' },
          ]}
          action={
            <EditorialButton
              variant="primary"
              to="/report/strategic-direction"
              iconRight={<ArrowRight size={16} />}
            >
              View Full Strategy Model
            </EditorialButton>
          }
        />
      </section>

      {/* METHODOLOGY & LIMITATIONS */}
      <MethodologyBox
        tag="Methodological Boundary"
        methodTitle="Observational Data Limitations"
        explanation="This report synthesizes empirical evidence from 200 market-level records alongside secondary research repositories. Linear correlation and regression quantify relationships in historical observational data; they do not prove counterfactual causality or guarantee future advertising ROI. All strategic decisions should incorporate controlled incremental experimentation."
        source="Internal advertising dataset & research repositories"
        limitation="Observational data associations do not prove counterfactual intervention effects."
      />
    </div>
  );
}

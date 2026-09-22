import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Layers,
  Database,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';
import { fetchStrategyData } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { StatusBadge } from '../../components/badges/StatusBadge';
import { EvidenceToStrategyFlow } from './EvidenceToStrategyFlow';
import { StrategyDecisionLogicTable } from './StrategyDecisionLogicTable';
import { ChannelDecisionMatrix } from './ChannelDecisionMatrix';
import { MessagingPillarsGrid } from './MessagingPillarsGrid';
import { RiskRegisterTable } from './RiskRegisterTable';
import { StrategicTradeoffsTable } from './StrategicTradeoffsTable';
import { DecisionFrameworkFlow } from './DecisionFrameworkFlow';
import './StrategyDecisionView.css';

/**
 * Section 07: Strategy Decision (Question 5)
 * Synthesizes Q1 + Q2 advertising evidence, Q3 customer needs, and Q4 market context
 * into an evidence-based, transparent strategic decision framework for management.
 */
export function StrategyDecisionView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const validLenses = ['all', 'advertising', 'customer', 'market'];
  const lensParam = searchParams.get('lens')?.toLowerCase();
  const [activeLens, setActiveLens] = useState(
    validLenses.includes(lensParam) ? lensParam : 'all'
  );

  const handleSelectLens = (lens) => {
    setActiveLens(lens);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (lens === 'all') {
          next.delete('lens');
        } else {
          next.set('lens', lens);
        }
        return next;
      },
      { replace: true }
    );
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchStrategyData();
      setData(res);
    } catch (err) {
      console.error('Failed to load strategy decision data:', err);
      setError(err.message || 'Please check the analytical data service and try again.');
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
        title="Loading strategy decision model..."
        subtext="Synthesizing advertising attribution, customer research, and market intelligence"
        skeletonLines={6}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Strategy decision model could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Strategy Service"
      />
    );
  }

  const { strategyData, customerData, marketData, sourcesData } = data;
  const { advertising_evidence, channel_evidence } = strategyData;

  const tvStats = channel_evidence.find((c) => c.channel === 'TV' || c.variable === 'tv_ads');
  const socialStats = channel_evidence.find((c) => c.channel === 'Social Media' || c.variable === 'social_media_ads');
  const printStats = channel_evidence.find((c) => c.channel === 'Print' || c.variable === 'print_ads');

  const rSquaredFormatted = advertising_evidence?.r_squared
    ? `${(advertising_evidence.r_squared * 100).toFixed(2)}%`
    : '89.72%';

  const lensConfig = {
    all: {
      id: 'all',
      title: 'Integrated Strategy Synthesis',
      kicker: 'Cross-Domain Evidence',
      badge: 'Full Evidence Base',
      badgeVariant: 'info',
      summary: 'Synthesizes empirical advertising regression (R² = 89.72%), 57 customer research observations, and 38 macroeconomic and category signals into a cohesive, test-oriented market strategy.',
      keyTakeaway: 'Prioritize TV and social media in advertising testing, anchor messaging in sound quality and battery life, and navigate India premiumization and affordability pressures with disciplined unit pricing.',
    },
    advertising: {
      id: 'advertising',
      title: 'Advertising Attribution Evidence Lens',
      kicker: 'Q1 & Q2 Econometric Analysis',
      badge: 'Econometric Evidence',
      badgeVariant: 'positive',
      summary: 'Evaluates the 200 observed market observations and multivariate regression model (R² = 89.72%, Adj R² = 89.62%). TV advertising demonstrates the strongest bivariate relationship (r = 0.782) and positive coefficient (β = +0.0468, p < 0.0001). Social media also exhibits significant positive attribution (β = +0.1885, p < 0.0001). Print advertising displays a weak correlation (r = 0.228) and an insignificant coefficient (β = -0.0010, p = 0.8599).',
      keyTakeaway: 'Reallocate testing attention away from print towards controlled TV and social media campaigns. Retain the principle that regression coefficients describe historical association, not guaranteed incremental revenue.',
    },
    customer: {
      id: 'customer',
      title: 'Customer Purchase Drivers Lens',
      kicker: 'Q3 Research Synthesis',
      badge: '57 Research Observations',
      badgeVariant: 'info',
      summary: 'Draws upon 57 distinct evidence observations from 10 independent research sources. Identifies sound quality, battery life, comfort, price/value, voice call quality, and active noise cancellation as the recurring customer priorities in wireless audio.',
      keyTakeaway: 'Anchor advertising creative and product communication directly in verified core needs (sound quality and battery reliability) rather than unsubstantiated claims or isolated aesthetic traits.',
    },
    market: {
      id: 'market',
      title: 'Market & Macroeconomic Conditions Lens',
      kicker: 'Q4 Category & Macro Context',
      badge: '38 External Signals',
      badgeVariant: 'warning',
      summary: 'Synthesizes 38 category signals across India TWS maturity (flat full-year 2025, +12% YoY Q4), premiumization (+7% value growth despite shipment moderation), emerging open-ear formats (+12% global OWS), and adjacent consumer affordability headwinds (-13% smartphone proxy).',
      keyTakeaway: 'Exercise pricing caution given discretionary pressure in consumer electronics; maintain competitive positioning in premium TWS while establishing a technology watch for open-ear form factors.',
    },
  };
  const activeLensCfg = lensConfig[activeLens] || lensConfig.all;

  return (
    <div className="strategy-decision-view" role="article" aria-label="Strategy Decision Model">
      {/* Q5 Question Banner */}
      <section id="framework" className="sd-question-banner" aria-label="Q5 Strategy Question">
        <h2 className="sd-question-title font-heading">
          Q5 — What marketing and advertising strategy should NEXA One consider for the next planning period?
        </h2>
      </section>

      {/* Evidence Lens Control */}
      <section className="sd-evidence-lens-section" aria-labelledby="evidence-lens-heading">
        <div className="sd-lens-header">
          <div>
            <span className="sd-lens-kicker">Analytical Interaction</span>
            <h3 id="evidence-lens-heading" className="sd-lens-title">
              Evidence Lens
            </h3>
            <p className="sd-lens-subtitle">
              Inspect the strategy through specific underlying evidence foundations without simulation artifacts.
            </p>
          </div>

          <div className="sd-lens-btn-group" role="radiogroup" aria-label="Strategy Evidence Lens">
            {[
              { id: 'all', label: 'All Evidence' },
              { id: 'advertising', label: 'Advertising Evidence' },
              { id: 'customer', label: 'Customer Evidence' },
              { id: 'market', label: 'Market Evidence' },
            ].map((lens) => (
              <button
                key={lens.id}
                type="button"
                role="radio"
                aria-checked={activeLens === lens.id}
                className={`sd-lens-pill ${activeLens === lens.id ? 'is-active' : ''}`}
                onClick={() => handleSelectLens(lens.id)}
              >
                {lens.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sd-lens-content-card">
          <div className="sd-lens-card-top">
            <span className="sd-lens-domain-kicker">{activeLensCfg.kicker}</span>
            <div className="sd-lens-title-row">
              <h4 className="sd-lens-card-title">{activeLensCfg.title}</h4>
              <StatusBadge variant={activeLensCfg.badgeVariant} size="small">
                {activeLensCfg.badge}
              </StatusBadge>
            </div>
          </div>

          <p className="sd-lens-card-summary">
            {activeLensCfg.summary}
          </p>

          <div className="sd-lens-card-takeaway">
            <strong>Strategic Focus:</strong> {activeLensCfg.keyTakeaway}
          </div>
        </div>
      </section>

      {/* 02: SECTION 1 — From Evidence to Strategy */}
      <EvidenceToStrategyFlow
        rSquared={rSquaredFormatted}
        customerObsCount={customerData?.total_evidence_records || 57}
        marketObsCount={marketData?.total_evidence_records || 38}
      />

      {/* 03: SECTION 2 — Strategic Decision Logic */}
      <div id="decision-logic">
        <StrategyDecisionLogicTable />

        {/* 04: SECTION 3 — Channel Decision Matrix */}
        <ChannelDecisionMatrix
          tvStats={tvStats}
          socialStats={socialStats}
          printStats={printStats}
        />
      </div>

      {/* 05: SECTION 4 — What Should NEXA Do? (Primary Card) */}
      <section className="sd-primary-recommendation-card" aria-labelledby="primary-rec-title">
        <div className="sd-primary-badge-row">
          <span className="sd-core-strategy-badge">Central Strategy Direction</span>
        </div>
        <h2 id="primary-rec-title" className="sd-primary-title">
          Concentrate attention on the channels with stronger statistical evidence, while reassessing print and validating incremental performance.
        </h2>
        <p className="sd-primary-body">
          The available evidence supports maintaining strong attention on TV and social media while
          reconsidering the role of print. TV has the strongest observed relationship with sales, while social
          media also shows a meaningful positive relationship. Print has a weaker observed relationship and a
          non-significant multivariate coefficient. However, the dataset does not provide causal ROI or
          channel-level cost information, so the next planning period should use controlled testing and
          incremental-performance measurement before making major budget changes.
        </p>
        <div className="sd-budget-warning-banner">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>Analytical Boundary:</strong> Exact budget allocation is not determined by the current
            analysis. The evidence supports channel prioritization for further testing, not a fixed percentage
            allocation.
          </span>
        </div>
      </section>

      {/* 06: SECTION 5 & 6 — Where Attention Should Increase & Which Reconsidered */}
      <div className="sd-channel-focus-grid">
        {/* TV Card */}
        <article className="sd-focus-card attention" aria-labelledby="focus-tv-title">
          <div className="sd-focus-card-header">
            <span className="sd-focus-pill attention">Maintain Strong Attention</span>
            <span className="sd-focus-channel font-heading">TV Advertising</span>
          </div>
          <p className="sd-focus-card-body">
            TV has the strongest observed correlation with sales among the three channels (r = 0.7822) and a
            positive coefficient in the multivariate model. This provides a strong statistical basis for
            maintaining attention to the channel, but does not by itself establish incremental ROI.
          </p>
          <div className="sd-focus-card-metrics font-mono">
            <span>Pearson r = 0.7822</span>
            <span>β ≈ +0.04576</span>
          </div>
        </article>

        {/* Social Media Card */}
        <article className="sd-focus-card attention" aria-labelledby="focus-social-title">
          <div className="sd-focus-card-header">
            <span className="sd-focus-pill attention">Maintain Strong Attention</span>
            <span className="sd-focus-channel font-heading">Social Media Advertising</span>
          </div>
          <p className="sd-focus-card-body">
            Social media shows a meaningful positive relationship with sales (r = 0.5762) and a positive
            coefficient in the multivariate model. Its role should therefore remain significant in planning, with
            incremental performance measured through controlled testing.
          </p>
          <div className="sd-focus-card-metrics font-mono">
            <span>Pearson r = 0.5762</span>
            <span>β ≈ +0.18853</span>
          </div>
        </article>

        {/* Print Card */}
        <article className="sd-focus-card reconsider" aria-labelledby="focus-print-title">
          <div className="sd-focus-card-header">
            <span className="sd-focus-pill reconsider">Reconsider and Validate</span>
            <span className="sd-focus-channel font-heading">Print Advertising</span>
          </div>
          <p className="sd-focus-card-body">
            Print has a weaker observed relationship with sales (r = 0.2283), and its coefficient is not
            statistically significant in the multivariate model. This does not prove that print has zero business
            value, but it means the current dataset does not provide strong independent statistical evidence for
            its contribution to sales.
          </p>
          <div className="sd-reconsider-decision-box">
            Require evidence of incremental value before maintaining or expanding print investment.
          </div>
          <p className="sd-reconsider-note">
            <em>Supporting note:</em> Print may still serve purposes not captured by the available sales model,
            such as local reach, brand visibility or specific audience access. These effects were not measured in
            the current dataset.
          </p>
        </article>
      </div>

      {/* 07: SECTION 7 — Messaging Priorities */}
      <MessagingPillarsGrid />

      {/* 08: SECTION 8 — Strategic Positioning Direction */}
      <section id="positioning" className="sd-positioning-section" aria-labelledby="positioning-heading">
        <h2 id="positioning-heading" className="sd-positioning-title">
          Strategic Positioning Direction
        </h2>
        <div className="sd-positioning-card">
          <p className="sd-positioning-quote">
            NEXA One should communicate a complete product experience rather than relying on a single feature
            claim. The customer research supports emphasizing sound quality, battery life, comfort, value, call
            quality, ANC and ease of use as connected elements of the product experience.
          </p>
          <p className="sd-positioning-subtext">
            Premiumization evidence also suggests that product value may increasingly be communicated through the
            combination of features and experience rather than price alone. However, NEXA-specific willingness to
            pay is not directly measured.
          </p>
        </div>
      </section>

      {/* 09: SECTION 9 — Market Conditions to Watch */}
      <section id="market-watch" className="sd-market-watch-section" aria-labelledby="market-watch-heading">
        <h2 id="market-watch-heading" className="sd-market-watch-title">
          Market Conditions to Watch
        </h2>
        <div className="sd-market-watch-grid">
          {/* CARD 1: Category Maturity */}
          <div className="sd-mw-card">
            <h3 className="sd-mw-title">Category Maturity</h3>
            <p className="sd-mw-text">
              India's TWS market was broadly flat in 2025, although Q4 recorded 12% YoY growth.
            </p>
            <div className="sd-mw-imp">
              <strong>Implication:</strong> Growth may require differentiated value and effective execution
              rather than assuming category-wide expansion.
            </div>
          </div>

          {/* CARD 2: Premiumization */}
          <div className="sd-mw-card">
            <h3 className="sd-mw-title">Premiumization</h3>
            <p className="sd-mw-text">
              India TWS revenue increased 7% YoY in Q1 2026 while quarterly shipments declined.
            </p>
            <div className="sd-mw-imp">
              <strong>Implication:</strong> Value and feature differentiation should be considered alongside volume
              growth.
            </div>
          </div>

          {/* CARD 3: Form-Factor Competition */}
          <div className="sd-mw-card">
            <h3 className="sd-mw-title">Form-Factor Competition</h3>
            <p className="sd-mw-text">
              Global OWS shipments increased 12% YoY in Q2 2026 while global TWS shipments were broadly flat.
            </p>
            <div className="sd-mw-imp">
              <strong>Implication:</strong> Management should monitor emerging open-ear alternatives and changing
              product formats.
            </div>
          </div>

          {/* CARD 4: Affordability & Supply Chain */}
          <div className="sd-mw-card">
            <h3 className="sd-mw-title">Affordability & Supply Chain</h3>
            <p className="sd-mw-text">
              Adjacent consumer-electronics evidence indicates affordability pressure, while global trade and
              component conditions remain relevant to cost and operational planning.
            </p>
            <div className="sd-mw-imp">
              <strong>Implication:</strong> Monitor price sensitivity, component costs, availability and
              supply-chain conditions.
            </div>
          </div>
        </div>
      </section>

      {/* 10: SECTION 10 — Strategic Risks */}
      <div id="risk-register">
        <RiskRegisterTable />
      </div>

      {/* 11: SECTION 11 — Key Assumptions & Limitations */}
      <section id="limitations" className="sd-assumptions-section" aria-labelledby="assumptions-heading">
        <h2 id="assumptions-heading" className="sd-assumptions-title">
          Key Assumptions & Analytical Boundaries
        </h2>
        <p className="sd-assumptions-lead">
          The strategy decision is conditioned on the following analytical and methodological premises:
        </p>

        <ol className="sd-assumptions-list">
          <li>
            The historical advertising-sales relationships are informative for planning, but they are not
            interpreted as causal effects.
          </li>
          <li>
            The observed dataset is sufficiently representative of the planning context to provide useful
            directional evidence.
          </li>
          <li>
            Channel costs, margins and incremental ROI are not available and therefore are not used to calculate
            an optimal budget allocation.
          </li>
          <li>
            Customer research is treated as contextual evidence rather than a direct measurement of NEXA One
            customers.
          </li>
          <li>
            External market indicators are used according to their category, geography and measurement context.
          </li>
          <li>
            Forecasts from external sources are treated as forecasts and are not presented as observed outcomes.
          </li>
          <li>
            No NEXA-specific market share, demand forecast, price elasticity or supply-chain cost estimate is
            inferred from external evidence.
          </li>
        </ol>
      </section>

      {/* 12 & 13: SECTION 12 & 13 — Decision Framework & Testing */}
      <DecisionFrameworkFlow />

      {/* 14: SECTION 14 — Q5 Strategy Summary */}
      <section className="sd-summary-section" aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sd-summary-title">
          Q5 Strategy Summary
        </h2>
        <div className="sd-summary-card">
          <p className="sd-summary-lead">
            NEXA One should maintain strong attention on TV and social media, reconsider the role of print, and
            strengthen product-centered messaging around recurring customer needs. The strategy should be
            executed with controlled testing because the available advertising dataset identifies statistical
            relationships rather than causal ROI. At the same time, management should monitor category maturity,
            premiumization, emerging open-ear alternatives, affordability conditions and supply-chain dynamics.
          </p>

          <div className="sd-summary-pillars-grid">
            <div className="sd-summary-pill-item">
              <span className="sd-pill-cat">CHANNEL</span>
              <h3 className="sd-pill-focus">TV + Social Media</h3>
              <p className="sd-pill-action">Maintain strong attention</p>
            </div>

            <div className="sd-summary-pill-item">
              <span className="sd-pill-cat">CHANNEL</span>
              <h3 className="sd-pill-focus">Print</h3>
              <p className="sd-pill-action">Reconsider and validate</p>
            </div>

            <div className="sd-summary-pill-item">
              <span className="sd-pill-cat">MESSAGING</span>
              <h3 className="sd-pill-focus">Customer Benefits</h3>
              <p className="sd-pill-action">Emphasize product experience and value</p>
            </div>

            <div className="sd-summary-pill-item">
              <span className="sd-pill-cat">EXECUTION</span>
              <h3 className="sd-pill-focus">Measurement</h3>
              <p className="sd-pill-action">Test before major allocation changes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15 & 16: SECTION 15 & 16 — Supports vs Does Not Establish */}
      <div className="sd-support-boundary-grid">
        {/* Supports */}
        <section className="sd-support-card" aria-labelledby="supports-heading">
          <div className="sd-support-header">
            <CheckCircle2 size={20} className="sd-support-icon" aria-hidden="true" />
            <h3 id="supports-heading" className="sd-support-title">What the Evidence Supports</h3>
          </div>
          <ul className="sd-checklist positive">
            <li>Maintaining strong attention on TV and social media.</li>
            <li>Reconsidering the role of print.</li>
            <li>Using customer research to shape product-benefit messaging.</li>
            <li>Considering premiumization and emerging form factors in market planning.</li>
            <li>Monitoring affordability and supply-chain conditions.</li>
            <li>Using controlled testing to validate future allocation decisions.</li>
          </ul>
        </section>

        {/* Does Not Establish */}
        <section className="sd-boundary-card" aria-labelledby="boundary-heading">
          <div className="sd-boundary-header">
            <XCircle size={20} className="sd-boundary-icon" aria-hidden="true" />
            <h3 id="boundary-heading" className="sd-boundary-title">What the Evidence Does Not Establish</h3>
          </div>
          <ul className="sd-checklist negative">
            <li>Exact optimal advertising budget allocation.</li>
            <li>Causal advertising ROI by channel.</li>
            <li>That print has zero business value.</li>
            <li>NEXA-specific customer preference percentages.</li>
            <li>NEXA-specific market share.</li>
            <li>NEXA-specific price elasticity.</li>
            <li>NEXA-specific supply-chain cost forecasts.</li>
            <li>That external market forecasts will occur exactly as projected.</li>
          </ul>
        </section>
      </div>

      {/* 17: SECTION 17 — Strategic Trade-Offs */}
      <div id="tradeoffs">
        <StrategicTradeoffsTable />
      </div>

      {/* 18: SECTION 18 — Source Traceability */}
      <section className="sd-sources-section" aria-labelledby="sources-heading">
        <div className="sd-sources-header">
          <Database size={20} className="sd-sources-icon" aria-hidden="true" />
          <div>
            <h2 id="sources-heading" className="sd-sources-title">
              Evidence Source Traceability
            </h2>
            <p className="sd-sources-subtitle">
              Every strategic recommendation traces directly to internal statistical analysis and approved
              external research.
            </p>
          </div>
        </div>

        <div className="sd-sources-table-wrapper">
          <table className="sd-sources-table">
            <thead>
              <tr>
                <th scope="col">Domain</th>
                <th scope="col">Source Name / Authority</th>
                <th scope="col" className="text-center">Year</th>
                <th scope="col">Strategic Contribution</th>
              </tr>
            </thead>
            <tbody>
              {sourcesData?.sources?.map((s, idx) => (
                <tr key={`strat-src-${idx}`}>
                  <th scope="row" className="sd-source-domain-cell">
                    <span className="sd-domain-tag">{s.dataset_domain}</span>
                  </th>
                  <td className="sd-source-name-cell">
                    <strong>{s.source_name}</strong>
                    <span className="sd-source-publisher">{s.publisher}</span>
                  </td>
                  <td className="text-center font-mono">{s.publication_year || 'N/A'}</td>
                  <td className="sd-source-contrib-cell">{s.what_it_contributes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

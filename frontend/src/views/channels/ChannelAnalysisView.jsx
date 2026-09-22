import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchChannelAnalysis } from '../../services/api';
import { ScatterPlot } from '../advertising/ScatterPlot';
import { CorrelationBarChart } from '../overview/CorrelationBarChart';
import { CoefficientBarChart } from './CoefficientBarChart';
import {
  DataTable,
  ChartCard,
  Callout,
  WarningBox,
  MethodologyBox,
  StatusBadge,
  SourceCitation,
  LoadingState,
  ErrorState,
} from '../../components';
import './ChannelAnalysisView.css';

export function ChannelAnalysisView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const validChannels = ['tv', 'social', 'print'];
  const channelParam = searchParams.get('channel')?.toLowerCase();
  const [selectedChannel, setSelectedChannel] = useState(
    validChannels.includes(channelParam) ? channelParam : 'tv'
  );

  const handleSelectChannel = (chId) => {
    setSelectedChannel(chId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('channel', chId);
        return next;
      },
      { replace: true }
    );
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchChannelAnalysis();
      setData(result);
    } catch (err) {
      console.error('Failed to load channel analysis:', err);
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
        title="Loading channel analysis..."
        subtext="Retrieving comparative channel metrics and multivariate estimates"
        skeletonLines={5}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Channel analysis could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Analysis"
      />
    );
  }

  const { channelData, advertising, regression } = data;

  const tvData = channelData.channels.find((c) => c.channel_name === 'TV' || c.variable_name === 'tv_ads');
  const socialData = channelData.channels.find((c) => c.channel_name === 'Social Media' || c.variable_name === 'social_media_ads');
  const printData = channelData.channels.find((c) => c.channel_name === 'Print' || c.variable_name === 'print_ads');

  const channelDetails = {
    tv: {
      id: 'tv',
      name: 'TV Ads',
      xKey: 'tv_ads',
      xLabel: 'TV Advertising spend ($000s)',
      colorVar: 'var(--color-primary)',
      pearsonR: tvData.sales_correlation.toFixed(4),
      regCoeff: `+${tvData.regression_coefficient.toFixed(4)}`,
      pVal: tvData.p_value < 0.0001 ? '< 0.0001' : tvData.p_value.toFixed(4),
      ci: `[${tvData.ci_lower.toFixed(4)}, ${tvData.ci_upper.toFixed(4)}]`,
      significance: 'Statistically Significant at α = 0.05',
      isSignificant: true,
      interpretation: 'TV advertising demonstrates the strongest bivariate association with sales (r = 0.7822) and retains a statistically significant positive multivariate coefficient (+0.0468) when accounting for other channels.',
    },
    social: {
      id: 'social',
      name: 'Social Media Ads',
      xKey: 'social_media_ads',
      xLabel: 'Social Media Advertising spend ($000s)',
      colorVar: 'var(--color-info)',
      pearsonR: socialData.sales_correlation.toFixed(4),
      regCoeff: `+${socialData.regression_coefficient.toFixed(4)}`,
      pVal: socialData.p_value < 0.0001 ? '< 0.0001' : socialData.p_value.toFixed(4),
      ci: `[${socialData.ci_lower.toFixed(4)}, ${socialData.ci_upper.toFixed(4)}]`,
      significance: 'Statistically Significant at α = 0.05',
      isSignificant: true,
      interpretation: 'Social media advertising exhibits a moderate positive bivariate association (r = 0.5762) and a significant positive multivariate coefficient (+0.1885) when holding other advertising spend constant.',
    },
    print: {
      id: 'print',
      name: 'Print Ads',
      xKey: 'print_ads',
      xLabel: 'Print Advertising spend ($000s)',
      colorVar: 'var(--color-secondary)',
      pearsonR: printData.sales_correlation.toFixed(4),
      regCoeff: printData.regression_coefficient.toFixed(4),
      pVal: printData.p_value.toFixed(4),
      ci: `[${printData.ci_lower.toFixed(4)}, ${printData.ci_upper.toFixed(4)}]`,
      significance: 'Not Statistically Significant at α = 0.05',
      isSignificant: false,
      interpretation: 'Print advertising shows a substantially weaker bivariate correlation (r = 0.2283). In the multivariate regression, its coefficient (-0.0010, p = 0.8599) cannot be distinguished from zero.',
    },
  };
  const activeChannelDetail = channelDetails[selectedChannel] || channelDetails.tv;

  // Channel Comparison Table configuration
  const comparisonColumns = [
    { key: 'channel', label: 'Channel', align: 'left' },
    { key: 'pearsonR', label: 'Pearson r', align: 'right' },
    { key: 'regCoeff', label: 'Regression Coeff (β)', align: 'right' },
    { key: 'pVal', label: 'p-Value', align: 'right' },
    { key: 'ci', label: '95% CI', align: 'right' },
    { key: 'significance', label: 'Significance (α = 0.05)', align: 'center', render: (val, row) => (
      <StatusBadge variant={row.isSignificant ? 'positive' : 'warning'}>
        {val}
      </StatusBadge>
    )},
    { key: 'interpretation', label: 'Interpretation', align: 'left' },
  ];

  const comparisonRows = [
    {
      id: 'tv',
      channel: 'TV Ads',
      pearsonR: tvData.sales_correlation.toFixed(3),
      regCoeff: `+${tvData.regression_coefficient.toFixed(4)}`,
      pVal: tvData.p_value < 0.0001 ? '< 0.0001' : tvData.p_value.toFixed(4),
      ci: `[${tvData.ci_lower.toFixed(4)}, ${tvData.ci_upper.toFixed(4)}]`,
      significance: 'Significant at α = 0.05',
      isSignificant: true,
      interpretation: 'Strong bivariate relationship; positive multivariate coefficient',
    },
    {
      id: 'social',
      channel: 'Social Media Ads',
      pearsonR: socialData.sales_correlation.toFixed(3),
      regCoeff: `+${socialData.regression_coefficient.toFixed(4)}`,
      pVal: socialData.p_value < 0.0001 ? '< 0.0001' : socialData.p_value.toFixed(4),
      ci: `[${socialData.ci_lower.toFixed(4)}, ${socialData.ci_upper.toFixed(4)}]`,
      significance: 'Significant at α = 0.05',
      isSignificant: true,
      interpretation: 'Moderate positive bivariate relationship; positive multivariate coefficient',
    },
    {
      id: 'print',
      channel: 'Print Ads',
      pearsonR: printData.sales_correlation.toFixed(3),
      regCoeff: printData.regression_coefficient.toFixed(4),
      pVal: printData.p_value.toFixed(4),
      ci: `[${printData.ci_lower.toFixed(4)}, ${printData.ci_upper.toFixed(4)}]`,
      significance: 'Not significant at α = 0.05',
      isSignificant: false,
      interpretation: 'Weaker bivariate relationship; coefficient not distinguishable from zero',
    },
  ];

  // Evidence Matrix configuration
  const matrixColumns = [
    { key: 'channel', label: 'Channel', align: 'left' },
    { key: 'observed', label: 'Observed Relationship', align: 'left' },
    { key: 'multivariate', label: 'Multivariate Coefficient', align: 'left' },
    { key: 'significance', label: 'Statistical Significance', align: 'left' },
    { key: 'strength', label: 'Evidence Strength', align: 'left' },
    { key: 'business', label: 'Business Interpretation', align: 'left' },
  ];

  const matrixRows = [
    {
      id: 'matrix-tv',
      channel: 'TV Ads',
      observed: `Strongest Pearson correlation with sales (r = ${tvData.sales_correlation.toFixed(3)})`,
      multivariate: `Positive regression coefficient (+${tvData.regression_coefficient.toFixed(4)})`,
      significance: 'Statistically significant at α = 0.05 (p < 0.0001)',
      strength: 'Strong bivariate relationship',
      business: 'Strongest bivariate relationship with observed sales; multivariate relationship positive after accounting for other channels.',
    },
    {
      id: 'matrix-social',
      channel: 'Social Media Ads',
      observed: `Positive Pearson correlation with sales (r = ${socialData.sales_correlation.toFixed(3)})`,
      multivariate: `Positive regression coefficient (+${socialData.regression_coefficient.toFixed(4)})`,
      significance: 'Statistically significant at α = 0.05 (p < 0.0001)',
      strength: 'Moderate positive bivariate relationship',
      business: 'Positive relationship with observed sales; provides additional multivariate explanatory evidence.',
    },
    {
      id: 'matrix-print',
      channel: 'Print Ads',
      observed: `Substantially weaker correlation with sales (r = ${printData.sales_correlation.toFixed(3)})`,
      multivariate: `Regression coefficient close to zero (${printData.regression_coefficient.toFixed(4)})`,
      significance: 'Not statistically significant at α = 0.05 (p = 0.8599)',
      strength: 'Weaker bivariate relationship',
      business: 'Weaker bivariate relationship and non-significant coefficient in multivariate model; limited evidence for a distinct sales relationship.',
    },
  ];

  return (
    <div className="channel-analysis-container">
      {/* 02. Q2 Business Question & Opening Statement */}
      <section className="analytical-question-banner" id="channel-evidence" aria-label="Q2 Business Question">
        <h2 className="question-heading">
          Q2 — How do TV, social media and print compare in explaining sales?
        </h2>
        <p className="opening-analytical-statement">
          The three advertising channels show materially different relationships with observed sales.
          TV has the strongest bivariate relationship, social media also shows a positive relationship,
          and print has a substantially weaker relationship. When the channels are evaluated simultaneously
          in the multivariate regression, the interpretation becomes more nuanced: the coefficient
          estimates reflect each channel's fitted relationship after accounting for the other included
          channels.
        </p>
      </section>

      {/* 03. Channel Comparison Framework */}
      <section className="comparison-framework-card" aria-labelledby="framework-heading">
        <h4 id="framework-heading" className="framework-heading">How the channels are compared</h4>

        <div className="framework-steps-grid">
          <div className="framework-step-item">
            <span className="step-number">01</span>
            <span className="step-label">Observed relationship</span>
          </div>
          <div className="framework-step-item">
            <span className="step-number">02</span>
            <span className="step-label">Multivariate relationship</span>
          </div>
          <div className="framework-step-item">
            <span className="step-number">03</span>
            <span className="step-label">Statistical significance</span>
          </div>
          <div className="framework-step-item">
            <span className="step-number">04</span>
            <span className="step-label">Business interpretation</span>
          </div>
        </div>

        <p className="framework-explanation">
          No single statistic is used to determine the channel interpretation. Correlation shows the
          pairwise relationship with sales. Regression coefficients describe the fitted relationship
          when all three channels are considered simultaneously. Statistical significance indicates
          whether an estimated coefficient is distinguishable from zero under the model assumptions.
          Business interpretation then considers the evidence alongside its limitations.
        </p>
      </section>

      {/* 04. Channel Comparison Table & Interactive Channel Evidence Explorer */}
      <section id="comparison" aria-labelledby="comparison-table-heading">
        <div className="overview-group-header">
          <h3 id="comparison-table-heading" className="overview-group-title">Channel Comparison Summary</h3>
          <SourceCitation sourceName="Internal correlation and regression analysis" />
        </div>

        <p className="subsection-lead-text" style={{ marginBottom: 'var(--space-4)' }}>
          Click any channel row in the comparison table or use the controls below to synchronize the interactive evidence explorer.
        </p>

        <DataTable
          title="Statistical Lens Comparison Across Channels"
          subtitle="Click a row to select that channel in the synchronized evidence explorer below"
          columns={comparisonColumns}
          data={comparisonRows}
          onRowClick={(row) => handleSelectChannel(row.id)}
          highlightRow={(row) => row.id === selectedChannel}
          sourceNote="Evaluated at standard decision threshold α = 0.05. Source: Internal regression & correlation datasets"
        />

        {/* Channel Evidence Explorer */}
        <div className="channel-evidence-explorer-panel" role="region" aria-label="Channel Evidence Explorer">
          <div className="channel-explorer-header">
            <div>
              <span className="channel-exp-kicker">Interactive Evidence Exploration</span>
              <h4 className="channel-exp-title">Channel Evidence Explorer</h4>
            </div>

            <div className="channel-control-group" role="radiogroup" aria-label="Select Channel">
              <span className="channel-control-lbl">Channel:</span>
              <div className="channel-pills">
                {[
                  { id: 'tv', label: 'TV Ads' },
                  { id: 'social', label: 'Social Media Ads' },
                  { id: 'print', label: 'Print Ads' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedChannel === c.id}
                    className={`channel-exp-pill ${selectedChannel === c.id ? 'is-active' : ''}`}
                    onClick={() => handleSelectChannel(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="channel-explorer-body">
            <div className="channel-exp-stats-col">
              <div className="channel-exp-name-row">
                <span className="channel-exp-name">{activeChannelDetail.name}</span>
                <StatusBadge variant={activeChannelDetail.isSignificant ? 'positive' : 'warning'}>
                  {activeChannelDetail.significance}
                </StatusBadge>
              </div>

              <div className="channel-exp-quad-grid">
                <div className="channel-exp-metric-card">
                  <span className="exp-card-lbl">Pearson correlation (r)</span>
                  <span className="exp-card-val font-mono">{activeChannelDetail.pearsonR}</span>
                </div>
                <div className="channel-exp-metric-card">
                  <span className="exp-card-lbl">Regression coefficient (β)</span>
                  <span className="exp-card-val font-mono">{activeChannelDetail.regCoeff}</span>
                </div>
                <div className="channel-exp-metric-card">
                  <span className="exp-card-lbl">p-value</span>
                  <span className="exp-card-val font-mono">{activeChannelDetail.pVal}</span>
                </div>
                <div className="channel-exp-metric-card">
                  <span className="exp-card-lbl">95% Confidence Interval</span>
                  <span className="exp-card-val font-mono">{activeChannelDetail.ci}</span>
                </div>
              </div>

              <p className="channel-exp-interpretation">
                {activeChannelDetail.interpretation}
              </p>

              <div className="channel-exp-safeguard">
                <strong>Descriptive Evidence Principle:</strong> All statistics are derived from empirical models. No subjective scoring or ranking is assigned.
              </div>
            </div>

            <div className="channel-exp-chart-col">
              <ScatterPlot
                title={`${activeChannelDetail.name} vs Observed Sales`}
                data={advertising.observations}
                xKey={activeChannelDetail.xKey}
                yKey="sales"
                xLabel={activeChannelDetail.xLabel}
                yLabel="Sales (000 units)"
                colorVar={activeChannelDetail.colorVar}
                fitLineLabel="Linear fit"
                enablePointSelection={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 05. Observed Relationship & Correlation Visual */}
      <section id="correlation" aria-labelledby="observed-relationship-heading">
        <div className="overview-group-header">
          <h3 id="observed-relationship-heading" className="overview-group-title">1. Observed Relationship</h3>
          <SourceCitation sourceName="Internal advertising dataset — 200 observations" />
        </div>

        <p className="subsection-lead-text">
          At the bivariate level, TV advertising has the strongest Pearson correlation with sales
          (r = 0.782), followed by social media advertising (r = 0.576). Print advertising has a
          substantially weaker correlation with sales (r = 0.228).
        </p>
        <p className="subsection-lead-text" style={{ fontStyle: 'italic', marginTop: 'var(--space-2)' }}>
          This comparison describes the relationship between each channel and sales separately. It does
          not account for the other advertising channels.
        </p>

        <div style={{ margin: 'var(--space-4) 0' }}>
          <ChartCard
            title="Observed Relationship with Sales"
            description="Pearson correlation with observed sales. Correlation does not establish causation."
            source="Source: Internal correlation analysis"
            methodologyNote="Bivariate Pearson correlation coefficient (r)"
            minHeight={220}
          >
            <CorrelationBarChart
              tvCorr={tvData.sales_correlation}
              socialCorr={socialData.sales_correlation}
              printCorr={printData.sales_correlation}
            />
          </ChartCard>
        </div>
      </section>

      {/* 06. Channel Scatterplots */}
      <section aria-labelledby="channel-scatter-heading">
        <div className="overview-group-header">
          <h3 id="channel-scatter-heading" className="overview-group-title">Channel Scatterplots</h3>
          <SourceCitation sourceName="Internal advertising dataset — 200 observations" />
        </div>

        <div className="scatter-grid-2col">
          {/* TV vs Sales */}
          <div className="scatter-item-container">
            <ScatterPlot
              title="TV Advertising vs Sales"
              data={advertising.observations}
              xKey="tv_ads"
              yKey="sales"
              xLabel="Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-primary)"
            />
            <div className="scatter-interpretation-card">
              The TV–sales observations show a comparatively strong positive linear pattern, consistent
              with the highest Pearson correlation among the three channels.
            </div>
          </div>

          {/* Social Media vs Sales */}
          <div className="scatter-item-container">
            <ScatterPlot
              title="Social Media Advertising vs Sales"
              data={advertising.observations}
              xKey="social_media_ads"
              yKey="sales"
              xLabel="Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-info)"
            />
            <div className="scatter-interpretation-card">
              The social media–sales observations also show a positive relationship, although the
              bivariate association is weaker than the TV–sales relationship.
            </div>
          </div>
        </div>

        {/* Print vs Sales */}
        <div style={{ marginTop: 'var(--space-5)' }}>
          <div className="scatter-item-container">
            <ScatterPlot
              title="Print Advertising vs Sales"
              data={advertising.observations}
              xKey="print_ads"
              yKey="sales"
              xLabel="Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-secondary)"
            />
            <div className="scatter-interpretation-card">
              The print–sales observations show a substantially weaker positive linear relationship.
            </div>
          </div>
        </div>
      </section>

      {/* 07. Multivariate Regression & Visual */}
      <section id="regression" aria-labelledby="multivariate-heading">
        <div className="overview-group-header">
          <h3 id="multivariate-heading" className="overview-group-title">2. Multivariate Regression</h3>
          <SourceCitation sourceName="Internal multiple linear regression analysis" />
        </div>

        <div className="regression-spec-box" style={{ marginBottom: 'var(--space-3)' }}>
          <code>Sales = β₀ + β₁(TV Ads) + β₂(Social Media Ads) + β₃(Print Ads) + ε</code>
        </div>

        <p className="subsection-lead-text">
          Unlike the pairwise correlations, the multiple regression evaluates the three advertising
          variables simultaneously. The coefficient for a channel therefore represents its fitted
          relationship with sales while the other included advertising variables are held constant
          within the model.
        </p>
        <p className="subsection-lead-text" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', marginTop: 'var(--space-2)' }}>
          This is a statistical adjustment, not a causal experiment.
        </p>

        <div style={{ margin: 'var(--space-4) 0' }}>
          <ChartCard
            title="Estimated Channel Coefficients"
            description="Estimated coefficients from the multivariate linear regression. Coefficient estimates are not causal ROI estimates."
            source="Source: Internal multiple linear regression analysis"
            methodologyNote="OLS Regression Parameter Estimates (β)"
            minHeight={220}
          >
            <CoefficientBarChart
              tvCoeff={tvData.regression_coefficient}
              socialCoeff={socialData.regression_coefficient}
              printCoeff={printData.regression_coefficient}
            />
          </ChartCard>
        </div>
      </section>

      {/* 08. Statistical Significance */}
      <section aria-labelledby="significance-heading">
        <div className="overview-group-header">
          <h3 id="significance-heading" className="overview-group-title">3. Statistical Significance</h3>
          <span className="overview-group-subtitle">Decision Threshold: α = 0.05</span>
        </div>

        <p className="subsection-lead-text">
          Statistical significance helps distinguish estimated relationships from zero under the
          assumptions of the fitted model. It does not measure profitability, practical importance or
          causality.
        </p>

        <div className="predictor-significance-list" style={{ margin: 'var(--space-4) 0' }}>
          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">TV Ads</span>
              <div className="predictor-meta">
                <span>p &lt; 0.0001</span>
                <span>·</span>
                <span>95% CI: [{tvData.ci_lower.toFixed(4)}, {tvData.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="positive">Significant at α = 0.05</StatusBadge>
          </div>

          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">Social Media Ads</span>
              <div className="predictor-meta">
                <span>p &lt; 0.0001</span>
                <span>·</span>
                <span>95% CI: [{socialData.ci_lower.toFixed(4)}, {socialData.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="positive">Significant at α = 0.05</StatusBadge>
          </div>

          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">Print Ads</span>
              <div className="predictor-meta">
                <span>p = {printData.p_value.toFixed(4)}</span>
                <span>·</span>
                <span>95% CI: [{printData.ci_lower.toFixed(4)}, {printData.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="warning">Not statistically significant at α = 0.05</StatusBadge>
          </div>
        </div>

        <p className="subsection-lead-text" style={{ fontStyle: 'italic' }}>
          Within this multivariate model, the print coefficient is not statistically distinguishable
          from zero at the 5% significance level.
        </p>
      </section>

      {/* 09. The Critical Comparison: Putting the Evidence Together */}
      <section aria-labelledby="putting-evidence-heading">
        <div className="overview-group-header">
          <h3 id="putting-evidence-heading" className="overview-group-title">Putting the Evidence Together</h3>
          <span className="overview-group-subtitle">Multi-dimensional channel synthesis</span>
        </div>

        <div className="putting-evidence-grid">
          {/* TV Ads Card */}
          <article className="channel-evidence-card">
            <div className="channel-card-header">
              <h4 className="channel-card-name">TV Ads</h4>
              <StatusBadge variant="positive">Significant</StatusBadge>
            </div>
            <div className="channel-evidence-rows">
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Observed relationship:</span>
                <span className="evidence-row-content">
                  Strongest Pearson correlation with sales (r = {tvData.sales_correlation.toFixed(3)}).
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Multivariate relationship:</span>
                <span className="evidence-row-content">
                  Positive regression coefficient of approximately +{tvData.regression_coefficient.toFixed(4)}.
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Significance:</span>
                <span className="evidence-row-content">
                  Statistically significant at α = 0.05 (p &lt; 0.0001; 95% CI: [{tvData.ci_lower.toFixed(4)}, {tvData.ci_upper.toFixed(4)}]).
                </span>
              </div>
            </div>
            <div className="channel-business-interp">
              <strong>Business interpretation:</strong> TV shows the strongest bivariate relationship
              with observed sales in this dataset. Its multivariate coefficient should be interpreted as
              the estimated relationship after accounting for the other included advertising variables,
              rather than as a causal return on advertising spend.
            </div>
          </article>

          {/* Social Media Ads Card */}
          <article className="channel-evidence-card">
            <div className="channel-card-header">
              <h4 className="channel-card-name">Social Media Ads</h4>
              <StatusBadge variant="positive">Significant</StatusBadge>
            </div>
            <div className="channel-evidence-rows">
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Observed relationship:</span>
                <span className="evidence-row-content">
                  Positive Pearson correlation with sales (r = {socialData.sales_correlation.toFixed(3)}).
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Multivariate relationship:</span>
                <span className="evidence-row-content">
                  Positive regression coefficient of approximately +{socialData.regression_coefficient.toFixed(4)}.
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Significance:</span>
                <span className="evidence-row-content">
                  Statistically significant at α = 0.05 (p &lt; 0.0001; 95% CI: [{socialData.ci_lower.toFixed(4)}, {socialData.ci_upper.toFixed(4)}]).
                </span>
              </div>
            </div>
            <div className="channel-business-interp">
              <strong>Business interpretation:</strong> Social media also shows a positive relationship
              with observed sales. Its regression coefficient provides additional multivariate evidence,
              but the coefficient should not be interpreted as a causal incremental return.
            </div>
          </article>

          {/* Print Ads Card */}
          <article className="channel-evidence-card">
            <div className="channel-card-header">
              <h4 className="channel-card-name">Print Ads</h4>
              <StatusBadge variant="warning">Not significant</StatusBadge>
            </div>
            <div className="channel-evidence-rows">
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Observed relationship:</span>
                <span className="evidence-row-content">
                  Substantially weaker Pearson correlation with sales (r = {printData.sales_correlation.toFixed(3)}).
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Multivariate relationship:</span>
                <span className="evidence-row-content">
                  Regression coefficient approximately {printData.regression_coefficient.toFixed(4)}.
                </span>
              </div>
              <div className="channel-evidence-row">
                <span className="evidence-row-label">Significance:</span>
                <span className="evidence-row-content">
                  Not statistically significant at α = 0.05 (p = {printData.p_value.toFixed(4)}; 95% CI: [{printData.ci_lower.toFixed(4)}, {printData.ci_upper.toFixed(4)}]).
                </span>
              </div>
            </div>
            <div className="channel-business-interp">
              <strong>Business interpretation:</strong> Print shows a substantially weaker bivariate
              relationship, and its coefficient is not statistically significant in the multivariate
              model. The analysis therefore provides limited statistical evidence for a distinct
              positive print-sales relationship within this model.
            </div>
          </article>
        </div>
      </section>

      {/* 10. Channel Evidence Matrix */}
      <section aria-labelledby="matrix-heading">
        <div className="overview-group-header">
          <h3 id="matrix-heading" className="overview-group-title">Channel Evidence Matrix</h3>
          <span className="overview-group-subtitle">Dimension-by-dimension empirical comparison</span>
        </div>

        <DataTable
          title="Evidence Across Statistical Dimensions"
          subtitle="Non-hierarchical synthesis of bivariate and multivariate findings across channels"
          columns={matrixColumns}
          data={matrixRows}
          sourceNote="Descriptive evidence summary; does not rank channels or assign subjective scores."
        />
      </section>

      {/* 11. Methodology Box: Why can correlation and regression tell different stories? */}
      <section id="methodology" aria-label="Methodology Clarification">
        <MethodologyBox
          tag="Methodology Clarification"
          methodTitle="Why can correlation and regression tell different stories?"
          explanation="Correlation examines one channel and sales at a time. Multiple regression evaluates all three channels simultaneously. If advertising channels are related to one another, the regression coefficients can differ from the pairwise correlations because the model is estimating each channel's relationship conditional on the other included variables. This is why channel evaluation should not rely on a single statistic."
          source="Internal statistical methodology reference"
        />
      </section>

      {/* 12. Channel Overlap & Multicollinearity */}
      <section aria-labelledby="overlap-heading">
        <div className="overview-group-header">
          <h4 id="overlap-heading" className="overview-group-title" style={{ fontSize: 'var(--text-subsection)' }}>
            Channel Overlap
          </h4>
        </div>
        <p className="subsection-lead-text">
          The advertising channels may be correlated with one another. When predictors overlap, the
          regression must separate their fitted relationships using the information available in the
          dataset. This can affect coefficient estimates and their uncertainty.
        </p>
        <p className="subsection-lead-text" style={{ fontStyle: 'italic', marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
          Formal multicollinearity diagnostics are not included in the current analysis.
        </p>
      </section>

      {/* 13. Business Interpretation */}
      <section id="business-implications" aria-labelledby="business-interp-heading">
        <div className="overview-group-header">
          <h3 id="business-interp-heading" className="overview-group-title">Business Interpretation</h3>
        </div>
        <p className="subsection-lead-text">
          The statistical evidence differentiates the channels, but it does not by itself determine the
          optimal advertising allocation. TV and social media show stronger observed relationships with
          sales than print, while the multivariate model provides additional information about their
          relationships when the channels are considered together. Print has a weaker observed
          relationship and a non-significant multivariate coefficient. These findings provide evidence for
          the later strategy decision, but allocation decisions also require customer, market, cost and
          feasibility considerations.
        </p>
      </section>

      {/* 14. What the Analysis Supports */}
      <Callout variant="key-finding" title="What the evidence supports">
        The dataset supports treating TV and social media as channels with material positive
        relationships with observed sales, while the evidence for a distinct positive print relationship
        is substantially weaker. The multivariate results add an additional layer of evidence beyond
        pairwise correlation.
      </Callout>

      {/* 15. What the Analysis Does Not Support */}
      <WarningBox
        severity="caution"
        title="What the analysis does not establish"
        message="The analysis does not establish causal advertising effects, incremental ROI, optimal budget allocation or the effect of removing a channel. Those questions require additional assumptions, cost information, experimental or quasi-experimental evidence, and broader business context."
      />
    </div>
  );
}

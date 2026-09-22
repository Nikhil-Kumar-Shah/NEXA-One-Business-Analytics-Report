import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAdvertisingAnalysis } from '../../services/api';
import { ScatterPlot } from './ScatterPlot';
import { CorrelationBarChart } from '../overview/CorrelationBarChart';
import {
  DataTable,
  ChartCard,
  Callout,
  MethodologyBox,
  StatusBadge,
  SourceCitation,
  LoadingState,
  ErrorState,
} from '../../components';
import { DatasetSourceLink } from '../../components/common/DatasetSourceLink';
import './AdvertisingSalesView.css';

export function AdvertisingSalesView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdvertisingAnalysis();
      setData(result);
    } catch (err) {
      console.error('Failed to load statistical analysis:', err);
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
        title="Loading statistical analysis..."
        subtext="Retrieving observations, correlations, and multivariate regression results"
        skeletonLines={5}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Statistical analysis could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Analysis"
      />
    );
  }

  const { advertising, correlation, regression } = data;

  // Correlation values
  const tvCorr = correlation.matrix['TV Ads']?.['Sales'] ?? 0.7822;
  const socialCorr = correlation.matrix['Social Media Ads']?.['Sales'] ?? 0.5762;
  const printCorr = correlation.matrix['Print Ads']?.['Sales'] ?? 0.2283;

  // Model statistics
  const { r_squared, adjusted_r_squared, f_statistic, model_p_value } = regression.model;
  const r2Percent = (r_squared * 100).toFixed(2) + '%';
  const adjR2Percent = (adjusted_r_squared * 100).toFixed(2) + '%';
  const r2Raw = r_squared.toFixed(4);
  const adjR2Raw = adjusted_r_squared.toFixed(4);

  // Coefficients
  const tvCoeffObj = regression.coefficients.find((c) => c.variable === 'TV Ads');
  const socialCoeffObj = regression.coefficients.find((c) => c.variable === 'Social Media Ads');
  const printCoeffObj = regression.coefficients.find((c) => c.variable === 'Print Ads');
  const interceptObj = regression.coefficients.find((c) => c.variable === 'Intercept');

  // Descriptive statistics table setup
  const descriptiveMetrics = ['Mean', 'Median', 'Std Dev', 'Minimum', 'Q1', 'Q3', 'Maximum'];
  const descriptiveTableRows = descriptiveMetrics.map((metricName) => {
    const row = advertising.descriptive_statistics.find(
      (d) => d.metric.toLowerCase() === metricName.toLowerCase()
    );
    return {
      metric: metricName,
      tv: row?.tv_ads?.toFixed(2) ?? '—',
      social: row?.social_media_ads?.toFixed(2) ?? '—',
      print: row?.print_ads?.toFixed(2) ?? '—',
      total: row?.total_ads?.toFixed(2) ?? '—',
      sales: row?.sales?.toFixed(2) ?? '—',
    };
  });

  const descriptiveTableColumns = [
    { key: 'metric', label: 'Descriptive Metric', align: 'left' },
    { key: 'tv', label: 'TV Ads ($000s)', align: 'right' },
    { key: 'social', label: 'Social Media Ads ($000s)', align: 'right' },
    { key: 'print', label: 'Print Ads ($000s)', align: 'right' },
    { key: 'total', label: 'Total Advertising ($000s)', align: 'right' },
    { key: 'sales', label: 'Sales (000 units)', align: 'right' },
  ];

  // Regression table setup
  const regressionTableColumns = [
    { key: 'variable', label: 'Variable', align: 'left' },
    { key: 'coef', label: 'Coefficient (β)', align: 'right' },
    { key: 'se', label: 'Std. Error', align: 'right' },
    { key: 't', label: 't-Statistic', align: 'right' },
    { key: 'p', label: 'p-Value', align: 'right' },
    { key: 'ciLower', label: '95% CI Lower', align: 'right' },
    { key: 'ciUpper', label: '95% CI Upper', align: 'right' },
  ];

  const regressionTableData = [
    interceptObj,
    tvCoeffObj,
    socialCoeffObj,
    printCoeffObj,
  ].filter(Boolean).map((item) => ({
    variable: item.variable,
    coef: item.coefficient >= 0 ? `+${item.coefficient.toFixed(4)}` : item.coefficient.toFixed(4),
    se: item.standard_error.toFixed(4),
    t: item.t_statistic.toFixed(3),
    p: item.p_value < 0.0001 ? '< 0.0001' : item.p_value.toFixed(4),
    ciLower: item.ci_lower.toFixed(4),
    ciUpper: item.ci_upper.toFixed(4),
  }));

  // Channel view state & URL synchronization
  const currentChannel = searchParams.get('channel') || 'all';
  const validChannels = ['all', 'tv', 'social', 'print'];
  const activeChannel = validChannels.includes(currentChannel.toLowerCase())
    ? currentChannel.toLowerCase()
    : 'all';

  const handleChannelChange = (ch) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (ch === 'all') {
          next.delete('channel');
        } else {
          next.set('channel', ch);
        }
        return next;
      },
      { replace: true }
    );
  };

  const channelConfig = {
    all: {
      id: 'all',
      name: 'All Channels',
      title: 'Total Advertising Spend vs Observed Sales',
      xKey: 'total_advertising',
      xLabel: 'Total Advertising Spend ($000s)',
      colorVar: 'var(--color-primary)',
      metricLabel: 'Multiple Regression R²',
      metricValue: r2Percent,
      metricSub: `Adj R²: ${adjR2Percent} (F = ${f_statistic.toFixed(2)}, p < 0.0001)`,
      betaLabel: 'Model Specification',
      betaValue: '3 Advertising Channels',
      betaSub: `Intercept β₀ = +${interceptObj?.coefficient.toFixed(4)}`,
      significance: 'Overall Model Significant (p < 0.0001)',
      isSig: true,
      description: 'Combined advertising expenditure across all 200 observed markets explains 89.72% of the variance in observed sales under ordinary least squares estimation.',
    },
    tv: {
      id: 'tv',
      name: 'TV Ads',
      title: 'TV Advertising Spend vs Observed Sales',
      xKey: 'tv_ads',
      xLabel: 'TV Advertising Spend ($000s)',
      colorVar: 'var(--color-primary)',
      metricLabel: 'Pearson Correlation (r)',
      metricValue: tvCorr.toFixed(4),
      metricSub: 'Strongest observed bivariate linear relationship',
      betaLabel: 'Regression Coefficient (β₁)',
      betaValue: `+${tvCoeffObj?.coefficient.toFixed(4)}`,
      betaSub: `95% CI: [${tvCoeffObj?.ci_lower.toFixed(4)}, ${tvCoeffObj?.ci_upper.toFixed(4)}]`,
      significance: 'Statistically Significant at α = 0.05 (p < 0.0001)',
      isSig: true,
      description: 'TV advertising has the strongest bivariate association with sales (r = 0.7822) and a statistically significant positive multivariate coefficient (+0.0468) holding other channels constant.',
    },
    social: {
      id: 'social',
      name: 'Social Media Ads',
      title: 'Social Media Advertising Spend vs Observed Sales',
      xKey: 'social_media_ads',
      xLabel: 'Social Media Advertising Spend ($000s)',
      colorVar: 'var(--color-info)',
      metricLabel: 'Pearson Correlation (r)',
      metricValue: socialCorr.toFixed(4),
      metricSub: 'Moderate positive bivariate linear relationship',
      betaLabel: 'Regression Coefficient (β₂)',
      betaValue: `+${socialCoeffObj?.coefficient.toFixed(4)}`,
      betaSub: `95% CI: [${socialCoeffObj?.ci_lower.toFixed(4)}, ${socialCoeffObj?.ci_upper.toFixed(4)}]`,
      significance: 'Statistically Significant at α = 0.05 (p < 0.0001)',
      isSig: true,
      description: 'Social media advertising demonstrates a moderate bivariate association (r = 0.5762) and a significant positive multivariate coefficient (+0.1885) holding TV and print spend constant.',
    },
    print: {
      id: 'print',
      name: 'Print Ads',
      title: 'Print Advertising Spend vs Observed Sales',
      xKey: 'print_ads',
      xLabel: 'Print Advertising Spend ($000s)',
      colorVar: 'var(--color-secondary)',
      metricLabel: 'Pearson Correlation (r)',
      metricValue: printCorr.toFixed(4),
      metricSub: 'Weak bivariate linear relationship',
      betaLabel: 'Regression Coefficient (β₃)',
      betaValue: `${printCoeffObj?.coefficient.toFixed(4)}`,
      betaSub: `95% CI: [${printCoeffObj?.ci_lower.toFixed(4)}, ${printCoeffObj?.ci_upper.toFixed(4)}]`,
      significance: `Not Statistically Significant (p = ${printCoeffObj?.p_value.toFixed(4)})`,
      isSig: false,
      description: 'Print advertising has a weak bivariate association (r = 0.2283) and a multivariate coefficient (-0.0010, p = 0.8599) indistinguishable from zero under standard significance thresholds.',
    },
  };

  const activeCfg = channelConfig[activeChannel];

  return (
    <div className="advertising-sales-container">
      {/* A. Analytical Question Banner & Opening Statement */}
      <section className="analytical-question-banner" id="question" aria-label="Analytical Question">
        <h2 className="question-heading">
          Q1 — Is there a meaningful relationship between advertising expenditure and sales?
        </h2>
        <p className="opening-analytical-statement">
          The advertising dataset shows a strong positive relationship between combined advertising
          activity and observed sales. A multiple linear regression using TV, social media and print
          advertising explains about 89.7% of the variation in observed sales. The individual channel
          relationships differ substantially, and statistical significance must be considered alongside
          correlation and model fit.
        </p>
      </section>

      {/* B. Data Overview */}
      <section id="data-overview" aria-labelledby="data-overview-title">
        <div className="data-overview-strip" role="region" aria-label="Data Overview Metrics">
          <div className="data-overview-item">
            <span className="overview-item-val">{advertising.total_observations}</span>
            <span className="overview-item-label">Observations</span>
          </div>
          <div className="data-overview-item">
            <span className="overview-item-val">3</span>
            <span className="overview-item-label">Advertising Variables</span>
          </div>
          <div className="data-overview-item">
            <span className="overview-item-val">Sales</span>
            <span className="overview-item-label">Outcome Variable</span>
          </div>
          <div className="data-overview-item">
            <span className="overview-item-val">$000s</span>
            <span className="overview-item-label">Advertising Unit</span>
          </div>
          <div className="data-overview-item">
            <span className="overview-item-val">000 units</span>
            <span className="overview-item-label">Sales Unit</span>
          </div>
          <div className="data-overview-item">
            <span className="overview-item-val">OLS Multiple</span>
            <span className="overview-item-label">Model Type</span>
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <DatasetSourceLink datasetKey="advertising" label="View advertising dataset (Google Sheets)" variant="badge" />
        </div>
      </section>

      {/* C. Advertising Spend & Descriptive Statistics */}
      <section className="descriptive-stats-section" id="advertising-spend" aria-labelledby="advertising-spend-heading">
        <div className="overview-group-header">
          <h3 id="advertising-spend-heading" className="overview-group-title">Advertising Spend</h3>
          <SourceCitation sourceName="Internal descriptive statistics" />
        </div>

        <p className="subsection-lead-text">
          The dataset records advertising expenditure across three channels: TV, social media and print.
          The three channel variables can also be combined to represent total observed advertising
          expenditure for each market observation.
        </p>

        <DataTable
          title="Descriptive Statistics Summary"
          subtitle="Distribution measures across all 200 observed markets (Units: $000s for spend, 000 units for sales)"
          columns={descriptiveTableColumns}
          data={descriptiveTableRows}
          sourceNote="Source: Internal advertising dataset — 200 observations"
        />
      </section>

      {/* D & E. Interactive Relationship Explorer */}
      <section className="relationship-explorer-section" aria-labelledby="relationship-explorer-heading">
        <div className="relationship-explorer-header">
          <div>
            <span className="rel-kicker">Interactive Evidence Exploration</span>
            <h3 id="relationship-explorer-heading" className="overview-group-title">
              Explore the relationship
            </h3>
            <p className="subsection-lead-text" style={{ margin: '4px 0 0 0' }}>
              Select a channel view to update the scatter plot visualization and evaluate its statistical evidence.
            </p>
          </div>
          <div className="channel-filter-area" role="group" aria-label="Select Advertising Channel">
            <span className="channel-control-label" id="channel-control-lbl">Channel</span>
            <div className="channel-button-group" role="radiogroup" aria-labelledby="channel-control-lbl">
              {[
                { id: 'all', label: 'All Channels' },
                { id: 'tv', label: 'TV Ads' },
                { id: 'social', label: 'Social Media Ads' },
                { id: 'print', label: 'Print Ads' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={activeChannel === opt.id}
                  className={`channel-filter-pill ${activeChannel === opt.id ? 'is-active' : ''}`}
                  onClick={() => handleChannelChange(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Explorer Workspace */}
        <div className="relationship-explorer-workspace">
          <div className="rel-chart-wrap">
            <ScatterPlot
              title={`${activeCfg.title} (n = 200)`}
              data={advertising.observations}
              xKey={activeCfg.xKey}
              yKey="sales"
              xLabel={activeCfg.xLabel}
              yLabel="Sales (000 units)"
              colorVar={activeCfg.colorVar}
              fitLineLabel="Linear fit"
              enablePointSelection={true}
            />
          </div>

          <div className="rel-evidence-card" role="region" aria-label="Dynamic Statistical Evidence">
            <div className="rel-evidence-top">
              <span className="rel-evidence-badge">Dynamic Statistical Evidence</span>
              <h4 className="rel-evidence-card-title">{activeCfg.name}</h4>
            </div>

            <div className="rel-evidence-metrics">
              <div className="rel-evidence-metric-box">
                <span className="rel-metric-lbl">{activeCfg.metricLabel}</span>
                <span className="rel-metric-num font-mono">{activeCfg.metricValue}</span>
                <span className="rel-metric-sub">{activeCfg.metricSub}</span>
              </div>

              <div className="rel-evidence-metric-box">
                <span className="rel-metric-lbl">{activeCfg.betaLabel}</span>
                <span className="rel-metric-num font-mono">{activeCfg.betaValue}</span>
                <span className="rel-metric-sub">{activeCfg.betaSub}</span>
              </div>
            </div>

            <div className="rel-evidence-badge-row">
              <StatusBadge variant={activeCfg.isSig ? 'positive' : 'warning'}>
                {activeCfg.significance}
              </StatusBadge>
            </div>

            <p className="rel-evidence-desc">
              {activeCfg.description}
            </p>

            <div className="rel-causation-warning">
              <span className="rel-warning-strong">Methodological Safeguard:</span> Correlation does not establish causation. Regression coefficients describe statistical association under the model specification and do not establish guaranteed incremental sales.
            </div>
          </div>
        </div>
      </section>

      {/* F, G, H. Correlation Analysis & Visual */}
      <section id="correlation" aria-labelledby="correlation-heading">
        <div className="overview-group-header">
          <h3 id="correlation-heading" className="overview-group-title">Correlation Analysis</h3>
          <SourceCitation sourceName="Internal advertising dataset — 200 observations" />
        </div>

        <p className="subsection-lead-text">
          Pearson correlation measures the strength and direction of a linear relationship between two
          variables. It does not establish causation.
        </p>

        <div style={{ margin: 'var(--space-4) 0' }}>
          <ChartCard
            title="Correlation with Sales by Advertising Channel"
            description="Pearson correlation with sales; correlation does not establish causation."
            source="Source: Internal advertising dataset — 200 observations"
            methodologyNote="Bivariate Pearson correlation coefficient (r)"
            minHeight={220}
          >
            <CorrelationBarChart
              tvCorr={tvCorr}
              socialCorr={socialCorr}
              printCorr={printCorr}
            />
          </ChartCard>
        </div>

        <p className="subsection-lead-text">
          TV advertising has the strongest bivariate linear relationship with sales among the three
          channels (r = 0.782). Social media advertising also shows a positive relationship with sales
          (r = 0.576), while print advertising shows a substantially weaker positive relationship
          (r = 0.228).
        </p>
      </section>

      {/* I. Individual Scatter Plots & Interpretation */}
      <section aria-labelledby="individual-scatter-heading">
        <div className="overview-group-header">
          <h3 id="individual-scatter-heading" className="overview-group-title">Individual Channel Scatter Plots</h3>
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
              xLabel="TV Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-primary)"
            />
            <div className="scatter-interpretation-card">
              The TV–sales scatter plot shows a visibly positive linear pattern, consistent with the
              relatively strong Pearson correlation of 0.782.
            </div>
          </div>

          {/* Social Media vs Sales */}
          <div className="scatter-item-container">
            <ScatterPlot
              title="Social Media Advertising vs Sales"
              data={advertising.observations}
              xKey="social_media_ads"
              yKey="sales"
              xLabel="Social Media Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-info)"
            />
            <div className="scatter-interpretation-card">
              The social media–sales scatter plot also shows a positive relationship, although the
              association is weaker than the TV–sales relationship.
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
              xLabel="Print Advertising spend ($000s)"
              yLabel="Sales (000 units)"
              colorVar="var(--color-secondary)"
            />
            <div className="scatter-interpretation-card">
              The print–sales relationship is visibly weaker, consistent with its lower Pearson correlation of 0.228.
            </div>
          </div>
        </div>
      </section>

      {/* J & K & L. Multiple Linear Regression & Results Table */}
      <section id="regression" aria-labelledby="multiple-regression-heading">
        <div className="overview-group-header">
          <h3 id="multiple-regression-heading" className="overview-group-title">Multiple Linear Regression</h3>
          <SourceCitation sourceName="Internal multiple linear regression analysis" />
        </div>

        <p className="subsection-lead-text" style={{ marginBottom: 'var(--space-3)' }}>
          Multiple linear regression estimates the relationship between sales and the three advertising
          variables simultaneously. This allows the model to evaluate each channel while holding the
          other included advertising variables constant within the fitted model.
        </p>

        <div className="regression-table-wrapper" style={{ marginBottom: 'var(--space-4)' }}>
          <div className="regression-spec-box">
            <code>Sales = β₀ + β₁(TV Ads) + β₂(Social Media Ads) + β₃(Print Ads) + ε</code>
          </div>

          <DataTable
            title="Regression Results Table"
            subtitle="Ordinary Least Squares (OLS) multivariate parameter estimates (Dependent Variable: Sales)"
            columns={regressionTableColumns}
            data={regressionTableData}
            sourceNote="Model: N=200, Residual df=197. Source: Internal multiple linear regression analysis"
          />
        </div>

        <p className="subsection-lead-text">
          Within the fitted multivariate model, the estimated coefficients for TV and social media
          advertising are positive, while the print coefficient is close to zero. These coefficients
          describe the fitted relationship between each advertising variable and sales after accounting
          for the other included advertising variables.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', margin: 'var(--space-3) 0' }}>
          <span className="finding-metric-item">
            <span className="finding-metric-label">TV coefficient:</span> approximately +0.0458
          </span>
          <span className="finding-metric-item">
            <span className="finding-metric-label">Social Media coefficient:</span> approximately +0.1885
          </span>
          <span className="finding-metric-item">
            <span className="finding-metric-label">Print coefficient:</span> approximately -0.0010
          </span>
        </div>
      </section>

      {/* M, N, O. Model Fit & Statistical Significance */}
      <section className="fit-significance-grid" aria-label="Model Fit and Significance">
        {/* Model Fit */}
        <div className="stat-summary-card">
          <h4 className="stat-card-title">Model Fit</h4>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Coefficient of Determination (R²)</span>
            <span className="stat-metric-value">{r2Percent} ({r2Raw})</span>
          </div>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Adjusted R²</span>
            <span className="stat-metric-value">{adjR2Percent} ({adjR2Raw})</span>
          </div>
          <p className="stat-narrative">
            The model explains approximately 89.7% of the variation in observed sales in this dataset.
            The adjusted R² is also high at approximately 89.6%, indicating that the model's explanatory
            fit remains high after accounting for the number of predictors.
          </p>
        </div>

        {/* Statistical Significance */}
        <div className="stat-summary-card">
          <h4 className="stat-card-title">Statistical Significance</h4>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Overall F-statistic</span>
            <span className="stat-metric-value">{f_statistic.toFixed(2)}</span>
          </div>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Overall Model p-value</span>
            <span className="stat-metric-value">&lt; 0.0001 ({model_p_value.toExponential(2)})</span>
          </div>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Significance Threshold</span>
            <span className="stat-metric-value">α = 0.05</span>
          </div>
          <p className="stat-narrative">
            If the overall model p-value is below the chosen significance threshold, the regression
            provides statistical evidence that the predictors are jointly associated with variation in sales.
          </p>
        </div>
      </section>

      {/* Individual Predictor Significance Status */}
      <section aria-labelledby="predictor-sig-heading">
        <div className="overview-group-header">
          <h4 id="predictor-sig-heading" className="overview-group-title" style={{ fontSize: 'var(--text-subsection)' }}>
            Individual Predictor Significance
          </h4>
          <span className="overview-group-subtitle">Evaluation at α = 0.05 standard decision threshold</span>
        </div>

        <div className="predictor-significance-list">
          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">TV Ads</span>
              <div className="predictor-meta">
                <span>p &lt; 0.0001</span>
                <span>·</span>
                <span>95% CI: [{tvCoeffObj?.ci_lower.toFixed(4)}, {tvCoeffObj?.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="positive">Statistically significant at α = 0.05</StatusBadge>
          </div>

          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">Social Media Ads</span>
              <div className="predictor-meta">
                <span>p &lt; 0.0001</span>
                <span>·</span>
                <span>95% CI: [{socialCoeffObj?.ci_lower.toFixed(4)}, {socialCoeffObj?.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="positive">Statistically significant at α = 0.05</StatusBadge>
          </div>

          <div className="predictor-significance-item">
            <div>
              <span className="predictor-name">Print Ads</span>
              <div className="predictor-meta">
                <span>p = 0.8599</span>
                <span>·</span>
                <span>95% CI: [{printCoeffObj?.ci_lower.toFixed(4)}, {printCoeffObj?.ci_upper.toFixed(4)}]</span>
              </div>
            </div>
            <StatusBadge variant="warning">Not statistically significant at α = 0.05</StatusBadge>
          </div>
        </div>

        <p className="subsection-lead-text" style={{ marginTop: 'var(--space-3)' }}>
          Statistical significance provides evidence about whether an estimated relationship is
          distinguishable from zero under the assumptions of the model. It does not measure practical
          importance, profitability or causality. Therefore, significance should be considered together
          with effect size, model fit, business context and the limitations of the observational dataset.
        </p>
      </section>

      {/* P. Key Statistical Finding Callout */}
      <Callout variant="key-finding" title="Key Statistical Finding">
        The three-channel regression explains approximately 89.7% of the variation in observed sales.
        TV and social media have positive estimated coefficients, while the print coefficient is close
        to zero and is not statistically significant in the multivariate model.
      </Callout>

      {/* Q. Methodology Box: Why both correlation and regression? */}
      <MethodologyBox
        tag="Methodology Clarification"
        methodTitle="Why both correlation and regression?"
        explanation="Correlation describes the pairwise linear relationship between one advertising variable and sales. Multiple regression evaluates the three advertising variables simultaneously. The two analyses therefore answer related but different questions and should not be interpreted as interchangeable measures."
        source="Internal statistical methodology reference"
      />

      {/* R. Interpretation (3 Subsections) */}
      <section id="interpretation" aria-labelledby="interpretation-heading">
        <div className="overview-group-header">
          <h3 id="interpretation-heading" className="overview-group-title">Interpretation</h3>
        </div>

        <div className="interpretation-grid">
          <article className="interpretation-card">
            <h4 className="interpretation-title">What the evidence supports</h4>
            <p className="interpretation-body">
              The advertising data provides strong statistical evidence of a relationship between the
              included advertising variables and observed sales. TV has the strongest bivariate
              relationship with sales, social media also shows a positive relationship, and the overall
              three-channel regression has high explanatory fit.
            </p>
          </article>

          <article className="interpretation-card">
            <h4 className="interpretation-title">What the evidence does not establish</h4>
            <p className="interpretation-body">
              The analysis does not establish that advertising expenditure caused the observed sales
              differences. It also does not provide a causal ROI estimate for any channel.
            </p>
          </article>

          <article className="interpretation-card">
            <h4 className="interpretation-title">Why this matters</h4>
            <p className="interpretation-body">
              The results provide a quantitative basis for examining channel differences in the next section,
              while making clear that channel decisions should not rely on correlation or regression
              coefficients alone.
            </p>
          </article>
        </div>
      </section>

      {/* S & T & U. Limitations & Assumptions & Outlier Handling */}
      <section className="limitations-container" id="limitations" aria-label="Methodological Limitations and Assumptions">
        <h3 className="limitations-heading">Limitations</h3>

        <ul className="limitations-list">
          <li className="limitation-item">
            <span className="limitation-name">1. Observational data:</span>
            <span className="limitation-text">
              The dataset records observed advertising expenditure and sales rather than results from a
              controlled experiment. Therefore, causal effects cannot be established from this analysis alone.
            </span>
          </li>
          <li className="limitation-item">
            <span className="limitation-name">2. Potential omitted variables:</span>
            <span className="limitation-text">
              Other factors that may affect sales are not represented in the four advertising/sales
              variables used here.
            </span>
          </li>
          <li className="limitation-item">
            <span className="limitation-name">3. Multicollinearity:</span>
            <span className="limitation-text">
              Advertising channels may be related to one another. Correlations among predictors can affect
              coefficient estimates and their interpretation.
            </span>
          </li>
          <li className="limitation-item">
            <span className="limitation-name">4. Functional form:</span>
            <span className="limitation-text">
              The primary model is linear. Non-linear relationships or interaction effects may not be
              fully represented.
            </span>
          </li>
          <li className="limitation-item">
            <span className="limitation-name">5. Extrapolation:</span>
            <span className="limitation-text">
              The results describe the observed dataset and should not automatically be extrapolated
              beyond its range.
            </span>
          </li>
          <li className="limitation-item">
            <span className="limitation-name">6. Association is not ROI:</span>
            <span className="limitation-text">
              Regression coefficients should not be interpreted as incremental advertising return without
              a causal identification strategy and appropriate cost/response analysis.
            </span>
          </li>
        </ul>

        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-warning-border)', fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
          <strong>Regression Assumptions:</strong> Standard OLS assumptions include linearity, independent observations, residual normality, homoscedasticity, and absence of problematic multicollinearity. <em>Diagnostic testing for this assumption is not included in the current analysis.</em>
        </div>

        <div style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)' }}>
          <strong>Outlier Handling:</strong> Potential outliers were reviewed but are not automatically removed from the analysis.
        </div>
      </section>
    </div>
  );
}

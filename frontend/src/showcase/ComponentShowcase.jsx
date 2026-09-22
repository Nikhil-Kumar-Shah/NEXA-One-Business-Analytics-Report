import React, { useState } from 'react';
import {
  SectionHeader,
  KpiCard,
  InfoCard,
  InsightCard,
  ComparisonCard,
  SourceCard,
  DataTable,
  ChartCard,
  StatusBadge,
  SourceCitation,
  Callout,
  MethodologyBox,
  WarningBox,
  DataStatusIndicator,
  LoadingState,
  ErrorState,
} from '../components';
import './ComponentShowcase.css';

export function ComponentShowcase() {
  const [tableData] = useState([
    { id: 1, metric: 'Example Metric A', baseline: '1,240', target: '1,500', variance: '+21.0%', status: 'Within range' },
    { id: 2, metric: 'Example Metric B', baseline: '850', target: '920', variance: '+8.2%', status: 'Significant' },
    { id: 3, metric: 'Example Metric C', baseline: '3,410', target: '3,100', variance: '-9.1%', status: 'Review' },
    { id: 4, metric: 'Example Metric D', baseline: '620', target: '640', variance: '+3.2%', status: 'Within range' },
    { id: 5, metric: 'Example Metric E', baseline: '2,150', target: '1,980', variance: '-7.9%', status: 'Not significant' },
  ]);

  const [loadingTrigger, setLoadingTrigger] = useState(false);

  const tableColumns = [
    { key: 'metric', label: 'Metric Name', align: 'left' },
    { key: 'baseline', label: 'Baseline', align: 'right' },
    { key: 'target', label: 'Target', align: 'right' },
    { key: 'variance', label: 'Variance', align: 'right', render: (val) => (
      <span style={{ color: val.startsWith('+') ? 'var(--color-positive)' : 'var(--color-negative)', fontWeight: 500 }}>
        {val}
      </span>
    )},
    { key: 'status', label: 'Verification Status', align: 'center', render: (val) => (
      <StatusBadge variant={val === 'Significant' ? 'positive' : val === 'Review' ? 'warning' : 'neutral'}>
        {val}
      </StatusBadge>
    )},
  ];

  const colorSwatches = [
    { name: '--color-primary', label: 'Primary (Navy)', css: 'var(--color-primary)' },
    { name: '--color-secondary', label: 'Secondary (Slate)', css: 'var(--color-secondary)' },
    { name: '--color-bg', label: 'Background', css: 'var(--color-bg)' },
    { name: '--color-surface', label: 'Surface (White)', css: 'var(--color-surface)' },
    { name: '--color-border', label: 'Border', css: 'var(--color-border)' },
    { name: '--color-text', label: 'Primary Text', css: 'var(--color-text)' },
    { name: '--color-text-muted', label: 'Muted Text', css: 'var(--color-text-muted)' },
    { name: '--color-positive', label: 'Positive', css: 'var(--color-positive)' },
    { name: '--color-warning', label: 'Warning', css: 'var(--color-warning)' },
    { name: '--color-negative', label: 'Negative', css: 'var(--color-negative)' },
    { name: '--color-accent', label: 'Accent (Blue)', css: 'var(--color-accent)' },
    { name: '--color-info', label: 'Info (Cyan)', css: 'var(--color-info)' },
  ];

  const spacingScale = [
    { token: '--space-1', px: '4px' },
    { token: '--space-2', px: '8px' },
    { token: '--space-3', px: '12px' },
    { token: '--space-4', px: '16px' },
    { token: '--space-5', px: '20px' },
    { token: '--space-6', px: '24px' },
    { token: '--space-8', px: '32px' },
    { token: '--space-10', px: '40px' },
    { token: '--space-12', px: '48px' },
    { token: '--space-16', px: '64px' },
    { token: '--space-20', px: '80px' },
  ];

  return (
    <div className="showcase-container">
      {/* Intro Header */}
      <div>
        <SectionHeader
          eyebrow="Phase 3 Verification Environment"
          title="Design System & Component Showcase"
          subtitle="Temporary internal harness to verify typography, color tokens, responsive behavior, accessibility, and component styling prior to report assembly. All analytical contents use strict neutral placeholders."
        />

        {/* Quick Nav Anchor Bar */}
        <nav className="showcase-subnav" aria-label="Component sections navigation">
          <a href="#typography" className="showcase-subnav-link">Typography</a>
          <a href="#colors" className="showcase-subnav-link">Colors</a>
          <a href="#spacing" className="showcase-subnav-link">Spacing</a>
          <a href="#kpi" className="showcase-subnav-link">KPIs & Metrics</a>
          <a href="#cards" className="showcase-subnav-link">Cards</a>
          <a href="#tables" className="showcase-subnav-link">Data Tables</a>
          <a href="#charts" className="showcase-subnav-link">Chart Containers</a>
          <a href="#badges" className="showcase-subnav-link">Badges</a>
          <a href="#callouts" className="showcase-subnav-link">Callout Boxes</a>
          <a href="#methodology" className="showcase-subnav-link">Methodology & Warnings</a>
          <a href="#citations" className="showcase-subnav-link">Citations</a>
          <a href="#feedback" className="showcase-subnav-link">States & Feedback</a>
        </nav>
      </div>

      {/* 1. TYPOGRAPHY */}
      <section id="typography" className="showcase-section">
        <SectionHeader
          title="Typography Scale"
          subtitle="Inter font stack with deliberate hierarchy and proportional line heights."
        />
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
          <div className="type-sample-row">
            <span className="type-meta">Display (40px)</span>
            <div className="text-display type-preview">Example Display Heading</div>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Page Title (34px)</span>
            <h1 className="text-page-title type-preview">Example Page Title</h1>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Section Title (26px)</span>
            <h2 className="text-section-title type-preview">Example Section Title</h2>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Subsection (20px)</span>
            <h3 className="text-subsection type-preview">Example Subsection Heading</h3>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Body Large (17px)</span>
            <p className="text-body-large type-preview">
              Example body large text designed for introductory thesis statements and high-priority lead paragraphs in analytical sections.
            </p>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Body (15px)</span>
            <p className="text-body type-preview">
              Example standard body copy demonstrating balanced line-height and restrained charcoal contrast for extended analytical reading.
            </p>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Small (13px)</span>
            <span className="text-small type-preview">
              Example secondary descriptor text, table metadata, and contextual callout descriptions.
            </span>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Caption (12px)</span>
            <span className="text-caption type-preview">
              Example footnote, methodology tag, and timestamp citation text.
            </span>
          </div>
          <div className="type-sample-row">
            <span className="type-meta">Monospace (Code/Math)</span>
            <code className="text-mono type-preview">Y = 0.842 * X1 + 0.312 * X2 + ε (p &lt; 0.001)</code>
          </div>
        </div>
      </section>

      {/* 2. COLOR PALETTE */}
      <section id="colors" className="showcase-section">
        <SectionHeader
          title="Color System Tokens"
          subtitle="Restrained corporate palette featuring deep navy, neutral slate, and muted semantic accents."
        />
        <div className="swatch-grid">
          {colorSwatches.map((swatch) => (
            <div key={swatch.name} className="swatch-item">
              <div className="swatch-color" style={{ backgroundColor: swatch.css }} />
              <div className="swatch-name">{swatch.name}</div>
              <div className="swatch-role">{swatch.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SPACING SCALE */}
      <section id="spacing" className="showcase-section">
        <SectionHeader
          title="Spacing System"
          subtitle="Strict 4px geometric progression maintaining consistent rhythm across layouts."
        />
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
          {spacingScale.map((item) => (
            <div key={item.token} className="spacing-scale-row">
              <span className="spacing-label">{item.token} ({item.px})</span>
              <div className="spacing-bar" style={{ width: item.px }} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. KPI & METRIC CARDS */}
      <section id="kpi" className="showcase-section">
        <SectionHeader
          title="KPI & Metric Components"
          subtitle="Variants for single figures, percentages, currency, counts, and statistical coefficients."
        />
        <div className="showcase-grid cols-4">
          <KpiCard
            label="Example Metric 1"
            value="₹45.2"
            unit="Cr"
            delta="+12.4%"
            status="positive"
            context="vs previous period"
          />
          <KpiCard
            label="Example Metric 2"
            value="0.842"
            badge={<StatusBadge variant="positive">Significant</StatusBadge>}
            context="Pearson r coefficient (p < 0.01)"
          />
          <KpiCard
            label="Example Metric 3"
            value="18.5%"
            delta="-2.1%"
            status="negative"
            context="Quarterly conversion variance"
          />
          <KpiCard
            label="Example Metric 4"
            value="1,420"
            unit="Units"
            delta="0.0%"
            status="neutral"
            context="Stabilized baseline level"
          />
        </div>

        {/* Compact KPI row */}
        <div className="showcase-grid cols-3" style={{ marginTop: 'var(--space-2)' }}>
          <KpiCard
            compact
            label="Example Compact 1"
            value="89.4%"
            context="Data coverage compliance"
          />
          <KpiCard
            compact
            label="Example Compact 2"
            value="3.8x"
            status="positive"
            delta="+0.4x"
            context="Efficiency multiplier"
          />
          <KpiCard
            compact
            label="Example Compact 3"
            value="12"
            unit="Sources"
            context="External research citations"
          />
        </div>
      </section>

      {/* 5. CARDS */}
      <section id="cards" className="showcase-section">
        <SectionHeader
          title="Card Variants"
          subtitle="Standard information cards, highlighted result cards, comparisons, and bibliography cards."
        />
        <div className="showcase-grid cols-2">
          <InfoCard
            title="Example Information Card"
            subtitle="Standard structural card component"
            footer={<span>Verification date: 2026</span>}
            borderAccent="accent"
          >
            This is an example information card containing body content formatted with standard line height and typography hierarchy. Cards maintain subtle borders and no excessive shadows.
          </InfoCard>

          <InsightCard
            category="Analytical Result"
            title="Example Highlighted Finding"
            badge={<StatusBadge variant="positive">Verified</StatusBadge>}
          >
            This is an example insight card used when an analytical conclusion or high-priority quantitative result requires distinct visual separation from surrounding commentary.
          </InsightCard>
        </div>

        <div className="showcase-grid cols-2" style={{ marginTop: 'var(--space-4)' }}>
          <ComparisonCard
            title="Example Comparative Card"
            subtitle="Side-by-side metric comparison"
            leftLabel="Segment Option A"
            leftValue="42.8%"
            leftContext="Sample baseline (n=450)"
            rightLabel="Segment Option B"
            rightValue="57.2%"
            rightContext="Target population (n=600)"
          />

          <SourceCard
            sourceName="Example Research Publication"
            publisher="Example Research Institute"
            year="2026"
            type="Industry Report"
            coverage="Pan-India Survey"
            url="https://example.com"
            relevance="Example methodological relevance note describing how this research informs model assumptions."
          />
        </div>
      </section>

      {/* 6. DATA TABLES */}
      <section id="tables" className="showcase-section">
        <SectionHeader
          title="Analytical Data Table"
          subtitle="Tabular display with right-aligned numerical data, left-aligned strings, and responsive horizontal scrolling."
        />
        <DataTable
          title="Example Analytical Dataset Overview"
          subtitle="Evaluating baseline vs target performance across synthetic sample metrics"
          columns={tableColumns}
          data={tableData}
          highlightRow={(row) => row.id === 2}
          sourceNote="Data Source: Example Test Dataset · Simulated for visual testing"
        />

        <SectionHeader
          title="Compact Mode Table"
          subtitle="Tight row spacing suited for multi-row statistical outputs."
        />
        <DataTable
          compact
          columns={tableColumns}
          data={tableData.slice(0, 3)}
        />
      </section>

      {/* 7. CHART CONTAINER */}
      <section id="charts" className="showcase-section">
        <SectionHeader
          title="Chart Container Card"
          subtitle="Standard container wrapping analytical visualizations with titles, legend, source attribution, and methodology notes."
        />
        <ChartCard
          title="Example Chart Visualization Container"
          description="Demonstrates consistent layout, header actions, unified legend strip, and source attribution footer."
          legend={[
            { label: 'Example Series 1', color: 'var(--color-primary)' },
            { label: 'Example Series 2', color: 'var(--color-accent)' },
            { label: 'Example Series 3', color: 'var(--color-positive)' },
          ]}
          source="Source: Example Market Study (2026)"
          methodologyNote="Method: Ordinary Least Squares (OLS) regression line with 95% confidence intervals"
        >
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: 'var(--text-subsection)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Interactive Chart Canvas Slot
            </div>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)', margin: 0 }}>
              Plotly / SVG / Canvas visualizations will mount seamlessly inside this container in subsequent analytical phases.
            </p>
          </div>
        </ChartCard>
      </section>

      {/* 8. BADGES */}
      <section id="badges" className="showcase-section">
        <SectionHeader
          title="Analytical Status Badges"
          subtitle="Restrained pill badges indicating statistical significance, directional relationships, and source provenance."
        />
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <StatusBadge variant="positive" dot>Significant</StatusBadge>
          <StatusBadge variant="warning" dot>Not significant</StatusBadge>
          <StatusBadge variant="positive">Positive relationship</StatusBadge>
          <StatusBadge variant="negative">Negative relationship</StatusBadge>
          <StatusBadge variant="warning">Review</StatusBadge>
          <StatusBadge variant="positive">Within range</StatusBadge>
          <StatusBadge variant="evidence-india">India evidence</StatusBadge>
          <StatusBadge variant="evidence-global">Global evidence</StatusBadge>
          <StatusBadge variant="evidence-primary">Primary evidence</StatusBadge>
          <StatusBadge variant="evidence-supporting">Supporting evidence</StatusBadge>
        </div>
      </section>

      {/* 9. CALLOUT BOXES */}
      <section id="callouts" className="showcase-section">
        <SectionHeader
          title="Report Callouts"
          subtitle="Structured callout components for insights, key findings, strategic decisions, and evidentiary notes."
        />
        <Callout variant="insight" title="Example Insight Statement">
          This is an example analytical insight highlighting key quantitative relationships discovered during data exploration.
        </Callout>

        <Callout variant="key-finding" title="Example Key Finding">
          This is an example key finding highlighting verified evidence directly tied to core business hypotheses.
        </Callout>

        <Callout variant="decision" title="Example Strategic Decision">
          This is an example strategic decision callout documenting actionable recommendations for executive stakeholders.
        </Callout>

        <Callout variant="evidence" title="Example External Evidence" source="Example Research Dataset (2026)">
          This is an example evidence callout demonstrating secondary market data alignment.
        </Callout>

        <Callout variant="context" title="Example Contextual Clarification">
          This is an example contextual background note providing relevant business framing for subsequent figures.
        </Callout>

        <Callout variant="note" title="Example Operational Note">
          This is an example operational footnote regarding data collection parameters or reporting cycles.
        </Callout>
      </section>

      {/* 10. METHODOLOGY & WARNINGS */}
      <section id="methodology" className="showcase-section">
        <SectionHeader
          title="Methodology & Limitation Boxes"
          subtitle="Dedicated components to document formal analytical models, limitations, and methodological boundaries."
        />
        <MethodologyBox
          tag="Econometric Specification"
          methodTitle="Example Multiple Linear Regression Model"
          formula="Sales = β₀ + β₁(Digital_Spend) + β₂(Offline_Spend) + β₃(Seasonal_Index) + ε"
          explanation="Example methodological documentation detailing regression coefficients, normality assumptions, and multicollinearity diagnostics (VIF < 5.0)."
          source="Standard Econometric Procedures · Section 4.2"
          limitation="Estimates assume stable market response curves and constant price elasticity during observed test windows."
        />

        <div className="showcase-grid cols-2">
          <WarningBox
            severity="warning"
            title="Correlation vs Causation Boundary"
            message="Statistical correlation between observed channels does not establish direct operational causation without controlled experimental validation."
          />
          <WarningBox
            severity="caution"
            title="Sample Disparity Caution"
            message="Secondary research samples cannot be compared directly without normalising for regional socioeconomic strata."
          />
        </div>
      </section>

      {/* 11. SOURCE CITATIONS */}
      <section id="citations" className="showcase-section">
        <SectionHeader
          title="Source Citations"
          subtitle="Compact inline footnotes and expanded bibliography citations."
        />
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Compact Inline Citations:</div>
            <SourceCitation
              sourceName="Counterpoint Research"
              date="2026"
              url="https://example.com/counterpoint"
            />
          </div>
          <div>
            <SourceCitation
              sourceName="World Bank"
              publisher="Development Data Group"
              date="April 2026"
              type="Macroeconomic Indicator"
              url="https://example.com/worldbank"
            />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Expanded Block Citation:</div>
            <SourceCitation
              expanded
              sourceName="IDC Worldwide Quarterly Mobile Phone Tracker"
              publisher="International Data Corporation"
              date="Q1 2026"
              type="Primary Market Dataset"
              url="https://example.com/idc"
            />
          </div>
        </div>
      </section>

      {/* 12. DATA STATUS & FEEDBACK STATES */}
      <section id="feedback" className="showcase-section">
        <SectionHeader
          title="System Feedback & Data States"
          subtitle="Status pills, restrained loading spinners, and informative non-technical error states."
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <DataStatusIndicator status="ready" />
          <DataStatusIndicator status="loading" />
          <DataStatusIndicator status="error" />
          <DataStatusIndicator status="no-data" />
          <DataStatusIndicator status="unavailable" />
        </div>

        <div className="showcase-grid cols-2">
          <LoadingState
            title="Example Loading State"
            subtext="Demonstrating subtle non-intrusive loading indicators"
            skeletonLines={3}
          />

          <ErrorState
            title="Example Data Notice"
            message="The requested analytical projection could not be retrieved from the backend service."
            canContinue={true}
            onRetry={() => alert('Retry triggered')}
            retryLabel="Retry Request"
          />
        </div>
      </section>
    </div>
  );
}

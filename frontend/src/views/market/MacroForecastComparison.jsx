import React from 'react';
import './MacroForecastComparison.css';

/**
 * MacroForecastComparison component adhering to Sections 18 & 43.
 * Clearly separates World Bank and IMF economic forecasts without averaging.
 */
export function MacroForecastComparison() {
  return (
    <section className="macro-forecast-container" aria-labelledby="macro-forecast-heading">
      <div className="macro-forecast-header">
        <div>
          <h4 id="macro-forecast-heading" className="macro-forecast-title">
            Indian Macroeconomic Growth Outlook & Forecasts
          </h4>
          <p className="macro-forecast-subtitle">
            Comparing independent economic baseline and forecast indicators. <em>Forecasts are presented separately by source and must not be averaged into a synthetic consensus.</em>
          </p>
        </div>
        <span className="macro-source-badge">Direct Macro Evidence</span>
      </div>

      <div className="macro-forecast-grid">
        {/* World Bank Evidence Block */}
        <div className="macro-source-card">
          <div className="macro-source-card-header">
            <span className="macro-org-name">World Bank</span>
            <span className="macro-pub-date">India Development Update (April 2026)</span>
          </div>

          <div className="macro-metrics-list">
            <div className="macro-metric-item">
              <div className="macro-metric-num-wrap">
                <span className="macro-val font-mono">7.6%</span>
                <span className="macro-type-tag observed">FY2026 Estimate</span>
              </div>
              <span className="macro-metric-desc">Robust economic expansion in prior fiscal year</span>
            </div>

            <div className="macro-metric-item highlight">
              <div className="macro-metric-num-wrap">
                <span className="macro-val font-mono">6.6%</span>
                <span className="macro-type-tag forecast">FY2027 Forecast</span>
              </div>
              <span className="macro-metric-desc">Projected growth moderation toward long-term trend</span>
            </div>

            <div className="macro-sub-metrics">
              <div className="macro-sub-item">
                <span className="macro-sub-label">Current Account Deficit:</span>
                <span className="macro-sub-val font-mono">1.0% of GDP</span>
              </div>
              <div className="macro-sub-item">
                <span className="macro-sub-label">General Govt Deficit:</span>
                <span className="macro-sub-val font-mono">7.4% of GDP</span>
              </div>
            </div>
          </div>
        </div>

        {/* IMF Evidence Block */}
        <div className="macro-source-card">
          <div className="macro-source-card-header">
            <span className="macro-org-name">International Monetary Fund (IMF)</span>
            <span className="macro-pub-date">WEO Update (July 2026 Briefing)</span>
          </div>

          <div className="macro-metrics-list">
            <div className="macro-metric-item highlight">
              <div className="macro-metric-num-wrap">
                <span className="macro-val font-mono">6.4%</span>
                <span className="macro-type-tag forecast">FY2026/27 Forecast</span>
              </div>
              <span className="macro-metric-desc">Near-term fiscal year projection</span>
            </div>

            <div className="macro-metric-item highlight">
              <div className="macro-metric-num-wrap">
                <span className="macro-val font-mono">6.7%</span>
                <span className="macro-type-tag forecast">CY2027 Forecast</span>
              </div>
              <span className="macro-metric-desc">Calendar year 2027 projected trajectory</span>
            </div>

            <div className="macro-imf-note">
              <p>
                <strong>Methodological Distinction:</strong> IMF forecasts maintain a slightly different fiscal timing and methodology from World Bank projections. Each estimate reflects its publishing institution's analytical assumptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="macro-footer-disclaimer">
        <strong>Strategic Caution:</strong> Macroeconomic GDP growth describes overall economic activity, not direct headphone unit demand or NEXA revenue. It provides an operational backdrop for consumer purchasing power.
      </div>
    </section>
  );
}

import React from 'react';
import './FormFactorChart.css';

/**
 * FormFactorChart component comparing TWS vs OWS (Sections 14 & 42).
 * Shows global shipment growth rates and the 2026-2030 OWS forecast with explicit labels.
 */
export function FormFactorChart() {
  return (
    <section className="form-factor-container" aria-labelledby="form-factor-title">
      <div className="ff-header">
        <div>
          <h4 id="form-factor-title" className="ff-title">
            Global Wireless-Audio Form-Factor Comparison (Q2 2026)
          </h4>
          <p className="ff-subtitle">
            Source: Omdia Personal Audio Market Tracker. <em>Different product form factors; global evidence.</em>
          </p>
        </div>
        <span className="ff-global-badge">Global Category Evidence</span>
      </div>

      <div className="ff-grid">
        {/* Metric 1: TWS Shipments */}
        <div className="ff-card">
          <div className="ff-card-top">
            <span className="ff-format-tag tws">Traditional TWS</span>
            <span className="ff-observed-badge">Observed Q2 2026</span>
          </div>
          <div className="ff-metric-main">
            <span className="ff-growth negative">-0.7%</span>
            <span className="ff-growth-label">YoY Shipment Change</span>
          </div>
          <div className="ff-details">
            <div className="ff-detail-row">
              <span className="ff-detail-label">Quarterly Volume:</span>
              <span className="ff-detail-val font-mono">82.1M units</span>
            </div>
            <div className="ff-detail-row">
              <span className="ff-detail-label">Market Dynamics:</span>
              <span className="ff-detail-val">Broadly flat mature market</span>
            </div>
          </div>
        </div>

        {/* Metric 2: OWS Shipments */}
        <div className="ff-card">
          <div className="ff-card-top">
            <span className="ff-format-tag ows">Open Wireless Stereo (OWS)</span>
            <span className="ff-observed-badge">Observed Q2 2026</span>
          </div>
          <div className="ff-metric-main">
            <span className="ff-growth positive">+12.0%</span>
            <span className="ff-growth-label">YoY Shipment Change</span>
          </div>
          <div className="ff-details">
            <div className="ff-detail-row">
              <span className="ff-detail-label">Quarterly Volume:</span>
              <span className="ff-detail-val font-mono">11.1M units</span>
            </div>
            <div className="ff-detail-row">
              <span className="ff-detail-label">Share of TWS:</span>
              <span className="ff-detail-val font-mono">13.5% (vs 12.0% in Q2 2025)</span>
            </div>
          </div>
        </div>

        {/* Metric 3: OWS Long-term Forecast */}
        <div className="ff-card forecast-card">
          <div className="ff-card-top">
            <span className="ff-format-tag ows">OWS Expansion Forecast</span>
            <span className="ff-forecast-badge">Reported Forecast</span>
          </div>
          <div className="ff-metric-main">
            <span className="ff-growth forecast">90.5M</span>
            <span className="ff-growth-label">Forecast Annual Units by 2030</span>
          </div>
          <div className="ff-details">
            <div className="ff-detail-row">
              <span className="ff-detail-label">2026 Starting Baseline:</span>
              <span className="ff-detail-val font-mono">43.9M units</span>
            </div>
            <div className="ff-detail-row">
              <span className="ff-detail-label">Forecast Trajectory:</span>
              <span className="ff-detail-val">Projected more than double by 2030</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ff-footer-note">
        <strong>Analytical Context:</strong> The contrast between broadly flat conventional TWS shipments and faster OWS growth indicates emerging form-factor diversification rather than category obsolescence.
      </div>
    </section>
  );
}

import React from 'react';
import { ExternalLink, Calendar, MapPin, Tag, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from '../../components/badges/StatusBadge';
import './MarketEvidenceCard.css';

/**
 * Reusable MarketEvidenceCard component for NEXA One Market & Macro Analysis.
 * Classifies evidence as Direct, Category Proxy, Macro, Trade/Supply-chain, or Manufacturing,
 * and explicitly separates forecasts from observed historical data.
 */
export function MarketEvidenceCard({ item, classification = 'Direct market evidence', businessImplication = null }) {
  if (!item) return null;

  // Determine forecast status
  const isForecast =
    (item.indicator || '').toLowerCase().includes('forecast') ||
    (item.measure || '').toLowerCase().includes('forecast') ||
    (item.period || '').toLowerCase().includes('2030') ||
    (item.period || '').toLowerCase().includes('fy27') ||
    (item.research_note || '').toLowerCase().includes('project') ||
    (item.research_note || '').toLowerCase().includes('forecast');

  // Badge variant mapping
  let classVariant = 'info';
  if (classification.toLowerCase().includes('proxy')) {
    classVariant = 'warning';
  } else if (classification.toLowerCase().includes('macro')) {
    classVariant = 'neutral';
  } else if (classification.toLowerCase().includes('supply') || classification.toLowerCase().includes('trade')) {
    classVariant = 'neutral';
  } else if (classification.toLowerCase().includes('manufacturing')) {
    classVariant = 'positive';
  }

  // Value formatting
  const isNumeric = typeof item.reported_value === 'number';
  const displayVal = isNumeric
    ? `${item.reported_value > 0 && item.measure?.includes('%') ? '+' : ''}${item.reported_value}${item.measure?.includes('%') ? '%' : ''}`
    : item.reported_value;

  const isIndia = (item.geography || '').toLowerCase().includes('india');

  return (
    <article
      className={`market-evidence-card ${isForecast ? 'is-forecast-card' : ''} ${isIndia ? 'is-india-card' : ''}`}
      aria-label={`Market Evidence: ${item.indicator} (${item.period})`}
    >
      {/* Top Header: Indicator & Classification Badges */}
      <div className="mec-header">
        <div className="mec-indicator-group">
          <span className="mec-indicator-name">{item.indicator}</span>
          {item.market_sector && (
            <span className="mec-sector-badge">{item.market_sector}</span>
          )}
        </div>

        <div className="mec-badge-group">
          <StatusBadge variant={classVariant} size="small">
            {classification}
          </StatusBadge>

          {isForecast ? (
            <span className="mec-forecast-chip forecast" title="Reported forecast estimate; not an observed historical outcome">
              Forecast
            </span>
          ) : (
            <span className="mec-forecast-chip observed" title="Observed empirical or reported tracker data">
              Observed
            </span>
          )}

          {isIndia && (
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          )}
        </div>
      </div>

      {/* Main Metric Display */}
      <div className="mec-metric-block">
        <div className="mec-metric-row">
          <span className={`mec-metric-value ${isNumeric && item.reported_value < 0 ? 'is-negative' : ''}`}>
            {displayVal}
          </span>
          {item.measure && (
            <span className="mec-metric-measure">
              {item.measure.includes('%') ? 'Year-over-Year' : item.measure}
            </span>
          )}
        </div>

        <p className="mec-note-text">{item.research_note}</p>
      </div>

      {/* Separated Business Implication (if provided) */}
      {businessImplication && (
        <div className="mec-implication-block">
          <span className="mec-implication-label">Business Implication for NEXA One</span>
          <p className="mec-implication-text">{businessImplication}</p>
        </div>
      )}

      {/* Metadata & Source Traceability Footer */}
      <footer className="mec-footer">
        <div className="mec-meta-grid">
          <div className="mec-meta-item">
            <span className="mec-meta-label">Period</span>
            <span className="mec-meta-value">{item.period}</span>
          </div>

          <div className="mec-meta-item">
            <span className="mec-meta-label">Geography</span>
            <span className="mec-meta-value">{item.geography}</span>
          </div>

          <div className="mec-meta-item mec-meta-source">
            <span className="mec-meta-label">Source</span>
            <span className="mec-meta-value">{item.publisher || item.source}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}

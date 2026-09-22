import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/badges/StatusBadge';
import './ResearchEvidenceCard.css';

/**
 * Reusable research evidence card for NEXA One Customer Purchase Drivers.
 * Preserves original source reporting, context, and methodology without cross-study pooling.
 */
export function ResearchEvidenceCard({ item }) {
  if (!item) return null;

  const isIndia =
    (item.geography || '').toLowerCase().includes('india') ||
    (item.research_note || '').toLowerCase().includes('india');

  const isQuantitative =
    item.reported_value !== null &&
    item.reported_value !== undefined &&
    typeof item.reported_value === 'number';

  const evidenceTypeLabel = isQuantitative
    ? 'Quantitative'
    : (item.evidence_type || 'Qualitative');

  return (
    <article
      className={`research-evidence-card ${isIndia ? 'is-india-evidence' : ''}`}
      aria-label={`Evidence: ${item.purchase_factor} from ${item.source}`}
    >
      {/* Top Bar: Factor & Badges */}
      <div className="rec-header">
        <div className="rec-factor-group">
          <span className="rec-factor-name">{item.purchase_factor}</span>
          {item.product_category && (
            <span className="rec-category-badge">{item.product_category}</span>
          )}
        </div>

        <div className="rec-badge-group">
          {isIndia ? (
            <StatusBadge variant="evidence-india" size="small" dot>
              India
            </StatusBadge>
          ) : (
            <StatusBadge variant="evidence-global" size="small">
              Global
            </StatusBadge>
          )}

          <StatusBadge
            variant={isQuantitative ? 'info' : 'neutral'}
            size="small"
          >
            {evidenceTypeLabel}
          </StatusBadge>
        </div>
      </div>

      {/* Main Metric / Finding Section */}
      <div className="rec-body">
        {isQuantitative ? (
          <div className="rec-quantitative-block">
            <div className="rec-value-display">
              <span className="rec-metric-val">
                {item.reported_value}
                {item.measure?.includes('%') ? '%' : ''}
              </span>
              <span className="rec-metric-measure">
                {item.measure && !item.measure.includes('%') ? item.measure : 'of respondents'}
              </span>
            </div>
            <p className="rec-finding-text">{item.research_note}</p>
          </div>
        ) : (
          <div className="rec-qualitative-block">
            <div className="rec-qualitative-tag">
              <FileText size={14} aria-hidden="true" />
              <span>Reported Finding</span>
            </div>
            <p className="rec-finding-text">{item.research_note}</p>
          </div>
        )}
      </div>

      {/* Metadata & Traceability Footer */}
      <footer className="rec-footer">
        <div className="rec-metadata-grid">
          <div className="rec-meta-item">
            <span className="rec-meta-label">Source</span>
            <span className="rec-meta-value">{item.source}</span>
          </div>

          <div className="rec-meta-item">
            <span className="rec-meta-label">Year</span>
            <span className="rec-meta-value">{item.year || 'N/A'}</span>
          </div>

          <div className="rec-meta-item">
            <span className="rec-meta-label">Geography</span>
            <span className="rec-meta-value">{item.geography || 'Not specified'}</span>
          </div>

          <div className="rec-meta-item rec-meta-sample">
            <span className="rec-meta-label">Sample Basis</span>
            <span className="rec-meta-value">
              {item.sample_basis || 'Not reported in source'}
            </span>
          </div>
        </div>

        {item.source_link && (
          <div className="rec-link-action">
            <a
              href={item.source_link}
              target="_blank"
              rel="noopener noreferrer"
              className="rec-link"
              aria-label={`View source document for ${item.source}`}
            >
              <span>Source Document</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        )}
      </footer>
    </article>
  );
}

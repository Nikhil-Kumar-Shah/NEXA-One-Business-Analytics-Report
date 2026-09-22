import React from 'react';
import { ExternalLink, Database } from 'lucide-react';
import { DATASET_LINKS } from '../../config/datasetLinks';
import './DatasetSourceLink.css';

/**
 * Reusable contextual dataset source link.
 * Adheres to report styling: subtle metadata label, external link icon, no giant CTA buttons.
 *
 * @param {'advertising' | 'customerResearch' | 'marketMacro'} datasetKey
 * @param {string} [label] Custom link text
 * @param {'inline' | 'card' | 'badge'} [variant='inline'] Visual variant
 */
export function DatasetSourceLink({
  datasetKey,
  label,
  variant = 'inline',
  className = '',
}) {
  const item = DATASET_LINKS[datasetKey];
  if (!item) return null;

  const displayLabel = label || `View ${item.shortTitle.toLowerCase()} ↗`;

  if (variant === 'badge') {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`dataset-badge-link ${className}`}
        title={`Open published ${item.title} (Google Sheets)`}
      >
        <Database size={12} className="dataset-icon" aria-hidden="true" />
        <span className="dataset-badge-text">{displayLabel}</span>
        <ExternalLink size={11} className="dataset-external-icon" aria-hidden="true" />
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`dataset-source-card ${className}`}>
        <div className="dataset-card-meta">
          <Database size={15} className="dataset-icon" aria-hidden="true" />
          <span className="dataset-card-tag">Published Dataset · Google Sheets</span>
        </div>
        <div className="dataset-card-body">
          <span className="dataset-card-title">{item.title}</span>
          <p className="dataset-card-desc">{item.description}</p>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="dataset-card-action"
        >
          <span>Open Published Workbook</span>
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`dataset-inline-link ${className}`}
      title={`Open published ${item.title} in Google Sheets`}
    >
      <span className="dataset-inline-label">{displayLabel}</span>
      <ExternalLink size={12} className="dataset-external-icon" aria-hidden="true" />
    </a>
  );
}

import React from 'react';
import './Feedback.css';

export function LoadingState({
  title = 'Loading analytical dataset...',
  subtext = 'Processing model and verifying confidence intervals',
  skeletonLines = 0,
  className = '',
}) {
  return (
    <div className={`loading-state-container ${className}`} role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <h4 className="loading-text">{title}</h4>
      {subtext && <p className="loading-subtext">{subtext}</p>}

      {skeletonLines > 0 && (
        <div style={{ width: '100%', maxWidth: '400px', marginTop: 'var(--space-4)' }}>
          {Array.from({ length: skeletonLines }).map((_, i) => (
            <div
              key={i}
              className="skeleton-line"
              style={{ width: `${85 - (i % 3) * 15}%`, margin: '0 auto var(--space-2)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

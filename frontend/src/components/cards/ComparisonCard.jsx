import React from 'react';
import './Cards.css';

export function ComparisonCard({
  title,
  subtitle,
  leftLabel,
  leftValue,
  leftContext,
  rightLabel,
  rightValue,
  rightContext,
  className = '',
}) {
  return (
    <div className={`comparison-card ${className}`}>
      <div className="comparison-header">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      <div className="comparison-grid">
        <div className="comparison-col">
          <span className="comparison-col-label">{leftLabel}</span>
          <span className="comparison-col-value">{leftValue}</span>
          {leftContext && <span className="comparison-col-context">{leftContext}</span>}
        </div>
        <div className="comparison-col">
          <span className="comparison-col-label">{rightLabel}</span>
          <span className="comparison-col-value">{rightValue}</span>
          {rightContext && <span className="comparison-col-context">{rightContext}</span>}
        </div>
      </div>
    </div>
  );
}

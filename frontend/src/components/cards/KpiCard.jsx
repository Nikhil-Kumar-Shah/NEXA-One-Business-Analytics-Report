import React from 'react';
import './Cards.css';

export function KpiCard({
  label,
  value,
  unit,
  context,
  status = null, // 'positive' | 'negative' | 'neutral'
  delta = null,
  badge = null,
  compact = false,
  className = '',
}) {
  return (
    <div className={`kpi-card ${compact ? 'compact' : ''} ${className}`}>
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {badge && <div className="kpi-badge">{badge}</div>}
      </div>

      <div className="kpi-value-container">
        <span className="kpi-value">{value}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>

      {(context || delta) && (
        <div className="kpi-context">
          {delta && (
            <span className={`kpi-delta ${status || 'neutral'}`}>
              {delta}
            </span>
          )}{' '}
          {context}
        </div>
      )}
    </div>
  );
}

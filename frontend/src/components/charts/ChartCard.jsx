import React from 'react';
import './ChartCard.css';

export function ChartCard({
  title,
  description,
  children,
  legend = [], // Array<{ label: string, color: string }>
  source = null,
  methodologyNote = null,
  actions = null,
  minHeight = 280,
  className = '',
}) {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-header">
        <div>
          {title && <h3 className="chart-title">{title}</h3>}
          {description && <p className="chart-description">{description}</p>}
        </div>
        {actions && <div className="chart-actions">{actions}</div>}
      </div>

      {legend && legend.length > 0 && (
        <div className="chart-legend">
          {legend.map((item, idx) => (
            <div key={idx} className="chart-legend-item">
              <span
                className="chart-legend-indicator"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="chart-canvas-container"
        style={{ minHeight: `${minHeight}px` }}
      >
        {children || (
          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-small)' }}>
            [Chart Area Placeholder]
          </span>
        )}
      </div>

      {(source || methodologyNote) && (
        <div className="chart-footer">
          {source && <span className="chart-source">{source}</span>}
          {methodologyNote && (
            <span className="chart-methodology-note">{methodologyNote}</span>
          )}
        </div>
      )}
    </div>
  );
}

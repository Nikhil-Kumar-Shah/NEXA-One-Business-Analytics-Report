import React from 'react';
import './AnalyticalDarkPanel.css';

export function AnalyticalDarkPanel({
  badge = 'THE CORE FINDING',
  title,
  statement,
  stats = [],
  action,
  className = '',
}) {
  return (
    <div className={`vl-dark-panel ${className}`}>
      {badge && <div className="vl-dark-panel__badge">{badge}</div>}

      {title && <h3 className="vl-dark-panel__title font-heading">{title}</h3>}

      {statement && <p className="vl-dark-panel__statement">{statement}</p>}

      {stats && stats.length > 0 && (
        <div className="vl-dark-panel__stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="vl-dark-panel__stat-item">
              <div className="vl-dark-panel__stat-row">
                <span className="vl-dark-panel__stat-label">{stat.label}</span>
                <span
                  className={`vl-dark-panel__stat-value font-mono ${
                    stat.highlight ? 'vl-dark-panel__stat-value--accent' : ''
                  }`}
                >
                  {stat.value}
                </span>
              </div>
              {stat.supportingText && (
                <p className="vl-dark-panel__stat-support font-sans">{stat.supportingText}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {action && <div className="vl-dark-panel__action">{action}</div>}
    </div>
  );
}

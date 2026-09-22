import React from 'react';
import './Cards.css';

export function InsightCard({
  category = 'Analytical Result',
  title,
  children,
  badge = null,
  className = '',
}) {
  return (
    <div className={`insight-card ${className}`}>
      <div className="insight-eyebrow">
        <span className="insight-category">{category}</span>
        {badge && <div className="insight-badge">{badge}</div>}
      </div>
      {title && <h3 className="insight-title">{title}</h3>}
      <div className="insight-body">{children}</div>
    </div>
  );
}

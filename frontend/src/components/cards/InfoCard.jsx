import React from 'react';
import './Cards.css';

export function InfoCard({
  title,
  subtitle,
  children,
  footer,
  action,
  variant = 'standard', // 'standard' | 'compact'
  borderAccent = null, // 'accent' | 'positive' | 'warning' | 'negative'
  className = '',
}) {
  const borderClass = borderAccent ? `bordered-${borderAccent}` : '';

  return (
    <div className={`report-card ${variant} ${borderClass} ${className}`}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}

      <div className="card-body">{children}</div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

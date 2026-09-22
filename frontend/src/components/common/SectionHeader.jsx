import React from 'react';
import './SectionHeader.css';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  actions = null,
  divider = true,
  className = '',
}) {
  return (
    <div className={`section-header ${divider ? 'with-divider' : ''} ${className}`}>
      <div className="section-header-content">
        {eyebrow && <div className="section-header-eyebrow">{eyebrow}</div>}
        <h2 className="section-header-title">{title}</h2>
        {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="section-header-actions">{actions}</div>}
    </div>
  );
}

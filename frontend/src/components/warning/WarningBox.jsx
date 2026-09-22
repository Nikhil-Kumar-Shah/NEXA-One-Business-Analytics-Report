import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './WarningBox.css';

const SEVERITY_MAP = {
  info: { label: 'Analytical Note', icon: Info },
  warning: { label: 'Methodological Limitation', icon: AlertTriangle },
  caution: { label: 'Analytical Caution', icon: AlertCircle },
};

export function WarningBox({
  title,
  message,
  severity = 'warning', // 'info' | 'warning' | 'caution'
  source = null,
  className = '',
}) {
  const config = SEVERITY_MAP[severity] || SEVERITY_MAP.warning;
  const Icon = config.icon;

  return (
    <div
      className={`warning-box severity-${severity} ${className}`}
      role="alert"
    >
      <div className="warning-header">
        <Icon size={16} />
        <span className="warning-badge">{config.label}</span>
        {title && <span className="warning-title">— {title}</span>}
      </div>

      <p className="warning-message">{message}</p>

      {source && <div className="warning-source">Citation: {source}</div>}
    </div>
  );
}

import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  FileText,
  Compass,
  Database
} from 'lucide-react';
import './Callout.css';

const VARIANT_CONFIG = {
  insight: { label: 'Insight', icon: Lightbulb },
  'key-finding': { label: 'Key Finding', icon: CheckCircle2 },
  context: { label: 'Context', icon: HelpCircle },
  note: { label: 'Note', icon: FileText },
  decision: { label: 'Strategic Decision', icon: Compass },
  evidence: { label: 'Evidence', icon: Database },
};

export function Callout({
  variant = 'insight', // 'insight' | 'key-finding' | 'context' | 'note' | 'decision' | 'evidence'
  title,
  children,
  source = null,
  hideIcon = false,
  className = '',
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.insight;
  const Icon = config.icon;

  return (
    <aside className={`report-callout variant-${variant} ${className}`} role="note">
      <div className="callout-header">
        <div className="callout-title-row">
          {!hideIcon && <Icon size={16} className="callout-icon" />}
          <span className="callout-badge">{config.label}</span>
          {title && <span className="callout-title">— {title}</span>}
        </div>
      </div>

      <div className="callout-body">{children}</div>

      {source && <div className="callout-source">Source: {source}</div>}
    </aside>
  );
}

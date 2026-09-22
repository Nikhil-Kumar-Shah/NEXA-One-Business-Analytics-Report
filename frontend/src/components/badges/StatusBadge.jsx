import React from 'react';
import './StatusBadge.css';

const VARIANT_MAP = {
  // Preset aliases
  'Significant': 'positive',
  'Not significant': 'warning',
  'Positive relationship': 'positive',
  'Negative relationship': 'negative',
  'Review': 'warning',
  'Within range': 'positive',
  'India evidence': 'evidence-india',
  'Global evidence': 'evidence-global',
  'Primary evidence': 'evidence-primary',
  'Supporting evidence': 'evidence-supporting',
};

export function StatusBadge({
  children,
  variant, // 'positive' | 'negative' | 'warning' | 'info' | 'neutral' | 'evidence-india' | 'evidence-global' | etc.
  dot = false,
  size = 'medium', // 'medium' | 'small'
  className = '',
}) {
  // Auto-resolve variant if passed predefined text string
  const resolvedVariant = variant || VARIANT_MAP[children] || 'neutral';

  return (
    <span className={`status-badge variant-${resolvedVariant} size-${size} ${className}`}>
      {dot && <span className="status-badge-dot" />}
      <span>{children}</span>
    </span>
  );
}

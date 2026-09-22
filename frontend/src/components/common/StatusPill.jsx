import React from 'react';
import './StatusPill.css';

export function StatusPill({
  children,
  variant = 'neutral', // 'neutral' | 'accent' | 'dark' | 'success' | 'warning' | 'muted'
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  return (
    <span className={`vl-status-pill vl-status-pill--${variant} vl-status-pill--${size} ${className}`}>
      {children}
    </span>
  );
}

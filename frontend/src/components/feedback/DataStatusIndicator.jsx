import React from 'react';
import './Feedback.css';

const STATUS_LABELS = {
  ready: 'Ready',
  loading: 'Loading',
  error: 'Error',
  'no-data': 'No data',
  unavailable: 'Data unavailable',
};

export function DataStatusIndicator({
  status = 'ready', // 'ready' | 'loading' | 'error' | 'no-data' | 'unavailable'
  label = null,
  className = '',
}) {
  const displayLabel = label || STATUS_LABELS[status] || status;

  return (
    <div className={`data-status-badge data-status-${status} ${className}`}>
      <span className="data-status-dot" />
      <span>{displayLabel}</span>
    </div>
  );
}

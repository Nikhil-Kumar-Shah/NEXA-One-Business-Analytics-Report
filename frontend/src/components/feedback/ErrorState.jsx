import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './Feedback.css';

export function ErrorState({
  title = 'Data Retrieval Notice',
  message = 'Unable to complete the analytical data request at this time.',
  canContinue = true,
  onRetry = null,
  retryLabel = 'Retry Calculation',
  className = '',
}) {
  return (
    <div className={`error-state-container ${className}`} role="alert">
      <div className="error-header">
        <AlertCircle size={20} />
        <h4 className="error-title">{title}</h4>
      </div>

      <p className="error-message">{message}</p>

      <div className="error-footer">
        {onRetry && (
          <button
            type="button"
            className="error-retry-btn"
            onClick={onRetry}
          >
            <RefreshCw size={14} />
            <span>{retryLabel}</span>
          </button>
        )}
        <span className="error-note">
          {canContinue
            ? 'Remaining sections of the report remain operational and accessible.'
            : 'Please check network connectivity or refresh the report.'}
        </span>
      </div>
    </div>
  );
}

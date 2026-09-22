import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import './Cards.css';

export function SourceCard({
  sourceName,
  publisher,
  year,
  type,
  coverage,
  url,
  relevance,
  className = '',
}) {
  return (
    <div className={`report-card standard ${className}`}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <BookOpen size={16} color="var(--color-text-muted)" />
          <h3 className="card-title" style={{ fontSize: 'var(--text-body-large)' }}>{sourceName}</h3>
        </div>
        {type && (
          <span style={{
            fontSize: 'var(--text-caption)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-secondary)',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)'
          }}>
            {type}
          </span>
        )}
      </div>

      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-small)' }}>
          {publisher && (
            <>
              <span style={{ color: 'var(--color-text-muted)' }}>Publisher:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{publisher}</span>
            </>
          )}
          {year && (
            <>
              <span style={{ color: 'var(--color-text-muted)' }}>Period:</span>
              <span>{year}</span>
            </>
          )}
          {coverage && (
            <>
              <span style={{ color: 'var(--color-text-muted)' }}>Coverage:</span>
              <span>{coverage}</span>
            </>
          )}
        </div>

        {relevance && (
          <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            {relevance}
          </p>
        )}
      </div>

      {url && (
        <div className="card-footer">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-small)',
              textDecoration: 'none'
            }}
          >
            <span>View Source</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

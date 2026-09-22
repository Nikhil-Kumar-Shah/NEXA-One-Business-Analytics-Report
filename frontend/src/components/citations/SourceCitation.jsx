import React from 'react';
import { ExternalLink } from 'lucide-react';
import './SourceCitation.css';

export function SourceCitation({
  sourceName,
  publisher,
  date,
  type,
  url,
  expanded = false,
  className = '',
}) {
  const parts = [
    sourceName || publisher,
    publisher && sourceName && publisher !== sourceName ? publisher : null,
    date,
    type,
  ].filter(Boolean);

  if (expanded) {
    return (
      <div className={`source-citation expanded ${className}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="source-citation-prefix">Data Source:</span>
          <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>
            {sourceName}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '11px' }}>
          {publisher && <span>{publisher}</span>}
          {publisher && date && <span>·</span>}
          {date && <span>{date}</span>}
          {type && <span>·</span>}
          {type && <span>{type}</span>}
          {url && (
            <>
              <span>·</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-citation-link"
              >
                <span>External Link</span>
                <ExternalLink size={10} />
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`source-citation compact ${className}`}>
      <span className="source-citation-prefix">Source:</span>
      <span className="source-citation-body">
        {parts.map((p, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="source-citation-sep">·</span>}
            <span>{p}</span>
          </React.Fragment>
        ))}
        {url && (
          <>
            <span className="source-citation-sep">·</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-citation-link"
              aria-label="View source documentation"
            >
              <ExternalLink size={11} />
            </a>
          </>
        )}
      </span>
    </div>
  );
}

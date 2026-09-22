import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';
import './MethodologyBox.css';

export function MethodologyBox({
  methodTitle,
  tag = 'Analytical Methodology',
  formula,
  explanation,
  source,
  limitation,
  className = '',
}) {
  return (
    <div className={`methodology-box ${className}`}>
      <div className="methodology-header">
        <div>
          {tag && <span className="methodology-tag">{tag}</span>}
          {methodTitle && <h3 className="methodology-title">{methodTitle}</h3>}
        </div>
      </div>

      {formula && (
        <div className="methodology-formula" role="region" aria-label="Mathematical formula or specification">
          <code>{formula}</code>
        </div>
      )}

      {explanation && (
        <div className="methodology-explanation">{explanation}</div>
      )}

      {(source || limitation) && (
        <div className="methodology-meta">
          {source && (
            <div className="methodology-source">
              <BookOpen size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Reference:</strong> {source}
              </span>
            </div>
          )}
          {limitation && (
            <div className="methodology-limitation">
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Methodological Limitation:</strong> {limitation}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

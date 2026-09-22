import React from 'react';
import {
  ShieldAlert,
  Layers,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Calendar,
  CheckCircle,
  Compass,
} from 'lucide-react';
import './RecommendationCard.css';

/**
 * Structured card displaying a single strategic recommendation with comprehensive evidence trail.
 */
export function RecommendationCard({ rec, index }) {
  if (!rec) return null;

  return (
    <article
      className="rec-card"
      id={`rec-${rec.id.toLowerCase()}`}
      aria-labelledby={`rec-title-${rec.id}`}
    >
      {/* Header */}
      <div className="rec-card-header">
        <div className="rec-card-meta">
          <span className="rec-badge font-mono">RECOMMENDATION {rec.id.replace('R', '')}</span>
          <span className="rec-role-badge">{rec.business_role}</span>
        </div>
        <h3 id={`rec-title-${rec.id}`} className="rec-title font-heading">
          {rec.title}
        </h3>
      </div>

      {/* 1. Action Block */}
      <div className="rec-block action-block">
        <span className="rec-block-label">Action</span>
        <p className="rec-block-content action-text">{rec.action}</p>
      </div>

      {/* 2. Why Block */}
      <div className="rec-block why-block">
        <span className="rec-block-label">Why</span>
        <p className="rec-block-content">{rec.why}</p>
      </div>

      {/* 3. Evidence Block */}
      <div className="rec-block evidence-block">
        <div className="rec-evidence-header">
          <span className="rec-block-label">Evidence</span>
          <span className="rec-source-trace">{rec.source_layer}</span>
        </div>
        <ul className="rec-evidence-list">
          {rec.evidence.map((item, idx) => (
            <li key={`ev-${idx}`} className="font-mono">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Expected Business Role */}
      <div className="rec-block role-block">
        <span className="rec-block-label">Expected Business Role</span>
        <p className="rec-block-content">{rec.business_role_desc}</p>
      </div>

      {/* 5. Risk Block */}
      <div className="rec-block risk-block">
        <div className="rec-risk-header">
          <ShieldAlert size={15} className="rec-risk-icon" aria-hidden="true" />
          <span className="rec-block-label risk-label">Risk & Limitations</span>
        </div>
        <p className="rec-block-content risk-text">{rec.risk}</p>
      </div>

      {/* 6. Implementation Consideration */}
      <div className="rec-block impl-block">
        <span className="rec-block-label">Implementation Consideration</span>
        <p className="rec-block-content">{rec.implementation}</p>
      </div>

      {/* 7. Measurement */}
      <div className="rec-block measure-block">
        <span className="rec-block-label">Measurement</span>
        <p className="rec-block-content">{rec.measurement}</p>
      </div>

      {/* Footer: Priority & Validation */}
      <div className="rec-card-footer">
        <div className="rec-footer-item">
          <Calendar size={14} aria-hidden="true" />
          <span>
            <strong>Priority:</strong> {rec.priority}
          </span>
        </div>
        <div className="rec-footer-item">
          <CheckCircle size={14} aria-hidden="true" />
          <span>
            <strong>Validation:</strong> {rec.validation}
          </span>
        </div>
      </div>
    </article>
  );
}

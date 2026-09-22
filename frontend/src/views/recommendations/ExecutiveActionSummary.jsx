import React from 'react';
import { Target, AlertCircle } from 'lucide-react';
import './ExecutiveActionSummary.css';

/**
 * Executive Action Summary: Top-level 5 primary actions with explicit budget boundary.
 */
export function ExecutiveActionSummary() {
  const actions = [
    {
      num: '01',
      title: 'Maintain strong attention on TV and social media.',
      tag: 'Channel Focus',
    },
    {
      num: '02',
      title: 'Reconsider print and require evidence of incremental value.',
      tag: 'Channel Validation',
    },
    {
      num: '03',
      title: 'Build messaging around recurring customer needs and product value.',
      tag: 'Product Messaging',
    },
    {
      num: '04',
      title: 'Test before making major channel-allocation changes.',
      tag: 'Measurement & Attribution',
    },
    {
      num: '05',
      title: 'Monitor market, affordability, form-factor and supply-chain conditions.',
      tag: 'Risk & Macro Tracking',
    },
  ];

  return (
    <section className="exec-action-summary" aria-labelledby="exec-action-heading">
      <div className="exec-action-header">
        <Target size={20} className="exec-action-icon" aria-hidden="true" />
        <div>
          <h2 id="exec-action-heading" className="exec-action-title">
            Recommended Actions
          </h2>
          <p className="exec-action-subtitle">
            Five strategic imperatives derived directly from cross-domain empirical evidence.
          </p>
        </div>
      </div>

      <div className="exec-action-grid">
        {actions.map((act) => (
          <div key={act.num} className="exec-action-card">
            <div className="exec-action-card-header">
              <span className="exec-action-num font-mono">{act.num}</span>
              <span className="exec-action-tag">{act.tag}</span>
            </div>
            <p className="exec-action-card-text">{act.title}</p>
          </div>
        ))}
      </div>

      <div className="exec-action-boundary">
        <AlertCircle size={16} className="exec-boundary-icon" aria-hidden="true" />
        <p className="exec-action-boundary-text">
          These actions translate the available evidence into a practical planning framework. They do not
          represent a fixed budget allocation because the current dataset does not contain channel cost,
          margin or causal incremental-return information.
        </p>
      </div>
    </section>
  );
}

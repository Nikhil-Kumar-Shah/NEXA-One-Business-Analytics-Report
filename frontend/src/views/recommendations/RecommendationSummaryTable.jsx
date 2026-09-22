import React from 'react';
import { Table, Info } from 'lucide-react';
import './RecommendationSummaryTable.css';

/**
 * Section 16: Summary table mapping all 9 recommendations to evidence, roles, priorities, and validation.
 */
export function RecommendationSummaryTable({ recommendations }) {
  const summaryRows = [
    {
      rec: 'Maintain Strong Attention on TV',
      evidence: 'TV r = 0.7822; positive multivariate coefficient',
      role: 'Reach / awareness / advertising contribution',
      priority: 'Next planning period',
      validation: 'Incremental-performance testing',
    },
    {
      rec: 'Maintain Strong Attention on Social Media',
      evidence: 'Social r = 0.5762; positive multivariate coefficient',
      role: 'Customer communication / measurable campaign execution',
      priority: 'Next planning period',
      validation: 'Controlled campaign testing',
    },
    {
      rec: 'Reconsider Print Investment',
      evidence: 'Print r = 0.2283; coefficient not statistically significant',
      role: 'Channel requiring validation',
      priority: 'Immediate review',
      validation: 'Incremental print testing',
    },
    {
      rec: 'Build Product-Centered Messaging',
      evidence: 'Recurring Q3 themes',
      role: 'Product-value communication',
      priority: 'Next campaign planning',
      validation: 'Message-level response measurement',
    },
    {
      rec: 'Make Value Explicit',
      evidence: 'Q3 price/value + Q4 premiumization evidence',
      role: 'Value communication',
      priority: 'Next campaign planning',
      validation: 'Message testing',
    },
    {
      rec: 'Test Before Major Budget Reallocation',
      evidence: 'No causal ROI available',
      role: 'Decision validation',
      priority: 'Before major allocation changes',
      validation: 'Controlled experiments',
    },
    {
      rec: 'Monitor Emerging Open-Ear Competition',
      evidence: 'OWS +12% YoY globally in Q2 2026',
      role: 'Competitive monitoring',
      priority: 'Ongoing',
      validation: 'Category tracking',
    },
    {
      rec: 'Monitor Affordability & Supply Chain',
      evidence: 'Consumer-electronics affordability proxy + trade evidence',
      role: 'Risk management',
      priority: 'Ongoing',
      validation: 'Market/cost monitoring',
    },
    {
      rec: 'Use a Recurring Evidence Review',
      evidence: 'Internal + customer + market evidence',
      role: 'Planning discipline',
      priority: 'Recurring',
      validation: 'Documented review cycle',
    },
  ];

  return (
    <section className="rec-summary-section" aria-labelledby="rec-summary-heading">
      <div className="rec-summary-header">
        <Table size={20} className="rec-summary-icon" aria-hidden="true" />
        <div>
          <h2 id="rec-summary-heading" className="rec-summary-title">
            Recommendation Summary
          </h2>
          <p className="rec-summary-subtitle">
            Structured overview of strategic actions, empirical backing, execution priority, and required validation.
          </p>
        </div>
      </div>

      <div className="rec-summary-table-wrapper">
        <table className="rec-summary-table">
          <thead>
            <tr>
              <th scope="col">Recommendation</th>
              <th scope="col">Primary Evidence</th>
              <th scope="col">Expected Business Role</th>
              <th scope="col">Priority for Action</th>
              <th scope="col">Key Validation</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, idx) => (
              <tr key={`summary-row-${idx}`}>
                <th scope="row" className="rec-summary-name-cell">
                  <strong>{row.rec}</strong>
                </th>
                <td className="rec-summary-evidence-cell font-mono">{row.evidence}</td>
                <td className="rec-summary-role-cell">{row.role}</td>
                <td className="rec-summary-priority-cell">
                  <span className="rec-priority-tag">{row.priority}</span>
                </td>
                <td className="rec-summary-val-cell">{row.validation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rec-priority-note">
        <Info size={15} aria-hidden="true" />
        <span>
          <strong>Methodological Note:</strong> "Priority for Action" is an implementation timing category,
          not a quality ranking. No numerical priority score or channel ranking is assigned.
        </span>
      </div>
    </section>
  );
}

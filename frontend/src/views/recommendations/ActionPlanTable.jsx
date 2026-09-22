import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import './ActionPlanTable.css';

/**
 * Section 18: Implementation responsibilities table with functional owners and decision gates.
 */
export function ActionPlanTable({ actions }) {
  const defaultActions = [
    {
      action: 'Review channel evidence',
      timing: 'Immediate',
      evidence_trigger: 'Q2 channel analysis',
      owner: 'Marketing leadership',
      output: 'Current channel assessment',
      decision_gate: 'Identify channels requiring validation',
    },
    {
      action: 'Design controlled channel tests',
      timing: 'Before campaign launch',
      evidence_trigger: 'Need for causal/incremental evidence',
      owner: 'Marketing + Analytics',
      output: 'Approved measurement design',
      decision_gate: 'Test is measurable before launch',
    },
    {
      action: 'Develop product-value messaging',
      timing: 'Campaign preparation',
      evidence_trigger: 'Q3 customer research',
      owner: 'Marketing / Brand',
      output: 'Messaging framework',
      decision_gate: 'Messages reflect recurring customer considerations',
    },
    {
      action: 'Launch measured campaigns',
      timing: 'Campaign period',
      evidence_trigger: 'Approved campaign and test design',
      owner: 'Marketing',
      output: 'Campaign performance data',
      decision_gate: 'Data quality sufficient for review',
    },
    {
      action: 'Review incremental performance',
      timing: 'Post-campaign',
      evidence_trigger: 'Campaign results',
      owner: 'Analytics',
      output: 'Performance assessment',
      decision_gate: 'Evidence sufficient for next allocation discussion',
    },
    {
      action: 'Update strategy',
      timing: 'Next planning cycle',
      evidence_trigger: 'Updated internal + external evidence',
      owner: 'Marketing leadership + Analytics',
      output: 'Updated strategy',
      decision_gate: 'Documented decision and assumptions',
    },
  ];

  const actionRows = actions && actions.length === 6 ? actions : defaultActions;

  return (
    <section className="action-table-section" aria-labelledby="action-table-heading">
      <div className="action-table-header">
        <UserCheck size={20} className="action-table-icon" aria-hidden="true" />
        <div>
          <h2 id="action-table-heading" className="action-table-title">
            Implementation Responsibilities & Decision Gates
          </h2>
          <p className="action-table-subtitle">
            Functional ownership, analytical triggers, required outputs, and governance decision gates.
          </p>
        </div>
      </div>

      <div className="action-table-wrapper">
        <table className="action-table">
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Timing</th>
              <th scope="col">Evidence Trigger</th>
              <th scope="col">Owner</th>
              <th scope="col">Output</th>
              <th scope="col">Decision Gate</th>
            </tr>
          </thead>
          <tbody>
            {actionRows.map((row, idx) => (
              <tr key={`act-row-${idx}`}>
                <th scope="row" className="action-name-cell">
                  <strong>{row.action}</strong>
                </th>
                <td className="action-timing-cell">
                  <span className="action-timing-tag">{row.timing}</span>
                </td>
                <td className="action-trigger-cell font-mono">{row.evidence_trigger}</td>
                <td className="action-owner-cell">
                  <span className="action-owner-badge">{row.owner}</span>
                </td>
                <td className="action-output-cell">{row.output}</td>
                <td className="action-gate-cell">
                  <div className="gate-container">
                    <ShieldCheck size={14} className="gate-icon" aria-hidden="true" />
                    <span>{row.decision_gate}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="action-table-note">
        <em>Governance note:</em> Owner values represent functional organizational roles, not named individuals.
      </p>
    </section>
  );
}

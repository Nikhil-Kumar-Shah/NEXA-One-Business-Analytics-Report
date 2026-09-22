import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './RiskRegisterTable.css';

/**
 * Section 10: "Risks Management Should Watch" (Section 17)
 * Six-risk governance register mapping analytical triggers to business impacts and management responses.
 */
export function RiskRegisterTable() {
  const risks = [
    {
      name: 'Advertising attribution risk',
      trigger: 'Regression identifies statistical relationships but does not establish causal ROI.',
      effect: 'Budget shifts based only on correlation or regression could misstate incremental contribution.',
      response: 'Use controlled tests and incremental-performance measurement.',
      severity: 'high',
    },
    {
      name: 'Print efficiency uncertainty',
      trigger: 'Print coefficient is not statistically significant.',
      effect: 'Continued spending may not generate measurable incremental sales in the observed model.',
      response: 'Require channel-specific evidence before maintaining or expanding investment.',
      severity: 'medium',
    },
    {
      name: 'Category maturity',
      trigger: 'India TWS market was broadly flat in 2025.',
      effect: 'Category-wide growth may not be sufficient to support volume expectations.',
      response: 'Focus on differentiation, value communication and measurable campaign execution.',
      severity: 'medium',
    },
    {
      name: 'Form-factor disruption',
      trigger: 'OWS shipments are growing globally.',
      effect: 'Customer attention may expand toward alternative wireless-audio formats.',
      response: 'Track competitive form-factor developments and customer response.',
      severity: 'medium',
    },
    {
      name: 'Affordability pressure',
      trigger: 'India smartphone shipments declined 13% YoY in Q2 2026 amid cited affordability and cost pressures.',
      effect: 'Discretionary electronics demand may become more price-sensitive.',
      response: 'Monitor pricing, value communication and demand indicators.',
      severity: 'high',
    },
    {
      name: 'Supply-chain volatility',
      trigger: 'Global trade inflation and component-category trade changes indicate continued external supply-chain dynamics.',
      effect: 'Input costs and product availability may become less predictable.',
      response: 'Monitor component costs, supplier conditions and inventory requirements.',
      severity: 'medium',
    },
  ];

  return (
    <section className="risk-register-container" aria-labelledby="risk-register-heading">
      <div className="rr-header">
        <div className="rr-title-wrap">
          <AlertTriangle size={20} className="rr-icon" aria-hidden="true" />
          <h2 id="risk-register-heading" className="rr-title">
            Risks Management Should Watch
          </h2>
        </div>
        <p className="rr-subtitle">
          Six operational, market, and analytical risks identified across internal modeling and external research.
        </p>
      </div>

      <div className="rr-table-wrapper">
        <table className="rr-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '22%' }}>Strategic Risk</th>
              <th scope="col" style={{ width: '26%' }}>Evidence / Analytical Trigger</th>
              <th scope="col" style={{ width: '26%' }}>Potential Business Effect</th>
              <th scope="col" style={{ width: '26%' }}>Management Response</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.name}>
                <th scope="row" className="rr-risk-cell">
                  <span className="rr-risk-name">{r.name}</span>
                </th>
                <td className="rr-trigger-cell">{r.trigger}</td>
                <td className="rr-effect-cell">{r.effect}</td>
                <td className="rr-response-cell">
                  <span className="rr-response-pill">{r.response}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

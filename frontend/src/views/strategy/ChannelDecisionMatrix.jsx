import React from 'react';
import { StatusBadge } from '../../components/badges/StatusBadge';
import './ChannelDecisionMatrix.css';

/**
 * Section 3: "Channel Decision Matrix" Table (Section 10)
 * Evaluates TV, Social Media, and Print combining statistical evidence and strategic direction without ranking.
 */
export function ChannelDecisionMatrix({ tvStats, socialStats, printStats }) {
  const matrixData = [
    {
      channel: 'TV',
      observedLabel: 'Strong positive relationship',
      observedValue: `r = ${tvStats?.sales_correlation ? tvStats.sales_correlation.toFixed(4) : '0.7822'}`,
      multivariateLabel: 'Positive coefficient',
      multivariateValue: `β ≈ ${tvStats?.coefficient ? (tvStats.coefficient > 0 ? '+' : '') + tvStats.coefficient.toFixed(5) : '+0.04576'}`,
      multivariateStatus: 'Significant at α = 0.05',
      interpretation:
        'TV shows the strongest observed correlation with sales among the three channels and remains positively associated with sales in the multivariate model.',
      decisionDirection:
        'Maintain strong attention; validate incremental return before increasing spend.',
      actionType: 'primary',
    },
    {
      channel: 'Social Media',
      observedLabel: 'Moderate positive relationship',
      observedValue: `r = ${socialStats?.sales_correlation ? socialStats.sales_correlation.toFixed(4) : '0.5762'}`,
      multivariateLabel: 'Positive coefficient',
      multivariateValue: `β ≈ ${socialStats?.coefficient ? (socialStats.coefficient > 0 ? '+' : '') + socialStats.coefficient.toFixed(5) : '+0.18853'}`,
      multivariateStatus: 'Significant at α = 0.05',
      interpretation:
        'Social media shows a meaningful positive relationship with sales and a positive multivariate coefficient.',
      decisionDirection:
        'Maintain strong attention; test execution and incremental performance.',
      actionType: 'primary',
    },
    {
      channel: 'Print',
      observedLabel: 'Weaker positive relationship',
      observedValue: `r = ${printStats?.sales_correlation ? printStats.sales_correlation.toFixed(4) : '0.2283'}`,
      multivariateLabel: 'Not statistically significant',
      multivariateValue: `β ≈ ${printStats?.coefficient ? printStats.coefficient.toFixed(5) : '-0.00104'}`,
      multivariateStatus: 'Not significant at α = 0.05',
      interpretation:
        'Print has a weaker observed relationship with sales and does not provide statistically significant evidence of an independent relationship in the multivariate model.',
      decisionDirection:
        'Reconsider the role of print and require evidence of incremental value before maintaining or expanding spend.',
      actionType: 'reconsider',
    },
  ];

  return (
    <section className="channel-decision-matrix-container" aria-labelledby="cdm-heading">
      <div className="cdm-header">
        <h2 id="cdm-heading" className="cdm-title">Channel Decision Matrix</h2>
        <p className="cdm-subtitle">
          The channel decision combines statistical evidence with customer, market and execution
          considerations. It is not a numerical ranking.
        </p>
      </div>

      <div className="cdm-table-wrapper">
        <table className="cdm-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '14%' }}>Channel</th>
              <th scope="col" style={{ width: '20%' }}>Observed Sales Relationship</th>
              <th scope="col" style={{ width: '20%' }}>Multivariate Evidence</th>
              <th scope="col" style={{ width: '24%' }}>Strategic Interpretation</th>
              <th scope="col" style={{ width: '22%' }}>Decision Direction</th>
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row) => (
              <tr key={row.channel}>
                <th scope="row" className="cdm-channel-cell">
                  <span className="cdm-channel-name">{row.channel}</span>
                </th>
                <td className="cdm-obs-cell">
                  <span className="cdm-obs-label">{row.observedLabel}</span>
                  <span className="cdm-metric-val font-mono">{row.observedValue}</span>
                </td>
                <td className="cdm-multi-cell">
                  <span className="cdm-multi-label">{row.multivariateLabel}</span>
                  <span className="cdm-metric-val font-mono">{row.multivariateValue}</span>
                  <span className="cdm-sig-chip">{row.multivariateStatus}</span>
                </td>
                <td className="cdm-interp-cell">{row.interpretation}</td>
                <td className="cdm-direction-cell">
                  <div className={`cdm-direction-pill ${row.actionType}`}>
                    {row.decisionDirection}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cdm-footer-note">
        <strong>Governance Rule:</strong> The decision directions represent approved strategic directions based on internal statistical evidence and do not assign arbitrary scores, star ratings, or declare a single channel "winner."
      </div>
    </section>
  );
}

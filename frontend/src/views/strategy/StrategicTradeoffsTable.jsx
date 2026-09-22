import React from 'react';
import './StrategicTradeoffsTable.css';

/**
 * Section 17: "Key Strategic Trade-Offs" (Section 24)
 * Three core management trade-offs balancing statistical findings against operational realities.
 */
export function StrategicTradeoffsTable() {
  const tradeoffs = [
    {
      option: 'Increase concentration on stronger channels',
      benefit: 'Greater focus on channels with stronger observed sales relationships.',
      tradeoff: 'Could reduce reach through channels that serve other objectives not measured in the current model.',
      consideration: 'Validate incremental performance before major reallocation.',
    },
    {
      option: 'Reduce reliance on print',
      benefit: 'Limits investment in a channel with weaker observed statistical evidence.',
      tradeoff: 'Print may provide brand or audience effects not captured by the available sales model.',
      consideration: 'Test measurable incremental value before eliminating the channel.',
    },
    {
      option: 'Emphasize multiple product benefits',
      benefit: 'Reflects recurring customer considerations across independent research.',
      tradeoff: 'Multiple messages may reduce communication focus if not structured clearly.',
      consideration: 'Use a coherent product-value narrative rather than disconnected feature claims.',
    },
  ];

  return (
    <section className="strategic-tradeoffs-container" aria-labelledby="tradeoffs-heading">
      <div className="st-header">
        <h2 id="tradeoffs-heading" className="st-title">
          Key Strategic Trade-Offs
        </h2>
        <p className="st-subtitle">
          Balancing statistical evidence with practical market objectives, audience reach, and narrative coherence.
        </p>
      </div>

      <div className="st-table-wrapper">
        <table className="st-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '25%' }}>Strategic Option</th>
              <th scope="col" style={{ width: '25%' }}>Potential Benefit</th>
              <th scope="col" style={{ width: '25%' }}>Strategic Trade-Off</th>
              <th scope="col" style={{ width: '25%' }}>Decision Consideration</th>
            </tr>
          </thead>
          <tbody>
            {tradeoffs.map((t) => (
              <tr key={t.option}>
                <th scope="row" className="st-option-cell">
                  {t.option}
                </th>
                <td className="st-benefit-cell">{t.benefit}</td>
                <td className="st-tradeoff-cell">{t.tradeoff}</td>
                <td className="st-consider-cell">{t.consideration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

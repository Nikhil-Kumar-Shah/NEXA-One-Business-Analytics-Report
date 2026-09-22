import React from 'react';
import './StrategyDecisionLogicTable.css';

/**
 * Section 2: "Strategic Decision Logic" Table (Section 9)
 * Maps four evidence layers to strategy inputs and explicit analytical boundaries.
 */
export function StrategyDecisionLogicTable() {
  const rows = [
    {
      layer: 'Q1 — Advertising & Sales',
      shows: 'The combined advertising model explains 89.72% of the variation in observed sales.',
      informs: 'Advertising activity is relevant to the sales analysis and should remain part of planning.',
      doesNotEstablish: 'The model does not establish causal advertising ROI.',
    },
    {
      layer: 'Q2 — Channel Analysis',
      shows: 'TV and social media have stronger observed relationships with sales than print. Print is not statistically significant in the multivariate model.',
      informs: 'Channel attention should reflect the strength and limitations of the statistical evidence.',
      doesNotEstablish: 'The analysis does not establish an optimal budget allocation or incremental causal return.',
    },
    {
      layer: 'Q3 — Customer Research',
      shows: 'Multiple product and value considerations recur across independent research.',
      informs: 'Marketing communication should connect the product to meaningful customer benefits.',
      doesNotEstablish: 'It does not provide a NEXA-specific customer preference ranking.',
    },
    {
      layer: 'Q4 — Market & Macro',
      shows: 'Category maturity, premiumization, emerging OWS competition, affordability conditions and supply-chain dynamics are relevant external considerations.',
      informs: 'Planning should account for positioning, competitive form factors, affordability and operational uncertainty.',
      doesNotEstablish: 'It does not measure NEXA-specific market share, demand, elasticity or supply-chain cost.',
    },
  ];

  return (
    <section className="strategy-decision-logic-container" aria-labelledby="sdl-heading">
      <div className="sdl-header">
        <h2 id="sdl-heading" className="sdl-title">Strategic Decision Logic</h2>
        <p className="sdl-subtitle">
          The strategy is based on the intersection of four evidence layers. Advertising evidence indicates
          which channels have stronger observed relationships with sales; customer research indicates recurring
          product considerations; market research provides context on category conditions and risks.
        </p>
      </div>

      <div className="sdl-table-wrapper">
        <table className="sdl-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '22%' }}>Evidence Layer</th>
              <th scope="col" style={{ width: '28%' }}>What the Evidence Shows</th>
              <th scope="col" style={{ width: '26%' }}>How It Informs Strategy</th>
              <th scope="col" style={{ width: '24%' }}>What It Does Not Establish</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.layer}>
                <th scope="row" className="sdl-layer-cell">
                  {r.layer}
                </th>
                <td className="sdl-shows-cell">{r.shows}</td>
                <td className="sdl-informs-cell">{r.informs}</td>
                <td className="sdl-limit-cell">{r.doesNotEstablish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

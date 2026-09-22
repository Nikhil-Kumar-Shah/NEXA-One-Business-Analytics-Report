import React from 'react';
import { StatusBadge } from '../../components/badges/StatusBadge';
import './MarketEvidenceTable.css';

/**
 * MarketEvidenceTable component adhering to Section 26 ("Q4 Evidence Map").
 * Maps the core themes, observed evidence, explicit evidence classifications,
 * geography, period, and business relevance without confusing proxies with direct evidence.
 */
export function MarketEvidenceTable() {
  const tableData = [
    {
      theme: 'India TWS Market',
      evidence: 'Full-year 2025 broadly flat; Q4 2025 grew +12% YoY',
      type: 'Direct market evidence',
      typeVariant: 'info',
      geography: 'India',
      period: '2025 / Q4 2025',
      relevance: 'Category growth is mature and seasonal; differentiation and offer timing matter.',
    },
    {
      theme: 'Premiumization',
      evidence: 'Q1 2026 revenue rose +7% YoY while quarterly shipments declined',
      type: 'Direct market evidence',
      typeVariant: 'info',
      geography: 'India',
      period: 'Q1 2026',
      relevance: 'Higher value capture per unit; supports premium feature propositions if value is clear.',
    },
    {
      theme: 'TWS vs OWS Form Factors',
      evidence: 'Global TWS -0.7% YoY (82.1M); OWS +12.0% YoY (11.1M); OWS forecast 90.5M by 2030',
      type: 'Direct category evidence',
      typeVariant: 'info',
      geography: 'Global',
      period: 'Q2 2026 / 2030 (Forecast)',
      relevance: 'Form-factor diversification; competitive landscape extends beyond conventional TWS.',
    },
    {
      theme: 'Consumer Affordability Proxy',
      evidence: 'India smartphone shipments fell -13% YoY (33.9M units) amid rising memory costs & inflation',
      type: 'Category proxy',
      typeVariant: 'warning',
      geography: 'India',
      period: 'Q2 2026',
      relevance: 'Discretionary spending pressure in adjacent consumer tech; highlights price/value sensitivity.',
    },
    {
      theme: 'Indian Macro Environment',
      evidence: 'World Bank FY26 7.6% (FY27 forecast 6.6%); IMF FY27 forecast 6.4%, CY27 6.7%',
      type: 'Macro context',
      typeVariant: 'neutral',
      geography: 'India',
      period: 'FY2026–FY2027 (Forecasts)',
      relevance: 'Growing but moderating economic backdrop; positive macro context does not ensure unit demand.',
    },
    {
      theme: 'Global Trade Dynamics',
      evidence: 'Goods trade ~$13.7T H1 2026 (+12.5%); semiconductor (+25%), battery (+15%), ICT (+14%)',
      type: 'Direct trade evidence',
      typeVariant: 'info',
      geography: 'Global',
      period: 'H1 2026 / Q1 2026',
      relevance: 'Rapid trade expansion in core audio tech components alongside 3.6%–5% trade inflation.',
    },
    {
      theme: 'Supply Chain Integration',
      evidence: 'ICT goods >12% global exports; ~80% of ICT products produced in Asia',
      type: 'Supply-chain context',
      typeVariant: 'neutral',
      geography: 'Global / Asia',
      period: '2024 / 2026',
      relevance: 'Deep Asian supply-chain integration; component availability & cross-border logistics shape planning.',
    },
    {
      theme: 'India Electronics Manufacturing',
      evidence: '1 semiconductor fab, 8 ATMP/OSAT facilities, ₹1,131,358 Cr cumulative LSEM output',
      type: 'India manufacturing context',
      typeVariant: 'positive',
      geography: 'India',
      period: 'March 2026',
      relevance: 'Expanding domestic hardware ecosystem; contextual capability rather than NEXA-specific sourcing.',
    },
  ];

  return (
    <section className="market-evidence-table-container" aria-labelledby="q4-evidence-map-title">
      <div className="met-header">
        <div>
          <h3 id="q4-evidence-map-title" className="met-title">
            Q4 Evidence Map: External Market & Macro Context
          </h3>
          <p className="met-subtitle">
            Systematic classification distinguishing direct category evidence from adjacent proxies and broader macroeconomic context.
          </p>
        </div>
      </div>

      <div className="met-table-wrapper">
        <table className="met-table">
          <thead>
            <tr>
              <th scope="col">Research Theme</th>
              <th scope="col">Observed Evidence</th>
              <th scope="col">Evidence Classification</th>
              <th scope="col" className="text-center">Geography</th>
              <th scope="col">Period</th>
              <th scope="col">Business Relevance for NEXA One</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.theme}>
                <th scope="row" className="met-theme-cell">
                  {row.theme}
                </th>
                <td className="met-evidence-cell">{row.evidence}</td>
                <td className="met-type-cell">
                  <StatusBadge variant={row.typeVariant} size="small">
                    {row.type}
                  </StatusBadge>
                </td>
                <td className="text-center">
                  {row.geography === 'India' ? (
                    <StatusBadge variant="evidence-india" size="small" dot>
                      India
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant="evidence-global" size="small">
                      {row.geography}
                    </StatusBadge>
                  )}
                </td>
                <td className="met-period-cell font-mono">{row.period}</td>
                <td className="met-relevance-cell">{row.relevance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="met-footer-note">
        <strong>Classification Rule:</strong> Direct evidence describes the specific category/market; category proxies describe adjacent industries (e.g. smartphones); macroeconomic context describes broad economic environment. None should be confused with direct measurements of NEXA One performance.
      </div>
    </section>
  );
}

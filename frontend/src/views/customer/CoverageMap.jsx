import React from 'react';
import { StatusBadge } from '../../components/badges/StatusBadge';
import './CoverageMap.css';

/**
 * CoverageMap component for NEXA One Customer Purchase Drivers.
 * Shows research coverage by factor (number of mapped evidence records),
 * NOT customer preference, scores, or rankings.
 */
export function CoverageMap({ factorSynthesis, totalRecords }) {
  if (!factorSynthesis || factorSynthesis.length === 0) return null;

  // Major factor groupings for coverage overview
  const factorGroups = [
    { name: 'Sound quality', key: 'Sound quality', desc: 'Audio fidelity, clarity, and high-res audio considerations' },
    { name: 'Battery life', key: 'Battery life', desc: 'Playback duration, battery endurance, and charging speed' },
    { name: 'Comfort', key: 'Comfort', desc: 'Ergonomics, fit, in-ear comfort, and long-session wearability' },
    { name: 'Price / value', key: 'Price', desc: 'Affordability, price tiers, and budget planned expenditures' },
    { name: 'Call quality', key: 'Voice/call quality', desc: 'Microphone clarity and voice communication performance' },
    { name: 'Active Noise Cancellation (ANC)', key: 'ANC', desc: 'Active noise reduction and acoustic isolation features' },
    { name: 'Ease of use / compatibility', key: 'Ease of use', desc: 'Bluetooth pairing, smartphone compatibility, and controls' },
    { name: 'Design / aesthetics', key: 'Design/design', desc: 'Physical appearance, style, and build aesthetics' },
    { name: 'Brand reputation', key: 'Brand', desc: 'Brand recognition and manufacturer familiarity' },
    { name: 'Other supporting factors', key: 'Other', desc: 'Durability, weight, online reviews, and sales channel preference' },
  ];

  return (
    <section className="coverage-map-container" aria-labelledby="coverage-map-heading">
      <div className="coverage-map-header">
        <div>
          <h4 id="coverage-map-heading" className="coverage-map-title">
            Research Coverage by Factor
          </h4>
          <p className="coverage-map-subtitle">
            Overview of how evidence records are distributed across product and purchase considerations.
            Record counts indicate research coverage across reviewed publications, <strong>not</strong> customer importance or preference rankings.
          </p>
        </div>
        <div className="coverage-map-total-pill">
          <span className="coverage-total-count">{totalRecords || 57}</span>
          <span className="coverage-total-label">Total Evidence Records</span>
        </div>
      </div>

      <div className="coverage-map-table-wrapper">
        <table className="coverage-map-table">
          <thead>
            <tr>
              <th scope="col">Product / Purchase Factor</th>
              <th scope="col">Coverage Description</th>
              <th scope="col" className="text-center">Mapped Records</th>
              <th scope="col" className="text-center">Quantitative Data</th>
              <th scope="col" className="text-center">Qualitative Data</th>
              <th scope="col" className="text-center">India Evidence</th>
            </tr>
          </thead>
          <tbody>
            {factorGroups.map((group) => {
              const matched = factorSynthesis.find((f) => f.factor === group.key);
              const isOther = group.key === 'Other';

              // If other, aggregate non-primary items
              let quantCount = matched ? matched.quantitative_observations : 0;
              let hasQual = matched ? matched.qualitative_support === 'Yes' : false;
              let hasIndia = matched ? matched.india_specific_evidence === 'Yes' : false;

              if (isOther) {
                const otherItems = factorSynthesis.filter(
                  (f) =>
                    !['Sound quality', 'Battery life', 'Comfort', 'Price', 'Voice/call quality', 'ANC', 'Ease of use', 'Design/design', 'Brand'].includes(f.factor)
                );
                quantCount = otherItems.reduce((acc, curr) => acc + (curr.quantitative_observations || 0), 0);
                hasQual = otherItems.some((curr) => curr.qualitative_support === 'Yes');
                hasIndia = otherItems.some((curr) => curr.india_specific_evidence === 'Yes');
              }

              return (
                <tr key={group.name}>
                  <th scope="row" className="coverage-factor-cell">
                    <span className="coverage-factor-name">{group.name}</span>
                  </th>
                  <td className="coverage-desc-cell">{group.desc}</td>
                  <td className="text-center coverage-count-cell">
                    <span className="coverage-count-badge">
                      {quantCount > 0 ? `${quantCount} reported` : 'Qualitative'}
                    </span>
                  </td>
                  <td className="text-center">
                    {quantCount > 0 ? (
                      <span className="coverage-indicator has-data" title="Quantitative observations present">
                        Available
                      </span>
                    ) : (
                      <span className="coverage-indicator no-data" title="No numeric observations in dataset">
                        —
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {hasQual ? (
                      <span className="coverage-indicator has-data" title="Qualitative observations present">
                        Available
                      </span>
                    ) : (
                      <span className="coverage-indicator no-data" title="No qualitative notes">
                        —
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {hasIndia ? (
                      <StatusBadge variant="evidence-india" size="small" dot>
                        India
                      </StatusBadge>
                    ) : (
                      <span className="coverage-indicator no-data">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="coverage-map-note">
        <strong>Methodological Note:</strong> A higher record count indicates that more reviewed publications reported on that factor; it must not be interpreted as higher customer importance or preference.
      </p>
    </section>
  );
}

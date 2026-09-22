import React from 'react';
import './ManufacturingEcosystemBlock.css';

/**
 * ManufacturingEcosystemBlock component adhering to Sections 24 & 44.
 * Displays MeitY March 2026 national electronics ecosystem indicators with explicit non-NEXA disclaimer.
 */
export function ManufacturingEcosystemBlock() {
  const indicators = [
    { label: 'Semiconductor Fab', value: '1', subtext: 'Approved commercial fab facility', type: 'count' },
    { label: 'ATMP / OSAT Facilities', value: '8', subtext: 'Assembly & test facilities approved', type: 'count' },
    { label: 'Design Companies (DLI)', value: '24', subtext: 'Semiconductor design startups supported', type: 'count' },
    { label: 'LSEM Production', value: '₹1,131,358 Cr', subtext: 'Cumulative large-scale electronics output', type: 'financial' },
    { label: 'Direct Employment', value: '178,749', subtext: 'Verified direct jobs created under PLI', type: 'jobs' },
    { label: 'SPECS Disbursement', value: '₹931.63 Cr', subtext: 'Electronic components scheme subsidies', type: 'financial' },
  ];

  return (
    <section className="mfg-ecosystem-container" aria-labelledby="mfg-ecosystem-heading">
      <div className="mfg-ecosystem-header">
        <div>
          <h4 id="mfg-ecosystem-heading" className="mfg-ecosystem-title">
            India Electronics Manufacturing Ecosystem Indicators (MeitY — March 2026)
          </h4>
          <p className="mfg-ecosystem-subtitle">
            Source: Ministry of Electronics and Information Technology (MeitY) Monthly Achievements. <em>Ecosystem capacity indicators; not NEXA One manufacturing capacity.</em>
          </p>
        </div>
        <span className="mfg-ecosystem-badge">India Manufacturing Context</span>
      </div>

      <div className="mfg-grid">
        {indicators.map((ind) => (
          <div key={ind.label} className="mfg-stat-card">
            <span className="mfg-stat-val font-mono">{ind.value}</span>
            <span className="mfg-stat-label">{ind.label}</span>
            <span className="mfg-stat-subtext">{ind.subtext}</span>
          </div>
        ))}
      </div>

      <div className="mfg-footer-note">
        <strong>Strategic Boundary:</strong> These indicators document the expanding domestic hardware ecosystem, component availability, and assembly infrastructure in India. They do not indicate that NEXA One currently manufactures within these specific facilities.
      </div>
    </section>
  );
}

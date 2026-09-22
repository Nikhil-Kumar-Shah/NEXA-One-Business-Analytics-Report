import React, { useState } from 'react';
import { CheckSquare, AlertOctagon, Check } from 'lucide-react';
import './ManagementChecklist.css';

/**
 * Section 25 & 26: Management pre-flight checklist and prohibited decision rules.
 */
export function ManagementChecklist({ checklist, avoidDecisions }) {
  const defaultChecklist = [
    'Current channel activity reviewed against Q1/Q2 evidence.',
    'Print activity identified for incremental-value validation.',
    'Measurement design approved before major allocation changes.',
    'Product-value messaging defined from Q3 evidence.',
    'Premiumization and emerging form-factor developments reviewed.',
    'Affordability indicators reviewed.',
    'Supply-chain conditions reviewed.',
    'Campaign outcomes defined before launch.',
    'Post-campaign incremental evidence reviewed.',
    'Next planning decision documented with assumptions and limitations.',
  ];

  const defaultAvoid = [
    'Do not set exact channel budget percentages from the current regression alone.',
    'Do not describe regression coefficients as advertising ROI.',
    'Do not eliminate print solely because its coefficient is not statistically significant.',
    'Do not claim that one customer feature is universally most important.',
    'Do not treat global OWS growth as proof of NEXA-specific demand.',
    'Do not treat smartphone shipment trends as direct headphone demand.',
    'Do not treat external forecasts as guaranteed outcomes.',
  ];

  const items = checklist && checklist.length === 10 ? checklist : defaultChecklist;
  const avoids = avoidDecisions && avoidDecisions.length === 7 ? avoidDecisions : defaultAvoid;

  // Local interactive state for checklist verification
  const [checkedState, setCheckedState] = useState(
    items.reduce((acc, _, idx) => ({ ...acc, [idx]: false }), {})
  );

  const toggleCheck = (idx) => {
    setCheckedState((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="management-audit-grid">
      {/* 25: Management Checklist */}
      <section className="mgmt-checklist-card" aria-labelledby="mgmt-checklist-heading">
        <div className="mgmt-card-header">
          <CheckSquare size={20} className="mgmt-checklist-icon" aria-hidden="true" />
          <div>
            <h2 id="mgmt-checklist-heading" className="mgmt-card-title">
              Management Checklist
            </h2>
            <p className="mgmt-card-subtitle">
              Required due-diligence verifications before allocating capital or executing campaigns.
            </p>
          </div>
        </div>

        <ul className="mgmt-checklist">
          {items.map((item, idx) => {
            const isChecked = !!checkedState[idx];
            return (
              <li
                key={`chk-${idx}`}
                className={`mgmt-check-item ${isChecked ? 'completed' : ''}`}
                onClick={() => toggleCheck(idx)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleCheck(idx);
                  }
                }}
              >
                <div className={`mgmt-checkbox ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <Check size={14} className="check-svg" />}
                </div>
                <span className="mgmt-check-text">{item}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 26: Avoid These Decisions */}
      <section className="mgmt-avoid-card" aria-labelledby="mgmt-avoid-heading">
        <div className="mgmt-card-header">
          <AlertOctagon size={20} className="mgmt-avoid-icon" aria-hidden="true" />
          <div>
            <h2 id="mgmt-avoid-heading" className="mgmt-card-title avoid">
              Avoid These Decisions Without Additional Evidence
            </h2>
            <p className="mgmt-card-subtitle">
              Strict governance boundaries to prevent misattribution and unjustified capital deployment.
            </p>
          </div>
        </div>

        <ul className="mgmt-avoid-list">
          {avoids.map((avoidText, idx) => (
            <li key={`avoid-${idx}`} className="mgmt-avoid-item">
              <span className="avoid-symbol" aria-hidden="true">
                ✕
              </span>
              <span className="avoid-text">{avoidText}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

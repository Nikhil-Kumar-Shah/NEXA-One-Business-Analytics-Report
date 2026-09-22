import React from 'react';
import { Gauge, CheckSquare, BarChart3, MessageSquare, Globe, BookOpen } from 'lucide-react';
import './MeasurementFrameworkHierarchy.css';

/**
 * Section 19: Five-level measurement hierarchy from commercial business outcomes to decision governance.
 */
export function MeasurementFrameworkHierarchy({ levels }) {
  const defaultLevels = [
    {
      level: 'LEVEL 1',
      title: 'Business Outcome',
      desc: 'Core commercial indicators (no invented targets)',
      icon: BarChart3,
      items: [
        'Sales volume and revenue trends',
        'Units sold by channel and region',
        'Predefined business outcome baselines',
      ],
    },
    {
      level: 'LEVEL 2',
      title: 'Channel Performance',
      desc: 'Channel-specific campaign performance',
      icon: Gauge,
      items: [
        'Campaign-level performance',
        'Incremental performance where testing permits',
        'Controlled test vs comparison baseline',
      ],
    },
    {
      level: 'LEVEL 3',
      title: 'Message Response',
      desc: 'Customer response across product themes',
      icon: MessageSquare,
      items: [
        'Response to defined product-value messages',
        'Engagement across sound, comfort, battery, ANC and value themes',
        'Predefined conversion measures where available',
      ],
    },
    {
      level: 'LEVEL 4',
      title: 'Market Context',
      desc: 'External environment tracking',
      icon: Globe,
      items: [
        'Category trends and maturity indicators',
        'OWS / TWS form-factor developments',
        'Affordability indicators',
        'Supply-chain conditions',
      ],
    },
    {
      level: 'LEVEL 5',
      title: 'Decision Quality',
      desc: 'Governance and documentation integrity',
      icon: BookOpen,
      items: [
        'Evidence used for each decision',
        'Documented assumptions',
        'Test design and statistical limitations',
        'Audit trail of resulting strategy updates',
      ],
    },
  ];

  const hierarchy = levels && levels.length === 5 ? levels : defaultLevels;

  return (
    <section className="measure-hierarchy-section" aria-labelledby="measure-hierarchy-heading">
      <div className="measure-hierarchy-header">
        <Gauge size={20} className="measure-hierarchy-icon" aria-hidden="true" />
        <div>
          <h2 id="measure-hierarchy-heading" className="measure-hierarchy-title">
            How Recommendations Should Be Measured
          </h2>
          <p className="measure-hierarchy-subtitle">
            A disciplined measurement hierarchy ensuring decisions are anchored in incremental validation rather than correlation alone.
          </p>
        </div>
      </div>

      <div className="measure-hierarchy-grid">
        {hierarchy.map((lvl) => {
          const IconComp = lvl.icon || Gauge;
          return (
            <div key={lvl.level} className="measure-level-card">
              <div className="measure-level-top">
                <span className="measure-level-badge font-mono">{lvl.level}</span>
                <IconComp size={16} className="measure-level-icon" aria-hidden="true" />
              </div>
              <h3 className="measure-level-title font-heading">{lvl.title}</h3>
              <p className="measure-level-desc">{lvl.description || lvl.desc}</p>
              <ul className="measure-level-list">
                {(lvl.metrics || lvl.items).map((item, idx) => (
                  <li key={`lvl-item-${idx}`}>
                    <span className="measure-bullet">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

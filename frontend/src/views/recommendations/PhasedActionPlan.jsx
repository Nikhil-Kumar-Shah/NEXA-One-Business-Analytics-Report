import React from 'react';
import { CalendarRange, ArrowRight, Clock } from 'lucide-react';
import './PhasedActionPlan.css';

/**
 * Section 17: Phased Action Plan from Phase A (Immediate Planning) to Phase E (Next Allocation Decision).
 */
export function PhasedActionPlan({ phases }) {
  const defaultPhases = [
    {
      phase: 'PHASE A',
      title: 'Immediate Planning',
      timing: 'Next planning cycle',
      actions: [
        'Review current TV, social media and print activity against the statistical evidence.',
        'Identify the specific print activities that require incremental-value validation.',
        'Define the measurement framework before changing major channel allocations.',
        'Define the core NEXA product-value messaging framework.',
      ],
    },
    {
      phase: 'PHASE B',
      title: 'Campaign Preparation',
      timing: 'Before campaign launch',
      actions: [
        'Create structured TV and social media campaign objectives.',
        'Develop product-centered messaging around recurring customer considerations.',
        'Define test groups, baselines or comparison periods where feasible.',
        'Define primary and secondary success metrics before launch.',
      ],
    },
    {
      phase: 'PHASE C',
      title: 'Campaign Execution',
      timing: 'During campaign',
      actions: [
        'Run the planned campaigns.',
        'Maintain consistent measurement definitions.',
        'Track sales and predefined campaign outcomes.',
        'Record external market conditions that may affect interpretation.',
      ],
    },
    {
      phase: 'PHASE D',
      title: 'Performance Review',
      timing: 'After campaign',
      actions: [
        'Compare measured outcomes against the predefined baseline or comparison.',
        'Assess incremental performance where the test design allows it.',
        'Review customer response to messaging.',
        'Document findings and limitations.',
      ],
    },
    {
      phase: 'PHASE E',
      title: 'Next Allocation Decision',
      timing: 'Next planning cycle',
      actions: [
        'Combine measured campaign performance with updated customer and market evidence.',
        'Reassess channel roles.',
        'Determine whether print activity should be maintained, modified or reduced based on measured evidence.',
        'Update the strategy using the latest available evidence.',
      ],
    },
  ];

  const planPhases = phases && phases.length === 5 ? phases : defaultPhases;

  return (
    <section className="phased-plan-section" aria-labelledby="phased-plan-heading">
      <div className="phased-plan-header">
        <CalendarRange size={20} className="phased-plan-icon" aria-hidden="true" />
        <div>
          <h2 id="phased-plan-heading" className="phased-plan-title">
            Action Plan
          </h2>
          <p className="phased-plan-subtitle">
            A practical five-phase roadmap translating statistical insights into controlled campaign execution.
          </p>
        </div>
      </div>

      <div className="phased-plan-timeline">
        {planPhases.map((p, idx) => (
          <div key={p.phase} className="phased-card">
            <div className="phased-card-top">
              <span className="phased-step-badge font-mono">{p.phase}</span>
              <div className="phased-timing-chip">
                <Clock size={12} aria-hidden="true" />
                <span>{p.timing}</span>
              </div>
            </div>

            <h3 className="phased-title font-heading">{p.title}</h3>

            <ol className="phased-action-list">
              {p.actions.map((act, actIdx) => (
                <li key={`action-${actIdx}`}>
                  <span className="phased-action-num">{actIdx + 1}.</span>
                  <span className="phased-action-text">{act}</span>
                </li>
              ))}
            </ol>

            {idx < planPhases.length - 1 && (
              <div className="phased-connector" aria-hidden="true">
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import { CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import './DecisionFrameworkFlow.css';

/**
 * Section 12 & 13: "Decision Framework for the Next Planning Period"
 * and "How NEXA Should Validate the Strategy" (Testing & Measurement).
 */
export function DecisionFrameworkFlow() {
  const steps = [
    {
      num: '01',
      title: 'Maintain Evidence-Based Attention',
      text: 'Continue meaningful attention to TV and social media because both show stronger observed relationships with sales than print.',
    },
    {
      num: '02',
      title: 'Reassess Print',
      text: 'Reconsider print investment and require incremental evidence before maintaining or expanding spend.',
    },
    {
      num: '03',
      title: 'Strengthen Product-Centered Messaging',
      text: 'Build communication around recurring customer considerations including sound quality, battery life, comfort, value, call quality, ANC and ease of use.',
    },
    {
      num: '04',
      title: 'Test Before Scaling',
      text: 'Use controlled campaign testing and incremental-performance measurement before making major allocation changes.',
    },
    {
      num: '05',
      title: 'Monitor the Market',
      text: 'Track category maturity, premiumization, OWS development, affordability conditions and supply-chain changes.',
    },
    {
      num: '06',
      title: 'Review Results',
      text: 'Use measured incremental performance, customer response and updated market evidence to revise the next planning cycle.',
    },
  ];

  const validationSteps = [
    {
      step: '1',
      name: 'Baseline',
      desc: 'Establish the current sales and campaign baseline before changing channel activity.',
    },
    {
      step: '2',
      name: 'Controlled Test',
      desc: 'Run controlled channel or campaign tests where practical.',
    },
    {
      step: '3',
      name: 'Incremental Measurement',
      desc: 'Measure incremental sales or other predefined business outcomes rather than relying only on correlation.',
    },
    {
      step: '4',
      name: 'Customer Response',
      desc: 'Track response to product and message themes such as sound quality, comfort, battery life, value and ANC.',
    },
    {
      step: '5',
      name: 'Reallocation Review',
      desc: 'Use measured incremental performance to determine whether future channel allocation should change.',
    },
  ];

  return (
    <div className="decision-framework-wrapper">
      {/* 6-Step Decision Framework */}
      <section className="df-section" aria-labelledby="df-heading">
        <div className="df-header">
          <h2 id="df-heading" className="df-title">
            Decision Framework for the Next Planning Period
          </h2>
          <p className="df-subtitle">
            A structured operational sequence translating multi-source evidence into campaign execution.
          </p>
        </div>

        <div className="df-steps-grid">
          {steps.map((s) => (
            <div key={s.num} className="df-step-card">
              <span className="df-step-num font-mono">{s.num}</span>
              <h3 className="df-step-title">{s.title}</h3>
              <p className="df-step-text">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Step Testing & Measurement Framework */}
      <section className="validation-section" aria-labelledby="val-heading">
        <div className="val-header">
          <div className="val-title-wrap">
            <ShieldCheck size={20} className="val-icon" aria-hidden="true" />
            <h2 id="val-heading" className="val-title">
              How NEXA Should Validate the Strategy
            </h2>
          </div>
          <p className="val-subtitle">
            Because the available dataset cannot establish causal ROI, future channel allocation changes
            require controlled experimental validation.
          </p>
        </div>

        <div className="val-steps-flow">
          {validationSteps.map((v, i) => (
            <div key={v.step} className="val-step-item">
              <div className="val-step-badge">
                <span className="val-step-number font-mono">{v.step}</span>
              </div>
              <div className="val-step-body">
                <h3 className="val-step-name">{v.name}</h3>
                <p className="val-step-desc">{v.desc}</p>
              </div>
              {i < validationSteps.length - 1 && <div className="val-flow-arrow" aria-hidden="true">→</div>}
            </div>
          ))}
        </div>

        <div className="val-callout-note">
          <strong>Methodological Limitation:</strong> The current dataset supports directional strategic planning
          but does not provide the experimental evidence required to estimate causal incremental return.
        </div>
      </section>
    </div>
  );
}

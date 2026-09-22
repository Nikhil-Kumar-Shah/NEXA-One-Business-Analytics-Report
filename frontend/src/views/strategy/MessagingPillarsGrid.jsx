import React from 'react';
import { Volume2, BatteryCharging, Smile, DollarSign, PhoneCall, Disc, CheckCircle } from 'lucide-react';
import './MessagingPillarsGrid.css';

/**
 * Section 7: "Messaging Priorities" (Section 14)
 * Seven customer-benefit communication pillars derived from Q3 recurring themes.
 */
export function MessagingPillarsGrid() {
  const pillars = [
    {
      num: '01',
      title: 'Sound Quality',
      description: 'Communicate the listening experience and audio quality clearly.',
      icon: Volume2,
    },
    {
      num: '02',
      title: 'Battery Life',
      description: 'Show how battery performance supports everyday use.',
      icon: BatteryCharging,
    },
    {
      num: '03',
      title: 'Comfort',
      description: 'Demonstrate comfort for extended listening and daily use.',
      icon: Smile,
    },
    {
      num: '04',
      title: 'Price / Value',
      description: "Make the value proposition clear relative to the product's features and experience.",
      icon: DollarSign,
    },
    {
      num: '05',
      title: 'Call Quality',
      description: 'Communicate voice and call performance where relevant to customer use cases.',
      icon: PhoneCall,
    },
    {
      num: '06',
      title: 'Active Noise Cancellation',
      description: 'Explain the benefit of noise cancellation in practical listening situations.',
      icon: Disc,
    },
    {
      num: '07',
      title: 'Ease of Use / Compatibility',
      description: 'Communicate simple setup, device compatibility and everyday usability.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="messaging-pillars-container" aria-labelledby="messaging-priorities-heading">
      <div className="mp-header">
        <h2 id="messaging-priorities-heading" className="mp-title">
          Messaging Priorities
        </h2>
        <p className="mp-subtitle">
          Customer research does not identify one universal winning feature. Instead, several product
          considerations recur across independent studies. NEXA's messaging should therefore connect the product
          to a set of practical customer benefits.
        </p>
      </div>

      <div className="mp-grid">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.num} className="mp-card">
              <div className="mp-card-top">
                <div className="mp-icon-wrap">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <span className="mp-num font-mono">{pillar.num}</span>
              </div>
              <h3 className="mp-card-title">{pillar.title}</h3>
              <p className="mp-card-desc">{pillar.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mp-methodology-note">
        <strong>Methodology Note:</strong> These messaging priorities are derived from recurring themes in the
        reviewed customer research. The research does not establish a NEXA-specific ranking or the percentage of
        customers who prioritize each factor.
      </div>
    </section>
  );
}

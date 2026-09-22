import React, { useState, useEffect } from 'react';
import './LocalSectionNav.css';

const EXECUTIVE_TOC = [
  { id: 'overview', label: 'Executive Summary' },
  { id: 'key-findings', label: 'Key Findings' },
  { id: 'model-evidence', label: 'Model Evidence' },
  { id: 'customer-context', label: 'Customer Context' },
  { id: 'market-context', label: 'Market Context' },
  { id: 'strategic-direction', label: 'Strategic Direction' },
];

const STRATEGY_TOC = [
  { id: 'framework', label: 'Framework' },
  { id: 'positioning', label: 'Positioning' },
  { id: 'market-watch', label: 'Market Watch' },
  { id: 'decision-logic', label: 'Decision Logic' },
  { id: 'tradeoffs', label: 'Tradeoffs' },
  { id: 'risk-register', label: 'Risk Register' },
  { id: 'limitations', label: 'Limitations' },
];

const SECTION_LOCAL_TOC = {
  'executive-overview': EXECUTIVE_TOC,
  'executive-summary': EXECUTIVE_TOC,
  'data-methodology': [
    { id: 'data-foundation', label: 'Data Foundation' },
    { id: 'quality-audit', label: 'Quality Audit' },
    { id: 'methodology', label: 'Methodologies' },
    { id: 'safeguards', label: 'Safeguards' },
  ],
  'advertising-sales': [
    { id: 'question', label: 'Question' },
    { id: 'data-overview', label: 'Data Overview' },
    { id: 'advertising-spend', label: 'Advertising Spend' },
    { id: 'correlation', label: 'Correlation' },
    { id: 'regression', label: 'Regression' },
    { id: 'interpretation', label: 'Interpretation' },
    { id: 'limitations', label: 'Limitations' },
  ],
  'channel-analysis': [
    { id: 'channel-evidence', label: 'Channel Evidence' },
    { id: 'correlation', label: 'Correlation' },
    { id: 'regression', label: 'Regression' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'business-implications', label: 'Business Implications' },
  ],
  'customer-purchase-drivers': [
    { id: 'research-scope', label: 'Research Scope' },
    { id: 'sound-quality', label: 'Sound Quality' },
    { id: 'battery-life', label: 'Battery Life' },
    { id: 'comfort', label: 'Comfort' },
    { id: 'price-value', label: 'Price / Value' },
    { id: 'call-quality', label: 'Call Quality' },
    { id: 'anc', label: 'ANC' },
    { id: 'supporting-factors', label: 'Supporting Factors' },
    { id: 'limitations', label: 'Limitations' },
  ],
  'market-macro': [
    { id: 'market', label: 'Market' },
    { id: 'premiumization', label: 'Premiumization' },
    { id: 'tws-ows', label: 'TWS / OWS' },
    { id: 'affordability', label: 'Affordability' },
    { id: 'macro', label: 'Macro' },
    { id: 'trade', label: 'Trade' },
    { id: 'supply-chain', label: 'Supply Chain' },
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'synthesis', label: 'Synthesis' },
    { id: 'limitations', label: 'Limitations' },
  ],
  'strategy-decision': STRATEGY_TOC,
  'strategic-direction': STRATEGY_TOC,
  'recommendations': [
    { id: 'core-actions', label: 'Core Actions' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'measurement', label: 'Measurement' },
    { id: 'governance', label: 'Governance' },
    { id: 'avoid-decisions', label: 'Avoid Decisions' },
    { id: 'summary', label: 'Summary' },
  ],
  'methodology-sources': [
    { id: 'source-register', label: 'Source Register' },
    { id: 'traceability', label: 'Traceability' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'boundaries', label: 'Boundaries' },
  ],
};

export function LocalSectionNav({ activeSectionId = 'executive-summary' }) {
  const items = SECTION_LOCAL_TOC[activeSectionId] || [];
  const [activeAnchor, setActiveAnchor] = useState(items[0]?.id || '');

  useEffect(() => {
    if (items.length > 0) {
      setActiveAnchor(items[0].id);
    }
  }, [activeSectionId]);

  // Track active anchor while scrolling
  useEffect(() => {
    if (!items || items.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      let currentId = items[0]?.id || '';

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            currentId = item.id;
          }
        }
      }

      if (currentId) {
        setActiveAnchor(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    setActiveAnchor(targetId);

    const el = document.getElementById(targetId);
    if (el) {
      // Offset by top navbar + local subnav height (~116px)
      const yOffset = -116;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };

  return (
    <nav
      className="local-section-nav no-print"
      aria-label="Section local table of contents"
    >
      <div className="local-section-nav-inner">
        <span className="local-nav-prefix font-mono">ON THIS PAGE</span>
        <div className="local-nav-items" role="tablist">
          {items.map((item) => {
            const isActive = activeAnchor === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleAnchorClick(e, item.id)}
                className={`local-nav-link ${isActive ? 'is-active' : ''}`}
                role="tab"
                aria-selected={isActive ? 'true' : 'false'}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

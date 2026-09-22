import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Bookmark, HelpCircle, Database, ArrowRight } from 'lucide-react';
import { REPORT_SECTIONS } from '../../config/reportSections';
import './ReportSearchModal.css';

const SEARCHABLE_ENTRIES = [
  // 1. Report Sections
  ...REPORT_SECTIONS.map((s) => ({
    type: 'section',
    category: 'Report Section',
    title: `${s.number} ${s.title}`,
    subtitle: s.questionNumber ? `${s.questionNumber} — ${s.questionText}` : 'Chapter',
    path: s.path,
    icon: FileText,
  })),

  // 2. Key Questions
  {
    type: 'question',
    category: 'Analytical Question',
    title: 'Q1 — Is there a meaningful relationship between advertising expenditure and sales?',
    subtitle: 'Section 03 Advertising & Sales',
    path: '/report/advertising-sales',
    icon: HelpCircle,
  },
  {
    type: 'question',
    category: 'Analytical Question',
    title: 'Q2 — How do TV, social media and print compare in explaining sales?',
    subtitle: 'Section 04 Channel Analysis',
    path: '/report/channel-analysis',
    icon: HelpCircle,
  },
  {
    type: 'question',
    category: 'Analytical Question',
    title: 'Q3 — What factors matter to customers when evaluating wireless headphones?',
    subtitle: 'Section 05 Customer Purchase Drivers',
    path: '/report/customer-purchase-drivers',
    icon: HelpCircle,
  },
  {
    type: 'question',
    category: 'Analytical Question',
    title: 'Q4 — What market and macroeconomic conditions should NEXA One consider?',
    subtitle: 'Section 06 Market & Macro',
    path: '/report/market-macro',
    icon: HelpCircle,
  },
  {
    type: 'question',
    category: 'Analytical Question',
    title: 'Q5 — What marketing and advertising strategy should NEXA One consider for the next planning period?',
    subtitle: 'Section 07 Strategy Decision',
    path: '/report/strategy-decision',
    icon: HelpCircle,
  },

  // 3. Subsections / Analytical Anchors
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Key Findings & Analytical Synthesis',
    subtitle: '01 Executive Overview',
    path: '/report/executive-overview#key-findings',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'OLS Model Evidence & Formula',
    subtitle: '01 Executive Overview',
    path: '/report/executive-overview#model-evidence',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Data Architecture & Quality Audit',
    subtitle: '02 Data & Methodology',
    path: '/report/data-methodology#quality-audit',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Analytical Safeguards & Non-Causal Standard',
    subtitle: '02 Data & Methodology',
    path: '/report/data-methodology#safeguards',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Total Advertising Spend vs Observed Sales Scatter Plot',
    subtitle: '03 Advertising & Sales',
    path: '/report/advertising-sales#advertising-spend',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Channel Correlation Analysis (TV, Social, Print)',
    subtitle: '03 Advertising & Sales',
    path: '/report/advertising-sales#correlation',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Multivariate OLS Regression Results',
    subtitle: '03 Advertising & Sales',
    path: '/report/advertising-sales#regression',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Channel Comparison & Relative Significance',
    subtitle: '04 Channel Analysis',
    path: '/report/channel-analysis#comparison',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Sound Quality & Audio Driver Research',
    subtitle: '05 Customer Purchase Drivers',
    path: '/report/customer-purchase-drivers#sound-quality',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Battery Life & Comfort Ratings',
    subtitle: '05 Customer Purchase Drivers',
    path: '/report/customer-purchase-drivers#battery-life',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'India Wireless Audio Market & Premiumization',
    subtitle: '06 Market & Macro',
    path: '/report/market-macro#premiumization',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'TWS vs OWS Emerging Form Factors',
    subtitle: '06 Market & Macro',
    path: '/report/market-macro#tws-ows',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Strategic Decision Logic & Allocation Framework',
    subtitle: '07 Strategy Decision',
    path: '/report/strategy-decision#decision-logic',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Strategic Risk Register & Tradeoffs',
    subtitle: '07 Strategy Decision',
    path: '/report/strategy-decision#risk-register',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Core Strategic Actions & Management Directives',
    subtitle: '08 Recommendations',
    path: '/report/recommendations#core-actions',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Implementation Roadmap & Phased Gates',
    subtitle: '08 Recommendations',
    path: '/report/recommendations#roadmap',
    icon: Bookmark,
  },
  {
    type: 'subsection',
    category: 'Subsection',
    title: 'Authoritative Source Register (20 Citations)',
    subtitle: '09 Methodology & Sources',
    path: '/report/methodology-sources#source-register',
    icon: Database,
  },
  {
    type: 'source',
    category: 'Authority / Citation',
    title: 'Qualcomm State of Play Report',
    subtitle: 'Customer purchase drivers, audio trends',
    path: '/report/methodology-sources#source-register',
    icon: Database,
  },
  {
    type: 'source',
    category: 'Authority / Citation',
    title: 'Counterpoint Research (India TWS Market)',
    subtitle: 'Shipments, premiumization, market trends',
    path: '/report/methodology-sources#source-register',
    icon: Database,
  },
  {
    type: 'source',
    category: 'Authority / Citation',
    title: 'Internal Advertising Dataset (N = 200)',
    subtitle: 'Market sales, TV, Social, Print expenditures',
    path: '/report/methodology-sources#source-register',
    icon: Database,
  },
];

export function ReportSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Default: show all 9 sections
      return SEARCHABLE_ENTRIES.slice(0, 9);
    }
    const cleanQuery = query.toLowerCase().trim();
    return SEARCHABLE_ENTRIES.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQuery) ||
        item.subtitle.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery)
    );
  }, [query]);

  const handleSelect = (item) => {
    if (!item) return;
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Jump to section">
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="search-modal-input-row">
          <Search size={18} className="search-modal-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search report, jump to section, question, or source..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            aria-label="Search query"
          />
          <button type="button" className="search-modal-close" onClick={onClose} aria-label="Close search">
            <X size={16} />
          </button>
        </div>

        <div className="search-modal-results" role="listbox">
          {results.length === 0 ? (
            <div className="search-no-results">
              No matching sections, subsections, or sources found for "{query}".
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={`${item.path}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`search-result-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="search-result-icon-col">
                    <Icon size={16} />
                  </div>
                  <div className="search-result-text-col">
                    <div className="search-result-title-row">
                      <span className="search-result-title">{item.title}</span>
                      <span className="search-result-category font-mono">{item.category}</span>
                    </div>
                    <span className="search-result-subtitle">{item.subtitle}</span>
                  </div>
                  <ArrowRight size={14} className="search-result-arrow" aria-hidden="true" />
                </div>
              );
            })
          )}
        </div>

        <div className="search-modal-footer font-mono">
          <span>↑↓ Navigate</span>
          <span>↵ Jump</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}

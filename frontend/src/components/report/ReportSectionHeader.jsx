import React from 'react';
import './ReportSectionHeader.css';

const SECTION_KICKERS = {
  '01': '01 / EXECUTIVE OVERVIEW',
  '02': '02 / DATA & METHODOLOGY',
  '03': '03 / ADVERTISING & SALES',
  '04': '04 / CHANNEL ANALYSIS',
  '05': '05 / CUSTOMER PURCHASE DRIVERS',
  '06': '06 / MARKET & MACRO',
  '07': '07 / STRATEGY DECISION',
  '08': '08 / RECOMMENDATIONS',
  '09': '09 / METHODOLOGY & SOURCES',
};

const SECTION_QUESTIONS = {
  '03': 'Q1 — Is there a meaningful relationship between advertising expenditure and sales?',
  '04': 'Q2 — How do TV, social media and print compare in explaining sales?',
  '05': 'Q3 — What factors matter to customers when evaluating wireless headphones?',
  '06': 'Q4 — What market and macroeconomic conditions should NEXA One consider?',
  '07': 'Q5 — What marketing and advertising strategy should NEXA One consider for the next planning period?',
};

export function ReportSectionHeader({
  number,
  title,
  descriptor = null,
  metadata = null,
  className = '',
}) {
  const kicker = SECTION_KICKERS[number] || `${number} / ${title.toUpperCase()}`;
  const question = SECTION_QUESTIONS[number];

  return (
    <header className={`report-section-header ${className}`}>
      <div className="section-header-top">
        <div className="section-number-badge font-mono" aria-label={`Section ${number}`}>
          {kicker}
        </div>
        {metadata && <div className="section-meta-slot">{metadata}</div>}
      </div>

      <h1 className="section-main-title font-heading">{title}</h1>

      {question && (
        <div className="section-question-banner font-mono" aria-label="Analytical Research Question">
          {question}
        </div>
      )}

      {descriptor && (
        <p className="section-descriptor-slot">{descriptor}</p>
      )}
    </header>
  );
}

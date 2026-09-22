import React from 'react';
import { NavLink } from 'react-router-dom';
import { REPORT_SECTIONS } from '../../config/reportSections';
import './ReportSectionTabs.css';

const SECTION_SHORT_LABELS = {
  'executive-summary': '01 Overview',
  'data-methodology': '02 Data',
  'advertising-sales': '03 Advertising',
  'channel-analysis': '04 Channels',
  'customer-purchase-drivers': '05 Customers',
  'market-macro': '06 Market',
  'strategic-direction': '07 Strategy',
  'recommendations': '08 Actions',
  'methodology-sources': '09 Sources',
};

export function ReportSectionTabs({ activeSectionId }) {
  return (
    <nav className="report-subnav-strip" aria-label="Report sections navigation">
      <div className="report-subnav-inner">
        <div className="vl-tabs" role="tablist">
          {REPORT_SECTIONS.map((section) => {
            const shortLabel = SECTION_SHORT_LABELS[section.id] || `${section.number} ${section.title}`;
            const isActive = activeSectionId === section.id;

            return (
              <NavLink
                key={section.id}
                to={section.path}
                className={({ isActive: isRouteActive }) =>
                  `vl-tabs__tab ${isRouteActive || isActive ? 'vl-tabs__tab--active' : ''}`
                }
                role="tab"
                aria-selected={isActive ? 'true' : 'false'}
              >
                {shortLabel}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

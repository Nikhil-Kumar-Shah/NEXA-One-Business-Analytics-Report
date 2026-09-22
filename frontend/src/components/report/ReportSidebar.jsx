import React from 'react';
import { NavLink } from 'react-router-dom';
import { REPORT_SECTIONS } from '../../config/reportSections';
import './ReportSidebar.css';

export function ReportSidebar({
  activeSectionId,
  className = '',
}) {
  return (
    <aside
      className={`report-sidebar ${className}`}
      aria-label="Report Index Navigation"
    >
      {/* Sidebar Header / Brand Identity */}
      <div className="sidebar-identity">
        <NavLink to="/report/executive-overview" className="sidebar-brand-link">
          <span className="sidebar-brand-title font-heading">NEXA One</span>
          <span className="sidebar-brand-descriptor">Business Analytics Report</span>
        </NavLink>
      </div>

      {/* Primary Report Index Navigation */}
      <nav className="sidebar-nav-container" aria-label="Report Chapters">
        <div className="sidebar-nav-kicker">REPORT</div>
        <ul className="sidebar-nav-list" role="list">
          {REPORT_SECTIONS.map((section) => {
            const isActive = activeSectionId === section.id;

            return (
              <li key={section.id} role="listitem">
                <NavLink
                  to={section.path}
                  className={({ isActive: isRouteActive }) =>
                    `sidebar-nav-item ${isRouteActive || isActive ? 'is-active' : ''}`
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar-nav-num font-mono">{section.number}</span>
                  <div className="sidebar-nav-text">
                    <span className="sidebar-nav-title">{section.title}</span>
                    {section.questionNumber && (
                      <span className="sidebar-nav-q-tag font-mono">{section.questionNumber}</span>
                    )}
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer Metadata */}
      <div className="sidebar-footer">
        <span className="sidebar-meta-item font-mono">CONFIDENTIAL · 2026</span>
        <span className="sidebar-meta-item">NEXA One Analytics</span>
      </div>
    </aside>
  );
}

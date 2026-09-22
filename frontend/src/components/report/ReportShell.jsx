import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSectionById, getSectionByPath } from '../../config/reportSections';
import { ReportSidebar } from './ReportSidebar';
import { ReportTopNav } from './ReportTopNav';
import { LocalSectionNav } from './LocalSectionNav';
import { ReportSectionHeader } from './ReportSectionHeader';
import { ReportSectionNav } from './ReportSectionNav';
import { ReportFooter } from './ReportFooter';
import { MobileReportMenu } from './MobileReportMenu';
import './ReportShell.css';

export function ReportShell({
  children,
  sectionId = null,
  descriptor = null,
  metadata = null,
}) {
  const location = useLocation();

  // Resolve active section from prop or URL pathname
  const activeSection = sectionId
    ? getSectionById(sectionId)
    : getSectionByPath(location.pathname);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enforce light theme only (DESIGN.md Section 25)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="report-app-shell">
      {/* 1. Left Persistent Report Index Sidebar (Desktop) */}
      <ReportSidebar activeSectionId={activeSection.id} />

      {/* 2. Mobile Drawer Navigation */}
      <MobileReportMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSectionId={activeSection.id}
      />

      {/* 3. Main Container Viewport (Right Column) */}
      <div className="report-main-viewport">
        {/* Minimal Top Header with Search/Jump utility & Prev/Next step */}
        <ReportTopNav
          activeSectionId={activeSection.id}
          activeSectionTitle={activeSection.title}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Primary Reading / Content Area */}
        <main className="report-content-wrapper" id="main-content">
          <div className="report-content-column">
            {/* Page Header with Chapter Kicker & Question Context */}
            <ReportSectionHeader
              number={activeSection.number}
              title={activeSection.title}
              descriptor={descriptor}
              metadata={metadata}
            />

            {/* Contextual Local Table of Contents Navigation */}
            <LocalSectionNav activeSectionId={activeSection.id} />

            {/* Section Body Content */}
            <section className="report-section-body" aria-label={activeSection.title}>
              {children}
            </section>

            {/* Subtle Bottom Previous / Next Chapter Navigation */}
            <ReportSectionNav activeSectionId={activeSection.id} />
          </div>
        </main>

        {/* Global Minimal Footer */}
        <ReportFooter />
      </div>
    </div>
  );
}

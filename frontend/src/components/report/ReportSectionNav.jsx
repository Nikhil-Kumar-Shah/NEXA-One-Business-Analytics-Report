import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPreviousSection, getNextSection } from '../../config/reportSections';
import './ReportSectionNav.css';

export function ReportSectionNav({ activeSectionId, className = '' }) {
  const prevSection = getPreviousSection(activeSectionId);
  const nextSection = getNextSection(activeSectionId);

  return (
    <nav
      className={`report-section-nav ${className}`}
      aria-label="Previous and Next Section Navigation"
    >
      <div className="section-nav-col prev-col">
        {prevSection ? (
          <Link
            to={prevSection.path}
            className="section-nav-link prev-link"
            rel="prev"
            aria-label={`Previous section: ${prevSection.number} ${prevSection.title}`}
          >
            <ChevronLeft size={16} className="nav-arrow" aria-hidden="true" />
            <div className="nav-link-text">
              <span className="nav-link-direction">Previous Section</span>
              <span className="nav-link-title">
                {prevSection.number} {prevSection.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="nav-empty-placeholder" />
        )}
      </div>

      <div className="section-nav-col next-col">
        {nextSection ? (
          <Link
            to={nextSection.path}
            className="section-nav-link next-link"
            rel="next"
            aria-label={`Next section: ${nextSection.number} ${nextSection.title}`}
          >
            <div className="nav-link-text">
              <span className="nav-link-direction">Next Section</span>
              <span className="nav-link-title">
                {nextSection.number} {nextSection.title}
              </span>
            </div>
            <ChevronRight size={16} className="nav-arrow" aria-hidden="true" />
          </Link>
        ) : (
          <div className="nav-empty-placeholder" />
        )}
      </div>
    </nav>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { getPreviousSection, getNextSection } from '../../config/reportSections';
import { ReportSearchModal } from './ReportSearchModal';
import './ReportTopNav.css';

export function ReportTopNav({
  activeSectionId = 'executive-overview',
  activeSectionTitle = '',
  onOpenMobileMenu = () => {},
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const prevSection = getPreviousSection(activeSectionId);
  const nextSection = getNextSection(activeSectionId);

  // Keyboard shortcut: Cmd+K / Ctrl+K or '/' to open search utility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="report-top-nav no-print" role="banner">
        <div className="top-nav-inner">
          {/* Left: Mobile Drawer Trigger + Brand Identity */}
          <div className="top-nav-left">
            <button
              type="button"
              className="mobile-nav-trigger"
              onClick={onOpenMobileMenu}
              aria-label="Open report navigation"
              title="Open report index"
            >
              <Menu size={18} />
            </button>

            <Link to="/report/executive-overview" className="top-nav-brand-link">
              <div className="top-nav-brand-text">
                <span className="top-nav-brand-name font-heading">NEXA One</span>
                <span className="top-nav-brand-descriptor">Business Analytics Report</span>
              </div>
            </Link>
          </div>

          {/* Right: Search / Jump to Section Utility + Compact Prev/Next Controls */}
          <div className="top-nav-right">
            {/* Jump / Search Utility Trigger */}
            <button
              type="button"
              className="top-nav-search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search report or jump to section"
              title="Search report (⌘K)"
            >
              <Search size={14} className="search-btn-icon" aria-hidden="true" />
              <span className="search-btn-text">Jump to section...</span>
              <kbd className="search-btn-shortcut font-mono">⌘K</kbd>
            </button>

            {/* Compact Chapter Prev/Next utility */}
            <div className="top-nav-step-controls" aria-label="Chapter step controls">
              {prevSection ? (
                <Link
                  to={prevSection.path}
                  className="top-nav-step-btn"
                  aria-label={`Previous: ${prevSection.number} ${prevSection.title}`}
                  title={`Previous: ${prevSection.number} ${prevSection.title}`}
                >
                  <ChevronLeft size={16} />
                </Link>
              ) : (
                <span className="top-nav-step-btn is-disabled" aria-hidden="true">
                  <ChevronLeft size={16} />
                </span>
              )}

              {nextSection ? (
                <Link
                  to={nextSection.path}
                  className="top-nav-step-btn"
                  aria-label={`Next: ${nextSection.number} ${nextSection.title}`}
                  title={`Next: ${nextSection.number} ${nextSection.title}`}
                >
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <span className="top-nav-step-btn is-disabled" aria-hidden="true">
                  <ChevronRight size={16} />
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search & Jump Utility Modal */}
      <ReportSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

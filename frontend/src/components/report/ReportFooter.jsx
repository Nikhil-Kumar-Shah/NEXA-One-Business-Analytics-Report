import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ExternalLink, BookOpen, Library, ArrowUp } from 'lucide-react';
import { DATASET_LINKS } from '../../config/datasetLinks';
import './ReportFooter.css';

/**
 * ReportFooter (Phase 13B)
 * Minimal, professional, author-signed publication footer.
 * Communicates:
 * 1. Report identity (NEXA One Business Analytics Report)
 * 2. Author credit (Prepared by Nikhil Kumar Shah)
 * 3. Resources (Compact icon-led dataset and register links)
 * 4. Basic utility (Report, Sources, Back to top)
 */
export function ReportFooter({ className = '' }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`report-footer ${className}`} role="contentinfo" aria-label="Report publication footer">
      <div className="report-footer-inner">
        {/* Main 3-Zone Layout */}
        <div className="footer-main-grid">
          {/* ZONE A — REPORT IDENTITY & AUTHOR */}
          <div className="footer-zone footer-zone-identity">
            <div className="footer-brand-block">
              <span className="footer-brand-title font-heading">NEXA One</span>
              <span className="footer-brand-subtitle font-mono">Business Analytics Report</span>
            </div>
            <p className="footer-report-descriptor">Independent analytical report</p>
            <div className="footer-author-signature">
              <span className="footer-author-lead font-mono">Prepared by</span>
              <span className="footer-author-name">Nikhil Kumar Shah</span>
            </div>
          </div>

          {/* ZONE B — RESOURCES */}
          <div className="footer-zone footer-zone-resources">
            <h4 className="footer-zone-heading font-mono">RESOURCES</h4>
            <nav className="footer-resource-list" aria-label="Analytical resources">
              <a
                href={DATASET_LINKS.advertising.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-resource-item"
                aria-label="Open Advertising Dataset in Google Sheets"
              >
                <Database size={13} className="footer-icon" aria-hidden="true" />
                <span className="footer-link-text">{DATASET_LINKS.advertising.label}</span>
                <ExternalLink size={11} className="footer-ext-icon" aria-hidden="true" />
              </a>

              <a
                href={DATASET_LINKS.customerResearch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-resource-item"
                aria-label="Open Customer Research in Google Sheets"
              >
                <Database size={13} className="footer-icon" aria-hidden="true" />
                <span className="footer-link-text">{DATASET_LINKS.customerResearch.label}</span>
                <ExternalLink size={11} className="footer-ext-icon" aria-hidden="true" />
              </a>

              <a
                href={DATASET_LINKS.marketMacro.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-resource-item"
                aria-label="Open Market & Macro Research in Google Sheets"
              >
                <Database size={13} className="footer-icon" aria-hidden="true" />
                <span className="footer-link-text">{DATASET_LINKS.marketMacro.label}</span>
                <ExternalLink size={11} className="footer-ext-icon" aria-hidden="true" />
              </a>

              <Link
                to="/report/methodology-sources#source-register"
                className="footer-resource-item"
                aria-label="View Source Register in Methodology & Sources"
              >
                <Library size={13} className="footer-icon" aria-hidden="true" />
                <span className="footer-link-text">Source Register</span>
              </Link>
            </nav>
          </div>

          {/* ZONE C — UTILITY */}
          <div className="footer-zone footer-zone-utility">
            <h4 className="footer-zone-heading font-mono">UTILITY</h4>
            <nav className="footer-utility-list" aria-label="Report navigation utility">
              <Link
                to="/report/executive-overview"
                className="footer-utility-item"
                aria-label="Go to Report Executive Overview"
              >
                <BookOpen size={13} className="footer-icon" aria-hidden="true" />
                <span>Report</span>
              </Link>

              <Link
                to="/report/methodology-sources"
                className="footer-utility-item"
                aria-label="Go to Methodology and Sources"
              >
                <Library size={13} className="footer-icon" aria-hidden="true" />
                <span>Sources</span>
              </Link>

              <button
                type="button"
                onClick={scrollToTop}
                className="footer-utility-item footer-btn-top"
                aria-label="Back to top"
              >
                <ArrowUp size={13} className="footer-icon" aria-hidden="true" />
                <span>Back to top</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <span className="footer-copy font-mono">© 2026 Nikhil Kumar Shah</span>
          <span className="footer-bottom-sep" aria-hidden="true">·</span>
          <span className="footer-bottom-product">NEXA One · Business Analytics Report</span>
          <span className="footer-bottom-sep" aria-hidden="true">·</span>
          <span className="footer-bottom-desc">Independent analytical report</span>
        </div>
      </div>
    </footer>
  );
}

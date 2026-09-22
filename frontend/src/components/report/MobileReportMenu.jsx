import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { REPORT_SECTIONS } from '../../config/reportSections';
import './MobileReportMenu.css';

export function MobileReportMenu({
  isOpen,
  onClose,
  activeSectionId,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Report Table of Contents">
      <div className="mobile-menu-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="mobile-menu-panel">
        <div className="mobile-menu-header">
          <div className="mobile-menu-title-block">
            <span className="mobile-menu-heading font-heading">NEXA One</span>
            <span className="mobile-menu-sub">Business Analytics Report</span>
          </div>
          <button
            type="button"
            className="mobile-menu-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-menu-nav" aria-label="Mobile report sections">
          <ul className="mobile-nav-list" role="list">
            {REPORT_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSectionId === section.id;

              return (
                <li key={section.id} role="listitem">
                  <NavLink
                    to={section.path}
                    className={({ isActive: isRouteActive }) =>
                      `mobile-nav-item ${isRouteActive || isActive ? 'is-active' : ''}`
                    }
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="mobile-nav-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="mobile-nav-num">{section.number}</span>
                    <span className="mobile-nav-title">{section.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mobile-menu-footer">
          <span>NEXA One · Business Analytics Report</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Printer, Shield } from 'lucide-react';
import { ReportNavigation } from './ReportNavigation';
import './ReportShell.css';

export function ReportShell({
  children,
  activeSection = 'overview',
  onSelectSection = () => {},
  contextRail = null,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexa_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexa_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`report-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <ReportNavigation
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main Container */}
      <div className="report-main-container">
        {/* Top Header Bar */}
        <header className="report-header no-print">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsOpenMobile(true)}
              aria-label="Open report navigation"
            >
              <Menu size={20} />
            </button>
            <div className="header-breadcrumbs">
              <span className="breadcrumb-case">NEXA One</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-title">Business Analytics Report</span>
            </div>
          </div>

          <div className="header-right">
            <div className="report-header-badge">
              <span>Business Analytics Report</span>
            </div>
            <button
              type="button"
              className="header-action-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              type="button"
              className="header-action-btn"
              onClick={handlePrint}
              aria-label="Print report"
              title="Print report"
            >
              <Printer size={16} />
            </button>
          </div>
        </header>

        {/* Content Body & Optional Context Rail */}
        <div className="report-content-body">
          <main className="report-reading-area" id="main-content">
            {children}
          </main>

          {contextRail && (
            <aside className="report-context-rail no-print" aria-label="Context and methodology">
              {contextRail}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

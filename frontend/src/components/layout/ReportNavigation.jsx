import React from 'react';
import {
  FileText,
  Database,
  TrendingUp,
  BarChart2,
  Users,
  Globe,
  Compass,
  CheckSquare,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './ReportNavigation.css';

export const REPORT_SECTIONS = [
  { id: 'overview', number: '01', title: 'Executive Overview', icon: FileText },
  { id: 'business_data', number: '02', title: 'Business & Data Foundation', icon: Database },
  { id: 'advertising_sales', number: '03', title: 'Advertising & Sales Analysis', icon: TrendingUp },
  { id: 'channel_analysis', number: '04', title: 'Channel Performance & Attribution', icon: BarChart2 },
  { id: 'customer_drivers', number: '05', title: 'Customer Purchase Drivers', icon: Users },
  { id: 'market_macro', number: '06', title: 'Market & Macro Environment', icon: Globe },
  { id: 'strategy', number: '07', title: 'Strategic Synthesis', icon: Compass },
  { id: 'recommendations', number: '08', title: 'Business Recommendations', icon: CheckSquare },
  { id: 'methodology_sources', number: '09', title: 'Methodology & Source Register', icon: BookOpen },
];

export function ReportNavigation({
  activeSection = 'overview',
  onSelectSection = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
  isOpenMobile = false,
  onCloseMobile = () => {},
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="report-nav-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <nav
        className={`report-navigation ${isCollapsed ? 'is-collapsed' : ''} ${
          isOpenMobile ? 'is-open-mobile' : ''
        }`}
        aria-label="Report Navigation"
      >
        <div className="report-nav-header">
          <div className="report-brand">
            <span className="report-brand-badge">NEXA</span>
            {!isCollapsed && (
              <div className="report-brand-text">
                <span className="report-brand-title">NEXA One</span>
                <span className="report-brand-subtitle">Analytics Report</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="nav-collapse-btn no-print"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="report-nav-body">
          <div className="nav-group-label">{!isCollapsed && 'REPORT SECTIONS'}</div>
          <ul className="nav-items-list" role="list">
            {REPORT_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <li key={section.id} role="listitem">
                  <button
                    type="button"
                    className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      onSelectSection(section.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? `${section.number} ${section.title}` : undefined}
                  >
                    <span className="nav-item-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-item-number">{section.number}</span>
                        <span className="nav-item-title">{section.title}</span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="report-nav-footer">
          {!isCollapsed && (
            <div className="nav-footer-metadata">
              <span className="footer-edition">NEXA One Report</span>
              <span className="footer-confidentiality">Authorized Access Only</span>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

import React from 'react';
import './ReportTitle.css';

export function ReportTitle({ className = '' }) {
  return (
    <div className={`report-title-banner ${className}`}>
      <h1 className="report-title-heading">NEXA One — Business Analytics Report</h1>
    </div>
  );
}

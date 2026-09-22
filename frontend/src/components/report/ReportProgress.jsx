import React from 'react';
import { TOTAL_SECTIONS, getSectionIndex } from '../../config/reportSections';
import './ReportProgress.css';

export function ReportProgress({ activeSectionId, isCollapsed = false }) {
  const currentIndex = getSectionIndex(activeSectionId); // 0-based
  const currentStep = currentIndex + 1; // 1-based
  const progressPercent = Math.round((currentStep / TOTAL_SECTIONS) * 100);

  if (isCollapsed) {
    return (
      <div
        className="report-progress-collapsed"
        title={`Report Progress: ${currentStep} of ${TOTAL_SECTIONS} sections`}
        aria-label={`Report Progress: ${currentStep} of ${TOTAL_SECTIONS} sections`}
      >
        <div className="progress-radial-mini">
          <span className="progress-step-num">{currentStep}</span>
          <span className="progress-step-total">/9</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="report-progress"
      aria-label={`Report Progress: ${currentStep} of ${TOTAL_SECTIONS} sections`}
    >
      <div className="report-progress-header">
        <span className="report-progress-label">Report Progress</span>
        <span className="report-progress-count">
          {currentStep} of {TOTAL_SECTIONS} sections
        </span>
      </div>
      <div
        className="report-progress-track"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={TOTAL_SECTIONS}
        aria-valuetext={`${currentStep} of ${TOTAL_SECTIONS} sections`}
      >
        <div
          className="report-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

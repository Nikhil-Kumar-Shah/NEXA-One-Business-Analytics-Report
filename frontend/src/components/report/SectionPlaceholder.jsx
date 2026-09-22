import React from 'react';
import { FileCode2 } from 'lucide-react';
import './SectionPlaceholder.css';

export function SectionPlaceholder({
  sectionTitle,
  sectionNumber,
  className = '',
}) {
  return (
    <div className={`section-placeholder-card ${className}`}>
      <div className="section-placeholder-icon" aria-hidden="true">
        <FileCode2 size={24} />
      </div>
      <div className="section-placeholder-content">
        <span className="section-placeholder-tag">
          Section {sectionNumber} · Structure Active
        </span>
        <p className="section-placeholder-message">
          Section content will be added in the corresponding report phase.
        </p>
      </div>
    </div>
  );
}

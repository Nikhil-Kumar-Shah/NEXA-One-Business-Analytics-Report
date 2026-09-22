import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { REPORT_SECTIONS } from './config/reportSections';
import { ReportSectionView } from './views/ReportSectionView';
import { ComponentShowcase } from './showcase/ComponentShowcase';
import { ReportShell } from './components/report/ReportShell';
import { ScrollToTop } from './components/common/ScrollToTop';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Root redirects to Executive Overview */}
        <Route path="/" element={<Navigate to="/report/executive-overview" replace />} />
        <Route path="/report" element={<Navigate to="/report/executive-overview" replace />} />

        {/* Legacy aliases redirecting to canonical routes */}
        <Route path="/report/executive-summary" element={<Navigate to="/report/executive-overview" replace />} />
        <Route path="/report/strategy" element={<Navigate to="/report/strategy-decision" replace />} />
        <Route path="/report/strategic-direction" element={<Navigate to="/report/strategy-decision" replace />} />

        {/* Canonical routes for all 9 sections */}
        {REPORT_SECTIONS.map((section) => (
          <Route
            key={section.id}
            path={section.path}
            element={<ReportSectionView />}
          />
        ))}

        {/* Catch-all for parameterized section routing */}
        <Route path="/report/:sectionSlug" element={<ReportSectionView />} />

        {/* Fallback to Executive Overview */}
        <Route path="*" element={<Navigate to="/report/executive-overview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

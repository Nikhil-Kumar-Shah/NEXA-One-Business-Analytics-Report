import React from 'react';
import { useLocation, useParams, Navigate } from 'react-router-dom';
import { getSectionById, getSectionByPath } from '../config/reportSections';
import { ReportShell } from '../components/report/ReportShell';
import { SectionPlaceholder } from '../components/report/SectionPlaceholder';
import { ExecutiveOverviewView } from './overview/ExecutiveOverviewView';
import { AdvertisingSalesView } from './advertising/AdvertisingSalesView';
import { ChannelAnalysisView } from './channels/ChannelAnalysisView';
import { CustomerDriversView } from './customer/CustomerDriversView';
import { MarketMacroView } from './market/MarketMacroView';
import { StrategyDecisionView } from './strategy/StrategyDecisionView';
import { RecommendationsView } from './recommendations/RecommendationsView';
import { DataMethodologyView } from './methodology/DataMethodologyView';
import { MethodologySourcesView } from './methodology/MethodologySourcesView';

export function ReportSectionView() {
  const location = useLocation();
  const { sectionSlug } = useParams();

  // Determine section from either param or path
  let currentSection;
  if (sectionSlug) {
    currentSection = getSectionById(sectionSlug);
    // If slug not found, default or fallback
    if (!currentSection) {
      return <Navigate to="/report/executive-overview" replace />;
    }
  } else {
    currentSection = getSectionByPath(location.pathname);
  }

  // Section-specific analytical descriptors
  let sectionDescriptor = null;
  if (currentSection.id === 'executive-summary' || currentSection.id === 'executive-overview') {
    sectionDescriptor = 'Executive synthesis of empirical findings, customer research, and strategic direction.';
  } else if (currentSection.id === 'data-methodology') {
    sectionDescriptor = 'Data foundation, statistical methodologies, and analytical safeguards.';
  } else if (currentSection.id === 'advertising-sales') {
    sectionDescriptor = 'Statistical evidence for the relationship between advertising expenditure and observed sales.';
  } else if (currentSection.id === 'channel-analysis') {
    sectionDescriptor = 'Comparative evaluation of TV, social media, and print advertising relationships with sales.';
  } else if (currentSection.id === 'customer-purchase-drivers') {
    sectionDescriptor = 'Independent customer research on wireless audio purchase considerations and product attributes.';
  } else if (currentSection.id === 'market-macro') {
    sectionDescriptor = 'External evidence shaping the category, macroeconomic, and trade context for NEXA One.';
  } else if (currentSection.id === 'strategic-direction' || currentSection.id === 'strategy-decision') {
    sectionDescriptor = 'Strategic marketing framework synthesizing econometric evidence, customer drivers, and market signals.';
  } else if (currentSection.id === 'recommendations') {
    sectionDescriptor = 'Specific, evidence-linked recommendations, phased roadmap, and governance framework.';
  } else if (currentSection.id === 'methodology-sources') {
    sectionDescriptor = 'Authoritative source registry, data traceability, and analytical boundaries.';
  }

  // Render analytical view or placeholder
  const renderContent = () => {
    switch (currentSection.id) {
      case 'executive-summary':
      case 'executive-overview':
        return <ExecutiveOverviewView />;
      case 'data-methodology':
        return <DataMethodologyView />;
      case 'advertising-sales':
        return <AdvertisingSalesView />;
      case 'channel-analysis':
        return <ChannelAnalysisView />;
      case 'customer-purchase-drivers':
        return <CustomerDriversView />;
      case 'market-macro':
        return <MarketMacroView />;
      case 'strategic-direction':
      case 'strategy-decision':
        return <StrategyDecisionView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'methodology-sources':
        return <MethodologySourcesView />;
      default:
        return (
          <SectionPlaceholder
            sectionNumber={currentSection.number}
            sectionTitle={currentSection.title}
          />
        );
    }
  };

  return (
    <ReportShell
      sectionId={currentSection.id}
      descriptor={sectionDescriptor}
    >
      {renderContent()}
    </ReportShell>
  );
}

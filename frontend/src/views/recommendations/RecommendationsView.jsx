import React, { useEffect, useState, useCallback } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { fetchRecommendationsData } from '../../services/api';
import { LoadingState } from '../../components/feedback/LoadingState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { ExecutiveActionSummary } from './ExecutiveActionSummary';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationSummaryTable } from './RecommendationSummaryTable';
import { PhasedActionPlan } from './PhasedActionPlan';
import { ActionPlanTable } from './ActionPlanTable';
import { MeasurementFrameworkHierarchy } from './MeasurementFrameworkHierarchy';
import { ManagementChecklist } from './ManagementChecklist';
import './RecommendationsView.css';

/**
 * Section 08: Recommendations & Action Plan
 * Converts Q1-Q5 analytical evidence into specific, evidence-linked, actionable business directives.
 */
export function RecommendationsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRecommendationsData();
      setData(res);
    } catch (err) {
      console.error('Failed to load recommendations data:', err);
      setError(err.message || 'Please check the analytical recommendations service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <LoadingState
        title="Loading recommendations & action plan..."
        subtext="Synthesizing empirical evidence into specific managerial directives and measurement frameworks"
        skeletonLines={6}
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Recommendations could not be loaded."
        message="Please check the analytical data service and try again."
        onRetry={loadData}
        retryLabel="Retry Recommendations Service"
      />
    );
  }

  const { strategyData, sourcesData } = data;
  const {
    recommendations,
    action_plan_phases,
    action_plan_table,
    measurement_hierarchy,
    management_checklist,
    avoid_decisions,
  } = strategyData;

  return (
    <div className="recommendations-view" role="article" aria-label="Recommendations and Action Plan">
      {/* Opening Strategic Action Paragraph */}
      <div className="rec-lead-section">
        <p className="rec-opening-paragraph">
          The analysis supports a focused set of actions for NEXA One: maintain strong attention on TV and
          social media, reassess print, strengthen product-centered messaging, and introduce controlled
          measurement before making major allocation changes. These recommendations are based on the
          available advertising data, customer research and external market evidence.
        </p>
      </div>

      {/* 02: Executive Action Summary & Core Actions */}
      <div id="core-actions">
        <ExecutiveActionSummary />

        {/* 03: The 9 Detailed Recommendation Cards */}
        <section className="detailed-recs-section" aria-labelledby="detailed-recs-heading">
          <div className="detailed-recs-header">
            <Layers size={20} className="detailed-recs-icon" aria-hidden="true" />
            <div>
              <h2 id="detailed-recs-heading" className="detailed-recs-title">
                Detailed Strategic Recommendations
              </h2>
              <p className="detailed-recs-subtitle">
                Specific, evidence-linked recommendations addressing why, business role, risks, and measurement.
              </p>
            </div>
          </div>

          <div className="recs-cards-stack">
            {recommendations?.map((rec, idx) => (
              <RecommendationCard key={rec.id} rec={rec} index={idx} />
            ))}
          </div>
        </section>

        {/* 04: Recommendation Summary Table */}
        <RecommendationSummaryTable recommendations={recommendations} />
      </div>

      {/* 05 & 06: Phased Action Plan & Roadmap */}
      <div id="roadmap">
        <PhasedActionPlan phases={action_plan_phases} />
        <ActionPlanTable actions={action_plan_table} />
      </div>

      {/* 07: Measurement Framework */}
      <div id="measurement">
        <MeasurementFrameworkHierarchy levels={measurement_hierarchy} />
      </div>

      {/* 08: Management Checklist & Governance */}
      <div id="governance">
        <ManagementChecklist checklist={management_checklist} avoidDecisions={avoid_decisions} />
      </div>

      {/* 09: Prohibited Decisions & Recommendation Limitations */}
      <section id="avoid-decisions" className="rec-limitations-card" aria-labelledby="rec-limitations-heading">
        <div className="rec-limitations-header">
          <AlertTriangle size={20} className="rec-limitations-icon" aria-hidden="true" />
          <h2 id="rec-limitations-heading" className="rec-limitations-title">
            Prohibited Assumptions & Recommendation Boundaries
          </h2>
        </div>
        <p className="rec-limitations-body">
          These recommendations are based on the available internal advertising dataset and the reviewed
          external evidence. The analysis does not include channel-level advertising costs, margins, controlled
          experiments, causal attribution, NEXA-specific customer survey data or NEXA-specific market-share
          information. Consequently, the recommendations provide a direction for planning and testing rather
          than a mathematically optimized budget allocation.
        </p>
        <p className="rec-limitations-update">
          Future decisions should be updated as new internal performance, customer and market evidence becomes
          available.
        </p>
      </section>

      {/* 10: Final Recommendation Statement */}
      <section id="summary" className="final-recommendation-block" aria-labelledby="final-direction-heading">
        <div className="final-rec-badge-row">
          <span className="final-direction-badge">Final Synthesis</span>
        </div>
        <h2 id="final-direction-heading" className="final-rec-title font-heading">
          Recommended Direction
        </h2>
        <p className="final-rec-body">
          NEXA One should maintain strong attention on TV and social media, reconsider print investment,
          strengthen product-centered value communication, and use controlled measurement before making
          major allocation changes. The next planning cycle should combine measured campaign performance with
          updated customer and market evidence rather than relying on historical relationships alone.
        </p>
        <div className="final-principle-box">
          <span className="final-principle-label font-mono">Decision principle:</span>
          <p className="final-principle-text">
            Use the current analysis to decide where to focus attention; use controlled measurement to decide
            where to allocate more or less investment.
          </p>
        </div>
      </section>

      {/* 11: Source Traceability Table */}
      <section className="rec-sources-section" aria-labelledby="rec-sources-heading">
        <div className="rec-sources-header">
          <Database size={20} className="rec-sources-icon" aria-hidden="true" />
          <div>
            <h2 id="rec-sources-heading" className="rec-sources-title font-heading">
              Evidence Source Traceability
            </h2>
            <p className="rec-sources-subtitle">
              Every recommendation traces directly back to validated econometric models and authoritative
              research datasets.
            </p>
          </div>
        </div>

        <div className="rec-sources-table-wrapper">
          <table className="rec-sources-table">
            <thead>
              <tr>
                <th scope="col">Domain</th>
                <th scope="col">Authority / Source</th>
                <th scope="col" className="text-center">
                  Year
                </th>
                <th scope="col">Recommendation Contribution</th>
              </tr>
            </thead>
            <tbody>
              {sourcesData?.sources?.map((s, idx) => (
                <tr key={`rec-src-${idx}`}>
                  <th scope="row" className="rec-source-domain-cell">
                    <span className="rec-domain-tag">{s.dataset_domain}</span>
                  </th>
                  <td className="rec-source-name-cell">
                    <strong>{s.source_name}</strong>
                    <span className="rec-source-publisher">{s.publisher}</span>
                  </td>
                  <td className="text-center font-mono">{s.publication_year || 'N/A'}</td>
                  <td className="rec-source-contrib-cell">{s.what_it_contributes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

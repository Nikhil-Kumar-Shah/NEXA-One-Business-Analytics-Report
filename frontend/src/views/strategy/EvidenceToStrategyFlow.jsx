import React from 'react';
import { ArrowDown, Layers, BarChart2, Users, Globe, Compass } from 'lucide-react';
import './EvidenceToStrategyFlow.css';

/**
 * Section 1: "From Evidence to Strategy"
 * Visual evidence flow diagram and 4 connected evidence cards.
 */
export function EvidenceToStrategyFlow({ rSquared = '89.72%', customerObsCount = 57, marketObsCount = 38 }) {
  return (
    <section className="evidence-strategy-flow-container" aria-labelledby="flow-heading">
      <div className="es-header">
        <h2 id="flow-heading" className="es-title">From Evidence to Strategy</h2>
        <p className="es-subtitle">
          The strategy direction combines the observed advertising-sales relationships with customer research
          and external market context. No single evidence source is sufficient on its own.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="es-pipeline-diagram" aria-label="Evidence to Strategy Pipeline Flow">
        <div className="es-pipe-node">
          <div className="es-pipe-icon-wrap">
            <BarChart2 size={16} aria-hidden="true" />
          </div>
          <span className="es-pipe-label">Q1 + Q2</span>
          <span className="es-pipe-sub">Advertising Evidence</span>
        </div>

        <div className="es-pipe-connector">+</div>

        <div className="es-pipe-node">
          <div className="es-pipe-icon-wrap">
            <Users size={16} aria-hidden="true" />
          </div>
          <span className="es-pipe-label">Q3</span>
          <span className="es-pipe-sub">Customer Needs</span>
        </div>

        <div className="es-pipe-connector">+</div>

        <div className="es-pipe-node">
          <div className="es-pipe-icon-wrap">
            <Globe size={16} aria-hidden="true" />
          </div>
          <span className="es-pipe-label">Q4</span>
          <span className="es-pipe-sub">Market Conditions</span>
        </div>

        <div className="es-pipe-connector">=</div>

        <div className="es-pipe-node primary">
          <div className="es-pipe-icon-wrap primary">
            <Compass size={18} aria-hidden="true" />
          </div>
          <span className="es-pipe-label primary">NEXA STRATEGY</span>
          <span className="es-pipe-sub primary">Evidence-Based Direction</span>
        </div>
      </div>

      {/* 4 Connected Evidence Cards */}
      <div className="es-cards-grid">
        {/* CARD 1: Advertising Evidence */}
        <article className="es-card" aria-label="Advertising Evidence Card">
          <div className="es-card-header">
            <span className="es-card-step">01</span>
            <h3 className="es-card-title">Advertising Evidence</h3>
          </div>
          <p className="es-card-body">
            Advertising activity is strongly associated with observed sales. TV and social media show stronger
            relationships with sales than print in the available dataset.
          </p>
          <div className="es-card-footer">
            <div className="es-card-metric">
              <span className="es-metric-label">Model R²:</span>
              <span className="es-metric-val font-mono">{rSquared}</span>
            </div>
            <span className="es-card-source">Internal advertising dataset</span>
          </div>
        </article>

        {/* CARD 2: Channel Evidence */}
        <article className="es-card" aria-label="Channel Evidence Card">
          <div className="es-card-header">
            <span className="es-card-step">02</span>
            <h3 className="es-card-title">Channel Evidence</h3>
          </div>
          <p className="es-card-body">
            TV and social media show stronger observed relationships with sales. Print has a weaker relationship
            and a non-significant multivariate coefficient.
          </p>
          <div className="es-card-footer">
            <div className="es-card-metric-list font-mono">
              <span>TV r = 0.782</span>
              <span>Social r = 0.576</span>
              <span>Print r = 0.228</span>
            </div>
            <span className="es-card-source">Q2 channel analysis</span>
          </div>
        </article>

        {/* CARD 3: Customer Evidence */}
        <article className="es-card" aria-label="Customer Evidence Card">
          <div className="es-card-header">
            <span className="es-card-step">03</span>
            <h3 className="es-card-title">Customer Evidence</h3>
          </div>
          <p className="es-card-body">
            Research repeatedly identifies product experience and value considerations including sound quality,
            battery life, comfort, price/value, call quality, ANC and ease of use.
          </p>
          <div className="es-card-footer">
            <div className="es-card-metric">
              <span className="es-metric-label">Scope:</span>
              <span className="es-metric-val font-mono">{customerObsCount} evidence observations</span>
            </div>
            <span className="es-card-source">Independent research</span>
          </div>
        </article>

        {/* CARD 4: Market Evidence */}
        <article className="es-card" aria-label="Market Evidence Card">
          <div className="es-card-header">
            <span className="es-card-step">04</span>
            <h3 className="es-card-title">Market Evidence</h3>
          </div>
          <p className="es-card-body">
            The market context combines category maturity, premiumization, emerging open-ear alternatives,
            affordability considerations and supply-chain uncertainty.
          </p>
          <div className="es-card-footer">
            <div className="es-card-metric">
              <span className="es-metric-label">Scope:</span>
              <span className="es-metric-val font-mono">{marketObsCount} market observations</span>
            </div>
            <span className="es-card-source">External market research</span>
          </div>
        </article>
      </div>
    </section>
  );
}

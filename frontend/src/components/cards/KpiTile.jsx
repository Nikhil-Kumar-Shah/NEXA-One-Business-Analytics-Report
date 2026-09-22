import React from 'react';
import './KpiTile.css';

export function KpiTile({
  ticker,
  delta,
  value,
  sub,
  sparkHeights = [30, 45, 70, 100, 60, 40, 85],
  className = '',
}) {
  return (
    <article className={`vl-kpi-tile ${className}`}>
      <div className="vl-kpi-tile__head">
        {ticker && <span className="vl-kpi-tile__ticker">{ticker}</span>}
        {delta && <span className="vl-kpi-tile__delta font-mono">{delta}</span>}
      </div>

      <div className="vl-kpi-tile__value font-mono">{value}</div>

      <div className="vl-kpi-tile__foot">
        {sub && <span className="vl-kpi-tile__sub">{sub}</span>}
        {sparkHeights && sparkHeights.length > 0 && (
          <div className="vl-kpi-tile__spark" aria-hidden="true">
            {sparkHeights.map((h, i) => {
              let variant = '';
              if (h >= 80) variant = 'vl-kpi-tile__bar--lime';
              else if (h >= 50) variant = 'vl-kpi-tile__bar--deep';
              else if (i % 3 === 0) variant = 'vl-kpi-tile__bar--ink';

              return (
                <span
                  key={i}
                  className={`vl-kpi-tile__bar ${variant}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

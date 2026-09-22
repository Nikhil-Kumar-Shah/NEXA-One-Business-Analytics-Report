import React from 'react';
import './CoefficientBarChart.css';

export function CoefficientBarChart({
  tvCoeff = 0.0458,
  socialCoeff = 0.1885,
  printCoeff = -0.0010,
  className = '',
}) {
  const maxAbsVal = 0.22; // scale boundary for visualization

  const channels = [
    {
      name: 'TV Ads',
      code: 'tv',
      coeff: tvCoeff,
      displayVal: (tvCoeff >= 0 ? '+' : '') + tvCoeff.toFixed(4),
      pVal: '< 0.0001',
      interpretation: 'Positive association holding other channels constant',
      barPercent: Math.abs(tvCoeff) / maxAbsVal * 100,
      isPositive: tvCoeff >= 0,
    },
    {
      name: 'Social Media Ads',
      code: 'social',
      coeff: socialCoeff,
      displayVal: (socialCoeff >= 0 ? '+' : '') + socialCoeff.toFixed(4),
      pVal: '< 0.0001',
      interpretation: 'Positive association holding other channels constant',
      barPercent: Math.abs(socialCoeff) / maxAbsVal * 100,
      isPositive: socialCoeff >= 0,
    },
    {
      name: 'Print Ads',
      code: 'print',
      coeff: printCoeff,
      displayVal: printCoeff.toFixed(4),
      pVal: '0.8599',
      interpretation: 'Close to zero; not statistically distinguishable from zero',
      barPercent: Math.max(2, Math.abs(printCoeff) / maxAbsVal * 100),
      isPositive: printCoeff >= 0,
    },
  ];

  return (
    <div
      className={`coeff-chart-wrapper ${className}`}
      role="region"
      aria-label="Estimated channel regression coefficients comparison"
    >
      <div className="coeff-bars-list">
        {channels.map((channel) => (
          <div key={channel.code} className="coeff-bar-row">
            <div className="coeff-bar-label-area">
              <span className="coeff-channel-name">{channel.name}</span>
              <span className="coeff-p-val">p = {channel.pVal}</span>
            </div>

            <div className="coeff-track-area">
              <div
                className="coeff-track"
                role="meter"
                aria-valuenow={channel.coeff}
                aria-label={`${channel.name} coefficient = ${channel.displayVal}`}
              >
                <div
                  className={`coeff-fill fill-${channel.code} ${channel.isPositive ? 'pos' : 'neg'}`}
                  style={{ width: `${channel.barPercent}%` }}
                />
              </div>
              <span className="coeff-value">β = {channel.displayVal}</span>
            </div>

            <div className="coeff-descriptor">{channel.interpretation}</div>
          </div>
        ))}
      </div>

      <div className="coeff-disclaimer-bar">
        <span className="coeff-note-line">
          Estimated coefficients from the multivariate linear regression.
        </span>
        <span className="coeff-disclaimer-line">
          Coefficient estimates are not causal ROI estimates. Units: Sales in 000 units per $000s advertising spend.
        </span>
      </div>
    </div>
  );
}

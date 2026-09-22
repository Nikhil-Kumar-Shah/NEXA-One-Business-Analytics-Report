import React from 'react';
import './CorrelationBarChart.css';

export function CorrelationBarChart({
  tvCorr = 0.7822,
  socialCorr = 0.5762,
  printCorr = 0.2283,
  className = '',
}) {
  const channels = [
    {
      name: 'TV Ads',
      code: 'tv',
      value: tvCorr,
      displayVal: tvCorr.toFixed(3),
      percentWidth: Math.round(tvCorr * 100),
      note: 'Strongest positive association with sales',
      significance: 'p < 0.001',
    },
    {
      name: 'Social Media Ads',
      code: 'social',
      value: socialCorr,
      displayVal: socialCorr.toFixed(3),
      percentWidth: Math.round(socialCorr * 100),
      note: 'Moderate-to-strong positive association',
      significance: 'p < 0.001',
    },
    {
      name: 'Print Ads',
      code: 'print',
      value: printCorr,
      displayVal: printCorr.toFixed(3),
      percentWidth: Math.round(printCorr * 100),
      note: 'Substantially weaker positive association',
      significance: 'p = 0.001',
    },
  ];

  return (
    <div
      className={`correlation-chart-wrapper ${className}`}
      role="region"
      aria-label="Advertising Channel Correlation with Sales bar comparison"
    >
      <div className="correlation-bars-list">
        {channels.map((channel) => (
          <div key={channel.code} className="correlation-bar-row">
            <div className="correlation-bar-label-area">
              <span className="channel-name">{channel.name}</span>
              <span className="channel-significance">{channel.significance}</span>
            </div>

            <div className="correlation-track-area">
              <div
                className="correlation-track"
                role="meter"
                aria-valuenow={channel.value}
                aria-valuemin="0"
                aria-valuemax="1"
                aria-label={`${channel.name} Pearson correlation r = ${channel.displayVal}`}
              >
                <div
                  className={`correlation-fill fill-${channel.code}`}
                  style={{ width: `${channel.percentWidth}%` }}
                />
              </div>
              <span className="channel-value">r = {channel.displayVal}</span>
            </div>

            <div className="channel-descriptor">{channel.note}</div>
          </div>
        ))}
      </div>

      {/* Axis Reference line */}
      <div className="correlation-axis-ref">
        <div className="axis-ticks">
          <span>0.0</span>
          <span>0.25</span>
          <span>0.50</span>
          <span>0.75</span>
          <span>1.0 (Maximum)</span>
        </div>
      </div>
    </div>
  );
}

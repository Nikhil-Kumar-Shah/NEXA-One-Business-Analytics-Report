import React, { useState, useMemo } from 'react';
import './ScatterPlot.css';

export function ScatterPlot({
  title,
  xKey = 'x',
  yKey = 'sales',
  data = [],
  xLabel = 'Advertising spend ($000s)',
  yLabel = 'Sales (000 units)',
  colorVar = 'var(--color-primary)',
  showFitLine = true,
  fitLineLabel = 'Linear fit',
  className = '',
  selectedPoint: externalSelectedPoint,
  onSelectPoint: externalOnSelectPoint,
  enablePointSelection = true,
}) {
  const [internalHoveredPoint, setInternalHoveredPoint] = useState(null);
  const [internalSelectedPoint, setInternalSelectedPoint] = useState(null);

  const selectedPoint = externalSelectedPoint !== undefined ? externalSelectedPoint : internalSelectedPoint;
  const handleSelectPoint = (pt) => {
    const next = (selectedPoint?.market_number === pt?.market_number) ? null : pt;
    if (externalOnSelectPoint) {
      externalOnSelectPoint(next);
    } else {
      setInternalSelectedPoint(next);
    }
  };

  // SVG coordinate system
  const width = 600;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Extract min and max
  const { xMin, xMax, yMin, yMax, fitLine, stats } = useMemo(() => {
    if (!data || data.length === 0) {
      return { xMin: 0, xMax: 100, yMin: 0, yMax: 30, fitLine: null, stats: {} };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    const n = data.length;

    data.forEach((d) => {
      const x = d[xKey] ?? 0;
      const y = d[yKey] ?? 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    // Round bounds for clean axes
    const roundedMinX = Math.floor(Math.max(0, minX * 0.9));
    const roundedMaxX = Math.ceil(maxX * 1.05);
    const roundedMinY = Math.floor(Math.max(0, minY * 0.8));
    const roundedMaxY = Math.ceil(maxY * 1.08);

    // OLS linear fit: y = slope * x + intercept
    const denom = n * sumX2 - sumX * sumX;
    const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;

    const fitStart = { x: roundedMinX, y: slope * roundedMinX + intercept };
    const fitEnd = { x: roundedMaxX, y: slope * roundedMaxX + intercept };

    return {
      xMin: roundedMinX,
      xMax: roundedMaxX,
      yMin: roundedMinY,
      yMax: roundedMaxY,
      fitLine: { fitStart, fitEnd, slope, intercept },
      stats: { n, minX, maxX, minY, maxY },
    };
  }, [data, xKey, yKey]);

  // Coordinate mappers
  const scaleX = (val) => padding.left + ((val - xMin) / (xMax - xMin || 1)) * plotWidth;
  const scaleY = (val) => padding.top + plotHeight - ((val - yMin) / (yMax - yMin || 1)) * plotHeight;

  // Grid tick intervals
  const xTicks = useMemo(() => {
    const count = 5;
    const step = (xMax - xMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(xMin + i * step));
  }, [xMin, xMax]);

  const yTicks = useMemo(() => {
    const count = 5;
    const step = (yMax - yMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round((yMin + i * step) * 10) / 10);
  }, [yMin, yMax]);

  return (
    <div className={`scatter-plot-container ${className}`}>
      {title && <h4 className="scatter-plot-title">{title}</h4>}

      <div className="scatter-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="scatter-svg"
          role="img"
          aria-label={`${title || 'Scatter plot'}: ${data.length} observations`}
        >
          {/* Grid lines & Y Axis ticks */}
          {yTicks.map((tick) => {
            const yPos = scaleY(tick);
            return (
              <g key={`y-${tick}`} className="grid-group">
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  className="grid-line"
                />
                <text
                  x={padding.left - 8}
                  y={yPos + 4}
                  className="axis-tick-text"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Grid lines & X Axis ticks */}
          {xTicks.map((tick) => {
            const xPos = scaleX(tick);
            return (
              <g key={`x-${tick}`} className="grid-group">
                <line
                  x1={xPos}
                  y1={padding.top}
                  x2={xPos}
                  y2={height - padding.bottom}
                  className="grid-line"
                />
                <text
                  x={xPos}
                  y={height - padding.bottom + 16}
                  className="axis-tick-text"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 12}
            className="axis-label-text"
            textAnchor="middle"
          >
            {xLabel}
          </text>
          <text
            x={16}
            y={padding.top + plotHeight / 2}
            className="axis-label-text"
            textAnchor="middle"
            transform={`rotate(-90 16 ${padding.top + plotHeight / 2})`}
          >
            {yLabel}
          </text>

          {/* Fitted Linear Trend Line */}
          {showFitLine && fitLine && (
            <line
              x1={scaleX(fitLine.fitStart.x)}
              y1={scaleY(fitLine.fitStart.y)}
              x2={scaleX(fitLine.fitEnd.x)}
              y2={scaleY(fitLine.fitEnd.y)}
              className="scatter-fit-line"
            />
          )}

          {/* Data Points (all 200 observations) */}
          {data.map((d) => {
            const cx = scaleX(d[xKey] ?? 0);
            const cy = scaleY(d[yKey] ?? 0);
            const isHovered = internalHoveredPoint?.market_number === d.market_number;
            const isSelected = selectedPoint?.market_number === d.market_number;
            const isReview = d.row_review_status === 'REVIEW';

            return (
              <g key={d.market_number}>
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    className="scatter-point-selection-ring"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : isHovered ? 5.5 : 3.5}
                  className={`scatter-point ${isReview ? 'is-review' : ''} ${isHovered ? 'is-hovered' : ''} ${isSelected ? 'is-selected' : ''}`}
                  style={{ fill: isReview ? 'var(--color-warning)' : colorVar }}
                  onMouseEnter={() => setInternalHoveredPoint(d)}
                  onMouseLeave={() => setInternalHoveredPoint(null)}
                  onClick={() => enablePointSelection && handleSelectPoint(d)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`Market ${d.market_number}: ${xLabel}=${d[xKey]}, Sales=${d[yKey]}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      enablePointSelection && handleSelectPoint(d);
                    }
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip displaying all required fields */}
        {internalHoveredPoint && (
          <div
            className="scatter-tooltip"
            style={{
              left: `${(scaleX(internalHoveredPoint[xKey] ?? 0) / width) * 100}%`,
              top: `${(scaleY(internalHoveredPoint[yKey] ?? 0) / height) * 100}%`,
            }}
          >
            <div className="tooltip-header">
              <span>Market #{internalHoveredPoint.market_number}</span>
              {internalHoveredPoint.row_review_status === 'REVIEW' && (
                <span className="tooltip-review-tag">Review flag</span>
              )}
            </div>
            <div className="tooltip-grid">
              <div className="tooltip-row">
                <span className="tooltip-lbl">TV Ads:</span>
                <span className="tooltip-val">${(internalHoveredPoint.tv_ads ?? 0).toFixed(1)}k</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-lbl">Social Media:</span>
                <span className="tooltip-val">${(internalHoveredPoint.social_media_ads ?? 0).toFixed(1)}k</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-lbl">Print Ads:</span>
                <span className="tooltip-val">${(internalHoveredPoint.print_ads ?? 0).toFixed(1)}k</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-lbl">Total Ads:</span>
                <span className="tooltip-val">${(internalHoveredPoint.total_advertising ?? 0).toFixed(1)}k</span>
              </div>
              <div className="tooltip-row tooltip-row-highlight">
                <span className="tooltip-lbl">Observed Sales:</span>
                <span className="tooltip-val">{(internalHoveredPoint.sales ?? 0).toFixed(1)}k units</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selectable Observation Details Panel */}
      {selectedPoint && (
        <div className="observation-details-panel" role="region" aria-label="Selected Observation Details">
          <div className="observation-details-header">
            <div>
              <span className="obs-panel-kicker">Observation details</span>
              <h5 className="obs-panel-title">Market #{selectedPoint.market_number}</h5>
            </div>
            <button
              type="button"
              className="obs-panel-close-btn"
              onClick={() => handleSelectPoint(null)}
              aria-label="Deselect observation"
            >
              × Clear
            </button>
          </div>
          <div className="observation-details-grid">
            <div className="obs-detail-item">
              <span className="obs-detail-label">TV Ads</span>
              <span className="obs-detail-val font-mono">${(selectedPoint.tv_ads ?? 0).toFixed(2)}k</span>
            </div>
            <div className="obs-detail-item">
              <span className="obs-detail-label">Social Media Ads</span>
              <span className="obs-detail-val font-mono">${(selectedPoint.social_media_ads ?? 0).toFixed(2)}k</span>
            </div>
            <div className="obs-detail-item">
              <span className="obs-detail-label">Print Ads</span>
              <span className="obs-detail-val font-mono">${(selectedPoint.print_ads ?? 0).toFixed(2)}k</span>
            </div>
            <div className="obs-detail-item">
              <span className="obs-detail-label">Total Advertising</span>
              <span className="obs-detail-val font-mono">${(selectedPoint.total_advertising ?? 0).toFixed(2)}k</span>
            </div>
            <div className="obs-detail-item obs-detail-item-sales">
              <span className="obs-detail-label">Observed Sales</span>
              <span className="obs-detail-val font-mono">{(selectedPoint.sales ?? 0).toFixed(2)}k units</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend & Causation Note */}
      <div className="scatter-legend-bar">
        <div className="scatter-legend-items">
          <span className="legend-point-indicator" style={{ backgroundColor: colorVar }} />
          <span className="legend-label">Market observation (n = {data.length})</span>
          {showFitLine && (
            <>
              <span className="legend-sep">·</span>
              <span className="legend-line-indicator" />
              <span className="legend-label">{fitLineLabel}</span>
            </>
          )}
          {enablePointSelection && (
            <>
              <span className="legend-sep">·</span>
              <span className="legend-hint">Click any observation point to inspect details</span>
            </>
          )}
        </div>
        <span className="scatter-disclaimer">
          Each point represents one market observation. The fitted relationship describes association in the observed data and does not establish causation.
        </span>
      </div>
    </div>
  );
}

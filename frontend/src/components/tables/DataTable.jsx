import React from 'react';
import './DataTable.css';

/**
 * columns: Array<{ key: string, label: string, align?: 'left'|'center'|'right', render?: (val, row) => ReactNode }>
 * data: Array<Record<string, any>>
 * highlightRowKey?: (row) => boolean
 */
export function DataTable({
  title,
  subtitle,
  columns = [],
  data = [],
  compact = false,
  sourceNote = null,
  highlightRow = null,
  onRowClick = null,
  emptyMessage = 'No data available',
  className = '',
}) {
  return (
    <div className={`data-table-wrapper ${className}`}>
      {(title || subtitle) && (
        <div className="data-table-header">
          <div>
            {title && <h3 className="data-table-title">{title}</h3>}
            {subtitle && <p className="data-table-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className="table-scroll-container">
        <table className={`report-table ${compact ? 'compact' : ''}`}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`align-${col.align || 'left'}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const isHighlighted = highlightRow ? highlightRow(row, index) : false;
                const isClickable = Boolean(onRowClick);
                return (
                  <tr
                    key={row.id || index}
                    className={`${isHighlighted ? 'highlight-row' : ''} ${isClickable ? 'is-clickable' : ''}`}
                    onClick={() => onRowClick && onRowClick(row, index)}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(row, index);
                      }
                    }}
                  >
                    {columns.map((col) => {
                      const val = row[col.key];
                      const rendered = col.render ? col.render(val, row) : val;
                      return (
                        <td
                          key={col.key}
                          className={`align-${col.align || 'left'}`}
                        >
                          {rendered}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {sourceNote && (
        <div className="data-table-footer">
          <span>{sourceNote}</span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Search } from 'lucide-react';
import './SearchField.css';

export function SearchField({
  label,
  value,
  onChange,
  placeholder = 'Search evidence, sources...',
  helpText,
  id = 'nexa-search',
  className = '',
}) {
  return (
    <div className={`vl-search-field ${className}`}>
      {label && (
        <label className="vl-search-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="vl-search-field__group">
        <Search size={16} className="vl-search-field__icon" aria-hidden="true" />
        <input
          className="vl-search-field__input font-sans"
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {helpText && <span className="vl-search-field__help">{helpText}</span>}
    </div>
  );
}

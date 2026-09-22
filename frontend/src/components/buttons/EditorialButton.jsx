import React from 'react';
import { Link } from 'react-router-dom';
import './EditorialButton.css';

export function EditorialButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'dark'
  to,
  href,
  onClick,
  icon,
  iconRight,
  type = 'button',
  className = '',
  disabled = false,
}) {
  const buttonClass = `vl-btn vl-btn--${variant} ${className}`;

  const content = (
    <>
      {icon && <span className="vl-btn__icon">{icon}</span>}
      <span className="vl-btn__text">{children}</span>
      {iconRight && <span className="vl-btn__icon vl-btn__icon--right">{iconRight}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

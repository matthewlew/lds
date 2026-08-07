import React from 'react';

export function Tag({ children, hue, status, emphasis, size, interactive, inactive, icon, dot, className = '', ...rest }) {
  const cls = ['lds-tag',
    hue ? `hue-${hue}` : '',
    size === 'sm' ? 'lds-tag--sm' : '',
    status ? `lds-tag--${status}` : '',
    emphasis ? `emph-${emphasis}` : '',
    interactive ? 'lds-tag--interactive' : '',
    inactive ? 'lds-tag--inactive' : '',
    className].filter(Boolean).join(' ');
  return React.createElement('span', { className: cls, 'data-status': status || undefined, ...rest },
    icon && React.createElement('span', { className: 'lds-tag__icon' }, icon),
    dot && React.createElement('span', { className: 'lds-tag__dot' }),
    children);
}
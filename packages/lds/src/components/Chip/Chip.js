import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function Chip({ children, selected, size, icon, caret, onRemove, removeLabel = 'Remove', iconHref, onClick, className = '', ...rest }) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-chip',
    size === 'sm' ? 'lds-chip--sm' : size === 'lg' ? 'lds-chip--lg' : '',
    selected ? 'lds-chip--selected' : '',
    className].filter(Boolean).join(' ');
  const content = [
    icon && React.createElement('span', { key: 'i', className: 'lds-chip__icon' }, icon),
    children,
    caret && React.createElement('span', { key: 'c', className: 'lds-chip__caret' }, caret),
    onRemove && React.createElement('button', {
      key: 'r', type: 'button', className: 'lds-chip__remove', 'aria-label': removeLabel,
      onClick: (e) => { e.stopPropagation(); onRemove(e); }
    }, React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' }, React.createElement('use', { href: `${spriteHref}#close` })))
  ];
  // a removable chip is a static tag (e.g. an input's autofill token), not a
  // toggle: the remove button can't nest inside another <button>, so it
  // renders as a span. Pass onClick if the label itself is still actionable.
  if (onRemove) {
    return React.createElement('span', {
      className: cls, onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined,
      'aria-pressed': selected !== undefined ? !!selected : undefined, ...rest
    }, content);
  }
  return React.createElement('button', { type: 'button', className: cls, 'aria-pressed': !!selected, onClick, ...rest }, content);
}
import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function Row({ lead, title, subtitle, trail, chevron, selected, iconHref, compact, roomy, className = '', ...rest }) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-row', compact ? 'lds-row--compact' : '', roomy ? 'lds-row--roomy' : '', (rest.href || rest.onClick) ? 'lds-row--interactive' : '', className].filter(Boolean).join(' ');
  const Tag = rest.href ? 'a' : 'div';
  const sprite = (name) => React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
    React.createElement('use', { href: `${spriteHref}#${name}` }));
  // chevron={true} draws Open Icons' chevron-right; a node is used as given.
  const mark = chevron === true ? sprite('chevron-right') : chevron;
  return React.createElement(Tag, {
    className: cls,
    'aria-selected': selected !== undefined ? String(!!selected) : undefined,
    ...rest
  },
    lead && React.createElement('div', { className: 'lds-row__lead' }, lead),
    React.createElement('div', { className: 'lds-row__content' },
      React.createElement('div', { className: 'lds-row__title' }, title),
      subtitle && React.createElement('div', { className: 'lds-row__subtitle' }, subtitle)),
    trail && React.createElement('div', { className: 'lds-row__trail' }, trail),
    selected && React.createElement('div', { className: 'lds-row__check' }, sprite('check')),
    mark && React.createElement('div', { className: 'lds-row__chevron' }, mark));
}
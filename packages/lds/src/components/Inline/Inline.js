import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

// Status carries a fixed meaning icon from Open Icons — the same map Banner and
// Toast use, so an inline error and a banner error never disagree about what red
// means. See ../../status-icons.js.
import { STATUS_ICON } from '../../status-icons.js';

export function Inline({ status, icon, iconHref, children, className = '', ...rest }) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-inline', status ? `lds-inline--${status}` : '', className].filter(Boolean).join(' ');
  const mark = icon !== undefined ? icon : (STATUS_ICON[status] &&
    React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${spriteHref}#${STATUS_ICON[status]}` })));
  return React.createElement('span', { className: cls, 'data-status': status || undefined, ...rest },
    mark && React.createElement('span', { className: 'lds-inline__icon' }, mark),
    children);
}
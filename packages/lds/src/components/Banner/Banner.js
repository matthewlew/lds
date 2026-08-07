import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

// Each status carries a fixed meaning icon from Open Icons, shown automatically
// unless the caller overrides with `icon`. The map is shared with Inline and
// Toast so the three can never disagree — see ../../status-icons.js.
import { STATUS_ICON } from '../../status-icons.js';

export function Banner({ status, emphasis, page, title, icon, iconHref, children, actions, dismissible, onDismiss, className = '', ...rest }) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-banner',
    status ? `lds-banner--${status}` : '',
    page ? 'lds-banner--page' : '',
    emphasis ? `emph-${emphasis}` : '',
    className].filter(Boolean).join(' ');
  const statusIcon = icon !== undefined ? icon : (STATUS_ICON[status] &&
    React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' }, React.createElement('use', { href: `${spriteHref}#${STATUS_ICON[status]}` })));
  return React.createElement('div', { className: cls, 'data-status': status || undefined, ...rest },
    statusIcon,
    React.createElement('div', null,
      title && React.createElement('div', { className: 'lds-banner__title' }, title),
      children,
      actions && React.createElement('div', { className: 'lds-banner__actions' }, actions)),
    dismissible && React.createElement('button', { type: 'button', className: 'lds-banner__dismiss', 'aria-label': 'Dismiss', onClick: onDismiss },
      React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' }, React.createElement('use', { href: `${spriteHref}#close` }))));
}
import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function Button({
  variant = 'primary', size, iconOnly, fab, extended, emphasis, hue, armed,
  iconStart, iconEnd, subtitle, iconHref,
  href, disabled, className = '', children, ...rest
}) {
  const spriteHref = resolveSprite(iconHref);
  const stacked = subtitle !== undefined;
  const cls = ['lds-btn',
    variant ? `lds-btn--${variant}` : '',
    size === 'sm' ? 'lds-btn--sm' : size === 'lg' ? 'lds-btn--lg' : '',
    (iconOnly || (fab && !extended)) ? 'lds-btn--icon' : '',
    fab ? 'lds-btn--fab' : '',
    fab && extended ? 'lds-btn--extended' : '',
    stacked ? 'lds-btn--stacked' : '',
    emphasis ? `emph-${emphasis}` : '',
    hue ? `hue-${hue}` : '',
    armed ? 'is-armed' : '',
    className].filter(Boolean).join(' ');
  // an icon prop takes a sprite name or a node.
  // The slots are keyed because `body` is passed as an array: React treats that
  // as a list and warns without them, and an unkeyed list also lets it reuse the
  // wrong node when a prefix icon appears or disappears between renders.
  const mark = (icon, key) => icon === undefined || icon === null ? null
    : React.createElement('span', { className: 'lds-btn__icon', key },
      typeof icon === 'string'
        ? React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
          React.createElement('use', { href: `${spriteHref}#${icon}` }))
        : icon);
  const label = children === undefined ? null : React.createElement('span', { className: 'lds-btn__label', key: 'label' }, children);
  const body = [
    mark(iconStart, 'start'),
    stacked
      ? React.createElement('span', { className: 'lds-btn__text', key: 'text' }, label,
        React.createElement('span', { className: 'lds-btn__subtitle' }, subtitle))
      : label,
    mark(iconEnd, 'end')
  ];
  // A link that must look like a button IS this button, rendered as an anchor —
  // same sizes, same paint. aria-disabled rather than disabled, which an <a>
  // does not support.
  if (href !== undefined) {
    return React.createElement('a', {
      className: cls, href: disabled ? undefined : href,
      role: 'button', 'aria-disabled': disabled ? 'true' : undefined,
      'data-armed': armed ? '' : undefined, ...rest
    }, body);
  }
  return React.createElement('button', {
    className: cls, disabled, 'data-armed': armed ? '' : undefined, ...rest
  }, body);
}
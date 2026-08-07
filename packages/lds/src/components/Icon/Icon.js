import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function Icon({ name, size, className = '', href, style, ...rest }) {
  const spriteHref = resolveSprite(href);
  const s = size ? { width: size, height: size, ...style } : style;
  return React.createElement('svg', { className: `lds-icon ${className}`, style: s, ...rest },
    React.createElement('use', { href: `${spriteHref}#${name}` }));
}
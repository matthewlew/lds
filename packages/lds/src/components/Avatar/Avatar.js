import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

// Avatar — initials, an image, or a person icon.
//
// The hue is DERIVED from the name, not passed in, so the same person is the
// same colour in every surface of every app without anyone storing a colour.
// It resolves to one of the palette's nine hues and paints emph-soft on it, so
// contrast is guaranteed by the ramp rather than checked per colour.
const HUES = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet', 'pink', 'gray'];

export function hueForName(name) {
  const s = String(name || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003;
  return HUES[h % HUES.length];
}

export function initialsForName(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const letters = words.map((w) => (w.match(/\p{L}|\d/u) || [''])[0]);
  const picked = words.length === 1 ? letters[0] : letters[0] + letters[letters.length - 1];
  return picked.toUpperCase();
}

export function Avatar({
  name, src, alt, size, hue, ring, iconHref, className = '', ...rest
}) {
  const spriteHref = resolveSprite(iconHref);
  const initials = initialsForName(name);
  const resolvedHue = hue || hueForName(name || 'anon');
  const cls = ['lds-avatar',
    size ? `lds-avatar--${size}` : '',
    `hue-${resolvedHue}`,
    ring ? 'lds-avatar--ring' : '',
    className].filter(Boolean).join(' ');
  const label = alt || name || 'Person';
  let inner;
  if (src) inner = React.createElement('img', { src, alt: label });
  else if (initials) inner = initials;
  // no name to draw from — a person icon, never a random letter or an empty disc
  else inner = React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
    React.createElement('use', { href: `${spriteHref}#person` }));
  return React.createElement('span', {
    className: cls, role: 'img', 'aria-label': label, title: name || undefined, ...rest
  }, inner);
}
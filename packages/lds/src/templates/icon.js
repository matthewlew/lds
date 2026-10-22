import { attrs, cx } from './attrs.js';
import { escapeHtml } from './escape.js';
import { resolveSprite } from '../icon-sprite.js';

// Decorative unless named: a glyph beside a label repeats the label, and one
// the screen reader announces as an unnamed image is noise. An icon given its
// own name (`aria-label`, `aria-labelledby` or a `role`) is left for assistive
// technology to read.
export function icon({ name, size, className = '', href, style, ...rest } = {}) {
  const spriteHref = resolveSprite(href);
  const s = size ? { width: size, height: size, ...style } : style;
  const named = rest['aria-label'] || rest['aria-labelledby'] || rest.role;
  return `<svg${attrs({
    className: cx('lds-icon', className), style: s,
    'aria-hidden': named ? undefined : 'true', ...rest,
  })}>`
    + `<use href="${escapeHtml(`${spriteHref}#${name}`)}"></use></svg>`;
}

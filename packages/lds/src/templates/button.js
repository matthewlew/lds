import { attrs, cx } from './attrs.js';
import { slot } from './escape.js';
import { spriteSvg } from './sprite.js';

export function button({
  variant, size, iconOnly, fab, extended, emphasis, hue, armed,
  iconStart, iconEnd, subtitle, iconHref,
  href, disabled, className = '', children, ...rest
} = {}) {
  // `primary` is the default only when nothing else sets the paint. An emphasis
  // with no variant must not pick one up: `.lds-btn--primary` comes later in the
  // stylesheet than `.emph-*` and its tokens win, so `emphasis: 'strong'` would
  // otherwise render primary's soft tint instead of the full fill.
  const tone = variant ?? (emphasis ? undefined : 'primary');
  const stacked = subtitle !== undefined;
  const cls = cx('lds-btn',
    tone && `lds-btn--${tone}`,
    size === 'sm' ? 'lds-btn--sm' : size === 'lg' ? 'lds-btn--lg' : '',
    (iconOnly || (fab && !extended)) && 'lds-btn--icon',
    fab && 'lds-btn--fab',
    fab && extended && 'lds-btn--extended',
    stacked && 'lds-btn--stacked',
    emphasis && `emph-${emphasis}`,
    hue && `hue-${hue}`,
    armed && 'is-armed',
    className);
  // an icon slot takes a sprite name or composed markup.
  const mark = (icon) => icon === undefined || icon === null ? ''
    : `<span class="lds-btn__icon">${typeof icon === 'string' ? spriteSvg(icon, iconHref) : slot(icon)}</span>`;
  const label = children === undefined ? '' : `<span class="lds-btn__label">${slot(children)}</span>`;
  const body = mark(iconStart)
    + (stacked
      ? `<span class="lds-btn__text">${label}<span class="lds-btn__subtitle">${slot(subtitle)}</span></span>`
      : label)
    + mark(iconEnd);
  // A link that must look like a button IS this button, rendered as an anchor —
  // same sizes, same paint, and still a link: it navigates, so it keeps the
  // anchor's role (a `role="button"` would announce "button" for something that
  // leaves the page, and Space would not follow it). aria-disabled rather than
  // disabled, which an <a> does not support, and the href is dropped so it is
  // not merely styled dead. An <a> with no href has no role at all, so a
  // disabled one says `role="link"` to stay a (disabled) link.
  if (href !== undefined) {
    return `<a${attrs({
      className: cls, href: disabled ? undefined : href,
      role: disabled ? 'link' : undefined, 'aria-disabled': disabled ? 'true' : undefined,
      'data-armed': armed ? '' : undefined, ...rest,
    })}>${body}</a>`;
  }
  return `<button${attrs({ className: cls, disabled, 'data-armed': armed ? '' : undefined, ...rest })}>${body}</button>`;
}

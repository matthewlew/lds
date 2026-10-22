// Button, ButtonGroup and Link: the templates in button.js, button-group.js and
// link.js, as JSX. Attribute order follows the templates' prop order, because
// React serialises props in the order it is given them and the parity test
// holds the two outputs byte for byte.
import { cx, iconSlot, SpriteIcon } from './shared.js';

export function Button({
  variant, size, iconOnly, fab, extended, emphasis, hue, armed,
  iconStart, iconEnd, subtitle, iconHref,
  href, as: Anchor = 'a', disabled, className = '', children, ...rest
}) {
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
  const mark = (icon) => icon === undefined || icon === null ? null
    : <span className="lds-btn__icon">{iconSlot(icon, iconHref)}</span>;
  const label = children === undefined ? null : <span className="lds-btn__label">{children}</span>;
  const body = (
    <>
      {mark(iconStart)}
      {stacked
        ? <span className="lds-btn__text">{label}<span className="lds-btn__subtitle">{subtitle}</span></span>
        : label}
      {mark(iconEnd)}
    </>
  );
  if (href !== undefined) {
    // A disabled link has no href to navigate to, so it is a plain anchor even
    // when `as` names a router's link component, which would insist on one.
    const A = disabled ? 'a' : Anchor;
    return (
      <A
        className={cls} href={disabled ? undefined : href}
        role={disabled ? 'link' : undefined} aria-disabled={disabled ? 'true' : undefined}
        data-armed={armed ? '' : undefined} {...rest}
      >
        {body}
      </A>
    );
  }
  return <button className={cls} disabled={disabled} data-armed={armed ? '' : undefined} {...rest}>{body}</button>;
}

export function ButtonGroup({
  children, detail, detailNote,
  orientation = 'horizontal', width = 'hug', align = 'end',
  stackOnMobile = true, className = '', ...rest
}) {
  const conversion = detail !== undefined || detailNote !== undefined;
  const cls = cx('lds-btn-group',
    orientation === 'vertical' && 'lds-btn-group--vertical',
    width === 'fill' && 'lds-btn-group--fill',
    conversion ? 'lds-btn-group--conversion' : `lds-btn-group--${align}`,
    !conversion && stackOnMobile && orientation !== 'vertical' && 'lds-btn-group--stack',
    className);
  return (
    <div className={cls} role="group" {...rest}>
      {conversion ? (
        <div className="lds-btn-group__detail">
          {detail ? <span className="lds-btn-group__detail-title">{detail}</span> : null}
          {detailNote ? <span className="lds-btn-group__detail-note">{detailNote}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Link({
  children, href, variant, iconEnd, iconHref, as: A = 'a', className = '', ...rest
}) {
  const cls = cx('lds-link',
    variant === 'quiet' && 'lds-link--quiet',
    variant === 'standalone' && 'lds-link--standalone', className);
  const mark = variant === 'standalone' && iconEnd !== null
    ? (typeof iconEnd === 'string' || iconEnd === undefined
      ? <SpriteIcon name={iconEnd || 'chevron-right'} href={iconHref} />
      : iconEnd)
    : null;
  return <A className={cls} href={href} {...rest}>{children}{mark}</A>;
}

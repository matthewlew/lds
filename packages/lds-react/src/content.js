// The components that hold content rather than a value: Avatar, Card,
// EmptyState, Icon, Menu, Modal, Nav, Row, Skeleton, Table and Tabs.
import { hueForName, initialsForName } from '@lew-ds/lds';
import { cx, iconSlot, SpriteIcon } from './shared.js';

export function Avatar({ name, src, alt, size, hue, ring, iconHref, className = '', ...rest }) {
  const initials = initialsForName(name);
  const cls = cx('lds-avatar', size && `lds-avatar--${size}`,
    `hue-${hue || hueForName(name || 'anon')}`, ring && 'lds-avatar--ring', className);
  const label = alt || name || 'Person';
  return (
    <span className={cls} role="img" aria-label={label} title={name || undefined} {...rest}>
      {/* no name to draw from: a person icon, never a random letter or an empty disc */}
      {src ? <img src={src} alt={label} /> : initials || <SpriteIcon name="person" href={iconHref} />}
    </span>
  );
}

export function Card({
  kicker, title, body, meta, actions, emphasis, hue,
  selectable, selected, disabled, className = '', children, ...rest
}) {
  const cls = cx('lds-card', selectable && 'lds-card--selectable',
    emphasis && `emph-${emphasis}`, hue && `hue-${hue}`, className);
  const content = (
    <>
      {kicker ? <div className="lds-card__kicker">{kicker}</div> : null}
      {title ? <div className="lds-card__title">{title}</div> : null}
      {body ? <p className="lds-card__body">{body}</p> : null}
      {children}
      {meta ? <div className="lds-card__divider lds-card__divider--meta"></div> : null}
      {meta ? <div className="lds-card__meta">{meta}</div> : null}
      {actions ? <div className="lds-card__actions">{actions}</div> : null}
    </>
  );
  // A selectable card is a real button: Space/Enter, a focus ring and a
  // reported pressed state come with it.
  if (selectable) {
    return (
      <button
        type="button" className={cls} aria-pressed={selected ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : undefined} disabled={disabled} {...rest}
      >
        {content}
      </button>
    );
  }
  return <div className={cls} {...rest}>{content}</div>;
}

export function EmptyState({
  icon, image, imageAlt = '', expressive, iconHref, title, body, actions, className = '',
}) {
  const mark = iconSlot(icon, iconHref);
  const media = typeof image === 'string' ? <img className="lds-empty__media" src={image} alt={imageAlt} /> : image;
  return (
    <div className={cx('lds-empty', expressive && 'lds-empty--expressive', className)}>
      {media || mark}
      {title ? <div className="lds-empty__title">{title}</div> : null}
      {body ? <p className="lds-empty__body">{body}</p> : null}
      {actions ? <div className="lds-empty__actions">{actions}</div> : null}
    </div>
  );
}

/** One glyph. Decorative unless given a name (`aria-label`, `aria-labelledby`, `role`). */
export function Icon({ name, size, className = '', href = '', style, ...rest }) {
  const s = size ? { width: size, height: size, ...style } : style;
  const named = rest['aria-label'] || rest['aria-labelledby'] || rest.role;
  return (
    <svg className={cx('lds-icon', className)} style={s} aria-hidden={named ? undefined : 'true'} {...rest}>
      <use href={`${href}#${name}`} />
    </svg>
  );
}

export function Menu({ items = [], className = '' }) {
  return (
    <div className={cx('lds-menu', className)}>
      {items.map((it, i) => it.separator
        ? <hr key={i} className="lds-menu__separator" />
        : (
          <button
            key={i} type="button" className={'lds-menu__item' + (it.danger ? ' lds-menu__item--danger' : '')}
            disabled={it.disabled} onClick={it.onClick}
          >
            {it.icon}
            <span className="lds-menu__label">{it.label}</span>
            {it.hint ? <span className="lds-menu__hint">{it.hint}</span> : null}
          </button>
        ))}
    </div>
  );
}

export function Modal({
  title, children, actions, cancel, onClose, onBack,
  size, sheet, side, largeTitle = true, iconHref, className = '',
}) {
  const cls = cx('lds-modal', size && `lds-modal--${size}`,
    sheet && 'lds-modal--sheet', side && 'lds-modal--side', className);
  const groupCls = ['lds-btn-group', 'lds-btn-group--stack',
    cancel ? 'lds-btn-group--split' : 'lds-btn-group--end'].join(' ');
  return (
    <div className="lds-modal-scrim">
      <div className={cls}>
        {(sheet || side) ? <div className="lds-modal__handle"></div> : null}
        <div className="lds-modal__header">
          {onBack ? (
            <button type="button" className="lds-modal__back" aria-label="Back" onClick={onBack}>
              <SpriteIcon name="chevron-left" href={iconHref} />
            </button>
          ) : null}
          {title ? <div className="lds-modal__title">{title}</div> : null}
          <button type="button" className="lds-modal__close" aria-label="Close" onClick={onClose}>
            <SpriteIcon name="close" href={iconHref} />
          </button>
        </div>
        <div className="lds-modal__body">
          {(largeTitle && title) ? <h2 className="lds-modal__title lds-modal__title--large">{title}</h2> : null}
          {children}
        </div>
        {(cancel || actions) ? (
          <div className="lds-modal__actions"><div className={groupCls} role="group">{cancel}{actions}</div></div>
        ) : null}
      </div>
    </div>
  );
}

export function Nav({
  variant = 'brand', logo, links,
  title, subtitle, onBack, backLabel = 'Back', actions,
  sticky, scrolled, iconHref, className = '', children, ...rest
}) {
  const bar = variant === 'bar';
  const cls = cx('lds-nav', bar && 'lds-nav--bar', sticky && 'lds-nav--sticky',
    bar && scrolled && 'lds-nav--scrolled', className);
  if (!bar) {
    return (
      <nav className={cls} {...rest}>
        {logo ? <div className="lds-nav__logo">{logo}</div> : null}
        {links ? <div className="lds-nav__links lds-nav__spacer">{links}</div> : null}
        {children}
      </nav>
    );
  }
  return (
    <nav className={cls} aria-label={typeof title === 'string' ? title : undefined} {...rest}>
      {onBack ? (
        <button type="button" className="lds-nav__back" aria-label={backLabel} onClick={onBack}>
          <SpriteIcon name="chevron-left" href={iconHref} />
        </button>
      ) : null}
      {(title || subtitle) ? (
        <div className="lds-nav__titles">
          {title ? <div className="lds-nav__title">{title}</div> : null}
          {subtitle ? <div className="lds-nav__subtitle">{subtitle}</div> : null}
        </div>
      ) : null}
      {actions ? <div className="lds-nav__actions">{actions}</div> : null}
      {children}
    </nav>
  );
}

export function Row({
  lead, title, subtitle, trail, chevron, selected, iconHref,
  compact, roomy, as: Anchor = 'a', className = '', ...rest
}) {
  const cls = cx('lds-row', compact && 'lds-row--compact', roomy && 'lds-row--roomy',
    (rest.href || rest.onClick) && 'lds-row--interactive', className);
  const Tag = rest.href ? Anchor : 'div';
  const mark = chevron === true ? <SpriteIcon name="chevron-right" href={iconHref} /> : chevron;
  return (
    <Tag className={cls} aria-selected={selected !== undefined ? String(!!selected) : undefined} {...rest}>
      {lead ? <div className="lds-row__lead">{lead}</div> : null}
      <div className="lds-row__content">
        <div className="lds-row__title">{title}</div>
        {subtitle ? <div className="lds-row__subtitle">{subtitle}</div> : null}
      </div>
      {trail ? <div className="lds-row__trail">{trail}</div> : null}
      {selected ? <div className="lds-row__check"><SpriteIcon name="check" href={iconHref} /></div> : null}
      {mark ? <div className="lds-row__chevron">{mark}</div> : null}
    </Tag>
  );
}

export function Skeleton({ variant = 'text', last, className = '', style, ...rest }) {
  const cls = cx('lds-skeleton', `lds-skeleton--${variant}`, last && 'lds-skeleton--last', className);
  return <span className={cls} style={style} {...rest}></span>;
}

/**
 * `columns` and `rows` for a plain grid of data; otherwise compose the
 * `<thead>` and `<tbody>` as children — for a `<th scope="row">`, attributes or
 * a key on a row, a struck-through row. The table paints both the same.
 */
export function Table({ columns, rows = [], children, className = '', ...rest }) {
  return (
    <table className={cx('lds-table', className)} {...rest}>
      {columns ? (
        <>
          <thead>
            <tr>{columns.map((c) => <th key={c.key} scope="col" className={c.className}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{columns.map((c) => <td key={c.key} className={c.className}>{r[c.key]}</td>)}</tr>
            ))}
          </tbody>
        </>
      ) : children !== undefined ? children : <><thead><tr></tr></thead><tbody></tbody></>}
    </table>
  );
}

export function Tabs({ tabs: items = [], active, onChange, className = '' }) {
  return (
    <div className={cx('lds-tabs', className)}>
      {items.map((t, i) => t.section
        ? <div key={`s${i}`} className="lds-tabs__section">{t.section}</div>
        : (
          <button
            key={t.id ?? i} type="button" className={`lds-tabs__tab${t.id === active ? ' lds-tabs__tab--active' : ''}`}
            onClick={onChange && (() => onChange(t.id))}
          >
            {t.icon ? <SpriteIcon name={t.icon} href={t.iconHref} /> : null}
            <span>{t.label}</span>
          </button>
        ))}
    </div>
  );
}

// Banner, Inline, Tag, Chip and Toast: the components that say how something
// stands. Banner, Inline and Toast draw from one status map, STATUS_ICON, so an
// inline error and a toast error cannot disagree about what red means.
//
// Handlers (`onDismiss`, `onRemove`, `onClick`) bind to the buttons the
// templates draw; they never reach the markup, so a component passed none
// renders the same on a server as in the browser.
import { STATUS_ICON } from '@lew-ds/lds';
import { cx, SpriteIcon } from './shared.js';

/** The status glyph unless `icon` overrides it; `icon={null}` draws none. */
const statusMark = (icon, status, iconHref) => icon !== undefined
  ? icon
  : STATUS_ICON[status] ? <SpriteIcon name={STATUS_ICON[status]} href={iconHref} /> : null;

export function Banner({
  status, emphasis, page, title, icon, iconHref, children, actions,
  dismissible, onDismiss, className = '', ...rest
}) {
  const cls = cx('lds-banner',
    status && `lds-banner--${status}`,
    page && 'lds-banner--page',
    emphasis && `emph-${emphasis}`,
    className);
  return (
    <div className={cls} data-status={status || undefined} {...rest}>
      {statusMark(icon, status, iconHref)}
      <div>
        {title ? <div className="lds-banner__title">{title}</div> : null}
        {children}
        {actions ? <div className="lds-banner__actions">{actions}</div> : null}
      </div>
      {dismissible ? (
        <button type="button" className="lds-banner__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <SpriteIcon name="close" href={iconHref} />
        </button>
      ) : null}
    </div>
  );
}

export function Inline({ status, icon, iconHref, children, className = '', ...rest }) {
  const mark = statusMark(icon, status, iconHref);
  return (
    <span className={cx('lds-inline', status && `lds-inline--${status}`, className)} data-status={status || undefined} {...rest}>
      {mark ? <span className="lds-inline__icon">{mark}</span> : null}
      {children}
    </span>
  );
}

export function Tag({
  children, hue, status, emphasis, size, interactive, inactive, icon, dot,
  className = '', ...rest
}) {
  const cls = cx('lds-tag',
    hue && `hue-${hue}`,
    size === 'sm' && 'lds-tag--sm',
    status && `lds-tag--${status}`,
    emphasis && `emph-${emphasis}`,
    interactive && 'lds-tag--interactive',
    inactive && 'lds-tag--inactive',
    className);
  return (
    <span className={cls} data-status={status || undefined} {...rest}>
      {icon ? <span className="lds-tag__icon">{icon}</span> : null}
      {dot ? <span className="lds-tag__dot"></span> : null}
      {children}
    </span>
  );
}

export function Chip({
  children, selected, size, icon, caret, onRemove, removeLabel = 'Remove',
  iconHref, onClick, className = '', ...rest
}) {
  const cls = cx('lds-chip',
    size === 'sm' ? 'lds-chip--sm' : size === 'lg' ? 'lds-chip--lg' : '',
    selected && 'lds-chip--selected', className);
  const content = (
    <>
      {icon ? <span className="lds-chip__icon">{icon}</span> : null}
      {children}
      {caret ? <span className="lds-chip__caret">{caret}</span> : null}
      {onRemove ? (
        <button
          type="button" className="lds-chip__remove" aria-label={removeLabel}
          // The token's own onClick is the label's action, not the remove's.
          onClick={(e) => { e.stopPropagation(); onRemove(e); }}
        >
          <SpriteIcon name="close" href={iconHref} />
        </button>
      ) : null}
    </>
  );
  // A removable chip is a token, not a toggle: its remove button cannot nest
  // inside another <button>, so it is a span — a focusable one when its label
  // is still actionable.
  if (onRemove) {
    const activate = onClick && ((e) => {
      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(e); }
    });
    return (
      <span
        className={cls} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}
        aria-pressed={selected !== undefined ? String(!!selected) : undefined}
        onClick={onClick} onKeyDown={activate || undefined} {...rest}
      >
        {content}
      </span>
    );
  }
  return <button type="button" className={cls} aria-pressed={String(!!selected)} onClick={onClick} {...rest}>{content}</button>;
}

/**
 * One toast's markup. Raise toasts with `useToast()` under a `<ToastProvider>`,
 * which queues, times and dismisses them; render this directly only for a
 * static example.
 */
export function Toast({
  status, title, children, actions,
  dismissible = true, onDismiss, dismissLabel = 'Dismiss',
  icon, iconHref, className = '', ...rest
}) {
  return (
    <div
      className={cx('lds-toast', className)} data-status={status || undefined}
      role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}
      {...rest}
    >
      {statusMark(icon, status, iconHref)}
      <div className="lds-toast__content">
        {title ? <div className="lds-toast__title">{title}</div> : null}
        {children}
        {actions ? <div className="lds-toast__actions">{actions}</div> : null}
      </div>
      {dismissible ? (
        <button type="button" className="lds-toast__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <SpriteIcon name="close" href={iconHref} />
        </button>
      ) : null}
    </div>
  );
}

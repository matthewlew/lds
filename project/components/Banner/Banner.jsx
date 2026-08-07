// same status vocabulary as Tag/Inline: each status carries a fixed meaning icon
// from Open Icons, shown automatically unless the caller overrides with `icon`.
// The blocking statuses take the FILLED glyph: at 16-20px a filled triangle or
// disc reads as a stop signal at a glance, where the line version reads as
// another outline in a form full of outlines. Success and info stay line — they
// are confirmations, and a filled tick shouts louder than the news deserves.
const STATUS_ICON = { info: 'info', success: 'check-circle', warning: 'warning-fill', caution: 'warning-fill', error: 'close-circle-fill' };

export function Banner({ status, emphasis, page, title, icon, iconHref = 'icons.svg', children, actions, dismissible, onDismiss, className = '', ...rest }) {
  const cls = ['lds-banner',
    status ? `lds-banner--${status}` : '',
    page ? 'lds-banner--page' : '',
    emphasis ? `emph-${emphasis}` : '',
    className].filter(Boolean).join(' ');
  const statusIcon = icon !== undefined ? icon : (STATUS_ICON[status] &&
    React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' }, React.createElement('use', { href: `${iconHref}#${STATUS_ICON[status]}` })));
  return React.createElement('div', { className: cls, 'data-status': status || undefined, ...rest },
    statusIcon,
    React.createElement('div', null,
      title && React.createElement('div', { className: 'lds-banner__title' }, title),
      children,
      actions && React.createElement('div', { className: 'lds-banner__actions' }, actions)),
    dismissible && React.createElement('button', { type: 'button', className: 'lds-banner__dismiss', 'aria-label': 'Dismiss', onClick: onDismiss },
      React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' }, React.createElement('use', { href: `${iconHref}#close` }))));
}
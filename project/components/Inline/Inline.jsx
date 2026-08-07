// Status carries a fixed meaning icon from Open Icons — the same map Banner uses,
// with the blocking statuses on the FILLED glyph so they read as a stop signal,
// so an inline error and a banner error never disagree about what red means.
// Colour alone is not an accessible carrier, so the icon is shown by default.
const STATUS_ICON = { info: 'info', success: 'check-circle', warning: 'warning-fill', caution: 'warning-fill', error: 'close-circle-fill' };

export function Inline({ status, icon, iconHref = 'icons.svg', children, className = '', ...rest }) {
  const cls = ['lds-inline', status ? `lds-inline--${status}` : '', className].filter(Boolean).join(' ');
  const mark = icon !== undefined ? icon : (STATUS_ICON[status] &&
    React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${iconHref}#${STATUS_ICON[status]}` })));
  return React.createElement('span', { className: cls, 'data-status': status || undefined, ...rest },
    mark && React.createElement('span', { className: 'lds-inline__icon' }, mark),
    children);
}
export function Link({ children, href, variant, iconEnd, iconHref = 'icons.svg', className = '', ...rest }) {
  const cls = ['lds-link',
    variant === 'quiet' ? 'lds-link--quiet' : '',
    variant === 'standalone' ? 'lds-link--standalone' : '',
    className].filter(Boolean).join(' ');
  // a standalone link gets a trailing chevron by default — it is the affordance
  // that replaces the underline it drops.
  const mark = variant === 'standalone' && iconEnd !== null
    ? (typeof iconEnd === 'string' || iconEnd === undefined
      ? React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
        React.createElement('use', { href: `${iconHref}#${iconEnd || 'chevron-right'}` }))
      : iconEnd)
    : null;
  return React.createElement('a', { className: cls, href, ...rest }, children, mark);
}
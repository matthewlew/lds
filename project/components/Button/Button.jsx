export function Button({
  variant = 'primary', size, iconOnly, fab, extended, emphasis, hue, armed,
  iconStart, iconEnd, subtitle, iconHref = 'icons.svg',
  href, disabled, className = '', children, ...rest
}) {
  const stacked = subtitle !== undefined;
  const cls = ['lds-btn',
    variant ? `lds-btn--${variant}` : '',
    size === 'sm' ? 'lds-btn--sm' : size === 'lg' ? 'lds-btn--lg' : '',
    (iconOnly || (fab && !extended)) ? 'lds-btn--icon' : '',
    fab ? 'lds-btn--fab' : '',
    fab && extended ? 'lds-btn--extended' : '',
    stacked ? 'lds-btn--stacked' : '',
    emphasis ? `emph-${emphasis}` : '',
    hue ? `hue-${hue}` : '',
    armed ? 'is-armed' : '',
    className].filter(Boolean).join(' ');
  // an icon prop takes a sprite name or a node
  const mark = (icon) => icon === undefined || icon === null ? null
    : React.createElement('span', { className: 'lds-btn__icon' },
      typeof icon === 'string'
        ? React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
          React.createElement('use', { href: `${iconHref}#${icon}` }))
        : icon);
  const label = children === undefined ? null : React.createElement('span', { className: 'lds-btn__label' }, children);
  const body = [
    mark(iconStart),
    stacked
      ? React.createElement('span', { className: 'lds-btn__text' }, label,
        React.createElement('span', { className: 'lds-btn__subtitle' }, subtitle))
      : label,
    mark(iconEnd)
  ];
  // A link that must look like a button IS this button, rendered as an anchor —
  // same sizes, same paint. aria-disabled rather than disabled, which an <a>
  // does not support.
  if (href !== undefined) {
    return React.createElement('a', {
      className: cls, href: disabled ? undefined : href,
      role: 'button', 'aria-disabled': disabled ? 'true' : undefined,
      'data-armed': armed ? '' : undefined, ...rest
    }, body);
  }
  return React.createElement('button', {
    className: cls, disabled, 'data-armed': armed ? '' : undefined, ...rest
  }, body);
}
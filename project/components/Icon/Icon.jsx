export function Icon({ name, size, className = '', href = 'icons.svg', style, ...rest }) {
  const s = size ? { width: size, height: size, ...style } : style;
  return React.createElement('svg', { className: `lds-icon ${className}`, style: s, ...rest },
    React.createElement('use', { href: `${href}#${name}` }));
}
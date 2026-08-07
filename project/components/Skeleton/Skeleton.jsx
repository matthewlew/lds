export function Skeleton({ variant = 'text', last, className = '', style, ...rest }) {
  const cls = ['lds-skeleton', `lds-skeleton--${variant}`, last ? 'lds-skeleton--last' : '', className].filter(Boolean).join(' ');
  return React.createElement('span', { className: cls, style, ...rest });
}
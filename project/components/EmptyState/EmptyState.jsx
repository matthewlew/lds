export function EmptyState({ icon, image, imageAlt = '', expressive, iconHref = 'icons.svg', title, body, actions, className = '' }) {
  const cls = ['lds-empty', expressive ? 'lds-empty--expressive' : '', className].filter(Boolean).join(' ');
  // icon takes a sprite name or a node; image takes a src or a node. Either one
  // is the branding slot — an empty state has room for expression, so it is the
  // one place the system invites a real asset instead of a utility glyph.
  const mark = typeof icon === 'string'
    ? React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${iconHref}#${icon}` }))
    : icon;
  const media = typeof image === 'string'
    ? React.createElement('img', { className: 'lds-empty__media', src: image, alt: imageAlt })
    : image;
  return React.createElement('div', { className: cls },
    media || mark,
    title && React.createElement('div', { className: 'lds-empty__title' }, title),
    body && React.createElement('p', { className: 'lds-empty__body' }, body),
    actions && React.createElement('div', { className: 'lds-empty__actions' }, actions));
}
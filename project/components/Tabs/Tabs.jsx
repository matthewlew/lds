export function Tabs({ tabs = [], active, onChange, className = '' }) {
  return React.createElement('div', { className: ['lds-tabs', className].filter(Boolean).join(' ') },
    tabs.map((t, i) => t.section
      ? React.createElement('div', { key: `s${i}`, className: 'lds-tabs__section' }, t.section)
      : React.createElement('button', {
        key: t.id, type: 'button',
        className: 'lds-tabs__tab' + (t.id === active ? ' lds-tabs__tab--active' : ''),
        onClick: () => onChange && onChange(t.id)
      },
        t.icon && React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
          React.createElement('use', { href: `${t.iconHref || 'icons.svg'}#${t.icon}` })),
        React.createElement('span', null, t.label))));
}
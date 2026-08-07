export function Menu({ items = [], className = '' }) {
  return React.createElement('div', { className: ['lds-menu', className].filter(Boolean).join(' ') },
    items.map((it, i) => it.separator
      ? React.createElement('hr', { key: i, className: 'lds-menu__separator' })
      : React.createElement('button', {
          key: i, type: 'button',
          className: 'lds-menu__item' + (it.danger ? ' lds-menu__item--danger' : ''),
          disabled: it.disabled, onClick: it.onClick
        },
          it.icon,
          React.createElement('span', { className: 'lds-menu__label' }, it.label),
          it.hint && React.createElement('span', { className: 'lds-menu__hint' }, it.hint))));
}
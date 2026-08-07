export function Toggle({ label, help, id, className = '', ...rest }) {
  return React.createElement('div', { className: ['lds-toggle', className].filter(Boolean).join(' ') },
    (label || help) && React.createElement('div', { className: 'lds-toggle__text' },
      label && React.createElement('span', { className: 'lds-toggle__label' }, label),
      help && React.createElement('span', { className: 'lds-toggle__help' }, help)),
    React.createElement('label', { className: 'lds-toggle__switch' },
      React.createElement('input', { type: 'checkbox', id, ...rest }),
      React.createElement('span', { className: 'lds-toggle__track' }))
  );
}
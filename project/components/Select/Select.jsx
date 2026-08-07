export function Select({ label, id, help, error, required, options = [], className = '', ...rest }) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', className].filter(Boolean).join(' ');
  return React.createElement('div', { className: cls, 'data-status': error ? 'error' : undefined },
    label && React.createElement('label', { htmlFor: id, className: required ? 'lds-field__req' : '' }, label),
    React.createElement('select', { id, ...rest },
      // Keyed by index, not by value: a dial-code list has twenty entries whose
      // value is "+1", and they are all legitimate.
      options.map((o, i) => {
        if (o && o.options) {
          return React.createElement('optgroup', { key: 'g' + i, label: o.label },
            o.options.map((c, k) => {
              const opt = typeof c === 'string' ? { value: c, label: c } : c;
              return React.createElement('option', { key: k, value: opt.value }, opt.label);
            }));
        }
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return React.createElement('option', { key: i, value: opt.value }, opt.label);
      })),
    error ? React.createElement('span', { className: 'lds-field__error' }, error)
      : help ? React.createElement('span', { className: 'lds-field__help' }, help) : null
  );
}
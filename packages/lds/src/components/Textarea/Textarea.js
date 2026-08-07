import React from 'react';

export function Textarea({ label, id, help, error, required, maxLength, showCount, value, defaultValue, onChange, className = '', ...rest }) {
  const cls = ['lds-field', error ? 'lds-field--error' : '', className].filter(Boolean).join(' ');
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const text = controlled ? value : inner;
  const count = String(text ?? '').length;
  const over = maxLength !== undefined && count >= maxLength;
  const handle = (e) => { if (!controlled) setInner(e.target.value); if (onChange) onChange(e); };
  const showFooter = (showCount || maxLength !== undefined) || !!help || !!error;
  return React.createElement('div', { className: cls, 'data-status': error ? 'error' : undefined },
    label && React.createElement('label', { htmlFor: id, className: required ? 'lds-field__req' : '' }, label),
    React.createElement('textarea', { id, maxLength, value: text, onChange: handle, ...rest }),
    showFooter && React.createElement('div', { className: 'lds-field__footer' },
      error ? React.createElement('span', { className: 'lds-field__error' }, error)
        : help ? React.createElement('span', { className: 'lds-field__help' }, help)
          : React.createElement('span', { className: 'lds-field__help' }),
      (showCount || maxLength !== undefined) && React.createElement('span',
        { className: 'lds-field__count' + (over ? ' lds-field__count--over' : '') },
        maxLength !== undefined ? `${count} / ${maxLength}` : String(count)))
  );
}
import React from 'react';

export function Checkbox({ label, id, className = '', ...rest }) {
  return React.createElement('label', { className: ['lds-check', className].filter(Boolean).join(' ') },
    React.createElement('input', { type: 'checkbox', id, ...rest }),
    React.createElement('span', { className: 'lds-check__box' }),
    label
  );
}
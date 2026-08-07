import React from 'react';

export function Radio({ label, id, name, className = '', ...rest }) {
  return React.createElement('label', { className: ['lds-check', 'lds-check--radio', className].filter(Boolean).join(' ') },
    React.createElement('input', { type: 'radio', id, name, ...rest }),
    React.createElement('span', { className: 'lds-check__box' }),
    label
  );
}
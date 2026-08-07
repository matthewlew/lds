import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

// One-time code (2FA). One box per digit, because the boxes are what tell the
// user how many to expect. Paste fills the whole code; backspace steps back.
export function CodeField({ label, help, error, success, verifying, length = 6, groupAfter, size, value, onChange, iconHref, className = '', ...rest }) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-field',
    error ? 'lds-field--error' : '',
    success ? 'lds-field--success' : '',
    className].filter(Boolean).join(' ');
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState('');
  const code = (controlled ? value : inner) || '';
  const refs = React.useRef([]);
  const commit = (next) => {
    const clean = next.replace(/\D/g, '').slice(0, length);
    if (!controlled) setInner(clean);
    if (onChange) onChange(clean);
    return clean;
  };
  const onCell = (i) => (e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) { // paste
      const clean = commit(typed);
      const focus = Math.min(clean.length, length - 1);
      refs.current[focus] && refs.current[focus].focus();
      return;
    }
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = typed;
    commit(chars.join('').trimEnd());
    refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const onKey = (i) => (e) => {
    if (e.key === 'Backspace' && !code[i]) {
      const prev = refs.current[i - 1];
      if (prev) { prev.focus(); commit(code.slice(0, i - 1)); }
    }
  };
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (groupAfter && i === groupAfter) cells.push(React.createElement('span', { key: `g${i}`, className: 'lds-field__code-gap' }));
    cells.push(React.createElement('input', {
      key: i, ref: (el) => { refs.current[i] = el; },
      type: 'text', inputMode: 'numeric', autoComplete: i === 0 ? 'one-time-code' : 'off',
      maxLength: length, 'aria-label': `Digit ${i + 1}`,
      // A verified or in-flight code is read-only rather than disabled: disabled
      // would drop the digits out of the tab order and stop a screen reader
      // announcing what was actually entered.
      readOnly: !!(success || verifying),
      value: code[i] || '', onChange: onCell(i), onKeyDown: onKey(i), ...rest
    }));
  }
  const mark = (name) => React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
    React.createElement('use', { href: `${spriteHref}#${name}` }));
  // role=status, so the verdict is announced when it arrives rather than only
  // being visible. This is the one field the user cannot self-check.
  const note = error ? React.createElement('span', { className: 'lds-field__error', role: 'alert' }, mark('close-circle-fill'), error)
    : success ? React.createElement('span', { className: 'lds-field__success', role: 'status' }, mark('check-circle'), success === true ? 'Verified' : success)
    : verifying ? React.createElement('span', { className: 'lds-field__help', role: 'status' }, verifying === true ? 'Checking\u2026' : verifying)
    : help ? React.createElement('span', { className: 'lds-field__help' }, help) : null;
  return React.createElement('div', { className: cls, 'data-status': error ? 'error' : undefined },
    label && React.createElement('label', null, label),
    React.createElement('div', { className: 'lds-field__code' + (size === 'sm' ? ' lds-field__code--sm' : '') }, cells),
    note
  );
}
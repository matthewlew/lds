'use client';
// CodeField: a one-time code, one box per digit. Typing walks focus forward,
// Backspace on an empty box walks it back, and a paste fills every box. The
// behaviour is @lew-ds/lds's `mountCodeField`, in React state; `onChange`
// receives the digits entered so far.
import { useEffect, useRef, useState } from 'react';
import { cx, SpriteIcon } from './shared.js';

export function CodeField({
  label, help, error, success, verifying, length = 6, groupAfter, size,
  value = '', onChange, iconHref, className = '', ...rest
}) {
  const [code, setCode] = useState(String(value || ''));
  // A new `value` from the caller replaces the digits, as `update()` does.
  useEffect(() => { setCode(String(value || '')); }, [value]);
  const boxes = useRef([]);

  const commit = (next, focusIndex) => {
    const digits = String(next).replace(/\D/g, '').slice(0, length);
    setCode(digits);
    if (focusIndex !== undefined) boxes.current[Math.max(0, Math.min(focusIndex, length - 1))]?.focus();
    onChange?.(digits);
  };
  const onInput = (i) => (e) => {
    const typed = e.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) { commit(typed, typed.length); return; } // a paste
    const chars = code.padEnd(length, ' ').split('');
    chars[i] = typed;
    commit(chars.join('').trimEnd(), i + 1);
  };
  const onKeyDown = (i) => (e) => {
    if (e.key !== 'Backspace' || code[i] || i <= 0) return;
    e.preventDefault();
    commit(code.slice(0, i - 1), i - 1);
  };

  const cls = cx('lds-field', error && 'lds-field--error', success && 'lds-field--success', className);
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (groupAfter && i === groupAfter) cells.push(<span key="gap" className="lds-field__code-gap"></span>);
    cells.push(
      <input
        key={i} ref={(el) => { boxes.current[i] = el; }}
        type="text" inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
        maxLength={length} aria-label={`Digit ${i + 1}`}
        readOnly={!!(success || verifying)}
        value={code[i] || ''} {...rest}
        onChange={onInput(i)} onKeyDown={onKeyDown(i)}
      />,
    );
  }
  const note = error
    ? <span className="lds-field__error" role="alert"><SpriteIcon name="close-circle-fill" href={iconHref} />{error}</span>
    : success
      ? <span className="lds-field__success" role="status"><SpriteIcon name="check-circle" href={iconHref} />{success === true ? 'Verified' : success}</span>
      : verifying
        ? <span className="lds-field__help" role="status">{verifying === true ? 'Checking…' : verifying}</span>
        : help ? <span className="lds-field__help">{help}</span> : null;
  return (
    <div className={cls} data-status={error ? 'error' : undefined}>
      {label ? <label>{label}</label> : null}
      <div className={`lds-field__code${size === 'sm' ? ' lds-field__code--sm' : ''}`}>{cells}</div>
      {note}
    </div>
  );
}

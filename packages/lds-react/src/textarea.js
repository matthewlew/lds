'use client';
// Textarea: a labelled multi-line input with help, error and an optional
// character count, which follows what is typed. Controlled with `value` and
// `onChange`; otherwise `value` (or `defaultValue`) is the starting text.
import { useId, useState } from 'react';
import { cx } from './shared.js';
import { FieldNote, fieldNote } from './fields.js';

export function Textarea({
  label, id: given, help, error, required, maxLength, showCount, value, defaultValue, onChange,
  className = '', 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest
}) {
  const generated = useId();
  const id = given ?? generated;
  const controlled = value !== undefined && onChange !== undefined;
  const [own, setOwn] = useState(String((value !== undefined ? value : defaultValue) ?? ''));
  const text = controlled ? String(value) : own;
  const { noteId, aria } = fieldNote(id, { help, error, describedBy, invalid });
  const count = text.length;
  const over = maxLength !== undefined && count >= maxLength;
  const counted = showCount || maxLength !== undefined;
  const state = controlled ? { value } : { defaultValue: own };
  return (
    <div className={cx('lds-field', error && 'lds-field--error', className)} data-status={error ? 'error' : undefined}>
      {label ? <label htmlFor={id} className={required ? 'lds-field__req' : ''}>{label}</label> : null}
      <textarea
        id={id} maxLength={maxLength} required={required} {...rest} {...aria} {...state}
        onChange={(e) => { if (!controlled) setOwn(e.target.value); onChange?.(e); }}
      />
      {counted || help || error ? (
        <div className="lds-field__footer">
          <FieldNote id={noteId} help={help} error={error} empty />
          {counted ? (
            <span className={`lds-field__count${over ? ' lds-field__count--over' : ''}`}>
              {maxLength !== undefined ? `${count} / ${maxLength}` : String(count)}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

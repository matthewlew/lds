import { attrs, cx } from './attrs.js';
import { slot } from './escape.js';

export function textarea({
  label, id, help, error, required, maxLength, showCount, value, defaultValue,
  className = '', 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest
} = {}) {
  const cls = cx('lds-field', error && 'lds-field--error', className);
  // A textarea has no `value` attribute either, so `defaultValue` is not a
  // separate concept here — both name the same text content.
  const text = (value !== undefined ? value : defaultValue) ?? '';
  const count = String(text).length;
  const over = maxLength !== undefined && count >= maxLength;
  const counted = showCount || maxLength !== undefined;
  const showFooter = counted || !!help || !!error;
  // Tied to the control as TextField's is: from the control's id, added to the
  // caller's own aria-describedby.
  const noteId = id !== undefined && (error || help) ? `${id}-note` : undefined;
  const footer = showFooter
    ? `<div class="lds-field__footer">`
      + (error ? `<span${attrs({ id: noteId, className: 'lds-field__error', role: 'alert' })}>${slot(error)}</span>`
        : help ? `<span${attrs({ id: noteId, className: 'lds-field__help' })}>${slot(help)}</span>`
          : `<span class="lds-field__help"></span>`)
      + (counted
        ? `<span class="lds-field__count${over ? ' lds-field__count--over' : ''}">`
          + `${maxLength !== undefined ? `${count} / ${maxLength}` : String(count)}</span>`
        : '')
      + `</div>`
    : '';
  // A textarea's value is its TEXT CONTENT, not an attribute. Getting this wrong
  // renders an empty box with the text hidden in an attribute nothing reads.
  return `<div${attrs({ className: cls, 'data-status': error ? 'error' : undefined })}>`
    + (label ? `<label${attrs({ htmlFor: id, className: required ? 'lds-field__req' : '' })}>${slot(label)}</label>` : '')
    + `<textarea${attrs({
      id, maxLength, required, ...rest,
      'aria-describedby': cx(describedBy, noteId) || undefined,
      'aria-invalid': error ? 'true' : invalid,
    })}>${slot(text)}</textarea>`
    + `${footer}</div>`;
}

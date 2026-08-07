import { attrs, cx } from './attrs.js';
import { slot } from './escape.js';

const option = (o) => {
  const opt = typeof o === 'string' ? { value: o, label: o } : o;
  return `<option${attrs({ value: opt.value })}>${slot(opt.label)}</option>`;
};

export function select({ label, id, help, error, required, options = [], className = '', ...rest } = {}) {
  const cls = cx('lds-field', error && 'lds-field--error', className);
  const body = options.map((o) => (o && o.options)
    ? `<optgroup${attrs({ label: o.label })}>${o.options.map(option).join('')}</optgroup>`
    : option(o)).join('');
  return `<div${attrs({ className: cls, 'data-status': error ? 'error' : undefined })}>`
    + (label ? `<label${attrs({ htmlFor: id, className: required ? 'lds-field__req' : '' })}>${slot(label)}</label>` : '')
    + `<select${attrs({ id, ...rest }, 'select')}>${body}</select>`
    + (error ? `<span class="lds-field__error">${slot(error)}</span>`
      : help ? `<span class="lds-field__help">${slot(help)}</span>` : '')
    + `</div>`;
}

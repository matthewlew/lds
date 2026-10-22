import { attrs, cx } from './attrs.js';
import { slot } from './escape.js';
import { spriteSvg } from './sprite.js';

export function textField({
  label, id, help, error, required,
  iconStart, iconEnd, endAction, prefix, iconHref,
  className = '', 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest
} = {}) {
  const cls = cx('lds-field',
    error && 'lds-field--error',
    iconStart && 'lds-field--has-start',
    (iconEnd || endAction) && 'lds-field--has-end',
    className);
  const sprite = (icon) => typeof icon === 'string' ? spriteSvg(icon, iconHref) : slot(icon);
  // The help or error line describes the control, so a screen reader reads it
  // with the label rather than leaving it to be found. It needs an id to point
  // at, derived from the control's own `id` (no id, no tie — a template cannot
  // invent one without making its output differ between renders), and it is
  // ADDED to whatever the caller already described the control with.
  const noteId = id !== undefined && (error || help) ? `${id}-note` : undefined;
  const input = `<input${attrs({
    id, type: 'text', required, ...rest,
    'aria-describedby': cx(describedBy, noteId) || undefined,
    'aria-invalid': error ? 'true' : invalid,
  }, 'input')}/>`;
  // prefix is a whole control (a dial-code select) joined into one box; icons are
  // inset over the input's own padding so the field stays a single target.
  const control = prefix
    ? `<div class="lds-field__group"><div class="lds-field__dial">${slot(prefix)}</div>`
      + `<div class="lds-field__number">${input}</div></div>`
    : `<div class="lds-field__wrap">`
      + (iconStart ? `<span class="lds-field__adorn lds-field__adorn--start">${sprite(iconStart)}</span>` : '')
      + input
      + (endAction
        ? `<button${attrs({
          type: 'button',
          className: 'lds-field__adorn lds-field__adorn--end lds-field__adorn--action',
          'aria-label': endAction.label,
        })}>${sprite(endAction.icon)}</button>`
        : iconEnd ? `<span class="lds-field__adorn lds-field__adorn--end">${sprite(iconEnd)}</span>` : '')
      + `</div>`;
  return `<div${attrs({ className: cls, 'data-status': error ? 'error' : undefined })}>`
    + (label ? `<label${attrs({ htmlFor: id, className: required ? 'lds-field__req' : '' })}>${slot(label)}</label>` : '')
    + control
    + (error ? `<span${attrs({ id: noteId, className: 'lds-field__error', role: 'alert' })}>${slot(error)}</span>`
      : help ? `<span${attrs({ id: noteId, className: 'lds-field__help' })}>${slot(help)}</span>` : '')
    + `</div>`;
}

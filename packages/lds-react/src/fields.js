// TextField, Select, Checkbox, Radio and Toggle. Textarea and CodeField hold
// state, so they live in their own client modules.
//
// A field with a label or a help line needs an id to tie them to the control.
// The templates take one or leave the tie out; here `useId` supplies one, which
// React's server renderer allows and which hydrates to the same value.
import { useId } from 'react';
import { cx, iconSlot, initialState } from './shared.js';

/** The help or error line's id, and the control's `aria-describedby`/`aria-invalid`. */
export function fieldNote(id, { help, error, describedBy, invalid }) {
  const noteId = error || help ? `${id}-note` : undefined;
  return {
    noteId,
    aria: {
      'aria-describedby': cx(describedBy, noteId) || undefined,
      'aria-invalid': error ? 'true' : invalid,
    },
  };
}

/** The line under a field: the error, announced, or else the help. */
export function FieldNote({ id, help, error, empty }) {
  if (error) return <span id={id} className="lds-field__error" role="alert">{error}</span>;
  if (help) return <span id={id} className="lds-field__help">{help}</span>;
  return empty ? <span className="lds-field__help"></span> : null;
}

export function TextField({
  label, id: given, help, error, required,
  iconStart, iconEnd, endAction, prefix, iconHref, type = 'text',
  className = '', 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest
}) {
  const generated = useId();
  const id = given ?? generated;
  const { noteId, aria } = fieldNote(id, { help, error, describedBy, invalid });
  const cls = cx('lds-field',
    error && 'lds-field--error',
    iconStart && 'lds-field--has-start',
    (iconEnd || endAction) && 'lds-field--has-end',
    className);
  const input = <input id={id} type={type} required={required} {...initialState(rest)} {...aria} />;
  return (
    <div className={cls} data-status={error ? 'error' : undefined}>
      {label ? <label htmlFor={id} className={required ? 'lds-field__req' : ''}>{label}</label> : null}
      {prefix ? (
        // prefix is a whole control (a dial-code select) joined into one box
        <div className="lds-field__group">
          <div className="lds-field__dial">{prefix}</div>
          <div className="lds-field__number">{input}</div>
        </div>
      ) : (
        <div className="lds-field__wrap">
          {iconStart ? <span className="lds-field__adorn lds-field__adorn--start">{iconSlot(iconStart, iconHref)}</span> : null}
          {input}
          {endAction ? (
            <button
              type="button" className="lds-field__adorn lds-field__adorn--end lds-field__adorn--action"
              aria-label={endAction.label} onClick={endAction.onClick}
            >
              {iconSlot(endAction.icon, iconHref)}
            </button>
          ) : iconEnd ? <span className="lds-field__adorn lds-field__adorn--end">{iconSlot(iconEnd, iconHref)}</span> : null}
        </div>
      )}
      <FieldNote id={noteId} help={help} error={error} />
    </div>
  );
}

export function Select({
  label, id: given, help, error, required, options = [], className = '',
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest
}) {
  const generated = useId();
  const id = given ?? generated;
  const { noteId, aria } = fieldNote(id, { help, error, describedBy, invalid });
  // React marks the matching <option> selected from the <select>'s own value.
  const option = (o, i) => {
    const opt = typeof o === 'string' ? { value: o, label: o } : o;
    return <option key={opt.value ?? i} value={opt.value}>{opt.label}</option>;
  };
  return (
    <div className={cx('lds-field', error && 'lds-field--error', className)} data-status={error ? 'error' : undefined}>
      {label ? <label htmlFor={id} className={required ? 'lds-field__req' : ''}>{label}</label> : null}
      <select id={id} required={required} {...initialState(rest)} {...aria}>
        {options.map((o, i) => (o && o.options)
          ? <optgroup key={`g${i}`} label={o.label}>{o.options.map(option)}</optgroup>
          : option(o, i))}
      </select>
      <FieldNote id={noteId} help={help} error={error} />
    </div>
  );
}

export function Checkbox({ label, id, className = '', ...rest }) {
  return (
    <label className={cx('lds-check', className)}>
      <input type="checkbox" id={id} {...initialState(rest)} />
      <span className="lds-check__box"></span>
      {label}
    </label>
  );
}

export function Radio({ label, id, name, className = '', ...rest }) {
  return (
    <label className={cx('lds-check', 'lds-check--radio', className)}>
      <input type="radio" id={id} name={name} {...initialState(rest)} />
      <span className="lds-check__box"></span>
      {label}
    </label>
  );
}

export function Toggle({ label, help, id, className = '', ...rest }) {
  return (
    <div className={cx('lds-toggle', className)}>
      {(label || help) ? (
        <div className="lds-toggle__text">
          {label ? <span className="lds-toggle__label">{label}</span> : null}
          {help ? <span className="lds-toggle__help">{help}</span> : null}
        </div>
      ) : null}
      <label className="lds-toggle__switch">
        <input type="checkbox" id={id} {...initialState(rest)} />
        <span className="lds-toggle__track"></span>
      </label>
    </div>
  );
}

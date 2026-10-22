'use client';
// SegmentedControl: 2–4 views of the same content, as a radiogroup of native
// radios, so arrow keys move the selection with no script of ours. Controlled
// with `value` and `onChange`, or holding its own choice from `defaultValue`
// (or `value` with no `onChange`, the template's spelling of the same thing).
import { useId, useState } from 'react';
import { cx, SpriteIcon } from './shared.js';

export function SegmentedControl({
  options = [], value, defaultValue, onChange, name: given, size, full, iconsOnly, label,
  iconHref, className = '', ...rest
}) {
  const generated = useId();
  const name = given ?? generated;
  const [own, setOwn] = useState(value ?? defaultValue);
  const current = onChange && value !== undefined ? value : own;
  const cls = cx('lds-seg', size && `lds-seg--${size}`, full && 'lds-seg--full',
    iconsOnly && 'lds-seg--icons', className);
  return (
    <div className={cls} role="radiogroup" aria-label={label} {...rest}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return (
          <label key={opt.value} className="lds-seg__option" title={iconsOnly ? opt.label : undefined}>
            <input
              type="radio" name={name} value={opt.value}
              checked={current === opt.value} disabled={opt.disabled}
              aria-label={iconsOnly ? opt.label : undefined}
              onChange={() => { setOwn(opt.value); onChange?.(opt.value); }}
            />
            {opt.icon ? <SpriteIcon name={opt.icon} href={iconHref} /> : null}
            {iconsOnly ? null : <span>{opt.label}</span>}
          </label>
        );
      })}
    </div>
  );
}

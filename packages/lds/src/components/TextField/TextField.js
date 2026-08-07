import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function TextField({
  label, id, help, error, required,
  iconStart, iconEnd, endAction, prefix, iconHref,
  className = '', ...rest
}) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-field',
    error ? 'lds-field--error' : '',
    iconStart ? 'lds-field--has-start' : '',
    (iconEnd || endAction) ? 'lds-field--has-end' : '',
    className].filter(Boolean).join(' ');
  const sprite = (icon) => typeof icon === 'string'
    ? React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
      React.createElement('use', { href: `${spriteHref}#${icon}` }))
    : icon;
  const input = React.createElement('input', { id, type: 'text', ...rest });
  // prefix is a whole control (a dial-code select) joined into one box; icons are
  // inset over the input's own padding so the field stays a single target.
  const control = prefix
    ? React.createElement('div', { className: 'lds-field__group' },
      React.createElement('div', { className: 'lds-field__dial' }, prefix),
      React.createElement('div', { className: 'lds-field__number' }, input))
    : React.createElement('div', { className: 'lds-field__wrap' },
      iconStart && React.createElement('span', { className: 'lds-field__adorn lds-field__adorn--start' }, sprite(iconStart)),
      input,
      endAction
        ? React.createElement('button', {
          type: 'button', className: 'lds-field__adorn lds-field__adorn--end lds-field__adorn--action',
          'aria-label': endAction.label, onClick: endAction.onClick
        }, sprite(endAction.icon))
        : iconEnd && React.createElement('span', { className: 'lds-field__adorn lds-field__adorn--end' }, sprite(iconEnd)));
  return React.createElement('div', { className: cls, 'data-status': error ? 'error' : undefined },
    label && React.createElement('label', { htmlFor: id, className: required ? 'lds-field__req' : '' }, label),
    control,
    error ? React.createElement('span', { className: 'lds-field__error' }, error)
      : help ? React.createElement('span', { className: 'lds-field__help' }, help) : null
  );
}
import React from 'react';
import { resolveSprite } from '../../icon-sprite.js';

export function Modal({
  title, children, actions, cancel, onClose, onBack,
  size, sheet, side, largeTitle = true, iconHref, className = ''
}) {
  const spriteHref = resolveSprite(iconHref);
  const cls = ['lds-modal', size ? `lds-modal--${size}` : '', sheet ? 'lds-modal--sheet' : '', side ? 'lds-modal--side' : '', className].filter(Boolean).join(' ');
  const sprite = (name) => React.createElement('svg', { className: 'lds-icon', 'aria-hidden': 'true' },
    React.createElement('use', { href: `${spriteHref}#${name}` }));
  // The footer is a button group, not a bespoke flex row. With a cancel present
  // it splits: cancel to the opposite end, confirm last in source and so at the
  // end of the reading direction — and on a phone the group stacks, confirm on
  // top. Cancel is never a peer sitting next to confirm.
  const groupCls = ['lds-btn-group', 'lds-btn-group--stack', cancel ? 'lds-btn-group--split' : 'lds-btn-group--end'].join(' ');
  const footer = (cancel || actions) && React.createElement('div', { className: 'lds-modal__actions' },
    React.createElement('div', { className: groupCls, role: 'group' }, cancel, actions));
  return React.createElement('div', { className: 'lds-modal-scrim' },
    React.createElement('div', { className: cls },
      (sheet || side) && React.createElement('div', { className: 'lds-modal__handle' }),
      React.createElement('div', { className: 'lds-modal__header' },
        // back pops ONE level of a stacked flow; close dismisses the whole stack.
        onBack && React.createElement('button', { type: 'button', className: 'lds-modal__back', 'aria-label': 'Back', onClick: onBack }, sprite('chevron-left')),
        title && React.createElement('div', { className: 'lds-modal__title' }, title),
        React.createElement('button', { type: 'button', className: 'lds-modal__close', 'aria-label': 'Close', onClick: onClose }, sprite('close'))),
      React.createElement('div', { className: 'lds-modal__body' },
        // The large title sits at the TOP OF THE SCROLL REGION, directly above the
        // body copy, so title and content read as one block. It leaves on its own
        // as the body scrolls; the bar title fades in behind it and the header's
        // divider appears only once content has passed under the bar.
        largeTitle && title && React.createElement('h2', { className: 'lds-modal__title lds-modal__title--large' }, title),
        children),
      footer));
}
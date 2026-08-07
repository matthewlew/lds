export function Card({
  kicker, title, body, meta, actions, emphasis, hue,
  selectable, selected, disabled, onClick,
  className = '', children, ...rest
}) {
  const cls = ['lds-card',
    selectable ? 'lds-card--selectable' : '',
    emphasis ? `emph-${emphasis}` : '',
    hue ? `hue-${hue}` : '',
    className].filter(Boolean).join(' ');
  const content = [
    kicker && React.createElement('div', { className: 'lds-card__kicker', key: 'k' }, kicker),
    title && React.createElement('div', { className: 'lds-card__title', key: 't' }, title),
    body && React.createElement('p', { className: 'lds-card__body', key: 'b' }, body),
    children,
    meta && React.createElement('div', { className: 'lds-card__divider lds-card__divider--meta', key: 'd' }),
    meta && React.createElement('div', { className: 'lds-card__meta', key: 'm' }, meta),
    actions && React.createElement('div', { className: 'lds-card__actions', key: 'a' }, actions)
  ];
  // A selectable card is a real button, not a div with a click handler: that is
  // what gives it Space/Enter, a focus ring and a reported pressed state for
  // free. aria-pressed rather than aria-checked — the card is a toggle, and a
  // group of them is not necessarily exclusive.
  if (selectable) {
    return React.createElement('button', {
      type: 'button', className: cls,
      'aria-pressed': selected ? 'true' : 'false',
      'aria-disabled': disabled ? 'true' : undefined,
      disabled, onClick, ...rest
    }, content);
  }
  return React.createElement('div', { className: cls, ...rest }, content);
}
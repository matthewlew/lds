import React from 'react';

// Tooltip — a LABEL for a control, not a container for prose.
//
// If the text is a sentence the user needs, it belongs in help text where it is
// always visible. A tooltip is what an icon-only button says when you ask it its
// name, which is why it is capped at a short measure and why it must not hold
// anything interactive: a hover bubble cannot be reached by a pointer without a
// hover bridge, so a link inside one is unreachable for some users. That case
// wants a Menu or a Modal.
//
// It opens on hover AND on focus. Hover alone means a keyboard user never gets
// the label — and for an icon-only button, the tooltip IS the label.
export function Tooltip({
  label, placement = 'top', children, id, className = '', ...rest
}) {
  const auto = React.useId();
  const tipId = id || auto;
  const [open, setOpen] = React.useState(false);

  // Escape closes a tooltip that is covering something the user is trying to
  // read, without moving focus off the trigger.
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) setOpen(false); };

  return React.createElement('span', {
    className: ['lds-tooltip', className].filter(Boolean).join(' '),
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onKeyDown,
    ...rest,
  },
    // aria-describedby, not aria-label: the trigger keeps whatever accessible
    // name it already has, and the tooltip adds to it rather than replacing it.
    React.isValidElement(children)
      ? React.cloneElement(children, { 'aria-describedby': tipId })
      : children,
    React.createElement('span', {
      id: tipId,
      className: 'lds-tooltip__bubble',
      role: 'tooltip',
      'data-placement': placement,
      'data-open': open ? 'true' : 'false',
    }, label));
}

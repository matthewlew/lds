'use client';
// Tooltip: what an icon-only control says when asked its name, on hover AND
// focus, closed by Escape. The markup is the template's; the behaviour is
// @lew-ds/lds's own `attachTooltip`, bound once the markup is in the document,
// so the two bindings cannot behave differently: the open bubble is placed
// `fixed` from the trigger (an ancestor's overflow cannot clip it), closes when
// a scroll or resize moves the trigger, and describes the trigger only when it
// says something the trigger's `aria-label` does not.
//
// Never put anything interactive inside: a hover bubble cannot be reached by a
// pointer. That case is a Menu or a Modal.
import { useEffect, useId, useRef } from 'react';
import { attachTooltip } from '@lew-ds/lds/controllers';
import { cx, PLACEMENT } from './shared.js';

export function Tooltip({ label, placement = 'top', children, id: given, className = '', ref, ...rest }) {
  const generated = useId();
  const id = given ?? generated;
  const wrapper = useRef(null);
  const text = typeof label === 'string' ? label : undefined;
  useEffect(() => {
    const bound = attachTooltip(wrapper.current);
    return () => bound.dispose();
  }, [text, placement, id]);
  const setRef = (node) => {
    wrapper.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  return (
    <span ref={setRef} className={cx('lds-tooltip', className)} {...rest}>
      {children}
      <span
        id={id} className="lds-tooltip__bubble" role="tooltip"
        data-placement={PLACEMENT[placement] ?? placement} data-open="false"
      >
        {label}
      </span>
    </span>
  );
}

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
import { tooltipPlacement } from '@lew-ds/lds';
import { attachTooltip } from '@lew-ds/lds/controllers';
import { cx } from './shared.js';

export function Tooltip({ label, placement = 'top', children, id: given, className = '', ref, ...rest }) {
  const generated = useId();
  const id = given ?? generated;
  const wrapper = useRef(null);
  const binding = useRef(null);
  // attachTooltip binds one trigger element with one label. Checked after every
  // render rather than on a dependency list, because what it depends on is the
  // DOM: `children` that swap to a different element (another type or key)
  // leave the old binding measuring a detached node, and a label that is not a
  // string still changes the text it compares with the trigger's name.
  useEffect(() => {
    const el = wrapper.current;
    const bubble = el.querySelector('.lds-tooltip__bubble');
    const trigger = Array.from(el.children).find((c) => c !== bubble);
    const now = { trigger, text: bubble.textContent, placement: bubble.dataset.placement };
    const was = binding.current;
    if (was && was.trigger === now.trigger && was.text === now.text && was.placement === now.placement) return;
    was?.bound.dispose();
    binding.current = { ...now, bound: attachTooltip(el) };
  });
  useEffect(() => () => {
    binding.current?.bound.dispose();
    binding.current = null;
  }, []);
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
        data-placement={tooltipPlacement(placement)} data-open="false"
      >
        {label}
      </span>
    </span>
  );
}

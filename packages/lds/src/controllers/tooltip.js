import { tooltip as tooltipTemplate } from '../templates/tooltip.js';

let seq = 0;

// Opens on hover AND on focus. Hover alone means a keyboard user never gets the
// label — and for an icon-only button, the tooltip IS the label.
//
//   mountTooltip(el, { label: 'Search', children: '<button …>…</button>' })
//
// `children` is the trigger, as markup. Pass it already-composed — usually the
// output of another template.
export function mountTooltip(container, config = {}) {
  let cfg = { ...config };
  const id = cfg.id || `lds-tooltip-${seq++}`;

  const render = () => {
    container.innerHTML = tooltipTemplate({ ...cfg, id });
    const wrapper = container.firstElementChild;
    const bubble = wrapper.querySelector('.lds-tooltip__bubble');
    // aria-describedby, not aria-label: the trigger keeps whatever accessible
    // name it already has, and the tooltip adds to it rather than replacing it.
    const trigger = Array.from(wrapper.children).find((el) => el !== bubble);
    if (trigger) trigger.setAttribute('aria-describedby', id);
    return wrapper;
  };

  let wrapper = render();
  let open = false;

  const set = (next) => {
    open = next;
    const bubble = wrapper.querySelector('.lds-tooltip__bubble');
    if (bubble) bubble.setAttribute('data-open', open ? 'true' : 'false');
  };

  const show = () => set(true);
  const hide = () => set(false);
  // Escape closes a tooltip that is covering something the user is trying to
  // read, without moving focus off the trigger.
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) hide(); };

  // mouseenter/mouseleave do not bubble, so these bind to the wrapper itself and
  // are rebound whenever it is replaced.
  const bind = (el) => {
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focusin', show);
    el.addEventListener('focusout', hide);
    el.addEventListener('keydown', onKeyDown);
  };
  const unbind = (el) => {
    el.removeEventListener('mouseenter', show);
    el.removeEventListener('mouseleave', hide);
    el.removeEventListener('focusin', show);
    el.removeEventListener('focusout', hide);
    el.removeEventListener('keydown', onKeyDown);
  };

  bind(wrapper);

  return {
    get open() { return open; },
    update(next = {}) {
      unbind(wrapper);
      cfg = { ...cfg, ...next };
      wrapper = render();
      bind(wrapper);
      set(open);
    },
    dispose() {
      unbind(wrapper);
      container.innerHTML = '';
    },
  };
}

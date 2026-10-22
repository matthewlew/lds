import { tooltip as tooltipTemplate } from '../templates/tooltip.js';

let seq = 0;

// The gap the stylesheet leaves between trigger and bubble (`calc(100% + 6px)`).
const GAP = 6;

// Opens on hover AND on focus. Hover alone means a keyboard user never gets the
// label — and for an icon-only button, the tooltip IS the label.
//
// Two ways in, because a tooltip is rarely alone on the page:
//
//   mountTooltip(el, { label: 'Search', children: button({ … }) })
//     renders the markup into `el` and binds it.
//
//   attachTooltip(wrapper)
//     binds markup that is already in the document — a tooltip composed into a
//     bigger tree, or one that arrived from the server. Without this, composing
//     a tooltip into a larger render would mean the bubble is present and inert.
export function attachTooltip(wrapper) {
  const bubble = wrapper.querySelector('.lds-tooltip__bubble');
  if (!bubble) return { open: false, dispose() {} };

  // aria-describedby, not aria-label: the trigger keeps whatever accessible name
  // it already has, and the tooltip adds to it rather than replacing it — when
  // it has something to add. An icon-only button is usually named by the same
  // words its tooltip shows, and describing it with them again has a screen
  // reader say "Search, button, Search".
  if (!bubble.id) bubble.id = `lds-tooltip-${seq++}`;
  const trigger = Array.from(wrapper.children).find((el) => el !== bubble);
  const describedIds = () => (trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  const describes = trigger && bubble.textContent.trim() !== (trigger.getAttribute('aria-label') ?? '').trim();
  // Only an id this binding added is removed again on dispose, so a rebind
  // (a new label) starts from what the trigger said on its own.
  let added = false;
  if (trigger) {
    const ids = describedIds();
    if (describes && !ids.includes(bubble.id)) {
      trigger.setAttribute('aria-describedby', [...ids, bubble.id].join(' '));
      added = true;
    } else if (!describes && ids.includes(bubble.id)) {
      const rest = ids.filter((id) => id !== bubble.id);
      if (rest.length) trigger.setAttribute('aria-describedby', rest.join(' '));
      else trigger.removeAttribute('aria-describedby');
    }
  }
  const undescribe = () => {
    if (!added) return;
    const rest = describedIds().filter((id) => id !== bubble.id);
    if (rest.length) trigger.setAttribute('aria-describedby', rest.join(' '));
    else trigger.removeAttribute('aria-describedby');
  };

  // The open bubble is placed `fixed` from the trigger's box, at the spot the
  // stylesheet's `data-placement` rule would put it. Positioned `absolute` it
  // belongs to the nearest scroll container, and a panel's `overflow: hidden`
  // or a table's `overflow-x: auto` cuts it off near the edge. Fixed, it is
  // drawn against the viewport — so it closes on scroll or resize rather than
  // staying where the trigger used to be. Only when the trigger has actually
  // moved: a scroll event is delivered a frame late, and the one from scrolling
  // a trigger into view would otherwise close the bubble the pointer just
  // opened on arriving.
  let placedAt = null;
  const place = () => {
    const box = (trigger ?? wrapper).getBoundingClientRect();
    placedAt = box;
    const across = box.left + box.width / 2;
    const down = box.top + box.height / 2;
    const at = {
      top: [box.top - GAP, across, 'translate(-50%, -100%)'],
      bottom: [box.bottom + GAP, across, 'translateX(-50%)'],
      start: [down, box.left - GAP, 'translate(-100%, -50%)'],
      end: [down, box.right + GAP, 'translateY(-50%)'],
    };
    const [top, left, transform] = at[bubble.getAttribute('data-placement')] ?? at.top;
    // `fixed` is relative to the viewport — unless an ancestor has a transform,
    // a filter or a backdrop-filter (a .lds-glass panel, a sheet being
    // dragged), which makes IT the box fixed descendants are placed in. Pinned
    // at 0,0 first, the bubble lands on that box's corner, which is the offset
    // to take back out.
    Object.assign(bubble.style, {
      position: 'fixed', top: '0px', left: '0px', right: 'auto', bottom: 'auto', transform: 'none',
    });
    const origin = bubble.getBoundingClientRect();
    Object.assign(bubble.style, {
      top: `${top - origin.top}px`, left: `${left - origin.left}px`, transform,
    });
  };
  const unplace = () => {
    for (const prop of ['position', 'top', 'left', 'right', 'bottom', 'transform']) bubble.style.removeProperty(prop);
  };

  const onMove = () => {
    const box = (trigger ?? wrapper).getBoundingClientRect();
    if (Math.abs(box.left - placedAt.left) > 0.5 || Math.abs(box.top - placedAt.top) > 0.5) hide();
  };

  let open = false;
  const set = (next) => {
    if (next === open) return;
    open = next;
    if (open) {
      place();
      window.addEventListener('scroll', onMove, { capture: true, passive: true });
      window.addEventListener('resize', onMove);
    } else {
      window.removeEventListener('scroll', onMove, { capture: true });
      window.removeEventListener('resize', onMove);
    }
    // A closed bubble keeps its last place: it is hidden, takes no layout, and
    // clearing it would jump it back to its absolute spot mid-fade.
    bubble.setAttribute('data-open', open ? 'true' : 'false');
  };
  function show() { set(true); }
  function hide() { set(false); }
  // Escape closes a tooltip that is covering something the user is trying to
  // read, without moving focus off the trigger.
  const onKeyDown = (e) => { if (e.key === 'Escape' && open) hide(); };

  // mouseenter/mouseleave do not bubble, so these bind to the wrapper itself.
  wrapper.addEventListener('mouseenter', show);
  wrapper.addEventListener('mouseleave', hide);
  wrapper.addEventListener('focusin', show);
  wrapper.addEventListener('focusout', hide);
  wrapper.addEventListener('keydown', onKeyDown);

  return {
    get open() { return open; },
    dispose() {
      hide();
      unplace();
      undescribe();
      wrapper.removeEventListener('mouseenter', show);
      wrapper.removeEventListener('mouseleave', hide);
      wrapper.removeEventListener('focusin', show);
      wrapper.removeEventListener('focusout', hide);
      wrapper.removeEventListener('keydown', onKeyDown);
    },
  };
}

export function mountTooltip(container, config = {}) {
  let cfg = { ...config };
  const id = cfg.id || `lds-tooltip-${seq++}`;
  let bound;

  const render = () => {
    container.innerHTML = tooltipTemplate({ ...cfg, id });
    bound = attachTooltip(container.firstElementChild);
  };
  render();

  return {
    get open() { return bound.open; },
    update(next = {}) {
      bound.dispose();
      cfg = { ...cfg, ...next };
      render();
    },
    dispose() {
      bound.dispose();
      container.innerHTML = '';
    },
  };
}

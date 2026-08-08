// Exercises the published type surface. This file is never shipped or run — it
// exists so `npm run typecheck` fails if a .d.ts drifts from what a component
// actually accepts.
import {
  avatar, banner, button, buttonGroup, card, chip, codeField, h, icon, link, mount,
  modal, nav, raw, row, segmentedControl, select, table, tabs, tag, textField, textarea,
  toast, toggle, tooltip, mountCodeField, mountSegmentedControl, mountTextarea,
  mountToasts, mountTooltip, dialOptions, setIconSprite, cx, escapeHtml, initialsForName,
} from '@lew-ds/lds';
import type { RawHtml, Slot, Status, Hue } from '@lew-ds/lds';
import { ICON_NAMES, hasIcon, useHref, spriteUrl } from '@lew-ds/open-icons';

setIconSprite('/icons.svg');

// ---- every component returns a string of markup ------------------------------
export function markup(): string {
  const dials = dialOptions(['United States']);
  const firstDial: string = dials.top[0].label;
  const restCount: number = dials.rest.length;

  const iconOk: boolean = hasIcon('search');
  const href: string = useHref('chevron-right', spriteUrl);
  const names: readonly string[] = ICON_NAMES;

  const status: Status = 'error';
  const hue: Hue = 'red';
  const initials: string = initialsForName('Ada Lovelace');

  // A slot takes text, which is escaped, or raw() markup, which is not.
  const safe: RawHtml = raw(button({ variant: 'primary', size: 'lg', children: 'Review' }));
  const text: Slot = `${restCount} more · ${iconOk} · ${href} · ${names.length} · ${initials}`;

  return [
    avatar({ name: 'Ada Lovelace', size: 'lg', ring: true, hue: 'violet' }),
    banner({ status, title: 'Failed', dismissible: true, actions: safe, children: text }),
    button({ variant: 'primary', hue, subtitle: firstDial, children: 'Save' }),
    button({ href: '/somewhere', disabled: true, children: 'Link button' }),
    buttonGroup({ align: 'split', width: 'fill', children: safe }),
    card({ selectable: true, selected: true, kicker: 'K', title: 'T', body: 'B' }),
    chip({ selected: false, size: 'sm', children: 'Filter' }),
    codeField({ length: 6, groupAfter: 3, value: '123', success: true }),
    icon({ name: 'search', size: 32 }),
    link({ href: '#', variant: 'standalone', iconEnd: 'arrow-right', children: 'Go' }),
    modal({ title: 'T', sheet: true, largeTitle: false, cancel: safe, children: text }),
    nav({ variant: 'bar', title: 'Settings', onBack: () => {}, actions: safe }),
    row({ title: 'T', subtitle: 'S', chevron: true, href: '/x' }),
    segmentedControl({ name: 'g', options: ['Day', { value: 'w', label: 'Week' }], value: 'Day' }),
    select({ label: 'L', required: true, options: ['a', { label: 'G', options: ['x'] }] }),
    table({ columns: [{ key: 'a', label: 'A' }], rows: [{ a: '1' }] }),
    tabs({ tabs: [{ section: 'Group' }, { id: 'a', label: 'A', icon: 'star' }], active: 'a' }),
    tag({ hue: 'green', dot: true, children: 'Live' }),
    textField({ label: 'Email', iconStart: 'mail', endAction: { icon: 'close', label: 'Clear' } }),
    textarea({ label: 'Bio', maxLength: 200, showCount: true, value: String(text) }),
    toast({ status: 'success', title: 'Saved', dismissible: false }),
    toggle({ label: 'On', help: 'h', checked: true, readOnly: true }),
    tooltip({ label: 'Search', placement: 'right', children: safe }),
    cx('a', false, 'b'),
    escapeHtml('<b>'),
  ].join('');
}

// ---- h() composes elements and templates ------------------------------------
export function composed(): RawHtml {
  return h('div', { className: 'stack' },
    h(banner, { status: 'info' }, 'Nested.'),
    h(button, { variant: 'tertiary', iconOnly: true, iconStart: 'search' }));
}

// ---- controllers -------------------------------------------------------------
export function wire(el: HTMLElement): () => void {
  mount(el, composed());

  const code = mountCodeField(el, { length: 6, onChange: (value: string) => value.length });
  const seg = mountSegmentedControl(el, { options: ['a'], defaultValue: 'a', onChange: (v: string) => v });
  const area = mountTextarea(el, { maxLength: 10, onChange: (e: Event) => e.type });
  const tip = mountTooltip(el, { label: 'Search', children: button({ iconOnly: true, iconStart: 'search' }) });
  const toasts = mountToasts(el, { placement: 'bottom-right', max: 3, duration: 4000 });

  const entered: string = code.value;
  const picked: string | undefined = seg.value;
  const typed: string = area.value;
  const isOpen: boolean = tip.open;
  const id: string = toasts.toast({ status: 'error', title: 'Failed', duration: 0 });
  toasts.toast('A bare string is the body.');
  toasts.dismiss(id);

  code.update({ verifying: true });
  seg.update({ value: picked });
  area.update({ value: typed });
  tip.update({ label: entered, placement: isOpen ? 'top' : 'bottom' });

  return () => {
    code.dispose(); seg.dispose(); area.dispose(); tip.dispose(); toasts.dispose();
  };
}

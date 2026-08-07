// The 23 stateless components, wrapped from their vanilla templates.
//
// Config here is the entire adaptation: which props are `Slot`s (so a React
// node passed there gets flattened to markup before the template sees it),
// and which documented handler props (Modal's `onClose`, Banner's
// `onDismiss`, …) need a real DOM listener — the vanilla template accepts
// and ignores them (see e.g. templates/modal.js: "accepted and ignored: the
// controller binds the handler by delegation after mounting"); this is that
// delegation, written once in runtime.jsx and applied per component here.
import {
  avatar, banner, button, buttonGroup, card, checkbox, chip, emptyState,
  icon, inline, link, menu, modal, nav, radio, row, select, skeleton,
  table, tabs, tag, textField, toggle,
} from '@lew/lds';
import { makeTemplateComponent } from './runtime.jsx';

export const Avatar = makeTemplateComponent('Avatar', avatar);

export const Banner = makeTemplateComponent('Banner', banner, {
  slotKeys: ['title', 'children', 'actions', 'icon'],
  handlers: [{ name: 'onDismiss', event: 'click', selector: '.lds-banner__dismiss' }],
});

export const Button = makeTemplateComponent('Button', button, {
  slotKeys: ['iconStart', 'iconEnd', 'subtitle', 'children'],
  handlers: [{ name: 'onClick', event: 'click', selector: null }],
});

export const ButtonGroup = makeTemplateComponent('ButtonGroup', buttonGroup, {
  slotKeys: ['children', 'detail', 'detailNote'],
});

export const Card = makeTemplateComponent('Card', card, {
  slotKeys: ['kicker', 'title', 'body', 'meta', 'actions', 'children'],
  handlers: [{ name: 'onClick', event: 'click', selector: null }],
});

export const Checkbox = makeTemplateComponent('Checkbox', checkbox, {
  slotKeys: ['label'],
  withChange: true,
});

export const Chip = makeTemplateComponent('Chip', chip, {
  slotKeys: ['children', 'icon', 'caret'],
  handlers: [
    { name: 'onRemove', event: 'click', selector: '.lds-chip__remove' },
    { name: 'onClick', event: 'click', selector: null },
  ],
});

export const EmptyState = makeTemplateComponent('EmptyState', emptyState, {
  slotKeys: ['icon', 'image', 'title', 'body', 'actions'],
});

export const Icon = makeTemplateComponent('Icon', icon);

export const Inline = makeTemplateComponent('Inline', inline, {
  slotKeys: ['icon', 'children'],
});

export const Link = makeTemplateComponent('Link', link, {
  slotKeys: ['children', 'iconEnd'],
  handlers: [{ name: 'onClick', event: 'click', selector: null }],
});

// `items[].label/icon/hint` are passed through unconverted — see toSlot's doc
// comment in runtime.jsx. Pre-render a nested field with `toSlot()` yourself
// if one needs JSX rather than text.
export const Menu = makeTemplateComponent('Menu', menu);

export const Modal = makeTemplateComponent('Modal', modal, {
  slotKeys: ['title', 'children', 'actions', 'cancel'],
  handlers: [
    { name: 'onClose', event: 'click', selector: '.lds-modal__close' },
    { name: 'onBack', event: 'click', selector: '.lds-modal__back' },
  ],
});

export const Nav = makeTemplateComponent('Nav', nav, {
  slotKeys: ['logo', 'links', 'title', 'subtitle', 'actions', 'children'],
  handlers: [{ name: 'onBack', event: 'click', selector: '.lds-nav__back' }],
});

export const Radio = makeTemplateComponent('Radio', radio, {
  slotKeys: ['label'],
  withChange: true,
});

export const Row = makeTemplateComponent('Row', row, {
  slotKeys: ['lead', 'title', 'subtitle', 'trail', 'chevron'],
  handlers: [{ name: 'onClick', event: 'click', selector: null }],
});

// `options[].label` (and optgroup `options`) is passed through unconverted —
// same reasoning as Menu's `items`.
export const Select = makeTemplateComponent('Select', select, {
  slotKeys: ['label', 'help', 'error'],
  withChange: true,
});

export const Skeleton = makeTemplateComponent('Skeleton', skeleton);

// `columns[].label` and each row's cell values are passed through
// unconverted — same reasoning as Menu's `items`.
export const Table = makeTemplateComponent('Table', table);

// `tabs[].label`/`section` is passed through unconverted — same reasoning as
// Menu's `items`.
export const Tabs = makeTemplateComponent('Tabs', tabs);

export const Tag = makeTemplateComponent('Tag', tag, {
  slotKeys: ['children', 'icon'],
});

export const TextField = makeTemplateComponent('TextField', textField, {
  slotKeys: ['label', 'help', 'error', 'iconStart', 'iconEnd', 'prefix'],
  handlers: [{ name: 'endAction.onClick', event: 'click', selector: '.lds-field__adorn--action' }],
  withChange: true,
});

export const Toggle = makeTemplateComponent('Toggle', toggle, {
  slotKeys: ['label', 'help'],
  withChange: true,
});

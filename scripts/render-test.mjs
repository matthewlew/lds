// Renders every exported component to static HTML.
//
// This is deliberately a render and not a snapshot: the thing most likely to
// break in this package is a component that throws — a bad import path, a hook
// used outside a provider, a prop the prototype relied on a global for. Running
// them through react-dom/server catches all of that, and asserting on the class
// names catches the case where a component renders but stops emitting the LDS
// classes the stylesheet paints.
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as LDS from '@lew/lds';

const el = React.createElement;
const fails = [];
const skipped = [];

function check(name, node, expect) {
  let html;
  try {
    html = renderToStaticMarkup(node);
  } catch (err) {
    fails.push(`${name}: threw — ${err.message}`);
    return;
  }
  if (!html) { fails.push(`${name}: rendered nothing`); return; }
  for (const cls of [].concat(expect)) {
    if (!html.includes(cls)) fails.push(`${name}: missing ${JSON.stringify(cls)} in ${html.slice(0, 160)}`);
  }
}

const {
  Avatar, Banner, Button, ButtonGroup, Card, Checkbox, Chip, CodeField, EmptyState,
  Icon, Inline, Link, Menu, Modal, Nav, Radio, Row, SegmentedControl, Select,
  Skeleton, Table, Tabs, Tag, TextField, Textarea, Toast, ToastProvider, Toggle,
  Tooltip, hueForName, initialsForName, dialOptions, DIAL_CODES,
} = LDS;

check('Avatar/initials', el(Avatar, { name: 'Ada Lovelace' }), ['lds-avatar', 'AL']);
check('Avatar/fallback', el(Avatar, {}), ['lds-avatar', '#person']);
check('Avatar/image', el(Avatar, { name: 'Ada', src: '/a.png' }), ['<img']);
check('Banner', el(Banner, { status: 'error', title: 'Nope' }, 'body'), ['lds-banner--error', 'data-status="error"', 'close-circle-fill']);
check('Button', el(Button, { variant: 'primary' }, 'Save'), ['lds-btn--primary', 'lds-btn__label']);
check('Button/href', el(Button, { href: '/x' }, 'Go'), ['<a', 'role="button"']);
check('Button/icons', el(Button, { iconStart: 'add', iconEnd: 'chevron-right' }, 'Add'), ['lds-btn__icon', '#add', '#chevron-right']);
check('Button/subtitle', el(Button, { subtitle: 'from $40' }, 'Book'), ['lds-btn--stacked', 'lds-btn__subtitle']);
check('ButtonGroup', el(ButtonGroup, { align: 'split' }, el(Button, null, 'a')), ['lds-btn-group--split']);
check('ButtonGroup/conversion', el(ButtonGroup, { detail: '$240', detailNote: '2 nights' }), ['lds-btn-group--conversion', 'lds-btn-group__detail-note']);
check('Card', el(Card, { kicker: 'K', title: 'T', body: 'B' }), ['lds-card__kicker', 'lds-card__title', 'lds-card__body']);
check('Card/selectable', el(Card, { selectable: true, selected: true }), ['lds-card--selectable', 'aria-pressed="true"']);
check('Checkbox', el(Checkbox, { label: 'Yes' }), ['lds-check', 'lds-check__box']);
check('Chip', el(Chip, { selected: true }, 'Filter'), ['lds-chip--selected', 'aria-pressed="true"']);
check('Chip/remove', el(Chip, { onRemove: () => {} }, 'Tok'), ['lds-chip__remove', '#close']);
check('CodeField', el(CodeField, { label: 'Code', length: 6 }), ['lds-field__code', 'Digit 1']);
check('EmptyState', el(EmptyState, { icon: 'search', title: 'Nothing' }), ['lds-empty', '#search']);
check('Icon', el(Icon, { name: 'search' }), ['lds-icon', '#search']);
check('Inline', el(Inline, { status: 'warning' }, 'Careful'), ['lds-inline--warning', 'warning-fill']);
check('Link', el(Link, { href: '#', variant: 'standalone' }, 'More'), ['lds-link--standalone', '#chevron-right']);
check('Menu', el(Menu, { items: [{ label: 'Open' }, { separator: true }, { label: 'Delete', danger: true }] }), ['lds-menu__item', 'lds-menu__separator', 'lds-menu__item--danger']);
check('Modal', el(Modal, { title: 'T', onBack: () => {} }, 'body'), ['lds-modal', 'lds-modal__back', '#chevron-left', '#close']);
check('Modal/sheet', el(Modal, { title: 'T', sheet: true }), ['lds-modal--sheet', 'lds-modal__handle']);
check('Nav/brand', el(Nav, { logo: 'Lew', links: el('a', { href: '#' }, 'Work') }), ['lds-nav__logo', 'lds-nav__links']);
check('Nav/bar', el(Nav, { variant: 'bar', title: 'Settings', onBack: () => {} }), ['lds-nav--bar', 'lds-nav__back', '#chevron-left', 'lds-nav__title']);
check('Radio', el(Radio, { label: 'One', name: 'g' }), ['lds-check--radio', 'type="radio"']);
check('Row', el(Row, { title: 'T', subtitle: 'S', chevron: true }), ['lds-row__title', 'lds-row__subtitle', '#chevron-right']);
check('SegmentedControl', el(SegmentedControl, { options: ['Day', 'Week'], defaultValue: 'Day' }), ['lds-seg', 'role="radiogroup"']);
check('Select', el(Select, { label: 'L', options: ['a', 'b'] }), ['lds-field', '<select']);
check('Select/optgroup', el(Select, { options: [{ label: 'G', options: ['x'] }] }), ['<optgroup']);
check('Skeleton', el(Skeleton, { variant: 'title' }), ['lds-skeleton--title']);
check('Table', el(Table, { columns: [{ key: 'a', label: 'A' }], rows: [{ a: '1' }] }), ['lds-table', '<th', '<td']);
check('Tabs', el(Tabs, { tabs: [{ id: 'x', label: 'X', icon: 'star' }], active: 'x' }), ['lds-tabs__tab--active', '#star']);
check('Tag', el(Tag, { hue: 'green', dot: true }, 'Live'), ['lds-tag', 'hue-green', 'lds-tag__dot']);
check('TextField', el(TextField, { label: 'Email', iconStart: 'mail' }), ['lds-field--has-start', '#mail']);
check('TextField/error', el(TextField, { label: 'E', error: 'Bad' }), ['lds-field--error', 'data-status="error"']);
check('Textarea', el(Textarea, { label: 'N', maxLength: 100 }), ['lds-field__count', '0 / 100']);
check('Toast', el(Toast, { status: 'success', title: 'Saved' }), ['lds-toast', 'data-status="success"', 'check-circle', 'role="status"']);
check('Toast/error-assertive', el(Toast, { status: 'error' }, 'x'), ['role="alert"', 'aria-live="assertive"']);
check('ToastProvider', el(ToastProvider, null, el('p', null, 'app')), ['lds-toast-viewport--bottom', 'app']);
check('Toggle', el(Toggle, { label: 'On', help: 'h' }), ['lds-toggle__switch', 'lds-toggle__track']);
check('Tooltip', el(Tooltip, { label: 'Search' }, el('button', null, 'S')), ['lds-tooltip__bubble', 'role="tooltip"', 'aria-describedby']);

// The sprite must resolve to something real, not the prototype's bare relative
// path — that was the whole point of the resolver.
const iconHtml = renderToStaticMarkup(el(Icon, { name: 'search' }));
if (/href="icons\.svg#/.test(iconHtml)) fails.push('Icon: still resolving the prototype relative path');
if (!/open-icons/.test(iconHtml)) fails.push(`Icon: sprite did not resolve into @lew/open-icons — got ${iconHtml}`);

// setIconSprite has to be honoured at render time, not frozen at import time.
LDS.setIconSprite('https://cdn.example.com/icons.svg');
const repointed = renderToStaticMarkup(el(Icon, { name: 'search' }));
if (!repointed.includes('https://cdn.example.com/icons.svg#search')) {
  fails.push(`setIconSprite ignored — got ${repointed}`);
}
LDS.setIconSprite(LDS.getIconSprite());

// Helpers
if (initialsForName('Ada Lovelace') !== 'AL') fails.push('initialsForName: expected AL');
if (initialsForName('Prince') !== 'P') fails.push('initialsForName: expected P');
if (initialsForName('') !== '') fails.push('initialsForName: expected empty');
if (hueForName('Ada') !== hueForName('Ada')) fails.push('hueForName: not stable');
if (DIAL_CODES.length < 200) fails.push(`DIAL_CODES: only ${DIAL_CODES.length} entries`);
const dials = dialOptions();
if (!dials.top.length || !dials.rest.length) fails.push('dialOptions: expected both groups');
if (dials.top[0].label !== '+1 US') fails.push(`dialOptions: expected "+1 US", got ${dials.top[0].label}`);

// Every named export should be reachable and be a function.
const exported = Object.keys(LDS).filter((k) => k !== 'DIAL_CODES');
const notFunctions = exported.filter((k) => typeof LDS[k] !== 'function');
if (notFunctions.length) fails.push(`non-function exports: ${notFunctions.join(', ')}`);

if (skipped.length) console.log(`skipped: ${skipped.join(', ')}`);
if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`render-test: ${exported.length} exports, all components render, sprite resolves and repoints`);

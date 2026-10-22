// Holds every component to its @lew-ds/lds template, byte for byte.
//
// For each case, `renderToStaticMarkup(<X {...props}/>)` must equal
// `x(props)` from @lew-ds/lds/templates. The cases are the markup contract's
// own (scripts/component-cases.mjs, the matrix @lew-ds/lds is frozen against),
// so a template change that is not mirrored here fails here, plus cases only a
// React binding has: React nodes in slots, `as`, composed tables, the
// compositions.
//
// Two things are matched rather than compared blind:
//
//   - A slot given a React node is compared with the template given that
//     node's own markup as raw() — the binding must place a node exactly where
//     the template places markup.
//   - A field with no `id` (a SegmentedControl with no `name`, a Tooltip with
//     no bubble `id`) gets one from useId, where the template has none to
//     give. The generated id is read back and handed to the template, so the
//     comparison is "the same markup, given the same id".
//
// And two differences that are React's and not the markup's are set aside:
//
//   - Attribute names are compared case-insensitively, as HTML reads them. The
//     contract spells them in lowercase (scripts/normalize-markup.mjs says why);
//     React 19 writes `readOnly`, `maxLength`, `inputMode` as given. Both parse
//     to the same DOM.
//   - React puts a `<link rel="preload" as="image">` before an `<img>` it
//     renders on its own; in a document that hint goes to <head>, so it is not
//     the component's markup.
import { createElement as h, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { setIconSprite, raw } from '@lew-ds/lds';
import * as templates from '@lew-ds/lds/templates';
import { buildSprite } from '@lew-ds/open-icons/sprite';
import * as LDS from '../dist/index.js';
import { IconSprite } from '../dist/icon-sprite.js';
import { CASES } from '../../../scripts/component-cases.mjs';

// The components reference the in-document sprite; point the templates at it.
setIconSprite('');

const fails = [];
const warnings = [];
const consoleError = console.error;
console.error = (...args) => warnings.push(args.map(String).join(' '));

const render = (el) => renderToStaticMarkup(el).replace(/<link rel="preload" as="image"[^>]*\/>/g, '');
// Safe on markup because both bindings escape `"` in text, so ` name="` occurs
// only in attribute position.
const canon = (html) => html.replace(/ ([A-Za-z][\w:-]*)="/g, (_, name) => ` ${name.toLowerCase()}="`);

// A React node in a prop becomes the raw() markup the template would be given.
function asTemplateProps(value) {
  if (isValidElement(value)) return raw(render(value));
  if (Array.isArray(value)) return value.map(asTemplateProps);
  if (value && typeof value === 'object' && !('__html' in value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, asTemplateProps(v)]));
  }
  return value;
}

// Where a component generates what the template takes as a prop.
const GENERATED = {
  TextField: ['id', /<input[^>]* id="([^"]+)"/],
  Select: ['id', /<select[^>]* id="([^"]+)"/],
  Textarea: ['id', /<textarea[^>]* id="([^"]+)"/],
  Tooltip: ['id', /<span id="([^"]+)" class="lds-tooltip__bubble"/],
  SegmentedControl: ['name', / name="([^"]+)"/],
  IconButton: ['id', /<span id="([^"]+)" class="lds-tooltip__bubble"/],
};

const templateFor = (component) => templates[component[0].toLowerCase() + component.slice(1)];

function check(component, label, props, { template = templateFor(component), templateProps } = {}) {
  const key = `${component}/${label}`;
  const Component = LDS[component];
  if (typeof Component !== 'function') { fails.push(`${key}: @lew-ds/lds-react has no ${component}`); return; }
  let actual;
  try {
    actual = render(h(Component, props));
  } catch (err) {
    fails.push(`${key}: render threw — ${err.message}`);
    return;
  }
  let given = templateProps ?? asTemplateProps(props);
  const generated = GENERATED[component];
  if (generated && given[generated[0]] === undefined) {
    const found = actual.match(generated[1]);
    if (found) given = { ...given, [generated[0]]: found[1] };
  }
  const expected = template(given);
  if (canon(actual) !== canon(expected)) fails.push(`${key}\n      template: ${expected}\n      react:    ${actual}`);
}

// ---- the markup contract's own cases ---------------------------------------
let contract = 0;
for (const [component, label, props] of CASES) {
  // A raw() slot has no React spelling; those cases are restated below with
  // the elements they stand for.
  if (Object.values(props).some((v) => v && typeof v === 'object' && '__html' in v)) continue;
  check(component, label, props);
  contract++;
}

// ---- what only a React binding has -------------------------------------------
const extra = [
  ['Banner', 'node slots', {
    status: 'error', title: h('strong', null, 'Payment failed'),
    actions: h(LDS.Button, { variant: 'secondary', size: 'sm' }, 'Retry'), dismissible: true,
    children: [h('p', { key: 'a' }, 'Your card was declined.'), ' Try another.'],
  }],
  ['Banner', 'icon node', { status: 'info', icon: h(LDS.Icon, { name: 'star' }), children: 'Custom glyph.' }],
  ['Button', 'node icon + label', { iconStart: h(LDS.Icon, { name: 'add' }), children: h('em', null, 'Add') }],
  ['Button', 'emphasis strong', { emphasis: 'strong', hue: 'red', children: 'Delete' }],
  ['Button', 'href with attrs', { href: '/cards', target: '_blank', rel: 'noopener', iconEnd: 'external', children: 'Open' }],
  ['Button', 'as link component', { href: '/cards', as: (p) => h('a', { ...p, 'data-router': '' }), children: 'Go' },
    { templateProps: { href: '/cards', 'data-router': '', children: 'Go' } }],
  ['Card', 'node slots', { kicker: 'Visa', title: h('span', null, 'Sapphire'), meta: h(LDS.Tag, { hue: 'green' }, 'Active'), actions: h(LDS.Button, null, 'Edit') }],
  ['Card', 'selectable selected', { selectable: true, selected: true, title: 'Pick me', 'aria-describedby': 'x' }],
  ['Chip', 'removable + clickable', { onRemove: () => {}, onClick: () => {}, selected: false, children: 'Token' }],
  ['EmptyState', 'node actions', { icon: 'search', title: 'No cards yet', actions: h(LDS.Button, { iconStart: 'add' }, 'Add your first card') }],
  ['Icon', 'named', { name: 'warning-fill', 'aria-label': 'Warning', role: 'img', size: 16 }],
  ['Inline', 'error alert', { status: 'error', role: 'alert', children: 'Enter an amount above $0.' }],
  ['Link', 'standalone node icon', { href: '/x', variant: 'standalone', iconEnd: h(LDS.Icon, { name: 'external' }), children: 'Docs' }],
  ['Link', 'standalone suppressed', { href: '/x', variant: 'standalone', iconEnd: null, children: 'Docs' }],
  ['Menu', 'node labels', { items: [{ label: h('b', null, 'Bold'), icon: h(LDS.Icon, { name: 'edit' }), onClick: () => {} }] }],
  ['Row', 'href + node slots', { href: '/c/1', title: 'Visa', subtitle: h('span', null, '•••• 4242'), trail: h(LDS.Tag, null, 'Due'), chevron: true }],
  ['Row', 'selected div', { title: 'T', selected: true, onClick: () => {} }],
  ['Select', 'value without onChange', { label: 'Card', id: 's9', options: ['Visa', { value: 'mc', label: 'Mastercard' }], value: 'mc', help: 'h' }],
  ['Select', 'generated id', { label: 'Card', options: ['a'], error: 'Pick one.' }],
  ['Checkbox', 'checked without onChange', { label: 'Autopay', id: 'c9', checked: true }],
  ['Radio', 'named', { label: 'Monthly', name: 'freq', value: 'm', checked: true }],
  ['Toggle', 'checked without onChange', { label: 'Alerts', id: 'g9', checked: true }],
  ['Table', 'composed', {
    'aria-label': 'Cards',
    children: [
      h('thead', { key: 'h' }, h('tr', null, h('th', { scope: 'col' }, 'Card'), h('th', { scope: 'col' }, 'Due'))),
      h('tbody', { key: 'b' },
        h('tr', { 'data-card': 'visa' }, h('th', { scope: 'row' }, 'Visa'), h('td', null, 'Oct 30')),
        h('tr', { className: 'is-struck' }, h('th', { scope: 'row' }, 'Amex'), h('td', null, h('s', null, 'Paid')))),
    ],
  }],
  ['Table', 'node cells + column class', { columns: [{ key: 'n', label: 'Name' }, { key: 'a', label: h('abbr', { title: 'Amount' }, 'Amt'), className: 'num' }], rows: [{ n: 'Visa', a: h(LDS.Tag, null, '$4') }] }],
  ['Tabs', 'onChange', { tabs: [{ id: 'a', label: 'All' }, { id: 'b', label: h('span', null, 'Due') }], active: 'a', onChange: () => {} }],
  ['Tag', 'node icon', { icon: h(LDS.Icon, { name: 'clock' }), status: 'warning', children: 'Due soon' }],
  ['TextField', 'generated id + help', { label: 'Amount', help: 'In dollars.', inputMode: 'decimal' }],
  ['TextField', 'value without onChange', { label: 'Name', id: 'n9', value: 'Ada', placeholder: 'p' }],
  ['TextField', 'end action', { label: 'Search', id: 'q9', iconStart: 'search', endAction: { icon: 'close', label: 'Clear', onClick: () => {} } }],
  ['Textarea', 'defaultValue + count', { label: 'Notes', id: 'b9', defaultValue: 'hello', maxLength: 20 }],
  ['Textarea', 'controlled', { label: 'Notes', id: 'b8', value: 'hi', onChange: () => {}, showCount: true }],
  ['Textarea', 'generated id + error', { label: 'Notes', error: 'Too long.' }],
  ['Toast', 'node slots', { status: 'success', title: 'Saved', actions: h(LDS.Button, { size: 'sm' }, 'Undo'), children: 'Card added.' }],
  ['Tooltip', 'generated id + node trigger', { label: 'Search', children: h(LDS.Button, { iconOnly: true, iconStart: 'search', 'aria-label': 'Search' }) }],
  ['Tooltip', 'left is start', { label: 'L', id: 'tt9', placement: 'left', children: 'T' }],
  ['SegmentedControl', 'generated name', { label: 'View', options: [{ value: 'grid', label: 'Grid', icon: 'grid' }, { value: 'list', label: 'List', icon: 'list' }], value: 'list', iconsOnly: true }],
  ['SegmentedControl', 'defaultValue', { name: 'v', options: ['Day', 'Week'], defaultValue: 'Week' },
    { templateProps: { name: 'v', options: ['Day', 'Week'], value: 'Week' } }],
  ['CodeField', 'help', { label: 'Code', length: 3, help: 'Sent by text.', value: '4' }],
];
for (const [component, label, props, opts] of extra) check(component, label, props, opts);

// ---- compositions -------------------------------------------------------------
// IconButton is Tooltip around an icon-only Button, named once, and a plain
// button rather than a form's submit.
check('IconButton', 'composition', { label: 'Edit card', icon: 'edit', onClick: () => {} }, {
  template: (p) => templates.tooltip({
    id: p.id, label: 'Edit card',
    children: raw(templates.button({ size: 'sm', type: 'button', iconOnly: true, iconStart: 'edit', 'aria-label': 'Edit card' })),
  }),
});

// IconSprite is buildSprite's sprite: COMPONENT_ICONS plus the page's own.
{
  const actual = render(h(IconSprite, { icons: ['search', 'edit'] }));
  const expected = buildSprite([...LDS.COMPONENT_ICONS, 'search', 'edit']);
  // React spells the inline style from an object; the browser reads the same declarations.
  const norm = (s) => canon(s.replace(/ style="[^"]*"/, ''));
  if (norm(actual) !== norm(expected)) fails.push(`IconSprite\n      buildSprite: ${expected.slice(0, 300)}\n      react:       ${actual.slice(0, 300)}`);
  if (!/style="position:fixed;top:0;left:0;overflow:hidden;clip-path:inset\(50%\);pointer-events:none"/.test(actual)) {
    fails.push(`IconSprite: the sprite is not fixed and clipped — ${actual.slice(0, 200)}`);
  }
}

console.error = consoleError;
for (const w of warnings) fails.push(`React warned while rendering: ${w.slice(0, 300)}`);

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} parity failure(s)`);
  process.exit(1);
}
console.log(`parity: ${contract} contract cases and ${extra.length + 2} React cases render exactly the template's markup`);

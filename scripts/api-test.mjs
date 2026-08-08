// The package's surface, exercised without a browser.
//
// The markup contract proves each component emits the right HTML. This proves
// the things around it: that everything documented is actually exported, that
// the sprite is resolved through @lew-ds/open-icons and honours setIconSprite, that
// text going into a slot is escaped and `raw()` is not, and that h() composes
// templates rather than merely concatenating them.
//
// It replaces the old render-test, which needed React to answer the same
// questions.
import * as LDS from '@lew-ds/lds';
import * as templates from '@lew-ds/lds/templates';
import * as controllers from '@lew-ds/lds/controllers';

const fails = [];
const eq = (actual, expected, what) => {
  if (actual !== expected) fails.push(`${what}\n      expected: ${expected}\n      actual:   ${actual}`);
};

// ---- exports ----------------------------------------------------------------
const COMPONENTS = [
  'avatar', 'banner', 'button', 'buttonGroup', 'card', 'checkbox', 'chip', 'codeField',
  'emptyState', 'icon', 'inline', 'link', 'menu', 'modal', 'nav', 'radio', 'row',
  'segmentedControl', 'select', 'skeleton', 'table', 'tabs', 'tag', 'textField',
  'textarea', 'toast', 'toggle', 'tooltip',
];
const CONTROLLERS = [
  'mountCodeField', 'mountSegmentedControl', 'mountTextarea', 'mountToasts', 'mountTooltip',
];
const HELPERS = [
  'escapeHtml', 'raw', 'slot', 'h', 'mount', 'attrs', 'cx', 'styleAttr', 'spriteSvg',
  'setIconSprite', 'getIconSprite', 'resolveSprite', 'STATUS_ICON',
  'hueForName', 'initialsForName', 'DIAL_CODES', 'dialOptions',
];

for (const name of [...COMPONENTS, ...CONTROLLERS, ...HELPERS]) {
  if (LDS[name] === undefined) fails.push(`@lew-ds/lds does not export ${name}`);
}
for (const name of COMPONENTS) {
  if (typeof templates[name] !== 'function') fails.push(`@lew-ds/lds/templates does not export ${name}`);
}
for (const name of CONTROLLERS) {
  if (typeof controllers[name] !== 'function') fails.push(`@lew-ds/lds/controllers does not export ${name}`);
}
// Every component in the contract must be reachable — a template that exists but
// is not exported is a component nobody can use.
if (COMPONENTS.length !== 28) fails.push(`expected 28 components, listed ${COMPONENTS.length}`);

// ---- the sprite -------------------------------------------------------------
const original = LDS.getIconSprite();
if (!/open-icons/.test(original)) {
  fails.push(`the default sprite should resolve into @lew-ds/open-icons, got ${original}`);
}
// Read through a getter, not a default parameter: a default parameter is bound
// once and would ignore a later setIconSprite.
LDS.setIconSprite('/custom/sprite.svg');
if (!LDS.icon({ name: 'search' }).includes('/custom/sprite.svg#search')) {
  fails.push('setIconSprite is not honoured at render time');
}
eq(LDS.resolveSprite('/other.svg'), '/other.svg', 'resolveSprite: an explicit href wins');
eq(LDS.resolveSprite(undefined), '/custom/sprite.svg', 'resolveSprite: undefined falls back');
LDS.setIconSprite(original);

// ---- escaping ---------------------------------------------------------------
eq(LDS.escapeHtml(`<b>&"'`), '&lt;b&gt;&amp;&quot;&#x27;', 'escapeHtml');
eq(LDS.slot('<b>'), '&lt;b&gt;', 'slot escapes a bare string');
eq(LDS.slot(LDS.raw('<b>')), '<b>', 'slot passes raw() through');
eq(LDS.slot(['a', LDS.raw('<i>'), 'b']), 'a<i>b', 'slot resolves a list piecewise');
eq(LDS.slot(null) + LDS.slot(undefined) + LDS.slot(false), '', 'slot drops the empty values');
// The whole point of the wrapper: text cannot become markup by accident.
if (LDS.banner({ children: '<script>x</script>' }).includes('<script>')) {
  fails.push('a slot let raw script through without raw()');
}

// ---- h() --------------------------------------------------------------------
eq(LDS.slot(LDS.h('div', { className: 'x' }, 'hi')), '<div class="x">hi</div>', 'h: element');
eq(LDS.slot(LDS.h('input', { type: 'text' })), '<input type="text"/>', 'h: void element self-closes');
eq(LDS.slot(LDS.h('div', null, '<b>')), '<div>&lt;b&gt;</div>', 'h: children are escaped');
eq(LDS.slot(LDS.h('div', null, LDS.h('span', null, 'a'), LDS.h('span', null, 'b'))),
  '<div><span>a</span><span>b</span></div>', 'h: nests');
eq(LDS.slot(LDS.h(LDS.tag, { hue: 'green' }, 'Live')),
  LDS.tag({ hue: 'green', children: 'Live' }), 'h: a template gets its children as a slot');
eq(LDS.slot(LDS.h('div', { key: 'k' }, 'x')), '<div>x</div>', 'h: key is not an attribute');
// A function component composed of h() calls returns raw markup, not a string.
const Demo = () => LDS.h('p', null, 'hi');
eq(LDS.slot(LDS.h(Demo)), '<p>hi</p>', 'h: function component');

// ---- attributes -------------------------------------------------------------
eq(LDS.attrs({ className: 'a', htmlFor: 'b', readOnly: true }), ' class="a" for="b" readonly=""',
  'attrs: React-style names map to HTML');
eq(LDS.attrs({ hidden: false, title: null, alt: undefined }), '', 'attrs: falsy values disappear');
eq(LDS.attrs({ onClick: () => {} }), '', 'attrs: handlers never reach the DOM');
eq(LDS.attrs({ checked: true, disabled: true }, 'input'), ' disabled="" checked=""',
  'attrs: checked is emitted last on a form control');
eq(LDS.styleAttr({ width: 32, lineHeight: 2, color: 'red' }), 'width:32px;line-height:2;color:red',
  'styleAttr: px where the property needs it, bare where it does not');
eq(LDS.attrs({ title: '"><script>' }), ' title="&quot;&gt;&lt;script&gt;"', 'attrs: values are escaped');

// ---- shared vocabulary ------------------------------------------------------
eq(LDS.initialsForName('Ada Lovelace'), 'AL', 'initialsForName: two words');
eq(LDS.initialsForName('Prince'), 'P', 'initialsForName: one word');
eq(LDS.initialsForName(''), '', 'initialsForName: empty');
eq(LDS.hueForName('Ada'), LDS.hueForName('Ada'), 'hueForName: stable');
// Banner, Inline and Toast must agree about what a status means.
for (const status of ['info', 'success', 'warning', 'caution', 'error']) {
  const glyph = LDS.STATUS_ICON[status];
  if (!glyph) { fails.push(`STATUS_ICON has no glyph for ${status}`); continue; }
  for (const [name, fn] of [['banner', LDS.banner], ['inline', LDS.inline], ['toast', LDS.toast]]) {
    if (!fn({ status, children: 'x' }).includes(`#${glyph}`)) {
      fails.push(`${name} does not draw ${glyph} for status=${status}`);
    }
  }
}
if (!Array.isArray(LDS.DIAL_CODES) || !LDS.DIAL_CODES.length) fails.push('DIAL_CODES is empty');
// { top, rest }: the common countries first, then everything else. The country
// name goes in the optgroup, not the option — see dial-codes.js.
const dial = LDS.dialOptions();
if (!dial.top?.length || !dial.rest?.length) fails.push('dialOptions() is missing top or rest');
if (dial.top?.[0] && !/^\+/.test(dial.top[0].value)) fails.push('dialOptions(): value should be the dial code');

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} problem(s)`);
  process.exit(1);
}
console.log('api-test: exports, sprite resolution, escaping, h() and the shared vocabulary all hold');

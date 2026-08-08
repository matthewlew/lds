// Checks the things that break silently between the CSS, the components and the
// sprite — each one renders "fine" and just shows the wrong thing.
//
// Deliberately NOT checked: whether a custom property is defined at :root versus
// under a class. That is the one-token architecture working as designed — the
// `.hue-*` retints, the status→colour map and the per-variant role assignments
// on `.lds-btn--*` are conditional by intent, and hoisting them to :root would
// apply every hue and every status unconditionally. This asserts that a property
// is defined SOMEWHERE, which catches typos, and says nothing about scope.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The repo root, derived from this file's own location rather than named
// outright. It was an absolute path into the sandbox that generated these
// scripts (/home/claude/repo), which resolves nowhere else — CI failed at the
// first readdirSync on a clean checkout.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CSS = join(ROOT, 'packages/lds/css');
const SRC = join(ROOT, 'packages/lds/src');

const fails = [];
const files = [
  'apca-palette.css', 'lds.css',
  'themes/palette.css', 'themes/product.css',
];

let all = '';
for (const f of files) {
  const src = readFileSync(join(CSS, f), 'utf8');
  const opens = (src.match(/\{/g) || []).length;
  const closes = (src.match(/\}/g) || []).length;
  if (opens !== closes) fails.push(`${f}: unbalanced braces (${opens} open, ${closes} close)`);
  all += src;
}

// --- every referenced custom property is defined somewhere ---
const defined = new Set([...all.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
// `var(--x, fallback)` states its own default, so it is fine undefined.
const referenced = new Set(
  [...all.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]),
);
const undef = [...referenced].filter((v) => !defined.has(v)).sort();
if (undef.length) fails.push(`custom properties used with no fallback and never defined: ${undef.join(', ')}`);

// --- every icon the components ask for exists in the sprite ---
const names = new Set(JSON.parse(readFileSync(join(ROOT, 'packages/open-icons/names.json'), 'utf8')));
const wanted = new Map();
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    if (!entry.name.endsWith('.js')) continue;
    const src = readFileSync(p, 'utf8');
    const add = (n) => { if (!wanted.has(n)) wanted.set(n, entry.name); };
    // Every glyph goes through one helper, so one pattern finds them all:
    // spriteSvg('close', iconHref). A name computed at runtime — spriteSvg(t.icon)
    // — cannot be checked statically and is skipped.
    for (const m of src.matchAll(/spriteSvg\('([a-z][a-z0-9-]*)'/g)) add(m[1]);
    // A default icon name stated as a fallback: iconEnd || 'chevron-right'.
    for (const m of src.matchAll(/\|\|\s*'([a-z][a-z0-9-]*-[a-z0-9-]+)'/g)) add(m[1]);
  }
};
walk(SRC);
// The status map is what Banner, Inline and Toast actually draw.
for (const m of readFileSync(join(ROOT, 'packages/lds/src/status-icons.js'), 'utf8')
  .matchAll(/:\s*'([a-z][a-z0-9-]*)'/g)) {
  if (!wanted.has(m[1])) wanted.set(m[1], 'status-icons.js');
}
for (const [icon, file] of wanted) {
  if (!names.has(icon)) fails.push(`${file}: references icon "${icon}", which is not in the sprite`);
}

// The status map is the one place three components must agree.
const statusSrc = readFileSync(join(ROOT, 'packages/lds/src/status-icons.js'), 'utf8');
for (const m of statusSrc.matchAll(/'([a-z][a-z0-9-]*)'/g)) {
  const v = m[1];
  if (v.includes('-') || v.endsWith('circle') || v === 'info') {
    if (!names.has(v) && !['info', 'success', 'warning', 'caution', 'error'].includes(v)) {
      fails.push(`status-icons.js: "${v}" is not in the sprite`);
    }
  }
}
for (const dup of ['banner', 'inline', 'toast']) {
  const src = readFileSync(join(SRC, 'templates', `${dup}.js`), 'utf8');
  if (!src.includes("from '../status-icons.js'")) {
    fails.push(`${dup}: does not read the shared status map`);
  }
  if (/const STATUS_ICON\s*=/.test(src)) {
    fails.push(`${dup}: still declares its own copy of the status map`);
  }
}

// --- the CSS classes the components emit should exist in the stylesheet ---
const classes = new Set([...all.matchAll(/\.(lds-[\w-]+)/g)].map((m) => m[1]));
const emitted = new Set();
const walkClasses = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) { walkClasses(p); continue; }
    if (!entry.name.endsWith('.js')) continue;
    const src = readFileSync(p, 'utf8');
    // Class names now appear inside template literals as well as quoted, so this
    // matches the token wherever it sits. A name ending in `-` is the literal
    // half of an interpolated one — `lds-seg--${size}` — and is resolved at
    // runtime, so it is dropped rather than reported as unstyled.
    for (const m of src.matchAll(/\blds-[\w-]+/g)) {
      if (!m[0].endsWith('-')) emitted.add(m[0]);
    }
  }
};
walkClasses(SRC);
// A class that is emitted deliberately without a rule of its own. It came
// through from the design export, where the meta divider is the plain
// `.lds-card__divider` plus a modifier that exists only as a targeting hook for
// a theme. The markup is kept identical to the export rather than tidied, so the
// exemption is recorded here instead of the class being dropped.
const UNSTYLED_BY_DESIGN = new Set(['lds-card__divider--meta']);
const unstyled = [...emitted].filter((c) => !classes.has(c) && !UNSTYLED_BY_DESIGN.has(c)).sort();
if (unstyled.length) fails.push(`components emit classes with no rule in the CSS: ${unstyled.join(', ')}`);

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`css-test: ${files.length} stylesheets, ${defined.size} properties defined, `
  + `${wanted.size} icon references, ${emitted.size} emitted classes — all resolve`);

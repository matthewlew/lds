// Consumes the packages exactly as an installed app would: bare specifiers only,
// nothing reaching into the repo.
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  button, icon, toast, nav, tooltip, segmentedControl, h, raw,
  setIconSprite, dialOptions,
} from '@lew-ds/lds';
import { mountToasts } from '@lew-ds/lds/controllers';
import { banner } from '@lew-ds/lds/templates';
import { ICON_NAMES, spriteUrl, hasIcon } from '@lew-ds/open-icons';

const require = createRequire(import.meta.url);
const fails = [];

// 1. components render from the installed package
const html = String(h('div', null,
  h(button, { variant: 'primary', iconStart: 'check' }, 'Save'),
  h(nav, { variant: 'bar', title: 'Settings', onBack: () => {} }),
  h(toast, { status: 'error', title: 'Failed' }, 'x'),
  h(tooltip, { label: 'Search', children: raw(button({ iconOnly: true, iconStart: 'search' })) }),
  h(segmentedControl, { name: 'g', options: ['A', 'B'], value: 'A' }),
  h(banner, { status: 'info' }, 'From the /templates subpath.'),
).__html);
for (const want of ['lds-btn--primary', 'lds-nav--bar', 'lds-toast', 'lds-tooltip__bubble', 'lds-seg', 'lds-banner']) {
  if (!html.includes(want)) fails.push(`missing ${want} in rendered output`);
}
// The controllers subpath has to be reachable even where there is no DOM to use it.
if (typeof mountToasts !== 'function') fails.push('@lew-ds/lds/controllers did not export mountToasts');

// 2. the sprite the installed components point at actually exists on disk
const iconHtml = icon({ name: 'warning-fill' });
const href = iconHtml.match(/href="([^"#]+)#/)?.[1];
if (!href) fails.push(`could not read sprite href from ${iconHtml}`);
else {
  const path = href.startsWith('file:') ? fileURLToPath(href) : href;
  if (!existsSync(path)) fails.push(`sprite href points at a file that does not exist: ${path}`);
  else {
    const svg = readFileSync(path, 'utf8');
    if (!svg.includes('id="warning-fill"')) fails.push('installed sprite has no warning-fill symbol');
    if (svg.includes('${u}')) fails.push('installed sprite still contains the ${u} placeholder');
    if (!svg.includes('id="k-warning-fill"')) fails.push('installed sprite has the un-uniqued mask id');
  }
}

// 3. every documented subpath export resolves
for (const sub of ['@lew-ds/lds/css', '@lew-ds/lds/css/themes/product', '@lew-ds/lds/css/lds',
  '@lew-ds/lds/templates', '@lew-ds/lds/controllers',
  '@lew-ds/lds/adherence.oxlintrc.json', '@lew-ds/open-icons/icons.svg', '@lew-ds/open-icons/names.json']) {
  try { require.resolve(sub); } catch (e) { fails.push(`subpath does not resolve: ${sub}`); }
}

// 4. the CSS the package ships can find its fonts
const cssPath = require.resolve('@lew-ds/lds/css');
const css = readFileSync(cssPath, 'utf8');
const ldsCss = readFileSync(require.resolve('@lew-ds/lds/css/lds'), 'utf8');
for (const m of ldsCss.matchAll(/url\('(fonts\/[^']+)'\)/g)) {
  const font = new URL(m[1], `file://${require.resolve('@lew-ds/lds/css/lds')}`);
  if (!existsSync(fileURLToPath(font))) fails.push(`CSS references a font not in the package: ${m[1]}`);
}
if (!css.includes('@import')) fails.push('css entry does not import the layers');

// 5. helpers and data survive packaging
if (ICON_NAMES.length !== 174) fails.push(`ICON_NAMES is ${ICON_NAMES.length}, expected 174`);
if (!hasIcon('close-circle-fill')) fails.push('hasIcon lost the sprite name list');
if (!spriteUrl.includes('open-icons')) fails.push(`spriteUrl looks wrong: ${spriteUrl}`);
if (dialOptions().top[0].label !== '+1 US') fails.push('dialOptions did not survive packaging');

// 6. repointing still works for an app hosting the sprite itself
setIconSprite('/static/icons.svg');
if (!icon({ name: 'search' }).includes('/static/icons.svg#search')) {
  fails.push('setIconSprite does not work from the installed package');
}

if (fails.length) { for (const f of fails) console.error(`FAIL ${f}`); process.exit(1); }
console.log('consumer-test: installed packages render, sprite resolves on disk, all subpaths and fonts resolve');

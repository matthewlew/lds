// The controllers, driven in a real browser.
//
// Templates are strings and the markup contract covers them completely. What it
// cannot cover is the half of each stateful component that only exists once the
// markup is in a document: focus moving between boxes, a queue dropping its
// oldest message, a tooltip opening on FOCUS and not only on hover.
//
// So this drives them the way a user would — real key events, real clicks, real
// timers — rather than asserting on the output of a function.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  let file = join(SITE, path === '/' ? 'index.html' : path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.CHROMIUM_PATH
  || (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); };

// A blank page carrying only the bundle, so each controller is exercised on its
// own rather than through whatever a docs card happens to do.
const page = await browser.newPage();
page.on('pageerror', (e) => fails.push(`pageerror: ${e.message}`));
await page.goto(`${base}/cards/Icon.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => { document.body.innerHTML = '<div id="t"></div>'; });

// ---- CodeField ---------------------------------------------------------------
await page.evaluate(() => {
  window.seen = [];
  window.cf = LDS.mountCodeField(document.getElementById('t'),
    { length: 6, groupAfter: 3, onChange: (v) => window.seen.push(v) });
});

const boxes = page.locator('#t .lds-field__code input');
check(await boxes.count() === 6, `CodeField: expected 6 boxes, got ${await boxes.count()}`);

// Typing walks focus forward.
await boxes.nth(0).focus();
await page.keyboard.type('4');
check(await page.evaluate(() => document.activeElement === document.querySelectorAll('#t .lds-field__code input')[1]),
  'CodeField: typing a digit did not move focus to the next box');
await page.keyboard.type('82');
check(await page.evaluate(() => window.cf.value) === '482', 'CodeField: value did not accumulate');

// Backspace in an EMPTY box steps back and clears the one before it.
await page.keyboard.press('Backspace');
check(await page.evaluate(() => window.cf.value) === '48',
  `CodeField: backspace in an empty box should clear the previous digit, value is ${await page.evaluate(() => window.cf.value)}`);

// A non-digit never lands.
await page.keyboard.type('x');
check(await page.evaluate(() => window.cf.value) === '48', 'CodeField: a letter was accepted');

// dispose() removes its listeners, so typing after it does nothing.
await page.evaluate(() => { window.cf.dispose(); });
check(await page.evaluate(() => document.getElementById('t').innerHTML) === '',
  'CodeField: dispose() left markup behind');

// ---- SegmentedControl --------------------------------------------------------
await page.evaluate(() => {
  document.getElementById('t').innerHTML = '';
  window.picked = [];
  window.seg = LDS.mountSegmentedControl(document.getElementById('t'), {
    options: ['Day', 'Week', 'Month'], defaultValue: 'Day',
    onChange: (v) => window.picked.push(v),
  });
});
check(await page.locator('#t [role="radiogroup"]').count() === 1,
  'SegmentedControl: should render a radiogroup, which is what gives it arrow keys');
// One shared name is what makes a set of radios behave as one control.
const names = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('#t input')].map((i) => i.name))]);
check(names.length === 1 && names[0], `SegmentedControl: radios must share one name, saw ${names.join(', ')}`);

await page.locator('#t .lds-seg__option').nth(1).click();
check(await page.evaluate(() => window.seg.value) === 'Week', 'SegmentedControl: clicking did not set the value');
check(await page.evaluate(() => window.picked.join()) === 'Week', 'SegmentedControl: onChange did not fire once');

// ---- Textarea ----------------------------------------------------------------
await page.evaluate(() => {
  window.ta = LDS.mountTextarea(document.getElementById('t'), { maxLength: 5, showCount: true });
});
await page.locator('#t textarea').fill('abc');
check((await page.locator('#t .lds-field__count').textContent()).trim() === '3 / 5',
  'Textarea: the counter did not follow the text');
check(!await page.locator('#t .lds-field__count').evaluate((el) => el.classList.contains('lds-field__count--over')),
  'Textarea: marked over at 3 of 5');
await page.locator('#t textarea').fill('abcde');
check(await page.locator('#t .lds-field__count').evaluate((el) => el.classList.contains('lds-field__count--over')),
  'Textarea: not marked over at the limit');
// Patched in place, not re-rendered — a re-render would lose the caret.
check(await page.evaluate(() => document.activeElement.tagName) === 'TEXTAREA',
  'Textarea: focus left the field while typing');

// ---- Toast -------------------------------------------------------------------
await page.evaluate(() => {
  document.getElementById('t').innerHTML = '';
  window.toasts = LDS.mountToasts(document.getElementById('t'), { max: 2, duration: 300 });
  window.toasts.toast('one');
  window.toasts.toast('two');
  window.toasts.toast('three');
});
// Oldest out first: the newest message is the one being waited for.
const shown = await page.evaluate(() =>
  [...document.querySelectorAll('.lds-toast')].map((n) => n.textContent.replace('Dismiss', '').trim()));
check(shown.length === 2, `Toast: max=2 should hold two, holds ${shown.length}`);
check(shown[0].includes('two') && shown[1].includes('three'),
  `Toast: expected the oldest to be dropped, kept ${shown.join(' | ')}`);

// An error is assertive and NEVER auto-dismisses.
await page.evaluate(() => {
  window.toasts.toast({ status: 'error', children: 'stays' });
});
check(await page.locator('.lds-toast[data-status="error"]').getAttribute('role') === 'alert',
  'Toast: an error should be role=alert');
check(await page.locator('.lds-toast[data-status="error"]').getAttribute('aria-live') === 'assertive',
  'Toast: an error should be aria-live=assertive');
await page.waitForTimeout(700);
check(await page.locator('.lds-toast[data-status="error"]').count() === 1,
  'Toast: the error auto-dismissed — it must stay until dismissed');
check(await page.locator('.lds-toast').count() === 1,
  'Toast: the polite messages did not auto-dismiss');

// The dismiss button works by delegation, so it works on a toast raised later.
await page.locator('.lds-toast__dismiss').click();
check(await page.locator('.lds-toast').count() === 0, 'Toast: dismiss did not remove it');
await page.evaluate(() => window.toasts.dispose());
check(await page.locator('.lds-toast-viewport').count() === 0, 'Toast: dispose() left the viewport behind');

// ---- Tooltip -----------------------------------------------------------------
await page.evaluate(() => {
  document.getElementById('t').innerHTML = '';
  window.tip = LDS.mountTooltip(document.getElementById('t'), {
    label: 'Search',
    // raw(): a slot escapes a bare string, so composing markup into one is a
    // deliberate act rather than something reached by forgetting.
    children: LDS.raw(LDS.button({ iconOnly: true, iconStart: 'search', 'aria-label': 'Search' })),
  });
});
const bubble = page.locator('#t .lds-tooltip__bubble');
check(await bubble.getAttribute('data-open') === 'false', 'Tooltip: should ship closed');
// The trigger keeps its own name and is DESCRIBED by the tooltip.
const describedBy = await page.locator('#t .lds-btn').getAttribute('aria-describedby');
check(describedBy && describedBy === await bubble.getAttribute('id'),
  'Tooltip: aria-describedby does not point at the bubble');

await page.locator('#t .lds-tooltip').hover();
check(await bubble.getAttribute('data-open') === 'true', 'Tooltip: did not open on hover');
await page.mouse.move(0, 0);
check(await bubble.getAttribute('data-open') === 'false', 'Tooltip: did not close on mouse out');

// Focus is the one that matters: for an icon-only button the tooltip IS the label.
await page.locator('#t .lds-btn').focus();
check(await bubble.getAttribute('data-open') === 'true', 'Tooltip: did not open on focus');
await page.keyboard.press('Escape');
check(await bubble.getAttribute('data-open') === 'false', 'Tooltip: Escape did not close it');

await browser.close();
server.close();

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} controller problem(s)`);
  process.exit(1);
}
console.log('dom-test: all five controllers behave — focus, selection, queueing, dismissal and disposal');

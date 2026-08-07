// Drives the gallery's interactive demos.
//
// The card contract freezes what each card renders on load, which is exactly the
// wrong thing to trust here: a demo that lost its click handler in the migration
// still renders a perfect first paint. The React versions held their state in
// hooks; the rewrites hold it in a plain variable and redraw, binding by position
// rather than by adding data-* hooks to the markup — which keeps the DOM
// comparable but means a wrong index fails silently.
//
// So each rewritten demo is clicked and its response asserted. This caught the
// Themes card, whose selector matched the wrong elements and threw on every
// click while still looking completely correct.
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

// A click that throws leaves the page looking right, so page errors are failures.
const open = async (card) => {
  const page = await browser.newPage();
  page.on('pageerror', (e) => fails.push(`${card}: ${e.message}`));
  await page.goto(`${base}/cards/${card}.html`, { waitUntil: 'networkidle' });
  return page;
};

let page;

// ---- Card: selection moves, and only one is ever pressed --------------------
page = await open('Card');
const routes = page.locator('section').nth(1).locator('.lds-card--selectable');
await routes.nth(1).click();
check(await routes.nth(1).getAttribute('aria-pressed') === 'true', 'Card: clicking did not select');
check(await routes.nth(0).getAttribute('aria-pressed') === 'false', 'Card: the previous choice stayed selected');

// ---- Tabs -------------------------------------------------------------------
page = await open('Tabs');
const tabs = page.locator('.lds-tabs').first().locator('.lds-tabs__tab');
await tabs.nth(0).click();
check((await tabs.nth(0).getAttribute('class')).includes('--active'), 'Tabs: clicking did not activate');

// ---- Row: one checkmark, on the row that was clicked ------------------------
page = await open('Row');
const single = page.locator('.sheet').nth(1);
await single.locator('.lds-row').nth(0).click();
check(await single.locator('.lds-row__check').count() === 1, 'Row: single-select shows more than one check');
check(await single.locator('.lds-row').nth(0).locator('.lds-row__check').count() === 1,
  'Row: the check did not move to the clicked row');

// ---- Modal: the stacked flow advances ---------------------------------------
page = await open('Modal');
const flow = page.locator('.frame').nth(3);
const firstStep = await flow.locator('.lds-modal__title--large').textContent();
await flow.locator('.lds-modal__actions .lds-btn--primary').click();
check(await flow.locator('.lds-modal__title--large').textContent() !== firstStep,
  'Modal: Continue did not advance the flow');
await flow.locator('.lds-modal__back').click();
check(await flow.locator('.lds-modal__title--large').textContent() === firstStep,
  'Modal: back did not pop a level');

// ---- Chip: filters select, tokens remove ------------------------------------
page = await open('Chip');
const filters = page.locator('.col').first().locator('.row').nth(3).locator('.lds-chip');
await filters.nth(0).click();
check(await filters.nth(0).getAttribute('aria-pressed') === 'true', 'Chip: the filter did not select');
const tokens = await page.locator('.tokens .lds-chip').count();
await page.locator('.tokens .lds-chip__remove').first().click();
check(await page.locator('.tokens .lds-chip').count() === tokens - 1, 'Chip: remove did not drop a token');

// ---- Themes: theme and mode are separate switches ---------------------------
page = await open('Themes');
await page.locator('button', { hasText: 'Roadtrip' }).click();
check(await page.locator('.theme-roadtrip').count() === 1, 'Themes: the theme switch did not apply');
await page.locator('button', { hasText: 'Dark' }).click();
check(await page.locator('.mode-dark').count() === 1, 'Themes: the mode switch did not apply');
// The two are independent — switching mode must not reset the theme.
check(await page.locator('.theme-roadtrip').count() === 1, 'Themes: switching mode reset the theme');

// ---- Nav: a row pushes a level, back pops it --------------------------------
page = await open('Nav');
await page.locator('.lds-nav--bar').nth(1).locator('..').locator('.lds-row--interactive').first().click();
check((await page.textContent('body')).includes('depth: 1'), 'Nav: the row did not push a level');
await page.locator('.lds-nav--bar').nth(1).locator('.lds-nav__back').click();
check((await page.textContent('body')).includes('depth: 0'), 'Nav: back did not pop a level');

// ---- SegmentedControl -------------------------------------------------------
page = await open('Segmented-control');
await page.locator('.lds-seg').first().locator('.lds-seg__option').nth(2).click();
check((await page.textContent('body')).includes('value: month'), 'SegmentedControl: the value did not update');

// ---- Toast ------------------------------------------------------------------
page = await open('Toast');
await page.locator('.raise .lds-btn').first().click();
check(await page.locator('.lds-toast-viewport .lds-toast').count() === 1, 'Toast: the button raised nothing');

// ---- TextField: reveal, and a live code field -------------------------------
page = await open('TextField');
check(await page.locator('input[type="password"]').count() === 1, 'TextField: no password input to reveal');
await page.locator('.lds-field__adorn--action').first().click();
check(await page.locator('input[type="password"]').count() === 0, 'TextField: reveal did not change the type');
check(await page.locator('.lds-field__adorn--action').first().getAttribute('aria-label') === 'Hide password',
  'TextField: the reveal button did not relabel itself');
// Three code fields sit on this card; only the one in .otp is controller-driven,
// and it has to survive the redraw the reveal button triggers.
check(await page.locator('.otp .lds-field__code input').count() === 6,
  'TextField: the controller-driven code field did not survive the redraw');

// ---- CodeField --------------------------------------------------------------
page = await open('CodeField');
check(await page.locator('.lds-field__code input').count() === 6, 'CodeField: the controller did not mount');

await browser.close();
server.close();

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} demo(s) do not respond`);
  process.exit(1);
}
console.log('card-interaction: every rewritten demo responds to a real click');

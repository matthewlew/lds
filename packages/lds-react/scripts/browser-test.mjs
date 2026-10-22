// Server-renders browser-test.app.jsx, hydrates it in Chromium, and drives it.
//
// What only a real browser shows: that the server HTML hydrates with no
// mismatch (React reports one through console.error), that handlers bound on
// stateless components work once a client component renders them, and that
// the five stateful components behave — the selection moving, the count
// following the text, focus walking the code boxes, toasts queueing and
// dismissing, a tooltip opening outside its clipping panel.
import esbuild from 'esbuild';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
// Inside the package, so the externalised packages resolve to the workspace's.
const work = await mkdtemp(join(HERE, '.tmp-'));

try {
  const common = { bundle: true, logLevel: 'warning', jsx: 'automatic', loader: { '.js': 'jsx', '.svg': 'file' } };
  await esbuild.build({
    ...common, entryPoints: [join(HERE, 'browser-test.app.jsx')], outfile: join(work, 'app.mjs'),
    format: 'esm', platform: 'node', packages: 'external',
  });
  const client = join(work, 'client.jsx');
  const { writeFileSync } = await import('node:fs');
  writeFileSync(client, `import { hydrateRoot } from 'react-dom/client';
import { App } from ${JSON.stringify(join(HERE, 'browser-test.app.jsx'))};
window.__hydrated = new Promise((resolve) => {
  hydrateRoot(document.getElementById('root'), <App />, { onRecoverableError: (e) => console.error('recoverable: ' + e.message) });
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});`);
  await esbuild.build({
    ...common, entryPoints: [client], outfile: join(work, 'client.js'), format: 'esm', platform: 'browser',
    define: { 'process.env.NODE_ENV': '"development"' },
  });

  const { App } = await import(pathToFileURL(join(work, 'app.mjs')).href);
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const html = renderToString(createElement(App));

  const cssDir = dirname(require.resolve('@lew-ds/lds/css'));
  const page = `<!doctype html><html class="mode-light"><head><meta charset="utf-8">
<link rel="stylesheet" href="/css/styles.css"></head><body><div id="root">${html}</div>
<script type="module" src="/client.js"></script></body></html>`;
  const server = createServer((req, res) => {
    const path = decodeURIComponent(req.url.split('?')[0]);
    if (path === '/') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page); return; }
    if (path === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (path === '/client.js') { res.writeHead(200, { 'content-type': 'text/javascript' }); res.end(readFileSync(join(work, 'client.js'))); return; }
    const file = join(cssDir, path.replace(/^\/css\//, ''));
    if (path.startsWith('/css/') && existsSync(file)) {
      res.writeHead(200, { 'content-type': file.endsWith('.css') ? 'text/css' : 'application/octet-stream' });
      res.end(readFileSync(file));
      return;
    }
    res.writeHead(404); res.end();
  });
  await new Promise((r) => server.listen(0, r));

  const executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const fails = [];
  const check = (ok, what) => { if (!ok) fails.push(what); };
  try {
    const tab = await browser.newPage();
    const errors = [];
    tab.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
    tab.on('pageerror', (e) => errors.push(e.message));
    tab.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await tab.goto(`http://127.0.0.1:${server.address().port}/`);
    await tab.evaluate(() => window.__hydrated);
    const state = async () => JSON.parse(await tab.locator('#state').textContent());

    // The server's HTML is the page: every slot in it before any script ran.
    check(html.includes('lds-banner__title">Heads up') && html.includes('<th scope="row">Visa</th>'),
      'server HTML is missing slot content');
    check(!html.includes('display:contents') && !html.includes('display: contents'), 'server HTML has a display:contents wrapper');
    check(await tab.locator('#open-icons-sprite symbol#warning-fill').count() === 1, 'IconSprite did not inline warning-fill');

    // Handlers on stateless components rendered from a client component.
    await tab.click('#count');
    await tab.click('.lds-banner__dismiss');
    check((await state()).clicks === 101, `Button/Banner handlers did not fire: ${JSON.stringify(await state())}`);

    // SegmentedControl: a real radiogroup.
    await tab.click('#seg .lds-seg__option:nth-child(2)');
    check((await state()).view === 'list', 'SegmentedControl: clicking an option did not select it');
    await tab.keyboard.press('ArrowLeft');
    check((await state()).view === 'grid', 'SegmentedControl: arrow keys did not move the selection');

    // Textarea: the count follows the text.
    await tab.locator('#notes textarea').fill('hello world');
    check(await tab.locator('#notes .lds-field__count').textContent() === '10 / 10', 'Textarea: count did not follow the text');

    // CodeField: typing walks focus; Backspace on an empty box walks back.
    const boxes = tab.locator('#otp input');
    await boxes.nth(0).focus();
    await tab.keyboard.type('12');
    check(await tab.evaluate(() => document.activeElement === document.querySelectorAll('#otp input')[2]),
      'CodeField: focus did not walk forward');
    check((await state()).code === '12', `CodeField: onChange saw ${(await state()).code}`);
    await tab.keyboard.press('Backspace');
    check((await state()).code === '1', 'CodeField: Backspace on an empty box did not clear the one before');

    // A controlled TextField, with its help tied to the input.
    await tab.locator('#name input').fill('Ada');
    check((await state()).name === 'Ada', 'TextField: controlled value did not update');
    const describedBy = await tab.locator('#name input').getAttribute('aria-describedby');
    check(describedBy && await tab.locator(`[id="${describedBy}"]`).textContent() === 'As on the card.',
      'TextField: help is not tied to the input');

    // Chip: removing does not also fire the token's own click.
    await tab.click('#chip .lds-chip__remove');
    await tab.click('#chip', { position: { x: 4, y: 4 } });
    check(JSON.stringify((await state()).chip) === '{"clicked":1,"removed":1}', `Chip: ${JSON.stringify((await state()).chip)}`);

    // Toasts: raised from anywhere, at most three, dismissed by their button.
    await tab.click('#raise');
    check(await tab.locator('.lds-toast').count() === 1, 'useToast(): no toast raised');
    await tab.click('.lds-toast__dismiss');
    check(await tab.locator('.lds-toast').count() === 0, 'Toast: dismiss did not remove it');
    await tab.click('#raise-many');
    check(await tab.locator('.lds-toast').count() === 3, `Toast: expected the newest 3, got ${await tab.locator('.lds-toast').count()}`);
    check(await tab.locator('.lds-toast').first().textContent() === '#2', 'Toast: the oldest were not the ones dropped');

    // Tooltip: named once, open outside its clipping panel, on focus.
    const edit = tab.locator('#clip .lds-tooltip').first();
    check(await edit.locator('.lds-btn').getAttribute('aria-describedby') === null, 'IconButton: described by its own label');
    const search = tab.locator('#search-cards');
    const bubbleId = await tab.locator('#clip .lds-tooltip').nth(1).locator('.lds-tooltip__bubble').getAttribute('id');
    check(await search.getAttribute('aria-describedby') === bubbleId, 'Tooltip: a longer label does not describe the trigger');
    await search.focus();
    const placed = await tab.evaluate(() => {
      const bubble = document.querySelectorAll('#clip .lds-tooltip__bubble')[1];
      const b = bubble.getBoundingClientRect();
      const clip = document.getElementById('clip').getBoundingClientRect();
      return { open: bubble.dataset.open, position: getComputedStyle(bubble).position, outside: b.bottom <= clip.top + 1 };
    });
    check(placed.open === 'true' && placed.position === 'fixed' && placed.outside,
      `Tooltip: did not open fixed above the clipping panel — ${JSON.stringify(placed)}`);
    await tab.keyboard.press('Escape');
    check(await tab.locator('#clip .lds-tooltip__bubble').nth(1).getAttribute('data-open') === 'false', 'Tooltip: Escape did not close it');

    for (const e of errors) fails.push(`console: ${e.slice(0, 300)}`);
  } finally {
    await browser.close();
    server.close();
  }
  // exitCode rather than exit(), so the build directory is still removed.
  if (fails.length) {
    for (const f of fails) console.error(`FAIL ${f}`);
    process.exitCode = 1;
  } else {
    console.log('browser-test: server HTML hydrates with no mismatch; handlers, selection, counts, focus, toasts and tooltips behave');
  }
} finally {
  await rm(work, { recursive: true, force: true });
}

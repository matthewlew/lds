// Loads every built card in a real browser and fails on any console error,
// page error, or failed request.
//
// The render test proves the components produce markup; this proves the docs
// site actually runs — that the IIFE bundle exposes what the cards destructure,
// that React resolved to the page's single global rather than a second copy,
// that the sprite and stylesheets are where the rewritten paths say they are,
// and that no card silently renders an empty root.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SITE = '/home/claude/repo/site';
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
  '.txt': 'text/plain',
};

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

// This sandbox ships a Chromium that does not match the revision Playwright
// would fetch, so it has to be pointed at explicitly. Anywhere else — CI, a
// laptop — Playwright resolves its own, and hardcoding a path would break it.
const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.CHROMIUM_PATH
  || (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined);
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const fails = [];
const pages = ['index.html', ...readdirSync(join(SITE, 'cards')).map((f) => `cards/${f}`)];

for (const path of pages) {
  const page = await browser.newPage();
  const problems = [];
  // The browser asks for a favicon on its own; a site that does not ship one is
  // not a broken site.
  const ignorable = (url) => url.endsWith('/favicon.ico');
  page.on('console', (m) => {
    // A resource-load error names the URL in its location, not its text.
    const from = m.location()?.url ?? '';
    if (m.type() === 'error' && !ignorable(from) && !/favicon/.test(m.text())) {
      problems.push(`console: ${m.text()}${from ? ` (${from})` : ''}`);
    }
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => { if (!ignorable(r.url())) problems.push(`request failed: ${r.url()}`); });
  page.on('response', (r) => {
    if (r.status() >= 400 && !ignorable(r.url())) problems.push(`HTTP ${r.status()}: ${r.url()}`);
  });

  await page.goto(`${base}/${path}`, { waitUntil: 'networkidle' });

  // A card that mounts nothing is a card that failed quietly.
  const rootHtml = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.innerHTML.trim().length : -1;
  });
  if (rootHtml === 0) problems.push('#root mounted but is empty');

  // Something should have been laid out. Counted as elements, not text: the
  // Skeleton card is entirely loading placeholders and legitimately has no
  // words on it at all.
  const painted = await page.evaluate(() => document.body.querySelectorAll('*').length);
  if (painted < 3) problems.push(`page rendered only ${painted} elements`);

  // Any <use> pointing at a symbol the sprite does not define draws nothing.
  const badIcons = await page.evaluate(async () => {
    const hrefs = [...document.querySelectorAll('use')]
      .map((u) => u.getAttribute('href') || u.getAttribute('xlink:href'))
      .filter(Boolean);
    const bad = [];
    const cache = new Map();
    for (const href of hrefs) {
      const [file, id] = href.split('#');
      if (!file || !id) continue;
      if (!cache.has(file)) {
        const text = await fetch(file).then((r) => r.ok ? r.text() : '').catch(() => '');
        cache.set(file, text);
      }
      if (!cache.get(file).includes(`id="${id}"`)) bad.push(href);
    }
    return [...new Set(bad)];
  });
  if (badIcons.length) problems.push(`icons not in sprite: ${badIcons.join(', ')}`);

  if (problems.length) fails.push(`${path}\n    ${problems.join('\n    ')}`);
  await page.close();
}

await browser.close();
server.close();

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} of ${pages.length} pages have problems`);
  process.exit(1);
}
console.log(`site-test: ${pages.length} pages loaded clean — no console errors, no failed requests, no missing icons`);

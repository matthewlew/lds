// Freezes what every docs card RENDERS, so the cards can be rewritten off React
// without anyone having to eyeball 29 pages.
//
// The markup contract covers components in isolation. This covers the gallery:
// each card is loaded in a real browser and its laid-out DOM is captured as a
// canonical string. Rewrite the card, capture again, diff — a demo that changed
// shape shows up as a diff instead of as a screenshot nobody compares.
//
// Attributes are SORTED and the React-only bookkeeping ones are dropped, because
// the question is whether the same DOM was produced, not whether it was produced
// in the same order. Everything else — tag names, nesting, classes, text — is
// compared exactly.
//
//   node scripts/card-contract.mjs --freeze   # write the contract
//   node scripts/card-contract.mjs            # hold the cards to it
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const OUT = join(ROOT, 'docs', 'card-contract.json');
const FREEZE = process.argv.includes('--freeze');

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

const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const executablePath = process.env.CHROMIUM_PATH
  || (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

const captured = {};
const pages = readdirSync(join(SITE, 'cards')).map((f) => `cards/${f}`).sort();

for (const path of pages) {
  const page = await browser.newPage();
  await page.goto(`${base}/${path}`, { waitUntil: 'networkidle' });
  captured[path] = await page.evaluate(() => {
    // Ids that a framework generates per render are not part of the design, and
    // freezing them would make the contract unrepeatable.
    const VOLATILE = /^(data-reactroot|data-toast-id)$/;
    const walk = (node, depth) => {
      if (node.nodeType === 3) {
        const text = node.textContent.replace(/\s+/g, ' ').trim();
        return text ? `${'  '.repeat(depth)}"${text}"` : '';
      }
      if (node.nodeType !== 1) return '';
      // Scripts are not rendered content, and which ones a card loads is exactly
      // what this migration changes. What they PRODUCE is compared; what they are
      // is not.
      if (node.tagName === 'SCRIPT') return '';
      const attrs = [...node.attributes]
        .filter((a) => !VOLATILE.test(a.name))
        // A generated id is referenced by aria-describedby/for; both sides are
        // normalised together so the LINK is checked without the value being.
        .map((a) => {
          // `style` is read back through the CSSOM rather than as written. React
          // assigned it property by property, which the browser reserialises with
          // spaces; a template writes the attribute text directly. Same computed
          // style either way — this compares what the element HAS, not the text
          // that produced it.
          if (a.name === 'style') return `style=${JSON.stringify(node.style.cssText)}`;
          const value = /^(id|for|aria-describedby|aria-labelledby|name)$/.test(a.name)
            ? a.value.replace(/(?:lds-)?(?:tooltip|seg|toast|r)[-_]?\d+|«r\w+»/g, '<generated>')
            : a.value;
          return `${a.name}=${JSON.stringify(value.replace(/\s+/g, ' ').trim())}`;
        })
        .sort()
        .join(' ');
      const open = `${'  '.repeat(depth)}<${node.tagName.toLowerCase()}${attrs ? ` ${attrs}` : ''}>`;
      const kids = [...node.childNodes].map((k) => walk(k, depth + 1)).filter(Boolean);
      return [open, ...kids].join('\n');
    };
    return walk(document.body, 0);
  });
  await page.close();
}

await browser.close();
server.close();

if (FREEZE) {
  writeFileSync(OUT, JSON.stringify({
    note: 'What each docs card renders, captured from a real browser as a canonical DOM dump. '
      + 'Frozen so the cards can be rewritten off React and checked rather than eyeballed. '
      + 'Attributes are sorted and generated ids normalised; everything else is exact.',
    cards: captured,
  }, null, 2) + '\n');
  console.log(`card-contract: froze ${pages.length} cards`);
  process.exit(0);
}

if (!existsSync(OUT)) {
  console.error('FAIL no card contract — run `node scripts/card-contract.mjs --freeze` first');
  process.exit(1);
}

const contract = JSON.parse(readFileSync(OUT, 'utf8'));

// The in-page normaliser replaced generated ids, but React's useId wraps them in
// colons (`:r0:`) and a counter-based one does not. Both sides are put through
// this before comparing, so the baseline frozen under React and a capture taken
// today describe the same thing.
const settle = (dump) => String(dump).replace(/:?<generated>:?/g, '<generated>');

const fails = [];

for (const path of pages) {
  const expected = contract.cards[path];
  if (expected === undefined) { fails.push(`${path}: no fixture — a new card, or renamed`); continue; }
  if (settle(captured[path]) !== settle(expected)) {
    // A whole-page dump is unreadable in a diff; show the first line that moved.
    const a = settle(expected).split('\n');
    const b = settle(captured[path]).split('\n');
    // findIndex returns -1 when one tree is a prefix of the other, which is a
    // real difference — the shorter one simply stopped early.
    const differs = a.findIndex((line, n) => line !== b[n]);
    const i = differs === -1 ? Math.min(a.length, b.length) : differs;
    fails.push(`${path}: line ${i + 1} of the DOM differs\n`
      + `      expected: ${a[i] ?? '(end of tree)'}\n`
      + `      actual:   ${b[i] ?? '(end of tree)'}`);
  }
}
for (const path of Object.keys(contract.cards)) {
  if (!pages.includes(path)) fails.push(`${path}: in the contract but no longer built`);
}

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} of ${pages.length} cards render differently`);
  process.exit(1);
}
console.log(`card-contract: ${pages.length} cards render exactly as frozen`);

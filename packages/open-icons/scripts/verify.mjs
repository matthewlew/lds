// Guards the two things that can silently break the sprite:
//   1. an unsubstituted `${u}` placeholder, which collapses every mask in the
//      set onto four shared ids — the defect this package was built to fix;
//   2. a duplicate id, which makes `url(#…)` resolve to whichever element the
//      parser saw first rather than the one inside the symbol being drawn.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(pkg, 'icons.svg'), 'utf8');
const names = JSON.parse(readFileSync(join(pkg, 'names.json'), 'utf8'));

const fail = [];

if (svg.includes('${u}')) fail.push('sprite contains an unsubstituted ${u} placeholder');

const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail.push(`duplicate ids: ${[...new Set(dupes)].join(', ')}`);

const symbols = [...svg.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
if (symbols.length !== names.length) {
  fail.push(`sprite has ${symbols.length} symbols but names.json lists ${names.length}`);
}
const missing = names.filter((n) => !symbols.includes(n));
if (missing.length) fail.push(`names.json lists symbols absent from the sprite: ${missing.join(', ')}`);

// Every internal reference must point at an id that exists.
const refs = [...svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
const dangling = [...new Set(refs.filter((r) => !ids.includes(r)))];
if (dangling.length) fail.push(`dangling references: ${dangling.join(', ')}`);

// buildSprite draws from src/symbols.js, a second copy of the same symbols. It
// must be the SAME copy — byte for byte what icons.svg holds — or an app's
// subset sprite and the full sprite would draw different glyphs under one name.
const { default: table } = await import('../src/symbols.js');
const { buildSprite, spriteSymbols, SPRITE_ID } = await import('../src/sprite.js');
const inSvg = Object.fromEntries([...svg.matchAll(/<symbol id="([^"]+)"[\s\S]*?<\/symbol>/g)].map((m) => [m[1], m[0]]));
const stale = names.filter((n) => table[n] !== inSvg[n]);
if (stale.length || Object.keys(table).length !== names.length) {
  fail.push(`src/symbols.js disagrees with icons.svg (${stale.slice(0, 5).join(', ')}) — run npm run build`);
}

// A subset sprite resolves on its own: every mask it references is inside it.
const subset = buildSprite(['warning-fill', 'add', 'close-circle-fill', 'add']);
const subsetIds = [...subset.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const subsetSymbols = [...subset.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
if (subsetSymbols.join() !== 'warning-fill,add,close-circle-fill') {
  fail.push(`buildSprite: expected the named symbols once each, in order — got ${subsetSymbols.join()}`);
}
if (!subsetIds.includes(SPRITE_ID)) fail.push('buildSprite: the sprite does not carry its id');
const subsetDangling = [...subset.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]).filter((r) => !subsetIds.includes(r));
if (subsetDangling.length) fail.push(`buildSprite: dangling references ${subsetDangling.join(', ')}`);
// display:none (or a zero size) would disable exactly the masks it exists for.
if (/display:\s*none|visibility:\s*hidden/.test(subset)) fail.push('buildSprite: the sprite is hidden in a way that disables masks');
try {
  spriteSymbols(['add', 'not-a-glyph']);
  fail.push('spriteSymbols: an unknown name did not throw');
} catch (err) {
  if (!/not-a-glyph/.test(err.message)) fail.push(`spriteSymbols: the error does not name the unknown glyph — ${err.message}`);
}

if (fail.length) {
  for (const f of fail) console.error(`verify: ${f}`);
  process.exit(1);
}
console.log(`verify: ${symbols.length} symbols, ${ids.length} ids, ${refs.length} references, all resolvable; `
  + 'buildSprite subsets match the sprite and resolve on their own');

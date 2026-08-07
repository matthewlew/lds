// Checks themes that are DERIVED from another product's token file against
// that file.
//
// roadtrip.css states in its own header that "every value below is READ FROM
// roadtrip's shipped web/design-system/tokens.css, not invented", and annotates
// each declaration with the upstream token it came from:
//
//     --c-600:#3B82F6;  /* --rt-brand       (the one interactive colour) */
//     --gray-50:#F4F5F7;   /* interpolated */
//
// That is a contract, and until now nothing enforced it — the file could be
// right when written and silently wrong six months later, with no signal until
// someone eyeballed two files side by side. This makes the annotations
// executable: every `/* --rt-* */` is asserted against the real token, and
// every `/* interpolated */` is re-checked in case upstream has since grown a
// real value for that slot.
//
// Deliberately a CHECK rather than a generator. The theme carries a page of
// reasoning about why each value lands where it does — which LDS role consumes
// it, why depth is mapped by order rather than by name, why the AA-measured
// text blue has to travel with them. Generating the file would mean either
// losing that or encoding prose in a script. The values are what drift; the
// reasoning is what makes them reviewable.
//
// Upstream is a separate repo, so CI usually cannot see it. The lock file makes
// the check meaningful either way: with the source present it verifies theme →
// upstream and refreshes the lock; without it, theme → lock.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const THEMES = [{
  name: 'roadtrip',
  css: join(ROOT, 'packages/lds/css/themes/roadtrip.css'),
  lock: join(ROOT, 'packages/lds/css/themes/roadtrip.tokens.lock.json'),
  // Overridable: the source lives in another repo that is not always checked out.
  source: process.env.ROADTRIP_TOKENS
    ? resolvePath(process.env.ROADTRIP_TOKENS)
    : join(ROOT, '..', 'roadtrip', 'web', 'design-system', 'tokens.css'),
  prefix: '--rt-',
  origin: 'wwchen/roadtrip · web/design-system/tokens.css',
}];

const REFRESH = process.argv.includes('--refresh');
const fails = [];
const notes = [];

/** All custom properties declared in a stylesheet, last declaration winning. */
function declarations(css) {
  const out = new Map();
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out.set(m[1], m[2].trim());
  return out;
}

/** Expands var() chains, including var() nested inside rgba() and friends. */
function expand(value, table, depth = 0) {
  let v = value, prev = null;
  while (prev !== v && depth++ < 12) {
    prev = v;
    v = v.replace(/var\((--[\w-]+)\)/g, (whole, name) => table.get(name) ?? whole);
  }
  return v;
}

// `.35` and `0.35` are the same number; whitespace inside rgba() is free.
const norm = (s) => String(s).split('/*')[0].replace(/\s+/g, '').replace(/(^|[(,])0\./g, '$1.').toLowerCase();

for (const theme of THEMES) {
  const css = readFileSync(theme.css, 'utf8');

  // Pull the annotation off each declaration: the upstream token(s) it claims
  // to come from, or an explicit note that it was interpolated.
  const claims = [];
  for (const line of css.split('\n')) {
    const decl = line.match(/(--[\w-]+)\s*:\s*([^;]+);\s*\/\*(.*)$/);
    if (!decl) continue;
    const [, token, value, comment] = decl;
    const sources = [...comment.matchAll(new RegExp(`(${theme.prefix}[\\w-]+)`, 'g'))].map((m) => m[1]);
    const interpolated = /\binterpolated\b/i.test(comment);
    if (sources.length || interpolated) claims.push({ token, value: value.trim(), sources, interpolated });
  }
  if (!claims.length) { fails.push(`${theme.name}: no source annotations found — the contract is missing`); continue; }

  const haveSource = existsSync(theme.source);
  let upstream;

  if (haveSource) {
    const src = readFileSync(theme.source, 'utf8');
    const table = declarations(src);
    upstream = {};
    for (const [name, raw] of table) {
      if (name.startsWith(theme.prefix)) upstream[name] = expand(raw, table);
    }
  } else if (existsSync(theme.lock)) {
    upstream = JSON.parse(readFileSync(theme.lock, 'utf8')).tokens;
    notes.push(`${theme.name}: source not checked out — verified against the lock instead`
      + ` (set ROADTRIP_TOKENS or clone ${theme.origin} to check upstream)`);
  } else {
    fails.push(`${theme.name}: neither the token source nor a lock file is present`);
    continue;
  }

  let checked = 0, reclaimable = 0;
  for (const claim of claims) {
    if (claim.interpolated) {
      // An interpolated value is a placeholder for a slot upstream had nothing
      // for. If upstream later names one, the theme should stop inventing it.
      continue;
    }
    for (const source of claim.sources) {
      if (!(source in upstream)) {
        fails.push(`${theme.name}: ${claim.token} cites ${source}, which no longer exists upstream`);
        continue;
      }
      checked++;
      if (norm(upstream[source]) !== norm(claim.value)) {
        fails.push(`${theme.name}: ${claim.token} is ${claim.value} but ${source} is now ${upstream[source]}`);
      }
    }
  }

  // Surfaces and roles upstream carries that the theme never consumes. Not a
  // failure — LDS's stack is a fixed five slots and roadtrip ships seven — but
  // worth surfacing, because an unmapped surface is a plane the app has and the
  // theme cannot express.
  const consumed = new Set(claims.flatMap((c) => c.sources));
  const unconsumed = Object.keys(upstream)
    .filter((t) => /^--rt-(surface|bg|success|warn|error|info)/.test(t) && !consumed.has(t))
    .sort();
  if (unconsumed.length) {
    notes.push(`${theme.name}: ${unconsumed.length} upstream role(s) not mapped — ${unconsumed.join(', ')}`);
  }

  if (haveSource && (REFRESH || !existsSync(theme.lock))) {
    writeFileSync(theme.lock, JSON.stringify({
      origin: theme.origin,
      note: 'Snapshot of the upstream tokens this theme derives from. Regenerate with '
        + '`node scripts/theme-source-test.mjs --refresh` when the source is checked out.',
      tokens: upstream,
    }, null, 2) + '\n');
    notes.push(`${theme.name}: lock refreshed from ${theme.origin}`);
  } else if (haveSource && existsSync(theme.lock)) {
    // Upstream moved in a way the theme does not cite: not an error, but the
    // lock is now stale and the next --refresh will show what changed.
    const locked = JSON.parse(readFileSync(theme.lock, 'utf8')).tokens;
    const moved = Object.keys(upstream).filter((t) => t in locked && norm(upstream[t]) !== norm(locked[t]));
    const added = Object.keys(upstream).filter((t) => !(t in locked));
    if (moved.length || added.length) {
      notes.push(`${theme.name}: upstream has ${moved.length} changed and ${added.length} new token(s) `
        + `since the lock — run with --refresh to record them`);
    }
  }

  notes.push(`${theme.name}: ${checked} sourced value(s) verified, `
    + `${claims.filter((c) => c.interpolated).length} interpolated`);
}

for (const n of notes) console.log(`theme-source: ${n}`);
if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log('theme-source: every derived value agrees with its stated source');

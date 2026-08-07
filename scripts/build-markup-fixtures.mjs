// Freezes the markup contract.
//
// Run while the React binding still exists. It renders every case through React
// — the implementation that has been rendering, typechecked and browser-tested
// throughout — and writes the result to a fixture file.
//
// This is what makes deleting React safe. React is currently the only thing
// verifying the templates; take it away with nothing in its place and the
// templates become unverifiable markup that merely looks right. The fixtures
// outlive it: they are the same guarantee, minus the dependency.
//
//   node scripts/build-markup-fixtures.mjs        # write the contract
//   node scripts/markup-contract-test.mjs         # hold the templates to it
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as LDS from '@lew/lds';
import { setIconSprite, getIconSprite } from '@lew/lds';
import { CASES } from './component-cases.mjs';
import { normalizeMarkup, assertQuotesEscaped } from './normalize-markup.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'lds', 'markup-contract.json');

// The sprite URL is absolute and machine-specific, which would bake this
// machine's paths into the contract. Pin it to a stable placeholder; both
// bindings resolve it the same way at runtime.
const previous = getIconSprite();
setIconSprite('icons.svg');

const fixtures = {};
const problems = [];

for (const [component, label, props] of CASES) {
  const Component = LDS[component];
  if (!Component) { problems.push(`${component}: not exported`); continue; }
  try {
    const html = renderToStaticMarkup(React.createElement(Component, props));
    // The normaliser rewrites ` name="` sequences; that is only sound while every
    // quote in text is escaped. Check per case rather than trusting it.
    if (!assertQuotesEscaped(html)) {
      problems.push(`${component}/${label}: unescaped quote in output — normalisation would be unsafe`);
      continue;
    }
    fixtures[`${component}/${label}`] = normalizeMarkup(html);
  } catch (err) {
    problems.push(`${component}/${label}: ${err.message}`);
  }
}

setIconSprite(previous);

if (problems.length) {
  for (const p of problems) console.error(`FAIL ${p}`);
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify({
  note: 'The markup every LDS binding must emit. Generated from the React implementation by '
    + 'scripts/build-markup-fixtures.mjs and frozen so the contract survives that binding being removed. '
    + 'Sprite URLs are pinned to the relative default; both bindings resolve the real one at runtime.',
  sprite: 'icons.svg',
  cases: fixtures,
}, null, 2) + '\n');

const components = new Set(CASES.map((c) => c[0]));
console.log(`markup-contract: froze ${Object.keys(fixtures).length} cases across ${components.size} components`);

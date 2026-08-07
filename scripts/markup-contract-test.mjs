// Holds every binding to the frozen markup contract.
//
// This replaces the React-vs-template parity check with something that does not
// need React to exist. The fixtures were generated from the React
// implementation while it was still here; from now on they are the spec, and
// any binding — the templates today, anything added later — is diffed against
// them.
//
// Cases with no template yet are reported as pending rather than passing
// silently, so a half-finished migration cannot read as a complete one.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as templates from '@lew/lds/templates';
import { setIconSprite, getIconSprite } from '@lew/lds';
import { CASES } from './component-cases.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const contract = JSON.parse(readFileSync(join(ROOT, 'packages/lds/markup-contract.json'), 'utf8'));

// The contract was frozen against the relative sprite default.
const previous = getIconSprite();
setIconSprite(contract.sprite);

const fails = [];
const pending = new Set();
let checked = 0;

// Templates are named for their component, lower-camel: Banner → banner.
const templateFor = (component) => templates[component[0].toLowerCase() + component.slice(1)];

for (const [component, label, props] of CASES) {
  const key = `${component}/${label}`;
  const expected = contract.cases[key];
  if (expected === undefined) { fails.push(`${key}: no fixture — regenerate the contract`); continue; }

  const template = templateFor(component);
  if (typeof template !== 'function') { pending.add(component); continue; }

  let actual;
  try {
    actual = template(props);
  } catch (err) {
    fails.push(`${key}: template threw — ${err.message}`);
    continue;
  }
  checked++;
  if (actual !== expected) {
    fails.push(`${key}\n      expected: ${expected}\n      actual:   ${actual}`);
  }
}

setIconSprite(previous);

if (pending.size) {
  console.log(`markup-contract: ${pending.size} component(s) have no template yet — ${[...pending].sort().join(', ')}`);
}
if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  console.error(`\n${fails.length} case(s) diverged from the contract`);
  process.exit(1);
}
console.log(`markup-contract: ${checked} of ${CASES.length} cases match the frozen markup exactly`);

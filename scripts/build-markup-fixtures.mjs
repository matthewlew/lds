// Re-freezes the markup contract.
//
// The contract was ORIGINALLY generated from the React binding — the
// implementation that had been rendering, typechecked and browser-tested
// throughout — and that is what made deleting React safe: the fixtures outlived
// it and became the spec.
//
// React is gone, so this now renders from the templates themselves. That makes
// it a snapshot-accept command, not a verification: running it will always make
// the test pass. Run it only when markup has DELIBERATELY changed, and read the
// resulting diff — it is the record of what changed about the system's HTML.
//
//   node scripts/build-markup-fixtures.mjs        # accept the current markup
//   node scripts/markup-contract-test.mjs         # hold the templates to it
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as templates from '@lew/lds/templates';
import { setIconSprite, getIconSprite } from '@lew/lds';
import { CASES } from './component-cases.mjs';
import { normalizeMarkup, assertQuotesEscaped } from './normalize-markup.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'lds', 'markup-contract.json');

// The sprite default is machine-specific, which would bake this machine's paths
// into the contract. Pin it; both ends resolve the real one at runtime.
const previous = getIconSprite();
setIconSprite('icons.svg');

const templateFor = (component) => templates[component[0].toLowerCase() + component.slice(1)];

const fixtures = {};
const problems = [];

for (const [component, label, props] of CASES) {
  const template = templateFor(component);
  if (typeof template !== 'function') { problems.push(`${component}: no template`); continue; }
  try {
    const html = template(props);
    if (!assertQuotesEscaped(html)) {
      problems.push(`${component}/${label}: unescaped quote in output`);
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
  note: 'The markup every LDS binding must emit. First generated from the React implementation '
    + 'and frozen so the contract would survive that binding being removed; now regenerated from '
    + 'the templates by scripts/build-markup-fixtures.mjs. Regenerating always passes the test — '
    + 'do it only when markup has deliberately changed, and review the diff. '
    + 'Sprite URLs are pinned to a relative default; bindings resolve the real one at runtime.',
  sprite: 'icons.svg',
  cases: fixtures,
}, null, 2) + '\n');

const components = new Set(CASES.map((c) => c[0]));
console.log(`markup-contract: ${Object.keys(fixtures).length} cases across ${components.size} components`);

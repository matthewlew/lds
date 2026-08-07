// One-shot migration: the design export's React cards become vanilla sources.
//
// Run once, by hand. It is kept in the repo because the conversion it performed
// is the kind of thing someone will want to read the rules of later, not because
// it is part of any build.
//
// `project/` is left untouched — it stays the frozen design export, and the
// historical reference. The gallery is rebuilt from `docs/cards/`, which after
// this contains real, hand-maintainable HTML with no framework in it.
//
// The mechanical part is safe to automate:
//   React.createElement(X, …)          ->  h(X, …)
//   Component names                    ->  their lower-camel template
//   ReactDOM.createRoot(…).render(…)   ->  mount(…)
//   the unpkg script tags              ->  nothing
//
// The part that is NOT automated is any card using hooks. Those hold state, and
// state is a controller's job — the migration marks them and they are finished
// by hand. `scripts/card-contract.mjs` then proves every card still renders the
// DOM it rendered under React.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = join(ROOT, 'project');
const OUT = join(ROOT, 'docs', 'cards');
const NAMESPACE = 'LDSLewDesignSystem_1b8684';

mkdirSync(OUT, { recursive: true });

/** Component → template. Every export is lower-camel of the component name. */
const templateName = (component) => component[0].toLowerCase() + component.slice(1);

const stateful = [];

function convert(input) {
  let src = input;

  // --- head: drop the CDN runtime, point at the built package ----------------
  src = src.replace(/<script src="(?:\.\.\/)*_ds_bundle\.js"><\/script>\s*/g, '');
  src = src.replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>\s*/g, '');
  src = src.replace(/<script src="https:\/\/unpkg\.com\/react@[^>]*><\/script>\s*/g, '');
  src = src.replace(
    /<script src="https:\/\/unpkg\.com\/react-dom@[^>]*><\/script>\s*/g,
    '<script src="../assets/lds.js"></script>\n<script>LDS.setIconSprite("../assets/icons.svg");</script>\n',
  );
  src = src.replace(/<script type="text\/babel">/g, '<script>');

  // --- assets ----------------------------------------------------------------
  // Cards sat at two depths in the export, and the foundation pages sat at the
  // root with no prefix at all. The lookbehind keeps this idempotent: a path that
  // already points into assets/ is left alone rather than prefixed twice.
  src = src.replace(/(?<!assets\/)(?:\.\.\/)*styles\.css/g, '../assets/styles.css');
  src = src.replace(/(?<!assets\/)(?:\.\.\/)*themes\//g, '../assets/themes/');
  src = src.replace(/(?<!assets\/)(?:\.\.\/)*icons\.svg/g, '../assets/icons.svg');

  // --- the destructure -------------------------------------------------------
  // `const { Banner, Button } = window.NS;` names every component the card uses,
  // which is also the list of identifiers to rename below. Some cards destructure
  // more than once; every occurrence is collected and only the first is kept, so
  // the helpers are declared exactly once.
  const used = [];
  let first = true;
  src = src.replace(
    new RegExp(`const\\s*\\{([^}]*)\\}\\s*=\\s*window\\.(?:${NAMESPACE}|LDS)\\s*;\\n?`, 'g'),
    (_, names) => {
      used.push(...names.split(',').map((n) => n.trim()).filter(Boolean));
      if (!first) return '';
      first = false;
      return '@@DESTRUCTURE@@\n';
    },
  );
  src = src.replace('@@DESTRUCTURE@@',
    `const { ${[...new Set(used.map(templateName)), 'h', 'mount', 'raw'].join(', ')} } = LDS;`);

  // --- the calls -------------------------------------------------------------
  // Several cards aliased the factory. The alias collides with the h() the
  // package now exports, so it goes; the call sites are rewritten either way.
  src = src.replace(/^\s*const h = React\.createElement;\n/m, '');
  src = src.replace(/React\.createElement\(/g, 'h(');
  // Rename the components ONLY in call position — immediately after `h(`.
  // A looser rule rewrites the word inside prose: the Link card's own copy says
  // "This is Button with an href", and that sentence is about the component, not
  // a reference to it.
  for (const component of new Set(used)) {
    src = src.replace(new RegExp(`h\\(\\s*${component}\\b`, 'g'), `h(${templateName(component)}`);
  }
  // The TextField card reached for its dial-code data by importing a source file
  // that only resolved inside the design tool's tree. That data is a published
  // export now, so it comes off the package instead.
  src = src.replace(
    /<script type="module">\s*const m = await import\('\.\/dial-codes\.js'\);\s*window\.dialOptions = m\.dialOptions; window\.DIAL_CODES = m\.DIAL_CODES;\s*window\.dispatchEvent\(new Event\('dial-ready'\)\);\s*<\/script>/,
    '<script>\n  window.dialOptions = LDS.dialOptions; window.DIAL_CODES = LDS.DIAL_CODES;\n'
    + "  window.dispatchEvent(new Event('dial-ready'));\n</script>",
  );

  // The render target is a call of its own — `document.getElementById('root')` —
  // so the pattern has to cross parentheses rather than stop at the first one.
  src = src.replace(
    /ReactDOM\.createRoot\(([\s\S]*?)\)\.render\(([\s\S]*)\);/,
    (_, target, tree) => `mount(${target}, ${tree.trim()});`,
  );
  return src;
}

/** Flags a card whose demo held state, which no rewrite of the calls can fix. */
function markStateful(src, name) {
  if (!/React\.use[A-Z]|\buseState\b|\buseEffect\b|\buseRef\b/.test(src)) return src;
  stateful.push(name);
  return src.replace('<script>\n', '<script>\n'
    + '// TODO(migration): this demo held state in React hooks. Rewrite it against\n'
    + '// the controllers — see packages/lds/src/controllers/.\n');
}

const migrated = [];

// ---- the design export ------------------------------------------------------
const manifest = JSON.parse(readFileSync(join(PROJECT, '_ds_manifest.json'), 'utf8'));
for (const card of manifest.cards) {
  const from = join(PROJECT, card.path);
  if (!existsSync(from)) { console.warn(`skip: ${card.path} not found`); continue; }
  const name = card.name || basename(card.path, '.html');
  let src = convert(readFileSync(from, 'utf8').replace(/^<!-- @dsCard[^>]*-->\n/, ''));
  src = markStateful(src, name);
  // Metadata rides in a comment now that the manifest no longer owns these cards.
  const meta = `<!-- @dsCard group="${card.group}" viewport="${card.viewport}" `
    + `name="${name}" subtitle="${card.subtitle ?? ''}" -->\n`;
  writeFileSync(join(OUT, `${name.replace(/[^\w-]+/g, '-')}.html`), meta + src);
  migrated.push(name);
}

// ---- cards for components added after the export ----------------------------
// Written the same way, so converted by the same rules.
for (const file of readdirSync(OUT).filter((f) => f.endsWith('.html'))) {
  const path = join(OUT, file);
  const before = readFileSync(path, 'utf8');
  if (!before.includes('React.createElement')) continue;
  const meta = before.match(/^<!-- @dsCard[^>]*-->\n/)?.[0] ?? '';
  const name = meta.match(/name="([^"]*)"/)?.[1] ?? basename(file, '.html');
  writeFileSync(path, meta + markStateful(convert(before.slice(meta.length)), name));
  migrated.push(name);
}

console.log(`migrate-cards: ${migrated.length} cards → docs/cards/`);
if (stateful.length) {
  console.log(`migrate-cards: ${stateful.length} need finishing by hand — ${stateful.join(', ')}`);
}

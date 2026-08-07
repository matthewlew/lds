// Regenerates the design-system adherence lint config from the package itself.
//
// The version that shipped in the design export was a snapshot: 24 components,
// import paths rooted at `components/**`, and a token list frozen at whatever
// the CSS held that day. All three go stale the moment the system moves — which
// is the argument for deriving it rather than maintaining it. Component names
// come from the source tree, prop names and their allowed values from the
// published .d.ts, and the token registry from the CSS.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The repo root, derived from this file's own location rather than named
// outright. It was an absolute path into the sandbox that generated these
// scripts (/home/claude/repo), which resolves nowhere else — CI failed at the
// first readdirSync on a clean checkout.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'packages/lds/src/components');
const CSS = join(ROOT, 'packages/lds/css');
const OUT = join(ROOT, 'packages/lds/adherence.oxlintrc.json');

// ---- components and their prop surface, read from the .d.ts ----------------
const ALWAYS_OK = ['className', 'key', 'ref', 'style', 'children'];
const components = {};
const restrictions = [];

for (const name of readdirSync(SRC).sort()) {
  const dts = join(SRC, name, `${name}.d.ts`);
  if (!existsSync(dts)) continue;
  const src = readFileSync(dts, 'utf8');

  // The props interface for the component itself, not its sibling types.
  const iface = src.match(new RegExp(`export interface ${name}Props \\{([\\s\\S]*?)\\n\\}`));
  if (!iface) { components[name] = { replaces: [] }; continue; }
  const body = iface[1];

  const props = [...body.matchAll(/^\s{2}(\w+)\??\s*:/gm)].map((m) => m[1]);
  if (!props.length) { components[name] = { replaces: [] }; continue; }
  components[name] = { replaces: [] };

  const allowed = [...new Set([...props, ...ALWAYS_OK])];
  restrictions.push({
    selector: `JSXOpeningElement[name.name='${name}'] > JSXAttribute > JSXIdentifier[name!=/^(?:${allowed.join('|')})$/]`,
    message: `<${name}> doesn't accept that prop. Declared props: ${props.join(', ')}.`,
  });

  // A prop typed as a union of string literals can only hold those literals.
  for (const m of body.matchAll(/^\s{2}(\w+)\??\s*:\s*((?:'[\w-]+'\s*\|\s*)+'[\w-]+')\s*;/gm)) {
    const [, prop, union] = m;
    const values = [...union.matchAll(/'([\w-]+)'/g)].map((v) => v[1]);
    if (values.length < 2) continue;
    restrictions.push({
      selector: `JSXOpeningElement[name.name='${name}'] > JSXAttribute[name.name='${prop}'] > Literal[value!=/^(?:${values.join('|')})$/]`,
      message: `<${name}> ${prop} must be one of ${values.map((v) => `'${v}'`).join(' | ')}.`,
    });
  }
}

// ---- token registry, read from the CSS -------------------------------------
const css = ['apca-palette.css', 'lds.css', 'themes/palette.css', 'themes/product.css', 'themes/roadtrip.css']
  .map((f) => readFileSync(join(CSS, f), 'utf8')).join('\n');

const tokenKinds = {};
for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
  const [, token, rawValue] = m;
  const value = rawValue.trim();
  // An explicit `/* @kind x */` annotation in the CSS wins over inference.
  const annotated = rawValue.match(/@kind\s+(\w+)/);
  if (annotated) { tokenKinds[token] = annotated[1]; continue; }
  if (tokenKinds[token]) continue;

  let kind = 'other';
  if (/^(--th-|--weight-|--text-|--leading-|--tracking-|--size-|--font)/.test(token)) kind = 'font';
  else if (/radius/.test(token)) kind = 'radius';
  else if (/^#|oklch|rgb|hsl|color-mix/i.test(value) || /(-\d{2,3}$|color|shadow|--c-|surface|border|background|--text$|--icon$)/.test(token)) kind = 'color';
  else if (/^-?[\d.]+(px|rem|em)$/.test(value) || /^(--space-|--control|--gap|--bp-|--icon-size|--target)/.test(token)) kind = 'spacing';
  tokenKinds[token] = kind;
}
const tokens = Object.keys(tokenKinds).sort();

const fontFamilies = [...new Set([...css.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]([^'"]+)['"]/g)]
  .map((m) => m[1]))].sort();

// ---- the config ------------------------------------------------------------
const config = {
  plugins: ['react', 'import'],
  rules: {
    'react/forbid-elements': ['warn', { forbid: [] }],
    'no-restricted-imports': ['warn', {
      patterns: [{
        group: Object.keys(components).map((c) => `@lew/lds/src/components/${c}/**`)
          .concat(Object.keys(components).map((c) => `**/components/${c}/**`)),
        message: "Import design-system components from '@lew/lds', not component internals.",
      }],
    }],
    'no-restricted-syntax': ['warn',
      {
        selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b/]',
        message: 'Raw hex color — use a design-system color token via var().',
      },
      {
        selector: 'Literal[value=/\\b\\d+px\\b/]',
        message: 'Raw px value — use a design-system spacing token via var().',
      },
      {
        selector: `Literal[value=/font-family\\s*:\\s*(?!['"]?(?:${fontFamilies.join('|')}))/i]`,
        message: `Font not provided by the design system. Available: ${fontFamilies.join(', ')}.`,
      },
      ...restrictions,
    ],
  },
  overrides: [{ files: ['**/index.js'], rules: { 'no-restricted-imports': 'off' } }],
  'x-omelette': { components, tokens, tokenKinds, fontFamilies },
};

writeFileSync(OUT, JSON.stringify(config, null, 2) + '\n');
console.log(`adherence: ${Object.keys(components).length} components, ${restrictions.length} prop rules, `
  + `${tokens.length} tokens, fonts: ${fontFamilies.join(', ')}`);

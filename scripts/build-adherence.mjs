// Regenerates the design-system adherence lint config from the package itself.
//
// The version that shipped in the design export was a snapshot: 24 components,
// import paths rooted at `components/**`, and a token list frozen at whatever
// the CSS held that day. All three go stale the moment the system moves — which
// is the argument for deriving it rather than maintaining it. Component and prop
// names come from the published .d.ts; the token registry comes from the CSS.
//
// The rules target CALL EXPRESSIONS rather than JSX. A component is a function
// taking one options object, so a misspelled prop is a stray key in an object
// literal — `banner({ titel: 'x' })` — not an unknown JSX attribute.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/claude/repo';
const DTS = join(ROOT, 'packages/lds/src/templates/index.d.ts');
const CSS = join(ROOT, 'packages/lds/css');
const OUT = join(ROOT, 'packages/lds/adherence.oxlintrc.json');

// ---- components and their prop surface, read from the .d.ts ----------------
// `className` and `style` land on every root element via the attribute
// passthrough, and `children` is the default slot, so they are always allowed.
const ALWAYS_OK = ['className', 'style', 'children', 'id'];
const components = {};
const restrictions = [];

const dts = readFileSync(DTS, 'utf8');

// Every exported component is `declare function name(props?: NameProps)`.
for (const m of dts.matchAll(/export declare function (\w+)\(props\?: (\w+)\)/g)) {
  const [, name, propsType] = m;

  const iface = dts.match(new RegExp(`export interface ${propsType}[^{]*\\{([\\s\\S]*?)\\n\\}`));
  if (!iface) { components[name] = { replaces: [] }; continue; }
  const body = iface[1];

  const props = [...body.matchAll(/^\s{2}(\w+)\??\s*:/gm)].map((p) => p[1]);
  components[name] = { replaces: [] };
  if (!props.length) continue;

  const allowed = [...new Set([...props, ...ALWAYS_OK])];
  restrictions.push({
    // A key in the options object that no prop declares. data-* and aria-* are
    // quoted keys and are not Identifiers, so the passthrough still works.
    selector: `CallExpression[callee.name='${name}'] > ObjectExpression > Property > Identifier[name!=/^(?:${allowed.join('|')})$/]`,
    message: `${name}() doesn't accept that prop. Declared props: ${props.join(', ')}.`,
  });

  // A prop typed as a union of string literals can only hold those literals.
  for (const u of body.matchAll(/^\s{2}(\w+)\??\s*:\s*((?:'[\w-]+'\s*\|\s*)+'[\w-]+')\s*;/gm)) {
    const [, prop, union] = u;
    const values = [...union.matchAll(/'([\w-]+)'/g)].map((v) => v[1]);
    if (values.length < 2) continue;
    restrictions.push({
      selector: `CallExpression[callee.name='${name}'] > ObjectExpression > Property[key.name='${prop}'] > Literal[value!=/^(?:${values.join('|')})$/]`,
      message: `${name}() ${prop} must be one of ${values.map((v) => `'${v}'`).join(' | ')}.`,
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
  plugins: ['import'],
  rules: {
    'no-restricted-imports': ['warn', {
      patterns: [{
        group: ['@lew/lds/src/**', '**/lds/src/templates/*', '**/lds/src/controllers/*'],
        message: "Import from '@lew/lds', '@lew/lds/templates' or '@lew/lds/controllers', not package internals.",
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

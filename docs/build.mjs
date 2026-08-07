// Builds the static docs gallery.
//
// The exported cards were written against the design tool's runtime: React,
// ReactDOM and Babel from unpkg, and a generated `_ds_bundle.js` exposing a
// hashed global. None of that survives contact with a real repo — the CDN is a
// network dependency, the integrity hashes pin a version the package no longer
// controls, and Babel was compiling markup that turns out to contain no JSX at
// all. So the card BODIES are kept verbatim and only their plumbing is
// rewritten: local React, the real built package, and a stable `LDS` global.
//
// Cards are read from two places and never copied between them:
//   project/            the frozen design export — the pixel reference
//   docs/cards/         cards for components added since that export
import esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const PROJECT = join(ROOT, 'project');
const SITE = join(ROOT, 'site');
const ASSETS = join(SITE, 'assets');
const CARDS_OUT = join(SITE, 'cards');
const EXTRA_CARDS = join(HERE, 'cards');

const NAMESPACE = 'LDSLewDesignSystem_1b8684';

rmSync(SITE, { recursive: true, force: true });
mkdirSync(ASSETS, { recursive: true });
mkdirSync(CARDS_OUT, { recursive: true });

// ---- assets -----------------------------------------------------------------
// The fonts live inside css/ so that lds.css's `url('fonts/…')` resolves the
// same way here as it does inside the published tarball. Copying the directory
// whole is what keeps those two in step.
cpSync(join(ROOT, 'packages/lds/css'), ASSETS, { recursive: true });
cpSync(join(ROOT, 'packages/open-icons/icons.svg'), join(ASSETS, 'icons.svg'));
cpSync(join(ROOT, 'node_modules/react/umd/react.development.js'), join(ASSETS, 'react.js'));
cpSync(join(ROOT, 'node_modules/react-dom/umd/react-dom.development.js'), join(ASSETS, 'react-dom.js'));

await esbuild.build({
  entryPoints: [join(ROOT, 'packages/lds/src/index.js')],
  bundle: true,
  format: 'iife',
  globalName: 'LDS',
  outfile: join(ASSETS, 'lds.js'),
  alias: { react: join(HERE, 'react-global.js') },
  logLevel: 'warning',
});

// ---- cards ------------------------------------------------------------------
const manifest = JSON.parse(readFileSync(join(PROJECT, '_ds_manifest.json'), 'utf8'));

// Components that postdate the design export bring their own cards.
const extra = existsSync(EXTRA_CARDS)
  ? readdirSync(EXTRA_CARDS).filter((f) => f.endsWith('.html')).map((f) => {
    const src = readFileSync(join(EXTRA_CARDS, f), 'utf8');
    const meta = src.match(/@dsCard\s+group="([^"]*)"\s+viewport="([^"]*)"\s+name="([^"]*)"\s+subtitle="([^"]*)"/);
    return {
      path: join(EXTRA_CARDS, f),
      absolute: true,
      group: meta?.[1] ?? 'Components',
      viewport: meta?.[2] ?? '900x600',
      name: meta?.[3] ?? basename(f, '.html'),
      subtitle: meta?.[4] ?? '',
    };
  })
  : [];

const cards = [...manifest.cards, ...extra];

/** Rewrites a card's plumbing without touching the demo it contains. */
function rewrite(html) {
  let out = html;

  // Stylesheets and the sprite, wherever the card sat in the source tree.
  out = out.replace(/(?:\.\.\/)*styles\.css/g, '../assets/styles.css');
  out = out.replace(/(?:\.\.\/)*themes\//g, '../assets/themes/');
  out = out.replace(/(?:\.\.\/)*icons\.svg/g, '../assets/icons.svg');

  // The generated bundle becomes the real package.
  out = out.replace(/<script src="(?:\.\.\/)*_ds_bundle\.js"><\/script>/g, '');

  // Babel compiled markup that contains no JSX; the CDN tags go entirely.
  out = out.replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>\s*/g, '');
  out = out.replace(
    /<script src="https:\/\/unpkg\.com\/react@[^>]*><\/script>\s*/g,
    '<script src="../assets/react.js"></script>\n',
  );
  out = out.replace(
    /<script src="https:\/\/unpkg\.com\/react-dom@[^>]*><\/script>\s*/g,
    '<script src="../assets/react-dom.js"></script>\n<script src="../assets/lds.js"></script>\n',
  );
  out = out.replace(/<script type="text\/babel">/g, '<script>');

  // A hashed global is an artefact of the design tool, not an API.
  out = out.replace(new RegExp(`window\\.${NAMESPACE}`, 'g'), 'window.LDS');

  // The TextField card reached for the dial-code data by dynamically importing
  // a source file next to it, which only resolved inside the design tool's
  // tree. The data is a published export now, so it comes off the bundle. The
  // card already guards on `window.dialOptions` before falling back to the
  // event, so running synchronously ahead of the demo is safe.
  out = out.replace(
    /<script type="module">\s*const m = await import\('\.\/dial-codes\.js'\);\s*window\.dialOptions = m\.dialOptions; window\.DIAL_CODES = m\.DIAL_CODES;\s*window\.dispatchEvent\(new Event\('dial-ready'\)\);\s*<\/script>/,
    '<script>\n  window.dialOptions = LDS.dialOptions; window.DIAL_CODES = LDS.DIAL_CODES;\n'
    + "  window.dispatchEvent(new Event('dial-ready'));\n</script>",
  );

  // Point components at the sprite this site actually serves. Cards that never
  // load the bundle (pure-CSS foundation pages) have no LDS to configure.
  if (out.includes('../assets/lds.js')) {
    out = out.replace(
      '<script src="../assets/lds.js"></script>',
      '<script src="../assets/lds.js"></script>\n<script>LDS.setIconSprite("../assets/icons.svg");</script>',
    );
  }
  return out;
}

const built = [];
for (const card of cards) {
  const from = card.absolute ? card.path : join(PROJECT, card.path);
  if (!existsSync(from)) { console.warn(`skip: ${card.path} not found`); continue; }
  const name = card.name || basename(card.path, '.html');
  const file = `${name.replace(/[^\w-]+/g, '-')}.html`;
  writeFileSync(join(CARDS_OUT, file), rewrite(readFileSync(from, 'utf8')));
  built.push({ ...card, name, file });
}

// ---- index ------------------------------------------------------------------
const GROUP_ORDER = ['Foundations', 'Buttons', 'Forms', 'Status', 'Navigation & Data', 'Cards', 'Overlays', 'States'];
const groups = [...new Set(built.map((c) => c.group))]
  .sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a), bi = GROUP_ORDER.indexOf(b);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b);
  });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const index = `<!DOCTYPE html>
<html class="mode-light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lew Design System</title>
<link rel="stylesheet" href="assets/styles.css">
<style>
  body{margin:0;padding:48px 32px 96px;background:var(--gray-50);color:var(--text);font-family:var(--th-body);}
  .page{max-width:1080px;margin:0 auto;}
  h1{font-family:var(--th-display);font-size:var(--text-title);line-height:var(--leading-title);
     letter-spacing:var(--tracking-title);font-weight:var(--weight-medium);margin:0 0 8px;}
  .lede{font-size:var(--text-body);line-height:var(--leading-body);color:var(--text-subdued);
        max-width:60ch;margin:0 0 12px;}
  .meta{font-family:var(--th-mono);font-size:var(--text-meta);color:var(--text-subdued);
        letter-spacing:var(--tracking-meta);margin:0 0 44px;}
  h2{font-family:var(--th-ui);font-size:var(--text-label);font-weight:var(--weight-medium);
     color:var(--text-subdued);border-bottom:1px solid var(--gray-200);
     padding-bottom:8px;margin:44px 0 18px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:14px;}
  a.card{display:block;padding:16px 18px;background:var(--surface-raised,#fff);
         border:1px solid var(--gray-200);border-radius:var(--radius);
         text-decoration:none;color:inherit;transition:border-color 120ms,transform 120ms;}
  a.card:hover{border-color:var(--text-accent);transform:translateY(-1px);}
  a.card:focus-visible{outline:2px solid var(--text-accent);outline-offset:2px;}
  .name{font-family:var(--th-ui);font-size:var(--text-control-lg);font-weight:var(--weight-medium);
        margin-bottom:4px;}
  .sub{font-family:var(--th-ui);font-size:var(--text-control-sm);color:var(--text-subdued);
       line-height:var(--leading-normal);}
</style></head>
<body><div class="page">
<h1>Lew Design System</h1>
<p class="lede">Every component and foundation, rendered by the real package — the
same <code>@lew/lds</code> build an app installs, over the Open Icons sprite.</p>
<p class="meta">${built.length} cards · ${groups.length} groups</p>
${groups.map((g) => `<h2>${esc(g)}</h2>
<div class="grid">
${built.filter((c) => c.group === g).map((c) => `  <a class="card" href="cards/${esc(c.file)}">
    <div class="name">${esc(c.name)}</div>
    <div class="sub">${esc(c.subtitle)}</div>
  </a>`).join('\n')}
</div>`).join('\n')}
</div></body></html>
`;
writeFileSync(join(SITE, 'index.html'), index);

console.log(`docs: ${built.length} cards in ${groups.length} groups → site/`);

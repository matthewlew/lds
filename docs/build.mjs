// Builds the static docs gallery.
//
// Every card lives in docs/cards/ and is plain HTML over the real package — no
// framework, no CDN, no compile step. They were converted out of the design
// export once (scripts/migrate-cards.mjs) and are hand-maintained from here.
//
// project/ still holds the original export. It is the historical reference and
// is deliberately NOT built: a gallery rendered by a binding the package no
// longer ships would be documenting the wrong system.
import esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SITE = join(ROOT, 'site');
const ASSETS = join(SITE, 'assets');
const CARDS_OUT = join(SITE, 'cards');
const CARDS_IN = join(HERE, 'cards');

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

await esbuild.build({
  entryPoints: [join(ROOT, 'packages/lds/src/index.js')],
  bundle: true,
  format: 'iife',
  globalName: 'LDS',
  outfile: join(ASSETS, 'lds.js'),
  logLevel: 'warning',
});

// ---- cards ------------------------------------------------------------------
// Metadata rides in a comment at the top of each card, so a card is one
// self-contained file rather than a file plus a row in a manifest.
const cards = readdirSync(CARDS_IN).filter((f) => f.endsWith('.html')).map((f) => {
  const src = readFileSync(join(CARDS_IN, f), 'utf8');
  const meta = src.match(/@dsCard\s+group="([^"]*)"\s+viewport="([^"]*)"\s+name="([^"]*)"\s+subtitle="([^"]*)"/);
  return {
    src,
    group: meta?.[1] ?? 'Components',
    viewport: meta?.[2] ?? '900x600',
    name: meta?.[3] ?? basename(f, '.html'),
    subtitle: meta?.[4] ?? '',
  };
});

const built = [];
for (const card of cards) {
  const file = `${card.name.replace(/[^\w-]+/g, '-')}.html`;
  writeFileSync(join(CARDS_OUT, file), card.src);
  built.push({ ...card, file });
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
same <code>@lew-ds/lds</code> build an app installs, over the Open Icons sprite.</p>
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

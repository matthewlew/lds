// Holds the server-component model to what the README promises.
//
//   1. Exactly the five stateful modules carry "use client", as the first
//      statement of the built file, where a bundler looks for it.
//   2. Every other module loads under React's `react-server` condition — the
//      React a server-components bundler gives server code, which has no
//      useState, useEffect or createContext. A module importing one of those
//      fails to link there, which is what would break it as a server component.
//   3. Nothing imports react-dom, and nothing wraps a component in a
//      `display: contents` element.
//   4. A browser bundle of the package entry carries no react-dom/server and
//      not the 180KB glyph table, which only `/icon-sprite` loads.
//   5. The tarball ships what `exports` points at: the built modules and the
//      types, every one of them, and not the JSX source.
import esbuild from 'esbuild';
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(PKG, 'dist');
const CLIENT = ['code-field.js', 'segmented-control.js', 'textarea.js', 'toast-provider.js', 'tooltip.js'];
// Re-export or compose client modules: a server-components bundler swaps those
// for references, but plain Node under react-server cannot, so they are only
// checked for what they import.
const COMPOSES_CLIENT = ['index.js', 'icon-button.js'];

const fails = [];
const modules = readdirSync(DIST).filter((f) => f.endsWith('.js'));

for (const file of modules) {
  const src = readFileSync(join(DIST, file), 'utf8');
  const directive = /^\s*["']use client["'];/.test(src);
  if (CLIENT.includes(file) && !directive) fails.push(`${file}: a stateful module without "use client" at the top`);
  if (!CLIENT.includes(file) && /["']use client["']/.test(src)) fails.push(`${file}: a stateless module marked "use client"`);
  if (/from\s+["']react-dom/.test(src)) fails.push(`${file}: imports react-dom`);
  if (/display\s*:\s*["']?contents/.test(src)) fails.push(`${file}: renders a display:contents wrapper`);
  if (!CLIENT.includes(file) && /\b(useState|useEffect|useLayoutEffect|useRef|useContext|createContext|useReducer)\b/.test(src)) {
    fails.push(`${file}: a stateless module uses a client-only React API`);
  }
}

const server = modules.filter((f) => !CLIENT.includes(f) && !COMPOSES_CLIENT.includes(f));
const loader = server.map((f) => `await import(${JSON.stringify(join(DIST, f))});`).join('\n');
const run = spawnSync(process.execPath, ['--conditions=react-server', '--input-type=module', '-e', loader], { encoding: 'utf8' });
if (run.status !== 0) fails.push(`a stateless module did not load under react-server:\n${run.stderr.trim().split('\n').slice(0, 6).join('\n')}`);

const { metafile } = await esbuild.build({
  entryPoints: [join(DIST, 'index.js')],
  bundle: true, write: false, metafile: true, platform: 'browser', format: 'esm',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.svg': 'file' }, outdir: join(PKG, '.bundle-check'), logLevel: 'silent',
});
const inputs = Object.keys(metafile.inputs);
if (inputs.some((p) => p.includes('react-dom'))) fails.push('the browser bundle of the package entry pulls in react-dom');
if (inputs.some((p) => p.endsWith('open-icons/src/symbols.js'))) fails.push('the browser bundle of the package entry carries the glyph table');

// What `npm publish` would send. dist/ is built by the test run already, so
// prepack is skipped rather than run twice.
const pack = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: PKG, encoding: 'utf8' });
if (pack.status !== 0) fails.push(`npm pack failed: ${pack.stderr.trim().slice(0, 300)}`);
else {
  const files = JSON.parse(pack.stdout)[0].files.map((f) => f.path);
  const exportsMap = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8')).exports;
  const targets = Object.values(exportsMap).flatMap((t) => typeof t === 'string' ? [t] : Object.values(t)).map((t) => t.replace(/^\.\//, ''));
  for (const t of targets) if (!files.includes(t)) fails.push(`the tarball lacks ${t}, which exports points at`);
  for (const m of modules) if (!files.includes(`dist/${m}`)) fails.push(`the tarball lacks dist/${m}`);
  if (files.some((f) => f.startsWith('src/') || f.startsWith('scripts/'))) fails.push('the tarball ships source or scripts');
}

if (fails.length) {
  for (const f of fails) console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log(`server-test: ${CLIENT.length} client modules marked, ${server.length} stateless modules load as server code, `
  + 'no react-dom, no display:contents wrapper, no glyph table in the client bundle, tarball complete');

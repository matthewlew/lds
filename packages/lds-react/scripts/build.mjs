// Compiles src/ to dist/: JSX to `react/jsx-runtime` calls, one file per
// source file, nothing bundled. Kept per file because a bundle would fold the
// five "use client" modules into the stateless ones — and the directive is what
// tells a server-components bundler where the client boundary is. esbuild
// keeps a module's directive prologue as written, and the test checks it.
import esbuild from 'esbuild';
import { readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(PKG, 'src');
const OUT = join(PKG, 'dist');

rmSync(OUT, { recursive: true, force: true });
await esbuild.build({
  entryPoints: readdirSync(SRC).filter((f) => f.endsWith('.js')).map((f) => join(SRC, f)),
  outdir: OUT,
  bundle: false,
  format: 'esm',
  platform: 'neutral',
  loader: { '.js': 'jsx' },
  jsx: 'automatic',
  target: 'es2022',
  logLevel: 'warning',
});
console.log(`build: ${readdirSync(OUT).length} modules → dist/`);

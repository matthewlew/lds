// Packs both packages, installs them into a throwaway app, and uses them the
// way a consumer would: bare specifiers only, nothing reaching back into this
// repo.
//
// Everything else in the suite runs against the source tree, where every file is
// present and every relative path happens to work. This is the only pass that
// sees what `npm publish` actually ships — a file missing from `files`, an
// `exports` subpath that does not resolve, or a URL inside the CSS that pointed
// somewhere real in the repo and somewhere else in the tarball.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const work = mkdtempSync(join(tmpdir(), 'lds-consumer-'));
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

try {
  const packed = join(work, 'pack');
  mkdirSync(packed, { recursive: true });
  run('npm', ['pack', '-w', '@lew/open-icons', '-w', '@lew/lds', '--pack-destination', packed], ROOT);

  const app = join(work, 'app');
  mkdirSync(app, { recursive: true });
  cpSync(join(ROOT, 'scripts/consumer-check.mjs'), join(app, 'check.mjs'), { recursive: true });
  writeFileSync(join(app, 'package.json'), JSON.stringify({
    name: 'lds-consumer-check', version: '1.0.0', type: 'module', private: true,
    dependencies: {
      '@lew/open-icons': `file:${join(packed, 'lew-open-icons-1.0.0.tgz')}`,
      '@lew/lds': `file:${join(packed, 'lew-lds-1.0.0.tgz')}`,
      // Nothing else. That the app installs with no framework at all is part of
      // what this is checking.
    },
  }, null, 2));

  run('npm', ['install', '--silent', '--no-audit', '--no-fund'], app);
  process.stdout.write(run('node', ['check.mjs'], app));
} catch (err) {
  process.stderr.write(err.stdout ?? '');
  process.stderr.write(err.stderr ?? String(err));
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}

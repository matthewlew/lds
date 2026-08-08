// dist/ is the plain-CSS system the root showcase paints from. packages/lds/css/
// is the same CSS, published to npm. They used to be maintained as two separate
// copies and drifted — dist/ kept an old --grey-* spelling and slightly different
// palette values after packages/lds/css/ was retuned to --gray-*. Copying on every
// build is what keeps that from happening again; CI's "generated files are up to
// date" check catches it if dist/ is ever hand-edited instead.
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, 'packages/lds/css');
const DIST = join(ROOT, 'dist');

for (const file of ['lds.css', 'apca-palette.css']) {
  cpSync(join(SRC, file), join(DIST, file));
}
for (const file of ['palette.css', 'product.css', 'roadtrip.css']) {
  cpSync(join(SRC, 'themes', file), join(DIST, 'themes', file));
}

console.log('sync-dist-css: dist/ CSS matches packages/lds/css/');

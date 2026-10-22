// Refuses to publish with a dependency floor below what was tested.
//
// lds-react is built and tested against the @lew-ds packages in this
// workspace. If its declared range admits an older published version, a
// consumer can resolve one that lacks what it imports (COMPONENT_ICONS,
// `@lew-ds/open-icons/sprite`…) and break at render. So the lowest version
// each range allows must be at least the workspace's own version.
//
// Run by `prepublishOnly`, which npm runs before publishing; release-please
// bumping @lew-ds/lds without raising this range therefore stops the
// lds-react publish rather than shipping it.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE = { '@lew-ds/lds': '../lds', '@lew-ds/open-icons': '../open-icons' };

const parse = (v) => v.split('.').map(Number);
const below = (a, b) => {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i];
  return false;
};
/** The lowest version a `^x.y.z`, `~x.y.z`, `>=x.y.z` or exact range admits. */
export const floor = (range) => {
  const m = /^(?:\^|~|>=)?\s*(\d+\.\d+\.\d+)$/.exec(range.trim());
  if (!m) throw new Error(`dependency-floor: cannot read range "${range}"`);
  return m[1];
};

export function check(pkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8')), versions) {
  const problems = [];
  for (const [name, dir] of Object.entries(WORKSPACE)) {
    const range = pkg.dependencies?.[name];
    if (!range) continue;
    const tested = versions?.[name] ?? JSON.parse(readFileSync(join(PKG, dir, 'package.json'), 'utf8')).version;
    if (below(floor(range), tested)) problems.push(`${name} is "${range}", which admits versions below ${tested}, the one tested here`);
  }
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = check();
  if (problems.length) {
    for (const p of problems) console.error(`dependency-floor: ${p}`);
    console.error('dependency-floor: raise the range in packages/lds-react/package.json before publishing');
    process.exit(1);
  }
  console.log('dependency-floor: every @lew-ds dependency floor is at least the version tested');
}

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
//
// `--fix` raises each such range to `^<version tested>` instead. The release
// workflow runs it on release-please's PR, so the ranges move with the
// versions release-please gives the packages and the guard never has to stop
// anything; the guard stays as the backstop.
import { readFileSync, writeFileSync } from 'node:fs';
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

const readPkg = () => JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'));
const testedVersion = (name, versions) =>
  versions?.[name] ?? JSON.parse(readFileSync(join(PKG, WORKSPACE[name], 'package.json'), 'utf8')).version;

/** Each @lew-ds dependency whose range admits a version below the one tested. */
function stale(pkg, versions) {
  return Object.keys(WORKSPACE)
    .filter((name) => pkg.dependencies?.[name])
    .map((name) => ({ name, range: pkg.dependencies[name], tested: testedVersion(name, versions) }))
    .filter(({ range, tested }) => below(floor(range), tested));
}

export function check(pkg = readPkg(), versions) {
  return stale(pkg, versions).map(({ name, range, tested }) =>
    `${name} is "${range}", which admits versions below ${tested}, the one tested here`);
}

/** `pkg` with each stale range raised to `^<tested>`, and what changed. */
export function fix(pkg = readPkg(), versions) {
  const changes = stale(pkg, versions).map(({ name, range, tested }) => ({ name, from: range, to: `^${tested}` }));
  const dependencies = { ...pkg.dependencies };
  for (const { name, to } of changes) dependencies[name] = to;
  return { pkg: { ...pkg, dependencies }, changes };
}

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--fix')) {
  const { pkg, changes } = fix();
  if (changes.length) writeFileSync(join(PKG, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  for (const c of changes) console.log(`dependency-floor: ${c.name} ${c.from} → ${c.to}`);
  if (!changes.length) console.log('dependency-floor: nothing to raise');
} else if (import.meta.url === `file://${process.argv[1]}`) {
  const problems = check();
  if (problems.length) {
    for (const p of problems) console.error(`dependency-floor: ${p}`);
    console.error('dependency-floor: raise the range in packages/lds-react/package.json before publishing');
    process.exit(1);
  }
  console.log('dependency-floor: every @lew-ds dependency floor is at least the version tested');
}

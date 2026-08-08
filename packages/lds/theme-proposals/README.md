# Theme proposals

Themes for a specific external product, kept for reference and for the
gallery's Themes card — **not published as part of `@lew-ds/lds`.** They are
outside `packages/lds/css/`, which is the npm package's `files` allowlist, and
`packages/lds/package.json` has no `exports` entry pointing here.

`@lds` ships components and a token contract — `--c-*`, `--gray-*`,
`--surface-*`, `--th-*`, and the radii/shadow/density knobs components read.
A specific product's theme is that product's own concern, authored against
the contract in the product's own repo, not baked into LDS as a built-in
preset. `themes/palette.css` and `themes/product.css` (in `packages/lds/css/`)
are the exception: general-purpose reference themes, not tied to one product,
meant to be installed.

## roadtrip.css

Read from `wwchen/roadtrip`'s shipped `web/design-system/tokens.css`, checked
against it by `scripts/theme-source-test.mjs`. `roadtrip.tokens.lock.json` is
the fallback that script verifies against when that repo isn't checked out.

If Roadtrip ends up owning this theme in its own repo, this file's job is
done and it can be deleted here.

## The dark-mode rule, if you're authoring one of these

A theme supplies **one** ramp (`--gray-*`, `--c-*`) — either a single
dark-native ramp with no `.mode-dark` override (what `roadtrip.css` does), or
a light ramp that core's `.mode-dark` derives dark surfaces from via `var()`.
Never both: a theme that redeclares its own `--gray-*`/`--c-*` under
`.mode-dark` gets inverted twice — once by the theme's own override, once by
core's `.mode-dark` block deriving `--surface-*`/`--text-*`/etc. from
whatever ramp is cascaded at that point. See the comment above `.mode-dark{`
in `packages/lds/css/lds.css`.

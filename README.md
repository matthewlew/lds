# Lew Design System

A monorepo holding the design system, the icon set it draws from, and the
gallery that documents both.

```
index.html            the showcase — the source of truth for what the system looks like
dist/                 the plain CSS the showcase paints from — synced from packages/lds/css/, not edited directly
packages/open-icons   @lew-ds/open-icons — 174-symbol SVG sprite, no LDS dependency
packages/lds          @lew-ds/lds — components as plain HTML + the one-token CSS architecture
docs/                 the gallery cards and build, the decision record, and the philosophy notes
project/              the original Claude Design export — the historical reference
legacy/               superseded material kept for reference
chats/                the design conversations that produced it
```

## One CSS tree

`dist/` used to be a hand-maintained copy of `packages/lds/css/` and drifted:
it kept an old `--grey-*` spelling and slightly different palette values after
the real source (`project/`, and downstream `packages/lds/css/`) was retuned
to `--gray-*`. `gray` is correct — it's what `project/lds.css` and the
`.hue-gray` class name have always used; `grey` was the typo.

`npm run build` now runs `scripts/sync-dist-css.mjs`, which copies
`packages/lds/css/{lds.css,apca-palette.css,themes/*.css}` into `dist/` on
every build. `dist/` is a build output, not a second source — CI's
"generated files are up to date" check catches it if it's ever hand-edited.

This is also what let `matthewlew.github.io` drop its vendored snapshot and
consume the published `@lew-ds/lds` package directly instead.

## Quick start

```bash
npm install
npm run build     # regenerate the sprite + adherence config, then build the docs site
npm test          # markup, asset, type, consumer and browser tests
open site/index.html
```

## The two packages

**[`@lew-ds/open-icons`](packages/open-icons)** ships the sprite and nothing else.
It has no dependency on LDS, so an app can use the icons without taking on the
design system — `<svg><use href="/icons.svg#search"/></svg>` needs no CSS, no
components and no JavaScript.

**[`@lew-ds/lds`](packages/lds)** is the design system: 28 components over a
one-token CSS cascade, two shipped themes × light/dark, plus a token contract
themes outside this repo can build against. Components emit class names and
carry no styles, so a theme repaints the system without any component knowing a
theme exists.

A component is a function returning a string of HTML. There is no framework, no
peer dependency and no build step — the package installs into an app that has
nothing else. The five components that hold state (CodeField, SegmentedControl,
Textarea, Toast, Tooltip) ship a controller alongside their template, shaped
`mountX(container, config) → { update, dispose }`.

It began as React components, which is where the markup came from and how it was
verified. That binding was removed once its output had been frozen — see
[Dropping React](#dropping-react).

## Where this came from

`project/` is a Claude Design export: HTML/CSS/JS prototypes, the conversations
in `chats/`, and a manifest tying them together. It is kept as the pixel
reference and is not built or published. The packages are the implementation of
those prototypes.

Turning the export into packages meant four substantive changes beyond moving
files:

**The icon sprite was broken.** `icons.svg` shipped 54 icons with the `${u}`
mask-id placeholder unsubstituted, collapsing every mask in the set onto five
literal ids. Each `mask="url(#k${u})"` then resolved to the first match in the
document, so 30 different filled glyphs rendered with `add-circle-fill`'s mask —
`warning-fill` and `close-circle-fill` among them, which are exactly the glyphs
Banner and Inline use for warning and error. The sprite is now generated from
`icons.json` with per-symbol ids, and `npm test` fails on a placeholder, a
duplicate id or a dangling reference. All 174 symbols are otherwise byte-identical
to the export.

**Components assumed a global framework and a relative sprite path.** They now
resolve icons through `@lew-ds/open-icons`, with `setIconSprite` for apps serving the
file from elsewhere.

**The docs ran on a CDN.** Cards loaded React, ReactDOM and Babel from unpkg with
pinned integrity hashes, and Babel was compiling markup that contains no JSX at
all. The gallery is now plain HTML over the real package bundle, served locally.

**Two cards had never rendered.** `Avatar.html` and `Button.html` each had one
missing closing paren and threw a syntax error on load. Fixed in place; the
browser test would now catch a recurrence.

## Dropping React

React was the original binding, and for a while it was also the only thing
verifying the replacement. Deleting it first would have left markup that merely
looked right with nothing able to say otherwise.

So the output was frozen before the implementation was removed:

- **`packages/lds/markup-contract.json`** — the exact HTML all 28 components emit
  across 103 prop combinations, generated from the React implementation and
  committed. When the templates were finished, regenerating it from *them*
  produced a byte-identical file. That is the evidence that this was a change of
  binding and not a change of markup.
- **`docs/card-contract.json`** — what each of the 32 gallery cards renders,
  captured from a real browser. 28 of 32 came out byte-identical; the four that
  moved are listed in the commit that moved them.

Two bugs surfaced that had been invisible under React, because React special-cased
them in ways a passthrough does not: `<select>` has no `value` attribute (the
selected `<option>` carries it) and `<textarea>`'s value is its text content.
Both had been rendering controls that looked correct and read back empty.

The card contract also caught a trap in its own making. Rebuilding the old docs
pipeline in the working tree *appeared* to work and produced 32 empty roots — the
old cards bundle `src/index.js`, which had already been rewritten. The React
baseline is captured from a git worktree at the previous commit instead.

## Tests

`npm test` runs eleven passes:

| pass | what it proves |
| --- | --- |
| `open-icons` | no `${u}` placeholder, no duplicate ids, no dangling `url(#…)` |
| `api-test` | every documented export exists; the sprite resolves and `setIconSprite` is honoured at render time; slots escape and `raw()` does not; `h()` composes |
| `css-test` | every icon name and CSS class the components reference exists; every `var()` without a fallback is defined; Banner, Inline and Toast share one status map |
| `theme-source` | every derived value in the roadtrip theme still agrees with the upstream token it says it came from |
| `markup-contract` | all 103 frozen component cases still emit exactly the same HTML |
| `typecheck` | the published `.d.ts` surface compiles against real usage |
| `consumer-test` | both packages pack, install into a throwaway app with **no other dependencies**, and work through bare specifiers |
| `site-test` | all 33 built pages load in headless Chromium with no console errors, no failed requests, and no `<use>` pointing at a missing symbol |
| `card-contract` | every gallery card renders the DOM it is frozen at |
| `card-interaction` | every rewritten demo still responds to a real click — the contract only sees the first paint |
| `dom-test` | the five controllers actually behave — focus walking, selection, queue eviction, dismissal, disposal |

`css-test` deliberately does **not** check whether a custom property is defined
at `:root` versus under a class. The conditional ones — `.hue-*` retints, the
status→colour map, the per-variant roles on `.lds-btn--*` — are conditional by
design, and hoisting them would apply every hue and status unconditionally. That
was settled during the design conversations and is not re-litigated here.

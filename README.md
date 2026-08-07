# Lew Design System

A monorepo holding the design system, the icon set it draws from, and the
gallery that documents both.

```
index.html            the showcase — the source of truth for what the system looks like
dist/                 the plain CSS the showcase paints from
packages/open-icons   @lew/open-icons — 174-symbol SVG sprite, no LDS dependency
packages/lds          @lew/lds — React components + the one-token CSS architecture
docs/                 the gallery build, the decision record, and the philosophy notes
project/              the original Claude Design export — the pixel reference
legacy/               superseded material kept for reference
chats/                the design conversations that produced it
```

## Two CSS trees, and why

`dist/` and `packages/lds/css/` are **different lineages, not different
versions.** The two `lds.css` files differ by ~1,800 lines.

`dist/` is the plain-CSS system the showcase and the portfolio were built
against. `packages/lds/css/` is the React package's CSS, which is larger and
newer and very nearly a superset — the measured gaps are three tokens
(`--grey-50`, `--grey-400`, `--grey-800`) and one class (`lds-tag--info`).

Closing those four gaps is what would let the two collapse into one, and would
also let `matthewlew.github.io` drop its vendored snapshot and consume the
package directly. Until then, treat a swap between them as a breaking change
that fails silently rather than loudly.

## Quick start

```bash
npm install
npm run build     # regenerate the sprite + adherence config, then build the docs site
npm test          # render, asset, type and browser tests
open site/index.html
```

## The two packages

**[`@lew/open-icons`](packages/open-icons)** ships the sprite and nothing else.
It has no dependency on LDS, so an app can use the icons without taking on the
design system — `<svg><use href="/icons.svg#search"/></svg>` needs no CSS, no
components and no JavaScript.

**[`@lew/lds`](packages/lds)** is the design system: 28 React components over a
one-token CSS cascade, four themes × light/dark. Components emit class names and
carry no styles, so a theme repaints the system without any component knowing a
theme exists. They are plain ESM using `React.createElement` — no JSX, so no
build step, and they load in Node, in bundlers and under SSR unchanged.

## Where this came from

`project/` is a Claude Design export: HTML/CSS/JS prototypes, the conversations
in `chats/`, and a manifest tying them together. It is kept as the pixel
reference and is not built or published. The packages are the implementation of
those prototypes; the docs gallery renders the original cards against the *real*
built package, so the two can be compared directly.

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

**Components assumed a global React and a relative sprite path.** They now import
React properly and resolve icons through `@lew/open-icons`, with `setIconSprite`
for apps serving the file from elsewhere.

**The docs ran on a CDN.** Cards loaded React, ReactDOM and Babel from unpkg with
pinned integrity hashes, and Babel was compiling markup that contains no JSX at
all. The gallery now builds against local React and the real package bundle. Card
bodies are otherwise untouched.

**Two cards had never rendered.** `Avatar.html` and `Button.html` each had one
missing closing paren and threw a syntax error on load. Fixed in place; the
browser test would now catch a recurrence.

## Tests

`npm test` runs four passes:

| pass | what it proves |
| --- | --- |
| `open-icons` | no `${u}` placeholder, no duplicate ids, no dangling `url(#…)` |
| `render-test` | every export renders through `react-dom/server`; the sprite resolves and `setIconSprite` is honoured at render time |
| `css-test` | every icon name and CSS class the components reference exists; every `var()` without a fallback is defined; Banner, Inline and Toast share one status map |
| `typecheck` | the published `.d.ts` surface compiles against real usage |
| `site-test` | all 33 built pages load in headless Chromium with no console errors, no failed requests, and no `<use>` pointing at a missing symbol |

`css-test` deliberately does **not** check whether a custom property is defined
at `:root` versus under a class. The conditional ones — `.hue-*` retints, the
status→colour map, the per-variant roles on `.lds-btn--*` — are conditional by
design, and hoisting them would apply every hue and status unconditionally. That
was settled during the design conversations and is not re-litigated here.

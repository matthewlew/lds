# @lew-ds/open-icons

174 symbols on a 24px grid with a live area of 20×20 and a stroke of 2, from the
[Open Icons](https://github.com/matthewlew/open-icons) set (MIT).

**This package has no dependency on LDS or on any design system.** Drop in
`icons.svg` and reference symbols directly — no CSS, no components, no
JavaScript:

```html
<svg width="20" height="20"><use href="/icons.svg#search" /></svg>
```

Apps already using LDS can use its `Icon` component instead, which is a thin
wrapper over exactly this.

## Install

```bash
npm install @lew-ds/open-icons
```

## Using it

The sprite is the product. The JS surface exists only so a bundler can resolve
the asset URL and so icon names can be checked at build time.

```js
import { spriteUrl, useHref, hasIcon, ICON_NAMES } from '@lew-ds/open-icons';

useHref('chevron-right');        // → "/assets/icons-a1b2c3.svg#chevron-right"
hasIcon('definitely-not-real');  // → false
ICON_NAMES.length;               // → 174
```

To copy the sprite into your own static directory instead, import the file
path directly:

```js
import sprite from '@lew-ds/open-icons/icons.svg';
```

`icons.json` (`{grid, stroke, icons: {name: innerMarkup}}`) is there for anything
that renders markup at runtime rather than referencing a sprite. `names.json` is
just the names, for a manifest or a lint rule.

## Naming

Names are kebab-case and match upstream — `chevron-right`, `check-circle`,
`more-horizontal`. Many have a `-fill` counterpart.

## The `${u}` placeholder, and why the sprite is generated

54 of the 174 icons carry a mask: a mark that crosses a wall needs a moat cut out
of that wall, and a moat is a mask. A mask needs an id, and `icons.json` leaves
that id as a `${u}` placeholder for the consumer to make unique.

In a sprite the substitution is **per symbol**, not per rendered instance. A
symbol is declared once and `<use>` clones it, and `url(#…)` inside the clone
resolves against the original document — so one unique id per symbol is both
necessary and sufficient, and every `<use>` of `warning-fill` correctly points at
the same mask element.

Getting this wrong is not subtle. A sprite that ships the placeholder literally
collapses 54 masks onto four ids (`k${u}` ×30, `m${u}` ×16, `t${u}` ×8, `b${u}`
×2, plus `cp${u}`), and every reference then resolves to the first match in the
document — so 30 different filled glyphs all render with `add-circle-fill`'s
mask, `warning-fill` and `close-circle-fill` among them.

That is why `icons.svg` is generated and not hand-edited:

```bash
npm run build     # regenerate icons.svg + names.json + src/names.js from icons.json
npm test          # assert: no placeholders, no duplicate ids, no dangling url(#…)
```

`npm test` fails the build on any of the three, so the defect cannot come back.

## Masked glyphs need the sprite in the page

Chromium does not apply a mask to content
`<use>` clones from an external file, so `<use href="/icons.svg#warning-fill">`
draws nothing there. Masked glyphs render only when the sprite is in the page —
`@lew-ds/lds` ships `inlineIconSprite` / `loadIconSprite` for that.

### Only the glyphs you draw

The whole sprite is about 180KB. An app that draws twenty glyphs can inline a
sprite of just those, about 15KB, built from their names:

```js
import { buildSprite } from '@lew-ds/open-icons/sprite';

const sprite = buildSprite(['search', 'close', 'warning-fill']);
// '<svg xmlns=… id="open-icons-sprite" aria-hidden="true" … style="position:fixed;…">
//    <defs><symbol id="search" …>…</symbol>…</defs></svg>'
```

Put the string in the page — server-rendered into the document, or through
`@lew-ds/lds`'s `inlineIconSprite(sprite)` — and reference glyphs in-document,
`<use href="#search"/>`. The symbols are the ones `icons.svg` holds, with the
same ids and the `${u}` mask ids already made unique, so a glyph draws the same
from either. The sprite is fixed and clipped out of view rather than
`display:none`, which disables masks too, and carries the id `inlineIconSprite`
uses, so a page that already has it is not given a second.

`buildSprite` throws on a name the set does not have, rather than leaving a
blank square to be noticed later. `spriteSymbols(names)` returns the
`<symbol>` elements alone, for an app writing its own `<svg>` around them.

With `@lew-ds/lds`, add the glyphs its components draw on their own (a
dismiss button's close, a row's chevron, the status icons):

```js
import { COMPONENT_ICONS } from '@lew-ds/lds';
buildSprite([...COMPONENT_ICONS, ...APP_ICONS]);
```

The helper is a subpath of its own, `@lew-ds/open-icons/sprite`, so the glyph
table it draws from is loaded only by the code that builds a sprite — typically
on the server — and never by everything that imports `spriteUrl`.

## The stroke is not a CSS knob

The geometry is weight-aware: every clearance in the set is a ratio of the
stroke, not a constant, so a different weight is a different drawing rather than
the same paths at a different `stroke-width`. Re-export the set for another
weight; do not restyle it downstream.

Concretely: **never apply a rule that sets `stroke-width` across a whole icon.**
The mask strokes are 5–6 units wide on purpose, and overriding them to the
nominal weight closes every moat in the set.

## Licence

MIT, as upstream.

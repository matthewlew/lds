# design-sync NOTES — @lew/lds-react → Claude Design "LDS (Lew Design System)"

## 2026-08-07 — retargeted from `@lew/lds` to `@lew/lds-react`

`@lew/lds` was rewritten to be framework-free (no React — `(props) =>
htmlString` templates + `mountX()` controllers) in a prior PR. This skill
requires React (both `_ds_bundle.js` and previews render via React), so the
sync broke until a new sibling package, `@lew/lds-react`, was built:
thin React wrappers over the same vanilla templates/controllers, same prop
shapes where possible. `cfg.pkg` / `cfg.tokensPkg` now point at it.

**`cssEntry`/`tokensGlob` still need real content inside `packages/lds-react`
itself** — design-sync bounds those two fields to `PKG_DIR` as a hard
security rule (`package-build.mjs`: "a path anywhere under workspaceRoot
would let a malicious dep's config exfiltrate project-root files"), and
`@lew/lds-react` ships no CSS of its own by design (it depends on
`@lew/lds`'s). `.design-sync/prepare-css.sh` copies `packages/lds/css` →
`packages/lds-react/css` for exactly this — gitignored, regenerated, **run
it before every build/resync on this pkg** or `cssEntry`/`tokensGlob` won't
resolve. It does not touch `@lew/lds-react`'s committed package.json/exports
— this is sync-only plumbing.

**Caught live during this retarget, twice — both `prepare-css.sh` (before
build) and `extra-assets.sh` (after build) are REQUIRED on every single
`package-build.mjs` **and** `resync.mjs` invocation, no exceptions.**
`resync.mjs` rebuilds `ds-bundle/` from scratch exactly like
`package-build.mjs` does, so a run like `node .ds-sync/resync.mjs …` with no
trailing `&& sh .design-sync/extra-assets.sh` silently ships every icon
missing — not a crash, not a validate error: `<use href="#person">`
references a `<symbol>` that was never inlined (the sprite fetch 404s on a
missing `icons.svg`), so the icon element is present in the DOM, fully
correctly styled and sized, and paints nothing. `[RENDER_THIN]` does NOT
catch this reliably (icons sit inside otherwise-content-ful cards). The only
way it surfaced here was screenshotting one specific cell (Avatar's
`Fallback` story, icon-only) and noticing the circle was empty — every OTHER
icon-bearing preview in this same broken capture pass silently had the same
defect and would have graded fine on a careless look. **Always chain it**:
`node .ds-sync/resync.mjs … && sh .design-sync/extra-assets.sh` — never run
build/resync and grading as separate steps with a gap between them.

Below this point, most of the CSS/token/sprite/theme findings still apply
verbatim (same actual stylesheet, same sprite, same fonts — just reached via
the copy above instead of directly). Sections describing `packages/lds`'s
former **React** source layout (component file locations, `forwardRef`
absence) are marked stale where superseded — `@lew/lds-react`'s wrappers DO
forward refs, so the `Tooltip` ref-workaround below may no longer be needed;
verify against a fresh build rather than assuming either way.

## Repo shape

`matthewlew/lds` is an npm workspace monorepo: `packages/lds` (the design
system — React components, `type: module`, no build step, `main` points
straight at `src/index.js`) and `packages/open-icons` (sprite-based icon set,
also source-direct). `npm ci` at the repo root installs everything; npm
workspaces symlink `node_modules/@lew/lds` → `packages/lds` and
`node_modules/@lew/open-icons` → `packages/open-icons`.

- `cfg.entry` for the converter: `./packages/lds/src/index.js` (no dist —
  ships source directly; `--node-modules ./node_modules`, repo root, since
  workspace hoisting puts `react`/`react-dom` there).
- 29 components discovered from `.d.ts` exports (incl. `ToastProvider` and a
  couple of hook-adjacent exports the heuristic kept).
- No per-component docs anywhere in the repo (`docs: 0/29 matched`) — every
  `.prompt.md` is synthesized from `.d.ts` + JSDoc + the authored preview.

## CSS — cssEntry must be `css/lds.css`, NOT the package's own `./css` export

`packages/lds/css/styles.css` (the `"./css"` package.json export, i.e. the
"correct" consumer entry point) is a 2-line `@import url(...)` shim over
`apca-palette.css` + `lds.css`. The converter's cssEntry handling copies the
file **verbatim** — it does not resolve local `@import`s — so pointing
`cssEntry` at the shim produces `[CSS_IMPORT_MISSING]` / `[CSS_PLACEHOLDER]`.

Fix: `cfg.cssEntry = "css/lds.css"` directly (the real, self-contained
component stylesheet — no local `@import`s at all). `lds.css` declares its
own `:root` primitives (`--gray-*`, `--c-*` "Core" ramp) — **this is a real,
fully-functional 4th theme** (Core), separate from the three `.theme-*`
class-based skins (see below). No `cfg.provider` or theme class wrapper is
needed for components to render correctly — Core is the default and requires
nothing extra.

`apca-palette.css` (raw hue ramps `--red-*`/`--orange-*`/etc., ~9 `var()`
refs inside `lds.css`, used only by an optional decorative "hue" utility
class) is wired in as tokens via the **self-referential tokensPkg trick**:
`cfg.tokensPkg: "@lew/lds"`, `cfg.tokensGlob: "css/apca-palette.css"` — this
works because npm workspaces symlink `node_modules/@lew/lds` back to
`packages/lds`, so the package can be its own "tokens package". `tokensGlob`
only accepts one pattern (no array), so this couldn't also pull in
`css/themes/*.css` in the same field — see extra-assets below for those.

`[FONT_MISSING]` on `"Cascadia Mono"`, `"Roboto Mono"`, `"Iowan Old Style"` —
**triaged as legitimate, not a defect.** These are fallback names inside
`--th-display`/`--th-mono` font stacks (`lds.css` lines ~227, ~231), after
the real shipped fonts (Coconat, MartianMono). Nothing to fix.

## Icon sprite — MUST be inlined, not referenced by URL

`@lew/open-icons`'s `spriteUrl` resolves via `import.meta.url`, which is
meaningless once esbuild folds everything into the `_ds_bundle.js` IIFE (it
resolves against the bundle's own location, not the package's) — the default
sprite href is wrong wherever this bundle is hosted.

Pointing `setIconSprite()` at a plain relative URL (e.g.
`"../../../icons.svg"`, which IS the right path — see below) is **still not
enough**: `<use href="external.svg#id">` is a cross-document SVG fetch, and
Chromium silently renders nothing (no error, box paints, color resolves,
`getBBox()` comes back empty) unless the host serves that file with an SVG
content-type. This repo's local static test server
(`.ds-sync/storybook/http-serve.mjs`) serves `.svg` as
`application/octet-stream` — confirmed via curl (`-I` shows
`Content-Type: application/octet-stream`) — and there's no way to verify
claude.ai/design's static hosting does any better, so don't rely on it.

**Fix (already applied)**: `.design-sync/previews/_sprite.ts` — a shared
non-component helper (converter ignores it; only `<Name>.tsx` files matching
a real export are treated as previews) that `fetch()`s `../../../icons.svg`
as **plain text** (MIME-agnostic) and inlines its `<symbol>` defs into the
current document once, then every `<Icon>`/icon-slot component is pointed at
`setIconSprite('')` so hrefs become same-document `"#id"` fragments — no
cross-document fetch, no MIME dependency, works regardless of how the real
host serves static files.

**Every authored preview that renders an `<Icon>` or a component with an
icon prop (Button iconStart/iconEnd, Chip, Menu, Tag, EmptyState, Row,
SegmentedControl, Tabs, CodeField's copy icon, …) must start with**:
```ts
import { ensureInlineSprite } from './_sprite';
ensureInlineSprite();
setIconSprite('');
```
The `"../../../icons.svg"` path inside `_sprite.ts` is depth-correct for
every component (all 29 land under `components/general/<Name>/`, so the
depth is uniform — if a future re-sync ever assigns real `docsMap`
categories and components move to `components/<OtherGroup>/<Name>/`, the
depth is still 3 either way, so this stays correct).

**Known render warn**: icon-only previews (`Icon` itself, and any card whose
content is pure icon glyphs with no text) trip `[RENDER_THIN]`/no-text
heuristics even when they render correctly — confirmed by direct screenshot,
same pattern documented in the sibling `open-icons` repo's sync. Not a defect.

## Extra assets outside the converter's canonical output

The converter's contract has no slot for: the icon sprite file itself, the
three alternate theme CSS files (`.theme-palette`/`.theme-product`/
`.theme-roadtrip` skins layered on top of Core), or the icon name/id JSON.
These are real repo build output the remote project already has (as
`icons.svg`, `themes/*.css`, `icons/{icons,names}.json`) and the user
explicitly asked to sync theme updates, so **`.design-sync/extra-assets.sh`**
copies them into `ds-bundle/` after every `package-build.mjs` /
`resync.mjs` run (both wipe and regenerate `ds-bundle/` from scratch, so this
is not optional — re-run it every time):
- `packages/open-icons/icons.svg` → `ds-bundle/icons.svg`
- `packages/open-icons/{icons,names}.json` → `ds-bundle/icons/`
- `packages/lds/css/themes/{palette,product,roadtrip}.css` → `ds-bundle/themes/`

These three theme CSS files are **not** wired into the bundle's default
render (Core is default, per above) — they're shipped as reference assets
only, matching how the previously-uploaded project already had them (a
`themes/` folder, separate from the component bundle). If Claude Design ever
needs live theme-switching in previews, that's new scope beyond what this
skill's converter contract supports today — flagged, not solved.

## No `forwardRef` anywhere in `packages/lds/src/components`

None of the 29 components forward refs. A preview that needs to force a
component into an interactive state that only exists via a real DOM event
(hover/focus-driven open state — `Tooltip`, and anything similar) **cannot**
attach a `ref` to the React component and call `.focus()` on it — the ref
silently doesn't reach the DOM node. Workaround used for `Tooltip.tsx`: render
a native element (`<button>`) carrying the exact LDS class names the real
component would emit (e.g. `"lds-btn lds-btn--secondary lds-btn--icon"`) —
real DS class vocabulary, just ref-able — and call `.focus()` on THAT in a
`useEffect`. This is composition (real classes, real CSS), not a
reimplementation of the component's logic.

**Also**: DOM focus is exclusive — if a single preview cell mounts two such
focus-on-mount triggers, the second one's effect steals focus from the first
and the first's open state closes again. Put each forced-open interactive
state in its **own** export/cell, never two in the same tree.

## `position:fixed` previews need a `minHeight` Frame wrapper

The generated card wrapper (`preview-rebuild.mjs`'s emitted `<Name>.html`,
not anything under `.design-sync/`) mounts every story inside a
`transform:translateZ(0)` box (`.ds-cell` for grid mode, `.ds-single` for the
`?story=` single-story mode `package-capture.mjs` screenshots). Per ordinary
CSS, a transformed ancestor becomes the **containing block** for
`position:fixed` descendants — so a `fixed` toast/backdrop no longer
positions against the real viewport, and since it doesn't contribute to that
ancestor's normal-flow height either, the box collapses to the height of
whatever non-fixed content the story renders. Symptom: a toast clipped almost
entirely off-screen (`ToastProvider`), or a modal backdrop that only covers a
thin band instead of full-bleed (`Modal`) — both confirmed via the raw
per-story PNGs in `_screenshots/review/raw/`.

**Fix (composition-only, applied to `ToastProvider.tsx`)**: wrap every
export in a small `Frame` giving the story's own root a real `minHeight`
(620px), so the normal-flow content forces the containing block tall enough
that `fixed` children land inside the capture:
```tsx
function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: 620, position: 'relative' }}>{children}</div>;
}
```
Padding on a *sibling* of the fixed element does nothing (fixed positioning
ignores sibling layout) — reserve clearance by shifting normal-flow content
itself instead (see `ToastProvider.tsx`'s `TopStart` export).

**`Modal` does NOT need this** — checked and initially misapplied.
`.lds-modal-scrim` (`lds.css` ~L1349) has no `position` set at all; it's a
static flex container that centers its child and hugs content height by
design (a real app is expected to place it inside its own fixed-position
modal root). A `Frame`/`minHeight` wrapper on `Modal.tsx` only adds dead
whitespace below the card with no positioning benefit — reverted. Only
components that genuinely use `position:fixed` in their own CSS (confirmed:
`Toast`/`ToastProvider`; check before assuming) need the `Frame` treatment.

**Any future preview using a genuinely `position:fixed` component** (a new
overlay, or a future affordance that escalates to fixed) should expect to
need this same treatment — but verify the component's own CSS sets
`position:fixed` first; don't apply this by pattern-matching on "looks like
an overlay." This is a workaround for the current card-template pipeline,
not a permanent fact — if a future design-sync version changes how
`.ds-single`/`.ds-cell` establishes its containing block, this may become
unnecessary.

## Known upstream bugs in `packages/lds` (found while authoring previews, not fixed here)

Design-sync ships what's real — these were left as accurate representations
rather than papered over in a preview, and are NOT fixed in this sync (no
component source was edited). Both are one-line CSS/JS fixes if the user
wants to take them:

1. **`.lds-chip__remove` (Chip's remove-icon button) has no native-button
   reset** — no `border`/`background`/`padding`/`appearance:none` in
   `lds.css` (~L1254), so it stays a native `<button>` and Chromium's UA
   chrome shows through: a `2px outset` border becomes a visible ring
   (`border-radius:50%`), and the UA `1px 6px` padding shrinks the 16px box's
   content area to 0 — the close icon renders at computed `width:0`, i.e.
   **every removable chip's ✕ is invisible**. Confirmed via a computed-style
   probe. `.lds-banner__dismiss`/`.lds-modal__close` (`lds.css` ~L2164)
   already reset this correctly — the fix is the same lines on
   `.lds-chip__remove`:
   ```css
   .lds-chip__remove{ border:none;background:transparent;padding:0;appearance:none;-webkit-appearance:none; }
   ```
   `Chip.tsx`'s preview deliberately omits a `RemovableTags`/`onRemove` story
   because of this — showcasing it would ship a visibly-broken card. Add it
   back once the CSS is fixed.

2. **`Menu`'s `danger` item never actually turns red** —
   `.lds-menu__item--danger{color:var(--c-700)}` (`lds.css` ~L2906) reads the
   *ambient* `--c-*` ramp (Core/brand hue, green in this repo), not a
   destructive-red one. `Button`'s `hue="red"` prop remaps via a `hue-red`
   class; `Menu.js`'s `danger` flag adds neither that class nor a
   `[data-status="error"]` ancestor, so a "danger" menu item renders in the
   ordinary brand accent color. Not blocking (still a real, styled token —
   just the wrong hue), so `Menu.tsx`'s `danger` cells are graded `good`
   as-is. Fix: either have `Menu.js` add `hue-red` when `danger` is set
   (mirroring `Button`), or point `.lds-menu__item--danger` at
   `var(--red-700)` directly.

## Known render warns

Triaged as legitimate — `package-validate.mjs` re-prints these on every
re-sync; confirm via `_screenshots/review/<group>__<Name>.png` before
assuming an unchanged warn list is still benign.

- **`[RENDER_THIN]` on CodeField, Icon, Menu, Modal, Select, Table** — every
  wrapped component in `@lew/lds-react` renders inside a `display: contents`
  div (see `packages/lds-react/src/runtime.jsx`'s `makeTemplateComponent`
  doc comment) so it participates in the parent's layout directly rather
  than sitting in an extra box. A `display: contents` element's own
  `getBoundingClientRect()` is always zero by spec, even though its content
  paints normally — whatever measurement the render check uses trips on
  that for these six specifically. Confirmed via direct screenshot
  (`_screenshots/general__<Name>.png` and the per-story
  `_screenshots/review/` sheets) that all six render their full content
  correctly. `Icon` additionally trips the separate, pre-existing
  icon-only/no-text heuristic documented above — two different warns,
  same "not a defect" outcome.

## Re-sync risks

- If `packages/lds/css/lds.css`'s local var-based token architecture changes
  (new semantic role vars, restructured `:root` layer), the tokensGlob /
  cssEntry choice above may need revisiting — re-check `[TOKENS_MISSING]`
  count on re-sync (currently 3 missing, below the warn threshold).
- `_sprite.ts` hardcodes the `../../../icons.svg` depth assumption (3 levels
  — `components/<group>/<Name>/<Name>.html`). If a future config change adds
  real `docsMap` categories, the depth is unchanged (group is still one
  segment), but if the converter's layout contract itself ever changes
  depth, this needs updating.
- `extra-assets.sh` is a manual, uncommitted-to-the-converter step — it must
  be re-run after every build/resync or `ds-bundle/` silently ships without
  icons/themes. Not enforced by any gate in `package-validate.mjs`.
- The three alternate themes are shipped as inert reference CSS, not
  exercised by any preview. A future re-sync that wants themed preview
  variants would need per-preview `className="theme-X mode-Y"` wrappers
  authored deliberately (previews control their own composition — this is
  possible, just not done here to keep scope to what was asked).

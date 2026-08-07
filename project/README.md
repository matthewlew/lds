# Lew Design System (LDS) — design export

> **This directory is the original Claude Design export, kept as the pixel
> reference.** The implementation lives in `../packages/lds` and
> `../packages/open-icons`; the gallery in `../docs` renders these cards against
> that real package. Nothing here is built or published.
>
> Two files have been changed since the export: `components/Avatar/Avatar.html`
> and `components/Button/Button.html` were each missing one closing paren and
> threw a syntax error on load, so neither card had ever rendered.



Plain CSS, no build step. One-Token architecture: primitives → semantic emphasis roles → components → themes. Imported from https://matthewlew.github.io/design-system/ (core/portfolio theme, light mode).

`styles.css` imports `apca-palette.css` (hue ramps) and `lds.css` (primitives, semantics, components). Fonts (Coconat, Ronzino, Martian Mono) self-host from `fonts/`. Icons come from `icons.svg` — the Open Icons set (174 symbols, 24px grid, stroke 2), generated from `icons/icons.json`.

## Components
- Button — primary / secondary / tertiary, emphasis + hue overrides, sizes, prefix/suffix icons, subtitle, icon-only, FAB, href (renders as a link)
- Link — inline / quiet / standalone text links
- ButtonGroup — action row: orientation, hug vs fill, split cancel, mobile stacking
- Card — kicker, title, body, divider, meta, actions
- TextField — label, help, error, required, inset prefix/suffix icons, joined dial-code prefix
- CodeField — one-time code (2FA), one box per digit, paste-aware
- Textarea — label, help, error, required
- Select — label, help, error, options
- Checkbox — label, checked, disabled
- Radio — grouped, checked, disabled
- Toggle — labelled switch
- Tag — status/metadata pill (hue × emphasis, interactive/inactive, sm size — replaces the old Badge)
- Chip — interactive filter/dropdown pill, selectable
- Banner — status message field (info/success/warning/caution/error)
- Inline — inline status message (icon + text, no container)
- Tabs — vertical tab list
- Table — data table with sortable header support
- Row — list row (leading/content/trailing slots)
- Menu — dropdown menu with items, separators, danger items
- Modal — dialog / sheet / side sheet
- Skeleton — loading placeholder (text/title/circle)
- EmptyState — icon + title + body + actions
- Avatar — initials with a name-derived hue, image, or person-icon fallback; six sizes, ring, stack
- Icon — sprite icon wrapper
## Theming
Core ships the portfolio brand (oat neutrals, green accent ramp) with no theme file needed. Emphasis classes (`emph-plain/subtle/soft/strong/stark`) resolve seven color roles per object; `hue-*` repoints the brand ramp to a specific color for status use.

Four themes ship in `themes/`, each a class applied to `<html>` alongside `mode-dark`/`mode-light`:
- **Core / Portfolio** — no class needed, ships at `:root`. Light mode.
- **Palette** (`themes/palette.css`, class `theme-palette`) — chromeless, dark-native, media-forward. No brand hue by design; cool neutral ramp doubles as `--gray-*`. Use with `mode-dark` as the resting state.
- **Product** (`themes/product.css`, class `theme-product`) — neutral, dense, dependable; reference theme for dashboards/internal tools. Blue accent, true neutral gray ramp, denser type scale.
- **Roadtrip** (`themes/roadtrip.css`, class `theme-roadtrip`) — dark-native, dense, one interactive blue. Ships its own 5-step surface-elevation stack (`--surface-page/sunken/base/raised/overlay`) since a dark UI needs more planes than a lightness ramp gives.

Every theme only overrides tokens (`--c-*`, `--gray-*`, `--th-*`, `--text-*`, radii, shadows, density, icon size) — components never branch on theme name. See `Themes.html` for a live switcher across all four themes × light/dark.

## Icons
`icons.svg` is a standalone SVG sprite generated from the **Open Icons** set (`matthewlew/open-icons`, MIT) — 174 symbols on a 24px grid with a live area of 20×20 and a stroke of 2. The stroke is part of the drawing, not a CSS knob: scale the icon, don't restyle its weight. Names are kebab-case and match upstream (`chevron-right`, `check-circle`, `more-horizontal`); many have a `-fill` counterpart. Source data lives in `icons/icons.json` + `icons/names.json` — regenerate the sprite from those rather than hand-editing it.

The sprite has no dependency on the rest of LDS: any app can drop in `icons.svg` and reference symbols with `<svg><use href="icons.svg#search"/></svg>`, no CSS or components required. The `Icon` component (`components/Icon`) is a thin wrapper for apps already using LDS.

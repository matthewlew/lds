# @lew/lds

The Lew Design System as React components over a one-token CSS architecture:
primitives → semantic emphasis roles → components → themes.

Components carry no styles of their own. They emit LDS class names and the paint
comes entirely from the stylesheet — which is what lets a theme repaint the whole
system without a single component branching on the theme's name.

## Install

```bash
npm install @lew/lds react
```

```jsx
import { Button, TextField, ToastProvider, useToast } from '@lew/lds';
import '@lew/lds/css';

<ToastProvider>
  <TextField label="Work email" required />
  <Button variant="primary" iconStart="check">Save changes</Button>
</ToastProvider>
```

The components are plain ESM using `React.createElement` — there is no JSX to
compile and no build step in this package. Node, bundlers and SSR all load them
directly.

## Icons

Icons come from [`@lew/open-icons`](../open-icons), a separate package with no
dependency on LDS, so an app can consume the sprite without consuming the design
system. It is installed as a dependency here and every component resolves
against it by default.

If you serve the sprite from your own static directory or a CDN, say so once at
startup:

```js
import { setIconSprite } from '@lew/lds';
setIconSprite('/static/icons.svg');
```

Any component also takes a one-off `iconHref`. Icon props take either a sprite
name (`iconStart="check"`) or a node.

## Components

| | |
| --- | --- |
| **Buttons** | Button (variants, sizes, prefix/suffix icons, subtitle, icon-only, FAB, `href`), ButtonGroup (orientation, hug vs fill, split cancel, conversion bar, mobile stacking), Link (inline / quiet / standalone) |
| **Forms** | TextField (inset icons, joined dial-code prefix), Textarea, Select, Checkbox, Radio, Toggle, CodeField (one-time code), SegmentedControl |
| **Status** | Banner, Inline, Toast, Tag, Chip |
| **Navigation & data** | Nav (brand bar / app bar), Tabs, Table, Row, Menu |
| **Overlays** | Modal (dialog / bottom sheet / side sheet, stacked flows), Tooltip |
| **States** | Skeleton, EmptyState |
| **Foundations** | Avatar, Icon, Card |

Three things share one status vocabulary — Banner, Inline and Toast all read the
same `status → icon` map, so an inline error and a toast error cannot disagree
about what red means. The blocking statuses (`warning`, `caution`, `error`) take
the filled glyph, because at 16–20px a filled triangle reads as a stop signal
where an outline reads as another outline in a form full of them.

### Toast vs Banner

A banner is a field the page contains and it stays until the condition changes.
A toast is chrome the system raises and it leaves on its own. If dismissing it
can lose information the user needs, it wanted to be a banner. Errors raised as
toasts never auto-dismiss.

### Tooltip

A tooltip is what an icon-only button says when you ask it its name — it opens on
hover **and** on focus, because hover alone means a keyboard user never gets the
label. It must not hold anything interactive: a hover bubble cannot be reached by
a pointer without a hover bridge, so a control inside one is unreachable for some
users. That case wants a Menu or a Modal.

## Theming

Core ships the portfolio brand (oat neutrals, green accent ramp) at `:root` with
no theme file needed. Emphasis classes (`emph-plain/subtle/soft/strong/stark`)
resolve the object colour roles; `hue-*` repoints the brand ramp for status use.

Four themes ship, each a class on `<html>` alongside `mode-light` / `mode-dark`:

| theme | class | import |
| --- | --- | --- |
| Core / Portfolio | *(none)* | ships at `:root` |
| Palette | `theme-palette` | `@lew/lds/css/themes/palette` |
| Product | `theme-product` | `@lew/lds/css/themes/product` |
| Roadtrip | `theme-roadtrip` | `@lew/lds/css/themes/roadtrip` |

Themes only override tokens — `--c-*`, `--gray-*`, `--th-*`, `--text-*`, radii,
shadows, density, icon size. Components never branch on a theme name.

## Fonts

Coconat (display), Ronzino (UI and body) and Martian Mono (meta) self-host from
`@lew/lds/fonts/`. `@lew/lds/css` references them relatively, so serving the
package's `css/` and `fonts/` directories side by side is enough.

## Adherence lint

`adherence.oxlintrc.json` is generated from this package's own source — component
names from the source tree, prop names and their allowed values from the `.d.ts`,
and the token registry from the CSS. It warns on raw hex colours, raw pixel
values, fonts outside the three the system ships, unknown props, out-of-range
prop values, and imports that reach past the package entry point into component
internals.

```bash
node scripts/build-adherence.mjs   # from the repo root, after changing components or CSS
```

## Tests

From the repo root:

```bash
npm test
```

Renders every component through `react-dom/server`, checks that every icon name
and CSS class the components reference actually exists, typechecks the published
`.d.ts` surface against real usage, and loads all 32 docs cards in a headless
browser asserting no console errors, no failed requests, and no `<use>` pointing
at a symbol the sprite does not define.

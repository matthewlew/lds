## LDS (Lew Design System) conventions

**No provider, no wrapper required.** Components carry no styles of their
own — they emit LDS class names and the paint comes from the stylesheet.
Once `_ds_bundle.js` + `styles.css` are on the page, everything renders
already styled: `lds.css`'s own `:root` is a real, complete theme (Core) —
you don't need to apply a theme class or wrap anything to get color, type,
or spacing. Just use the components.

**Styling idiom — modifier classes and CSS custom-property roles, not
utility classes.** Every component's DOM carries a base class
(`lds-btn`, `lds-card`, `lds-tag`, …) plus BEM-style modifiers
(`lds-btn--primary`, `lds-btn--icon`). Two cross-cutting modifier
vocabularies recolor almost anything:
- **Emphasis** — `emph-plain` / `emph-subtle` / `emph-soft` / `emph-strong`
  / `emph-stark` / `emph-media`. Most components expose this as an
  `emphasis` prop (see each `.d.ts`).
- **Hue** — `hue-red` / `hue-orange` / `hue-yellow` / `hue-green` /
  `hue-cyan` / `hue-blue` / `hue-violet` / `hue-pink` / `hue-gray`.
  Repoints the brand ramp (e.g. `Button`'s `hue="red"` for destructive
  actions). Components that don't expose a `hue` prop directly (e.g. `Menu`
  item `danger` flags) do NOT automatically apply one — check the
  component's actual class output before assuming a status color applies.

Underneath both, seven **object-color roles** resolve as CSS custom
properties per surface: `--background`, `--text`, `--text-accent`,
`--text-subdued`, `--icon`, `--border`, `--border-subdued`. Reach for these
directly (`style={{ color: 'var(--text-subdued)' }}`) only when composing
raw layout between components — never invent a new token name.

**Icons are sprite-based**, not inline SVG components: `<Icon name="search"
size={20} />`, or pass a sprite name string to icon props (`Button`'s
`iconStart="add"`). Valid names are Open Icons' sprite ids (kebab-case,
e.g. `chevron-right`, `warning-fill`, `person`) — never invent a name; the
full list ships at `icons/names.json` in this project.

**Where the truth lives.** Each component's
`components/<group>/<Name>/<Name>.prompt.md` has its exact prop signature.
`styles.css` and its `@import` closure (notably `tokens/apca-palette.css`
and the bundled component CSS) are the real, complete stylesheet — read it
before inventing a class name. `guidelines/` carries the DS's own decision
records and philosophy notes (grid rules, hue system, why one-token exists)
— useful for judging whether a composition is "on-system." Three additional
brand skins ship as reference CSS at `themes/{palette,product,roadtrip}.css`
(class-on-`<html>` skins layered over Core) — informational only; they are
not wired into how components render by default.

**Build snippet** (mixing components, emphasis, hue, and an icon):

```jsx
const { Card, Button, Tag, Icon } = window.LDS;

function PlanCard() {
  return (
    <Card
      kicker="Team plan"
      title="12 seats"
      body="Billed monthly, cancel anytime."
      actions={
        <>
          <Button variant="secondary">Manage</Button>
          <Button variant="primary" iconEnd="chevron-right">Upgrade</Button>
        </>
      }
    />
  );
}

function DangerTag() {
  return (
    <Tag hue="red" dot>
      <Icon name="warning-fill" size={14} /> Past due
    </Tag>
  );
}
```

# @lew-ds/lds-react

React components for the Lew Design System. Each one outputs exactly the markup
of its [`@lew-ds/lds`](../lds) template, written as JSX: it renders on a server
with every slot in the HTML, hydrates with no wrapper around it, and takes React
nodes in its slots.

```bash
npm install @lew-ds/lds-react @lew-ds/lds react
```

```jsx
import { Banner, Button, IconButton, Table } from '@lew-ds/lds-react';
import { IconSprite } from '@lew-ds/lds-react/icon-sprite';
import '@lew-ds/lds/css';

export default function Layout({ children }) {
  return (
    <html className="mode-light">
      <body>
        <IconSprite icons={['search', 'edit', 'add']} />
        {children}
      </body>
    </html>
  );
}

export function Statement({ rows }) {
  return (
    <>
      <Banner status="warning" title="Payment due" actions={<Button href="/pay">Pay now</Button>}>
        Your statement closes on the 30th.
      </Banner>
      <Table aria-label="Charges" columns={[{ key: 'what', label: 'Charge' }, { key: 'amount', label: 'Amount', className: 'num' }]} rows={rows} />
      <IconButton label="Edit statement" icon="edit" />
    </>
  );
}
```

The package carries no styles: import `@lew-ds/lds`'s CSS once. It needs React 19.

## The server-component model

| | Components |
| --- | --- |
| **Server components** (no `"use client"`) | Avatar, Banner, Button, ButtonGroup, Card, Checkbox, Chip, EmptyState, Icon, IconButton, IconSprite, Inline, Link, Menu, Modal, Nav, Radio, Row, Select, Skeleton, Table, Tabs, Tag, TextField, Toast, Toggle |
| **Client components** (`"use client"`) | SegmentedControl, Tooltip, Textarea, CodeField, ToastProvider / `useToast` |

The stateless components use no state and no effects, only `useId` where a label
or help line needs an id to point at, which React allows on the server. Under a
React Server Components bundler they render as server components, with their
markup in the first response. They also work unchanged inside a client component, where their
handlers (`onClick`, `onDismiss`, `onRemove`, `onClose`, `onChange`…) bind as
usual. A server component cannot pass a function, so from one you leave the
handlers off: the markup is identical either way.

Only the five components that hold state are client components. Their first
paint is still server-rendered, and it is still their template's markup.

Form controls take the templates' spelling, `value` and `checked`. Without an
`onChange`, which a server component cannot pass, those are the control's
initial state (React's `defaultValue` / `defaultChecked`). With an `onChange`,
the control is controlled. The HTML is the same.

Nothing in the package imports `react-dom`, so no part of `react-dom/server`
reaches a client bundle. No component wraps its markup in an element of its
own. A `className` lands on the template's root, and so do a ref and any other
attribute, wherever the template passes extra props through. Menu, Modal, Tabs
and EmptyState don't.

### Icons

Every icon is a `<use href="#name">` into a sprite inlined in the page. The
masked glyphs (`warning-fill`, `close-circle-fill`, `copy`…) draw nothing
through an external sprite file, and a sprite URL worked out on a server is not
one the browser can load. So render `<IconSprite>` once, near the root:

```jsx
import { IconSprite } from '@lew-ds/lds-react/icon-sprite';

<IconSprite icons={['search', 'edit']} />   // COMPONENT_ICONS + yours, a few KB
<IconSprite all />                           // all 174 glyphs, about 180KB
```

It always includes `COMPONENT_ICONS`, the glyphs components draw on their own:
a dismiss button's close, a row's chevron, the status icons. It throws on a name
the set does not have. It sits on its own subpath, so the glyph table loads where
the sprite renders and never in a client bundle that only imports a Button. The
sprite's symbol ids (`search`, `edit`…) join the document's id space, so don't
give page elements the same ids.

To point one component at a sprite file anyway, pass `iconHref`.

## Composition

Slots take React nodes: `title`, `actions`, `children`, `icon`, a column's
`label`, a row's cells. Icon props such as `iconStart`, `iconEnd` and `icon` on
EmptyState also take a sprite name. Larger pieces are built out of the
components, with no markup of their own. **`IconButton`** is the pattern:

```jsx
// Tooltip around an icon-only Button, named once: `label` is both the
// button's aria-label and the tooltip, so they cannot disagree, and the
// tooltip does not describe the button with the same words again. It is
// `type="button"`, so a row action inside a <form> doesn't submit it.
<IconButton label="Edit card" icon="edit" onClick={edit} />
```

| Component | Composes with |
| --- | --- |
| Button | `href` renders an anchor with the same paint, keeping the link role. `as={RouterLink}` renders your router's link instead. Inside `<ButtonGroup>` for a set; inside `<Tooltip>` (or as `<IconButton>`) when icon-only |
| ButtonGroup | Buttons as children; `detail` and `detailNote` make it a conversion bar |
| Link | `as={RouterLink}`; `variant="standalone"` with `iconEnd` (a name, a node, or `null`) |
| Row | `href` and `as={RouterLink}` for a whole-row link; any node in `lead`, `trail`, `subtitle` |
| Table | `columns` + `rows` (nodes in any cell), or compose `<thead>`/`<tbody>` yourself for a `<th scope="row">`, attributes or a key on a row, a struck-through row |
| Banner, Toast, Card, EmptyState, Modal, Nav | Buttons in `actions`, any node in the text slots |
| Tag, Chip, Inline | `<Icon>` in `icon` |
| TextField | `prefix` takes a whole control (a `<Select>` of dial codes) joined into the box; `endAction` is an inset icon button |
| Select | `options` of strings, `{ value, label }` or `{ label, options }` groups; a label is text, as an `<option>` has to be |
| Tooltip | wraps its trigger; put nothing interactive in `label` |
| Toast | raised through `useToast()` under one `<ToastProvider>`; render `<Toast>` directly only for a static example |

## Parity with `@lew-ds/lds`

`npm test` renders each component with `renderToStaticMarkup` and compares it,
byte for byte, with its template's string for the same props. That covers all of
the markup contract `@lew-ds/lds` is frozen against, plus React-only cases:
nodes in slots, `as`, composed tables, IconButton and IconSprite. A template
change that isn't mirrored here fails the build, so this binding cannot drift
from `@lew-ds/lds`. Two differences belong to React, not to the markup, and are
set aside: attribute names are compared case-insensitively, as HTML reads them,
and the image preload `<link>` React puts before an `<img>` is dropped.

The other test passes:

- `server-test`: `"use client"` on exactly the five; every stateless module loads
  under React's `react-server` condition; no `react-dom` import; no
  `display: contents` wrapper; no glyph table in a client bundle; the tarball
  ships what `exports` names.
- `browser-test`: server-renders a page, hydrates it in Chromium with no
  mismatch warnings, and drives it. Handlers fire on stateless components, the
  selection moves with clicks and arrow keys, the count follows the text, focus
  walks the code boxes, toasts queue and dismiss, and a tooltip opens outside its
  clipping panel.
- `tsc`: the types against real usage, including props that must be rejected.

Publishing runs one more check, `prepublishOnly`. The lowest version each
`@lew-ds/*` dependency range allows must be at least the version in this
workspace, the one the tests ran against. So a release of `@lew-ds/lds` that
moves past the range stops the lds-react publish until the range is raised,
instead of shipping a range that admits a version without what lds-react
imports.

## Migrating from 1.x

1.x rendered each template to an HTML string, inserted it with
`dangerouslySetInnerHTML`, and filled React slot content in afterwards through
portals. Slot content was missing from server-rendered HTML, every component sat
inside a `display: contents` div, and `react-dom/server` reached client bundles.
2.0 is plain JSX, and for the same props it renders the same markup.

| 1.x | 2.0 |
| --- | --- |
| `react` and `react-dom` ^18 or ^19 as peers | `react` ^19 only; `react-dom` is not used by the package |
| Shipped `.jsx` source | Ships compiled ES modules (`dist/`) and types (`types/`) |
| Every component inside a `display: contents` div | No wrapper; a `className`, ref or attribute lands on the template's root |
| Icons resolved through `setIconSprite`, defaulting to the package's `icons.svg` URL | Icons resolve in-document; render `<IconSprite>` once. `setIconSprite`, `getIconSprite` and `resolveSprite` are no longer exported here. Use `iconHref` to point one component elsewhere |
| `toSlot(node)` to flatten a node for a slot it didn't reach | Gone: every slot, list items included, takes nodes (except an `<option>`'s label, which HTML only lets be text) |
| `Table` only from `columns`/`rows` | Also takes composed `<thead>`/`<tbody>` children |
| `Tooltip` `placement` `left \| right` | `start \| end`; `left` and `right` are still read as those |
| `Button emphasis="strong"` painted primary's tint | Paints the emphasis; `variant` defaults to `primary` only without one |
| `Button` with `href` had `role="button"` | Keeps the link role |

`onChange` on SegmentedControl and CodeField still receives the value, not an
event. Everything else takes React's usual event.

Since the components are no longer client-only, a component that passes them
handlers must be a client component itself (`"use client"`), as with any
interactive element.

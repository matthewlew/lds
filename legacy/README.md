# Legacy

Material migrated out of `matthewlew.github.io` when the portfolio was
restructured into a project hub and LDS moved into this repo.

It is kept because it is the origin of the ideas in `packages/`, not because it
is live. Nothing here is built, tested, or published by this repo's `npm run
build` / `npm test`.

## `plain-css/`

The previous LDS: **plain CSS, no build step, no framework binding** — the
implementation the portfolio site itself was built against.

```
dist/               the shipped CSS (lds.css, apca-palette.css, themes/, fonts/, icons.svg)
tokens.json         the token source
patch.py            the build/patch script
showcase.html       the v6 component showcase — the actively maintained one
showcase-a11y.html  a stale fork of the showcase, frozen before the v6 wave;
                    kept only for its "Accessibility & Inclusion" section, which
                    was never folded into the main showcase
tools.html          "System Ops" — drift analyzer, dogfooding loop, telemetry,
                    and audits of how Google/Salesforce/Shopify run their systems
README.md           the original package docs
```

**This is a different lineage from `packages/lds`.** The two `lds.css` files
differ by roughly 1,800 lines; the React package's CSS is the larger and newer
of the two, and is very nearly a superset of this one. The known gaps, measured
at migration time, are three tokens (`--grey-50`, `--grey-400`, `--grey-800`)
and one class (`lds-tag--info`) that exist here and not there.

Those gaps matter because the portfolio still paints from a pinned snapshot of
this CSS. Closing them in `packages/lds` is what unblocks the portfolio from
consuming the real package instead of a vendored copy.

## `one-token/`

The One Token concept site — a landing page plus an interactive playground for
the idea that an app should declare *what a colour means* rather than what it
looks like, so brand, dark mode, and mixed themes are one class swap rather
than a rewrite.

It was a standalone project on the portfolio. It is really a statement of the
design system's own philosophy, which is why it lives here now: it is the
clearest single artifact explaining what makes LDS different from a component
dump. Worth promoting out of `legacy/` and into the docs gallery as a
differentiator page rather than leaving it filed as history.

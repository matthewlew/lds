# Decisions

The running record of why the Lew Design System is shaped the way it is —
migrated here from `matthewlew.github.io`, where LDS used to live alongside the
portfolio.

`decisions.md` is the record itself: ~2,750 lines covering the token model, the
One Token semantics, the APCA contrast floors, the brand ramps and the v6
component wave. `decisions.html` renders it in the browser; it fetches
`decisions.md` at runtime, so it has to be served over http — opening the file
directly will not work.

## The rule this record exists to serve

A change to LDS needs an entry here, **in the same commit**, when it:

- alters what a token means
- adds or removes a role, component, or theme
- reverses a prior call
- sets a constraint consumers must respect

Exempt: typos, rebuilds, new example pages, and additions that follow an
existing pattern without changing it.

The test for whether something is a decision at all: **name what it ruled out.**
If nothing was ruled out it is a fact about the system, and it belongs in a
README instead.

**Reversals matter most.** They are what stops a mistake being repeated. If you
are undoing an earlier decision, mark it `reversal` and amend the entry you are
overturning rather than deleting it — the record should show that the other way
was tried and why it did not hold.

## Checks

```bash
node docs/decisions/check-decisions.mjs        # structure; exits 1 on problems
node docs/decisions/check-decisions.mjs --fix  # regenerate the header split line
```

The grammar lives in `decisions-parser.mjs` and is shared by the validator and
by `decisions.html`. Change the grammar in one place only.

The validator checks **structure, never reasoning**. A green run means
well-formed, not well-reasoned.

> **Note on paths:** the validator and renderer were written when this
> directory sat at `docs/lew-design-system/` in the portfolio repo, with the
> validator at `scripts/check-decisions.mjs`. Both files moved here unchanged,
> so their relative path assumptions have not been re-verified against this
> layout. Fix them the first time you run one in anger.

## What this record documents

Note that `decisions.md` records the reasoning behind the **plain-CSS** LDS
(now in `legacy/plain-css/`), which is a different implementation lineage from
the React packages in `packages/`. The *reasoning* — semantic roles over raw
values, APCA over WCAG 2.x, themes as divergence from a brand core — carries
across both. The specific token names and file paths do not always.
